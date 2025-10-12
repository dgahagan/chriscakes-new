import PortableTextRenderer from './PortableTextRenderer';
import { PortableTextBlock } from '@portabletext/react';

interface HighlightBoxProps {
  title: string;
  content?: PortableTextBlock[];
  items?: string[];
  backgroundColor?: 'gray' | 'crimson' | 'white';
  style?: 'default' | 'checklist' | 'numbered';
}

export default function HighlightBox({
  title,
  content,
  items,
  backgroundColor = 'gray',
  style = 'default',
}: HighlightBoxProps) {
  const bgColorClasses = {
    gray: 'bg-gray-100',
    crimson: 'bg-red-50',
    white: 'bg-white border border-gray-200',
  };

  const renderItems = () => {
    if (!items || items.length === 0) return null;

    if (style === 'checklist') {
      return (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-[#dc143c] flex-shrink-0">✓</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (style === 'numbered') {
      return (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#dc143c] text-white flex items-center justify-center text-sm font-bold mt-1">
                {index + 1}
              </span>
              <span className="text-gray-700 flex-1">{item}</span>
            </li>
          ))}
        </ol>
      );
    }

    // Default style
    return (
      <ul className="space-y-2 list-disc list-inside">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={`p-8 rounded-lg mb-12 ${bgColorClasses[backgroundColor]}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {content && (
        <div className="prose max-w-none">
          <PortableTextRenderer value={content} />
        </div>
      )}
      {items && renderItems()}
    </section>
  );
}
