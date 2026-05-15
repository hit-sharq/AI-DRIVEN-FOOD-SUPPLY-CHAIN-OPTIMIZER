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
    const { name, category, unit, description } = body

    if (!name || !category || !unit) {
      return NextResponse.json(
        { error: 'Name, category, and unit are required' },
        { status: 400 }
      )
    }

    // Get vendor for this user
    const vendor = await prisma.vendor.findUnique({
      where: { clerkUserId: userId },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        name,
        category,
        unit,
        description,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
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
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
