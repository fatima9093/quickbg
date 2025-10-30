import Link from "next/link";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-600/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                QuickBG
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Remove image backgrounds instantly with AI-powered precision.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors group"
              >
                <Github className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Try It Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} QuickBG. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

