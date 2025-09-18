'use client'

import { useState } from 'react'
import { 
  Search,
  Plus,
  Clock,
  Users,
  FileText,
  Zap,
  TrendingUp,
  Calendar,
  Star,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime, generateUserColor, getInitials } from '@/lib/utils'
import { useDashboard } from '@/hooks/api'

// Mock data - will be replaced with real API data
const mockRecentPages = [
  {
    id: '1',
    title: 'Q4 Product Roadmap',
    icon: '🗺️',
    lastEdited: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastEditedBy: {
      name: 'Alice Cooper',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9bbb9f4?w=150'
    }
  },
  {
    id: '2',
    title: 'Team Retrospective Notes',
    icon: '🔄',
    lastEdited: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    lastEditedBy: {
      name: 'Bob Builder',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
    }
  },
  {
    id: '3',
    title: 'API Documentation',
    icon: '📚',
    lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    lastEditedBy: {
      name: 'Charlie Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  },
  {
    id: '4',
    title: 'Bug Report Template',
    icon: '🐛',
    lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    lastEditedBy: {
      name: 'Diana Prince',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    }
  },
]

const mockTemplates = [
  {
    id: 't1',
    title: 'Project Kickoff',
    icon: '🚀',
    description: 'Get your project started with this comprehensive template',
    uses: 24
  },
  {
    id: 't2',
    title: 'Meeting Notes',
    icon: '📝',
    description: 'Standardized template for meeting documentation',
    uses: 18
  },
  {
    id: 't3',
    title: 'Feature Specification',
    icon: '🔧',
    description: 'Document feature requirements and specifications',
    uses: 12
  },
]

const mockStats = {
  totalPages: 204,
  totalBlocks: 974,
  activeCollaborators: 12,
  pagesThisWeek: 8
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: dashboardData, isLoading, error } = useDashboard()

  // Show loading state
  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Show error state
  if (error) {
    return <DashboardError />
  }

  const { stats, recentPages, templates } = dashboardData || {
    stats: { totalPages: 0, totalBlocks: 0, activeCollaborators: 0, pagesThisWeek: 0 },
    recentPages: [],
    templates: []
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-14 items-center px-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <h1 className="font-semibold">Acme Corp Engineering</h1>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages, people, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New page
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b9bbb9f4?w=150" />
              <AvatarFallback style={{ backgroundColor: generateUserColor('alice') }}>
                {getInitials('Alice Cooper')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
                  <p className="text-2xl font-bold">{stats.totalPages}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content Blocks</p>
                  <p className="text-2xl font-bold">{stats.totalBlocks}</p>
                </div>
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeCollaborators}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pages This Week</p>
                  <p className="text-2xl font-bold">{stats.pagesThisWeek}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Pages */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-lg">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recently Edited
                  </h2>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </div>
                
                <div className="p-4 space-y-3">
                  {recentPages.map((page: any) => (
                    <div key={page.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">{page.icon || '📄'}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">{page.title}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Edited {formatRelativeTime(new Date(page.lastEdited))}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={page.lastEditedBy.avatar_url || undefined} />
                                <AvatarFallback 
                                  className="text-xs"
                                  style={{ backgroundColor: generateUserColor(page.lastEditedBy.id) }}
                                >
                                  {getInitials(page.lastEditedBy.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{page.lastEditedBy.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Open page</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Templates */}
            <div>
              <div className="bg-card border rounded-lg">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Popular Templates
                  </h2>
                </div>
                
                <div className="p-4 space-y-3">
                  {templates.map((template: any) => (
                    <div key={template.id} className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{template.icon || '📋'}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{template.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {template.uses} uses
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Plus className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Create Page</p>
                  <p className="text-xs text-muted-foreground">Start with a blank page</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Invite Team</p>
                  <p className="text-xs text-muted-foreground">Add collaborators</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Schedule Meeting</p>
                  <p className="text-xs text-muted-foreground">Plan team collaboration</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component
function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-14 items-center px-6 gap-4">
          <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
          <div className="flex-1 max-w-md">
            <div className="h-9 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-4">
              <div className="h-4 bg-muted rounded animate-pulse mb-2 w-20"></div>
              <div className="h-8 bg-muted rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-lg p-4">
            <div className="h-6 bg-muted rounded animate-pulse mb-4 w-32"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="h-6 bg-muted rounded animate-pulse mb-4 w-32"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Error component
function DashboardError() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="text-center">
        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4 mx-auto">
          <TrendingUp className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't load your dashboard data. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
