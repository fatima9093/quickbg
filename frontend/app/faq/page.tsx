"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How does QuickBG work?",
        a: "QuickBG uses advanced AI technology (U²-Net) to automatically detect and remove backgrounds from your images. Simply upload your image, and our AI processes it in 2-5 seconds. You'll get a high-quality PNG with a transparent background, ready to download."
      },
      {
        q: "Do I need to sign up to use QuickBG?",
        a: "No! You can try QuickBG 5 times completely free without creating an account. After your free tries, create a free account to get unlimited background removal forever - no credit card required."
      },
      {
        q: "Is QuickBG really free?",
        a: "Yes! QuickBG is 100% free. You get 5 tries without signup, then unlimited background removal after creating a free account. There are no hidden fees, no premium tiers, and no credit card required."
      },
    ]
  },
  {
    category: "Features & Limits",
    questions: [
      {
        q: "What are the free tier limits?",
        a: "Anonymous users: 5 free tries without signup. Registered users: Unlimited background removal - no limits, forever free. Just create a free account after your 5 tries."
      },
      {
        q: "What image formats do you support?",
        a: "We support all common image formats including JPG, JPEG, PNG, WEBP, and more. Your processed image is always exported as a high-quality PNG with transparency."
      },
      {
        q: "What's the maximum image size?",
        a: "You can upload images up to 10MB and 4096x4096 pixels. Our AI automatically optimizes the processing while maintaining quality."
      },
      {
        q: "How fast is the processing?",
        a: "Most images are processed in 2-5 seconds. We've optimized our AI model for speed without compromising quality."
      },
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Do you store my images?",
        a: "Absolutely not! We have a strict zero-storage policy. Your images are processed in memory and immediately deleted after you download them. We never save, store, or keep any of your images."
      },
      {
        q: "Is my data safe?",
        a: "Yes! We use secure HTTPS connections for all uploads. Your images are processed on our servers and deleted immediately. We don't track or store any image data."
      },
      {
        q: "Who can see my images?",
        a: "Only you! Your images are never accessible to anyone else. They're processed privately and exist only during the brief processing period."
      },
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What AI technology powers QuickBG?",
        a: "We use the U²-Net (u2netp) AI model, which is specifically designed for accurate background removal. It's been optimized for speed and runs 4x faster than standard models."
      },
      {
        q: "Why is my first upload slower?",
        a: "The AI model is pre-warmed when our server starts, so your first upload should be just as fast! If you notice any slowness, it's likely due to network conditions."
      },
      {
        q: "Can I use QuickBG for commercial projects?",
        a: "Yes! You can use QuickBG for personal and commercial projects. The processed images are yours to use however you like."
      },
      {
        q: "Do you have an API?",
        a: "Not yet, but it's on our roadmap! We're focused on perfecting the web experience first. Sign up to get notified when our API launches."
      },
    ]
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        q: "Why did my upload fail?",
        a: "Common reasons: Image exceeds 10MB, unsupported format, or network issues. Make sure your image is under 10MB and in a standard format (JPG, PNG, WEBP)."
      },
      {
        q: "The background wasn't removed correctly. Why?",
        a: "AI isn't perfect! Complex backgrounds, low-contrast images, or transparent subjects can be challenging. Try images with clear subject-background separation for best results."
      },
      {
        q: "I've used all my free tries. Now what?",
        a: "Create a free account to get unlimited background removal! It takes just 30 seconds and doesn't require a credit card."
      },
      {
        q: "I'm logged in but having issues uploading.",
        a: "If you're logged in, you should have unlimited access. Try signing out and signing back in. If the issue persists, clear your browser cache and cookies, then try again."
      },
    ]
  },
  {
    category: "Account & Billing",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top right corner, enter your name, email, and password. That's it! No credit card needed."
      },
      {
        q: "Can I upgrade my account?",
        a: "Currently, we offer unlimited background removal for free! All registered users get unlimited access with no daily limits. Enterprise options may be available in the future for additional features."
      },
      {
        q: "How do I delete my account?",
        a: "Contact us at support@quickbg.com and we'll delete your account within 24 hours. Remember, we don't store any of your images anyway!"
      },
    ]
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 dark:hover:from-primary-900/20 hover:to-transparent transition-all duration-200"
      >
        <span className="text-left font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{question}</span>
        <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-primary-600 dark:bg-primary-500 rotate-180' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
        }`}>
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed animate-in fade-in duration-200">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <HelpCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">FAQ</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              Frequently Asked
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Everything you need to know about QuickBG. Can&apos;t find what you&apos;re looking for? 
              Contact us and we&apos;ll get back to you ASAP!
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.category}</h2>
                </div>
                <Card className="border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 transition-colors shadow-md">
                  <CardContent className="p-0">
                    {category.questions.map((faq, qIdx) => (
                      <FAQItem key={qIdx} question={faq.q} answer={faq.a} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-primary-900/20 shadow-xl">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Still Have Questions?</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  We&apos;re here to help! Reach out to our friendly support team and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a 
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                  >
                    Contact Support
                  </a>
                  <a 
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-primary-600 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  >
                    Try QuickBG Now
                  </a>
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

