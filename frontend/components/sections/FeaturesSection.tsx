import { 
  Sparkles, 
  Zap, 
  Shield, 
  Download, 
  User, 
  Infinity 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    icon: Sparkles,
    title: "Professional Results Every Time",
    description: "Get studio-quality background removal with precise edge detection. Perfect for product photos, portraits, and more.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Your images are ready in 2-5 seconds. No waiting around - upload, process, and download in a flash.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Your Privacy Protected",
    description: "We never save your images. Upload, process, download - then it's gone forever. Your photos stay yours.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Download,
    title: "Perfect Transparent Images",
    description: "Get crystal-clear transparent backgrounds ready to use. Perfect for websites, presentations, and social media.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: User,
    title: "Try Without Signup",
    description: "Test it out with 5 free tries - no signup, no credit card, no hassle. Just upload and see the magic happen.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Infinity,
    title: "Unlimited After Signup",
    description: "Create a free account and remove backgrounds without limits. Forever free, no hidden costs.",
    gradient: "from-red-500 to-pink-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Real Features • No Fluff</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            What makes QuickBG
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {" "}different?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Fast, private, and free. No gimmicks, no hidden costs, just results you&apos;ll love.
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

