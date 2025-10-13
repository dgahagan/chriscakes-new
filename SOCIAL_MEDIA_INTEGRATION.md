# Social Media Integration Strategy for ChrisCakes

**Document Created:** October 2025
**Status:** Planning Phase
**Research Date:** October 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [CMS Control Philosophy](#cms-control-philosophy)
3. [Current State Analysis](#current-state-analysis)
4. [Industry Best Practices (2025)](#industry-best-practices-2025)
5. [Integration Strategies](#integration-strategies)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Technical Implementation Guide](#technical-implementation-guide)
8. [Sanity Schema Enhancements](#sanity-schema-enhancements)
9. [Expected Benefits & ROI](#expected-benefits--roi)
10. [Resources & References](#resources--references)

---

## Executive Summary

This document outlines a comprehensive social media integration strategy for ChrisCakes, based on 2025 best practices for restaurant and bakery websites. The strategy focuses on three core objectives:

1. **Drive Social Following** - Make it easy for customers to find and follow ChrisCakes on social platforms
2. **Enable Content Sharing** - Let customers share menu items, services, and experiences with their networks
3. **Display Social Proof** - Showcase Instagram content and customer engagement directly on the website

**Key Principle:** All social media integrations will be **managed through Sanity Studio wherever possible**, empowering site owners to control what displays, where it displays, and how it appears - without requiring developer intervention. This aligns with the core project goal of enabling non-technical restaurant owners to independently manage their website.

**Key Finding:** ChrisCakes has social media infrastructure in place (siteSettings schema with social URLs) but none of it is currently visible or utilized on the website. Additionally, there are no display controls to let owners decide where and how social elements appear.

---

## CMS Control Philosophy

**Core Principle:** Site owners should have maximum control over their social media presence through the Sanity Studio interface, without needing developer involvement.

### What SHOULD Be Sanity-Controlled ✅

These elements can and should be managed entirely through Sanity Studio:

1. **Social Media Links & Visibility**
   - URL for each platform (Facebook, Instagram, Twitter/X, Yelp, Pinterest, TikTok)
   - Toggle to show/hide each platform
   - Display order/priority of social icons
   - Where icons appear (header, footer, both, or hidden)

2. **Display Settings**
   - Show/hide social icons in footer
   - Show/hide social icons in header
   - Show/hide Instagram feed widget
   - Show/hide share buttons on specific pages
   - Enable/disable Pinterest Pin buttons

3. **Visual Content**
   - Social media call-to-action text ("Follow us for daily specials!")
   - Instagram handle for display
   - Hashtag to promote (#chriscakes)
   - Open Graph images for each page (stored in Sanity assets)

4. **Page-Specific Controls**
   - Enable/disable share buttons per page type
   - Custom social sharing text for specific pages
   - Featured social content on homepage

5. **Widget Configuration**
   - Instagram feed embed code
   - Widget display preferences (show on homepage, about page, etc.)
   - Number of Instagram posts to display

### What CANNOT Be Easily Sanity-Controlled ❌

These elements require code implementation (but should still read settings from Sanity):

1. **Technical Integrations**
   - Open Graph meta tag structure (reads content from Sanity)
   - Twitter Card implementation (reads content from Sanity)
   - Schema markup JSON-LD (reads content from Sanity)
   - Web Share API implementation
   - Pinterest button functionality

2. **Third-Party Scripts**
   - Instagram feed widget scripts (though embed code can be in Sanity)
   - Analytics tracking for social interactions
   - Share button component implementation

3. **Styling & Layout**
   - Icon sizes and colors (uses Tailwind classes)
   - Button styles (follows brand guidelines)
   - Responsive behavior
   - Animation effects

**Key Distinction:** The code provides the *functionality*, but Sanity provides the *content and configuration*. Owners control what displays and where, while developers maintain how it technically works.

### Benefits of This Approach

- **Empowerment** - Owners can add/remove social platforms without developer help
- **Flexibility** - Easy to test different placements and visibility options
- **Speed** - Changes take effect immediately via Sanity publish (with 60s ISR)
- **Safety** - No risk of breaking code when making content changes
- **Independence** - Reduces ongoing developer dependency and costs

---

## Current State Analysis

### What We Have ✅

- **Sanity Schema Support** (`sanity/schemas/siteSettings.ts:109-118`)
  - Facebook URL field
  - Instagram URL field
  - Twitter/X URL field
  - Yelp URL field

- **SEO Foundation**
  - Basic metadata in layout.tsx
  - Proper page structure for SEO

### What We're Missing ❌

**Display & Functionality:**
- **No Social Media Icons** - URLs exist in CMS but aren't displayed anywhere
- **No Open Graph Tags** - Shared links show generic previews without images
- **No Twitter Cards** - Twitter/X shares lack rich media
- **No Share Buttons** - Users can't easily share content
- **No Instagram Feed** - No visual social proof on site
- **No Pinterest Integration** - Missing opportunity for food business
- **No Social CTAs** - No prompts to follow, tag, or engage
- **No User-Generated Content** - Not leveraging customer photos/tags

**Sanity CMS Controls (Critical Gap):**
- **No Display Toggles** - Can't control where social icons appear (header/footer)
- **No Visibility Controls** - Can't show/hide individual platforms
- **No Display Order** - Can't prioritize which platforms appear first
- **No Page-Specific Settings** - Can't enable/disable features per page
- **No Widget Configuration** - No CMS field for Instagram embed code
- **No Social CTA Management** - Call-to-action text is hardcoded
- **No Platform Enable/Disable** - All platforms show if URL exists (no granular control)

---

## Industry Best Practices (2025)

### Key Statistics for Restaurant/Bakery Industry

- **52%** of customers expect brands to reply to social media inquiries within 1 hour
- **36%** of TikTok users visit restaurants after seeing TikTok videos about them
- **74%** of TikTok users research products/brands online after seeing them on TikTok
- **Visual Content** - Video and photos are the top-performing content types for food services

### Critical Platforms for Food Businesses

1. **Instagram** - Primary platform for visual food content, behind-the-scenes
2. **Facebook** - Community building, event promotion, customer service
3. **Pinterest** - HUGE for recipes, cake designs, event planning inspiration
4. **TikTok** - Rapid growth, younger demographic, viral potential
5. **Yelp** - Reviews and local discovery (not social media but integrated similarly)

### Where Social Features Belong on Websites

**Most Common Placements:**
- Footer social icons (universal standard)
- Header social icons (secondary)
- Homepage Instagram feed
- Floating social sidebar (trendy but can be intrusive)
- Share buttons on content pages

---

## Integration Strategies

### 1. Business Social Links (Drive Followers)

**Goal:** Make it effortless for website visitors to find and follow ChrisCakes on social platforms.

**Components:**
- **Footer Social Icons** - Always visible, standard placement
- **Header Social Icons** - Optional secondary placement
- **Explicit CTAs** - "Follow us for daily specials!" with incentives
- **Platform-Specific Links**
  - Instagram: Feed integration with follow button
  - Facebook: Link to page
  - Yelp: Link to reviews
  - Pinterest: Link to boards

**Implementation Notes:**
- All settings managed via Sanity siteSettings schema
- Pull social URLs and display preferences from Sanity
- Conditionally render based on Sanity toggle fields
- Display order determined by Sanity `order` field
- Use icon library (react-icons or heroicons)
- Ensure links open in new tab (`target="_blank"`)
- Add `rel="noopener noreferrer"` for security

**Sanity Control:**
- ✅ Social platform URLs
- ✅ Enable/disable each platform individually
- ✅ Show icons in footer (toggle)
- ✅ Show icons in header (toggle)
- ✅ Display order/priority
- ✅ Custom call-to-action text

---

### 2. Content Sharing (Enable Viral Sharing)

**Goal:** Let customers share ChrisCakes content to their networks, expanding reach organically.

#### A. Open Graph & Twitter Card Meta Tags

**Critical for making shared links beautiful and clickable.**

**What Gets Shared:**
- Homepage (business overview)
- Menu items (specific pancake/item pages if created)
- Services page (catering info)
- Custom cakes showcase
- Event/fundraising information

**Required Meta Tags:**
```html
<!-- Open Graph (Facebook, LinkedIn, etc) -->
<meta property="og:title" content="ChrisCakes - Premier Breakfast Caterer" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://..." />
<meta property="og:url" content="https://..." />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

**Next.js Implementation:**
- Use Next.js 15 Metadata API
- Define in page.tsx files or layout.tsx
- Dynamic for menu items, static for fixed pages

#### B. Social Share Buttons

**Best Platforms for Food Businesses:**
- Facebook (most common for restaurant sharing)
- Pinterest (critical for food photos, recipes, cake designs)
- WhatsApp (personal recommendations to friends/family)
- Twitter/X (announcements, events, specials)
- Native Web Share API (mobile-first, works with installed apps)

**Where to Add Share Buttons:**
- Menu item pages (if individual item pages exist)
- Menu page (share whole menu)
- Services page (share catering info)
- Custom cake gallery (share designs)
- Blog posts (if added in future)

**Package Options:**
1. **next-share** (npm: `next-share`)
   - 19+ platforms supported
   - Server Component compatible
   - Lightweight
   - Active maintenance

2. **react-share-kit**
   - Modern API
   - TypeScript support
   - Customizable styling

3. **Custom Implementation**
   - Full control
   - No dependencies
   - More development time
   - Use URL schemes: `https://facebook.com/sharer/sharer.php?u=URL`

**Recommendation:** Use `next-share` for quick implementation with good platform coverage.

---

### 3. Social Content Embedding (Bring Social to Website)

**Goal:** Display live social content on the website to prove activity, engagement, and quality.

#### A. Instagram Feed Widget

**Why It Matters:**
- Shows you're active and engaged
- Fresh content without manual updates
- Visual proof of food quality
- Builds trust with real photos

**Best Placement:**
- Homepage (hero section or below)
- About page
- Potentially footer (smaller widget)

**Implementation Options:**

1. **EmbedSocial** - https://embedsocial.com/free-instagram-widget/
   - Forever-free plan
   - Multiple layout options (grid, slider, carousel)
   - Sign up, connect Facebook, generate embed code
   - Can aggregate by hashtag or account

2. **Elfsight** - https://elfsight.com/instagram-feed-instashow/
   - Free widget tier
   - No coding required
   - Customizable templates

3. **Taggbox** - https://taggbox.com/
   - Hashtag aggregation (#chriscakes)
   - User-generated content focus
   - Free tier available

**Technical Approach:**
- Embed via iframe or script tag
- Wrap in Client Component if interactivity needed
- Add loading skeleton for better UX
- Lazy load if below fold

**Sanity Control:**
- ✅ Instagram feed embed code (stored in siteSettings)
- ✅ Enable/disable Instagram widget display
- ✅ Choose pages to display on (homepage, about, etc.)
- ✅ Custom heading text ("Follow Us on Instagram")
- ✅ Custom CTA button text
- ❌ Widget layout style (configured once in EmbedSocial, not Sanity)

#### B. User-Generated Content (UGC)

**Concept:** Display customer photos from Instagram tagged with #chriscakes or @chriscakesmi

**Benefits:**
- Social proof from real customers
- Encourages more customers to share and tag
- Free marketing content
- Builds community feeling

**Implementation:**
- Use Instagram hashtag feeds (via EmbedSocial, Taggbox, etc)
- Moderate content (filter inappropriate)
- Get permission for featured content
- Add clear CTAs: "Tag us in your photos! #chriscakes"

---

### 4. Advanced Social Integrations

#### A. Pinterest Integration

**Critical for Food Businesses:**
- Pinterest users actively search for recipes, cake designs, event ideas
- High conversion potential (planning purchases)
- Long content lifespan (pins resurface for months)

**Components:**
- **"Pin It" Button** on all food/cake images
- **Pinterest Follow Button** in footer/header
- **Optimized Images** for Pinterest:
  - Vertical format (2:3 ratio ideal)
  - Text overlays describing content
  - Branded watermarks

**Implementation:**
- Pinterest Widget Builder: https://developers.pinterest.com/tools/widget-builder/
- Add Pinterest meta tags for rich pins
- Create Pinterest board for different categories (breakfast cakes, custom cakes, events)

#### B. Facebook/Yelp Reviews Integration

**Display Social Proof from Trusted Platforms**

**Options:**
- Facebook Page Plugin (embed timeline/reviews)
- Yelp Business Widgets (show rating/reviews)
- Manual curation (fetch via API, display statically)

**Placement:**
- Homepage (testimonials section)
- About page
- Services page

**Note:** Complement, don't replace, existing Sanity testimonials schema

#### C. Click-to-Tweet Quotes

**Pre-written shareable content**

**Use Cases:**
- Customer testimonials ("Just had @chriscakesmi cater our event - amazing!")
- Special promotions ("ChrisCakes is offering 10% off corporate breakfasts this month!")
- Fun facts ("Did you know @chriscakesmi has been serving pancakes since 1969?")

**Implementation:**
- Simple link format: `https://twitter.com/intent/tweet?text=YOUR_TEXT&url=YOUR_URL`
- Style as clickable quote boxes
- Track engagement via UTM parameters

#### D. Social Login (Lower Priority)

**Not Recommended for ChrisCakes:**
- Most catering sites don't need user accounts
- Contact forms are sufficient
- Adds complexity without clear benefit

**Skip this unless future features require accounts** (order tracking, loyalty program, etc)

---

### 5. SEO & Social Discoverability

#### A. Rich Snippets / Schema Markup

**Helps both SEO and social sharing**

**Recommended Schema Types:**
- **LocalBusiness** / **Restaurant** - Name, address, phone, hours
- **Menu** - Menu items with prices
- **Review** / **AggregateRating** - Testimonials and ratings
- **Recipe** (if applicable) - Any recipes shared
- **Event** - Fundraisers, special events

**Implementation:**
- Add JSON-LD script tags to pages
- Use Next.js script component
- Validate with Google Rich Results Test

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Chris Cakes of Michigan",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "P.O. Box 431",
    "addressLocality": "Clare",
    "addressRegion": "MI",
    "postalCode": "48617"
  },
  "telephone": "989-802-0755",
  "servesCuisine": "Breakfast, Pancakes",
  "priceRange": "$$"
}
```

#### B. Consistent NAP (Name, Address, Phone)

**Critical for Local SEO and Social Trust:**
- Must match exactly across all platforms:
  - Website (siteSettings)
  - Google Business Profile
  - Facebook Business Page
  - Yelp
  - Any directories

**Current State:**
- siteSettings schema supports this
- Footer displays contact info
- Good foundation already in place

---

## Implementation Roadmap

### Phase 1: Foundation (High ROI, Low Effort) ⭐ COMPLETED ✅

**Goal:** Enable basic social integration with full CMS control that immediately improves sharing and visibility.

**Tasks:**

**A. Sanity Schema Updates (REQUIRED FIRST):** ✅ COMPLETED
1. **✅ Enhance siteSettings Schema**
   - ✅ Replace simple `socialMedia` object with comprehensive array-based structure
   - ✅ Add `platforms` array with enable/disable toggles
   - ✅ Add `displaySettings` for header/footer control
   - ✅ Add `socialCTA` for call-to-action customization
   - ✅ Add `instagramWidget` configuration
   - ✅ Add `shareButtons` settings object
   - ✅ Test in Sanity Studio interface

**B. Display Implementation:** ✅ COMPLETED
2. **✅ Add Social Media Icons to Footer**
   - ✅ Fetch social URLs and settings from enhanced siteSettings
   - ✅ Display icons only if `showInFooter` is enabled
   - ✅ Filter platforms by `enabled` toggle
   - ✅ Respect array order for icon display order
   - ✅ Use react-icons for consistent icon set
   - ✅ Open in new tab with proper security attributes
   - ✅ Conditionally render based on Sanity settings

3. **✅ Implement Open Graph & Twitter Card Meta Tags**
   - ✅ Add to all major pages (homepage, menu, services, contact, dynamic pages, fundraising)
   - ✅ Use Next.js Metadata API
   - ✅ Pull og:image from Sanity when available
   - ✅ Define page-specific og:image for each page
   - ✅ Test with Facebook Debugger and Twitter Card Validator

4. **✅ Add Social Share Buttons**
   - ✅ Install `next-share` package
   - ✅ Create reusable ShareButtons component
   - ✅ Read enabled platforms from siteSettings.shareButtons
   - ✅ Read display pages from siteSettings.shareButtons.displayPages
   - ✅ Conditionally render based on Sanity settings
   - ✅ Include: Facebook, Pinterest, WhatsApp, Twitter, LinkedIn, Native Share
   - ✅ Style to match brand

5. **✅ Add Web Share API (Mobile Native Sharing)**
   - ✅ Fallback to explicit share buttons if not supported
   - ✅ Enable only if 'native' is in Sanity shareButtons.platforms
   - ✅ Best UX for mobile users

**Estimated Effort:** 6-8 hours (includes schema design and testing)
**Impact:** Immediate improvement in social sharing, professional shared link previews, AND full owner control via CMS

**Completion Date:** October 2025
**Additional Work Completed:**
- ✅ Fixed ESLint errors with Link components
- ✅ Made fundraising page fully dynamic from Sanity CMS
- ✅ Installed dependencies: `react-icons` and `next-share`
- ✅ Production build tested successfully with zero errors

---

### Phase 2: Visual Integration (Medium Effort, High Impact)

**Goal:** Add dynamic social content with CMS control to make the site feel active and build trust.

**Tasks:**
6. **Instagram Feed Widget (CMS-Controlled)**
   - Site owner signs up for EmbedSocial or Elfsight
   - Site owner generates embed code for ChrisCakes Instagram
   - Site owner pastes embed code into Sanity `instagramWidget.embedCode` field
   - Site owner selects which pages to display on via Sanity
   - Site owner customizes heading and CTA text in Sanity
   - Developer creates InstagramFeed component that reads from Sanity
   - Component only renders if `instagramWidget.enabled` is true
   - Respects `displayPages` array for page-specific display
   - Style to match brand colors

7. **Pinterest Pin Button (CMS-Controlled)**
   - Enable via `shareButtons.pinterestEnabled` toggle in Sanity
   - Add "Pin It" button component to food/cake images
   - Button only shows if enabled in Sanity
   - Optimize images for Pinterest (add alt text, descriptions)
   - Create Pinterest Business account if not done
   - Add Pinterest URL to Sanity platforms array
   - Set up Pinterest verification for website

8. **Social CTAs (Fully CMS-Editable)**
   - All CTA text controlled via `socialCTA` in Sanity
   - Display "Follow us for daily specials" from `socialCTA.heading`
   - Show custom message from `socialCTA.message`
   - Promote hashtag from `socialCTA.hashtag` field
   - Display Instagram handle from `platforms.handle`
   - Enable/disable entire CTA via `socialCTA.enabled` toggle
   - Site owners can update all text without developer help

**Estimated Effort:** 6-8 hours
**Impact:** Keeps content fresh, encourages customer engagement, grows follower base - all manageable by site owners

---

### Phase 3: Advanced Features (Lower Priority)

**Goal:** Maximize social integration for competitive advantage.

**Tasks:**
8. **User-Generated Content Gallery**
   - Aggregate Instagram posts with #chriscakes hashtag
   - Create dedicated "Customer Photos" section
   - Moderate and curate best content
   - Get permission for featured photos

9. **Review Integration**
   - Embed Facebook reviews widget
   - Add Yelp rating badge
   - Consider pulling reviews via API for custom display

10. **Schema Markup (Structured Data)**
    - LocalBusiness/Restaurant schema
    - Menu schema (if individual item pages created)
    - Review/Rating schema
    - Event schema (for fundraising events)
    - Validate with Google Rich Results Test

11. **Click-to-Tweet Quotes**
    - Identify sharable quotes from testimonials
    - Create styled quote boxes with Tweet button
    - Track engagement

12. **Pinterest Board Showcase**
    - Create curated Pinterest boards (Custom Cakes, Breakfast Ideas, Event Catering)
    - Embed board widget on relevant pages
    - Link to Pinterest profile

**Estimated Effort:** 10-12 hours
**Impact:** Comprehensive social integration, maximum social proof and engagement

---

## Technical Implementation Guide

### Prerequisites

**Packages to Install:**
```bash
npm install next-share
npm install react-icons  # if not already installed
```

### 1. Social Icons in Footer

**File:** `components/layout/Footer.tsx`

**Approach:**
- Fetch siteSettings data (already available via Sanity)
- Pass social URLs as props or fetch in Footer Server Component
- Conditionally render icons only if URLs exist
- Use react-icons for Facebook, Instagram, Twitter, Yelp icons

**Example Structure:**
```tsx
import { FaFacebook, FaInstagram, FaTwitter, FaYelp } from 'react-icons/fa';

// Fetch siteSettings with social URLs
const { socialMedia } = await client.fetch(siteSettingsQuery);

// In footer JSX:
<div className="flex space-x-4">
  {socialMedia?.facebook && (
    <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer">
      <FaFacebook className="w-6 h-6" />
    </a>
  )}
  {/* Repeat for other platforms */}
</div>
```

**Note:** Footer is currently a Server Component, which is fine for static social links.

---

### 2. Open Graph & Twitter Card Meta Tags

**Files:** All `page.tsx` files (homepage, menu, services, contact, dynamic pages)

**Approach:**
- Use Next.js 15 `Metadata` API
- Define `generateMetadata()` function for dynamic pages
- Export static `metadata` object for static pages

**Example (Homepage):**
```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChrisCakes - Premier Breakfast Caterer | Michigan Pancake Catering',
  description: 'Michigan\'s premier breakfast caterer serving delicious pancakes and catering services since 1969.',
  openGraph: {
    title: 'ChrisCakes - Premier Breakfast Caterer',
    description: 'Michigan\'s premier breakfast caterer serving delicious pancakes since 1969.',
    url: 'https://www.chriscakesofmi.com',
    siteName: 'ChrisCakes',
    images: [
      {
        url: 'https://www.chriscakesofmi.com/og-image.jpg', // Need to create
        width: 1200,
        height: 630,
        alt: 'ChrisCakes pancake catering',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChrisCakes - Premier Breakfast Caterer',
    description: 'Michigan\'s premier breakfast caterer serving delicious pancakes since 1969.',
    images: ['https://www.chriscakesofmi.com/og-image.jpg'],
  },
};
```

**Example (Dynamic Page):**
```typescript
// app/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await client.fetch(pageBySlugQuery, { slug: params.slug });

  return {
    title: `${page.title} - ChrisCakes`,
    description: page.seo?.metaDescription || page.title,
    openGraph: {
      title: page.title,
      description: page.seo?.metaDescription || page.title,
      url: `https://www.chriscakesofmi.com/${params.slug}`,
      images: page.seo?.ogImage ? [urlFor(page.seo.ogImage).url()] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.seo?.metaDescription || page.title,
      images: page.seo?.ogImage ? [urlFor(page.seo.ogImage).url()] : [],
    },
  };
}
```

**Required Assets:**
- Create OG images (1200x630px) for each major page
- Store in `public/og-images/` or use Sanity images
- Ensure images are optimized (< 200KB)

**Testing:**
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

### 3. Social Share Buttons

**Package:** `next-share`

**Installation:**
```bash
npm install next-share
```

**Create Reusable Component:**

**File:** `components/common/ShareButtons.tsx`

```typescript
'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
} from 'next-share';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string; // For Pinterest
}

export default function ShareButtons({ url, title, description, image }: ShareButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Share:</span>

      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title} separator=" - ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      {image && (
        <PinterestShareButton url={url} media={image} description={description || title}>
          <PinterestIcon size={32} round />
        </PinterestShareButton>
      )}
    </div>
  );
}
```

**Usage Example (Menu Page):**
```typescript
// app/menu/page.tsx
import ShareButtons from '@/components/common/ShareButtons';

export default async function MenuPage() {
  const items = await client.fetch(menuItemsQuery);

  return (
    <div>
      <h1>Our Menu</h1>
      <ShareButtons
        url="https://www.chriscakesofmi.com/menu"
        title="Check out ChrisCakes breakfast menu!"
        description="Delicious pancakes and breakfast catering from ChrisCakes"
      />
      {/* Menu items */}
    </div>
  );
}
```

**Web Share API Integration:**
```typescript
'use client';

import { useState } from 'react';

export default function NativeShareButton({ url, title, text }: Props) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!navigator.share);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({ url, title, text });
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  if (!isSupported) return null;

  return (
    <button onClick={handleShare} className="...">
      Share
    </button>
  );
}
```

---

### 4. Instagram Feed Widget

**Option 1: EmbedSocial (Recommended)**

**Steps:**
1. Sign up at https://embedsocial.com/free-instagram-widget/
2. Connect Facebook account (required by Instagram API)
3. Select ChrisCakes Instagram account
4. Choose layout (grid, slider, carousel)
5. Customize styling to match brand
6. Copy embed code

**Integration:**

**File:** `components/common/InstagramFeed.tsx`

```typescript
'use client';

