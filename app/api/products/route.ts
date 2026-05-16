import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import fs from 'fs'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const unit = formData.get('unit') as string
    const description = formData.get('description') as string || undefined
    const imageFile = formData.get('image') as File

    if (!name || !category || !unit) {
      return NextResponse.json(
        { error: 'Name, category, and unit are required' },
        { status: 400 }
      )
    }

    // Get vendor for this user
    const vendor = await prisma.vendor.findUnique({
      where: { userId: userId },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Upload image to Cloudinary if provided
    let imageUrl: string | undefined
    if (imageFile) {
      // Convert File to Buffer for Cloudinary upload
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'foodoptim/products',
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
      
      imageUrl = uploadResult.secure_url
    }

    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        name,
        category,
        unit,
        description,
        imageUrl,
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
      where: { userId: userId },
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
