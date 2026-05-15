'use client'

import { useAuth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Header() {
  const { isSignedIn } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/about', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 glass premium-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center transition-smooth group-hover:shadow-lg group-hover:scale-105">
            <span className="text-white font-bold text-lg">🌾</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold text-foreground">FoodOptim</span>
            <span className="text-xs text-muted-foreground">Supply Chain</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isSignedIn &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full" />
                )}
              </Link>
            ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {isSignedIn ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="gradient-primary text-white hover:shadow-lg">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-smooth"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-dark premium-border border-t animate-in slide-in-down">
          <div className="px-4 py-4 space-y-3">
            {!isSignedIn &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/50 transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            {!isSignedIn && (
              <>
                <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="w-full gradient-primary text-white" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
            {isSignedIn && (
              <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
