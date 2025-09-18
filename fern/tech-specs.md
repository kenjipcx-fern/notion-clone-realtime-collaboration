# Technical Architecture & Specifications
## Realtime Collaboration Platform

### 🏗️ Technology Stack

#### Frontend Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS 3.x with CSS-in-JS fallback
- **State Management**: Zustand (lightweight, TypeScript-first)
- **UI Components**: shadcn/ui + Aceternity UI + Magic UI
- **Animation**: Framer Motion 10.x with performance optimizations
- **Real-time**: WebSocket client with Socket.io-client
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React (tree-shakeable)

#### Backend Stack
- **Runtime**: Node.js 20.x LTS
- **Framework**: Next.js API Routes + Express.js hybrid
- **Database**: PostgreSQL 16.x with connection pooling
- **ORM**: Drizzle ORM (TypeScript-native, performant)
- **Real-time**: Socket.io server with Redis adapter
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Caching**: Redis for sessions and real-time state
- **File Storage**: Local filesystem (morphvps), S3-compatible later

#### Development & Deployment
- **Development**: Bun for package management and dev server
- **TypeScript**: Strict mode with path aliases
- **Linting**: ESLint + Prettier + TypeScript ESLint
- **Testing**: Vitest + React Testing Library + Playwright
- **Deployment**: MorphVPS with PM2 process management
- **Database**: Local PostgreSQL instance
- **Monitoring**: Built-in logging with rotating files

### 🎯 Performance Budgets & Constraints

#### Bundle Size Targets
```
Initial Bundle:     < 150KB gzipped
Route Chunks:       < 50KB gzipped each  
Component Library:  < 100KB total
Animation Library:  < 30KB lazy-loaded
Total JS Payload:   < 300KB for first visit
```

#### Performance Metrics
```
Time to First Byte (TTFB):        < 200ms
First Contentful Paint (FCP):     < 800ms
Largest Contentful Paint (LCP):   < 1.2s
Cumulative Layout Shift (CLS):    < 0.1
First Input Delay (FID):          < 100ms
Real-time Sync Latency:           < 50ms
WebSocket Reconnection:           < 2s
```

#### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers
- **WebSocket Fallback**: Long polling for unsupported clients

### 🔐 Security Requirements (OWASP Compliance)

#### Authentication & Authorization
- **Session Management**: Secure HttpOnly cookies with SameSite
- **Password Security**: Argon2id hashing with salt
- **JWT Tokens**: Short-lived (15min) with refresh rotation
- **CSRF Protection**: Double-submit cookie pattern
- **Rate Limiting**: Progressive delays for failed attempts

#### Data Protection
- **Input Validation**: Zod schemas on client and server
- **SQL Injection**: Parameterized queries via Drizzle ORM
- **XSS Prevention**: Content Security Policy + sanitization
- **HTTPS Only**: TLS 1.3 with HSTS headers
- **Sensitive Data**: Encryption at rest for PII

#### Real-time Security
- **WebSocket Auth**: Token-based authentication per connection
- **Room Isolation**: Users can only access authorized workspaces
- **Message Validation**: All real-time messages schema-validated
- **Rate Limiting**: Per-user limits on message frequency

### 📈 Scalability Architecture

#### Horizontal Scaling Considerations
```
Current (MVP):     Single server, local DB
Phase 2 (Growth): Load balancer + 2-3 servers
Phase 3 (Scale):  Microservices + CDN + DB sharding
```

#### Caching Strategy
- **Static Assets**: Long-term caching with versioned URLs
- **API Responses**: Redis cache with TTL based on data type
- **User Sessions**: Redis store with sliding expiration
- **Real-time State**: In-memory cache with Redis backup
- **Database Queries**: Query result caching for read-heavy operations

#### Data Partitioning
- **Workspace Isolation**: Each workspace can be independent unit
- **User Sharding**: User data partitioned by user ID hash
- **Content Versioning**: Separate tables for current vs historical data
- **File Storage**: Hierarchical organization by workspace/user

---

## 📊 Database Architecture

