'use client';

import { useState } from 'react';
import MenuItemCard from './MenuItemCard';
import CategoryFilter from './CategoryFilter';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: SanityImageSource;
  featured?: boolean;
  category?: {
    _id: string;
    title: string;
  };
}

interface MenuCategory {
  _id: string;
  title: string;
  description?: string;
}

interface MenuDisplayProps {
  items: MenuItem[];
  categories: MenuCategory[];
}

export default function MenuDisplay({ items, categories }: MenuDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter items based on active category
  const filteredItems =
    activeCategory === null
      ? items
      : items.filter((item) => item.category?._id === activeCategory);

  // Group items by category for display
  const itemsByCategory = filteredItems.reduce(
    (acc: Record<string, MenuItem[]>, item: MenuItem) => {
      const categoryTitle = item.category?.title || 'Other';
      if (!acc[categoryTitle]) {
        acc[categoryTitle] = [];
      }
      acc[categoryTitle].push(item);
      return acc;
    },
    {},
  );

  return (
    <div>
      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No menu items found in this category.
          </p>
        </div>
      ) : activeCategory === null && categories.length > 0 ? (
        // Display by categories when showing all
        <div className="space-y-16">
          {categories.map((category: MenuCategory) => {
            const categoryItems = itemsByCategory[category.title] || [];
            if (categoryItems.length === 0) return null;

            return (
              <section key={category._id}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                  {category.description && (
                    <p className="mt-2 text-gray-600">{category.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryItems.map((item: MenuItem) => (
                    <MenuItemCard key={item._id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
          {/* Items without category */}
          {itemsByCategory['Other'] && itemsByCategory['Other'].length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Other Items
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {itemsByCategory['Other'].map((item: MenuItem) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        // Display filtered items in a grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item: MenuItem) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
