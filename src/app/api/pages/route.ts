import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/connection';
import { pages, workspaces, userWorkspaces, blocks } from '@/db/schema';
import { eq, and, desc, count, isNull } from 'drizzle-orm';

/**
 * GET /api/pages
 * Fetch recent pages across all workspaces for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Get actual user ID from authentication
    const userId = '1064ba4f-b2cb-4ecb-8651-25b0bc207f3c'; // Alice Cooper's ID

    // Build the where conditions based on parameters
    const whereConditions = [
      eq(userWorkspaces.user_id, userId),
      eq(pages.is_archived, false)
    ];

    // Add workspace filter if specified
    if (workspaceId) {
      whereConditions.push(eq(pages.workspace_id, workspaceId));
    }

    const pagesQuery = await db
      .select({
        page: pages,
        workspace: workspaces,
        blockCount: count(blocks.id),
      })
      .from(pages)
      .innerJoin(workspaces, eq(pages.workspace_id, workspaces.id))
      .innerJoin(userWorkspaces, eq(workspaces.id, userWorkspaces.workspace_id))
      .leftJoin(blocks, and(eq(blocks.page_id, pages.id), eq(blocks.is_deleted, false)))
      .where(and(...whereConditions))
      .groupBy(pages.id, workspaces.id)
      .orderBy(desc(pages.updated_at))
      .limit(limit)
      .offset(offset);

    // Transform the results
    const formattedPages = pagesQuery.map(row => ({
      id: row.page.id,
      title: row.page.title,
      icon: row.page.icon,
      workspace: {
        id: row.workspace.id,
        name: row.workspace.name,
        icon: row.workspace.icon
      },
      blockCount: row.blockCount || 0,
      createdAt: row.page.created_at,
      updatedAt: row.page.updated_at,
      isArchived: row.page.is_archived,
      parentPageId: row.page.parent_id
    }));

    return NextResponse.json({
      success: true,
      data: formattedPages,
      message: `Found ${formattedPages.length} pages`
    });

  } catch (error) {
    console.error('❌ Error fetching pages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pages'
      },
      { status: 500 }
    );
  }
}
