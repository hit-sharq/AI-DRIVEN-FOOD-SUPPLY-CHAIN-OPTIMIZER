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
    const { productId, quantity, pricePerUnit, description } = body

    if (!productId || !quantity || !pricePerUnit) {
      return NextResponse.json(
        { error: 'Product ID, quantity, and price are required' },
        { status: 400 }
      )
    }

    // Verify the product belongs to the vendor and grab its unit
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const vendor = await prisma.vendor.findUnique({ where: { userId } })
    if (!vendor || vendor.id !== product.vendorId) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      )
    }

    const listing = await prisma.listing.create({
      data: {
        vendorId: vendor.id,
        productId,
        unit: product.unit,
        quantity,
        pricePerUnit,
        description,
        status: 'ACTIVE',
      },
      include: {
        product: {
          include: {
            vendor: {
              select: {
                id: true,
                email: true,
                location: true,
                businessName: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating listing:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const vendorId = searchParams.get('vendorId')
    const userId = searchParams.get('userId')

    let where: any = { status: 'ACTIVE' }

    if (category) {
      where.product = { category }
    }

    if (vendorId) {
      where.vendorId = vendorId
    }

    if (userId) {
      // Filter listings belonging to the vendor of the authenticated user
      where.vendor = { userId }
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        product: {
          include: {
            vendor: {
              select: {
                id: true,
                email: true,
                location: true,
                businessName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('[v0] Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
