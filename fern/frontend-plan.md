# Frontend Development Plan
## Real-time Collaboration Platform

### Sprint Planning Overview
**Total Estimated Time**: 3-4 sprints (3 weeks)  
**Priority**: Foundation → Core Components → Real-time UI → Polish

---

## 🏗️ **EPIC 1: Foundation & Setup**
*Priority: P0 (Must complete first)*

### FE-001: Next.js 14 Project Setup & Configuration
**User Story**: As a developer, I need a properly configured Next.js project so that I can build the frontend efficiently.

**Technical Approach**:
- Initialize Next.js 14 with App Router
- Configure TypeScript with strict mode
- Set up Tailwind CSS with design system tokens
- Configure ESLint and Prettier for code quality

**Required Dependencies**:
```bash
# Core Framework
npx create-next-app@latest realtime-collab-platform --typescript --tailwind --app
cd realtime-collab-platform

# State Management & Data Fetching
npm install zustand @tanstack/react-query axios
npm install @types/axios

# UI Components & Animations
npm install @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-button
npm install @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot
npm install @radix-ui/react-tooltip @radix-ui/react-dialog
npm install framer-motion lucide-react

# Real-time & Collaboration
npm install socket.io-client
npm install @types/socket.io-client

# Form Handling & Validation
npm install react-hook-form @hookform/resolvers zod
npm install @types/react-hook-form
```

**Project Structure Setup**:
```typescript
src/
├── app/                    // Next.js App Router
│   ├── (auth)/            // Auth routes group
│   ├── (dashboard)/       // Dashboard routes group  
│   ├── globals.css        // Global styles
│   ├── layout.tsx         // Root layout
│   └── page.tsx           // Home page
├── components/            // Reusable UI components
│   ├── ui/               // shadcn/ui components
│   ├── blocks/           // Content block components
│   ├── editor/           // Editor-specific components
│   └── collaboration/    // Real-time collaboration UI
├── hooks/                // Custom React hooks
├── lib/                  // Utility functions
│   ├── api.ts           // API client configuration
│   ├── socket.ts        // WebSocket client
│   ├── store.ts         // Zustand store setup
│   └── utils.ts         // General utilities
├── types/               // TypeScript type definitions
└── styles/              // Additional CSS files
```

**Configuration Files**:
```typescript
// tailwind.config.js - Design system integration
// next.config.js - Performance optimizations
// tsconfig.json - Strict TypeScript settings
// .eslintrc.json - Code quality rules
```

**Testing Approach**:
- Unit: Component rendering tests
- Integration: Route navigation tests
- Performance: Bundle size analysis

**Acceptance Criteria**:
- [ ] Next.js 14 with App Router configured
- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS with design system tokens
- [ ] All dependencies installed and configured
- [ ] Project structure follows conventions
- [ ] Development server starts without errors
- [ ] Build process completes successfully
- [ ] Bundle size analysis shows <150KB initial bundle

**Estimated Time**: 4-6 hours

---

### FE-002: Design System Implementation
**User Story**: As a developer, I need a consistent design system so that the UI is cohesive and maintainable.

**Technical Approach**:
- Implement design tokens from ui-design.md
- Set up shadcn/ui component library
- Create custom components for collaboration features
- Configure Framer Motion for animations

**Design System Implementation**:
```css
/* Design Tokens in globals.css */
:root {
  /* Colors */
  --color-primary-500: #6366f1;      /* Indigo - main brand */
  --color-primary-600: #4f46e5;      /* Darker indigo */
  --color-secondary-500: #10b981;     /* Emerald - success */
  --color-accent-500: #f59e0b;       /* Amber - warnings */
  --color-danger-500: #ef4444;       /* Red - errors */
  
  /* Typography Scale */
  --font-size-xs: 0.75rem;           /* 12px */
  --font-size-sm: 0.875rem;          /* 14px */
  --font-size-base: 1rem;            /* 16px */
  --font-size-lg: 1.125rem;          /* 18px */
  --font-size-xl: 1.25rem;           /* 20px */
  --font-size-2xl: 1.5rem;           /* 24px */
  --font-size-3xl: 1.875rem;         /* 30px */
  
  /* Spacing System (8px grid) */
  --space-1: 0.25rem;                /* 4px */
  --space-2: 0.5rem;                 /* 8px */
  --space-3: 0.75rem;                /* 12px */
  --space-4: 1rem;                   /* 16px */
  --space-6: 1.5rem;                 /* 24px */
  --space-8: 2rem;                   /* 32px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;              /* 4px */
  --radius-md: 0.375rem;             /* 6px */
  --radius-lg: 0.5rem;               /* 8px */
  --radius-xl: 1rem;                 /* 16px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

**Component Library Setup**:
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Install core components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add card
```

