import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Authorise: only admins can patch vendor status
    const adminUserIds = (process.env.ADMIN_USER_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean)
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { verificationStatus } = body as { verificationStatus: string }

    if (!verificationStatus) {
      return NextResponse.json(
        { error: 'verificationStatus is required' },
        { status: 400 }
      )
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { verificationStatus: verificationStatus as any },
    })

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('[v0] Error updating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}