export default function InstagramFeed() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Follow Us on Instagram
        </h2>
        <div className="embedsocial-instagram" data-ref="[YOUR_FEED_ID]">
          {/* EmbedSocial script will load here */}
        </div>
        <div className="text-center mt-6">
          <a
            href="https://instagram.com/chriscakesmi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#dc143c] text-white px-6 py-3 rounded-lg hover:bg-[#b31034] transition"
          >
            Follow @chriscakesmi
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Add Script to Layout:**
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />

        {/* EmbedSocial Instagram Script */}
        <Script
          src="https://embedsocial.com/cdn/ht.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

**Option 2: Custom Instagram API Integration**
- More complex, requires Facebook Developer account
- Better performance control
- More customization options
- Requires ongoing API maintenance

---

### 5. Pinterest Integration

**Pinterest Meta Tags:**
```typescript
// Add to page metadata
export const metadata: Metadata = {
  // ... other metadata
  other: {
    'pinterest:description': 'Delicious pancakes from ChrisCakes',
    'pinterest:image': 'https://...',
  },
};
```

**Pin It Button:**

**File:** `components/common/PinButton.tsx`

```typescript
'use client';

interface PinButtonProps {
  url: string;
  media: string;
  description: string;
}

export default function PinButton({ url, media, description }: PinButtonProps) {
  const handlePin = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`;
    window.open(pinterestUrl, '_blank', 'width=750,height=650');
  };

  return (
    <button
      onClick={handlePin}
      className="inline-flex items-center gap-2 bg-[#E60023] text-white px-4 py-2 rounded hover:bg-[#bd001c] transition"
    >
      <PinterestIcon />
      Pin It
    </button>
  );
}
```

**Add to Menu Item Images:**
```typescript
// Wherever food images are displayed
<div className="relative group">
  <Image src={imageUrl} alt={itemName} {...props} />
  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
    <PinButton
      url={currentPageUrl}
      media={imageUrl}
      description={`${itemName} from ChrisCakes`}
    />
  </div>
