import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import {
  users,
  workspaces,
  userWorkspaces,
  pages,
  blocks,
  blockVersions,
  userPresence,
  comments,
  workspaceInvites,
  type NewUser,
  type NewWorkspace,
  type NewUserWorkspace,
  type NewPage,
  type NewBlock,
  type NewBlockVersion,
} from '../db/schema';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

async function seedDatabase() {
  console.log('🌱 Seeding database with comprehensive test data...');
  
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  
  try {
    // Clear existing data (in correct order to avoid FK constraints)
    console.log('🧹 Clearing existing data...');
    await db.delete(blockVersions);
    await db.delete(comments);
    await db.delete(userPresence);
    await db.delete(blocks);
    await db.delete(pages);
    await db.delete(workspaceInvites);
    await db.delete(userWorkspaces);
    await db.delete(workspaces);
    await db.delete(users);

    // Create users (50+ users for realistic testing)
    console.log('👥 Creating users...');
    const hashedPassword = await argon2.hash('password123');
    
    const testUsers: NewUser[] = [
      // Primary test users
      {
        email: 'alice.cooper@example.com',
        name: 'Alice Cooper',
        password_hash: hashedPassword,
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b9bbb9f4?w=150',
      },
      {
        email: 'bob.builder@example.com',
        name: 'Bob Builder',
        password_hash: hashedPassword,
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      },
      {
        email: 'charlie.brown@example.com',
        name: 'Charlie Brown',
        password_hash: hashedPassword,
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      {
        email: 'diana.prince@example.com',
        name: 'Diana Prince',
        password_hash: hashedPassword,
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      },
      {
        email: 'evan.peters@example.com',
        name: 'Evan Peters',
        password_hash: hashedPassword,
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
    ];

    // Generate 45 additional random users
    const firstNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Parker', 'Quinn', 'Sage', 'River', 'Phoenix', 'Avery', 'Cameron', 'Dakota', 'Emery'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    
    for (let i = 0; i < 45; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      testUsers.push({
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        name: `${firstName} ${lastName}`,
        password_hash: hashedPassword,
        is_verified: Math.random() > 0.2, // 80% verified
        avatar_url: `https://images.unsplash.com/photo-${1494790108755 + i}?w=150`,
      });
    }

    const createdUsers = await db.insert(users).values(testUsers).returning();
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create workspaces (10 workspaces)
    console.log('🏢 Creating workspaces...');
    const workspaceData: NewWorkspace[] = [
      {
        name: 'Acme Corp Engineering',
        slug: 'acme-corp-eng',
        description: 'Main engineering workspace for Acme Corporation',
        icon: '🏢',
        is_public: false,
        invite_code: 'ACME123',
        invite_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        created_by: createdUsers[0].id,
      },
      {
        name: 'Design Team',
        slug: 'design-team',
        description: 'Creative workspace for design collaboration',
        icon: '🎨',
        is_public: false,
        invite_code: 'DESIGN456',
        invite_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: createdUsers[1].id,
      },
      {
        name: 'Marketing Hub',
        slug: 'marketing-hub',
        description: 'Central hub for all marketing activities',
        icon: '📢',
        is_public: true,
        created_by: createdUsers[2].id,
      },
      {
        name: 'Product Management',
        slug: 'product-mgmt',
        description: 'Product strategy and roadmap planning',
        icon: '📋',
        is_public: false,
        created_by: createdUsers[3].id,
      },
      {
        name: 'DevOps & Infrastructure',
        slug: 'devops-infra',
        description: 'Infrastructure, deployment, and operations',
        icon: '⚙️',
        is_public: false,
        created_by: createdUsers[4].id,
      },
    ];

    // Generate 5 more random workspaces
    const workspaceNames = ['Sales Team', 'HR Department', 'Finance & Legal', 'Customer Support', 'Research & Development'];
    for (let i = 0; i < 5; i++) {
      workspaceData.push({
        name: workspaceNames[i],
        slug: workspaceNames[i].toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: `Collaborative workspace for ${workspaceNames[i]}`,
        icon: ['💰', '👥', '📊', '🎧', '🔬'][i],
        is_public: Math.random() > 0.7, // 30% public
        created_by: createdUsers[Math.floor(Math.random() * 10)].id,
      });
    }

    const createdWorkspaces = await db.insert(workspaces).values(workspaceData).returning();
    console.log(`✅ Created ${createdWorkspaces.length} workspaces`);

    // Create user-workspace relationships (realistic team sizes)
    console.log('🤝 Creating user-workspace relationships...');
    const userWorkspaceData: NewUserWorkspace[] = [];
    
    for (const workspace of createdWorkspaces) {
      // Add workspace creator as owner
      userWorkspaceData.push({
        user_id: workspace.created_by,
        workspace_id: workspace.id,
        role: 'owner',
      });

      // Add 3-8 random members to each workspace
      const memberCount = Math.floor(Math.random() * 6) + 3; // 3-8 members
      const availableUsers = createdUsers.filter(u => u.id !== workspace.created_by);
      
      for (let i = 0; i < Math.min(memberCount, availableUsers.length); i++) {
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        const roles = ['admin', 'member', 'viewer'] as const;
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        
        // Avoid duplicates
        if (!userWorkspaceData.find(uw => uw.user_id === randomUser.id && uw.workspace_id === workspace.id)) {
          userWorkspaceData.push({
            user_id: randomUser.id,
            workspace_id: workspace.id,
            role: randomRole,
          });
        }
      }
    }

    await db.insert(userWorkspaces).values(userWorkspaceData).returning();
    console.log(`✅ Created ${userWorkspaceData.length} user-workspace relationships`);

    // Create pages (200+ pages across workspaces)
    console.log('📄 Creating pages...');
    const pageData: NewPage[] = [];
    
    const pageTemplates = [
      { title: 'Project Kickoff', icon: '🚀', template: true },
      { title: 'Meeting Notes', icon: '📝' },
      { title: 'Technical Specification', icon: '🔧' },
      { title: 'Product Requirements', icon: '📋' },
      { title: 'Team Retrospective', icon: '🔄' },
      { title: 'Bug Reports', icon: '🐛' },
      { title: 'Feature Requests', icon: '💡' },
      { title: 'Documentation', icon: '📚' },
      { title: 'Roadmap', icon: '🗺️' },
      { title: 'Onboarding Guide', icon: '👋' },
    ];

    for (const workspace of createdWorkspaces) {
      // Create 15-25 pages per workspace
      const pageCount = Math.floor(Math.random() * 11) + 15; // 15-25 pages
      
      for (let i = 0; i < pageCount; i++) {
        const template = pageTemplates[Math.floor(Math.random() * pageTemplates.length)];
        const workspaceMembers = userWorkspaceData.filter(uw => uw.workspace_id === workspace.id);
        const randomMember = workspaceMembers[Math.floor(Math.random() * workspaceMembers.length)];
        
        pageData.push({
          title: `${template.title} ${i + 1}`,
          slug: `${template.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`,
          workspace_id: workspace.id,
          icon: template.icon,
          is_public: workspace.is_public && Math.random() > 0.7, // Some pages public if workspace is public
          is_template: template.template && i === 0, // First page of each type is a template
          template_description: template.template ? `Template for ${template.title}` : undefined,
          sort_order: i,
          created_by: randomMember.user_id,
          last_edited_by: randomMember.user_id,
        });
      }
    }

    const createdPages = await db.insert(pages).values(pageData).returning();
    console.log(`✅ Created ${createdPages.length} pages`);

    // Create blocks (1000+ blocks - realistic content)
    console.log('🧱 Creating content blocks...');
    const blockData: NewBlock[] = [];
    
    const sampleContent = {
      paragraph: [
        { text: 'This is a paragraph block with some sample content. It demonstrates how text flows naturally within our collaboration platform.' },
        { text: 'Here is another paragraph that shows how multiple text blocks can work together to create rich documents.' },
        { text: 'Product requirements should be clear, concise, and actionable. Each requirement should have clear acceptance criteria.' },
        { text: 'Our team follows agile methodology with two-week sprints and regular retrospectives to improve our processes.' },
      ],
      heading1: [
        { text: 'Project Overview' },
        { text: 'Technical Architecture' },
        { text: 'Implementation Plan' },
        { text: 'Meeting Summary' },
      ],
      heading2: [
        { text: 'Key Features' },
        { text: 'Requirements' },
        { text: 'Next Steps' },
        { text: 'Discussion Points' },
      ],
      heading3: [
        { text: 'Backend Components' },
        { text: 'Frontend Components' },
        { text: 'Testing Strategy' },
        { text: 'Deployment Process' },
      ],
      bullet_list: [
        { text: 'Implement user authentication' },
        { text: 'Create database schema' },
        { text: 'Build API endpoints' },
        { text: 'Design user interface' },
        { text: 'Write comprehensive tests' },
        { text: 'Set up CI/CD pipeline' },
      ],
      todo: [
        { text: 'Review pull request #123', checked: false },
        { text: 'Update documentation', checked: true },
        { text: 'Deploy to staging environment', checked: false },
        { text: 'Conduct user testing', checked: false },
        { text: 'Fix critical bug in payment flow', checked: true },
      ],
      code: [
        { text: 'npm install drizzle-orm', language: 'bash' },
        { text: 'const user = await db.select().from(users).where(eq(users.id, userId));', language: 'typescript' },
        { text: 'SELECT * FROM users WHERE active = true;', language: 'sql' },
        { text: 'git commit -m "Add user authentication"', language: 'bash' },
      ],
    };

    for (const page of createdPages.slice(0, 100)) { // Create blocks for first 100 pages to save time
      // Create 5-15 blocks per page
      const blockCount = Math.floor(Math.random() * 11) + 5; // 5-15 blocks
      const pageMembers = userWorkspaceData.filter(uw => uw.workspace_id === page.workspace_id);
      
      for (let i = 0; i < blockCount; i++) {
        const blockTypes = ['paragraph', 'heading1', 'heading2', 'heading3', 'bullet_list', 'todo', 'code'] as const;
        const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        const randomMember = pageMembers[Math.floor(Math.random() * pageMembers.length)];
        const contentArray = sampleContent[randomType];
        const randomContent = contentArray[Math.floor(Math.random() * contentArray.length)];

        blockData.push({
          page_id: page.id,
          type: randomType,
          content: randomContent,
          sort_order: i,
          indent_level: Math.random() > 0.8 ? 1 : 0, // 20% indented
          created_by: randomMember.user_id,
          last_edited_by: randomMember.user_id,
        });
      }
    }

    const createdBlocks = await db.insert(blocks).values(blockData).returning();
    console.log(`✅ Created ${createdBlocks.length} content blocks`);

    // Create some block versions (for conflict resolution testing)
    console.log('📖 Creating block versions...');
    const versionData: NewBlockVersion[] = [];
    
    // Create 2-3 versions for first 50 blocks
    for (const block of createdBlocks.slice(0, 50)) {
      const versionCount = Math.floor(Math.random() * 2) + 2; // 2-3 versions
      
      for (let v = 1; v <= versionCount; v++) {
        versionData.push({
          block_id: block.id,
          version: v,
          content: {
            ...(block.content as any),
            text: `${(block.content as any).text} (version ${v})`,
          },
          created_by: block.created_by,
        });
      }
    }

    await db.insert(blockVersions).values(versionData).returning();
    console.log(`✅ Created ${versionData.length} block versions`);

    // Create some workspace invites (pending invitations)
    console.log('📧 Creating workspace invites...');
    const inviteData = [];
    
    for (let i = 0; i < 20; i++) {
      const randomWorkspace = createdWorkspaces[Math.floor(Math.random() * createdWorkspaces.length)];
      const workspaceOwner = userWorkspaceData.find(uw => 
        uw.workspace_id === randomWorkspace.id && uw.role === 'owner'
      );
      
      inviteData.push({
        workspace_id: randomWorkspace.id,
        email: `invite${i}@example.com`,
        role: ['admin', 'member', 'viewer'][Math.floor(Math.random() * 3)] as any,
        token: uuidv4(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        invited_by: workspaceOwner!.user_id,
      });
    }

    await db.insert(workspaceInvites).values(inviteData).returning();
    console.log(`✅ Created ${inviteData.length} workspace invites`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🏢 Workspaces: ${createdWorkspaces.length}`);
    console.log(`   🤝 User-Workspace relationships: ${userWorkspaceData.length}`);
    console.log(`   📄 Pages: ${createdPages.length}`);
    console.log(`   🧱 Blocks: ${createdBlocks.length}`);
    console.log(`   📖 Block versions: ${versionData.length}`);
    console.log(`   📧 Pending invites: ${inviteData.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Email: alice.cooper@example.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedDatabase().catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
}
