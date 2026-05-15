'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ArrowRight, TrendingUp, Zap, BarChart3, Leaf } from 'lucide-react'

export default function Home() {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'AI Shelf-Life Detection',
      description: 'Upload produce images to get instant AI-powered shelf-life predictions with confidence scores',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Smart Marketplace',
      description: 'Connect with vendors and buyers in real-time to reduce waste and maximize profits',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Dynamic Pricing',
      description: 'Adjust prices automatically based on shelf-life and real-time market conditions',
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Sustainability Tracking',
      description: 'Monitor waste reduction metrics and environmental impact of your operations',
    },
  ]

  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-40 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl w-full space-y-12 fade-in-up">
            {/* Headline */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass premium-border">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">
                  Welcome to the future of food supply chains
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-tight">
                Reduce Food Waste with AI
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
                Leverage computer vision and real-time marketplace intelligence to predict shelf-life, optimize pricing, and connect with buyers instantly.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <>
                  <Button asChild size="lg" className="gradient-primary text-white hover:shadow-lg">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="gradient-primary text-white hover:shadow-lg">
                    <Link href="/sign-up">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">50%</div>
                <p className="text-xs md:text-sm text-muted-foreground">Waste Reduction</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                <p className="text-xs md:text-sm text-muted-foreground">Real-time Monitoring</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">10k+</div>
                <p className="text-xs md:text-sm text-muted-foreground">Active Vendors</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Everything you need
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools designed to eliminate food waste and optimize your supply chain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass premium-border p-8 rounded-2xl hover-lift group"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-smooth">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 gradient-primary opacity-5" />
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Ready to transform your supply chain?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of vendors reducing waste and increasing profitability today.
            </p>
            <Button asChild size="lg" className="gradient-primary text-white hover:shadow-xl">
              <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
                {isSignedIn ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
