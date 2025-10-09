export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">About ChrisCakes</h1>
          <p className="mt-4 text-xl text-gray-600">
            Serving Michigan since 1969
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="mb-4">
              <strong>
                Chris Cakes has been around since 1969 – you won&apos;t find us
                in any history books! But you can find us in the Guinness Book
                of World Records... twice!
              </strong>
            </p>
            <p className="mb-4">
              We use a custom designed grill and dispensing unit that allows us
              to feed large and small groups extremely fast and efficiently. Add
              a dose of humor and some fancy pancake flipping, and you have a one
              of a kind event that people love to watch while enjoying our
              delicious pancakes!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="mb-4">
              Not only do we flip flapjacks, we flip burgers, too! Our Menus N
              More options are full of tasty lunch and dinner options. Pulled
              pork and smoked potato salad are our specialties because our
              sister business is a BBQ joint! Don&apos;t see what you&apos;re
              looking for? ASK US! We try to accommodate all requests.
            </p>
            <p className="mb-4">
              Chris Cakes can be found at fundraisers, church gatherings, school
              events, university functions, corporate lunches, dinners, benefits,
              graduations, reunions, fly-ins and national festivals; the list is
              endless. No event is too large or too small, from groups of 50 to
              50,000!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Service Area
            </h2>
            <p className="mb-4">
              Chris Cakes of Michigan is a dependable catering service that is
              readily available for your 24/7 catering needs. We service the
              entire state of Michigan and beyond! Centrally located, we can
              travel anywhere in Michigan in about two hours! In four feet of
              snow, in the dead of a Michigan winter, Chris Cakes has a 99.9%
              success rate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Promise
            </h2>
            <p className="text-lg font-semibold text-blue-600">
              Chris Cakes is more than great food at an affordable price...
              it&apos;s an experience!
            </p>
          </section>

          <section className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Notable Achievements
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#dc143c] mr-2">✓</span>
                <span>Served four Presidents and 16 Governors</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#dc143c] mr-2">✓</span>
                <span>Featured on Food Network</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#dc143c] mr-2">✓</span>
                <span>Two Guinness World Records</span>
              </li>
              <li className="flex items-start ml-8">
                <span className="text-[#dc143c] mr-2">•</span>
                <span>Most pancakes made in an hour</span>
              </li>
              <li className="flex items-start ml-8">
                <span className="text-[#dc143c] mr-2">•</span>
                <span>Highest pancake tossed and caught</span>
              </li>
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to experience ChrisCakes?
          </h3>
          <a
            href="/contact"
            className="inline-flex items-center rounded-md bg-[#dc143c] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b01030]"
          >
            Contact Us Today
          </a>
        </div>
      </div>
    </div>
  );
}
