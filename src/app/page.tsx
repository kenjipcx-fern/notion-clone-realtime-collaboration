import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Realtime Collaboration Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            A high-performance, real-time collaboration platform that makes Notion look slow
          </p>
        </div>

        <div className="flex flex-col space-y-4 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="h-12 text-base"
          />
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button size="lg" className="h-12 text-base w-full">
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-12 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ✅ Database ready with 50 users, 10 workspaces, 204 pages, 974+ blocks
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <p className="text-sm text-muted-foreground">Sample users:</p>
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b9bbb9f4?w=150" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150" />
                <AvatarFallback>BB</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
                <AvatarFallback>CB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold">🚀 Real-time</h3>
            <p className="text-sm text-muted-foreground">
              See changes instantly as your team collaborates in real-time
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">⚡ High Performance</h3>
            <p className="text-sm text-muted-foreground">
              Sub-200ms response times with optimized database queries
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">🧱 Block-based</h3>
            <p className="text-sm text-muted-foreground">
              Flexible content blocks like Notion, but faster and more reliable
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
