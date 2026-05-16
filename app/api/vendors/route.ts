import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { businessName, contactName, email, phone, location } = body

    if (!businessName || !location || !email) {
      return NextResponse.json(
        { error: 'Business name, email, and location are required' },
        { status: 400 }
      )
    }

    // Upsert: remove stale duplicates (there should be at most one per user)
    await prisma.vendor.deleteMany({ where: { userId } })

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName,
        contactName: contactName ?? null,
        email,
        phone: phone ?? null,
        location,
      },
    })

    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        products: true,
        listings: true,
      },
    })

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('[v0] Error fetching vendor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}