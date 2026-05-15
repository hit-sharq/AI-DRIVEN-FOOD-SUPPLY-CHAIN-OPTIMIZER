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
    const { name, location, contactEmail, contactPhone, description } = body

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      )
    }

    // Check if vendor already exists for this user
    const existingVendor = await prisma.vendor.findUnique({
      where: { clerkUserId: userId },
    })

    if (existingVendor) {
      return NextResponse.json(
        { error: 'Vendor profile already exists' },
        { status: 400 }
      )
    }

    const vendor = await prisma.vendor.create({
      data: {
        clerkUserId: userId,
        name,
        location,
        contactEmail,
        contactPhone,
        description,
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
      where: { clerkUserId: userId },
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
