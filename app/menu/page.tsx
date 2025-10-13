import { client } from '@/lib/sanity';
import { menuItemsQuery, menuCategoriesQuery, siteSettingsQuery } from '@/lib/queries';
import MenuDisplay from '@/components/menu/MenuDisplay';
import SchemaMarkup from '@/components/common/SchemaMarkup';
import ShareButtons from '@/components/common/ShareButtons';
import { generateMenuSchema } from '@/lib/schema';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menu - ChrisCakes | Breakfast Catering & More',
  description:
    'Browse our delicious breakfast catering menu featuring pancakes, Menus N More lunch/dinner options including pulled pork, burgers, tacos and more. Perfect for any group size!',
  openGraph: {
    title: 'Menu - ChrisCakes Catering',
    description:
      'Browse our breakfast catering menu and Menus N More options. From pancakes to pulled pork, we cater groups of 50 to 50,000!',
    url: 'https://www.chriscakesofmi.com/menu',
    siteName: 'ChrisCakes of Michigan',
    images: [
      {
        url: 'https://www.chriscakesofmi.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'ChrisCakes menu - pancakes and catering options',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu - ChrisCakes Catering',
    description:
      'Browse our breakfast catering menu and Menus N More options. From pancakes to pulled pork!',
    images: ['https://www.chriscakesofmi.com/logo.png'],
  },
  other: {
    'pinterest:description':
      'Browse our delicious breakfast catering menu featuring pancakes, pulled pork, burgers, and more. Perfect for groups of 50 to 50,000!',
    'pinterest:image': 'https://www.chriscakesofmi.com/logo.png',
  },
};

async function getMenuData() {
  try {
    const [items, categories, settings] = await Promise.all([
      client.fetch(menuItemsQuery),
      client.fetch(menuCategoriesQuery),
      client.fetch(siteSettingsQuery),
    ]);
    return { items: items || [], categories: categories || [], settings };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return { items: [], categories: [], settings: null };
  }
}

export default async function MenuPage() {
  const { items, categories, settings } = await getMenuData();

  // Generate Menu Schema
  const menuSchema = items.length > 0 ? generateMenuSchema(items) : null;

  // Check if share buttons should be displayed
  const shareButtonsEnabled =
    settings?.shareButtons?.enabled &&
    (settings?.shareButtons?.displayPages?.includes('menu') ||
      settings?.shareButtons?.displayPages?.includes('all'));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Schema Markup for SEO */}
      {menuSchema && <SchemaMarkup data={menuSchema} id="menu-schema" />}

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Our Menu</h1>
          <p className="mt-4 text-xl text-gray-600">
            Premier breakfast catering and more
          </p>

          {/* Share Buttons */}
          {shareButtonsEnabled && (
            <div className="mt-6">
              <ShareButtons
                url="https://www.chriscakesofmi.com/menu"
                title="Check out ChrisCakes breakfast menu!"
                description="Delicious pancakes and breakfast catering from ChrisCakes"
                image="https://www.chriscakesofmi.com/logo.png"
                platforms={settings?.shareButtons?.platforms || ['facebook', 'twitter', 'pinterest', 'whatsapp', 'native']}
                showNativeShare={settings?.shareButtons?.platforms?.includes('native')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Menu Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No menu items available. Please check back soon!
            </p>
          </div>
        ) : (
          <MenuDisplay items={items} categories={categories} />
        )}

        {/* Call to Action */}
        <div className="mt-16 rounded-lg bg-gray-100 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            Ready to place an order?
          </h3>
          <p className="mt-2 text-gray-600">
            Contact us today to book your event or learn more about our catering
            services.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-md bg-[#dc143c] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b01030]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
