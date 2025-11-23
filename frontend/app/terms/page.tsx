import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Shield, Users, AlertTriangle, Check, X, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
                <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Terms of Service</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
                Terms of
                <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card className="border-2 border-primary-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Agreement to Terms</h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        By accessing or using QuickBG (&quot;Service&quot;), you agree to be bound by these Terms of Service. 
                        If you don&apos;t agree to these terms, please don&apos;t use our Service.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Description of Service</h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        QuickBG provides an AI-powered background removal service. The Service includes:
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Background removal for uploaded images</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>5 free tries without creating an account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Unlimited background removal for registered users (free forever)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Instant processing (2-5 seconds)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Zero image storage - privacy-first approach</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">User Accounts</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Account Creation</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  To use QuickBG beyond 5 free tries, you must create an account. When creating an account:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>You must provide accurate information</li>
                  <li>You must be at least 13 years old</li>
                  <li>You&apos;re responsible for maintaining account security</li>
                  <li>One person or entity may maintain only one free account</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">Account Responsibility</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You are responsible for all activity under your account. If you believe your account 
                  has been compromised, notify us immediately at contact@quickbg.app.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Usage Limits</h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li><strong>Anonymous Users:</strong> 5 free tries without signup</li>
                  <li><strong>Registered Users:</strong> Unlimited background removal - no daily limits</li>
                  <li>After using your 5 free tries, create a free account for unlimited access</li>
                  <li>Attempting to circumvent limits may result in account suspension</li>
                </ul>
              </section>

              <Card className="border-2 border-red-100 dark:border-red-800 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Acceptable Use</h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        You agree NOT to:
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Upload illegal, offensive, or inappropriate content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Use the Service for any unlawful purpose</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Attempt to hack, disrupt, or compromise the Service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Create multiple accounts to circumvent usage limits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Upload images containing personal information of others without consent</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Use automated bots or scripts to abuse the Service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Resell or commercially distribute our Service without permission</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Upload malware, viruses, or malicious code</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Content Ownership</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Content</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You retain full ownership of all images you upload. We claim no ownership rights to your content.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">Our Content</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The QuickBG Service, including its design, features, and AI technology, is owned by us and 
                  protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Image Processing & Privacy</h2>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 rounded mb-4">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    <strong className="text-green-900 dark:text-green-100">Zero Storage Guarantee:</strong> We do not store, save, or keep any images you upload. 
                    Images are processed in memory and immediately deleted.
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  For full details on how we handle your data, please read our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Service Availability</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We strive to keep QuickBG available 24/7, but we don&apos;t guarantee:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Uninterrupted access to the Service</li>
                  <li>Error-free operation</li>
                  <li>That the Service will meet your specific requirements</li>
                  <li>That defects will be corrected immediately</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  We may suspend or terminate the Service for maintenance, updates, or other reasons.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Disclaimer of Warranties</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. We disclaim all warranties, 
                  express or implied, including warranties of merchantability, fitness for a particular purpose, 
                  and non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Limitation of Liability</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To the maximum extent permitted by law, QuickBG shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Termination</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We may terminate or suspend your account and access to the Service:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>If you violate these Terms</li>
                  <li>If you abuse the Service</li>
                  <li>For any reason, with or without notice</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  You may delete your account at any time from your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Changes to Terms</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We reserve the right to modify these Terms at any time. If we make material changes, 
                  we&apos;ll notify you by email (if you have an account) or by posting a notice on our website. 
                  Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Governing Law</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws, 
                  without regard to conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="mt-4 p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium">Email: <a href="mailto:legal@quickbg.com" className="text-primary-600">legal@quickbg.com</a></p>
                </div>
              </section>

              <section className="border-t pt-8">
                <p className="text-sm text-gray-500">
                  By using QuickBG, you acknowledge that you have read, understood, and agree to be bound 
                  by these Terms of Service.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

