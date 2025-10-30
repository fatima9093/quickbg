import { Upload, Wand2, Download, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Image",
    description: "No signup required! Just drag and drop your image. Try 5 times completely free.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Wand2,
    title: "AI Magic Happens",
    description: "Our advanced AI removes the background in 2-5 seconds with incredible precision.",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Enjoy",
    description: "Get your processed image instantly. Love it? Sign up for unlimited access!",
    color: "from-green-500 to-emerald-500",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            How it
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {" "}works
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to perfect images
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200" />

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                {/* Step Number */}
                <div className="text-7xl font-bold text-gray-100 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-16 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300" />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

