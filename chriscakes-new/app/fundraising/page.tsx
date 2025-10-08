import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import Link from 'next/link';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
}

export const revalidate = 60;

async function getFundraisingItems(): Promise<MenuItem[]> {
  const query = groq`*[_type == "menuItem" && category->slug.current == "fundraising-menus" && available == true] | order(order asc) {
    _id,
    name,
    description,
    price
  }`;
  return client.fetch(query);
}

export default async function FundraisingPage() {
  const menuItems = await getFundraisingItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Fundraising Menus
          </h1>
          <p className="text-lg text-gray-600">
            SCHOOLS - CHURCHES - BENEFITS - CLUBS/ORGANIZATIONS - FESTIVALS - AIRPORT FLY-INS
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Menu Items */}
        <div className="space-y-12">
          {menuItems.map((item) => (
            <div key={item._id}>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h2>
                </div>
                <div>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <p className="text-center font-bold text-lg">Call for pricing!</p>
                  {item.name === 'Hot Dog Bash' && (
                    <p className="text-center text-[#dc143c] font-bold mt-2">
                      CONEY SAUCE ADD $1.00 pp
                    </p>
                  )}
                </div>
              </div>
              <hr className="mt-8 border-gray-300" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            WE put the FUN… in FUNdraising!
          </h2>
          <p className="text-xl text-gray-700 mb-6">Contact us today for more information!</p>

          {/* YouTube Video */}
          <div className="mb-6 flex justify-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/o1iOkNDGkFA"
              title="Chris Cakes Fundraising Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>

          <Link
            href="/contact"
            className="inline-block bg-[#dc143c] text-white px-8 py-3 rounded text-lg font-semibold hover:bg-[#b01030] transition"
          >
            Contact Us!
          </Link>
        </div>
      </div>
    </div>
  );
}
