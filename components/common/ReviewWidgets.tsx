'use client';

import { useEffect } from 'react';

interface FacebookReviewsProps {
  pageUrl: string;
  width?: number;
  height?: number;
  showPosts?: boolean;
}

/**
 * Facebook Page Plugin Component
 *
 * Embeds Facebook page timeline and reviews
 * Requires Facebook page URL from Sanity settings
 *
 * @param pageUrl - Facebook page URL (e.g., https://www.facebook.com/chriscakesmi)
 * @param width - Widget width in pixels
 * @param height - Widget height in pixels
 * @param showPosts - Show recent posts timeline
 */
export function FacebookReviews({
  pageUrl,
  width = 340,
  height = 500,
  showPosts = false,
}: FacebookReviewsProps) {
  useEffect(() => {
    // Load Facebook SDK
    interface WindowWithFB extends Window {
      FB?: {
        XFBML: {
          parse: () => void;
        };
      };
    }

    const windowWithFB = window as WindowWithFB;

    if (typeof window !== 'undefined' && !windowWithFB.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        if (windowWithFB.FB) {
          windowWithFB.FB.XFBML.parse();
        }
      };
    } else if (windowWithFB.FB) {
      // SDK already loaded, just parse
      windowWithFB.FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="facebook-reviews-widget">
      <div id="fb-root"></div>
      <div
        className="fb-page"
        data-href={pageUrl}
        data-tabs={showPosts ? 'timeline' : ''}
        data-width={width}
        data-height={height}
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Facebook Reviews</a>
        </blockquote>
      </div>
    </div>
  );
}

interface YelpBadgeProps {
  businessUrl: string;
  style?: 'standard' | 'compact';
}

/**
 * Yelp Rating Badge Component
 *
 * Displays Yelp rating and review count
 * Links to full Yelp business page
 *
 * @param businessUrl - Yelp business URL (e.g., https://www.yelp.com/biz/chris-cakes-clare)
 * @param style - Badge style (standard or compact)
 */
export function YelpBadge({
  businessUrl,
  style = 'standard',
}: YelpBadgeProps) {
  return (
    <div className="yelp-badge">
      <a
        href={businessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-3 ${
          style === 'compact'
            ? 'bg-white border border-gray-300 px-4 py-2 rounded-lg hover:border-[#dc143c]'
            : 'bg-white shadow-lg px-6 py-4 rounded-xl hover:shadow-xl'
        } transition-all`}
      >
        <svg
          className={style === 'compact' ? 'w-8 h-8' : 'w-12 h-12'}
          viewBox="0 0 24 24"
          fill="#d32323"
          aria-label="Yelp logo"
        >
          <path d="M12.271,17.218a1.167,1.167,0,0,0-.625,1.072,1.035,1.035,0,0,0,.119.463l1.003,2.019a.851.851,0,0,0,.405.405,1.021,1.021,0,0,0,.561.128,4.5,4.5,0,0,0,2.788-1.135,4.5,4.5,0,0,0,1.637-2.511.926.926,0,0,0-.092-.621.818.818,0,0,0-.463-.348l-2.306-.741a.955.955,0,0,0-.3-.046A1.18,1.18,0,0,0,12.271,17.218Zm3.382-4.367-2.306-.735a.956.956,0,0,0-.3-.046,1.235,1.235,0,0,0-.926.388,1.071,1.071,0,0,0-.506,1.544l1.003,2.019a.929.929,0,0,0,.405.4,1.086,1.086,0,0,0,.561.119,4.611,4.611,0,0,0,2.788-1.126,4.482,4.482,0,0,0,1.637-2.511.905.905,0,0,0-.092-.621A.853.853,0,0,0,15.653,12.851Zm-5.174-1.271a1.167,1.167,0,0,0,.625-1.072,1.035,1.035,0,0,0-.119-.463L10.014,8.026a.851.851,0,0,0-.405-.405A1.021,1.021,0,0,0,9.048,7.5a4.5,4.5,0,0,0-2.788,1.135A4.5,4.5,0,0,0,4.623,11.15a.926.926,0,0,0,.092.621.818.818,0,0,0,.463.348l2.306.741a.955.955,0,0,0,.3.046A1.18,1.18,0,0,0,10.479,11.58Zm5.771-2.583L14.16,6.924a1.153,1.153,0,0,0-.817-.524,1.08,1.08,0,0,0-.909.265,4.53,4.53,0,0,0-1.646,2.5,4.482,4.482,0,0,0-.074,3.078.874.874,0,0,0,.348.463.905.905,0,0,0,.561.146l2.5-.027a1.189,1.189,0,0,0,.808-.3A1.107,1.107,0,0,0,16.25,8.997Z" />
        </svg>
        <div className="text-left">
          <div className="font-bold text-gray-900">
            {style === 'compact' ? 'Reviews' : 'See our reviews'}
          </div>
          <div className="text-sm text-gray-600">on Yelp</div>
        </div>
      </a>
    </div>
  );
}

interface ReviewsContainerProps {
  facebookPageUrl?: string;
  yelpBusinessUrl?: string;
  heading?: string;
  showFacebook?: boolean;
  showYelp?: boolean;
}

/**
 * Reviews Container Component
 *
 * Displays both Facebook and Yelp reviews in a unified section
 * Fully controlled via Sanity CMS settings
 *
 * @param facebookPageUrl - Facebook page URL
 * @param yelpBusinessUrl - Yelp business URL
 * @param heading - Section heading
 * @param showFacebook - Show Facebook reviews widget
 * @param showYelp - Show Yelp badge
 */
export function ReviewsContainer({
  facebookPageUrl,
  yelpBusinessUrl,
  heading = 'What Our Customers Say',
  showFacebook = true,
  showYelp = true,
}: ReviewsContainerProps) {
  const hasFacebook = showFacebook && facebookPageUrl;
  const hasYelp = showYelp && yelpBusinessUrl;

  if (!hasFacebook && !hasYelp) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{heading}</h2>
          <p className="mt-4 text-lg text-gray-600">
            See what our customers are saying about ChrisCakes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {hasFacebook && (
            <div className="flex justify-center">
              <FacebookReviews pageUrl={facebookPageUrl} />
            </div>
          )}

          {hasYelp && (
            <div className="flex flex-col items-center gap-6">
              <YelpBadge businessUrl={yelpBusinessUrl} />
              <div className="text-center max-w-md">
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Love our service?
                </h3>
                <p className="text-gray-600">
                  Leave us a review on Facebook or Yelp! Your feedback helps us
                  serve you better and helps others discover ChrisCakes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
