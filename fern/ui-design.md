# UI Design System & Component Architecture

## Design System Foundation

### Color Palette

#### Primary Brand Colors
```css
:root {
  /* Primary Blue - Main brand color */
  --primary: 221 83% 53%;           /* #2563eb - Primary buttons, links */
  --primary-foreground: 210 40% 98%; /* #f8fafc - Text on primary */
  
  /* Secondary Neutral - Supporting palette */
  --secondary: 210 40% 96%;         /* #f1f5f9 - Cards, subtle backgrounds */
  --secondary-foreground: 222 84% 5%; /* #0f172a - Text on secondary */
  
  /* Accent Blue - Interactive elements */
  --accent: 217 91% 60%;            /* #3b82f6 - Hover states, focus */
  --accent-foreground: 210 40% 98%; /* #f8fafc - Text on accent */
}
```

#### Semantic Colors
```css
:root {
  /* Success - Green palette */
  --success: 142 76% 36%;           /* #16a34a - Success states */
  --success-foreground: 356 29% 98%; /* #fefcfc - Text on success */
  
  /* Warning - Amber palette */
  --warning: 32 95% 44%;            /* #d97706 - Warning states */
  --warning-foreground: 20 14% 4%;  /* #0c0a09 - Text on warning */
  
  /* Destructive - Red palette */
  --destructive: 0 84% 60%;         /* #ef4444 - Error states */
  --destructive-foreground: 210 40% 98%; /* #f8fafc - Text on destructive */
  
  /* Info - Sky palette */
  --info: 199 89% 48%;              /* #0ea5e9 - Information states */
  --info-foreground: 210 40% 98%;  /* #f8fafc - Text on info */
}
```

#### Neutral Grayscale
```css
:root {
  /* Base neutral colors */
  --background: 0 0% 100%;          /* #ffffff - Page background */
  --foreground: 222 84% 5%;         /* #0f172a - Primary text */
  
  --card: 0 0% 100%;                /* #ffffff - Card backgrounds */
  --card-foreground: 222 84% 5%;    /* #0f172a - Card text */
  
  --popover: 0 0% 100%;             /* #ffffff - Dropdown backgrounds */
  --popover-foreground: 222 84% 5%; /* #0f172a - Dropdown text */
  
  --muted: 210 40% 96%;             /* #f1f5f9 - Subtle backgrounds */
  --muted-foreground: 215 13% 50%;  /* #64748b - Secondary text */
  
  --border: 214 32% 91%;            /* #e2e8f0 - Default borders */
  --input: 214 32% 91%;             /* #e2e8f0 - Input borders */
  --ring: 221 83% 53%;              /* #2563eb - Focus rings */
}

.dark {
  --background: 222 84% 5%;         /* #0f172a - Dark page background */
  --foreground: 210 40% 98%;        /* #f8fafc - Dark primary text */
  
  --card: 222 84% 5%;               /* #0f172a - Dark card backgrounds */
  --card-foreground: 210 40% 98%;   /* #f8fafc - Dark card text */
  
  --muted: 217 32% 17%;             /* #1e293b - Dark subtle backgrounds */
  --muted-foreground: 215 20% 65%;  /* #94a3b8 - Dark secondary text */
  
  --border: 217 32% 17%;            /* #1e293b - Dark borders */
  --input: 217 32% 17%;             /* #1e293b - Dark input borders */
}
```

#### Real-time Collaboration Colors
```css
:root {
  /* User presence indicators */
  --user-1: 217 91% 60%;            /* #3b82f6 - First user cursor */
  --user-2: 142 76% 36%;            /* #16a34a - Second user cursor */
  --user-3: 271 81% 56%;            /* #7c3aed - Third user cursor */
  --user-4: 339 82% 52%;            /* #e11d48 - Fourth user cursor */
  --user-5: 25 95% 53%;             /* #f97316 - Fifth user cursor */
  
  /* Collaboration states */
  --online: 142 76% 36%;            /* #16a34a - Online status */
  --away: 32 95% 44%;               /* #d97706 - Away status */
  --offline: 215 13% 50%;           /* #64748b - Offline status */
  --typing: 217 91% 60%;            /* #3b82f6 - Typing indicator */
}
```

### Typography Scale