**Animation System**:
```typescript
// Framer Motion animation presets for consistency
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2 }
  }
};
```

**Testing Approach**:
- Visual: Storybook component documentation
- Unit: Component prop testing
- Accessibility: ARIA compliance testing

**Acceptance Criteria**:
- [ ] All design tokens implemented consistently
- [ ] shadcn/ui components integrate seamlessly
- [ ] Custom components follow design system
- [ ] Animations are smooth and purposeful
- [ ] Dark/light mode support implemented
- [ ] Responsive breakpoints work correctly
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Component library documentation complete

**Estimated Time**: 8-10 hours

---

### FE-003: State Management Setup
**User Story**: As a developer, I need predictable state management so that the application behaves consistently.

**Technical Approach**:
- Set up Zustand stores for different domains
- Implement React Query for server state
- Create TypeScript interfaces for all state shapes
- Set up optimistic updates for real-time features

**Store Architecture**:
```typescript
// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Workspace Store  
interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  members: WorkspaceMember[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (updates: Partial<Workspace>) => void;
}

// Editor Store
interface EditorState {
  currentPage: Page | null;
  blocks: Block[];
  isEditing: boolean;
  selectedBlocks: string[];
  draggedBlock: string | null;
  
  // Block operations
  addBlock: (block: Omit<Block, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, newPosition: number) => void;
}

// Collaboration Store
interface CollaborationState {
  connectedUsers: UserPresence[];
  cursors: Map<string, CursorPosition>;
  typingUsers: Map<string, TypingIndicator>;
  
  // Real-time operations
  updateUserPresence: (userId: string, presence: UserPresence) => void;
  updateCursor: (userId: string, position: CursorPosition) => void;
  setTyping: (userId: string, blockId: string) => void;
  clearTyping: (userId: string) => void;
}
```

**React Query Configuration**:
```typescript
// API query configuration with optimistic updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        toast.error('Something went wrong. Please try again.');
      },
    },
  },
});
```

**Optimistic Updates**:
```typescript
// Example: Optimistic block updates
const useUpdateBlock = () => {
  return useMutation({
    mutationFn: updateBlockAPI,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['blocks', variables.pageId]);
      
      // Snapshot previous value
      const previousBlocks = queryClient.getQueryData(['blocks', variables.pageId]);
      
      // Optimistically update
      queryClient.setQueryData(['blocks', variables.pageId], (old: Block[]) =>
        old.map(block => 
          block.id === variables.id 
            ? { ...block, ...variables.updates }
            : block
        )
      );
      
      return { previousBlocks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBlocks) {
        queryClient.setQueryData(['blocks', variables.pageId], context.previousBlocks);
      }
    },
  });
};
```

**Testing Approach**:
- Unit: Store action and selector tests
- Integration: State synchronization tests
- Real-time: Optimistic update rollback tests

**Acceptance Criteria**:
- [ ] All stores are properly typed with TypeScript
- [ ] Server state is cached efficiently with React Query
- [ ] Optimistic updates work for all mutations
- [ ] State persistence works correctly
- [ ] Store devtools are configured for debugging
- [ ] No unnecessary re-renders (performance optimized)
- [ ] Error boundaries handle state errors gracefully

**Estimated Time**: 6-8 hours

---

## 📝 **EPIC 2: Content Editor**
*Priority: P0 (Core functionality)*

### FE-004: Block-Based Editor Foundation
**User Story**: As a user, I need a flexible block-based editor so that I can create rich content easily.

**Technical Approach**:
- Create base Block component with drag-and-drop
- Implement block insertion and deletion
- Set up keyboard navigation and shortcuts
- Create block selection and multi-selection

**Block Component Architecture**:
```typescript
// Base Block Component
interface BlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

// Block Types to Implement
const blockComponents = {
  paragraph: ParagraphBlock,
  heading_1: HeadingBlock,
  heading_2: HeadingBlock, 
  heading_3: HeadingBlock,
  bulleted_list: ListBlock,
  numbered_list: ListBlock,
  to_do: TodoBlock,
  divider: DividerBlock,
} as const;
```

