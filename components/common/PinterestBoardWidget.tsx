'use client';

import { useEffect } from 'react';

interface PinterestBoardWidgetProps {
  boardUrl: string;
  width?: number;
  height?: number;
}

/**
 * Pinterest Board Widget Component
 *
 * Embeds a Pinterest board widget to showcase curated content
 * Perfect for food businesses to display recipe ideas, cake designs, and event inspiration
 *
 * Recommended Pinterest Boards for ChrisCakes:
 * - Custom Cakes
 * - Breakfast Ideas
 * - Event Catering
 * - Pancake Recipes
 * - Behind the Scenes
 *
 * @param boardUrl - Full Pinterest board URL (e.g., https://www.pinterest.com/chriscakes/custom-cakes/)
 * @param width - Widget width (default: 400)
 * @param height - Widget height (default: 600)
 */
export default function PinterestBoardWidget({
  boardUrl,
  width = 400,
  height = 600,
}: PinterestBoardWidgetProps) {
  useEffect(() => {
    // Load Pinterest widget script
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://assets.pinterest.com/js/pinit.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-pin-build', 'doBuild');
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector(
          'script[src="https://assets.pinterest.com/js/pinit.js"]',
        );
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, []);

  return (
    <div className="pinterest-board-widget flex justify-center">
      <a
        data-pin-do="embedBoard"
        data-pin-board-width={width}
        data-pin-scale-height={height}
        data-pin-scale-width="80"
        href={boardUrl}
      ></a>
    </div>
  );
}

interface PinterestBoardsShowcaseProps {
  boards: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  heading?: string;
  profileUrl?: string;
}

/**
 * Pinterest Boards Showcase Component
 *
 * Displays multiple Pinterest boards in a showcase format
 * Great for highlighting different categories of content
 *
 * @param boards - Array of board objects with title, url, and optional description
 * @param heading - Section heading
 * @param profileUrl - Pinterest profile URL for follow button
 */
export function PinterestBoardsShowcase({
  boards,
  heading = 'Find Inspiration on Pinterest',
  profileUrl,
}: PinterestBoardsShowcaseProps) {
  if (!boards || boards.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{heading}</h2>
          <p className="mt-4 text-lg text-gray-600">
            Browse our Pinterest boards for cake ideas, recipes, and catering
            inspiration
          </p>
          {profileUrl && (
            <div className="mt-6">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#E60023] text-white px-6 py-3 rounded-lg hover:bg-[#bd001c] transition font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
                Follow us on Pinterest
              </a>
            </div>
          )}
        </div>

        {/* Board Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boards.map((board, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {board.title}
              </h3>
              {board.description && (
                <p className="text-gray-600 mb-4">{board.description}</p>
              )}
              <a
                href={board.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#E60023] font-semibold hover:underline"
              >
                View Board
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Share Your ChrisCakes Experience
          </h3>
          <p className="text-gray-700 mb-4">
            Pin your favorite ChrisCakes moments and tag us! We love seeing how
            you enjoy our pancakes.
          </p>
          <p className="text-sm text-gray-600">
            Use #ChrisCakes and @chriscakesmi when you pin
          </p>
        </div>
      </div>
    </section>
  );
}
