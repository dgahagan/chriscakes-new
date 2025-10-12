import PortableTextRenderer from './PortableTextRenderer';
import { PortableTextBlock } from '@portabletext/react';

interface TextSectionProps {
  title?: string;
  content: PortableTextBlock[];
}

export default function TextSection({ title, content }: TextSectionProps) {
  return (
    <section className="mb-12">
      {title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>}
      <div className="prose max-w-none">
        <PortableTextRenderer value={content} />
      </div>
    </section>
  );
}