**Drag and Drop Implementation**:
```typescript
// Using @dnd-kit for smooth drag and drop
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

// Drag and drop configuration
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Prevent accidental drags
    },
  })
);
```

**Keyboard Shortcuts**:
```typescript
const editorShortcuts = {
  'Enter': 'Create new block below',
  'Shift+Enter': 'Line break within block',  
  'Backspace': 'Delete empty block or merge with previous',
  'Delete': 'Delete block or selected blocks',
  'Tab': 'Indent list item or nested block',
  'Shift+Tab': 'Unindent list item',
  'Cmd/Ctrl+A': 'Select all blocks',
  'Cmd/Ctrl+D': 'Duplicate selected blocks',
  'Cmd/Ctrl+Z': 'Undo last action',
  'Cmd/Ctrl+Y': 'Redo last action',
  '/': 'Open block type selector',
  '# ': 'Convert to heading 1',
  '## ': 'Convert to heading 2',
  '### ': 'Convert to heading 3',
  '- ': 'Convert to bulleted list',
  '1. ': 'Convert to numbered list',
  '[] ': 'Convert to todo',
  '--- ': 'Convert to divider',
};
```

**Testing Approach**:
- Unit: Individual block component tests
- Integration: Block interaction and navigation tests
- Accessibility: Keyboard navigation and screen reader tests

**Acceptance Criteria**:
- [ ] All 8 core block types render correctly
- [ ] Drag and drop works smoothly with visual feedback
- [ ] Keyboard shortcuts work as expected
- [ ] Block selection (single and multi) works correctly
- [ ] Block insertion at any position works
- [ ] Block deletion handles edge cases properly
- [ ] Undo/redo system tracks all operations
- [ ] Performance handles 100+ blocks smoothly

**Estimated Time**: 12-15 hours

---

### FE-005: Rich Text Editing
**User Story**: As a user, I need rich text formatting so that I can style my content appropriately.

**Technical Approach**:
- Implement contentEditable-based text editor
- Add formatting toolbar with common options
- Support markdown shortcuts for formatting
- Handle copy/paste from external sources

**Rich Text Features**:
```typescript
// Supported formatting options
interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  link?: {
    url: string;
    text: string;
  };
  color?: string;
  backgroundColor?: string;
}

// Text editor component
const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder,
  autoFocus 
}: RichTextEditorProps) => {
  // Implementation with contentEditable
};
```

**Formatting Toolbar**:
```typescript
const FormattingToolbar = ({ 
  selection, 
  onFormat 
}: FormattingToolbarProps) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-white border rounded shadow-lg">
      <Button variant="ghost" size="sm" onClick={() => onFormat('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormat('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormat('underline')}>
        <Underline className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="sm" onClick={() => onFormat('link')}>
        <Link className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormat('code')}>
        <Code className="w-4 h-4" />
      </Button>
    </div>
  );
};
```

**Markdown Shortcuts**:
```typescript
const markdownShortcuts = {
  '**text**': 'Bold text',
  '*text*': 'Italic text',
  '`code`': 'Inline code',
  '[text](url)': 'Link',
  '~~text~~': 'Strikethrough',
} as const;
```

**Testing Approach**:
- Unit: Text formatting function tests
- Integration: Toolbar interaction tests  
- Cross-browser: Copy/paste compatibility tests

**Acceptance Criteria**:
- [ ] All basic formatting options work correctly
- [ ] Formatting toolbar appears on text selection
- [ ] Markdown shortcuts are converted automatically
- [ ] Copy/paste preserves formatting when possible
- [ ] Links are clickable and properly validated
- [ ] Rich text content is saved correctly
- [ ] Performance is smooth during typing
- [ ] Mobile touch selection works properly

**Estimated Time**: 10-12 hours

---

### FE-006: Block Type Selector & Commands
**User Story**: As a user, I need an intuitive way to create different block types so that I can structure my content efficiently.

**Technical Approach**:
- Create slash command menu (/) for block selection
- Implement fuzzy search for block types
- Add block previews and descriptions
- Support keyboard navigation in selector

**Command Menu Implementation**:
```typescript
interface BlockTypeOption {
  id: BlockType;
  name: string;
  description: string;
  icon: React.ComponentType;
  keywords: string[];
  category: 'basic' | 'text' | 'list' | 'media';
}

const blockTypeOptions: BlockTypeOption[] = [
  {
    id: 'paragraph',
    name: 'Text',
    description: 'Just start writing with plain text.',
    icon: Type,
    keywords: ['text', 'paragraph', 'plain'],
    category: 'basic',
  },
  {
    id: 'heading_1',
    name: 'Heading 1',
    description: 'Big section heading.',
    icon: Heading1,
    keywords: ['heading', 'h1', 'title'],
    category: 'text',
  },
  // ... more block types
];
```

