# Integration Plan
## Real-time Collaboration Platform

### Integration Overview
**Total Estimated Time**: 2-3 sprints (2 weeks)  
**Priority**: Core Connections → Real-time Features → Performance → Testing

---

## 🔌 **EPIC 1: Frontend-Backend Integration**
*Priority: P0 (Core connectivity)*

### INT-001: API Client Setup & Error Handling
**User Story**: As a developer, I need reliable API communication so that frontend and backend work seamlessly together.

**Technical Approach**:
- Configure Axios client with interceptors
- Implement automatic JWT token refresh
- Add comprehensive error handling and retry logic
- Set up request/response logging for debugging

**API Client Configuration**:
```typescript
// lib/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/authStore';

class APIClient {
  private client;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log outgoing requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle auth and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        const original = error.config;

        // Handle 401 - Unauthorized (token expired)
        if (error.response?.status === 401 && original && !original._retry) {
          original._retry = true;

          try {
            // Refresh token logic
            const newToken = await this.refreshAccessToken();
            original.headers.Authorization = `Bearer ${newToken}`;
            return this.client(original);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        return this.handleAPIError(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/api/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;
        useAuthStore.getState().setTokens(accessToken, refreshToken);
        
        resolve(accessToken);
      } catch (error) {
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  private handleAPIError(error: AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    // Create standardized error object
    const apiError = {
      status,
      code: data?.code || 'UNKNOWN_ERROR',
      message: data?.message || 'An unexpected error occurred',
      details: data?.details || null,
      timestamp: new Date().toISOString(),
    };

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', apiError);
    }

    // Handle specific error types
    switch (status) {
      case 400:
        toast.error('Invalid request. Please check your input.');
        break;
      case 403:
        toast.error('Access denied. You don\'t have permission for this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 429:
        toast.error('Too many requests. Please slow down.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(apiError.message);
    }

    return Promise.reject(apiError);
  }

  // CRUD operations with proper typing
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }
}

export const apiClient = new APIClient();
```

**React Query Integration**:
```typescript
// hooks/api/useWorkspaces.ts
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => apiClient.get<Workspace[]>('/workspaces'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => 
      apiClient.post<Workspace>('/workspaces', data),
    onSuccess: (newWorkspace) => {
      // Update workspaces cache
      queryClient.setQueryData(['workspaces'], (old: Workspace[] = []) => 
        [...old, newWorkspace]
      );
      
      // Navigate to new workspace
      router.push(`/workspace/${newWorkspace.id}`);
      
      toast.success('Workspace created successfully!');
    },
    onError: (error: APIError) => {
      toast.error(`Failed to create workspace: ${error.message}`);
    },
  });
};
```

**Testing Approach**:
- Unit: API client interceptor tests
- Integration: End-to-end API communication tests
- Error: Network failure and error handling tests

**Acceptance Criteria**:
- [ ] All API endpoints are properly typed and accessible
- [ ] JWT token refresh works automatically
- [ ] Network errors are handled gracefully
- [ ] Request/response logging works in development
- [ ] Rate limiting is handled with proper user feedback
- [ ] Offline/online detection and retry logic works
- [ ] Error boundaries catch and display API errors
- [ ] Performance doesn't degrade with failed requests

**Estimated Time**: 6-8 hours

---

### INT-002: Authentication Flow Integration
**User Story**: As a user, I need seamless authentication so that I can access my workspaces securely.

**Technical Approach**:
- Integrate NextAuth.js with API backend
- Set up protected routes with middleware
- Implement session persistence and restoration
- Create authentication UI components

**NextAuth Configuration**:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/database';

const config = {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) return null;

          const data = await response.json();
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.avatar,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
} satisfies NextAuthConfig;

const handler = NextAuth(config);
export { handler as GET, handler as POST };
```

**Protected Route Middleware**:
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/workspace') ||
                          request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Authentication UI Components**:
```typescript
// components/auth/LoginForm.tsx
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials. Please try again.');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register('email')}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...form.register('password')}
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
```

**Session Management Hook**:
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const { data: session, status } = useSession();
  
  const user = session?.user;
  const isAuthenticated = !!user;
  const isLoading = status === 'loading';

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/login' });
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};
```

**Testing Approach**:
- Unit: Authentication form validation tests
- Integration: Login/logout flow tests
- Security: Token handling and expiration tests

