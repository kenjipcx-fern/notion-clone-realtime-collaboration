import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, Workspace, Page, Block, UserPresence } from '@/db/schema'

// Types for our global state
export interface AppState {
  // Authentication
  currentUser: User | null
  isAuthenticated: boolean
  
  // Current workspace and page context
  currentWorkspace: Workspace | null
  currentPage: Page | null
  
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Real-time collaboration state
  onlineUsers: UserPresence[]
  isConnected: boolean
  
  // Editor state
  isEditing: boolean
  selectedBlocks: string[]
  
  // Loading states
  isLoading: boolean
  loadingMessage?: string
}

export interface AppActions {
  // Authentication actions
  setCurrentUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  
  // Workspace actions
  setCurrentWorkspace: (workspace: Workspace | null) => void
  
  // Page actions
  setCurrentPage: (page: Page | null) => void
  
  // UI actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Real-time collaboration actions
  setOnlineUsers: (users: UserPresence[]) => void
  setConnectionStatus: (connected: boolean) => void
  
  // Editor actions
  setIsEditing: (editing: boolean) => void
  setSelectedBlocks: (blockIds: string[]) => void
  toggleBlockSelection: (blockId: string) => void
  clearSelection: () => void
  
  // Loading actions
  setLoading: (loading: boolean, message?: string) => void
}

// Create the store
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      currentWorkspace: null,
      currentPage: null,
      sidebarOpen: true,
      theme: 'light',
      onlineUsers: [],
      isConnected: false,
      isEditing: false,
      selectedBlocks: [],
      isLoading: false,
      loadingMessage: undefined,

      // Authentication actions
      setCurrentUser: (user) =>
        set(
          { currentUser: user, isAuthenticated: !!user },
          false,
          'setCurrentUser'
        ),

      login: (user) =>
        set(
          { currentUser: user, isAuthenticated: true },
          false,
          'login'
        ),

      logout: () =>
        set(
          {
            currentUser: null,
            isAuthenticated: false,
            currentWorkspace: null,
            currentPage: null,
          },
          false,
          'logout'
        ),

      // Workspace actions
      setCurrentWorkspace: (workspace) =>
        set({ currentWorkspace: workspace }, false, 'setCurrentWorkspace'),

      // Page actions
      setCurrentPage: (page) =>
        set({ currentPage: page }, false, 'setCurrentPage'),

      // UI actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }, false, 'setSidebarOpen'),

      setTheme: (theme) =>
        set({ theme }, false, 'setTheme'),

      // Real-time collaboration actions
      setOnlineUsers: (users) =>
        set({ onlineUsers: users }, false, 'setOnlineUsers'),

      setConnectionStatus: (connected) =>
        set({ isConnected: connected }, false, 'setConnectionStatus'),

      // Editor actions
      setIsEditing: (editing) =>
        set({ isEditing: editing }, false, 'setIsEditing'),

      setSelectedBlocks: (blockIds) =>
        set({ selectedBlocks: blockIds }, false, 'setSelectedBlocks'),

      toggleBlockSelection: (blockId) =>
        set((state) => {
          const isSelected = state.selectedBlocks.includes(blockId);
          const selectedBlocks = isSelected
            ? state.selectedBlocks.filter(id => id !== blockId)
            : [...state.selectedBlocks, blockId];
          return { selectedBlocks };
        }, false, 'toggleBlockSelection'),

      clearSelection: () =>
        set({ selectedBlocks: [] }, false, 'clearSelection'),

      // Loading actions
      setLoading: (loading, message) =>
        set({ isLoading: loading, loadingMessage: message }, false, 'setLoading'),
    }),
    {
      name: 'collab-platform-store',
      partialize: (state: any) => ({
        // Only persist certain parts of the state
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Selectors for commonly used state combinations
export const useAuth = () => {
  const { currentUser, isAuthenticated } = useAppStore();
  return { currentUser, isAuthenticated };
};

export const useCurrentContext = () => {
  const { currentWorkspace, currentPage } = useAppStore();
  return { currentWorkspace, currentPage };
};

export const useCollaboration = () => {
  const { onlineUsers, isConnected } = useAppStore();
  return { onlineUsers, isConnected };
};

export const useEditor = () => {
  const { isEditing, selectedBlocks, setIsEditing, setSelectedBlocks, toggleBlockSelection, clearSelection } = useAppStore();
  return {
    isEditing,
    selectedBlocks,
    setIsEditing,
    setSelectedBlocks,
    toggleBlockSelection,
    clearSelection,
  };
};