**Fuzzy Search Implementation**:
```typescript
import Fuse from 'fuse.js';

const useBlockSearch = () => {
  const fuse = useMemo(() => new Fuse(blockTypeOptions, {
    keys: ['name', 'description', 'keywords'],
    threshold: 0.3, // Fuzzy matching threshold
  }), []);

  const searchBlocks = useCallback((query: string) => {
    if (!query.trim()) return blockTypeOptions;
    return fuse.search(query).map(result => result.item);
  }, [fuse]);

  return { searchBlocks };
};
```

**Command Menu UI**:
```typescript
const BlockSelector = ({ 
  isOpen, 
  onSelect, 
  onClose,
  position 
}: BlockSelectorProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { searchBlocks } = useBlockSearch();
  
  const filteredBlocks = searchBlocks(query);

  return (
    <Command className="w-80 max-h-96">
      <CommandInput
        placeholder="Type to search..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {Object.entries(groupBy(filteredBlocks, 'category')).map(([category, blocks]) => (
          <CommandGroup key={category} heading={capitalize(category)}>
            {blocks.map((block, index) => (
              <CommandItem
                key={block.id}
                onSelect={() => onSelect(block)}
                className="flex items-center gap-3 p-3"
              >
                <block.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{block.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {block.description}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};
```

**Testing Approach**:
- Unit: Search functionality and filtering tests
- Integration: Block creation from selector tests
- Accessibility: Keyboard navigation tests

**Acceptance Criteria**:
- [ ] Slash command (/) opens block selector
- [ ] Fuzzy search finds relevant block types
- [ ] Keyboard navigation works smoothly
- [ ] Block categories are properly organized
- [ ] Selected block is created at correct position
- [ ] Selector closes after block selection
- [ ] Visual feedback for selected option
- [ ] Mobile-friendly touch interaction

**Estimated Time**: 8-10 hours

---

## 👥 **EPIC 3: Real-time Collaboration UI**
*Priority: P1 (Core competitive advantage)*

### FE-007: WebSocket Integration
**User Story**: As a user, I need real-time updates so that I can see changes from my team members immediately.

**Technical Approach**:
- Set up Socket.io client with authentication
- Implement connection management and reconnection
- Create event handling system for real-time updates
- Add connection status indicators

**WebSocket Client Setup**:
```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ['websocket'],
      timeout: 20000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
      // Join user's workspaces
      this.joinWorkspaces();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleConnectionError();
    });
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.socket?.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }
}

export const socketManager = new SocketManager();
```

**Real-time Event Hooks**:
```typescript
// hooks/useSocket.ts
export const useSocket = () => {
  const socket = socketManager.getSocket();
  
  const emit = useCallback((event: string, data: any) => {
    socket?.emit(event, data);
  }, [socket]);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    socket?.on(event, handler);
    return () => socket?.off(event, handler);
  }, [socket]);

  return { emit, on, connected: socket?.connected };
};

// hooks/useRealTimeBlocks.ts  
export const useRealTimeBlocks = (pageId: string) => {
  const { emit, on } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = on('block-updated', (data: BlockUpdateEvent) => {
      // Update React Query cache optimistically
      queryClient.setQueryData(['blocks', pageId], (old: Block[]) => {
        return old.map(block => 
          block.id === data.blockId 
            ? { ...block, ...data.updates }
            : block
        );
      });
    });

    return unsubscribe;
  }, [on, queryClient, pageId]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    emit('block-update', { pageId, blockId, updates });
  }, [emit, pageId]);

  return { updateBlock };
};
```

**Connection Status Component**:
```typescript
const ConnectionStatus = () => {
  const { connected } = useSocket();
  const [showReconnecting, setShowReconnecting] = useState(false);

  useEffect(() => {
    if (!connected) {
      const timer = setTimeout(() => setShowReconnecting(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowReconnecting(false);
    }
  }, [connected]);

  if (connected) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        Connected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-amber-600">
      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      {showReconnecting ? 'Reconnecting...' : 'Connecting...'}
    </div>
  );
};
```

**Testing Approach**:
- Unit: Socket event handler tests
- Integration: Real-time data synchronization tests
- Network: Connection recovery and offline tests

