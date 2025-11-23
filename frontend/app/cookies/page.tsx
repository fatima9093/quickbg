"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Cookie, Check, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    toast.success("Cookie preferences saved!");
  };

  const acceptAll = () => {
    setPreferences({ essential: true, analytics: true, marketing: true });
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    toast.success("All cookies accepted!");
  };

  const rejectAll = () => {
    setPreferences({ essential: true, analytics: false, marketing: false });
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: false, marketing: false }));
    toast.success("Optional cookies rejected!");
  };

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
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Cookie className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Cookie Settings</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
                Cookie
                <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Settings
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Control how QuickBG uses cookies and similar technologies
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Preferences */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Accept All Cookies
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Reject Optional Cookies
              </button>
            </div>

            {/* Essential Cookies */}
            <Card className="border-2 border-green-100 dark:border-green-800 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Essential Cookies</h3>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                        ALWAYS ACTIVE
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      These cookies are necessary for the website to function and cannot be switched off. 
                      They are usually only set in response to actions made by you, such as logging in or 
                      filling in forms.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Session management</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>User authentication</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Security and fraud prevention</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center px-1 cursor-not-allowed">
                    <div className="w-4 h-4 bg-white dark:bg-gray-300 rounded-full ml-auto"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card className="border-2 border-blue-100 dark:border-blue-800 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                        <X className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Analytics Cookies</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously. This helps us improve our service.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Page views and navigation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Time spent on pages</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Error tracking</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 italic">
                      Note: QuickBG currently does not use analytics cookies
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({...preferences, analytics: !preferences.analytics})}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.analytics ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.analytics ? 'ml-auto' : ''
                    }`}></div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Cookies */}
            <Card className="border-2 border-purple-100 dark:border-purple-800 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                        <X className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Marketing Cookies</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      These cookies track your online activity to help advertisers deliver more relevant advertising 
                      or to limit how many times you see an ad.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Social media integration</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Advertising tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">Retargeting pixels</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 italic">
                      Note: QuickBG does not use marketing or advertising cookies
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({...preferences, marketing: !preferences.marketing})}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.marketing ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.marketing ? 'ml-auto' : ''
                    }`}></div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </section>

        {/* What We Actually Use */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Cookie className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Our Cookie Usage</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">What QuickBG Actually Uses</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Transparency is important to us. Here&apos;s what we really use:</p>
            </div>
            <Card className="border-2 border-primary-100 dark:border-primary-800 shadow-xl">
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent rounded-xl border-l-4 border-green-500 dark:border-green-600">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Session Cookie</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        To keep you logged in while you use QuickBG. This expires when you close your browser.
                        Essential for account functionality.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-xl border-l-4 border-blue-500 dark:border-blue-600">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Anonymous Usage Tracking</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        IP-based tracking to enforce the 5 free tries limit for anonymous users. No personal data is stored.
                        Resets automatically after 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 dark:to-transparent rounded-xl border-l-4 border-red-500 dark:border-red-600">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">No Third-Party Trackers</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We don&apos;t use Google Analytics, Facebook Pixel, or any third-party tracking services.
                        Your privacy is our priority.
                      </p>
                    </div>
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