</div>
```

---

### 6. Schema Markup (JSON-LD)

**File:** `components/common/SchemaMarkup.tsx`

```typescript
import Script from 'next/script';

interface SchemaProps {
  type: 'Restaurant' | 'Menu' | 'Review';
  data: any;
}

export default function SchemaMarkup({ type, data }: SchemaProps) {
  return (
    <Script
      id={`schema-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Usage (Homepage):**
```typescript
// app/page.tsx
import SchemaMarkup from '@/components/common/SchemaMarkup';

export default async function HomePage() {
  const settings = await client.fetch(siteSettingsQuery);

  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Chris Cakes of Michigan',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address?.split('\n')[0],
      addressLocality: 'Clare',
      addressRegion: 'MI',
      postalCode: '48617',
    },
    telephone: settings.phone,
    email: settings.email,
    url: 'https://www.chriscakesofmi.com',
    servesCuisine: 'Breakfast, Pancakes',
    priceRange: '$$',
  };

  return (
    <>
      <SchemaMarkup type="Restaurant" data={restaurantSchema} />
      {/* Page content */}
    </>
  );
}
```

---

## Sanity Schema Enhancements

This section details all Sanity schema modifications needed to give site owners full control over social media integrations.

### 1. Enhanced siteSettings Schema

**File:** `sanity/schemas/siteSettings.ts`

Add the following fields to enable comprehensive social media control:

```typescript
// Add to existing siteSettings fields

// Enhanced Social Media with Display Controls
defineField({
  name: 'socialMedia',
  title: 'Social Media Settings',
  type: 'object',
  description: 'Configure your social media presence and how it displays on the website',
  fields: [
    // PLATFORM CONFIGURATIONS
    {
      name: 'platforms',
      title: 'Social Media Platforms',
      type: 'array',
      description: 'Add and configure social media platforms. Drag to reorder.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'Yelp', value: 'yelp' },
                  { title: 'Pinterest', value: 'pinterest' },
                  { title: 'TikTok', value: 'tiktok' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'enabled',
              title: 'Show on Website',
              type: 'boolean',
              description: 'Toggle to show/hide this platform on your website',
              initialValue: true,
            },
            {
              name: 'handle',
              title: 'Handle (optional)',
              type: 'string',
              description: 'Your username/handle (e.g., @chriscakesmi)',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
              enabled: 'enabled',
            },
            prepare({ platform, url, enabled }) {
              return {
                title: platform.charAt(0).toUpperCase() + platform.slice(1),
                subtitle: enabled ? url : '❌ Hidden',
              };
            },
          },
        },
      ],
    },

    // DISPLAY SETTINGS
    {
      name: 'displaySettings',
      title: 'Display Settings',
      type: 'object',
      description: 'Control where social icons appear on your website',
      fields: [
        {
          name: 'showInHeader',
          title: 'Show in Header',
          type: 'boolean',
          description: 'Display social icons in the header navigation',
          initialValue: false,
        },
        {
          name: 'showInFooter',
          title: 'Show in Footer',
          type: 'boolean',
          description: 'Display social icons in the footer',
          initialValue: true,
        },
      ],
    },

    // CALL-TO-ACTION
    {
      name: 'socialCTA',
      title: 'Social Call-to-Action',
      type: 'object',
      description: 'Customize messaging to encourage social engagement',
      fields: [
        {
          name: 'enabled',
          title: 'Show CTA',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'heading',
          title: 'CTA Heading',
          type: 'string',
          description: 'e.g., "Follow Us for Daily Specials"',
          initialValue: 'Follow Us',
        },
        {
          name: 'message',
          title: 'CTA Message',
          type: 'text',
          rows: 2,
          description: 'Brief message encouraging follows/engagement',
        },
        {
          name: 'hashtag',
          title: 'Hashtag to Promote',
          type: 'string',
          description: 'e.g., #chriscakes (without the #)',
        },
      ],
    },

    // INSTAGRAM WIDGET
    {
      name: 'instagramWidget',
      title: 'Instagram Feed Widget',
      type: 'object',
      description: 'Configure Instagram feed display on your website',
      fields: [
        {
          name: 'enabled',
          title: 'Show Instagram Feed',
          type: 'boolean',
          description: 'Display Instagram feed widget on selected pages',
          initialValue: false,
        },
        {
          name: 'embedCode',
          title: 'Widget Embed Code',
          type: 'text',
          rows: 5,
          description: 'Paste the embed code from EmbedSocial or Elfsight',
        },
        {
          name: 'displayPages',
          title: 'Display On Pages',
          type: 'array',
          description: 'Choose which pages show the Instagram feed',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Homepage', value: 'homepage' },
              { title: 'About Page', value: 'about' },
              { title: 'Menu Page', value: 'menu' },
              { title: 'Services Page', value: 'services' },
              { title: 'Contact Page', value: 'contact' },
            ],
          },
        },
        {
          name: 'heading',
          title: 'Widget Heading',
          type: 'string',
          description: 'Heading above Instagram feed',
          initialValue: 'Follow Us on Instagram',
        },
        {
          name: 'ctaButtonText',
          title: 'CTA Button Text',
          type: 'string',
          description: 'Text for "Follow" button below feed',
          initialValue: 'Follow @chriscakesmi',
        },
      ],
    },
  ],
}),