**Acceptance Criteria**:
- [ ] Socket connection establishes automatically
- [ ] Authentication works with JWT tokens
- [ ] Reconnection handles network issues gracefully
- [ ] Event handlers update UI immediately
- [ ] Connection status is visible to users
- [ ] No memory leaks from event handlers
- [ ] Real-time latency is <50ms for local operations
- [ ] Handles server restarts without data loss

**Estimated Time**: 8-10 hours

---

### FE-008: Live Cursors & User Presence
**User Story**: As a user, I need to see where my team members are working so that we can avoid conflicts and coordinate effectively.

**Technical Approach**:
- Create cursor tracking system with smooth animations
- Implement user avatars and names
- Add typing indicators for active blocks
- Create user list with online status

**Cursor Tracking Implementation**:
```typescript
// components/collaboration/LiveCursors.tsx
interface CursorPosition {
  x: number;
  y: number;
  blockId?: string;
  selection?: { start: number; end: number };
}

interface UserCursor {
  userId: string;
  userName: string;
  userAvatar?: string;
  color: string;
  position: CursorPosition;
  lastUpdate: number;
}

const LiveCursors = ({ pageId }: { pageId: string }) => {
  const [cursors, setCursors] = useState<Map<string, UserCursor>>(new Map());
  const { emit, on } = useSocket();
  
  // Track local cursor movement
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      const position = {
        x: e.clientX,
        y: e.clientY,
        blockId: getBlockIdFromElement(e.target as Element),
      };

      emit('cursor-move', { pageId, position });
    }, 50); // Throttle to 20fps

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [emit, pageId]);

  // Listen for remote cursor updates
  useEffect(() => {
    const unsubscribe = on('user-cursor-move', (data: CursorUpdateEvent) => {
      setCursors(prev => new Map(prev.set(data.userId, {
        ...data,
        lastUpdate: Date.now(),
      })));
    });

    return unsubscribe;
  }, [on]);

  // Clean up stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(prev => {
        const now = Date.now();
        const updated = new Map(prev);
        
        for (const [userId, cursor] of updated) {
          if (now - cursor.lastUpdate > 5000) { // 5 second timeout
            updated.delete(userId);
          }
        }
        
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from(cursors.values()).map(cursor => (
        <AnimatedCursor
          key={cursor.userId}
          cursor={cursor}
          className="pointer-events-none"
        />
      ))}
    </div>
  );
};
```

**Animated Cursor Component**:
```typescript
const AnimatedCursor = ({ cursor }: { cursor: UserCursor }) => {
  return (
    <motion.div
      className="absolute z-50"
      animate={{
        x: cursor.position.x,
        y: cursor.position.y,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
      }}
    >
      {/* Cursor pointer */}
      <div 
        className="w-5 h-5 transform -rotate-45"
        style={{ backgroundColor: cursor.color }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      
      {/* User name label */}
      <div 
        className="mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
        style={{ borderLeftColor: cursor.color }}
      >
        {cursor.userName}
      </div>
    </motion.div>
  );
};
```

**Typing Indicators**:
```typescript
const TypingIndicator = ({ blockId }: { blockId: string }) => {
  const [typingUsers, setTypingUsers] = useState<UserPresence[]>([]);
  const { on } = useSocket();

  useEffect(() => {
    const unsubscribe = on('user-typing', (data: TypingEvent) => {
      if (data.blockId === blockId) {
        setTypingUsers(prev => {
          const filtered = prev.filter(user => user.userId !== data.userId);
          return data.isTyping 
            ? [...filtered, data.user]
            : filtered;
        });
      }
    });

    return unsubscribe;
  }, [on, blockId]);

  if (typingUsers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 text-sm text-muted-foreground mt-2"
    >
      <div className="flex -space-x-1">
        {typingUsers.slice(0, 3).map(user => (
          <Avatar key={user.userId} className="w-5 h-5 border border-background">
            <AvatarImage src={user.userAvatar} />
            <AvatarFallback className="text-xs">
              {user.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <TypingDots />
        <span>
          {typingUsers.length === 1 
            ? `${typingUsers[0].userName} is typing...`
            : `${typingUsers.length} people are typing...`
          }
        </span>
      </div>
    </motion.div>
  );
};
```

**Testing Approach**:
- Unit: Cursor position calculation tests
- Integration: Multi-user presence tests
- Performance: High-frequency update handling