**Acceptance Criteria**:
- [ ] Users can register with email/password
- [ ] Login works with proper validation
- [ ] JWT tokens are handled securely
- [ ] Protected routes redirect to login when needed
- [ ] Session persists across browser restarts
- [ ] Logout clears all session data
- [ ] Password reset flow works correctly
- [ ] Rate limiting prevents brute force attacks

**Estimated Time**: 8-10 hours

---

## ⚡ **EPIC 2: Real-time WebSocket Integration**
*Priority: P1 (Core competitive advantage)*

### INT-003: WebSocket Connection Management
**User Story**: As a user, I need reliable real-time updates so that I stay synchronized with my team's changes.

**Technical Approach**:
- Establish secure WebSocket connections with authentication
- Implement connection pooling and room management
- Add connection health monitoring and recovery
- Create event synchronization with API state

**WebSocket Client Integration**:
```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
import { useCollaborationStore } from '@/stores/collaborationStore';

class SocketManager {
  private socket: Socket | null = null;
  private connectionPromise: Promise<Socket> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  async connect(): Promise<Socket> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const token = useAuthStore.getState().accessToken;
      
      if (!token) {
        reject(new Error('No authentication token available'));
        return;
      }

      this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
        auth: { token },
        transports: ['websocket'],
        upgrade: true,
        timeout: 20000,
        forceNew: false,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        resolve(this.socket!);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ WebSocket disconnected:', reason);
        this.stopHeartbeat();
        this.handleDisconnection(reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        this.handleConnectionError(error);
        reject(error);
      });

      this.socket.on('auth_error', (error) => {
        console.error('❌ WebSocket auth error:', error);
        // Token might be expired, try to refresh
        this.handleAuthError(error);
        reject(error);
      });

      // Set up event handlers
      this.setupEventHandlers();
    });

    return this.connectionPromise;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // User presence events
    this.socket.on('user-joined', (data: UserJoinedEvent) => {
      useCollaborationStore.getState().addUser(data.user);
      toast.info(`${data.user.name} joined the workspace`);
    });

    this.socket.on('user-left', (data: UserLeftEvent) => {
      useCollaborationStore.getState().removeUser(data.userId);
      toast.info(`${data.userName} left the workspace`);
    });

    // Content synchronization events
    this.socket.on('block-updated', (data: BlockUpdateEvent) => {
      this.handleBlockUpdate(data);
    });

    this.socket.on('page-updated', (data: PageUpdateEvent) => {
      this.handlePageUpdate(data);
    });

    // Cursor and presence events
    this.socket.on('cursor-moved', (data: CursorMoveEvent) => {
      useCollaborationStore.getState().updateCursor(data.userId, data.position);
    });

    this.socket.on('typing-started', (data: TypingEvent) => {
      useCollaborationStore.getState().setTyping(data.userId, data.blockId);
    });

    this.socket.on('typing-stopped', (data: TypingEvent) => {
      useCollaborationStore.getState().clearTyping(data.userId);
    });
  }

  private handleBlockUpdate(data: BlockUpdateEvent) {
    // Apply operational transform to resolve conflicts
    const currentBlock = useEditorStore.getState().getBlock(data.blockId);
    
    if (currentBlock && currentBlock.version < data.version) {
      // Apply remote changes
      useEditorStore.getState().updateBlockFromRemote(data.blockId, {
        content: data.content,
        version: data.version,
        lastModified: data.timestamp,
        lastModifiedBy: data.userId,
      });
    } else if (currentBlock && currentBlock.version > data.version) {
      // Local version is newer, send our changes
      this.emit('block-update', {
        blockId: data.blockId,
        content: currentBlock.content,
        version: currentBlock.version,
        timestamp: Date.now(),
      });
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping', Date.now());
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleDisconnection(reason: string) {
    this.connectionPromise = null;
    
    // Auto-reconnect for certain disconnect reasons
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, don't reconnect automatically
      return;
    }

    // Implement exponential backoff for reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    }
  }

  private async handleAuthError(error: any) {
    try {
      // Try to refresh the token
      await useAuthStore.getState().refreshToken();
      // Retry connection with new token
      this.disconnect();
      await this.connect();
    } catch (refreshError) {
      // Refresh failed, user needs to login again
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
  }

  // Room management
  async joinWorkspace(workspaceId: string) {
    const socket = await this.connect();
    socket.emit('join-workspace', { workspaceId });
  }

  async leaveWorkspace(workspaceId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-workspace', { workspaceId });
    }
  }

  async joinPage(pageId: string) {
    const socket = await this.connect();
    socket.emit('join-page', { pageId });
  }

  async leavePage(pageId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-page', { pageId });
    }
  }

  // Event emission
  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: WebSocket not connected`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionPromise = null;
    this.stopHeartbeat();
  }

  get connected(): boolean {
    return this.socket?.connected || false;
  }

  get socket(): Socket | null {
    return this.socket;
  }
}

