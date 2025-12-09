"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Cookie, Check, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/useTranslation";

export default function CookiesPage() {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Load existing preferences if available
    const savedPreferences = localStorage.getItem('cookiePreferences');
    const consentExpiry = localStorage.getItem('cookieConsentExpiry');
    
    if (savedPreferences) {
      // Check if consent has expired
      if (consentExpiry) {
        const expiryDate = new Date(consentExpiry);
        if (expiryDate < new Date()) {
          // Consent expired, reset to defaults
          localStorage.removeItem("cookieConsent");
          localStorage.removeItem("cookieConsentExpiry");
          localStorage.removeItem("cookiePreferences");
          toast(t("cookies.preferencesExpired"));
        } else {
          // Load saved preferences
          try {
            const parsed = JSON.parse(savedPreferences);
            setPreferences(parsed);
          } catch (e) {
            console.error("Error parsing cookie preferences:", e);
          }
        }
      } else {
        // Old format without expiry, load preferences
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences(parsed);
        } catch (e) {
          console.error("Error parsing cookie preferences:", e);
        }
      }
    }
  }, []);

  const handleSave = () => {
    // Set expiration date (1 year from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    // Save preferences to localStorage with expiration
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentExpiry', expirationDate.toISOString());
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    toast.success(t("cookies.preferencesSaved"));
  };

  const acceptAll = () => {
    // Set expiration date (1 year from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    setPreferences({ essential: true, analytics: true, marketing: true });
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentExpiry', expirationDate.toISOString());
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    toast.success(t("cookies.allAccepted"));
  };

  const rejectAll = () => {
    // Set expiration date (1 year from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    setPreferences({ essential: true, analytics: false, marketing: false });
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentExpiry', expirationDate.toISOString());
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, analytics: false, marketing: false }));
    toast.success(t("cookies.optionalRejected"));
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
                  {t("common.backToHome")}
                </Button>
              </Link>
            </div>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Cookie className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t("cookies.badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
                {t("cookies.title")}
                <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {t("cookies.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("cookies.description")}
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
                {t("cookies.acceptAll")}
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {t("cookies.rejectOptional")}
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("cookies.essentialCookies")}</h3>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                        {t("cookies.alwaysActive")}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {t("cookies.essentialDesc")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>{t("cookies.sessionManagement")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>{t("cookies.userAuthentication")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>{t("cookies.securityFraud")}</span>
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("cookies.analyticsCookies")}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {t("cookies.analyticsDesc")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">{t("cookies.pageViews")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">{t("cookies.timeSpent")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">{t("cookies.errorTracking")}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 italic">
                      {t("cookies.analyticsNote")}
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("cookies.marketingCookies")}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {t("cookies.marketingDesc")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">{t("cookies.socialMedia")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">{t("cookies.advertisingTracking")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="line-through">{t("cookies.retargetingPixels")}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 italic">
                      {t("cookies.marketingNote")}
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
                {t("cookies.savePreferences")}
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">{t("cookies.whatWeUse")}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">{t("cookies.transparencyDesc")}</p>
            </div>
            <Card className="border-2 border-primary-100 dark:border-primary-800 shadow-xl">
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent rounded-xl border-l-4 border-green-500 dark:border-green-600">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{t("cookies.sessionCookie")}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t("cookies.sessionCookieDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-xl border-l-4 border-blue-500 dark:border-blue-600">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{t("cookies.anonymousTracking")}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t("cookies.anonymousTrackingDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 dark:to-transparent rounded-xl border-l-4 border-red-500 dark:border-red-600">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{t("cookies.noThirdPartyTrackers")}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t("cookies.noThirdPartyDesc")}
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

