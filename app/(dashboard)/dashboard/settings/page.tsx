'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface VendorProfile {
  id: string
  businessName: string
  contactName: string | null
  email: string
  phone: string | null
  location: string
  description: string | null
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/vendors')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        } else {
          setToastMessage({ type: 'error', text: 'Failed to load vendor profile' })
        }
      } catch {
        setToastMessage({ type: 'error', text: 'Failed to load vendor profile' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: profile.businessName,
          contactName: profile.contactName,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
        }),
      })
      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Profile updated successfully' })
      } else {
        const err = await res.json().catch(() => ({}))
        setToastMessage({ type: 'error', text: err.error || 'Failed to update profile' })
      }
    } catch {
      setToastMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>
  }

  if (!profile) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No vendor profile found. Close and reopen after setup.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Card>
          <CardContent className="pt-6">
            <p className={toastMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {toastMessage.text}
            </p>
          </CardContent>
        </Card>
      )}
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
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="Your business name"
              value={profile.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              name="contactName"
              placeholder="Primary contact person"
              value={profile.contactName ?? ''}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contact@business.com"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+254 7XX XXX XXX"
              value={profile.phone ?? ''}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location / City *</Label>
            <Input
              id="location"
              name="location"
              placeholder="Market name or city"
              value={profile.location}
              onChange={handleChange}
              required
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
