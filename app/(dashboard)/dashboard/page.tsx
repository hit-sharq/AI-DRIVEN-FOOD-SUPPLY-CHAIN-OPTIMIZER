'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, TrendingUp, Leaf, DollarSign, Plus, TrendingDown, Eye } from 'lucide-react'

interface VendorStats {
  totalProducts: number
  activeListings: number
  wasteReduced: number
  revenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVendorData() {
      try {
        const res = await fetch('/api/vendors')
        if (res.ok) {
          const vendor = await res.json()
          setStats({
            totalProducts: vendor.products?.length || 0,
            activeListings: vendor.listings?.length || 0,
            wasteReduced: Math.floor(Math.random() * 100) + 50, // Mock data
            revenue: Math.floor(Math.random() * 50000) + 5000, // Mock data
          })
        }
      } catch (error) {
        console.error('[v0] Error fetching vendor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendorData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      gradient: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings || 0,
      icon: TrendingUp,
      gradient: 'from-green-600 to-emerald-700',
    },
    {
      title: 'Waste Reduced (kg)',
      value: stats?.wasteReduced || 0,
      icon: Leaf,
      gradient: 'from-orange-600 to-amber-700',
    },
    {
      title: 'Revenue (USD)',
      value: `$${stats?.revenue || 0}`,
      icon: DollarSign,
      gradient: 'from-purple-600 to-pink-700',
    },
  ]

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s your real-time supply chain overview
          </p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button className="gradient-primary text-white hover:shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="group">
              <div className={`glass premium-border rounded-2xl p-6 hover-lift h-full bg-gradient-to-br ${card.gradient} bg-opacity-5`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {card.title}
                  </span>
                  <div className={`p-3 rounded-lg gradient-primary/10 text-primary group-hover:gradient-primary group-hover:text-white transition-smooth`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">{card.value}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>+12% from last month</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/products/new">
          <div className="glass premium-border rounded-2xl p-6 hover-lift cursor-pointer h-full group">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4 flex items-center justify-center group-hover:gradient-primary group-hover:text-white transition-smooth">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Add Product</h3>
            <p className="text-sm text-muted-foreground">Create new products for your inventory</p>
          </div>
        </Link>
        <Link href="/dashboard/predictions">
          <div className="glass premium-border rounded-2xl p-6 hover-lift cursor-pointer h-full group">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4 flex items-center justify-center group-hover:gradient-primary group-hover:text-white transition-smooth">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Predictions</h3>
            <p className="text-sm text-muted-foreground">Upload images for shelf-life analysis</p>
          </div>
        </Link>
        <Link href="/dashboard/analytics">
          <div className="glass premium-border rounded-2xl p-6 hover-lift cursor-pointer h-full group">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4 flex items-center justify-center group-hover:gradient-primary group-hover:text-white transition-smooth">
              <TrendingDown className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
            <p className="text-sm text-muted-foreground">Track your performance and insights</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="glass premium-border rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Listings</h2>
          <Link href="/dashboard/listings">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No listings yet. Create your first marketplace listing to start selling!
          </p>
          <Link href="/dashboard/listings/new">
            <Button variant="outline" size="sm" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
