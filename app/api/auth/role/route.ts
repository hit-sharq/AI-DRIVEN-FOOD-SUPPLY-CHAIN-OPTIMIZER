import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an admin by comparing against ADMIN_USER_IDS env variable
    const adminUserIds = process.env.ADMIN_USER_IDS?.split(',').map(id => id.trim()) || []
    const isAdmin = adminUserIds.includes(userId)

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('[v0] Error checking admin role:', error)
    return NextResponse.json(
      { error: 'Failed to check admin role' },
      { status: 500 }
    )
  }
}