import { client } from '@/lib/sanity';
import { menuItemsQuery, menuCategoriesQuery } from '@/lib/queries';
import MenuItemCard from '@/components/menu/MenuItemCard';

export const revalidate = 60;

async function getMenuData() {
  try {
    const [items, categories] = await Promise.all([
      client.fetch(menuItemsQuery),
      client.fetch(menuCategoriesQuery),
    ]);
    return { items: items || [], categories: categories || [] };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return { items: [], categories: [] };
  }
}

export default async function MenuPage() {
  const { items, categories } = await getMenuData();

  // Group items by category
  const itemsByCategory = items.reduce((acc: any, item: any) => {
    const categoryTitle = item.category?.title || 'Other';
    if (!acc[categoryTitle]) {
      acc[categoryTitle] = [];
    }
    acc[categoryTitle].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Our Menu</h1>
          <p className="mt-4 text-xl text-gray-600">
            Premier breakfast catering and more
          </p>
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
          <div className="space-y-16">
            {categories.length > 0 ? (
              // Display by categories
              categories.map((category: any) => {
                const categoryItems = itemsByCategory[category.title] || [];
                if (categoryItems.length === 0) return null;

                return (
                  <section key={category._id}>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {category.title}
                      </h2>
                      {category.description && (
                        <p className="mt-2 text-gray-600">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryItems.map((item: any) => (
                        <MenuItemCard key={item._id} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              // Display all items without categories
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item: any) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            )}

            {/* Items without category */}
            {itemsByCategory['Other'] && itemsByCategory['Other'].length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Other Items
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {itemsByCategory['Other'].map((item: any) => (
                    <MenuItemCard key={item._id} item={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
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
          <a
            href="/contact"
            className="mt-6 inline-flex items-center rounded-md bg-[#dc143c] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b01030]"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
