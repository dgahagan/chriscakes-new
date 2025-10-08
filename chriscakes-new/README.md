# ChrisCakes - Modern Website with CMS

A modernized website for ChrisCakes of Michigan, built with Next.js 15 and Sanity CMS, enabling non-technical owners to manage content independently.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git
- Sanity account (free tier available)

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your Sanity credentials (see [SETUP.md](./SETUP.md) for details)

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Visit the site**:
   - Website: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup instructions, Sanity authentication, and **Vercel deployment guide**
- **[../IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md)** - Project roadmap and implementation details
- **[../CONTENT_AUDIT.md](../CONTENT_AUDIT.md)** - Content inventory from original site

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image + Sanity CDN

## 📁 Project Structure

```
chriscakes-new/
├── app/                    # Next.js pages (App Router)
│   ├── page.tsx           # Homepage
│   ├── menu/              # Menu page
│   ├── services/          # Services page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── studio/            # Sanity Studio
├── components/            # React components
│   ├── layout/           # Header, Footer
│   └── menu/             # Menu components
├── lib/                  # Utilities
│   ├── sanity.ts        # Sanity client
│   └── queries.ts       # GROQ queries
├── sanity/              # Sanity configuration
│   └── schemas/         # Content schemas
├── public/              # Static assets
└── scripts/            # Import scripts
```

## 🎨 Features

- ✅ Fully responsive design with mobile hamburger menu
- ✅ Real-time content management via Sanity Studio
- ✅ Menu filtering by category
- ✅ Image optimization and CDN delivery
- ✅ Incremental Static Regeneration (ISR)
- ✅ TypeScript for type safety
- ✅ SEO-friendly with proper meta tags
- ✅ Fast builds with webpack

## 🚢 Deployment

### Quick Deploy to Vercel

See [SETUP.md - Deployment to Vercel](./SETUP.md#deployment-to-vercel) for comprehensive deployment instructions including:

- **Web Dashboard deployment** (easiest)
- **CLI deployment** (for automation)
- **Staging/Preview deployments** (automatic for branches & PRs)
- **Custom domain setup**
- **Environment variable configuration**
- **CORS configuration for Sanity**

**Quick Deploy Button**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/chriscakes-new)

### Environment Variables for Deployment

Required environment variables (add these in Vercel):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting
- `npm run import:all` - Import all content to Sanity

## 🎯 Content Management

### Sanity Studio

Access the Sanity Studio at `/studio` to manage:

- **Menu Items** - Add, edit, delete menu items with prices and images
- **Menu Categories** - Organize menu items by category
- **Pages** - Edit content for About, Services, etc.
- **Site Settings** - Update contact info, hours, social media

### Content Types

1. **Menu Category** - Breakfast, Lunch, Dinner, etc.
2. **Menu Item** - Individual items with name, price, description, image
3. **Page** - Dynamic pages with rich text content
4. **Site Settings** - Global site configuration
5. **Testimonial** - Customer testimonials
6. **FAQ** - Frequently asked questions

## 🔧 Development

### Code Quality

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Run linter
npm run lint
```

### Building Locally

```bash
# Test production build
npm run build

# Run production build
npm start
```

## 🐛 Troubleshooting

Common issues and solutions:

### Build Fails
- Check environment variables are set correctly
- Ensure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`

### Sanity Connection Issues
- Verify Sanity project ID and API token
- Check CORS settings in Sanity dashboard
- Ensure environment variables start with `NEXT_PUBLIC_` for client-side access

### Image Optimization Errors
- Confirm `cdn.sanity.io` is in `next.config.ts` allowed domains
- Verify images are uploaded to Sanity CDN

See [SETUP.md](./SETUP.md) for more troubleshooting help.

## 📊 Project Status

**Current Phase**: Phase 4 Complete ✅

- ✅ Phase 1: Project Setup & Planning
- ✅ Phase 2: CMS Schema Design
- ✅ Phase 3: Content Migration
- ✅ Phase 4: Frontend Development
- ⏭️ Phase 5: Testing (Ready to begin)
- ⏭️ Phase 6: Deployment
- ⏭️ Phase 7: Training & Documentation

## 🤝 Contributing

This is a private project for ChrisCakes of Michigan. For questions or support, contact the development team.

## 📄 License

Proprietary - ChrisCakes of Michigan

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Built with ❤️ for ChrisCakes of Michigan**
