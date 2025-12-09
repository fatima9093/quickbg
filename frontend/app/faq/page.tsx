"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpCircle, ChevronDown, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function FAQPage() {
  const { t } = useTranslation();
  
  const faqs = [
    {
      category: t("faq.categories.gettingStarted"),
      questions: [
        {
          q: t("faq.questions.howDoesItWork.q"),
          a: t("faq.questions.howDoesItWork.a")
        },
        {
          q: t("faq.questions.needSignup.q"),
          a: t("faq.questions.needSignup.a")
        },
        {
          q: t("faq.questions.isFree.q"),
          a: t("faq.questions.isFree.a")
        },
      ]
    },
    {
      category: t("faq.categories.featuresLimits"),
      questions: [
        {
          q: t("faq.questions.freeTierLimits.q"),
          a: t("faq.questions.freeTierLimits.a")
        },
        {
          q: t("faq.questions.imageFormats.q"),
          a: t("faq.questions.imageFormats.a")
        },
        {
          q: t("faq.questions.maxImageSize.q"),
          a: t("faq.questions.maxImageSize.a")
        },
        {
          q: t("faq.questions.processingSpeed.q"),
          a: t("faq.questions.processingSpeed.a")
        },
      ]
    },
    {
      category: t("faq.categories.privacySecurity"),
      questions: [
        {
          q: t("faq.questions.storeImages.q"),
          a: t("faq.questions.storeImages.a")
        },
        {
          q: t("faq.questions.dataSafe.q"),
          a: t("faq.questions.dataSafe.a")
        },
        {
          q: t("faq.questions.whoCanSee.q"),
          a: t("faq.questions.whoCanSee.a")
        },
      ]
    },
    {
      category: t("faq.categories.technical"),
      questions: [
        {
          q: t("faq.questions.aiTechnology.q"),
          a: t("faq.questions.aiTechnology.a")
        },
        {
          q: t("faq.questions.firstUploadSlow.q"),
          a: t("faq.questions.firstUploadSlow.a")
        },
        {
          q: t("faq.questions.commercialUse.q"),
          a: t("faq.questions.commercialUse.a")
        },
        {
          q: t("faq.questions.haveAPI.q"),
          a: t("faq.questions.haveAPI.a")
        },
      ]
    },
    {
      category: t("faq.categories.troubleshooting"),
      questions: [
        {
          q: t("faq.questions.uploadFailed.q"),
          a: t("faq.questions.uploadFailed.a")
        },
        {
          q: t("faq.questions.backgroundNotRemoved.q"),
          a: t("faq.questions.backgroundNotRemoved.a")
        },
        {
          q: t("faq.questions.usedAllTries.q"),
          a: t("faq.questions.usedAllTries.a")
        },
        {
          q: t("faq.questions.loggedInIssues.q"),
          a: t("faq.questions.loggedInIssues.a")
        },
      ]
    },
    {
      category: t("faq.categories.accountBilling"),
      questions: [
        {
          q: t("faq.questions.createAccount.q"),
          a: t("faq.questions.createAccount.a")
        },
        {
          q: t("faq.questions.upgradeAccount.q"),
          a: t("faq.questions.upgradeAccount.a")
        },
        {
          q: t("faq.questions.deleteAccount.q"),
          a: t("faq.questions.deleteAccount.a")
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
                <HelpCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">FAQ</span>
              </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              {t("faq.title")}
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t("faq.titleHighlight")}
              </span>
            </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("faq.description")}
              </p>
            </div>
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("faq.stillHaveQuestions")}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t("faq.stillHaveQuestionsDesc")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a 
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                  >
                    {t("faq.contactSupport")}
                  </a>
                  <a 
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-primary-600 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  >
                    {t("faq.tryQuickBGNow")}
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

