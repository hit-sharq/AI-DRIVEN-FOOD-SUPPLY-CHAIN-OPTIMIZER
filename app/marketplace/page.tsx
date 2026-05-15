'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ShoppingCart, MapPin, DollarSign, Package, Leaf, Search } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface Listing {
  id: string
  quantity: number
  pricePerUnit: number
  description?: string
  product: {
    name: string
    category: string
    unit: string
    vendor: {
      id: string
      name: string
      location: string
      contactEmail: string
    }
  }
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Meat',
    'Seafood',
    'Spices',
    'Other',
  ]

  useEffect(() => {
    async function fetchListings() {
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.append('category', selectedCategory)
        if (selectedVendor) params.append('vendor', selectedVendor)

        const res = await fetch(`/api/listings?${params}`)
        if (res.ok) {
          const data = await res.json()
          setListings(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [selectedCategory, selectedVendor])

  const filteredListings = listings.filter(
    (listing) =>
      listing.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="border-b premium-border glass py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  Marketplace
                </h1>
                <p className="text-lg text-muted-foreground">
                  Connect with vendors and access fresh surplus produce at competitive prices
                </p>
              </div>
              <Link href="/dashboard">
                <Button size="lg" className="gradient-primary text-white hover:shadow-lg">
                  My Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-[60px] z-40 glass premium-border border-b py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Products or vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 premium-border"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="premium-border">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vendor Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Vendor
                </label>
                <Input
                  placeholder="Filter by vendor..."
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="premium-border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass premium-border">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">Loading listings...</span>
                </div>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  No listings found matching your criteria
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or check back later for new listings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="group">
                    <div className="glass premium-border rounded-2xl overflow-hidden hover-lift h-full flex flex-col">
                      {/* Header */}
                      <div className="p-6 border-b premium-border bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-foreground">
                            {listing.product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{listing.product.vendor.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 space-y-4">
                        {/* Product Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="glass-dark premium-border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Category</p>
                            <p className="font-semibold text-foreground">
                              {listing.product.category}
                            </p>
                          </div>
                          <div className="glass-dark premium-border rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Available</p>
                            <p className="font-semibold text-foreground">
                              {listing.quantity} {listing.product.unit}
                            </p>
                          </div>
                        </div>

                        {/* Price Highlight */}
                        <div className="gradient-primary/10 border gradient-accent rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="text-xs text-muted-foreground font-semibold">PRICING</span>
                          </div>
                          <p className="text-3xl font-bold text-foreground">
                            ${listing.pricePerUnit.toFixed(2)}
                            <span className="text-sm text-muted-foreground ml-2 font-normal">
                              /{listing.product.unit}
                            </span>
                          </p>
                        </div>

                        {/* Description */}
                        {listing.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {listing.description}
                          </p>
                        )}

                        {/* Sustainability Badge */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-600">Surplus Produce</span>
                        </div>

                        {/* Vendor Contact */}
                        <div className="border-t premium-border pt-4 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">Contact Vendor</p>
                          <a
                            href={`mailto:${listing.product.vendor.contactEmail}`}
                            className="text-sm text-primary hover:text-primary/80 font-medium break-all transition-colors"
                          >
                            {listing.product.vendor.contactEmail}
                          </a>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="p-6 border-t premium-border">
                        <Link href="/dashboard" className="block">
                          <Button className="w-full gradient-primary text-white hover:shadow-lg">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Inquire Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
