import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - ChrisCakes',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-[#dc143c] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b01030]"
          >
            Back to Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center rounded-md border-2 border-[#dc143c] px-6 py-3 text-base font-semibold text-[#dc143c] hover:bg-[#dc143c] hover:text-white"
          >
            View Our Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
