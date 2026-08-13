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
 * Rendered as a plain inline <script> tag (not next/script) so the JSON-LD is
 * present in the initial server-rendered HTML, where crawlers can read it.
 * The `<` escape prevents CMS-supplied content from closing the script tag
 * early (e.g. a title containing `</script>`) while keeping the payload
 * valid JSON.
 *
 * @param data - The schema object to be rendered
 * @param id - Optional unique identifier for the script tag
 */
export default function SchemaMarkup({ data, id }: SchemaMarkupProps) {
  // Generate a unique ID if not provided
  const scriptId =
    id || `schema-${data['@type']?.toString().toLowerCase() || 'markup'}`;

  return (
    <script
      id={scriptId}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
