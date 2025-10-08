'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/fundraising', label: 'Fundraising' },
    { href: '/menu', label: 'Menus' },
    { href: '/how-to-book', label: 'How to Book' },
    { href: '/fundraising-tips', label: 'Fundraising Tips' },
    { href: '/volunteers', label: 'Your Group' },
    { href: '/day-of-event', label: 'Day of Event' },
    { href: '/invoice-payment', label: 'Invoice & Payment' },
    { href: '/about', label: 'On the Flip Side' },
    { href: '/contact', label: 'Contact Us' },
  ];

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
          {/* Desktop Navigation */}
          <div className="hidden lg:flex h-auto min-h-12 items-center flex-wrap gap-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation - Hamburger Button */}
          <div className="lg:hidden flex items-center justify-between py-3">
            <button
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <span className="text-white text-sm font-medium">Menu</span>
          </div>

          {/* Mobile Navigation - Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:bg-gray-700 px-3 py-2 text-sm font-medium rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