// SHARE BUTTON SETTINGS
defineField({
  name: 'shareButtons',
  title: 'Social Share Buttons',
  type: 'object',
  description: 'Control where share buttons appear and which platforms to include',
  fields: [
    {
      name: 'enabled',
      title: 'Enable Share Buttons',
      type: 'boolean',
      description: 'Show social share buttons on your website',
      initialValue: true,
    },
    {
      name: 'platforms',
      title: 'Platforms to Include',
      type: 'array',
      description: 'Select which platforms to show share buttons for',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'Pinterest', value: 'pinterest' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Native Share (Mobile)', value: 'native' },
        ],
      },
      initialValue: ['facebook', 'twitter', 'pinterest', 'whatsapp', 'native'],
    },
    {
      name: 'displayPages',
      title: 'Show Share Buttons On',
      type: 'array',
      description: 'Choose which page types display share buttons',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Menu Page', value: 'menu' },
          { title: 'Services Page', value: 'services' },
          { title: 'Fundraising Page', value: 'fundraising' },
          { title: 'Dynamic Pages', value: 'dynamicPages' },
          { title: 'All Pages', value: 'all' },
        ],
      },
      initialValue: ['menu', 'services', 'dynamicPages'],
    },
    {
      name: 'pinterestEnabled',
      title: 'Enable Pinterest Pin Buttons',
      type: 'boolean',
      description: 'Show "Pin It" button on food/cake images',
      initialValue: true,
    },
  ],
}),
```

### 2. Page Schema Enhancement (Optional)

**File:** `sanity/schemas/page.ts`

Add page-specific social sharing controls:

```typescript
// Add to existing page fields

