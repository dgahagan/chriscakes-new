import { client } from '@/lib/sanity';
import { menuItemsQuery, featuredTestimonialsQuery } from '@/lib/queries';
import MenuItemCard from '@/components/menu/MenuItemCard';
import Link from 'next/link';

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

async function getTestimonials() {
  try {
    const testimonials = await client.fetch(featuredTestimonialsQuery);
    return testimonials || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export default async function HomePage() {
  const menuItems = await getMenuItems();
  const testimonials = await getTestimonials();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
              Chris Cakes is the catering company that makes pancakes...
              <br />
              <span className="block mt-2">BY THE MILLIONS!</span>
            </h1>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>
                    Chris Cakes has been around since 1969 – you won&apos;t find us in any history
                    books! But you can find us in the Guinness Book of World Records... twice!
                  </strong>
                </p>
                <p>
                  We use a custom designed grill and dispensing unit that allows us to feed large
                  and small groups extremely fast and efficiently. Add a dose of humor and some
                  fancy pancake flipping, and you have a one of a kind event that people love to
                  watch while enjoying our delicious pancakes!
                </p>
                <p>
                  Not only do we flip flapjacks, we flip burgers, too! Our Menus N More options are
                  full of tasty lunch and dinner options. Pulled pork and smoked potato salad are
                  our specialties because our sister business is a BBQ joint! Don't see what you're
                  looking for? ASK US! We try to accommodate all requests.
                </p>
                <p>
                  Chris Cakes can be found at fundraisers, church gatherings, school events,
                  university functions, corporate lunches, dinners, benefits, graduations, reunions,
                  fly-ins and national festivals; the list is endless. No event is too large or too
                  small, from groups of 50 to 50,000!
                </p>
                <p>
                  Chris Cakes of Michigan is a dependable catering service that is readily available
                  for your 24/7 catering needs. We service the entire state of Michigan and beyond!
                  Centrally located, we can travel anywhere in Michigan in about two hours! In four
                  feet of snow, in the dead of a Michigan winter, Chris Cakes has a 99.9% success
                  rate.
                </p>
                <p>
                  <strong>
                    Chris Cakes is more than great food at an affordable price… it's an experience!
                  </strong>
                </p>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/1GBCRCQMqkw"
                  title="Chris Cakes Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <h4 className="font-bold text-gray-900">
                  Premier Breakfast Caterer And Large Event Specialist
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More than just pancakes!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">See us in action on Youtube!</h4>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#dc143c]">•</span>
                  <span className="text-gray-700">Served four Presidents and 16 Governors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#dc143c]">•</span>
                  <span className="text-gray-700">Featured on Food Network</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#dc143c]">•</span>
                  <span className="text-gray-700">
                    Presented two Guinness World Records
                    <ul className="ml-6 mt-1 space-y-1">
                      <li className="flex gap-2">
                        <span className="text-[#dc143c]">◦</span>
                        <span>Most pancakes made in an hour</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#dc143c]">◦</span>
                        <span>Highest tossed and caught!</span>
                      </li>
                    </ul>
                  </span>
                </li>
              </ul>
              {testimonials.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-bold text-gray-900 mb-4">What our customers have to say</h4>
                  <blockquote className="border-l-4 border-[#dc143c] pl-4 italic">
                    <p className="text-gray-700 mb-2">{testimonials[0].quote}</p>
                    <footer className="text-gray-600 not-italic">
                      {testimonials[0].author}
                      {testimonials[0].authorTitle && (
                        <cite className="block text-sm">-- {testimonials[0].authorTitle}</cite>
                      )}
                    </footer>
                  </blockquote>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">home1.png</span>
              </div>
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">home2.png</span>
              </div>
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">home3.png</span>
              </div>
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">home4.png</span>
              </div>
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
                className="inline-flex items-center rounded-md bg-[#dc143c] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b01030]"
              >
                View Full Menu
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-lg text-gray-700">
                Chris Cake&apos;s famous flapjacks aren&apos;t the only thing our flippers are
                cooking up. From Coney dogs, brats and burgers to tacos and pulled pork... our Menus
                N More options will satisfy any group, any time, anywhere in Michigan.
              </p>
            </div>
            <div className="flex items-center">
              <Link
                href="/contact"
                className="w-full text-center inline-block bg-[#dc143c] text-white px-8 py-3 rounded text-lg font-semibold hover:bg-[#b01030] transition"
              >
                Contact us Today!
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
