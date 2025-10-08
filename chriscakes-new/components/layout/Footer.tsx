export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View our Services
                </a>
              </li>
            </ul>
          </div>

          {/* Menus */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Menus</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/menu"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Breakfast Menus
                </a>
              </li>
              <li>
                <a
                  href="/menu"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Menus N More
                </a>
              </li>
            </ul>
          </div>

          {/* On The Flip Side */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              On The Flip Side
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  How to Book an Event
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Day of Event Information
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Contact Us
            </h3>
            <a
              href="/contact"
              className="inline-block bg-[#5bc0de] hover:bg-[#46b8da] text-white px-4 py-2 rounded text-sm font-medium mb-3"
            >
              Contact Us Online!
            </a>
            <p className="text-gray-700 text-sm mb-1">
              P.O. Box 431 Clare MI, 48617
            </p>
            <p className="text-gray-700 text-sm mb-1">Office: 989-802-0755</p>
            <p className="text-sm">
              Email:{' '}
              <a
                href="mailto:chriscakesmi@sbcglobal.net"
                className="text-blue-600 hover:text-blue-800"
              >
                chriscakesmi@sbcglobal.net
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Chris Cakes of Michigan. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
