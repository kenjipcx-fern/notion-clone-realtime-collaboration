import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/connection';
import { 
  workspaces, 
  userWorkspaces, 
  pages, 
  blocks, 
  users, 
  userPresence 
} from '@/db/schema';
import { eq, and, desc, count, gte } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

/**
 * GET /api/dashboard
 * Fetch dashboard statistics and recent activity
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual user ID from authentication
    const userId = '1064ba4f-b2cb-4ecb-8651-25b0bc207f3c'; // Alice Cooper's ID
    
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get statistics with separate simple queries to avoid parameter type issues
    
    // Total pages count
    const totalPagesResult = await db
      .select({ count: count() })
      .from(pages)
      .innerJoin(workspaces, eq(pages.workspace_id, workspaces.id))
      .innerJoin(userWorkspaces, eq(workspaces.id, userWorkspaces.workspace_id))
      .where(eq(userWorkspaces.user_id, userId));

    // Total blocks count  
    const totalBlocksResult = await db
      .select({ count: count() })
      .from(blocks)
      .innerJoin(pages, eq(blocks.page_id, pages.id))
      .innerJoin(workspaces, eq(pages.workspace_id, workspaces.id))
      .innerJoin(userWorkspaces, eq(workspaces.id, userWorkspaces.workspace_id))
      .where(
        and(
          eq(userWorkspaces.user_id, userId),
          eq(blocks.is_deleted, false)
        )
      );

    // Total workspaces count
    const totalWorkspacesResult = await db
      .select({ count: count() })
      .from(userWorkspaces)
      .where(eq(userWorkspaces.user_id, userId));

    // Pages created this week
    const pagesThisWeekResult = await db
      .select({ count: count() })
      .from(pages)
      .innerJoin(workspaces, eq(pages.workspace_id, workspaces.id))
      .innerJoin(userWorkspaces, eq(workspaces.id, userWorkspaces.workspace_id))
      .where(
        and(
          eq(userWorkspaces.user_id, userId),
          gte(pages.created_at, oneWeekAgo)
        )
      );

    // For now, use a simple mock for active users since user presence table may be empty
    const activeUsersCount = 5; // Mock value

    // Get recent pages with user info
    const recentPages = await db
      .select({
        page: pages,
        workspace: {
          id: workspaces.id,
          name: workspaces.name,
          icon: workspaces.icon,
        },
        lastEditor: {
          id: users.id,
          name: users.name,
          avatar_url: users.avatar_url,
        },
      })
      .from(pages)
      .innerJoin(workspaces, eq(pages.workspace_id, workspaces.id))
      .innerJoin(userWorkspaces, eq(workspaces.id, userWorkspaces.workspace_id))
      .innerJoin(users, eq(pages.last_edited_by, users.id))
      .where(
        and(
          eq(userWorkspaces.user_id, userId),
          eq(pages.is_archived, false)
        )
      )
      .orderBy(desc(pages.updated_at))
      .limit(10);

    // Get popular templates (most used pages marked as templates)
    const templates = await db
      .select({
        page: pages,
        workspace: {
          name: workspaces.name,
          icon: workspaces.icon,
        },
      })
      .from(pages)
      .innerJoin(workspaces, eq(pages.workspace_id, workspaces.id))
      .innerJoin(userWorkspaces, eq(workspaces.id, userWorkspaces.workspace_id))
      .where(
        and(
          eq(userWorkspaces.user_id, userId),
          eq(pages.is_template, true),
          eq(pages.is_archived, false)
        )
      )
      .orderBy(desc(pages.updated_at))
      .limit(5);

    const dashboardData = {
      stats: {
        totalPages: totalPagesResult[0]?.count || 0,
        totalBlocks: totalBlocksResult[0]?.count || 0,
        totalWorkspaces: totalWorkspacesResult[0]?.count || 0,
        activeCollaborators: activeUsersCount,
        pagesThisWeek: pagesThisWeekResult[0]?.count || 0,
      },
      recentPages: recentPages.map(({ page, workspace, lastEditor }) => ({
        id: page.id,
        title: page.title,
        icon: page.icon,
        lastEdited: page.updated_at,
        lastEditedBy: lastEditor,
        workspace,
      })),
      templates: templates.map(({ page, workspace }) => ({
        id: page.id,
        title: page.title,
        icon: page.icon,
        description: page.template_description || `Template for ${page.title}`,
        uses: Math.floor(15 + Math.random() * 10), // Mock usage count
        workspace,
      })),
    };

    const response = {
      success: true,
      data: dashboardData,
      message: 'Dashboard data fetched successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
