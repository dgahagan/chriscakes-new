import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import Link from 'next/link';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYelp,
  FaPinterest,
  FaTiktok,
} from 'react-icons/fa';

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

interface SiteSettings {
  socialMedia?: SocialMediaSettings;
}

const getSocialIcon = (platform: string) => {
  const iconProps = { className: 'w-6 h-6' };
  switch (platform) {
    case 'facebook':
      return <FaFacebook {...iconProps} />;
    case 'instagram':
      return <FaInstagram {...iconProps} />;
    case 'twitter':
      return <FaTwitter {...iconProps} />;
    case 'yelp':
      return <FaYelp {...iconProps} />;
    case 'pinterest':
      return <FaPinterest {...iconProps} />;
    case 'tiktok':
      return <FaTiktok {...iconProps} />;
    default:
      return null;
  }
};

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(
    siteSettingsQuery,
    {},
    { next: { revalidate: 60 } },
  );

  const socialPlatforms =
    settings?.socialMedia?.platforms?.filter((p) => p.enabled) || [];
  const showSocialInFooter =
    settings?.socialMedia?.displaySettings?.showInFooter ?? true;

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
                <Link
                  href="/services"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View our Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Menus */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Menus</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Breakfast Menus
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Menus N More
                </Link>
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
                <Link
                  href="/about"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  How to Book an Event
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Day of Event Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Contact Us
            </h3>
            <Link
              href="/contact"
              className="inline-block bg-[#5bc0de] hover:bg-[#46b8da] text-white px-4 py-2 rounded text-sm font-medium mb-3"
            >
              Contact Us Online!
            </Link>
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

        {/* Social Media Icons */}
        {showSocialInFooter && socialPlatforms.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col items-center gap-4">
              {settings?.socialMedia?.socialCTA?.enabled && (
                <div className="text-center">
                  {settings.socialMedia.socialCTA.heading && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {settings.socialMedia.socialCTA.heading}
                    </h3>
                  )}
                  {settings.socialMedia.socialCTA.message && (
                    <p className="text-sm text-gray-600 mb-3">
                      {settings.socialMedia.socialCTA.message}
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-center gap-4">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.platform}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#dc143c] transition-colors"
                    aria-label={`Visit us on ${platform.platform}`}
                  >
                    {getSocialIcon(platform.platform)}
                  </a>
                ))}
              </div>
              {settings?.socialMedia?.socialCTA?.hashtag && (
                <p className="text-sm text-gray-600">
                  #{settings.socialMedia.socialCTA.hashtag}
                </p>
              )}
            </div>
          </div>
        )}

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
