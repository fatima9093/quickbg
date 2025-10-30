import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield } from "lucide-react";

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
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  At QuickBG, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  and protect your information when you use our background removal service.
                </p>
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-green-800 font-medium">
                    <strong>TL;DR:</strong> We don't store your images. Ever. Your photos are processed and immediately deleted.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Information (Optional)</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Email address</li>
                  <li>Name (optional)</li>
                  <li>Password (encrypted)</li>
                  <li>Account creation date</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Statistics</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We track basic usage to provide you with your daily limit:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Number of images processed</li>
                  <li>Processing dates and times</li>
                  <li>Total processing time</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your Images</h3>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-blue-800 font-medium">
                    <strong>Zero Storage Policy:</strong> We do NOT store, save, or keep any images you upload. 
                    Images are processed in memory and deleted immediately after you download them. We have no database, 
                    no backups, no copies.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To track your daily usage limits</li>
                  <li>To communicate important service updates</li>
                  <li>To improve our service and user experience</li>
                  <li>To prevent abuse and enforce our Terms of Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Image Processing</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you upload an image:
                </p>
                <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                  <li>Your image is uploaded via secure HTTPS connection</li>
                  <li>Our AI processes it in memory (2-5 seconds)</li>
                  <li>The processed image is sent back to you</li>
                  <li>Both original and processed images are immediately deleted from our servers</li>
                  <li>No traces remain - we keep zero copies</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We implement industry-standard security measures:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Encrypted password storage</li>
                  <li>Regular security audits</li>
                  <li>Secure server infrastructure</li>
                  <li>No image storage = no risk of image data breaches</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use minimal cookies:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Session Cookie:</strong> To keep you logged in</li>
                  <li><strong>Anonymous Usage Tracking:</strong> IP-based tracking for free tier limits (5 tries)</li>
                  <li><strong>No Third-Party Trackers:</strong> We don't use Google Analytics, Facebook Pixel, or similar</li>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  QuickBG is not intended for children under 13. We do not knowingly collect information 
                  from children. If you're a parent and believe your child has used our service, 
                  please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We'll notify you of any significant 
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