export const socketManager = new SocketManager();
```

**React Hook Integration**:
```typescript
// hooks/useSocket.ts
export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        await socketManager.connect();
        setConnected(true);
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setConnected(false);
      }
    };

    connect();

    // Listen for connection status changes
    const socket = socketManager.socket;
    if (socket) {
      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
    }

    return () => {
      // Don't disconnect on unmount, let the manager handle it
    };
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketManager.emit(event, data);
  }, []);

  return {
    connected,
    emit,
    joinWorkspace: socketManager.joinWorkspace.bind(socketManager),
    leaveWorkspace: socketManager.leaveWorkspace.bind(socketManager),
    joinPage: socketManager.joinPage.bind(socketManager),
    leavePage: socketManager.leavePage.bind(socketManager),
  };
};
```

**Testing Approach**:
- Unit: Connection management logic tests
- Integration: Real-time event synchronization tests
- Stress: Multiple concurrent connections and message handling

**Acceptance Criteria**:
- [ ] WebSocket connection establishes with authentication
- [ ] Automatic reconnection works with exponential backoff
- [ ] Room management (join/leave) works correctly
- [ ] Event handlers update application state properly
- [ ] Connection health monitoring detects issues
- [ ] Memory leaks are prevented with proper cleanup
- [ ] Performance handles 100+ concurrent users
- [ ] Error handling gracefully manages all failure cases

**Estimated Time**: 10-12 hours

---

### INT-004: Real-time Collaborative Editing
**User Story**: As a user, I need seamless collaborative editing so that multiple people can work on the same document without conflicts.

**Technical Approach**:
- Implement operational transform (OT) for conflict resolution
- Create optimistic updates with rollback capability
- Add real-time cursor synchronization
- Set up typing indicators and user presence

**Operational Transform Implementation**:
```typescript
// lib/operational-transform.ts
interface Operation {
  type: 'insert' | 'delete' | 'retain';
  length?: number;
  content?: string;
  position: number;
}

interface BlockOperation {
  blockId: string;
  operations: Operation[];
  version: number;
  userId: string;
  timestamp: number;
}

class OperationalTransform {
  // Transform operation A against operation B
  static transform(opA: Operation, opB: Operation): [Operation, Operation] {
    if (opA.type === 'insert' && opB.type === 'insert') {
      if (opA.position <= opB.position) {
        return [
          opA,
          { ...opB, position: opB.position + (opA.content?.length || 0) }
        ];
      } else {
        return [
          { ...opA, position: opA.position + (opB.content?.length || 0) },
          opB
        ];
      }
    }

    if (opA.type === 'delete' && opB.type === 'delete') {
      if (opA.position + (opA.length || 0) <= opB.position) {
        return [
          opA,
          { ...opB, position: opB.position - (opA.length || 0) }
        ];
      } else if (opB.position + (opB.length || 0) <= opA.position) {
        return [
          { ...opA, position: opA.position - (opB.length || 0) },
          opB
        ];
      } else {
        // Overlapping deletes - more complex logic needed
        return this.transformOverlappingDeletes(opA, opB);
      }
    }

    if (opA.type === 'insert' && opB.type === 'delete') {
      if (opA.position <= opB.position) {
        return [
          opA,
          { ...opB, position: opB.position + (opA.content?.length || 0) }
        ];
      } else if (opA.position >= opB.position + (opB.length || 0)) {
        return [
          { ...opA, position: opA.position - (opB.length || 0) },
          opB
        ];
      } else {
        // Insert within delete range
        return [
          { ...opA, position: opB.position },
          opB
        ];
      }
    }

    if (opA.type === 'delete' && opB.type === 'insert') {
      const [transformedB, transformedA] = this.transform(opB, opA);
      return [transformedA, transformedB];
    }

    // Default case - return operations as-is
    return [opA, opB];
  }

