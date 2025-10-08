# ChrisCakes Website Upgrade - Implementation Plan

## Project Overview
Modernize the ChrisCakes restaurant website by implementing a content management system (CMS) that allows owners to update content independently without requiring manual HTML edits or developer intervention.

## Goals
- Enable non-technical owners to update menu items, categories, prices, images, and text content
- Maintain current design aesthetic while modernizing the technical foundation
- Implement a scalable, maintainable solution
- Zero or minimal hosting costs

## Technology Stack

### Recommended Stack
- **Frontend**: Next.js (React-based)
  - Benefits: SEO optimization, image optimization, static site generation, easy deployment
  - Alternative: Plain React if simpler needs
- **CMS**: Sanity.io
  - Benefits: Free tier available, intuitive UI, flexible content modeling, real-time previews
  - Generous free tier: 3 users, 2 datasets, unlimited API requests
- **Hosting**: Vercel
  - Benefits: Seamless Next.js integration, automatic deployments, free SSL, CDN
  - Free tier: Unlimited sites, 100GB bandwidth/month
- **Image Hosting**: Sanity.io CDN (included) or Cloudinary (free tier)

## Phase 1: Project Setup & Planning (Week 1) ✅

### 1.1 Repository & Environment Setup ✅
- [x] Create new Git repository for the upgraded site
- [x] Initialize Next.js project: `npx create-next-app@latest chriscakes-new`
- [x] Configure ESLint and Prettier for code quality
- [x] Set up environment variables structure (.env.local.example)

### 1.2 Sanity CMS Setup ✅
- [x] Create Sanity account and project structure (manual auth step required)
- [x] Configure Sanity Studio (admin interface) - schemas created
- [x] Set up Sanity configuration files (sanity.config.ts, schemas, queries)
- [ ] Configure CORS origins for local development and production domains (requires manual auth)

### 1.3 Content Analysis ✅
- [x] Audit current ChrisCakes website
- [x] Document all content types (menu items, categories, pages, images) - See CONTENT_AUDIT.md
- [x] Document current site structure and navigation
- [x] Identify all editable content areas
- [ ] Take screenshots of current design for reference (optional)

## Phase 2: CMS Schema Design (Week 1-2) ✅

### 2.1 Define Sanity Schemas ✅

#### Menu Category Schema ✅
```javascript
{
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text' },
    { name: 'order', type: 'number', description: 'Display order' },
    { name: 'image', type: 'image' }
  ]
}
```

#### Menu Item Schema ✅
```javascript
{
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'image', type: 'image' },
    { name: 'category', type: 'reference', to: [{ type: 'menuCategory' }] },
    { name: 'available', type: 'boolean', default: true },
    { name: 'featured', type: 'boolean', default: false },
    { name: 'allergens', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', type: 'number' }
  ]
}
```

#### Site Settings Schema ✅
```javascript
{
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'phone', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'address', type: 'text' },
    { name: 'hours', type: 'array', of: [{ type: 'object', fields: [...] }] },
    { name: 'socialMedia', type: 'object', fields: [...] },
    { name: 'logo', type: 'image' }
  ]
}
```

#### Page Content Schema (for About, Contact, etc.) ✅
```javascript
{
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'seo', type: 'object', fields: [...] }
  ]
}
```

### 2.2 Schema Implementation Tasks ✅
- [x] Create all schema files in `/sanity/schemas/`
- [x] Configure schema validation rules
- [x] Set up custom input components if needed
- [x] Test schema in Sanity Studio
- [x] Create sample content for testing

## Phase 3: Content Migration (Week 2) ✅

### 3.1 Data Extraction ✅
- [x] Extract all menu categories from current site (5 categories)
- [x] Extract all menu items with prices and descriptions (64 items)
- [x] Extract all images and optimize them (logo.png copied)
- [x] Extract site settings (contact info, hours, etc.)
- [x] Extract page content (About, Contact, etc.)

### 3.2 Data Import ✅
- [x] Create migration script using Sanity's import tools (scripts/import-all-content.ts)
- [x] Import all menu categories and items into Sanity
- [x] Upload logo image to public folder
- [x] Verify all content imported correctly
- [ ] Add menu item images to Sanity (optional enhancement)
- [ ] Review with owners for accuracy

## Phase 4: Frontend Development (Week 2-4) - Complete ✅

### 4.1 Project Structure
```
/chriscakes-new
├── /app                    # Next.js App Router
│   ├── /menu              # Menu page
│   ├── /about             # About page
│   ├── /contact           # Contact page
│   └── layout.js          # Root layout
├── /components
│   ├── /common            # Reusable components
│   ├── /menu              # Menu-specific components
│   └── /layout            # Header, Footer, Navigation
├── /lib
│   ├── sanity.js          # Sanity client configuration
│   └── queries.js         # GROQ queries
├── /sanity                # Sanity Studio
│   ├── /schemas           # Content schemas
│   └── sanity.config.js   # Sanity configuration
└── /public                # Static assets
```

