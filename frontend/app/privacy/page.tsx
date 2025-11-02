import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Lock, Eye, Server, Database, Check, X } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Your Privacy
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Matters
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card className="border-2 border-primary-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Introduction</h2>
                      <p className="text-gray-600 leading-relaxed">
                        At QuickBG, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                        and protect your information when you use our background removal service.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-green-900 font-bold text-lg mb-1">
                          TL;DR: Zero Storage Policy
                        </p>
                        <p className="text-green-800">
                          We don&apos;t store your images. Ever. Your photos are processed in memory and immediately deleted. No exceptions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        Account Information (Optional)
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-3 ml-7">
                        If you create an account, we collect:
                      </p>
                      <ul className="list-disc pl-12 text-gray-600 space-y-2">
                        <li>Email address</li>
                        <li>Name (optional)</li>
                        <li>Password (encrypted)</li>
                        <li>Account creation date</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        Usage Statistics
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-3 ml-7">
                        We track basic usage to provide you with your daily limit:
                      </p>
                      <ul className="list-disc pl-12 text-gray-600 space-y-2">
                        <li>Number of images processed</li>
                        <li>Processing dates and times</li>
                        <li>Total processing time</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <X className="w-5 h-5 text-red-600" />
                        Your Images
                      </h3>
                      <div className="ml-7 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-blue-900 font-bold text-lg mb-1">
                              Zero Storage Policy
                            </p>
                            <p className="text-blue-800">
                              We do NOT store, save, or keep any images you upload. 
                              Images are processed in memory and deleted immediately after you download them. We have no database, 
                              no backups, no copies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>To provide and maintain our service</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>To track your daily usage limits</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>To communicate important service updates</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>To improve our service and user experience</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>To prevent abuse and enforce our Terms of Service</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Image Processing Flow</h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        When you upload an image, here&apos;s exactly what happens:
                      </p>
                      <ol className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                          <span>Your image is uploaded via secure HTTPS connection</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                          <span>Our AI processes it in memory (2-5 seconds)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                          <span>The processed image is sent back to you</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                          <span>Both original and processed images are immediately deleted from our servers</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">5</div>
                          <span>No traces remain - we keep zero copies</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We implement industry-standard security measures:
                      </p>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>HTTPS encryption for all data transmission</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Encrypted password storage</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Regular security audits</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Secure server infrastructure</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>No image storage = no risk of image data breaches</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use minimal cookies:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Session Cookie:</strong> To keep you logged in</li>
                  <li><strong>Anonymous Usage Tracking:</strong> IP-based tracking for free tier limits (5 tries)</li>
                  <li><strong>No Third-Party Trackers:</strong> We don&apos;t use Google Analytics, Facebook Pixel, or similar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
                <p className="text-gray-600 leading-relaxed">
                  We use the following third-party services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Cloud Hosting:</strong> To run our servers</li>
                  <li><strong>PostgreSQL Database:</strong> To store account information only (not images)</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We do NOT use: Amazon S3, Google Cloud Storage, or any file storage service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access your account information</li>
                  <li>Update your account details</li>
                  <li>Delete your account at any time</li>
                  <li>Export your data (usage statistics only)</li>
                  <li>Opt out of email communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  QuickBG is not intended for children under 13. We do not knowingly collect information 
                  from children. If you&apos;re a parent and believe your child has used our service, 
                  please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We&apos;ll notify you of any significant 
                  changes by email (if you have an account) or by posting a notice on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-medium">Email: <a href="mailto:privacy@quickbg.com" className="text-primary-600">privacy@quickbg.com</a></p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

