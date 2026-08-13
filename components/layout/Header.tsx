'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SocialPlatform {
  platform: string;
  url: string;
  enabled: boolean;
  handle?: string;
}

interface SocialMediaSettings {
  platforms?: SocialPlatform[];
  displaySettings?: {
    showInHeader?: boolean;
    showInFooter?: boolean;
  };
  socialCTA?: {
    enabled?: boolean;
    heading?: string;
    message?: string;
    hashtag?: string;
  };
}

interface HeaderProps {
  phone?: string;
  email?: string;
  address?: string;
  socialMedia?: SocialMediaSettings;
}

export default function Header({ phone, email, address }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMobileMenuOpenRef = useRef(false);

  // Return focus to the hamburger button whenever the mobile menu closes.
  useEffect(() => {
    if (wasMobileMenuOpenRef.current && !mobileMenuOpen) {
      menuButtonRef.current?.focus();
    }
    wasMobileMenuOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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
                aria-current={pathname === link.href ? 'page' : undefined}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation - Hamburger Button */}
          <div className="lg:hidden flex items-center justify-between py-3">
            <button
              ref={menuButtonRef}
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
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
          <div
            id="mobile-menu"
            className={`lg:hidden ${mobileMenuOpen ? 'pb-4' : 'hidden'}`}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="text-white hover:bg-gray-700 px-3 py-2 text-sm font-medium rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Info Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between text-sm text-gray-700">
            <div>{address || 'P.O. Box 431 Clare MI, 48617'}</div>
            <div>Office: {phone || '989-802-0755'}</div>
            <div>
              Email:{' '}
              <a
                href={`mailto:${email || 'chriscakesmi@sbcglobal.net'}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {email || 'chriscakesmi@sbcglobal.net'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
