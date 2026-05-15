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

    // Verify the product belongs to the vendor
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { vendor: true },
    })

    if (!product || product.vendor.clerkUserId !== userId) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      )
    }

    const listing = await prisma.listing.create({
      data: {
        productId,
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
    const vendor = searchParams.get('vendor')
    const userId = searchParams.get('userId') // Show only user's listings

    let where: any = { status: 'ACTIVE' }

    if (category) {
      where.product = { category }
    }

    if (vendor) {
      where.product = {
        ...where.product,
        vendor: { name: { contains: vendor, mode: 'insensitive' } },
      }
    }

    if (userId) {
      where.product = {
        ...where.product,
        vendor: { clerkUserId: userId },
      }
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
