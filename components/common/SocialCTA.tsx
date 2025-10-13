'use client';

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYelp,
  FaPinterest,
  FaTiktok,
} from 'react-icons/fa';

interface Platform {
  platform: string;
  url: string;
  enabled: boolean;
  handle?: string;
}

interface SocialCTAProps {
  heading: string;
  message?: string;
  hashtag?: string;
  platforms: Platform[];
}

export default function SocialCTA({
  heading,
  message,
  hashtag,
  platforms,
}: SocialCTAProps) {
  const getIcon = (platform: string) => {
    const iconClass = 'w-8 h-8';
    switch (platform) {
      case 'facebook':
        return <FaFacebook className={iconClass} />;
      case 'instagram':
        return <FaInstagram className={iconClass} />;
      case 'twitter':
        return <FaTwitter className={iconClass} />;
      case 'yelp':
        return <FaYelp className={iconClass} />;
      case 'pinterest':
        return <FaPinterest className={iconClass} />;
      case 'tiktok':
        return <FaTiktok className={iconClass} />;
      default:
        return null;
    }
  };

  const enabledPlatforms = platforms.filter((p) => p.enabled);

  return (
    <section className="py-16 bg-gradient-to-br from-[#dc143c] to-[#b31034]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">{heading}</h2>

        {message && (
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {message}
          </p>
        )}

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {enabledPlatforms.map((platform) => (
            <a
              key={platform.platform}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors duration-200 hover:scale-110 transform"
              aria-label={`Follow us on ${platform.platform}`}
            >
              {getIcon(platform.platform)}
            </a>
          ))}
        </div>

        {/* Hashtag */}
        {hashtag && (
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-2xl font-bold text-white">#{hashtag}</span>
          </div>
        )}

        {/* Optional: Display Instagram handle if available */}
        {platforms.find((p) => p.platform === 'instagram' && p.handle) && (
          <p className="mt-6 text-white/90 text-lg">
            Tag us in your photos:{' '}
            <span className="font-semibold">
              {platforms.find((p) => p.platform === 'instagram')?.handle}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
