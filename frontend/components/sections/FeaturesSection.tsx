"use client";

import { 
  Sparkles, 
  Zap, 
  Shield, 
  Download, 
  User, 
  Infinity 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useTranslation } from "@/lib/useTranslation";

export function FeaturesSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Sparkles,
      title: t("features.professional.title"),
      description: t("features.professional.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: t("features.privacy.title"),
      description: t("features.privacy.description"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Download,
      title: t("features.transparent.title"),
      description: t("features.transparent.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: User,
      title: t("features.tryFree.title"),
      description: t("features.tryFree.description"),
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Infinity,
      title: t("features.unlimited.title"),
      description: t("features.unlimited.description"),
      gradient: "from-red-500 to-pink-500",
    },
  ];
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>{t("features.badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            {t("features.title")}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {" "}{t("features.titleHighlight")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("features.description")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8 space-y-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

