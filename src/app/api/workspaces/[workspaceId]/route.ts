import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/connection';
import { workspaces, userWorkspaces, pages } from '@/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';

/**
 * GET /api/workspaces/[workspaceId]
 * Fetch workspace details with pages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { workspaceId } = params;
    
    // TODO: Get actual user ID from authentication
    const userId = '1064ba4f-b2cb-4ecb-8651-25b0bc207f3c'; // Alice Cooper's ID

    // Check if user has access to this workspace
    const userWorkspace = await db
      .select({
        workspace: workspaces,
        role: userWorkspaces.role,
      })
      .from(userWorkspaces)
      .innerJoin(workspaces, eq(userWorkspaces.workspace_id, workspaces.id))
      .where(
        and(
          eq(userWorkspaces.workspace_id, workspaceId),
          eq(userWorkspaces.user_id, userId)
        )
      )
      .limit(1);

    if (userWorkspace.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found or access denied' },
        { status: 404 }
      );
    }

    // Fetch top-level pages (no parent) for this workspace
    const workspacePages = await db
      .select()
      .from(pages)
      .where(
        and(
          eq(pages.workspace_id, workspaceId),
          isNull(pages.parent_id),
          eq(pages.is_archived, false)
        )
      )
      .orderBy(pages.sort_order, desc(pages.updated_at));

    const response = {
      success: true,
      data: {
        workspace: userWorkspace[0].workspace,
        role: userWorkspace[0].role,
        pages: workspacePages,
      },
      message: 'Workspace fetched successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch workspace',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workspaces/[workspaceId]
 * Update workspace details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { workspaceId } = params;
    const body = await request.json();
    const { name, description, icon } = body;

    // TODO: Get actual user ID from authentication
    const userId = '1064ba4f-b2cb-4ecb-8651-25b0bc207f3c'; // Alice Cooper's ID

    // Check if user has admin/owner access to this workspace
    const userWorkspace = await db
      .select()
      .from(userWorkspaces)
      .where(
        and(
          eq(userWorkspaces.workspace_id, workspaceId),
          eq(userWorkspaces.user_id, userId)
        )
      )
      .limit(1);

    if (userWorkspace.length === 0 || !['owner', 'admin'].includes(userWorkspace[0].role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to update workspace' },
        { status: 403 }
      );
    }

    // Update workspace
    const [updatedWorkspace] = await db
      .update(workspaces)
      .set({
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(icon && { icon }),
        updated_at: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))
      .returning();

    const response = {
      success: true,
      data: updatedWorkspace,
      message: 'Workspace updated successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating workspace:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update workspace',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