**Acceptance Criteria**:
- [ ] Live cursors are smooth and accurate
- [ ] User colors are consistent and distinct
- [ ] Typing indicators appear/disappear correctly  
- [ ] Cursor cleanup prevents memory leaks
- [ ] Performance handles 20+ simultaneous users
- [ ] Mobile touch gestures are supported
- [ ] Cursors are hidden when users are idle
- [ ] Visual feedback is clear and non-intrusive

**Estimated Time**: 12-15 hours

---

### FE-009: Conflict Resolution UI
**User Story**: As a user, I need to handle editing conflicts gracefully so that no work is lost during collaboration.

**Technical Approach**:
- Implement visual conflict indicators
- Create conflict resolution interface
- Add version comparison and merging
- Provide undo/redo for collaborative changes

**Conflict Detection**:
```typescript
interface EditConflict {
  blockId: string;
  conflictType: 'concurrent_edit' | 'version_mismatch' | 'deleted_block';
  localVersion: Block;
  remoteVersion: Block;
  timestamp: number;
}

const useConflictDetection = () => {
  const [conflicts, setConflicts] = useState<EditConflict[]>([]);

  const detectConflict = useCallback((localBlock: Block, remoteBlock: Block) => {
    // Detect if both users edited the same content
    if (localBlock.version !== remoteBlock.version && 
        localBlock.content !== remoteBlock.content) {
      return {
        blockId: localBlock.id,
        conflictType: 'concurrent_edit' as const,
        localVersion: localBlock,
        remoteVersion: remoteBlock,
        timestamp: Date.now(),
      };
    }
    return null;
  }, []);

  return { conflicts, detectConflict };
};
```

