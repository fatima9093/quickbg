import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, Zap, Shield, Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-600" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>100% Free Forever</span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Already tried it above?
          <br />
          Sign up for unlimited access!
        </h2>

        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Create a free account and remove backgrounds from 50 images every day. 
          <br className="hidden sm:block" />
          No credit card. No hidden fees. Just pure AI-powered magic.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/signup">
            <Button size="lg" variant="secondary" icon={<Sparkles className="w-5 h-5" />}>
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Already have an account? Log In
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">No credit card required</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">50 images/day free</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Zero data storage</span>
          </div>
        </div>
      </div>
    </section>
  );
}

