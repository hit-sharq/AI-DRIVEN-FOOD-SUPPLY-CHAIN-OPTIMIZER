'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Package, BarChart3, ShoppingCart, Home, Settings, ImageIcon, Zap, Shield, UserPlus } from 'lucide-react'

export default function DashboardNav() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/listings', label: 'Listings', icon: ShoppingCart },
    { href: '/dashboard/predictions', label: 'Predictions', icon: ImageIcon },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  // Admin-only links
  const adminLinks = [
    { href: '/admin/vendors', label: 'Vendor Management', icon: UserPlus },
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
  ]

  return (
    <aside className="w-64 glass premium-border border-r h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b premium-border p-6 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center transition-smooth group-hover:shadow-lg group-hover:scale-105">
            <span className="text-white font-bold text-lg">🌾</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">FoodOptim</h1>
            <p className="text-xs text-muted-foreground">Supply Chain</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {/* Regular user links */}
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth group relative',
                isActive
                  ? 'gradient-primary text-white shadow-lg'
                  : 'text-foreground hover:bg-accent/50'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'animate-pulse')} />
              <span>{label}</span>
              {isActive && (
                <div className="absolute right-3 h-2 w-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}

        {/* Admin links - will be conditionally rendered client-side based on user role */}
        <div id="admin-links-container" className="space-y-1">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth group relative hidden admin-link',
                  isActive
                    ? 'gradient-primary text-white shadow-lg'
                    : 'text-foreground hover:bg-accent/50'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'animate-pulse')} />
                <span>{label}</span>
                {isActive && (
                  <div className="absolute right-3 h-2 w-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t premium-border p-4 flex-shrink-0 space-y-4">
        <div className="glass-dark premium-border rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-2">Quick Action</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Zap className="h-3 w-3" />
            Create Listing
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Account</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </aside>
  )
}
