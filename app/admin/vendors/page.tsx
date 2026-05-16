'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table'
import { Check, X } from 'lucide-react'

interface Vendor {
  id: string
  userId: string
  businessName: string
  contactName: string | null
  email: string
  phone: string | null
  location: string
  latitude: number | null
  longitude: number | null
  businessType: string | null
  description: string | null
  profileImage: string | null
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors')
      if (res.ok) {
        const data = await res.json()
        setVendors(data)
      } else {
        console.error('Failed to fetch vendors')
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: 'VERIFIED' }),
      })
      if (res.ok) {
        await fetchVendors()
      } else {
        console.error('Failed to verify vendor')
      }
    } catch (error) {
      console.error('Error verifying vendor:', error)
    }
  }

  const handleReject = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: 'REJECTED' }),
      })
      if (res.ok) {
        await fetchVendors()
      } else {
        console.error('Failed to reject vendor')
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <p className="text-muted-foreground mt-2">
            Review and verify vendor applications
          </p>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vendors found.</p>
            </div>
          ) : (
            <Table>
              <TableCaption className="mb-4 text-left font-medium">
                Vendor Applications
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Business Name</TableHead>
                  <TableHead className="w-1/6">Contact</TableHead>
                  <TableHead className="w-1/6">Email</TableHead>
                  <TableHead className="w-1/6">Location</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.businessName}</TableCell>
                    <TableCell>
                      {vendor.contactName || 'N/A'}
                    </TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.location}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          vendor.verificationStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : vendor.verificationStatus === 'VERIFIED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {vendor.verificationStatus}
                      </span>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      {vendor.verificationStatus === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerify(vendor.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Verify
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(vendor.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {vendor.verificationStatus !== 'PENDING' && (
                        <span className="text-xs text-muted-foreground">
                          {vendor.verificationStatus === 'VERIFIED' ? 'Verified' : 'Rejected'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}