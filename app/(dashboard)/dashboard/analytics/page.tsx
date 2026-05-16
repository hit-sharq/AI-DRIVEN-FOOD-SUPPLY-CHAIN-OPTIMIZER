'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line, LineChart, Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Prediction {
  id: string
  shelfLife: number | null
  quality: string | null
  confidence: number | null
  product: { name: string; category: string }
  createdAt: string
}

interface Transaction {
  id: string
  totalPrice: number
  quantity: number
  status: string
  createdAt: string
  listing?: { product?: { name: string } }
}

const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function AnalyticsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pRes, tRes] = await Promise.all([
          fetch('/api/predictions'),
          fetch('/api/transactions'),
        ])
        if (pRes.ok) setPredictions(await pRes.json())
        if (tRes.ok) setTransactions(await tRes.json())
      } catch (err) {
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Derived data ────────────────────────────────────────────────────────────

  const shelfLifeByDay = useMemo(() => {
    const buckets: Record<string, number> = {}
    predictions
      .filter((p) => p.shelfLife != null)
      .forEach((p) => {
        const day = String(p.shelfLife!.valueOf())
        buckets[day] = (buckets[day] || 0) + 1
      })
    return Object.entries(buckets)
      .map(([day, count]) => ({ day: `${day} days`, count })
      )
      .sort((a, b) => parseInt(a.day) - parseInt(b.day))
  }, [predictions])

  const categoryBreakdown = useMemo(() => {
    const buckets: Record<string, number> = {}
    predictions.forEach((p) => {
      const cat = p.product.category || 'Other'
      buckets[cat] = (buckets[cat] || 0) + 1
    })
    return Object.entries(buckets).map(([name, value]) => ({ name, value }))
  }, [predictions])

  const totalRevenue = useMemo(
    () => transactions.filter((t) => t.status === 'COMPLETED').reduce((s, t) => s + t.totalPrice, 0),
    [transactions]
  )

  const revenueByMonth = useMemo(() => {
    const buckets: Record<string, number> = {}
    transactions
      .filter((t) => t.status === 'COMPLETED')
      .forEach((t) => {
        const key = new Date(t.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })
        buckets[key] = (buckets[key] || 0) + t.totalPrice
      })
    return Object.entries(buckets).map(([month, revenue]) => ({ month, revenue }))
  }, [transactions])

  const avgShelfLife = useMemo(() => {
    const vals = predictions.filter((p) => p.shelfLife != null).map((p) => p.shelfLife!.valueOf())
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—'
  }, [predictions])

  const avgConfidence = useMemo(() => {
    const vals = predictions.filter((p) => p.confidence != null).map((p) => p.confidence!.valueOf())
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return `${(avg * 100).toFixed(0)}%`
  }, [predictions])

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading analytics…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your performance and insights
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
          { label: 'Transactions', value: transactions.filter((t) => t.status === 'COMPLETED').length },
          { label: 'Avg Shelf Life', value: `${avgShelfLife} days` },
          { label: 'Avg Confidence', value: avgConfidence },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass premium-border">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      {revenueByMonth.length > 0 && (
        <Card className="glass premium-border">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 248)" />
                <XAxis dataKey="month" stroke="oklch(0.55 0.02 248)" fontSize={12} />
                <YAxis stroke="oklch(0.55 0.02 248)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="oklch(0.52 0.19 22)" strokeWidth={2} dot r={4} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shelf-life distribution */}
        <Card className="glass premium-border">
          <CardHeader>
            <CardTitle>Shelf-Life Distribution (days)</CardTitle>
          </CardHeader>
          <CardContent>
            {shelfLifeByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={shelfLifeByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 248)" />
                  <XAxis dataKey="day" stroke="oklch(0.55 0.02 248)" fontSize={11} />
                  <YAxis stroke="oklch(0.55 0.02 248)" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="oklch(0.52 0.19 22)" radius={[4, 4, 0, 0]} name="Predictions" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No prediction data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card className="glass premium-border">
          <CardHeader>
            <CardTitle>Predictions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryBreakdown.map((_entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No prediction data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