#### Font Families
```css
:root {
  /* Primary font - Inter for body text */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  
  /* Monospace font - JetBrains Mono for code */
  --font-mono: 'JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  
  /* Display font - Inter for headings (consistent with body) */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### Type Scale (Perfect Fourth - 1.333 ratio)
```css
/* Tailwind custom font sizes */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* 12px - Small labels */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* 14px - Body small */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* 16px - Body text */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }  /* 18px - Large body */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px - Subheadings */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* 24px - H3 */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px - H2 */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px - H1 */
.text-5xl { font-size: 3rem; line-height: 1; }           /* 48px - Display */
.text-6xl { font-size: 3.75rem; line-height: 1; }        /* 60px - Hero */
```

#### Font Weights
```css
.font-light { font-weight: 300; }    /* Light - Subtle text */
.font-normal { font-weight: 400; }   /* Regular - Body text */
.font-medium { font-weight: 500; }   /* Medium - Emphasis */
.font-semibold { font-weight: 600; } /* Semi-bold - Headings */
.font-bold { font-weight: 700; }     /* Bold - Strong emphasis */
```

### Spacing System (8px Grid)

#### Base Unit: 8px
```css
/* Tailwind spacing scale */
.space-1 { margin: 0.25rem; }   /* 4px - Tight spacing */
.space-2 { margin: 0.5rem; }    /* 8px - Base unit */
.space-3 { margin: 0.75rem; }   /* 12px - Small gaps */
.space-4 { margin: 1rem; }      /* 16px - Standard spacing */
.space-6 { margin: 1.5rem; }    /* 24px - Medium spacing */
.space-8 { margin: 2rem; }      /* 32px - Large spacing */
.space-12 { margin: 3rem; }     /* 48px - Section spacing */
.space-16 { margin: 4rem; }     /* 64px - Page spacing */
.space-20 { margin: 5rem; }     /* 80px - Hero spacing */
```

#### Component-Specific Spacing
```css
/* Button padding */
.btn-sm { padding: 0.5rem 0.75rem; }     /* 8px 12px - Small buttons */
.btn-md { padding: 0.625rem 1rem; }      /* 10px 16px - Default buttons */
.btn-lg { padding: 0.75rem 1.5rem; }     /* 12px 24px - Large buttons */

/* Card padding */
.card-sm { padding: 1rem; }              /* 16px - Small cards */
.card-md { padding: 1.5rem; }            /* 24px - Default cards */
.card-lg { padding: 2rem; }              /* 32px - Large cards */

/* Form spacing */
.form-gap { gap: 1rem; }                 /* 16px - Form element spacing */
.field-gap { gap: 0.5rem; }              /* 8px - Label to input */
```

### Border Radius Standards

```css
/* Tailwind radius scale */
.rounded-none { border-radius: 0px; }
.rounded-sm { border-radius: 2px; }      /* Small - Borders, badges */
.rounded { border-radius: 4px; }         /* Default - Buttons, inputs */
.rounded-md { border-radius: 6px; }      /* Medium - Cards, modals */
.rounded-lg { border-radius: 8px; }      /* Large - Panels, sections */
.rounded-xl { border-radius: 12px; }     /* Extra large - Hero sections */
.rounded-2xl { border-radius: 16px; }    /* 2X large - Feature cards */
.rounded-full { border-radius: 9999px; } /* Full - Avatars, pills */
```

### Shadow/Elevation System

```css
/* Tailwind shadow scale - Elevation levels */
.shadow-none { box-shadow: none; }

