# UX Design & User Flow Architecture

## Information Architecture

### Site Map
```
├── Authentication
│   ├── Login/Register
│   └── Password Reset
│
├── Workspace
│   ├── Dashboard (Home)
│   ├── Pages Hierarchy
│   │   ├── Page Editor (Block-based)
│   │   ├── Page History/Versions
│   │   └── Page Settings
│   │
│   ├── Search & Navigation
│   │   ├── Global Search
│   │   ├── Recent Pages
│   │   └── Favorites
│   │
│   ├── Team Collaboration
│   │   ├── Team Members
│   │   ├── Sharing & Permissions
│   │   └── Activity Feed
│   │
│   └── Settings
│       ├── Workspace Settings
│       ├── User Profile
│       └── Billing (Future)
│
└── Public
    ├── Shared Pages (Public/Team)
    └── Landing/Marketing
```

### Navigation Hierarchy

**Primary Navigation (Sidebar)**
1. **Dashboard** - Overview of workspace
2. **Pages** - Hierarchical page tree
3. **Search** - Global content search
4. **Shared with me** - Pages shared from other workspaces
5. **Trash** - Deleted pages

**Secondary Navigation (Top Bar)**
1. **Workspace Switcher** (if multiple workspaces)
2. **User Profile Menu**
3. **Notifications** (Activity feed)
4. **Share** (Current page sharing)

**Contextual Navigation (Page Level)**
1. **Breadcrumbs** - Page hierarchy
2. **Page Actions** - Delete, duplicate, export
3. **Comments** - Page-level discussions
4. **Version History** - Page revisions

### User Roles & Permissions

**Workspace Owner**
- Full admin access
- Manage team members
- Billing and workspace settings
- Delete workspace

**Workspace Admin**
- Manage team members (invite/remove)
- Workspace settings (except billing)
- Create/delete pages
- Manage permissions

**Editor**
- Create/edit/delete their own pages
- Edit shared pages with write access
- Comment on any accessible page
- Share pages they created

**Viewer**
- View pages with read access
- Comment on pages
- Cannot create/edit pages
- Cannot share pages

**Guest**
- Access specific shared pages only
- View-only access
- Cannot comment or edit
- No workspace navigation

## Primary User Flows

### 1. New User Onboarding Flow
```
[Landing Page] -> [Sign Up] -> [Email Verification] -> [Create Workspace] -> [Workspace Setup] -> [Create First Page] -> [Invite Team] -> [Dashboard]
       |              |                |                     |                    |                  |               |
   "Get Started"  Email/Password   Verify Email        Workspace Name      Choose Template    Basic Editor    Optional Skip
   Free Trial      or Google         Link             & Description        or Blank Page      Tutorial        to Dashboard
```

### 2. Daily Usage Flow (Returning User)
```
[Login] -> [Dashboard] -> [Recent Pages] -> [Select Page] -> [Edit Page] -> [Auto-save] -> [Share/Collaborate]
    |          |              |               |              |             |              |
Password    Overview of    Quick access   Page Editor   Real-time    Background    Team members
or SSO      activity       to work        with blocks   editing      saving        see changes
```

### 3. Page Creation & Editing Flow
```
[Dashboard/Any Page] -> [New Page] -> [Choose Template] -> [Page Editor] -> [Add Blocks] -> [Real-time Sync] -> [Save & Share]
         |                  |             |                 |              |               |                 |
    "+" Button or       Quick create   Text, Heading,     Block-based    Text, images,   Live cursors    Permission
    Keyboard shortcut   or template    Database, etc.     editor         tables, etc.    & presence      settings
```

### 4. Team Collaboration Flow
```
[Page Editor] -> [Share Button] -> [Set Permissions] -> [Invite Users] -> [Live Editing] -> [Comments] -> [Notifications]
      |              |                |                  |               |               |             |
  Real-time      Share modal     Read/Write/Admin    Email invites   Multiple       Contextual   Activity feed
  editing        popup           permissions         or links        cursors        comments     updates
```

### 5. Search & Navigation Flow
```
[Any Page] -> [Search Bar] -> [Search Results] -> [Select Result] -> [Navigate to Page]
     |             |               |                 |                  |
 Cmd+K or      Type query      Instant results    Click or Enter    Page loads with
 Click search  or use filters  with previews      to select         search term
```

## Alternative Flows (Edge Cases)