### Entity Relationship Diagram
```
                    USERS
                      │
                      │ (1:N)
                      ▼
               USER_WORKSPACES ◄─── (N:1) ──── WORKSPACES
                      │                           │
                      │                           │ (1:N)
                      │                           ▼
                      │                         PAGES
                      │                           │
                      │                           │ (1:N) 
                      │                           ▼
                      │                        BLOCKS
                      │                           │
                      │ (1:N)                     │ (1:N)
                      ▼                           ▼
                USER_PRESENCE              BLOCK_VERSIONS
                      
                      
    WORKSPACE_INVITES                     COMMENTS
            │                               │
            │ (N:1)                         │ (N:1)
            ▼                               ▼
       WORKSPACES ◄── (1:N) ──── COMMENT_THREADS
            │
            │ (1:N)
            ▼
          PAGES

Relationships:
- Users ←→ UserWorkspaces (1:N) - User can be in multiple workspaces
- Workspaces ←→ UserWorkspaces (1:N) - Workspace can have multiple users
- Workspaces ←→ Pages (1:N) - Workspace contains multiple pages
- Pages ←→ Blocks (1:N) - Page contains multiple blocks
- Blocks ←→ BlockVersions (1:N) - Block has version history
- Users ←→ UserPresence (1:1) - Current user activity status
- Workspaces ←→ WorkspaceInvites (1:N) - Pending invitations
- Pages ←→ CommentThreads (1:N) - Comments on pages/blocks
```

### Core Tables Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active, last_seen);
```

#### Workspaces Table
```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
```

#### User-Workspace Relationships
```sql
CREATE TABLE user_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, workspace_id)
);

-- Indexes
CREATE INDEX idx_user_workspaces_user ON user_workspaces(user_id);
CREATE INDEX idx_user_workspaces_workspace ON user_workspaces(workspace_id);
```

#### Pages Table (Hierarchical Structure)
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled',
  slug VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- emoji or icon name
  cover_image VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  position INTEGER NOT NULL DEFAULT 0, -- for ordering
  
  UNIQUE(workspace_id, slug)
);

-- Indexes for hierarchical queries
CREATE INDEX idx_pages_workspace ON pages(workspace_id);
CREATE INDEX idx_pages_parent ON pages(parent_id);
CREATE INDEX idx_pages_position ON pages(workspace_id, position);
```

#### Blocks Table (Core Content)
```sql
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- text, heading, todo, image, code, etc.
  content JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1
);

-- Indexes for performance
CREATE INDEX idx_blocks_page ON blocks(page_id, position);
CREATE INDEX idx_blocks_parent ON blocks(parent_id);
CREATE INDEX idx_blocks_type ON blocks(type);
CREATE INDEX idx_blocks_content_gin ON blocks USING gin(content);
```

#### Block Versions (For History/Collaboration)
```sql
CREATE TABLE block_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  version INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_block_versions_block ON block_versions(block_id, version DESC);
```

### Indexes & Performance Optimization

#### Composite Indexes for Common Queries
```sql
-- Workspace content queries
CREATE INDEX idx_pages_workspace_position ON pages(workspace_id, position) 
  WHERE parent_id IS NULL;

-- Block hierarchy queries  
CREATE INDEX idx_blocks_page_parent_position ON blocks(page_id, parent_id, position);

-- User activity queries
CREATE INDEX idx_blocks_created_by_date ON blocks(created_by, created_at DESC);

-- Search optimization
CREATE INDEX idx_pages_title_trgm ON pages USING gin(title gin_trgm_ops);
CREATE INDEX idx_blocks_content_search ON blocks USING gin(
  (content->>'text') gin_trgm_ops
) WHERE type IN ('text', 'heading');
```

### Migration Strategy

#### Phase 1: Core Tables
```javascript
// migration-001-core-tables.ts
export async function up(db) {
  await db.execute(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.execute(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
  
  // Create tables in dependency order
  await createUsersTable(db);
  await createWorkspacesTable(db);
  await createUserWorkspacesTable(db);
  await createPagesTable(db);
  await createBlocksTable(db);
  await createBlockVersionsTable(db);
}
```

