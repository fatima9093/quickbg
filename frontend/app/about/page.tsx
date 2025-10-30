import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Sparkles, Zap, Shield, Heart, Users, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">About QuickBG</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Making Background Removal
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Simple & Free
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We believe everyone should have access to professional-quality image editing tools. 
              That's why we built QuickBG - a fast, private, and completely free background removal service.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    QuickBG was born from a simple frustration: why should removing an image background 
                    be so complicated and expensive? We saw countless tools that either charged hefty fees, 
                    required subscriptions, or compromised on quality.
                  </p>
                  <p>
                    We decided to build something different. Using cutting-edge AI technology, we created 
                    a tool that delivers professional results in seconds - without storing your images or 
                    charging you a dime for basic use.
                  </p>
                  <p>
                    Today, QuickBG helps thousands of users every day - from small business owners creating 
                    product photos, to designers working on quick mockups, to anyone who needs a transparent 
                    background without the hassle.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 p-8 flex items-center justify-center">
                  <div className="text-center text-white space-y-4">
                    <Sparkles className="w-20 h-20 mx-auto" />
                    <p className="text-xl font-semibold">Built with AI</p>
                    <p className="text-sm opacity-90">Powered by advanced U²-Net technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What We Stand For
              </h2>
              <p className="text-xl text-gray-600">
                Our core values guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Privacy First</h3>
                  <p className="text-gray-600">
                    We never store your images. Upload, process, download - then it's gone forever. 
                    Your photos stay yours.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-green-100 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Speed & Quality</h3>
                  <p className="text-gray-600">
                    We optimize every millisecond. Get professional-quality results in 2-5 seconds, 
                    not minutes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Free Forever</h3>
                  <p className="text-gray-600">
                    Everyone deserves access to great tools. Try 5 times without signup, 
                    then get 50 images/day free forever.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl p-12 text-white text-center space-y-6">
              <Target className="w-16 h-16 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-xl opacity-90 leading-relaxed">
                To democratize professional image editing by providing lightning-fast, privacy-focused, 
                and completely free background removal tools to everyone, everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* By The Numbers */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                QuickBG By The Numbers
              </h2>
              <p className="text-xl text-gray-600">Real impact, real numbers</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  2-5s
                </div>
                <p className="text-gray-600">Average Processing Time</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  5
                </div>
                <p className="text-gray-600">Free Tries Without Signup</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  50/day
                </div>
                <p className="text-gray-600">Free Images For Registered Users</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  0%
                </div>
                <p className="text-gray-600">Images Stored (Zero Storage)</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Try QuickBG?
            </h2>
            <p className="text-xl text-gray-600">
              Start removing backgrounds in seconds. No signup required for your first 5 images!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="primary" icon={<Sparkles className="w-5 h-5" />}>
                  Try It Now
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