**Conflict Resolution Modal**:
```typescript
const ConflictResolutionModal = ({ 
  conflict, 
  onResolve, 
  onDismiss 
}: ConflictResolutionProps) => {
  const [selectedVersion, setSelectedVersion] = useState<'local' | 'remote' | 'merge'>('local');

  return (
    <Dialog open={!!conflict} onOpenChange={onDismiss}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Editing Conflict Detected
          </DialogTitle>
          <DialogDescription>
            Multiple users edited this content simultaneously. Choose how to resolve the conflict.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Local version */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Radio 
                value="local" 
                checked={selectedVersion === 'local'}
                onCheckedChange={() => setSelectedVersion('local')}
              />
              <Label className="font-medium">Your Version</Label>
            </div>
            <div className="border rounded-lg p-3 bg-blue-50">
              <BlockPreview block={conflict.localVersion} />
            </div>
          </div>

          {/* Remote version */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Radio 
                value="remote" 
                checked={selectedVersion === 'remote'}
                onCheckedChange={() => setSelectedVersion('remote')}
              />
              <Label className="font-medium">Team Member's Version</Label>
            </div>
            <div className="border rounded-lg p-3 bg-green-50">
              <BlockPreview block={conflict.remoteVersion} />
            </div>
          </div>
        </div>

        {/* Merge option */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Radio 
              value="merge" 
              checked={selectedVersion === 'merge'}
              onCheckedChange={() => setSelectedVersion('merge')}
            />
            <Label className="font-medium">Manual Merge</Label>
          </div>
          {selectedVersion === 'merge' && (
            <div className="border rounded-lg p-3">
              <MergeEditor
                localContent={conflict.localVersion.content}
                remoteContent={conflict.remoteVersion.content}
                onContentChange={(content) => {/* Handle merge */}}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onDismiss}>
            Cancel
          </Button>
          <Button onClick={() => onResolve(selectedVersion, conflict)}>
            Resolve Conflict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

**Visual Conflict Indicators**:
```typescript
const BlockWithConflictIndicator = ({ block, hasConflict }: BlockProps) => {
  return (
    <div className={`relative ${hasConflict ? 'ring-2 ring-amber-400' : ''}`}>
      {hasConflict && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Conflict
          </Badge>
        </div>
      )}
      
      <Block block={block} />
      
      {hasConflict && (
        <div className="absolute inset-0 bg-amber-50 bg-opacity-50 pointer-events-none" />
      )}
    </div>
  );
};
```

**Testing Approach**:
- Unit: Conflict detection algorithm tests
- Integration: Multi-user conflict scenario tests
- Usability: Conflict resolution workflow tests

**Acceptance Criteria**:
- [ ] Conflicts are detected accurately
- [ ] Users are notified immediately when conflicts occur
- [ ] Resolution interface is clear and intuitive
- [ ] No data is lost during conflict resolution
- [ ] Performance doesn't degrade with multiple conflicts
- [ ] Undo/redo works after conflict resolution
- [ ] Version history is preserved correctly
- [ ] Merge functionality handles complex conflicts

**Estimated Time**: 10-12 hours

---

## 🏠 **EPIC 4: Navigation & Organization**
*Priority: P1 (User experience)*

### FE-010: Workspace & Page Navigation
**User Story**: As a user, I need intuitive navigation so that I can quickly access my content and workspaces.

**Technical Approach**:
- Create responsive sidebar with collapsible sections
- Implement hierarchical page tree with drag-and-drop
- Add breadcrumb navigation for deep pages
- Create quick search and recent pages

**Sidebar Navigation Structure**:
```typescript
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentWorkspace, workspaces } = useWorkspaceStore();
  const { pages, pageTree } = usePageStore();

  return (
    <div className={`bg-gray-50 border-r transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Workspace Selector */}
      <WorkspaceSelector
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        collapsed={isCollapsed}
      />

      {/* Quick Actions */}
      <div className="p-2 border-b">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <PanelLeftClose className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>

      {/* Page Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <PageTree
            pages={pageTree}
            collapsed={isCollapsed}
            onPageSelect={handlePageSelect}
            onPageMove={handlePageMove}
          />
        </div>
      </ScrollArea>

      {/* User Profile */}
      <UserProfile collapsed={isCollapsed} />
    </div>
  );
};
```

**Hierarchical Page Tree**:
```typescript
interface PageTreeNode {
  page: Page;
  children: PageTreeNode[];
  level: number;
}

const PageTreeItem = ({ 
  node, 
  collapsed, 
  onSelect, 
  onMove 
}: PageTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`group relative ${isDragging ? 'opacity-50' : ''}`}
      style={{ paddingLeft: `${node.level * 16}px` }}
    >
      <div className="flex items-center gap-1 py-1 px-2 rounded-md hover:bg-gray-100">
        {/* Expand/Collapse Button */}
        {node.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-4 h-4 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight 
              className={`w-3 h-3 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          </Button>
        )}

        {/* Page Icon */}
        <div className="w-4 h-4 text-muted-foreground">
          {node.page.emoji || <FileText className="w-3 h-3" />}
        </div>

        {/* Page Title */}
        <Button
          variant="ghost"
          className="flex-1 justify-start h-auto py-1 px-1 text-sm font-normal truncate"
          onClick={() => onSelect(node.page)}
        >
          {node.page.title || 'Untitled'}
        </Button>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDuplicate(node.page)}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(node.page)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {isExpanded && node.children.map(child => (
        <PageTreeItem
          key={child.page.id}
          node={child}
          collapsed={collapsed}
          onSelect={onSelect}
          onMove={onMove}
        />
      ))}
    </div>
  );
};
```

**Breadcrumb Navigation**:
```typescript
const BreadcrumbNav = ({ currentPage }: { currentPage: Page }) => {
  const breadcrumbs = useBreadcrumbs(currentPage);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((page, index) => (
        <div key={page.id} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-1 px-2"
            onClick={() => navigateToPage(page.id)}
          >
            {page.emoji && <span className="mr-1">{page.emoji}</span>}
            {page.title || 'Untitled'}
          </Button>
        </div>
      ))}
    </nav>
  );
};
```

**Testing Approach**:
- Unit: Navigation state management tests
- Integration: Page tree operations tests
- Accessibility: Keyboard navigation tests

**Acceptance Criteria**:
- [ ] Sidebar is responsive and collapsible
- [ ] Page tree accurately reflects hierarchy
- [ ] Drag-and-drop page moving works correctly
- [ ] Breadcrumbs show correct page path
- [ ] Quick actions are easily accessible
- [ ] Navigation state persists across sessions
- [ ] Performance handles large page trees (500+ pages)
- [ ] Mobile navigation is touch-friendly

**Estimated Time**: 10-12 hours

---

### FE-011: Search & Recent Pages
**User Story**: As a user, I need powerful search functionality so that I can quickly find the content I'm looking for.

**Technical Approach**:
- Implement global search with keyboard shortcut (Cmd+K)
- Add search suggestions and autocomplete
- Create recent pages list with quick access
- Add search filters for content type and workspace

**Global Search Modal**:
```typescript
const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentPages, setRecentPages] = useState<Page[]>([]);

  // Open search with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  const debouncedSearch = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.trim()) {
      const results = await searchAPI(searchQuery);
      setResults(results);
    } else {
      setResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <Command className="rounded-lg border-none shadow-none">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search pages and content..."
              value={query}
              onValueChange={setQuery}
              className="border-none focus:ring-0"
            />
          </div>

          <CommandList className="max-h-[400px]">
            {!query && (
              <CommandGroup heading="Recent Pages">
                {recentPages.map(page => (
                  <CommandItem
                    key={page.id}
                    onSelect={() => navigateToPage(page.id)}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-4">
                      {page.emoji || <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Last modified {formatRelativeTime(page.updatedAt)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {page.workspace.name}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query && results.length > 0 && (
              <CommandGroup heading="Search Results">
                {results.map(result => (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    query={query}
                    onSelect={() => navigateToResult(result)}
                  />
                ))}
              </CommandGroup>
            )}

            {query && results.length === 0 && (
              <CommandEmpty>No results found for "{query}"</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
```

**Search Result Highlighting**:
```typescript
const SearchResultItem = ({ 
  result, 
  query, 
  onSelect 
}: SearchResultItemProps) => {
  const highlightedTitle = highlightText(result.title, query);
  const highlightedContent = highlightText(result.excerpt, query);

  return (
    <CommandItem onSelect={onSelect} className="flex flex-col items-start gap-2 py-3">
      <div className="flex items-center gap-3 w-full">
        <div className="w-4 h-4">
          {result.emoji || getBlockTypeIcon(result.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="font-medium truncate"
            dangerouslySetInnerHTML={{ __html: highlightedTitle }}
          />
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{result.workspace}</span>
            <span>•</span>
            <span>{formatRelativeTime(result.updatedAt)}</span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {result.type}
        </Badge>
      </div>
      
      {result.excerpt && (
        <div 
          className="text-sm text-muted-foreground pl-7 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      )}
    </CommandItem>
  );
};

// Utility function to highlight search terms
const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
};
```

**Recent Pages Tracking**:
```typescript
const useRecentPages = () => {
  const [recentPages, setRecentPages] = useState<Page[]>([]);

  const addToRecent = useCallback((page: Page) => {
    setRecentPages(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== page.id);
      // Add to beginning
      const updated = [page, ...filtered];
      // Keep only last 10
      return updated.slice(0, 10);
    });
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentPages');
    if (stored) {
      try {
        setRecentPages(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recent pages:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recentPages', JSON.stringify(recentPages));
  }, [recentPages]);

  return { recentPages, addToRecent };
};
```

**Testing Approach**:
- Unit: Search functionality and highlighting tests
- Integration: Search API integration tests
- Accessibility: Keyboard navigation and screen reader tests

**Acceptance Criteria**:
- [ ] Global search opens with Cmd+K shortcut
- [ ] Search results are returned within 300ms
- [ ] Search terms are highlighted in results
- [ ] Recent pages are tracked and displayed
- [ ] Filters work correctly for different content types
- [ ] Search suggestions help with typos
- [ ] Empty states are handled gracefully
- [ ] Performance handles large result sets

**Estimated Time**: 8-10 hours

---

## 📋 **Frontend Development Summary**

### **Total Estimated Time**: 105-125 hours (3-4 weeks)

### **Sprint Breakdown**:
**Sprint 1 (Week 1)**: Foundation & Setup
- FE-001: Next.js Project Setup (6h)
- FE-002: Design System Implementation (10h)
- FE-003: State Management Setup (8h)
- **Total**: 24 hours

**Sprint 2 (Week 2)**: Content Editor
- FE-004: Block-Based Editor Foundation (15h)
- FE-005: Rich Text Editing (12h)
- FE-006: Block Type Selector (10h)
- **Total**: 37 hours

**Sprint 3 (Week 3)**: Real-time Collaboration
- FE-007: WebSocket Integration (10h)
- FE-008: Live Cursors & User Presence (15h)
- FE-009: Conflict Resolution UI (12h)
- **Total**: 37 hours

**Sprint 4 (Week 4)**: Navigation & Polish
- FE-010: Workspace & Page Navigation (12h)
- FE-011: Search & Recent Pages (10h)
- **Total**: 22 hours

### **Risk Mitigation**:
- **High Risk**: Real-time collaboration UI performance
- **Medium Risk**: Complex editor state management
- **Low Risk**: Navigation and search implementation

### **Success Metrics**:
- Editor performs smoothly with 100+ blocks
- Real-time updates appear within 50ms
- Search results returned within 300ms
- Mobile responsiveness works on all major devices
