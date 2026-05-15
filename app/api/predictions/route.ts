import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('image') as File
    const productId = formData.get('productId') as string

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'Image and product ID are required' },
        { status: 400 }
      )
    }

    // Verify product belongs to vendor
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

    // Mock shelf-life prediction based on product category
    const predictions = {
      Vegetables: { min: 3, max: 10 },
      Fruits: { min: 5, max: 14 },
      Grains: { min: 30, max: 180 },
      Dairy: { min: 1, max: 21 },
      Meat: { min: 1, max: 7 },
      Seafood: { min: 1, max: 3 },
      Spices: { min: 180, max: 365 },
      Other: { min: 7, max: 30 },
    }

    const categoryPrediction = predictions[product.category as keyof typeof predictions] || predictions.Other
    const randomShelfLife = Math.floor(
      Math.random() * (categoryPrediction.max - categoryPrediction.min + 1) + categoryPrediction.min
    )

    // Calculate expiry date
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + randomShelfLife)

    // Create prediction record
    const prediction = await prisma.prediction.create({
      data: {
        productId,
        shelfLifeDays: randomShelfLife,
        expiryDate,
        confidence: Math.floor(Math.random() * 20 + 80), // 80-99% confidence
        imageUrl: `https://placeholder-image-${Date.now()}.jpg`,
      },
    })

    return NextResponse.json(prediction, { status: 201 })
  } catch (error) {
    console.error('[v0] Error processing prediction:', error)
    return NextResponse.json(
      { error: 'Failed to process prediction' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const productId = searchParams.get('productId')

    let where: any = {}

    if (productId) {
      // Verify product belongs to user
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

      where.productId = productId
    } else {
      // Get all predictions for user's products
      const vendor = await prisma.vendor.findUnique({
        where: { clerkUserId: userId },
      })

      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }

      where.product = {
        vendorId: vendor.id,
      }
    }

    const predictions = await prisma.prediction.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(predictions)
  } catch (error) {
    console.error('[v0] Error fetching predictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
}
