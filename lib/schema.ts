/**
 * Schema.org Structured Data Utilities
 *
 * Generates JSON-LD structured data for SEO and rich snippets.
 * Follows schema.org standards for Restaurant, LocalBusiness, Menu, Review, and Event types.
 */

interface SiteSettings {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialMedia?: {
    platforms?: Array<{
      platform: string;
      url: string;
      enabled: boolean;
    }>;
  };
}

interface MenuItem {
  name: string;
  description?: string;
  price?: number;
  image?: unknown;
  category?: {
    title: string;
  };
}

interface Testimonial {
  quote: string;
  author: string;
  authorTitle?: string;
  rating?: number;
}

interface FundraisingEvent {
  title: string;
  description?: string;
  date?: string;
  location?: string;
  image?: unknown;
}

/**
 * Generate LocalBusiness/Restaurant schema
 */
export function generateRestaurantSchema(settings: SiteSettings) {
  const socialUrls = settings.socialMedia?.platforms
    ?.filter((p) => p.enabled)
    .map((p) => p.url) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://www.chriscakesofmi.com/#restaurant',
    name: settings.title || 'Chris Cakes of Michigan',
    alternateName: 'ChrisCakes',
    description:
      settings.description ||
      'Michigan\'s premier breakfast caterer serving delicious pancakes and catering services since 1969.',
    url: 'https://www.chriscakesofmi.com',
    telephone: settings.phone || '989-802-0755',
    email: settings.email || 'info@chriscakesofmi.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P.O. Box 431',
      addressLocality: 'Clare',
      addressRegion: 'MI',
      postalCode: '48617',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.8194,
      longitude: -84.7686,
    },
    servesCuisine: ['Breakfast', 'American', 'Pancakes'],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Check'],
    currenciesAccepted: 'USD',
    foundingDate: '1969',
    areaServed: {
      '@type': 'State',
      name: 'Michigan',
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 43.8194,
        longitude: -84.7686,
      },
      geoRadius: '200000', // 200km radius in meters
    },
    sameAs: socialUrls.length > 0 ? socialUrls : undefined,
  };
}

/**
 * Generate Menu schema for menu page
 */
export function generateMenuSchema(menuItems: MenuItem[]) {
  const menuSections = menuItems.reduce((acc: Record<string, MenuItem[]>, item) => {
    const category = item.category?.title || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const hasMenuSections = Object.entries(menuSections).map(([category, items]) => ({
    '@type': 'MenuSection',
    name: category,
    hasMenuItem: items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description || undefined,
      offers: item.price
        ? {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'USD',
          }
        : undefined,
    })),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'ChrisCakes Menu',
    description: 'Our complete breakfast and catering menu',
    hasMenuSection: hasMenuSections,
  };
}

/**
 * Generate AggregateRating schema from testimonials
 */
export function generateAggregateRatingSchema(testimonials: Testimonial[]) {
  // If no testimonials have ratings, return null
  const ratingsAvailable = testimonials.some((t) => t.rating);
  if (!ratingsAvailable || testimonials.length === 0) {
    return null;
  }

  // Calculate average rating (default to 5 if not specified)
  const totalRating = testimonials.reduce((sum, t) => sum + (t.rating || 5), 0);
  const averageRating = totalRating / testimonials.length;

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: averageRating.toFixed(1),
    reviewCount: testimonials.length,
    bestRating: '5',
    worstRating: '1',
  };
}

/**
 * Generate individual Review schema
 */
export function generateReviewSchema(testimonial: Testimonial) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: testimonial.rating || 5,
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: testimonial.author,
      jobTitle: testimonial.authorTitle || undefined,
    },
    reviewBody: testimonial.quote,
    itemReviewed: {
      '@type': 'Restaurant',
      name: 'Chris Cakes of Michigan',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Clare',
        addressRegion: 'MI',
      },
    },
  };
}

/**
 * Generate Event schema for fundraising events
 */
export function generateEventSchema(event: FundraisingEvent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || undefined,
    startDate: event.date || undefined,
    location: event.location
      ? {
          '@type': 'Place',
          name: event.location,
        }
      : undefined,
    organizer: {
      '@type': 'Restaurant',
      name: 'Chris Cakes of Michigan',
      url: 'https://www.chriscakesofmi.com',
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