  private static transformOverlappingDeletes(opA: Operation, opB: Operation): [Operation, Operation] {
    const startA = opA.position;
    const endA = opA.position + (opA.length || 0);
    const startB = opB.position;
    const endB = opB.position + (opB.length || 0);

    // Calculate the overlapping region
    const overlapStart = Math.max(startA, startB);
    const overlapEnd = Math.min(endA, endB);
    const overlapLength = Math.max(0, overlapEnd - overlapStart);

    // Transform A
    const newOpA: Operation = {
      ...opA,
      length: (opA.length || 0) - overlapLength,
      position: Math.min(startA, startB)
    };

    // Transform B
    const newOpB: Operation = {
      ...opB,
      length: (opB.length || 0) - overlapLength,
      position: Math.min(startA, startB)
    };

    return [newOpA, newOpB];
  }

  // Apply operation to text content
  static applyOperation(content: string, operation: Operation): string {
    switch (operation.type) {
      case 'insert':
        return content.slice(0, operation.position) + 
               (operation.content || '') + 
               content.slice(operation.position);
      
      case 'delete':
        return content.slice(0, operation.position) + 
               content.slice(operation.position + (operation.length || 0));
      
      case 'retain':
        return content;
      
      default:
        return content;
    }
  }

  // Create operation from text diff
  static createOperation(oldText: string, newText: string, position: number): Operation[] {
    // Simple diff algorithm - can be replaced with more sophisticated solution
    if (oldText === newText) {
      return [];
    }

    if (newText.length > oldText.length) {
      // Text was inserted
      const insertedText = newText.slice(position, position + (newText.length - oldText.length));
      return [{
        type: 'insert',
        position,
        content: insertedText
      }];
    } else {
      // Text was deleted
      const deletedLength = oldText.length - newText.length;
      return [{
        type: 'delete',
        position,
        length: deletedLength
      }];
    }
  }
}

