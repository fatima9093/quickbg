import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";
import { mockPricingPlans } from "@/lib/mock-data";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Simple,
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {" "}transparent pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockPricingPlans.map((plan, index) => (
            <Card
              key={index}
              hover
              className={`relative animate-fade-in ${
                plan.highlighted
                  ? "border-2 border-primary-500 shadow-2xl shadow-primary-500/20 scale-105"
                  : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="p-8 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 text-sm mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-0 space-y-6">
                <Link href="/signup">
                  <Button
                    variant={plan.highlighted ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need a custom plan?{" "}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

