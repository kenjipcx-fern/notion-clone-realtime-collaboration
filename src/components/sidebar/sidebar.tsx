'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  Plus, 
  Search, 
  Settings, 
  Users,
  FileText,
  Folder,
  ChevronRight,
  MoreHorizontal,
  Hash,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, getInitials, generateUserColor } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { useWorkspaces, useWorkspace } from '@/hooks/api'

interface SidebarProps {
  className?: string
}

interface WorkspaceData {
  id: string
  name: string
  icon: string
  slug: string
}

interface PageData {
  id: string
  title: string
  icon?: string
  parentId?: string
  children?: PageData[]
  isTemplate?: boolean
}

// Mock data - will be replaced with real data from API
const mockWorkspace: WorkspaceData = {
  id: '1',
  name: 'Acme Corp Engineering',
  icon: '🏢',
  slug: 'acme-corp-eng'
}

const mockPages: PageData[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: '🚀',
    children: [
      { id: '2', title: 'Onboarding Guide', icon: '👋' },
      { id: '3', title: 'Team Introduction' },
    ]
  },
  {
    id: '4',
    title: 'Projects',
    icon: '📋',
    children: [
      { id: '5', title: 'Q4 Roadmap', icon: '🗺️' },
      { id: '6', title: 'Sprint Planning' },
      { id: '7', title: 'Bug Reports', icon: '🐛' },
    ]
  },
  {
    id: '8',
    title: 'Documentation',
    icon: '📚',
    children: [
      { id: '9', title: 'API Reference' },
      { id: '10', title: 'Architecture Guide' },
    ]
  },
  {
    id: '11',
    title: 'Meeting Notes',
    icon: '📝',
  },
  {
    id: '12',
    title: 'Templates',
    icon: '🧩',
    isTemplate: true,
  }
]

const PageTreeItem = ({ page, level = 0 }: { page: PageData; level?: number }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const hasChildren = page.children && page.children.length > 0

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 rounded-md hover:bg-accent cursor-pointer",
          "transition-colors duration-200",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-accent-foreground/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        {!hasChildren && <div className="w-4" />}
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {page.icon ? (
            <span className="text-sm">{page.icon}</span>
          ) : (
            <Hash className="h-3 w-3 text-muted-foreground" />
          )}
          
          <span className="text-sm truncate">
            {page.title}
          </span>
          
          {page.isTemplate && (
            <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
              Template
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Open page
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              Add subpage
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Page settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {page.children?.map((child) => (
            <PageTreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ className }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, currentWorkspace, setCurrentWorkspace } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch workspaces from API
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces()
  const { data: workspaceData, isLoading: workspaceLoading } = useWorkspace(
    currentWorkspace?.id || (workspaces?.[0]?.workspace?.id)
  )
  
  // Set initial workspace if none selected
  useEffect(() => {
    if (!currentWorkspace && workspaces && Array.isArray(workspaces) && workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0].workspace)
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace])

  if (!sidebarOpen) {
    return null
  }

  // Show loading state
  if (workspacesLoading) {
    return (
      <aside className={cn("w-64 bg-background border-r flex flex-col h-screen", className)}>
        <div className="p-3 border-b">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded-md"></div>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded-md animate-pulse"></div>
          ))}
        </div>
      </aside>
    )
  }

  const currentWorkspaceDisplay = currentWorkspace || (workspaces && Array.isArray(workspaces) && workspaces.length > 0 ? workspaces[0].workspace : null)
  const pages = workspaceData?.pages || []

  return (
    <aside className={cn("w-64 bg-background border-r flex flex-col h-screen", className)}>
      {/* Workspace Header */}
      <div className="p-3 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto p-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentWorkspaceDisplay?.icon || '🏢'}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{currentWorkspaceDisplay?.name || 'Loading...'}</span>
                  <span className="text-xs text-muted-foreground">
                    {currentWorkspaceDisplay?.slug || ''}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces && Array.isArray(workspaces) && workspaces.length > 0 ? (
              workspaces.map(({ workspace, role }) => (
                <DropdownMenuItem 
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className={workspace.id === currentWorkspaceDisplay?.id ? 'bg-accent' : ''}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span>{workspace.icon}</span>
                    <span className="flex-1 truncate">{workspace.name}</span>
                    {role === 'owner' && (
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                        Owner
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>📁</span>
                  <span>No workspaces available</span>
                </div>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {/* Quick Actions */}
          <div className="py-2">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8">
              <Plus className="h-4 w-4" />
              New page
            </Button>
          </div>

          {/* Page Tree */}
          <div className="space-y-0.5">
            {workspaceLoading ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-muted/50 rounded-md animate-pulse ml-2"></div>
              ))
            ) : pages.length > 0 ? (
              pages.map((page: any) => (
                <PageTreeItem key={page.id} page={{
                  id: page.id,
                  title: page.title,
                  icon: page.icon || undefined,
                  parentId: page.parent_id || undefined,
                  isTemplate: page.is_template,
                  children: [] // TODO: Implement hierarchical loading
                }} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pages yet</p>
                <p className="text-xs">Create your first page to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile & Settings */}
      <div className="border-t p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b9bbb9f4?w=150" />
              <AvatarFallback 
                className="text-xs"
                style={{ backgroundColor: generateUserColor('alice') }}
              >
                {getInitials('Alice Cooper')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Alice Cooper</span>
              <span className="text-xs text-muted-foreground">alice.cooper@example.com</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Invite team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