export { OperationalTransform };
```

**Collaborative Editor Hook**:
```typescript
// hooks/useCollaborativeEditor.ts
export const useCollaborativeEditor = (pageId: string) => {
  const [pendingOperations, setPendingOperations] = useState<BlockOperation[]>([]);
  const { emit, connected } = useSocket();
  const queryClient = useQueryClient();

  // Send local changes to server
  const sendOperation = useCallback((blockOperation: BlockOperation) => {
    if (!connected) {
      // Queue operation for when connection is restored
      setPendingOperations(prev => [...prev, blockOperation]);
      return;
    }

    emit('block-operation', {
      pageId,
      ...blockOperation,
    });
  }, [emit, connected, pageId]);

  // Handle remote operations
  useEffect(() => {
    if (!connected) return;

    const handleRemoteOperation = (data: BlockOperation) => {
      // Apply operational transform
      const currentBlock = queryClient.getQueryData(['blocks', pageId])?.find(
        (b: Block) => b.id === data.blockId
      );

      if (currentBlock) {
        // Transform and apply the remote operation
        const transformedOps = data.operations.map(op => {
          // Apply any pending local operations
          let transformedOp = op;
          pendingOperations.forEach(localOp => {
            if (localOp.blockId === data.blockId) {
              localOp.operations.forEach(localOperation => {
                const [, transformed] = OperationalTransform.transform(localOperation, transformedOp);
                transformedOp = transformed;
              });
            }
          });
          return transformedOp;
        });

        // Apply transformed operations to content
        let newContent = currentBlock.content;
        transformedOps.forEach(op => {
          newContent = OperationalTransform.applyOperation(newContent, op);
        });

        // Update the block optimistically
        queryClient.setQueryData(['blocks', pageId], (old: Block[]) =>
          old.map(block => 
            block.id === data.blockId 
              ? { 
                  ...block, 
                  content: newContent,
                  version: data.version,
                  lastModified: data.timestamp,
                  lastModifiedBy: data.userId,
                }
              : block
          )
        );
      }
    };

    // Set up WebSocket listeners
    const socket = socketManager.socket;
    if (socket) {
      socket.on('block-operation', handleRemoteOperation);
      socket.on('operation-ack', (data: { operationId: string }) => {
        // Remove acknowledged operation from pending list
        setPendingOperations(prev => 
          prev.filter(op => op.operationId !== data.operationId)
        );
      });

      return () => {
        socket.off('block-operation', handleRemoteOperation);
        socket.off('operation-ack');
      };
    }
  }, [connected, pageId, pendingOperations, queryClient]);

  // Send pending operations when connection is restored
  useEffect(() => {
    if (connected && pendingOperations.length > 0) {
      pendingOperations.forEach(operation => {
        emit('block-operation', {
          pageId,
          ...operation,
        });
      });
    }
  }, [connected, pendingOperations, emit, pageId]);

  // Create and send operation for block edit
  const editBlock = useCallback((blockId: string, oldContent: string, newContent: string, position: number) => {
    const operations = OperationalTransform.createOperation(oldContent, newContent, position);
    
    if (operations.length > 0) {
      const blockOperation: BlockOperation = {
        blockId,
        operations,
        version: Date.now(), // Simplified versioning
        userId: useAuthStore.getState().user?.id || 'anonymous',
        timestamp: Date.now(),
        operationId: generateUniqueId(),
      };

      // Apply optimistically
      queryClient.setQueryData(['blocks', pageId], (old: Block[]) =>
        old.map(block => 
          block.id === blockId 
            ? { ...block, content: newContent }
            : block
        )
      );

      // Send to server
      sendOperation(blockOperation);
    }
  }, [sendOperation, queryClient, pageId]);

  return {
    editBlock,
    pendingOperations: pendingOperations.length,
    connected,
  };
};
```

**Testing Approach**:
- Unit: Operational transform algorithm tests
- Integration: Multi-user editing conflict resolution tests
- Stress: High-frequency concurrent editing scenarios

**Acceptance Criteria**:
- [ ] Multiple users can edit the same block simultaneously
- [ ] Conflicts are resolved without data loss
- [ ] Operational transforms produce consistent results
- [ ] Optimistic updates rollback on conflicts
- [ ] Real-time latency is <50ms for local operations
- [ ] Performance handles rapid-fire edits smoothly
- [ ] Network partitions don't cause data corruption
- [ ] Version history tracks all collaborative changes

**Estimated Time**: 15-18 hours

---

## 📊 **EPIC 3: Performance & Optimization**
*Priority: P2 (Enhanced user experience)*

### INT-005: Data Synchronization & Caching
**User Story**: As a user, I need fast page loads and smooth interactions so that the app feels responsive.

**Technical Approach**:
- Implement intelligent caching strategies
- Add data prefetching for common workflows
- Create cache invalidation and synchronization
- Optimize bundle splitting and lazy loading

**Cache Strategy Implementation**:
```typescript
// lib/cache.ts
interface CacheConfig {
  key: string;
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  maxAge?: number;
}

class CacheManager {
  private cache = new Map<string, CachedItem>();
  private subscriptions = new Map<string, Set<() => void>>();

  set<T>(key: string, data: T, config: CacheConfig): void {
    const item: CachedItem = {
      data,
      timestamp: Date.now(),
      ttl: config.ttl,
      staleWhileRevalidate: config.staleWhileRevalidate || false,
    };

    this.cache.set(key, item);
    this.notifySubscribers(key);

    // Set up automatic expiration
    setTimeout(() => {
      if (this.cache.has(key)) {
        const cachedItem = this.cache.get(key);
        if (cachedItem && Date.now() - cachedItem.timestamp >= config.ttl) {
          this.cache.delete(key);
          this.notifySubscribers(key);
        }
      }
    }, config.ttl);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp >= item.ttl;
    
    if (isExpired && !item.staleWhileRevalidate) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
        this.notifySubscribers(key);
      }
    }
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    
    this.subscriptions.get(key)!.add(callback);
    
    return () => {
      const subs = this.subscriptions.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscriptions.delete(key);
        }
      }
    };
  }

  private notifySubscribers(key: string): void {
    const callbacks = this.subscriptions.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }
}

export const cacheManager = new CacheManager();
```

**React Query Cache Configuration**:
```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      onError: (error: any) => {
        // Global error handling
        toast.error(error.message || 'Something went wrong');
      },
    },
  },
});

