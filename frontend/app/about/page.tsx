"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Sparkles, Zap, Shield, Heart, Users, Target, Award, TrendingUp, Globe, Lock, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back to Home Button */}
            <div className="flex justify-start">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t("common.backToHome")}
                </Button>
              </Link>
            </div>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t("about.badge")}</span>
              </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              {t("about.title")}
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.titleHighlight")}
              </span>
            </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                {t("about.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">Our Story</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                What We Stand For
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Our core values guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-700">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Privacy First</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    We never store your images. Upload, process, download - then it&apos;s gone forever. 
                    Your photos stay yours.
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      <Lock className="w-4 h-4" />
                      Zero Storage
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-700">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Speed & Quality</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    We optimize every millisecond. Get professional-quality results in 2-5 seconds, 
                    not minutes.
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      AI Powered
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-700">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Free Forever</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Everyone deserves access to great tools. Try 5 times without signup, 
                    then get unlimited background removal free forever.
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                      <Sparkles className="w-4 h-4" />
                      No Credit Card
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-white text-center space-y-8 shadow-2xl">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-xl md:text-2xl opacity-95 leading-relaxed max-w-3xl mx-auto">
                To democratize professional image editing by providing lightning-fast, privacy-focused, 
                and completely free background removal tools to everyone, everywhere.
              </p>
              <div className="pt-6 flex flex-wrap justify-center gap-8 text-white/90">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">Global Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span className="text-sm font-medium">Privacy First</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-medium">Pro Quality</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* By The Numbers */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Our Impact</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                QuickBG By The Numbers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Real metrics that matter to you</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mb-2">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                    2-5s
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Average Processing Time</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lightning fast results</p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 flex items-center justify-center mb-2">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                    5
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Free Tries</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No signup required</p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 flex items-center justify-center mb-2">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                    ∞
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Registered Users</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unlimited, free forever</p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 flex items-center justify-center mb-2">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                    0%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Images Stored</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Zero storage policy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-primary-900/20 shadow-xl">
              <CardContent className="p-12 text-center space-y-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Ready to Experience QuickBG?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of users who trust QuickBG for fast, private, and free background removal. 
                  Start with 5 free tries - no signup required!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/">
                    <Button 
                      size="lg" 
                      variant="primary" 
                      icon={<Sparkles className="w-5 h-5" />}
                      className="min-w-[200px]"
                    >
                      Try It Now - Free
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="min-w-[200px]"
                    >
                      Create Free Account
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 pt-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>No credit card needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Zero storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>2-5 second processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

