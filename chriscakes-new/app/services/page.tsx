import { client } from '@/lib/sanity';
import { faqsQuery } from '@/lib/queries';
import Link from 'next/link';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const revalidate = 60;

async function getFAQs(): Promise<FAQ[]> {
  return client.fetch(faqsQuery);
}

export default async function ServicesPage() {
  const faqs = await getFAQs();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            24/7-365 <span className="text-xl font-normal text-gray-600">NO ONE CAN DO WHAT WE DO!</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* FUNdraising Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">Image: services1.jpg</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#dc143c] mb-4">FUNdraising</h2>
            <p className="text-gray-700 mb-4">
              Where else can you make $1,000 in just a short amount of time? Chris Cakes original pancake menu is structured
              so you can make a lot of money in just a few hours; or host a benefit spaghetti dinner or Coney night.
              Chris Cakes helps to make a profitable and unique experience. The FUN is no extra charge. Click on our
              FUNDRAISING MENU page for more information.
            </p>
            <Link
              href="/fundraising"
              className="inline-block bg-[#dc143c] text-white px-6 py-2 rounded hover:bg-[#b01030] transition"
            >
              View Fundraising
            </Link>
          </div>
        </div>

        <hr className="my-12 border-gray-300" />

        {/* Premiere Breakfast Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">Image: services2.jpg</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#dc143c] mb-4">Premiere Breakfast</h2>
            <p className="text-gray-700 mb-4">
              Our breakfast options include more than just flying flapjacks. We also serve French toast, scrambled eggs,
              hash browns, fresh fruit, and much more. Chris Cakes Premiere Breakfast options can be served at your
              office meetings, civic clubs, and more. Take a look at our BREAKFAST MENUS page, check out our options,
              build your budget, and call our office.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-[#dc143c] text-white px-6 py-2 rounded hover:bg-[#b01030] transition"
            >
              Breakfast Menus
            </Link>
          </div>
        </div>

        <hr className="my-12 border-gray-300" />

        {/* Menus N More Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">Image: services3.jpg</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#dc143c] mb-4">Menus N More</h2>
            <p className="text-gray-700 mb-4">
              From pulled pork, pasta, burgers, and brats, Chris Cakes serves corporate picnics, graduations, sporting
              events, and even weddings. Create your own specialized menu. There is very little we can't do! Check
              out our MENUS N MORE page to see our menu options. Special requests are welcome.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-[#dc143c] text-white px-6 py-2 rounded hover:bg-[#b01030] transition"
            >
              Menus N More
            </Link>
          </div>
        </div>

        <hr className="my-12 border-gray-300" />

        {/* Emergency Catering Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div></div>
          <div>
            <h2 className="text-3xl font-bold text-[#dc143c] mb-4">Emergency Catering</h2>
            <p className="text-gray-700 mb-4">
              If you have a catering crisis, Chris Cakes is available. We are a 24/7-365 caterer and we can get you out
              of a tight spot. We have the ability to feed a large amount of food to massive amounts of people, from
              serving utility workers to military personnel. Chris Cakes has been even known to provide relief in disaster
              situations.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#dc143c] text-white px-6 py-2 rounded hover:bg-[#b01030] transition"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <hr className="my-12 border-gray-300" />

        {/* FAQs Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq._id}
                className="group border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <span className="text-[#dc143c] group-open:rotate-180 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
