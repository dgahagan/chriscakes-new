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
          <div className="flex h-12 items-center justify-between">
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
              >
                Chris Cakes of Michigan
              </Link>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/services"
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
              >
                Services
              </Link>
              <Link
                href="/menu"
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
              >
                Menus
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
