import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      {/* Logo Area */}
      <div className="bg-white border-b-4 border-[#dc143c]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Chris Cakes of Michigan"
              width={600}
              height={120}
              priority
              className="h-auto w-auto max-h-28"
            />
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#2d2d2d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-auto min-h-12 items-center flex-wrap gap-2 py-2">
            <Link
              href="/"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Services
            </Link>
            <Link
              href="/fundraising"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Fundraising
            </Link>
            <Link
              href="/menu"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Menus
            </Link>
            <Link
              href="/how-to-book"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              How to Book
            </Link>
            <Link
              href="/fundraising-tips"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Fundraising Tips
            </Link>
            <Link
              href="/volunteers"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Your Group
            </Link>
            <Link
              href="/day-of-event"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Day of Event
            </Link>
            <Link
              href="/invoice-payment"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Invoice & Payment
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              On the Flip Side
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Contact Info Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between text-sm text-gray-700">
            <div>P.O. Box 431 Clare MI, 48617</div>
            <div>Office: 989-802-0755</div>
            <div>
              Email:{' '}
              <a
                href="mailto:chriscakesmi@sbcglobal.net"
                className="text-blue-600 hover:text-blue-800"
              >
                chriscakesmi@sbcglobal.net
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