// Cache invalidation patterns
export const invalidatePatterns = {
  workspace: (workspaceId: string) => [`workspaces`, `workspaces.${workspaceId}`],
  page: (pageId: string) => [`pages`, `pages.${pageId}`, `blocks.${pageId}`],
  block: (blockId: string, pageId: string) => [`blocks.${pageId}`, `block.${blockId}`],
  user: (userId: string) => [`user.${userId}`, `presence`],
};
```

**Data Prefetching Hook**:
```typescript
// hooks/usePrefetch.ts
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchWorkspaceData = useCallback(async (workspaceId: string) => {
    // Prefetch workspace details
    queryClient.prefetchQuery({
      queryKey: ['workspaces', workspaceId],
      queryFn: () => apiClient.get(`/workspaces/${workspaceId}`),
      staleTime: 5 * 60 * 1000,
    });

    // Prefetch workspace pages
    queryClient.prefetchQuery({
      queryKey: ['pages', workspaceId],
      queryFn: () => apiClient.get(`/workspaces/${workspaceId}/pages`),
      staleTime: 2 * 60 * 1000,
    });

    // Prefetch workspace members
    queryClient.prefetchQuery({
      queryKey: ['members', workspaceId],
      queryFn: () => apiClient.get(`/workspaces/${workspaceId}/members`),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const prefetchPageContent = useCallback(async (pageId: string) => {
    // Prefetch page details
    queryClient.prefetchQuery({
      queryKey: ['pages', pageId],
      queryFn: () => apiClient.get(`/pages/${pageId}`),
      staleTime: 1 * 60 * 1000,
    });

    // Prefetch page blocks
    queryClient.prefetchQuery({
      queryKey: ['blocks', pageId],
      queryFn: () => apiClient.get(`/pages/${pageId}/blocks`),
      staleTime: 30 * 1000, // 30 seconds for active content
    });
  }, [queryClient]);

  return {
    prefetchWorkspaceData,
    prefetchPageContent,
  };
};
```

**Bundle Optimization**:
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split vendor chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui',
            priority: 20,
            chunks: 'all',
          },
          editor: {
            test: /[\\/](components[\\/]editor|blocks)[\\/]/,
            name: 'editor',
            priority: 15,
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
```

**Testing Approach**:
- Performance: Bundle size analysis and load time measurements
- Caching: Cache hit/miss ratios and invalidation correctness
- Integration: End-to-end user workflow performance tests

**Acceptance Criteria**:
- [ ] Initial page load completes in <2 seconds
- [ ] JavaScript bundle is <300KB total
- [ ] Cache hit ratio is >80% for common operations
- [ ] Data prefetching reduces perceived load times
- [ ] Bundle splitting enables efficient loading
- [ ] Memory usage stays under 100MB for typical sessions
- [ ] Performance doesn't degrade with large datasets
- [ ] Offline caching provides graceful degradation

**Estimated Time**: 8-10 hours

---

## 📋 **Integration Development Summary**

### **Total Estimated Time**: 60-75 hours (2-3 weeks)

### **Sprint Breakdown**:
**Sprint 1 (Week 1)**: Core Integration
- INT-001: API Client Setup (8h)
- INT-002: Authentication Flow (10h)
- **Total**: 18 hours

**Sprint 2 (Week 2)**: Real-time Features
- INT-003: WebSocket Connection Management (12h)
- INT-004: Collaborative Editing (18h)
- **Total**: 30 hours

**Sprint 3 (Week 3)**: Performance & Polish
- INT-005: Data Synchronization & Caching (10h)
- Integration testing and bug fixes (12h)
- **Total**: 22 hours

### **Success Metrics**:
- All API endpoints integrate seamlessly with frontend
- Real-time collaboration works without data loss
- Performance targets met: <2s load, <50ms real-time latency
- Authentication flow is secure and user-friendly
- Caching improves user experience significantly

### **Risk Mitigation**:
- **High Risk**: Real-time collaborative editing complexity
- **Medium Risk**: WebSocket connection stability under load
- **Low Risk**: API integration and caching implementation

### **Testing Strategy**:
- Unit tests for all integration logic
- Integration tests for end-to-end workflows  
- Performance tests under realistic load
- Security tests for authentication and authorization
- Cross-browser compatibility testing
