import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { predictShelfLife } from '@/lib/aiService'

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

    if (!product || product.vendor.userId !== userId) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      )
    }

    // Upload image to Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'foodoptim/predictions',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    }) as any

    // Use AI service for shelf-life prediction
    const aiPrediction = await predictShelfLife(buffer, product.category);

    // Create prediction record
    const prediction = await prisma.prediction.create({
      data: {
        userId,
        productId,
        imageUrl: uploadResult.secure_url,
        shelfLife: aiPrediction.shelfLife,
        quality: aiPrediction.quality,
        ripeness: aiPrediction.ripeness,
        moldPresence: aiPrediction.moldPresence,
        bruises: aiPrediction.bruises,
        confidence: aiPrediction.confidence,
        rawPrediction: JSON.stringify(aiPrediction.rawPrediction),
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

    let where: any = { user: { userId } }

    if (productId) {
      // Verify product belongs to user
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { vendor: true },
      })

      if (!product || product.vendor.userId !== userId) {
        return NextResponse.json(
          { error: 'Product not found or unauthorized' },
          { status: 404 }
        )
      }

      where.productId = productId
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
