import { 
  pgTable, 
  text, 
  varchar, 
  uuid, 
  timestamp, 
  integer, 
  boolean, 
  jsonb,
  index,
  primaryKey,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRole = pgEnum('user_role', ['owner', 'admin', 'member', 'viewer']);
export const blockType = pgEnum('block_type', ['paragraph', 'heading1', 'heading2', 'heading3', 'bullet_list', 'numbered_list', 'todo', 'code']);

// Users table - Core authentication and user data
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar_url: text('avatar_url'),
  password_hash: text('password_hash').notNull(),
  is_verified: boolean('is_verified').default(false).notNull(),
  verification_token: text('verification_token'),
  reset_token: text('reset_token'),
  reset_token_expires: timestamp('reset_token_expires'),
  last_active: timestamp('last_active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  lastActiveIdx: index('users_last_active_idx').on(table.last_active),
}));

// Workspaces table - Top-level containers for collaboration
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  is_public: boolean('is_public').default(false).notNull(),
  invite_code: varchar('invite_code', { length: 50 }).unique(),
  invite_expires: timestamp('invite_expires'),
  created_by: uuid('created_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('workspaces_slug_idx').on(table.slug),
  createdByIdx: index('workspaces_created_by_idx').on(table.created_by),
  inviteCodeIdx: index('workspaces_invite_code_idx').on(table.invite_code),
}));

// User workspace relationships - RBAC permissions
export const userWorkspaces = pgTable('user_workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  workspace_id: uuid('workspace_id').notNull().references(() => workspaces.id),
  role: userRole('role').default('member').notNull(),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
  invited_by: uuid('invited_by').references(() => users.id),
}, (table) => ({
  userWorkspaceIdx: index('user_workspaces_user_workspace_idx').on(table.user_id, table.workspace_id),
  workspaceRoleIdx: index('user_workspaces_workspace_role_idx').on(table.workspace_id, table.role),
}));

// Pages table - Documents/pages within workspaces
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull().default('Untitled'),
  slug: varchar('slug', { length: 200 }).notNull(),
  workspace_id: uuid('workspace_id').notNull().references(() => workspaces.id),
  parent_id: uuid('parent_id'), // For hierarchical pages
  is_public: boolean('is_public').default(false).notNull(),
  public_token: varchar('public_token', { length: 100 }).unique(),
  icon: text('icon'),
  cover_image: text('cover_image'),
  is_archived: boolean('is_archived').default(false).notNull(),
  is_template: boolean('is_template').default(false).notNull(),
  template_description: text('template_description'),
  sort_order: integer('sort_order').default(0).notNull(),
  created_by: uuid('created_by').notNull().references(() => users.id),
  last_edited_by: uuid('last_edited_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  workspaceSlugIdx: index('pages_workspace_slug_idx').on(table.workspace_id, table.slug),
  parentIdx: index('pages_parent_idx').on(table.parent_id),
  publicTokenIdx: index('pages_public_token_idx').on(table.public_token),
  createdByIdx: index('pages_created_by_idx').on(table.created_by),
  updatedAtIdx: index('pages_updated_at_idx').on(table.updated_at),
  archivedIdx: index('pages_archived_idx').on(table.is_archived),
}));

// Blocks table - Content blocks within pages (Notion-style)
export const blocks = pgTable('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  page_id: uuid('page_id').notNull().references(() => pages.id),
  parent_block_id: uuid('parent_block_id'), // For nested blocks
  type: blockType('type').notNull().default('paragraph'),
  content: jsonb('content').notNull().default('{}'), // Flexible content storage
  properties: jsonb('properties').default('{}'), // Block-specific properties (color, alignment, etc.)
  sort_order: integer('sort_order').default(0).notNull(),
  indent_level: integer('indent_level').default(0).notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  created_by: uuid('created_by').notNull().references(() => users.id),
  last_edited_by: uuid('last_edited_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pageOrderIdx: index('blocks_page_order_idx').on(table.page_id, table.sort_order),
  parentBlockIdx: index('blocks_parent_block_idx').on(table.parent_block_id),
  typeIdx: index('blocks_type_idx').on(table.type),
  updatedAtIdx: index('blocks_updated_at_idx').on(table.updated_at),
  deletedIdx: index('blocks_deleted_idx').on(table.is_deleted),
}));

// Block versions - For conflict resolution and history
export const blockVersions = pgTable('block_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  block_id: uuid('block_id').notNull().references(() => blocks.id),
  version: integer('version').notNull(),
  content: jsonb('content').notNull(),
  properties: jsonb('properties').default('{}'),
  created_by: uuid('created_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  blockVersionIdx: index('block_versions_block_version_idx').on(table.block_id, table.version),
  createdAtIdx: index('block_versions_created_at_idx').on(table.created_at),
}));

// User presence - Real-time collaboration tracking
export const userPresence = pgTable('user_presence', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  page_id: uuid('page_id').notNull().references(() => pages.id),
  cursor_position: jsonb('cursor_position'), // { blockId: string, offset: number }
  selection: jsonb('selection'), // { start: {...}, end: {...} }
  is_typing: boolean('is_typing').default(false).notNull(),
  last_seen: timestamp('last_seen').defaultNow().notNull(),
  connection_id: varchar('connection_id', { length: 100 }), // Socket.io connection ID
}, (table) => ({
  userPageIdx: index('user_presence_user_page_idx').on(table.user_id, table.page_id),
  lastSeenIdx: index('user_presence_last_seen_idx').on(table.last_seen),
  connectionIdx: index('user_presence_connection_idx').on(table.connection_id),
}));

