'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Calendar, TrendingDown, Upload } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
}

interface Prediction {
  id: string
  shelfLifeDays: number
  expiryDate: string
  confidence: number
  product: {
    name: string
  }
}

export default function PredictionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, predictionsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/predictions'),
        ])

        if (productsRes.ok) {
          const data = await productsRes.json()
          setProducts(data)
        }

        if (predictionsRes.ok) {
          const data = await predictionsRes.json()
          setPredictions(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !selectedProductId) {
      alert('Please select a product and upload an image')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('productId', selectedProductId)

      const res = await fetch('/api/predictions', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const prediction = await res.json()
        setPredictions([prediction, ...predictions])
        setSelectedFile(null)
        setSelectedProductId('')
        alert('Prediction created successfully!')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create prediction')
      }
    } catch (error) {
      console.error('[v0] Error uploading:', error)
      alert('Failed to create prediction')
    } finally {
      setUploading(false)
    }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'text-red-600' }
    if (daysUntilExpiry < 2) return { label: 'Critical', color: 'text-orange-600' }
    return { label: 'Good', color: 'text-green-600' }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shelf-Life Predictions</h1>
        <p className="text-muted-foreground mt-2">
          Upload images to predict shelf-life of your produce
        </p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No products found. Please create a product first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Product</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={uploading || !selectedFile} className="w-full">
                {uploading ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Predictions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No predictions yet. Upload an image to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => {
                const status = getExpiryStatus(prediction.expiryDate)
                const expiryDate = new Date(prediction.expiryDate)

                return (
                  <div
                    key={prediction.id}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{prediction.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Predicted on {new Date(prediction.createdAt || '').toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar size={16} />
                          <span className="text-xs">Shelf Life</span>
                        </div>
                        <p className="font-medium">{prediction.shelfLifeDays} days</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingDown size={16} />
                          <span className="text-xs">Expires</span>
                        </div>
                        <p className="font-medium">
                          {expiryDate.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <AlertCircle size={16} />
                          <span className="text-xs">Confidence</span>
                        </div>
                        <p className="font-medium">{prediction.confidence}%</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
