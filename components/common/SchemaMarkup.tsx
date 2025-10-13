import Script from 'next/script';

interface SchemaMarkupProps {
  data: Record<string, unknown>;
  id?: string;
}

/**
 * SchemaMarkup Component
 *
 * Renders JSON-LD structured data for SEO and rich snippets.
 * Supports various schema types: LocalBusiness, Restaurant, Menu, Review, Event, etc.
 *
 * @param data - The schema object to be rendered
 * @param id - Optional unique identifier for the script tag
 */
export default function SchemaMarkup({ data, id }: SchemaMarkupProps) {
  // Generate a unique ID if not provided
  const scriptId = id || `schema-${data['@type']?.toString().toLowerCase() || 'markup'}`;

  return (
    <Script
      id={scriptId}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
}