### 1. Network Disconnection During Editing
```
[Editing Page] -> [Network Loss] -> [Offline Indicator] -> [Local Changes Saved] -> [Network Restored] -> [Sync Conflicts] -> [Conflict Resolution]
      |              |                  |                     |                       |                   |                   |
  Real-time      Connection          Red banner           Local storage          Auto-detect         Show diff         User chooses
  collaboration  timeout detected    notification         saves changes          connection          of changes        resolution
```

### 2. Simultaneous Editing Conflicts
```
[User A Editing] -> [User B Edits Same Block] -> [Conflict Detection] -> [Real-time Merge] -> [Success/Conflict UI]
       |                    |                         |                     |                    |
   Block focus           Same block                Algorithm           Operational         Show resolved
   indicator             modified                  detects             Transform           or ask user
```

### 3. Permission Changes During Active Session
```
[User Editing] -> [Permission Revoked] -> [Access Denied] -> [Save Local Changes] -> [Notify User] -> [Redirect]
      |                 |                    |                 |                     |              |
  Active session    Admin removes        Real-time         Local storage        Modal popup    Safe location
  with write access  write permission     permission check  backup               explanation    (dashboard)
```

### 4. Page Deletion with Active Editors
```
[Page Being Edited] -> [Owner Deletes Page] -> [Active Users Notified] -> [Auto-save Changes] -> [Redirect with Recovery Option]
        |                      |                      |                       |                       |
   Multiple users          Delete action           Real-time notification   Save to local         Option to restore
   collaborating           by owner/admin          to all active users      storage backup        from trash
```

## Error States & Recovery Flows

### 1. Page Loading Failures
```
[Page Request] -> [Loading Timeout] -> [Error State] -> [Retry Options] -> [Fallback Content]
      |               |                  |               |                 |
   User clicks      Network/server     "Page failed    Manual retry      Cached version
   page link        error              to load"        or refresh        if available
```

### 2. Save Failures
```
[Auto-save] -> [Save Failed] -> [Retry Background] -> [User Notification] -> [Manual Save Option]
     |             |               |                    |                     |
  Every 2-3      Network or       3 automatic         Non-blocking        Force save
  seconds        server error     retry attempts      warning banner      button appears
```

### 3. Authentication Errors
```
[Session Expired] -> [Auto-refresh Token] -> [Success/Failure] -> [Redirect to Login] -> [Return to Page]
       |                   |                    |                   |                      |
   API request          Background refresh   Token valid/invalid  Preserve current      After re-auth
   returns 401          attempt               check                page URL              redirect back
```

### 4. Workspace Access Errors
```
[Workspace Request] -> [Permission Denied] -> [Error Page] -> [Contact Admin/Support] -> [Alternative Actions]
        |                    |                   |               |                       |
   User tries to        Not member or        Clear error      Email links or         Join different
   access workspace     access revoked       explanation      help documentation     workspace
```

## Responsive Breakpoints

### Desktop (1024px+)
- Full sidebar navigation
- Multi-panel layout (sidebar + main + inspector)
- Full block palette and toolbars
- Advanced keyboard shortcuts

### Tablet (768px - 1023px)
- Collapsible sidebar
- Main content takes priority
- Touch-optimized block handles
- Simplified toolbars

### Mobile (320px - 767px)
- Hidden sidebar (hamburger menu)
- Single-panel focus
- Touch gestures for editing
- Bottom toolbar for actions
- Simplified page hierarchy

## Accessibility Requirements (WCAG 2.1 AA)

### Keyboard Navigation
- All interactive elements accessible via keyboard
- Logical tab order throughout application
- Custom keyboard shortcuts documented
- Skip links for main content areas

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Alt text for all images and icons
- Live regions for real-time updates

### Visual Accessibility
- Color contrast ratio minimum 4.5:1
- Focus indicators on all interactive elements
- No reliance on color alone for information
- Scalable text up to 200% without horizontal scroll

### Motor Accessibility
- Large touch targets (minimum 44px)
- Drag and drop alternatives
- Sufficient time for timed actions
- Click/tap alternatives for hover actions

### Cognitive Accessibility
- Clear, consistent navigation
- Error messages with helpful suggestions
- Progress indicators for multi-step processes
- Undo functionality for destructive actions

## Performance Considerations

### Page Load Optimization
- Initial page load under 2 seconds
- Time to first meaningful paint under 1 second
- Progressive loading of page content
- Skeleton screens during loading states

### Real-time Sync Performance
- Changes reflected in under 100ms
- Optimistic UI updates
- Conflict resolution without blocking
- Efficient WebSocket connection management