defineField({
  name: 'socialSharing',
  title: 'Social Sharing Settings',
  type: 'object',
  description: 'Customize how this page appears when shared on social media',
  fields: [
    {
      name: 'enableShareButtons',
      title: 'Show Share Buttons',
      type: 'boolean',
      description: 'Display share buttons on this page',
      initialValue: true,
    },
    {
      name: 'customShareText',
      title: 'Custom Share Text',
      type: 'string',
      description: 'Override default sharing text for this page',
    },
    {
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image that appears when this page is shared (1200x630px recommended)',
      options: {
        hotspot: true,
      },
    },
  ],
}),
```

### 3. Usage in Components

Components should read from Sanity and conditionally render based on settings:

```typescript
// Example: Footer component reading settings
const settings = await client.fetch(siteSettingsQuery);

// Only show social icons if enabled in Sanity
{settings?.socialMedia?.displaySettings?.showInFooter && (
  <SocialIcons
    platforms={settings.socialMedia.platforms.filter(p => p.enabled)}
  />
)}

// Only show Instagram widget if enabled and on correct page
{settings?.socialMedia?.instagramWidget?.enabled &&
 settings?.socialMedia?.instagramWidget?.displayPages?.includes('homepage') && (
  <InstagramFeed
    embedCode={settings.socialMedia.instagramWidget.embedCode}
    heading={settings.socialMedia.instagramWidget.heading}
    ctaText={settings.socialMedia.instagramWidget.ctaButtonText}
  />
)}
```

### 4. Benefits of This Schema Design

**For Site Owners:**
- ✅ Add/remove social platforms without code changes
- ✅ Toggle visibility with a single click
- ✅ Customize all user-facing text
- ✅ Control placement (header/footer)
- ✅ Enable/disable features per page
- ✅ Reorder platforms by dragging in Sanity Studio

**For Developers:**
- ✅ Single source of truth for all social settings
- ✅ Type-safe queries from Sanity
- ✅ Easy to extend with new platforms
- ✅ Consistent pattern across all integrations

**For Maintenance:**
- ✅ No code deployments needed for content changes
- ✅ Immediate updates (within 60s ISR window)
- ✅ Version history in Sanity
- ✅ Easy rollback if needed

---

## Expected Benefits & ROI

### Phase 1 Benefits

**Social Icons in Footer:**
- 5-10% increase in social media followers (industry average)
- Always visible, no extra clicks required
- Professional appearance

**Open Graph & Twitter Cards:**
- 2-3x higher click-through rate on shared links (with image vs without)
- Professional brand appearance
- Increased trust when content is shared

**Social Share Buttons:**
- 7x more shares when buttons are present vs relying on manual sharing
- Viral potential for popular content
- Extended reach beyond existing audience

**Estimated Total Impact:** 15-25% increase in social engagement within first month

---

### Phase 2 Benefits

**Instagram Feed Widget:**
- Proves business is active and engaged
- Fresh content without manual website updates
- Average 2-5% of visitors click through to Instagram profile
- Builds trust with visual social proof

**Pinterest Integration:**
- Pinterest drives 33% more referral traffic than Facebook for food businesses
- Pins have longer lifespan (months vs days on other platforms)
- High-intent traffic (users actively planning purchases)

**Social CTAs:**
- 3-5% of customers will tag/share when prompted
- User-generated content marketing value: $500-2000/month equivalent
- Community building effect

**Estimated Total Impact:** 20-35% increase in social-driven website traffic

---

### Phase 3 Benefits

**User-Generated Content:**
- 85% of consumers find UGC more influential than brand content
- Authenticity and trust building
- Free marketing content creation

**Review Integration:**
- 93% of consumers say online reviews impact purchase decisions
- Displaying reviews can increase conversions by 270%

**Schema Markup:**
- Rich snippets in search results increase CTR by 30%
- Better visibility in Google Search, Google Maps

**Estimated Total Impact:** 25-40% improvement in conversion rate from visitor to inquiry

---

### Overall Expected ROI

**Time Investment:** 20-26 hours total across all phases
**Cost:** Minimal (most tools have free tiers, ~$0-50/month for premium features)
**Expected Impact:**
- 30-50% increase in social media followers (6 months)
- 40-60% increase in social-driven website traffic
- 20-30% improvement in inquiry conversion rate
- Ongoing value: fresh content, social proof, viral potential

**Break-Even Analysis:**
- If implementation leads to just 1-2 additional bookings per month, ROI is positive
- Typical catering booking value: $500-2000+
- Conservative estimate: 3-5 additional bookings over 6 months = $1500-10000 value

---

## Resources & References

### Development Resources

**Next.js Social Integration:**
- next-share package: https://next-share.js.org/
- Next.js Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images

**Social Media Widgets:**
- EmbedSocial (Instagram): https://embedsocial.com/free-instagram-widget/
- Elfsight (Instagram): https://elfsight.com/instagram-feed-instashow/
- Pinterest Widget Builder: https://developers.pinterest.com/tools/widget-builder/
- Facebook Page Plugin: https://developers.facebook.com/docs/plugins/page-plugin

**Testing Tools:**
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Google Rich Results Test: https://search.google.com/test/rich-results

**Icon Libraries:**
- react-icons: https://react-icons.github.io/react-icons/
- heroicons: https://heroicons.com/

### Industry Research

**Best Practices:**
- Hootsuite Social Media Integration Strategies 2025: https://blog.hootsuite.com/social-media-integration-for-your-website/
- Toast Restaurant Social Media Marketing Guide: https://pos.toasttab.com/blog/on-the-line/examples-of-awesome-restaurant-social-media-marketing
- Statusbrew Social Media for Bakeries: https://statusbrew.com/insights/social-media-for-bakeries-and-restaurants/

**Statistics & Benchmarks:**
- Restaurant Social Media Statistics 2025: https://www.menutiger.com/blog/restaurant-social-media-statistics
- Food & Beverage Industry Benchmarks: https://www.dashsocial.com/social-media-benchmarks/food-beverage-industry

### Current ChrisCakes Social Media

**Update these as URLs are confirmed:**
- Facebook: [URL needed]
- Instagram: @chriscakesmi [URL needed]
- Twitter/X: [URL needed]
- Yelp: [URL needed]
- Pinterest: [Create account if needed]
- TikTok: [Future consideration]

---

## Next Steps

1. **Review this document** and confirm priorities align with business goals
2. **Update Sanity schemas** - Implement enhanced siteSettings with display controls (Phase 1A)
3. **Configure initial settings in Sanity Studio** - Add social URLs, enable desired platforms, set display preferences
4. **Create social media accounts** for any missing platforms (especially Pinterest)
5. **Begin Phase 1 implementation** - Foundational features with immediate ROI and full CMS control
6. **Train site owners** on Sanity Studio social media controls
7. **Test all implementations** across devices and platforms
8. **Monitor analytics** to measure impact (Google Analytics, social platform insights)
9. **Iterate and optimize** based on performance data (site owners can do this themselves via Sanity)

---

## Maintenance & Ongoing Considerations

**Monthly Tasks:**
- Review which content gets shared most (adjust strategy)
- Update Instagram feed if embedding method changes
- Check for broken social links
- Monitor social platform API changes

**Quarterly Tasks:**
- Analyze social traffic in Google Analytics
- A/B test share button placement
- Review UGC for featuring on site
- Update OG images if brand/offerings change

**Annual Tasks:**
- Review platform priorities (TikTok growth, new platforms)
- Update schema markup if business details change
- Reassess which integrations provide most value

---

**Document Version:** 2.0 (Updated with CMS-First Approach)
**Last Updated:** October 2025
**Major Changes in v2.0:** All social media integrations now prioritize Sanity CMS control, giving site owners maximum autonomy
**Maintained By:** Development Team
**Review Schedule:** Quarterly

---

## Appendix: CMS-First Implementation Notes

### Philosophy

This implementation strategy prioritizes **CMS control over code complexity**. When faced with a choice between:
- Adding a feature to Sanity Studio (takes longer initially)
- Hardcoding it in components (faster initially)

**Always choose Sanity Studio.** The upfront time investment pays off immediately in owner autonomy and reduced ongoing developer dependency.

### Implementation Priority

1. **Schema Design** - Spend time designing comprehensive, future-proof schemas
2. **Display Logic** - Write components that read from and respect Sanity settings
3. **Defaults** - Set sensible default values in Sanity schemas
4. **Documentation** - Create user guides for site owners to manage settings

### Training Site Owners

When handing off social media features, ensure site owners understand:
- How to add/remove social platforms in Sanity Studio
- How to toggle visibility of features
- How to customize text and CTAs
- How to enable/disable widgets on specific pages
- That changes take ~60 seconds to appear (ISR revalidation)
- How to use Sanity's preview feature before publishing

### Future Extensibility

This CMS-first approach makes future additions easy:
- Adding TikTok? Just add it to the Sanity schema list, no code changes
- Want social icons in sidebar? Add a toggle in Sanity displaySettings
- Need platform-specific styling? Add color field to platform objects
- Want scheduled social posts? Extend schema with scheduling fields

The pattern is established - future developers can follow it consistently.
