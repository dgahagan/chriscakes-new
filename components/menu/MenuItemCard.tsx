import { urlFor } from '@/lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';

interface MenuItemCardProps {
  item: {
    _id: string;
    name: string;
    description?: string;
    price?: number;
    image?: SanityImageSource;
    featured?: boolean;
  };
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {item.image && (
        <div className="relative h-48 bg-gray-200">
          <Image
            src={urlFor(item.image).width(400).height(300).url()}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
          <span className="text-lg font-bold text-[#dc143c]">
            {item.price && item.price > 0
              ? `$${item.price.toFixed(2)}`
              : 'Call for pricing!'}
          </span>
        </div>
        {item.description && (
          <p className="text-gray-600 text-sm">{item.description}</p>
        )}
        {item.featured && (
          <span className="inline-block mt-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
      </div>
    </div>
  );
}