// Comments table - Page and block commenting system
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  page_id: uuid('page_id').notNull().references(() => pages.id),
  block_id: uuid('block_id').references(() => blocks.id), // Optional: comment on specific block
  parent_comment_id: uuid('parent_comment_id'), // For threaded comments
  content: text('content').notNull(),
  is_resolved: boolean('is_resolved').default(false).notNull(),
  resolved_by: uuid('resolved_by').references(() => users.id),
  resolved_at: timestamp('resolved_at'),
  created_by: uuid('created_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pageIdx: index('comments_page_idx').on(table.page_id),
  blockIdx: index('comments_block_idx').on(table.block_id),
  parentIdx: index('comments_parent_idx').on(table.parent_comment_id),
  resolvedIdx: index('comments_resolved_idx').on(table.is_resolved),
  createdAtIdx: index('comments_created_at_idx').on(table.created_at),
}));

// Workspace invites - Pending invitations
export const workspaceInvites = pgTable('workspace_invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: uuid('workspace_id').notNull().references(() => workspaces.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: userRole('role').default('member').notNull(),
  token: varchar('token', { length: 100 }).notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  invited_by: uuid('invited_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tokenIdx: index('workspace_invites_token_idx').on(table.token),
  emailWorkspaceIdx: index('workspace_invites_email_workspace_idx').on(table.email, table.workspace_id),
  expiresAtIdx: index('workspace_invites_expires_at_idx').on(table.expires_at),
}));

// Relations for Drizzle ORM
export const usersRelations = relations(users, ({ many }) => ({
  userWorkspaces: many(userWorkspaces),
  createdWorkspaces: many(workspaces),
  createdPages: many(pages),
  editedPages: many(pages),
  createdBlocks: many(blocks),
  editedBlocks: many(blocks),
  blockVersions: many(blockVersions),
  presence: many(userPresence),
  comments: many(comments),
  sentInvites: many(workspaceInvites),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  creator: one(users, {
    fields: [workspaces.created_by],
    references: [users.id],
  }),
  userWorkspaces: many(userWorkspaces),
  pages: many(pages),
  invites: many(workspaceInvites),
}));

export const userWorkspacesRelations = relations(userWorkspaces, ({ one }) => ({
  user: one(users, {
    fields: [userWorkspaces.user_id],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [userWorkspaces.workspace_id],
    references: [workspaces.id],
  }),
  inviter: one(users, {
    fields: [userWorkspaces.invited_by],
    references: [users.id],
  }),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [pages.workspace_id],
    references: [workspaces.id],
  }),
  parent: one(pages, {
    fields: [pages.parent_id],
    references: [pages.id],
  }),
  children: many(pages),
  creator: one(users, {
    fields: [pages.created_by],
    references: [users.id],
  }),
  lastEditor: one(users, {
    fields: [pages.last_edited_by],
    references: [users.id],
  }),
  blocks: many(blocks),
  presence: many(userPresence),
  comments: many(comments),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  page: one(pages, {
    fields: [blocks.page_id],
    references: [pages.id],
  }),
  parentBlock: one(blocks, {
    fields: [blocks.parent_block_id],
    references: [blocks.id],
  }),
  childBlocks: many(blocks),
  creator: one(users, {
    fields: [blocks.created_by],
    references: [users.id],
  }),
  lastEditor: one(users, {
    fields: [blocks.last_edited_by],
    references: [users.id],
  }),
  versions: many(blockVersions),
  comments: many(comments),
}));

export const blockVersionsRelations = relations(blockVersions, ({ one }) => ({
  block: one(blocks, {
    fields: [blockVersions.block_id],
    references: [blocks.id],
  }),
  creator: one(users, {
    fields: [blockVersions.created_by],
    references: [users.id],
  }),
}));

export const userPresenceRelations = relations(userPresence, ({ one }) => ({
  user: one(users, {
    fields: [userPresence.user_id],
    references: [users.id],
  }),
  page: one(pages, {
    fields: [userPresence.page_id],
    references: [pages.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  page: one(pages, {
    fields: [comments.page_id],
    references: [pages.id],
  }),
  block: one(blocks, {
    fields: [comments.block_id],
    references: [blocks.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parent_comment_id],
    references: [comments.id],
  }),
  replies: many(comments),
  creator: one(users, {
    fields: [comments.created_by],
    references: [users.id],
  }),
  resolver: one(users, {
    fields: [comments.resolved_by],
    references: [users.id],
  }),
}));

export const workspaceInvitesRelations = relations(workspaceInvites, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceInvites.workspace_id],
    references: [workspaces.id],
  }),
  inviter: one(users, {
    fields: [workspaceInvites.invited_by],
    references: [users.id],
  }),
}));

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type UserWorkspace = typeof userWorkspaces.$inferSelect;
export type NewUserWorkspace = typeof userWorkspaces.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Block = typeof blocks.$inferSelect;
export type NewBlock = typeof blocks.$inferInsert;
export type BlockVersion = typeof blockVersions.$inferSelect;
export type NewBlockVersion = typeof blockVersions.$inferInsert;
export type UserPresence = typeof userPresence.$inferSelect;
export type NewUserPresence = typeof userPresence.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type WorkspaceInvite = typeof workspaceInvites.$inferSelect;
export type NewWorkspaceInvite = typeof workspaceInvites.$inferInsert;
