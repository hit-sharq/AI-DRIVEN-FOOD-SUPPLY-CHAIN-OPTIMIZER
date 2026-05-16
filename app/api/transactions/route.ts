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
    const { listingId, quantity, pricePerUnit, totalPrice } = body

    if (!listingId || !quantity || totalPrice === undefined) {
      return NextResponse.json(
        { error: 'Listing ID, quantity, price per unit, and total price are required' },
        { status: 400 }
      )
    }

    // Find the buyer's vendor profile (create a minimal one on-the-fly if missing)
    let buyerVendor = await prisma.vendor.findUnique({ where: { userId } })
    if (!buyerVendor) {
      buyerVendor = await prisma.vendor.create({
        data: {
          userId,
          businessName: 'Pending Setup',
          email: `pending-${userId}@local.invalid`,
          location: 'Unknown',
        },
      })
    }

    // Get listing details (price and quantity)
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { product: true },
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

    const effectivePricePerUnit = pricePerUnit ?? listing.pricePerUnit

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId: buyerVendor.id,
        vendorId: listing.vendorId,
        quantity,
        pricePerUnit: effectivePricePerUnit,
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
      { error: 'Failed to process transaction' },
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

    // Find the user's vendor profile
    const vendor = await prisma.vendor.findUnique({ where: { userId } })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Get transactions where user is buyer or seller
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: vendor.id }, { vendorId: vendor.id }],
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
