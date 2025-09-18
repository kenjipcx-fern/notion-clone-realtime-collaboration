/**
 * API Hooks for React Query integration
 * Provides type-safe data fetching with caching and optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/lib/api-client';
import type { Workspace, Page, Block, User } from '@/db/schema';

// Query Keys (for consistent caching)
export const QueryKeys = {
  workspaces: ['workspaces'] as const,
  workspace: (id: string) => ['workspace', id] as const,
  pages: (workspaceId?: string) => ['pages', workspaceId] as const,
  page: (id: string) => ['page', id] as const,
  blocks: (pageId: string) => ['blocks', pageId] as const,
  users: ['users'] as const,
  user: (id: string) => ['user', id] as const,
  dashboard: ['dashboard'] as const,
} as const;

// Types
export interface WorkspaceWithRole extends Workspace {
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface PageWithMetadata extends Page {
  workspace: {
    id: string;
    name: string;
    icon: string;
    slug: string;
  };
  block_count: number;
  child_pages_count: number;
}

export interface CreatePageData {
  title: string;
  workspace_id: string;
  parent_id?: string;
  icon?: string;
  template_id?: string;
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
  icon?: string;
  slug: string;
}

export interface DashboardData {
  stats: {
    totalPages: number;
    totalBlocks: number;
    totalWorkspaces: number;
    activeCollaborators: number;
    pagesThisWeek: number;
  };
  recentPages: {
    id: string;
    title: string;
    icon: string | null;
    lastEdited: Date;
    lastEditedBy: {
      id: string;
      name: string;
      avatar_url: string | null;
    };
    workspace: {
      id: string;
      name: string;
      icon: string | null;
    };
  }[];
  templates: {
    id: string;
    title: string;
    icon: string | null;
    description: string;
    uses: number;
    workspace: {
      name: string;
      icon: string | null;
    };
  }[];
}

// ===============================
// WORKSPACE HOOKS
// ===============================

/**
 * Fetch all workspaces for the current user
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: QueryKeys.workspaces,
    queryFn: async () => {
      const response = await apiClient.get<{ workspace: Workspace; role: string; joinedAt: string }[]>('/workspaces');
      return (response as any).data.data || response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch specific workspace with pages
 */
export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: QueryKeys.workspace(workspaceId),
    queryFn: async () => {
      const response = await apiClient.get<{
        workspace: Workspace;
        role: string;
        pages: Page[];
      }>(`/workspaces/${workspaceId}`);
      return (response as any).data.data || response.data;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Create new workspace
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkspaceData) => {
      const response = await apiClient.post<Workspace>('/workspaces', data);
      return (response as any).data.data || response.data;
    },
    onSuccess: (newWorkspace) => {
      // Invalidate and refetch workspaces
      queryClient.invalidateQueries({ queryKey: QueryKeys.workspaces });
      
      // Add to cache optimistically
      queryClient.setQueryData(QueryKeys.workspaces, (old: any) => {
        if (!old) return [{ workspace: newWorkspace, role: 'owner', joinedAt: new Date().toISOString() }];
        return [
          { workspace: newWorkspace, role: 'owner', joinedAt: new Date().toISOString() },
          ...old,
        ];
      });
    },
  });
}

// ===============================
// PAGE HOOKS
// ===============================

/**
 * Fetch recent pages (optionally filtered by workspace)
 */
export function usePages(workspaceId?: string, limit = 10, offset = 0) {
  return useQuery({
    queryKey: QueryKeys.pages(workspaceId),
    queryFn: async () => {
      const params: Record<string, string> = {
        limit: limit.toString(),
        offset: offset.toString(),
      };
      
      if (workspaceId) {
        params.workspace_id = workspaceId;
      }

      const response = await apiClient.get<PageWithMetadata[]>('/pages', params);
      return (response as any).data.data || response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Create new page
 */
export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePageData) => {
      const response = await apiClient.post<Page>('/pages', data);
      return (response as any).data.data || response.data;
    },
    onSuccess: (newPage, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.pages() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.pages(variables.workspace_id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.workspace(variables.workspace_id) });
      
      // Add to pages cache optimistically
      queryClient.setQueryData(QueryKeys.pages(variables.workspace_id), (old: PageWithMetadata[] | undefined) => {
        if (!old) return [];
        
        const pageWithMetadata: PageWithMetadata = {
          ...newPage,
          workspace: {
            id: variables.workspace_id,
            name: 'Loading...', // Will be updated when workspace query refetches
            icon: '📄',
            slug: '',
          },
          block_count: 1, // Initial empty block
          child_pages_count: 0,
        };
        
        return [pageWithMetadata, ...old];
      });
    },
  });
}

