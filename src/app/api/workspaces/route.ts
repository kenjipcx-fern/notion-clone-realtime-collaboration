import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/connection';
import { workspaces, userWorkspaces, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/workspaces
 * Fetch all workspaces for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual user ID from authentication
    const userId = '1064ba4f-b2cb-4ecb-8651-25b0bc207f3c'; // Alice Cooper's ID
    
    // Fetch workspaces where user is a member
    const userWorkspacesData = await db
      .select({
        workspace: workspaces,
        role: userWorkspaces.role,
        joinedAt: userWorkspaces.joined_at,
      })
      .from(userWorkspaces)
      .innerJoin(workspaces, eq(userWorkspaces.workspace_id, workspaces.id))
      .where(eq(userWorkspaces.user_id, userId))
      .orderBy(desc(userWorkspaces.joined_at));

    const response = {
      success: true,
      data: userWorkspacesData,
      message: `Found ${userWorkspacesData.length} workspaces`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch workspaces',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, slug } = body;

    // TODO: Get actual user ID from authentication
    const userId = '1064ba4f-b2cb-4ecb-8651-25b0bc207f3c'; // Alice Cooper's ID

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Workspace name is required' },
        { status: 400 }
      );
    }

    if (!slug || slug.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Workspace slug is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, slug))
      .limit(1);

    if (existingWorkspace.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Workspace slug already exists' },
        { status: 409 }
      );
    }

    // Create workspace
    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim(),
        icon: icon || '🏢',
        created_by: userId,
      })
      .returning();

    // Add creator as owner
    await db
      .insert(userWorkspaces)
      .values({
        user_id: userId,
        workspace_id: newWorkspace.id,
        role: 'owner',
      });

    const response = {
      success: true,
      data: newWorkspace,
      message: 'Workspace created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create workspace',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