### Mobile Performance
- Touch response under 16ms
- Smooth scrolling at 60fps
- Optimized for slower connections
- Reduced data usage for mobile users

## ASCII Wireframes

### 1. Dashboard (Desktop)
```
┌────────────────────────────────────────────────────────────────────────────┐
│ [≡] WorkSpace Name                    [🔍] [🔔] [👤] Profile          │
├─────────────┬──────────────────────────────────────────────────────────────┤
│             │  Good morning, John! 👋                                     │
│ 📊 Dashboard │                                                              │
│ 📄 Pages     │  ┌─── Recent Pages ────┐  ┌─── Quick Actions ─────┐        │
│   ├─ Project │  │ 📄 Meeting Notes     │  │ ➕ New Page            │        │
│   ├─ Team    │  │ 📋 Project Roadmap   │  │ 📊 New Database        │        │
│   └─ Ideas   │  │ 💡 Product Ideas     │  │ 👥 Invite Team         │        │
│              │  │ 📝 Weekly Report     │  │ 🔗 Import Content      │        │
│ 🔍 Search    │  └─────────────────────┘  └───────────────────────┘        │
│ 👥 Shared    │                                                              │
│ 🗑 Trash      │  ┌─── Team Activity ────┐  ┌─── Templates ────────┐        │
│              │  │ Alice edited "Project │  │ 📋 Project Plan       │        │
│              │  │ Roadmap" 2 min ago    │  │ 📝 Meeting Notes      │        │
│              │  │                       │  │ 💼 Team Wiki          │        │
│              │  │ Bob commented on      │  │ 🎯 Goal Tracker       │        │
│              │  │ "Team Updates"        │  │                       │        │
│              │  └─────────────────────┘  └───────────────────────┘        │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

### 2. Page Editor (Desktop)
```
┌────────────────────────────────────────────────────────────────────────────┐
│ [≡] WorkSpace Name                    [🔍] [🔔] [👤] Profile          │
├─────────────┬──────────────────────────────────────────────────────────────┤
│             │ Home > Projects > Meeting Notes        [👥2] [💬3] [📤Share]│
│ 📊 Dashboard │                                                              │
│ 📄 Pages     │ # Meeting Notes                                      [⋯Menu] │
│   ├─ Project │ March 15, 2024                                               │
│   ├─ Team    │                                                              │
│   └─ Ideas   │ ┌─[📝] Type '/' for blocks                                   │
│              │ │                                                            │
│ 🔍 Search    │ │ ## Action Items                                           │
│ 👥 Shared    │ │ - [ ] Review Q1 budget proposal                           │
│ 🗑 Trash      │ │ - [x] Schedule design review meeting                      │
│              │ │ - [ ] Update project timeline                             │
│              │ │                                                            │
│              │ │ ## Discussion Points                                       │
│              │ │ The team discussed the upcoming product launch...         │
│              │ │                                        ← Alice's cursor    │
│              │ │ ┌─── Block Menu ───┐                                       │
│              │ │ │ 📝 Text          │ Bob is typing...                     │
│              │ │ │ 📋 To-do list    │                                       │
│              │ │ │ 🏷 Heading       │                                       │
│              │ │ │ 💾 Database      │                                       │
│              │ │ │ 🖼 Image         │                                       │
│              │ │ └─────────────────┘                                       │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

### 3. Mobile Dashboard
```
┌──────────────────────────────┐
│ [≡]    WorkSpace    [👤] [🔔] │
├──────────────────────────────┤
│                              │
│  Good morning! 👋             │
│                              │
│ ┌─── Recent Pages ─────────┐ │
│ │ 📄 Meeting Notes         │ │
│ │ 📋 Project Roadmap       │ │
│ │ 💡 Product Ideas         │ │
│ │ 📝 Weekly Report         │ │
│ └─────────────────────────┘ │
│                              │
│ ┌─── Quick Actions ────────┐ │
│ │ ➕ New Page              │ │
│ │ 📊 New Database          │ │
│ │ 👥 Invite Team           │ │
│ └─────────────────────────┘ │
│                              │
│ ┌─── Activity ─────────────┐ │
│ │ Alice edited "Roadmap"   │ │
│ │ 2 min ago               │ │
│ │                          │ │
│ │ Bob added comment        │ │
│ │ 5 min ago               │ │
│ └─────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### 4. Mobile Page Editor
```
┌──────────────────────────────┐
│ [←] Meeting Notes      [⋯][👥]│
├──────────────────────────────┤
│                              │
│ # Meeting Notes              │
│ March 15, 2024               │
│                              │
│ ## Action Items              │
│ ☐ Review Q1 budget           │
│ ☑ Schedule design review     │
│ ☐ Update timeline            │
│                              │
│ ## Discussion Points         │
│ The team discussed the       │
│ upcoming product launch...   │
│ │                           │
│ │                           │
│ ┌─────────────────────────── │
│ │ [+] [B] [I] [🎨] [📎] [💬] │ 
│ └─────────────────────────── │
│     Editing Toolbar          │
└──────────────────────────────┘
```

### 5. Collaboration States
```
Desktop Editor with Live Collaboration:

