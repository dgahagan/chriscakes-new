import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import PortableTextRenderer from './PortableTextRenderer';
import { PortableTextBlock } from '@portabletext/react';

interface SanityImage {
  asset: {
    _ref: string;
  };
  alt?: string;
}

interface TwoColumnSectionProps {
  heading: string;
  content: PortableTextBlock[];
  image?: SanityImage;
  imagePosition?: 'left' | 'right';
  ctaButton?: {
    text: string;
    link: string;
  };
}

export default function TwoColumnSection({
  heading,
  content,
  image,
  imagePosition = 'left',
  ctaButton,
}: TwoColumnSectionProps) {
  const imageColumn = image && (
    <div className="relative h-64 w-full rounded overflow-hidden">
      <Image
        src={urlFor(image).url()}
        alt={image.alt || heading}
        fill
        className="object-cover"
      />
    </div>
  );

  const contentColumn = (
    <div>
      <h2 className="text-3xl font-bold text-[#dc143c] mb-4">{heading}</h2>
      <div className="prose max-w-none mb-4">
        <PortableTextRenderer value={content} />
      </div>
      {ctaButton && (
        <Link
          href={ctaButton.link}
          className="inline-block bg-[#dc143c] text-white px-6 py-2 rounded hover:bg-[#b01030] transition"
        >
          {ctaButton.text}
        </Link>
      )}
    </div>
  );

  return (
    <section className="mb-12">
      <div className="grid gap-8 md:grid-cols-2">
        {imagePosition === 'left' ? (
          <>
            {imageColumn}
            {contentColumn}
          </>
        ) : (
          <>
            {contentColumn}
            {imageColumn}
          </>
        )}
      </div>
    </section>
  );
}