#### Phase 2: Real-time & Collaboration Tables
```sql
-- User presence tracking for real-time collaboration
CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  cursor_position JSONB, -- { blockId, offset, selection }
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_typing BOOLEAN DEFAULT false,
  typing_block_id UUID REFERENCES blocks(id) ON DELETE SET NULL
);

-- Comment system for collaboration
CREATE TABLE comment_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES comment_threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE -- for replies
);

-- Workspace invitations
CREATE TABLE workspace_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL, -- secure random token
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  
  UNIQUE(workspace_id, email)
);

-- User sessions for security tracking
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads tracking
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT false
);

-- Indexes for real-time tables
CREATE INDEX idx_user_presence_workspace_page ON user_presence(workspace_id, page_id);
CREATE INDEX idx_comment_threads_page ON comment_threads(page_id, created_at DESC);
CREATE INDEX idx_comments_thread ON comments(thread_id, created_at ASC);
CREATE INDEX idx_workspace_invites_token ON workspace_invites(token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id, expires_at DESC);
CREATE INDEX idx_file_uploads_workspace ON file_uploads(workspace_id, created_at DESC);
```

### Seed Data Requirements

#### Development Data
```javascript
// seed-dev.ts
const seedData = {
  users: [
    { email: 'admin@example.com', displayName: 'Admin User', role: 'admin' },
    { email: 'user1@example.com', displayName: 'John Doe', role: 'user' },
    { email: 'user2@example.com', displayName: 'Jane Smith', role: 'user' }
  ],
  workspaces: [
    { name: 'Demo Workspace', slug: 'demo', isPublic: true },
    { name: 'Private Workspace', slug: 'private', isPublic: false }
  ],
  sampleContent: {
    pages: 10, // Sample pages per workspace
    blocksPerPage: 5, // Sample blocks per page
    blockTypes: ['text', 'heading', 'todo', 'image']
  }
};
```

---

## 🚀 API Architecture

### RESTful Endpoint Structure

#### Authentication Endpoints
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Token refresh
GET    /api/auth/me                # Current user info
PATCH  /api/auth/profile           # Update profile
```

#### Workspace Management
```
GET    /api/workspaces             # List user workspaces
POST   /api/workspaces             # Create workspace
GET    /api/workspaces/:id         # Get workspace details
PATCH  /api/workspaces/:id         # Update workspace
DELETE /api/workspaces/:id         # Delete workspace
GET    /api/workspaces/:id/members # List workspace members
POST   /api/workspaces/:id/invite  # Invite user to workspace
```

#### Page Management
```
GET    /api/workspaces/:wid/pages          # List pages in workspace
POST   /api/workspaces/:wid/pages          # Create new page
GET    /api/pages/:id                      # Get page with blocks
PATCH  /api/pages/:id                      # Update page metadata
DELETE /api/pages/:id                      # Delete page
GET    /api/pages/:id/history             # Page version history
POST   /api/pages/:id/duplicate           # Duplicate page
```

#### Block Operations
```
POST   /api/pages/:pid/blocks              # Create new block
PATCH  /api/blocks/:id                     # Update block content
DELETE /api/blocks/:id                     # Delete block
POST   /api/blocks/:id/move               # Move block position
GET    /api/blocks/:id/versions           # Block version history
```

### Request/Response Schemas

#### User Authentication Schema
```typescript
// Registration Request
interface RegisterRequest {
  email: string;          // Valid email format
  password: string;       // Min 8 chars, mixed case, numbers
  displayName: string;    // 2-50 characters
}

// Login Response
interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
  accessToken: string;    // JWT, expires in 15min
  refreshToken: string;   // Secure cookie, expires in 7 days
}
```

#### Workspace Schema
```typescript
interface Workspace {
  id: string;
  name: string;           // 1-100 characters
  slug: string;          // URL-safe, 3-50 characters
  description?: string;   // Max 500 characters
  ownerId: string;
  isPublic: boolean;
  memberCount: number;
  createdAt: string;     // ISO 8601
  updatedAt: string;
}

interface CreateWorkspaceRequest {
  name: string;
  slug?: string;         // Auto-generated if not provided
  description?: string;
  isPublic?: boolean;    // Default: false
}
```

#### Page & Block Schema
```typescript
interface Page {
  id: string;
  workspaceId: string;
  parentId?: string;
  title: string;
  slug: string;
  icon?: string;         // Emoji or icon name
  coverImage?: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  position: number;
  blocks?: Block[];      // Included when fetching full page
}

