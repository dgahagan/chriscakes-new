import { client } from '@/lib/sanity';
import { menuItemsQuery, featuredMenuItemsQuery } from '@/lib/queries';
import MenuItemCard from '@/components/menu/MenuItemCard';

export const revalidate = 60; // Revalidate every 60 seconds

async function getMenuItems() {
  try {
    const items = await client.fetch(menuItemsQuery);
    return items || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

export default async function HomePage() {
  const menuItems = await getMenuItems();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Chris Cakes is the catering company that makes pancakes...
              <br />
              <span className="text-yellow-300">BY THE MILLIONS!</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl">
              Premier Breakfast Caterer And Large Event Specialist serving
              Michigan since 1969
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a
                href="/menu"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-gray-100"
              >
                View Menu
              </a>
              <a
                href="/contact"
                className="rounded-md bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-400"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                More than just pancakes!
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>
                    Chris Cakes has been around since 1969 – you won&apos;t
                    find us in any history books! But you can find us in the
                    Guinness Book of World Records... twice!
                  </strong>
                </p>
                <p>
                  We use a custom designed grill and dispensing unit that allows
                  us to feed large and small groups extremely fast and
                  efficiently. Add a dose of humor and some fancy pancake
                  flipping, and you have a one of a kind event that people love
                  to watch while enjoying our delicious pancakes!
                </p>
                <p>
                  Not only do we flip flapjacks, we flip burgers, too! Our Menus
                  N More options are full of tasty lunch and dinner options.
                  Pulled pork and smoked potato salad are our specialties because
                  our sister business is a BBQ joint!
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">
                [Video or Image Placeholder - Add via CMS]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      {menuItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Menu Items
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Check out some of our most popular breakfast options
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.slice(0, 6).map((item: any) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="/menu"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                View Full Menu
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to book your event?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              No event is too large or too small, from groups of 50 to 50,000!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center rounded-md bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-100"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
