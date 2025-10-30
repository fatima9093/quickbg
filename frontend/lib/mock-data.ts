// Landing page content (not user-specific)
// NOTE: User data and uploads are now fetched from the real API
// This file only contains static marketing content

export const mockFeatures = [
  {
    icon: "Sparkles",
    title: "AI-Powered Precision",
    description: "Advanced AI technology removes backgrounds with pixel-perfect accuracy, handling complex edges and fine details.",
  },
  {
    icon: "Zap",
    title: "Lightning Fast",
    description: "Process images in seconds. Batch upload support for processing multiple images simultaneously.",
  },
  {
    icon: "Shield",
    title: "Secure & Private",
    description: "Your images are encrypted and automatically deleted after processing. We never store your data permanently.",
  },
  {
    icon: "Download",
    title: "High Quality Output",
    description: "Download in multiple formats (PNG, JPEG, WebP) with customizable resolution and compression.",
  },
  {
    icon: "Wand2",
    title: "Smart Edge Detection",
    description: "Handles hair, fur, glass, and complex backgrounds with intelligent edge refinement.",
  },
  {
    icon: "Image",
    title: "Batch Processing",
    description: "Upload and process multiple images at once. Save time with bulk operations.",
  },
];

export const mockPricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects",
    features: [
      "5 tries without signup",
      "50 images per day",
      "2-5 second processing",
      "High-quality PNG export",
      "No credit card required",
    ],
    cta: "Start Free Now",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals and businesses",
    features: [
      "500 images per day",
      "Ultra-fast processing",
      "Priority support",
      "All export formats",
      "Batch processing",
      "API access",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and large scale",
    features: [
      "Unlimited images",
      "Dedicated AI infrastructure",
      "24/7 premium support",
      "Custom integration",
      "SLA guarantee",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export const mockTestimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Manager",
    company: "StyleHub",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "QuickBG has transformed our product photography workflow. We process hundreds of images daily with incredible results.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Photographer",
    company: "Chen Studios",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content: "The AI precision is unmatched. It handles even the most complex backgrounds with hair and fur perfectly.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "BrandCo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content: "Saved us thousands in editing costs. The batch processing feature is a game-changer for our campaigns.",
    rating: 5,
  },
];