interface Block {
  id: string;
  pageId: string;
  parentId?: string;
  type: BlockType;
  content: BlockContent;
  position: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

type BlockType = 'text' | 'heading' | 'todo' | 'image' | 'code' | 'quote';

type BlockContent = {
  text?: string;
  level?: number;        // For headings (1-3)
  checked?: boolean;     // For todos
  url?: string;          // For images
  language?: string;     // For code blocks
  alt?: string;          // For images
  [key: string]: any;    // Extensible for future block types
};
```

### Authentication & Authorization Strategy

#### JWT Token Structure
```typescript
interface JWTPayload {
  sub: string;           // User ID
  email: string;
  role: 'admin' | 'user';
  iat: number;           // Issued at
  exp: number;           // Expires at (15 min)
}
```

#### Permission System
```typescript
enum WorkspaceRole {
  OWNER = 'owner',       // Full access
  ADMIN = 'admin',       // Can manage members, pages
  MEMBER = 'member',     // Can edit content
  VIEWER = 'viewer'      // Read-only access
}

interface Permission {
  canCreatePage: boolean;
  canEditPage: boolean;
  canDeletePage: boolean;
  canInviteMembers: boolean;
  canManageMembers: boolean;
  canManageWorkspace: boolean;
}
```

### Rate Limiting Rules

#### API Rate Limits
```typescript
const rateLimits = {
  // Authentication endpoints
  'POST:/api/auth/login': '5/min',
  'POST:/api/auth/register': '3/min',
  
  // Content creation
  'POST:/api/workspaces': '10/hour',
  'POST:/api/pages': '100/hour',
  'POST:/api/blocks': '500/hour',
  
  // Content updates
  'PATCH:/api/blocks/*': '1000/hour',
  'PATCH:/api/pages/*': '200/hour',
  
  // General API access
  'GET:/api/*': '1000/hour',
  
  // Real-time WebSocket
  'ws:message': '100/min',
  'ws:typing': '30/min'
};
```

### Error Response Standards

#### Error Response Format
```typescript
interface APIError {
  error: {
    code: string;         // Machine-readable error code
    message: string;      // Human-readable message
    details?: any;        // Additional error context
    timestamp: string;    // ISO 8601
    path: string;         // Request path
    requestId: string;    // For tracking
  };
}

// Common Error Codes
const ErrorCodes = {
  // Authentication
  'AUTH_INVALID_CREDENTIALS': 'Invalid email or password',
  'AUTH_TOKEN_EXPIRED': 'Access token has expired',
  'AUTH_INSUFFICIENT_PERMISSIONS': 'Insufficient permissions',
  
  // Validation
  'VALIDATION_FAILED': 'Request validation failed',
  'DUPLICATE_RESOURCE': 'Resource already exists',
  
  // Business Logic
  'WORKSPACE_NOT_FOUND': 'Workspace not found',
  'PAGE_NOT_FOUND': 'Page not found',
  'BLOCK_NOT_FOUND': 'Block not found',
  
  // System
  'RATE_LIMIT_EXCEEDED': 'Too many requests',
  'INTERNAL_SERVER_ERROR': 'Internal server error'
};
```

### API Versioning Strategy

#### Current Approach (v1)
- **URL Versioning**: `/api/v1/workspaces`
- **Header Versioning**: `Accept: application/vnd.api+json;version=1`
- **Backward Compatibility**: Maintain v1 for at least 12 months
- **Deprecation Process**: 6-month notice for breaking changes

#### Future Considerations
- **GraphQL Migration**: Consider for complex nested queries
- **WebSocket API**: Real-time operations via Socket.io
- **Batch Operations**: Bulk updates for performance

---

## ⚡ Real-time Architecture

### WebSocket Event System
```typescript
// Client -> Server Events
interface ClientEvents {
  'join-workspace': { workspaceId: string };
  'join-page': { pageId: string };
  'leave-page': { pageId: string };
  'cursor-move': { pageId: string, position: CursorPosition };
  'typing-start': { blockId: string };
  'typing-stop': { blockId: string };
  'block-edit': { blockId: string, content: any, version: number };
}

// Server -> Client Events
interface ServerEvents {
  'user-joined': { user: User, pageId: string };
  'user-left': { userId: string, pageId: string };
  'cursor-update': { userId: string, position: CursorPosition };
  'user-typing': { userId: string, blockId: string };
  'block-updated': { blockId: string, content: any, updatedBy: string };
  'sync-error': { error: string, blockId?: string };
}
```

This comprehensive technical architecture provides the foundation for building a high-performance, scalable real-time collaboration platform. The next step will be breaking this down into actionable development tasks! 🚀
