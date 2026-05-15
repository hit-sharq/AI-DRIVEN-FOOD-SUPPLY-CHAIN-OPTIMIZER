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
    const { listingId, quantity, totalPrice } = body

    if (!listingId || !quantity || totalPrice === undefined) {
      return NextResponse.json(
        { error: 'Listing ID, quantity, and total price are required' },
        { status: 400 }
      )
    }

    // Get buyer's vendor profile
    const buyerVendor = await prisma.vendor.findUnique({
      where: { clerkUserId: userId },
    })

    if (!buyerVendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Get listing details
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { product: { include: { vendor: true } } },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check quantity availability
    if (quantity > listing.quantity) {
      return NextResponse.json(
        { error: 'Insufficient quantity available' },
        { status: 400 }
      )
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId: buyerVendor.id,
        sellerId: listing.product.vendor.id,
        quantity,
        totalPrice,
        status: 'COMPLETED',
      },
      include: {
        listing: {
          include: { product: true },
        },
      },
    })

    // Update listing quantity
    const updatedQuantity = listing.quantity - quantity
    if (updatedQuantity === 0) {
      await prisma.listing.update({
        where: { id: listingId },
        data: { status: 'SOLD_OUT' },
      })
    } else {
      await prisma.listing.update({
        where: { id: listingId },
        data: { quantity: updatedQuantity },
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
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

    // Get user's vendor profile
    const vendor = await prisma.vendor.findUnique({
      where: { clerkUserId: userId },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Get transactions as buyer or seller
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: vendor.id }, { sellerId: vendor.id }],
      },
      include: {
        listing: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('[v0] Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