### 4.2 Core Components Development ✅
- [x] **Layout Components**
  - [x] Header with navigation
  - [x] Footer with contact info and social links
  - [x] Mobile-responsive navigation menu (hamburger menu)

- [x] **Menu Components**
  - [x] MenuCategory component (integrated into menu page)
  - [x] MenuItem card component
  - [x] CategoryFilter/Navigation component
  - [x] Menu grid/list layout
  - [x] MenuDisplay client component with filtering logic

- **Common Components** (partially complete)
  - [x] Image component with optimization (Next.js Image)
  - [ ] Button components
  - [ ] Card components
  - [ ] Loading states

- [x] **Page Templates** ✅
  - [x] Homepage
  - [x] Menu page
  - [x] About page
  - [x] Contact page
  - [x] Services page
  - [x] Fundraising page
  - [x] How to Book page
  - [x] Fundraising Tips page
  - [x] Volunteers (Your Group) page
  - [x] Day of Event page
  - [x] Invoice & Payment page

### 4.3 Sanity Integration ✅
- [x] Install Sanity client: `npm install @sanity/client @sanity/image-url`
- [x] Configure Sanity client in `/lib/sanity.ts`
- [x] Create GROQ queries for all content types
- [x] Implement data fetching in page components
- [x] Set up Incremental Static Regeneration (ISR) with 60s revalidation
- [x] Implement image optimization using next/image with Sanity CDN

