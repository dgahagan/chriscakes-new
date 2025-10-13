'use client';

import { useState, useMemo } from 'react';
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

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export default function MenuDisplay({ items, categories }: MenuDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Filter and sort items
  const processedItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (activeCategory !== null) {
      filtered = filtered.filter((item) => item.category?._id === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.title.toLowerCase().includes(query)
      );
    }

    // Sort items
    const sorted = [...filtered];
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        // Keep default order
        break;
    }

    return sorted;
  }, [items, activeCategory, searchQuery, sortOption]);

  // Group items by category for display
  const itemsByCategory = processedItems.reduce(
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="mb-8 space-y-4 print:hidden">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500"
            aria-label="Search menu items"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Sort and Print Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500"
            >
              <option value="default">Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Print menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Menu
          </button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Results Summary */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 print:hidden">
          Found {processedItems.length} item{processedItems.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Menu Items */}
      {processedItems.length === 0 ? (
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
          {processedItems.map((item: MenuItem) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
