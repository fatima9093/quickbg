# QuickBG Frontend

A modern, production-grade frontend for AI-powered background removal.

## 🎨 Design Features

- **Modern UI**: Clean, professional design with glassmorphism effects
- **Smooth Animations**: Framer Motion for fluid interactions
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: Built with accessibility in mind
- **Dark Mode Ready**: Infrastructure for dark mode support

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/           # Dashboard pages
│   │   ├── upload/
│   │   ├── gallery/
│   │   ├── profile/
│   │   └── settings/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── providers.tsx        # Context providers
├── components/              # React components
│   ├── ui/                  # UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardLayout.tsx
│   └── sections/            # Page sections
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       └── ...
├── lib/                     # Utilities
│   ├── api-client.ts       # API client
│   ├── auth.ts             # Auth config
│   ├── utils.ts            # Helper functions
│   └── mock-data.ts        # Mock data
└── types/                   # TypeScript types
    ├── index.ts
    └── next-auth.d.ts
```

## 🎯 Pages

### Public Pages
- **Landing Page** (`/`) - Hero, features, pricing, testimonials
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Forgot Password** (`/forgot-password`) - Password reset

### Dashboard Pages
- **Dashboard** (`/dashboard`) - Overview with stats and recent uploads
- **Upload** (`/dashboard/upload`) - Drag-and-drop image upload
- **Gallery** (`/dashboard/gallery`) - Browse and manage processed images
- **Profile** (`/dashboard/profile`) - User profile and account info
- **Settings** (`/dashboard/settings`) - Preferences and security

### Admin Pages
- **Admin Dashboard** (`/admin`) - Admin overview (protected route)

## 🎨 Design System

### Colors
- **Primary**: `#2b3d98` (Custom blue from your brand)
- **Gradients**: Primary to purple for modern feel
- **Gray Scale**: From `gray-50` to `gray-900`
- **Status Colors**: Green (success), Yellow (warning), Red (error)

### Typography
- **Font**: Inter (system font)
- **Sizes**: Responsive scale from `text-sm` to `text-7xl`
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Hover effects, glass effect, shadows
- **Inputs**: Focus states, error states, icons
- **Badges**: Success, Warning, Error, Info variants

### Animations
- **Fade In**: Smooth entrance animations
- **Slide Up/Down**: Directional animations
- **Scale**: Hover effects on cards
- **Shimmer**: Loading placeholders

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003)

### Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## 🔑 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8002
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/quickbg
```

## 📱 Responsive Design

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive with mobile-first approach.

## ♿ Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Screen reader friendly

## 🎭 Mock Data

Mock data is available in `lib/mock-data.ts` for development and preview:
- User data
- Upload history
- Stats and analytics
- Testimonials
- Pricing plans

## 🔒 Authentication Flow

1. User visits landing page
2. Clicks "Sign Up" or "Login"
3. Authenticates via NextAuth
4. Redirected to dashboard
5. Protected routes check authentication

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: "#2b3d98", // Your custom color
    // ... other shades
  },
}
```

### Animations

Add custom animations in `tailwind.config.ts`:

```typescript
animation: {
  "your-animation": "your-animation 1s ease-in-out",
},
keyframes: {
  "your-animation": {
    "0%": { /* ... */ },
    "100%": { /* ... */ },
  },
}
```

## 📦 Build Output

Production build is optimized with:
- Code splitting
- Image optimization
- Font optimization
- Tree shaking
- Minification

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Other Platforms

```bash
npm run build
# Upload .next folder
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3003
npx kill-port 3003
```

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
npm run type-check
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🎉 Features Showcase

### Landing Page
- Animated hero section with glassmorphism
- Feature cards with hover effects
- Smooth scroll animations
- Pricing comparison table
- Customer testimonials
- CTA sections with gradients

### Dashboard
- Sidebar navigation
- Stats cards with trends
- Recent uploads list
- Quick actions
- Responsive layout

### Upload Page
- Drag-and-drop zone
- File preview
- Upload progress
- Batch processing
- Status indicators

### Gallery
- Grid/List view toggle
- Search and filters
- Status badges
- Quick actions
- Image preview

### Profile
- Avatar upload
- Account information
- Subscription details
- Usage statistics
- Preferences

## 🤝 Contributing

See main repository CONTRIBUTING.md

## 📄 License

MIT License - see main repository LICENSE

---

Built with ❤️ using Next.js and TailwindCSS