### 4.4 Styling ✅
- [x] Set up Tailwind CSS v4
- [x] Apply ChrisCakes branding (crimson red #dc143c, dark nav #2d2d2d)
- [x] Ensure mobile responsiveness (basic layout wrapping)
- [x] Improve mobile responsiveness (hamburger menu, touch targets)
- [ ] Test cross-browser compatibility (manual testing required)
- [ ] Optimize for accessibility (WCAG 2.1 AA - ongoing improvement)

### 4.5 Advanced Features
- [ ] Search functionality for menu items
- [ ] Filter by category (on menu page)
- [ ] Sort by price/name
- [ ] Print-friendly menu view
- [ ] SEO optimization (meta tags, structured data)
- [ ] Analytics integration (Google Analytics 4)

## Phase 5: Testing (Week 4-5)

### 5.1 Development Testing
- [ ] Test all CRUD operations in Sanity Studio
- [ ] Verify content updates reflect on frontend
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Performance testing (Lighthouse scores)
- [ ] Accessibility testing

### 5.2 User Acceptance Testing
- [ ] Create test checklist for owners
- [ ] Train owners on Sanity Studio basics
- [ ] Have owners test content updates
- [ ] Gather feedback and make adjustments
- [ ] Document any issues or requested changes

## Phase 6: Deployment (Week 5)

### 6.1 Hosting Setup
- [ ] Create Vercel account and link to Git repository
- [ ] Configure environment variables in Vercel
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL certificate
- [ ] Set up deployment previews for branches

### 6.2 Production Deployment
- [ ] Deploy Sanity Studio to studio.chriscakes.com or subdomain
- [ ] Deploy Next.js site to Vercel
- [ ] Configure production dataset in Sanity
- [ ] Test all functionality in production
- [ ] Set up monitoring and error tracking (Sentry or similar)

### 6.3 Go-Live Checklist
- [ ] DNS cutover (if using existing domain)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up 301 redirects from old URLs if structure changed
- [ ] Monitor for any issues in first 24-48 hours
- [ ] Verify analytics tracking works

## Phase 7: Training & Documentation (Week 5-6)

### 7.1 Owner Training
- [ ] Create video tutorials for common tasks:
  - [ ] Adding a new menu item
  - [ ] Updating prices
  - [ ] Uploading images
  - [ ] Editing page content
  - [ ] Managing categories
  - [ ] Publishing/unpublishing content

- [ ] Create written documentation with screenshots
- [ ] Schedule live training session(s)
- [ ] Create quick reference guide

### 7.2 Developer Documentation
- [ ] Document project structure
- [ ] Document deployment process
- [ ] Document environment variables
- [ ] Create README with setup instructions
- [ ] Document common maintenance tasks

## Phase 8: Maintenance & Support (Ongoing)

### 8.1 Ongoing Tasks
- [ ] Set up automated dependency updates (Dependabot)
- [ ] Schedule quarterly reviews of site performance
- [ ] Monitor Sanity and Vercel usage to stay within free tiers
- [ ] Keep Next.js and dependencies updated
- [ ] Regular content backups from Sanity

### 8.2 Support Plan
- [ ] Define support hours/availability
- [ ] Set up communication channel (email, Slack, etc.)
- [ ] Create FAQ document based on owner questions
- [ ] Plan for emergency support (site down, critical bugs)

## Risk Mitigation

### Technical Risks
- **Risk**: Sanity free tier limits exceeded
  - **Mitigation**: Monitor usage, optimize queries, consider paid plan if needed

- **Risk**: Vercel bandwidth limits exceeded
  - **Mitigation**: Optimize images, implement caching, monitor usage

- **Risk**: Content loss or corruption
  - **Mitigation**: Regular backups, Sanity's built-in version history

### User Adoption Risks
- **Risk**: Owners find CMS too complex
  - **Mitigation**: Simplify UI, create comprehensive training, provide ongoing support

- **Risk**: Content quality issues
  - **Mitigation**: Create content guidelines, establish review process

## Success Criteria
- [ ] Owners can independently update all content types
- [ ] Site performance: Lighthouse score >90 for all metrics
- [ ] Mobile responsive on all major devices
- [ ] Zero downtime during migration
- [ ] Content updates reflect on site within 60 seconds
- [ ] Site loads in <3 seconds on average connection
- [ ] Owner satisfaction score: 4/5 or higher

## Timeline Summary
- **Week 1**: Setup and planning
- **Week 2**: CMS schema design and content migration
- **Week 3-4**: Frontend development
- **Week 4-5**: Testing and refinements
- **Week 5**: Deployment
- **Week 5-6**: Training and documentation

**Total Estimated Time**: 5-6 weeks for initial launch

## Budget Estimate
- **Development Time**: 80-120 hours (depending on complexity)
- **Recurring Costs**: $0 (assuming free tiers sufficient)
- **Optional Costs**:
  - Custom domain: ~$12/year
  - Sanity paid plan (if needed): $99/month for Growth plan
  - Vercel Pro (if needed): $20/month

## Next Steps
1. Review and approve this plan
2. Set up development environment
3. Create Sanity account and project
4. Begin Phase 1 implementation
5. Schedule regular check-ins (weekly recommended)

---

## Current Status (as of 2025-10-08)

### ✅ Completed Phases
- **Phase 1**: Project Setup & Planning (Complete)
- **Phase 2**: CMS Schema Design (Complete)
- **Phase 3**: Content Migration (Complete - content imported successfully)
- **Phase 4**: Frontend Development (Complete - all core features implemented)

### 🚧 Ready for Next Phase
- **Phase 5**: Testing
  - Development testing (ready to begin)
  - User acceptance testing
  - Performance optimization
  - Accessibility audit

### ⏭️ Next Steps
- **Phase 5**: Testing (Not started)
- **Phase 6**: Deployment (Not started)
- **Phase 7**: Training & Documentation (Not started)
- **Phase 8**: Maintenance & Support (Not started)

### 🐛 Known Issues
1. **CORS configuration** - Needs manual Sanity authentication to configure for production
2. **Cross-browser testing** - Manual testing needed across Chrome, Firefox, Safari, Edge
3. **Accessibility audit** - WCAG 2.1 AA compliance review needed

### 🎯 Completed Improvements (2025-10-08)
1. ✅ Fixed all linting errors (TypeScript types and escaped quotes)
2. ✅ Updated build script to use webpack instead of Turbopack
3. ✅ Implemented mobile hamburger menu with state management
4. ✅ Added CategoryFilter component for menu page with real-time filtering
5. ✅ Tested in development mode - server starts successfully
6. ✅ Fixed Next.js Image optimization for Sanity CDN
7. ✅ Configured outputFileTracingRoot to eliminate workspace warnings

---

**Document Version**: 1.2
**Last Updated**: 2025-10-08
**Status**: Phase 4 Complete - Ready for Testing

---

## Recent Updates (2025-10-08 - Phase 4 Completion)

### Code Quality Improvements
- Fixed all TypeScript linting errors (replaced `any` types with proper interfaces)
- Fixed all React linting errors (escaped quotes using HTML entities)
- Replaced `<img>` tags with Next.js `<Image>` component for optimization
- Added proper TypeScript interfaces for MenuItem, MenuCategory, and Testimonial types

### Mobile Responsiveness
- Implemented hamburger menu for mobile navigation
- Converted Header to client component with React state management
- Mobile menu shows/hides on toggle with smooth UX
- Menu closes automatically when a link is clicked

### Menu Filtering
- Created CategoryFilter component for real-time menu filtering
- Created MenuDisplay client component to handle filtering logic
- Users can filter menu items by category or view all items
- Maintains organized category display when showing all items

### Build & Configuration
- Removed Turbopack from build scripts (was causing build failures)
- Added outputFileTracingRoot to next.config.ts (eliminated warnings)
- Configured Sanity CDN as allowed image source
- All builds pass successfully with zero errors

### Next Steps
The project is now ready for Phase 5 (Testing). Recommended actions:
1. Manual authentication with Sanity to enable CORS for production
2. User acceptance testing with site owners
3. Cross-browser compatibility testing
4. Performance audit with Lighthouse
5. Accessibility audit (WCAG 2.1 AA)
6. Deploy to staging environment (Vercel preview)
