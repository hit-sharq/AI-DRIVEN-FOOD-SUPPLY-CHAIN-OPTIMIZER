'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your vendor profile and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vendor-name">Vendor Name</Label>
            <Input
              id="vendor-name"
              placeholder="Your vendor name"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-location">Location</Label>
            <Input
              id="vendor-location"
              placeholder="Your location"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-email">Contact Email</Label>
            <Input
              id="vendor-email"
              type="email"
              placeholder="your@email.com"
              disabled
            />
          </div>

          <Button disabled>Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  )
}
