'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
  LinkedinIcon,
} from 'next-share';
import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  platforms?: string[];
  showNativeShare?: boolean;
}

export default function ShareButtons({
  url,
  title,
  description,
  image,
  platforms = ['facebook', 'twitter', 'pinterest', 'whatsapp', 'native'],
  showNativeShare = true,
}: ShareButtonsProps) {
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  useEffect(() => {
    setIsNativeShareSupported(!!navigator.share && showNativeShare);
  }, [showNativeShare]);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description || title,
        url,
      });
    } catch (err) {
      // User cancelled or error occurred - silently fail
      console.error('Share failed:', err);
    }
  };

  const iconSize = 32;
  const iconProps = { size: iconSize, round: true };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-gray-700">Share:</span>

      {platforms.includes('facebook') && (
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon {...iconProps} />
        </FacebookShareButton>
      )}

      {platforms.includes('twitter') && (
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon {...iconProps} />
        </TwitterShareButton>
      )}

      {platforms.includes('whatsapp') && (
        <WhatsappShareButton url={url} title={title} separator=" - ">
          <WhatsappIcon {...iconProps} />
        </WhatsappShareButton>
      )}

      {platforms.includes('pinterest') && image && (
        <PinterestShareButton
          url={url}
          media={image}
          description={description || title}
        >
          <PinterestIcon {...iconProps} />
        </PinterestShareButton>
      )}

      {platforms.includes('linkedin') && (
        <LinkedinShareButton url={url}>
          <LinkedinIcon {...iconProps} />
        </LinkedinShareButton>
      )}

      {platforms.includes('native') && isNativeShareSupported && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
          aria-label="Share via device"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
