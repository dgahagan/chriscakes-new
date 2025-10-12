import { PortableText, PortableTextComponents, PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 relative w-full h-96 rounded overflow-hidden">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Image'}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-[#dc143c] hover:underline"
          target={value.href.startsWith('/') ? undefined : '_blank'}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="text-gray-700 mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#dc143c] pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>,
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