// ===============================
// BLOCK HOOKS
// ===============================

/**
 * Fetch blocks for a specific page
 */
export function useBlocks(pageId: string) {
  return useQuery({
    queryKey: QueryKeys.blocks(pageId),
    queryFn: async () => {
      const response = await apiClient.get<Block[]>(`/blocks?page_id=${pageId}`);
      return (response as any).data.data || response.data;
    },
    enabled: !!pageId,
    staleTime: 30 * 1000, // 30 seconds (blocks update frequently)
  });
}

/**
 * Create new block
 */
export function useCreateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      page_id: string; 
      type: string; 
      content: any; 
      sort_order: number;
      parent_block_id?: string;
    }) => {
      const response = await apiClient.post<Block>('/blocks', data);
      return (response as any).data.data || response.data;
    },
    onSuccess: (newBlock) => {
      // Add to blocks cache optimistically
      queryClient.setQueryData(QueryKeys.blocks(newBlock.page_id), (old: Block[] | undefined) => {
        if (!old) return [newBlock];
        
        // Insert in correct sort order
        const sortedBlocks = [...old, newBlock].sort((a, b) => a.sort_order - b.sort_order);
        return sortedBlocks;
      });
      
      // Invalidate page query to update block count
      queryClient.invalidateQueries({ queryKey: ['page', newBlock.page_id] });
    },
  });
}

/**
 * Update block content
 */
export function useUpdateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      id: string; 
      content?: any; 
      type?: string;
      properties?: any;
    }) => {
      const response = await apiClient.patch<Block>(`/blocks/${data.id}`, data);
      return (response as any).data.data || response.data;
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.blocks(variables.id) });
      
      // Snapshot previous value
      const previousBlocks = queryClient.getQueryData(QueryKeys.blocks(variables.id));
      
      // Optimistically update
      queryClient.setQueryData(QueryKeys.blocks(variables.id), (old: Block[] | undefined) => {
        if (!old) return [];
        
        return old.map(block => 
          block.id === variables.id 
            ? { 
                ...block, 
                ...variables, 
                updated_at: new Date() 
              }
            : block
        );
      });
      
      return { previousBlocks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBlocks) {
        queryClient.setQueryData(QueryKeys.blocks(variables.id), context.previousBlocks);
      }
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.blocks(data.page_id) });
      }
    },
  });
}

// ===============================
// SEARCH HOOKS
// ===============================

/**
 * Search across pages and blocks
 */
export function useSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const response = await apiClient.get<{
        pages: PageWithMetadata[];
        blocks: (Block & { page: { title: string; workspace: { name: string } } })[];
      }>('/search', { q: query });
      
      return (response as any).data.data || response.data;
    },
    enabled: enabled && query.length >= 2,
    staleTime: 10 * 1000, // 10 seconds
  });
}

// ===============================
// UTILITY HOOKS
// ===============================

/**
 * Prefetch workspace data for faster navigation
 */
export function usePrefetchWorkspace() {
  const queryClient = useQueryClient();

  return (workspaceId: string) => {
    queryClient.prefetchQuery({
      queryKey: QueryKeys.workspace(workspaceId),
      queryFn: async () => {
        const response = await apiClient.get(`/workspaces/${workspaceId}`);
        return (response as any).data.data || response.data;
      },
      staleTime: 2 * 60 * 1000,
    });
  };
}

/**
 * Get cached workspace data without triggering a request
 */
export function useWorkspaceCache(workspaceId: string) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(QueryKeys.workspace(workspaceId));
}

// ===============================
// DASHBOARD HOOKS
// ===============================

/**
 * Fetch dashboard data (stats, recent pages, templates)
 */
export function useDashboard() {
  return useQuery({
    queryKey: QueryKeys.dashboard,
    queryFn: async () => {
      const response = await apiClient.get<DashboardData>('/dashboard');
      return (response as any).data.data || response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default {
  useWorkspaces,
  useWorkspace,
  useCreateWorkspace,
  usePages,
  useCreatePage,
  useBlocks,
  useCreateBlock,
  useUpdateBlock,
  useSearch,
  usePrefetchWorkspace,
  useWorkspaceCache,
  useDashboard,
};
