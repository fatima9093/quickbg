"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare, Send, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
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
    
    // Simulate sending email
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <MessageSquare className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Contact
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have a question, feedback, or need help? We're here for you! 
              Drop us a message and we'll respond within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        For general inquiries and support
                      </p>
                      <a 
                        href="mailto:support@quickbg.com" 
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        support@quickbg.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                      <p className="text-sm text-gray-600">
                        We typically respond within 24 hours during business days
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Based In</h3>
                      <p className="text-sm text-gray-600">
                        Serving users worldwide with cloud-based infrastructure
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Your Name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                        <Input
                          label="Your Email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>

                      <Input
                        label="Subject"
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          placeholder="Tell us more about your question or feedback..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          rows={6}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full"
                        loading={loading}
                        icon={<Send className="w-5 h-5" />}
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Looking for Quick Answers?</h2>
            <p className="text-xl text-gray-600">
              Check out our FAQ page for instant answers to common questions
            </p>
            <a 
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              Visit FAQ
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

