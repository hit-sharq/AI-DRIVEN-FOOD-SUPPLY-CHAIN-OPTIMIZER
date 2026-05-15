'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your performance and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chart data coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chart data coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
