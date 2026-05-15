'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Linkedin, Twitter, Github } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass premium-border border-t mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Newsletter Section */}
        <div className="mb-16 pb-16 border-b border-border/50">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Stay updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on food supply chain optimization and marketplace features.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-border"
                required
              />
              <Button
                type="submit"
                size="sm"
                className="gradient-primary text-white"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 animate-in fade-in">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌾</span>
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">FoodOptim</div>
                <div className="text-xs text-muted-foreground">Supply Chain Hub</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reducing post-harvest food waste through AI-powered shelf-life prediction and B2B marketplace.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Docs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} FoodOptim. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="p-2 rounded-lg hover:bg-accent transition-smooth text-muted-foreground hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-lg hover:bg-accent transition-smooth text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-lg hover:bg-accent transition-smooth text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
