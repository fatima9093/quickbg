"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare, Send, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/useTranslation";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';
      const response = await fetch(`${apiUrl}/api/v1/contact/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to send message' }));
        throw new Error(errorData.detail || 'Failed to send message');
      }

      toast.success(t("contact.messageSent"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(t("contact.processingFailed") || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
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
                <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t("contact.badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
                {t("contact.title")}
                <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {t("contact.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("contact.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{t("contact.emailUs")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t("contact.emailUsDesc")}
                      </p>
                      <a 
                        href="mailto:contact@quickbg.app" 
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold inline-flex items-center gap-1 group"
                      >
                        contact@quickbg.app
                        <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{t("contact.responseTime")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t("contact.responseTimeDesc")}
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{t("contact.hours24")}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{t("contact.basedIn")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("contact.basedInDesc")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-lg">
                  <CardContent className="p-8 md:p-10">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("contact.sendMessage")}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{t("contact.sendMessageDesc")}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label={t("contact.yourName")}
                          type="text"
                          placeholder={t("signup.namePlaceholder")}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                        <Input
                          label={t("contact.yourEmail")}
                          type="email"
                          placeholder={t("contact.yourEmail")}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>

                      <Input
                        label={t("contact.subject")}
                        type="text"
                        placeholder={t("contact.subjectPlaceholder")}
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t("contact.message")}
                        </label>
                        <textarea
                          placeholder={t("contact.messagePlaceholder")}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          rows={6}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full"
                        loading={loading}
                        icon={<Send className="w-5 h-5" />}
                      >
                        {t("contact.sendMessageButton")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-xl">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("contact.lookingForAnswers")}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t("contact.lookingForAnswersDesc")}
                </p>
                <a 
                  href="/faq"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                >
                  {t("contact.visitFAQ")}
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

