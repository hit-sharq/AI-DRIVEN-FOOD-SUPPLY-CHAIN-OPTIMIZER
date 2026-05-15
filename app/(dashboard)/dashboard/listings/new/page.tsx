'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Product {
  id: string
  name: string
  unit: string
}

export default function NewListingPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
  })

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, productId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: formData.productId,
          quantity: parseFloat(formData.quantity),
          pricePerUnit: parseFloat(formData.pricePerUnit),
          description: formData.description,
        }),
      })

      if (res.ok) {
        router.push('/dashboard/listings')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('[v0] Error creating listing:', error)
      alert('Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProducts) {
    return <div>Loading products...</div>
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Listing</h1>
        <p className="text-muted-foreground mt-2">
          List your surplus products on the marketplace
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No products found. Please create a product first.
              </p>
              <Button
                onClick={() => router.push('/dashboard/products/new')}
                variant="outline"
              >
                Create Product
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product */}
              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <Select
                  value={formData.productId}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Available *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 100"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit (USD) *</Label>
                <Input
                  id="price"
                  name="pricePerUnit"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2.50"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Optional: Add details about the condition, harvest date, etc."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Listing'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