/* Level 1 - Subtle elements */
.shadow-sm { 
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Level 2 - Cards, buttons */
.shadow { 
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Level 3 - Dropdowns, popovers */
.shadow-md { 
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Level 4 - Modals, tooltips */
.shadow-lg { 
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Level 5 - Full-screen overlays */
.shadow-xl { 
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Level 6 - Maximum elevation */
.shadow-2xl { 
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* Focus shadows */
.shadow-focus { 
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.5);
}
```

## Component Library Planning

### Shadcn/UI Base Components

#### Core UI Components
```
✅ Foundational Components (15)
├── Button (variants: default, destructive, outline, secondary, ghost, link)
├── Input (text, email, password, search)
├── Label (form labels with proper accessibility)
├── Textarea (multi-line text input)
├── Select (dropdown selection)
├── Checkbox (boolean input)
├── Radio Group (single selection from options)
├── Switch (toggle switch)
├── Slider (range input)
├── Card (content containers)
├── Badge (status indicators)
├── Avatar (user profile images)
├── Separator (visual dividers)
├── Skeleton (loading placeholders)
└── Progress (progress bars)

✅ Layout Components (8)
├── Dialog/Modal (overlays)
├── Sheet (slide-in panels)
├── Popover (floating content)
├── Tooltip (hover information)
├── Tabs (tabbed interfaces)
├── Accordion (collapsible sections)
├── Collapsible (expand/collapse content)
└── ScrollArea (custom scrollbars)

✅ Navigation Components (5)
├── Command (command palette)
├── Menubar (application menu)
├── Navigation Menu (site navigation)
├── Breadcrumb (page hierarchy)
└── Pagination (page navigation)

✅ Data Display (6)
├── Table (data tables)
├── Data Table (advanced tables)
├── Calendar (date selection)
├── Date Picker (date input)
├── Chart (data visualization)
└── Alert (notifications)
```

#### Component Variants & States

**Button Variants:**
```tsx
// Primary actions
<Button variant="default">Save Changes</Button>
<Button variant="destructive">Delete Page</Button>

// Secondary actions  
<Button variant="outline">Cancel</Button>
<Button variant="secondary">View Details</Button>
<Button variant="ghost">Close</Button>
<Button variant="link">Learn More</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><PlusIcon /></Button>
```

**Input States:**
```tsx
// States
<Input placeholder="Normal state" />
<Input placeholder="Disabled state" disabled />
<Input placeholder="Error state" error />
<Input placeholder="Success state" success />

// Types
<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="Email input" />
<Input type="password" placeholder="Password input" />
<Input type="search" placeholder="Search input" />
```

### Aceternity UI Advanced Animations

#### Magic Effects Components
```
✅ Text Animations (6)
├── Typewriter Effect (sequential character animation)
├── Text Generate Effect (word-by-word appearance)
├── Moving Border (animated border effects)
├── Wavy Background (dynamic wave patterns)
├── Spotlight Effect (following cursor highlight)
└── Text Reveal Card (sliding text reveals)

✅ Interactive Elements (8)
├── 3D Card Effect (perspective transforms)
├── Hover Effect (smooth hover transitions)
├── Moving Cards (subtle motion on scroll)
├── Animated Modal (entrance animations)
├── Floating Navbar (scroll-responsive navigation)
├── Sidebar (animated slide-in navigation)
├── Infinite Moving Cards (continuous carousel)
└── Card Stack (stackable card interactions)

✅ Background Effects (5)
├── Grid Background (animated grid patterns)
├── Dot Background (moving dot patterns)  
├── Aurora Background (gradient animations)
├── Meteor Effect (shooting star animations)
└── Particles (floating particle systems)

✅ Advanced Components (4)
├── Timeline (animated progress timeline)
├── File Upload (drag-and-drop with animation)
├── Multi-step Loader (progress animations)
└── Following Pointer (cursor-following effects)
```

### Magic UI Special Effects

#### Performance-Optimized Components
```
✅ Micro-interactions (10)
├── Ripple Effect (click feedback)
├── Magnetic Buttons (cursor attraction)
├── Shimmer Effect (loading states)
├── Glow Effect (focus enhancement)
├── Pulse Animation (attention drawing)
├── Scale Animation (hover feedback)
├── Rotate Animation (loading spinners)
├── Slide Animation (content transitions)
├── Fade Animation (smooth transitions)
└── Bounce Animation (playful feedback)

✅ Data Visualization (6)
├── Animated Counter (number counting up)
├── Progress Ring (circular progress)
├── Chart Animations (data visualization)
├── Loading Bars (progress indicators)
├── Status Indicators (real-time status)
└── Notification Badges (update indicators)
```

### Custom Component Architecture

#### Block Editor Components
```
📝 Content Blocks (ASCII Mockups)
┌─────────────────────────────────────┐
│ [≡] Text Block                   [⋯]│
├─────────────────────────────────────┤
│ Type here or press '/' for blocks   │
│ ▌                                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [#] Heading Block               [⋯] │  
├─────────────────────────────────────┤
│ # Large Heading                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [☐] Todo Block                  [⋯] │
├─────────────────────────────────────┤
│ ☐ Uncompleted task                  │
│ ☑ Completed task                    │
│ ☐ Another task                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [🖼] Image Block                 [⋯] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │     [📷] Upload Image           │ │
│ │   or drag and drop here        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [⚡] Code Block                  [⋯] │
├─────────────────────────────────────┤
│ ```javascript                       │
│ function hello() {                  │
│   console.log("Hello World!");     │
│ }                                   │
│ ```                                 │
└─────────────────────────────────────┘
```

#### Real-time Collaboration Components
```
👥 Collaboration UI (ASCII Mockups)
┌─────────────────────────────────────┐
│ Live Users: [👤Alice] [👤Bob] [👤C+] │
├─────────────────────────────────────┤
│ Alice is typing...          ● Online│
│                                     │
│ The team discussed the new▌         │
│                    ↑ Alice's cursor │
│ features and decided to             │
│ implement real-time collab.         │
│                             ↑ Bob   │
└─────────────────────────────────────┘

🔗 Sharing Modal
┌─────────────────────────────────────┐
│ Share "Project Roadmap"         [×] │
├─────────────────────────────────────┤
│ 👥 Team Members                     │
│ ┌─────────────────────────────────┐ │
│ │ 👤 alice@team.com   [Editor▼]  │ │
│ │ 👤 bob@team.com     [Viewer▼]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🔗 Public Link                      │
│ ┌─────────────────────────────────┐ │
│ │ Anyone with link can view       │ │
│ │ https://app.com/shared/abc123   │ │
│ │                    [Copy] [⚙️]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Cancel]                    [Share] │
└─────────────────────────────────────┘
```

#### Page Navigation Components
```
📱 Mobile Navigation
┌──────────────────────────────┐
│ [≡]    Workspace        [👤] │
├──────────────────────────────┤
│ 🔍 Search pages...           │
├──────────────────────────────┤
│ 📊 Dashboard                 │
│ 📄 Recent Pages              │
│   ├─ Meeting Notes      •    │
│   ├─ Project Plan           │
│   └─ Team Updates           │
│ 👥 Shared with me           │
│ ⭐ Favorites                │
│ 🗑 Trash                    │
└──────────────────────────────┘

🖥 Desktop Sidebar
┌─────────────┬────────────────┐
│ 📊 Dashboard │                │
│ 📄 Pages     │                │
│   📁 Work    │                │
│     📄 Plan  │   Main Content │
│     📄 Notes │     Area       │
│   📁 Personal│                │
│     📄 Ideas │                │
│ 🔍 Search    │                │
│ 👥 Shared    │                │
│ ⭐ Favorites  │                │
│ 🗑 Trash      │                │
└─────────────┴────────────────┘
```

## Interaction Design

### Framer Motion Animation Concepts

#### Animation Timing & Easing
```javascript
// Standard easing functions
const easings = {
  // Natural motion
  easeOut: [0.4, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1], 
  easeInOut: [0.4, 0.0, 0.2, 1],
  
  // Bouncy effects
  backOut: [0.34, 1.56, 0.64, 1],
  backIn: [0.36, 0, 0.66, -0.56],
  
  // Sharp transitions
  sharp: [0.4, 0.0, 0.6, 1],
  
  // Performance-focused
  fast: [0.25, 0.46, 0.45, 0.94],
}

// Animation durations (performance targets)
const durations = {
  instant: 0.1,    // Immediate feedback
  fast: 0.2,       // Hover states
  normal: 0.3,     // Standard transitions  
  slow: 0.5,       // Page transitions
  very_slow: 0.8,  // Hero animations
}
```

#### Hover State Animations
```tsx
// Button hover effects
const buttonHover = {
  scale: 1.02,
  y: -1,
  transition: { duration: 0.2, ease: "easeOut" }
}

// Card hover effects  
const cardHover = {
  y: -4,
  scale: 1.01,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  transition: { duration: 0.3, ease: "backOut" }
}

// Link hover effects
const linkHover = {
  color: "var(--primary)",
  transition: { duration: 0.2 }
}
```

#### Loading Animations
```tsx
// Skeleton loading (for content)
const skeletonPulse = {
  opacity: [0.5, 1, 0.5],
  transition: { 
    duration: 1.5, 
    repeat: Infinity,
    ease: "easeInOut"
  }
}

// Spinner loading (for actions)
const spinnerRotate = {
  rotate: [0, 360],
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }
}

// Progress bar loading
const progressBar = {
  scaleX: [0, 1],
  originX: 0,
  transition: { duration: 2, ease: "easeOut" }
}
```

#### Page Transition Animations
```tsx
// Page entrance animation
const pageEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

// Modal entrance animation
const modalEnter = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" }
}

// Slide-in sidebar animation
const sidebarSlide = {
  initial: { x: -300 },
  animate: { x: 0 },
  exit: { x: -300 },
  transition: { duration: 0.3, ease: "easeOut" }
}
```

#### Gesture Response Animations
```tsx
// Touch ripple effect
const rippleEffect = {
  scale: [0, 1],
  opacity: [0.8, 0],
  transition: { duration: 0.4, ease: "easeOut" }
}

// Drag feedback
const dragFeedback = {
  rotate: 5,
  scale: 1.05,
  zIndex: 999,
  transition: { duration: 0.2 }
}

// Swipe gesture response
const swipeResponse = {
  x: [-300, 0],
  opacity: [0, 1],
  transition: { duration: 0.3, ease: "backOut" }
}
```

### Real-time Collaboration Animations

#### User Presence Indicators
```tsx
// Online status pulse
const onlinePulse = {
  scale: [1, 1.2, 1],
  transition: { 
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

// Typing indicator
const typingIndicator = {
  y: [0, -4, 0],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut",
    staggerChildren: 0.1
  }
}

// Cursor movement
const cursorMove = {
  x: userCursor.x,
  y: userCursor.y,
  transition: { 
    type: "spring",
    stiffness: 500,
    damping: 30
  }
}
```

### Animation Priority Matrix

#### Performance Priority Levels
```
🔥 CRITICAL (must be 60fps)
├── Text cursor blinking
├── User cursor movements  
├── Scroll animations
├── Hover state changes
└── Focus ring animations

⚡ HIGH (should be smooth)
├── Page transitions
├── Modal open/close
├── Button interactions
├── Form validation feedback
└── Loading states

💫 MEDIUM (can drop frames)
├── Card hover effects
├── Sidebar animations
├── Tab transitions
├── Tooltip appearances
└── Badge animations

🎨 LOW (decorative only)
├── Background effects
├── Particle systems
├── Hero animations
├── Marketing elements
└── Easter eggs
```

#### Animation Timing Guidelines
```javascript
// Performance-based timing
const timing = {
  // Critical interactions - instant feedback
  microInteraction: "50ms",      // Hover states, button press
  
  // High priority - smooth but fast
  userFeedback: "100-200ms",     // Form validation, tooltips
  
  // Medium priority - natural feeling
  stateChange: "200-300ms",      // Tab switching, accordions
  
  // Low priority - can be slower
  pageTransition: "300-500ms",   // Route changes, modal open
  
  // Decorative - don't block UI
  decoration: "500ms+",          // Hero animations, effects
}
```

## Component States & Variants

### Interactive States
```css
/* Default state */
.component-default {
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s ease;
}

/* Hover state */
.component-hover {
  opacity: 0.9;
  transform: scale(1.02) translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Active/Pressed state */  
.component-active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
}

/* Focus state */
.component-focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--ring);
}

/* Disabled state */
.component-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Loading state */
.component-loading {
  opacity: 0.7;
  pointer-events: none;
  cursor: wait;
}
```

### Responsive Design Considerations

#### Breakpoint-Specific Animations
```css
/* Mobile - reduced motion */
@media (max-width: 768px) {
  .animation-heavy {
    animation: none;
    transition: none;
  }
  
  .hover-effect:hover {
    transform: none;
  }
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .subtle-effect {
    display: none;
  }
}
```

This design system provides the foundation for building our real-time collaboration platform with performance-first animations, accessible interactions, and a cohesive visual language that scales across all breakpoints while prioritizing speed and usability.