┌─────────────────────────────────────────────────────────────────┐
│ │ ## Discussion Points                                          │
│ │                                                               │
│ │ The team discussed the upcoming product launch and           │
│ │ identified key milestones for Q2. We need to focus on       │
│ │ user acquisition strategies and...                           │
│ │                               ↑ Alice (typing...)           │
│ │                                                               │
│ │ ### Key Decisions                                             │
│ │ 1. Launch date: April 30th  ← Bob (selecting)               │
│ │ 2. Marketing budget: $50k                                     │
│ │ 3. Team structure: Adding 2 devs ← Carol (cursor here)      │
│ │                                                               │
│ └─────────────────────────────────────────────────────────────┘

Legend:
↑ Active typing cursor with user name
← Static cursor position with user name  
() Live activity indicator
```

### 6. Search Interface
```
Desktop Search Results:

┌─────────────┬─────────────────────────────────────────────────────────┐
│             │ [🔍] "project timeline"                           [×]   │
│             ├─────────────────────────────────────────────────────────┤
│ 🔍 Search    │ ⚡ Instant Results                                      │
│             │                                                         │
│ Filters:    │ 📄 Project Roadmap                              Updated │
│ □ Pages     │ Contains: ...timeline for Q2 showing key milestones... │
│ □ Comments  │                                                 2d ago │
│ □ Tasks     │                                                         │
│             │ 📝 Meeting Notes - March 15                     Updated │
│ Date:       │ Contains: ...project timeline needs updating...         │
│ ○ All time  │                                                 1w ago │
│ ○ Past week │                                                         │
│ ○ Past month│ 💡 Q2 Planning                                  Updated │
│             │ Contains: ...timeline alignment with product...         │
│             │                                                 3d ago │
│             │                                                         │
│             │ No more results. Try different keywords?               │
└─────────────┴─────────────────────────────────────────────────────────┘
```

### 7. Sharing & Permissions Modal
```
Desktop Sharing Modal:

┌───────────────────────────────────────────┐
│ Share "Meeting Notes"                 [×] │
├───────────────────────────────────────────┤
│                                           │
│ 👥 People with access                     │
│ ┌───────────────────────────────────────┐ │
│ │ 👤 Alice Chen        Owner    [Admin▼]│ │
│ │ 👤 Bob Smith         Editor   [Edit▼] │ │
│ │ 👤 Carol Johnson    Viewer   [View▼]  │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ ➕ Add people                             │
│ ┌───────────────────────────────────────┐ │
│ │ Enter email or name...                │ │
│ └───────────────────────────────────────┘ │
│ Permission: [Editor ▼]                   │
│                                           │
│ 🔗 Share with link                       │
│ ┌───────────────────────────────────────┐ │
│ │ Anyone with link can view             │ │
│ │ https://workspace.com/meeting-notes   │ │
│ │                          [Copy] [⚙️] │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ [Cancel]                      [Share]    │
└───────────────────────────────────────────┘
```

## Interaction Annotations

### Block Editor Interactions
- **Hover**: Show grab handle and block menu button
- **Focus**: Show formatting toolbar above/below block
- **Drag**: Visual feedback with drop zones
- **Type '/'**: Open block type selector menu
- **Enter**: Create new block below
- **Backspace on empty**: Delete block or merge with above

### Collaboration Indicators
- **User cursors**: Colored cursor with name label
- **Typing indicators**: "UserName is typing..." with animated dots
- **Selection highlights**: Colored background for selected text
- **Presence indicators**: User avatars in top bar
- **Conflict resolution**: Side-by-side diff view when needed

### Mobile Gestures
- **Swipe left**: Quick actions menu (share, delete, duplicate)
- **Swipe right**: Back navigation or sidebar
- **Long press**: Context menu for blocks
- **Pull down**: Refresh content
- **Pinch**: Zoom text (accessibility)
- **Double tap**: Quick edit mode
