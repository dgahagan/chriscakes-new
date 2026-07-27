import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';
import { isValidMeasurementId } from '@/lib/analytics';
import SkipToContent from '@/components/common/SkipToContent';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'ChrisCakes - Premier Breakfast Caterer',
  description:
    "Michigan's premier breakfast caterer serving delicious pancakes and catering services since 1969.",
};

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
  phone?: string;
  email?: string;
  address?: string;
  socialMedia?: SocialMediaSettings;
  analytics?: {
    googleAnalyticsId?: string;
    enabled?: boolean;
  };
}

async function getSiteSettings() {
  try {
    const settings = await client.fetch<SiteSettings>(
      siteSettingsQuery,
      {},
      { next: { revalidate: 60 } }
    );
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const measurementId = settings?.analytics?.googleAnalyticsId;
  // Validated here as well as in the component so a malformed CMS value is
  // never serialized across the server/client boundary at all.
  const analyticsEnabled =
    settings?.analytics?.enabled && isValidMeasurementId(measurementId);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {analyticsEnabled && measurementId && (
          // Suspense is required: GoogleAnalytics reads useSearchParams, which
          // opts its subtree out of static prerendering without a boundary.
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={measurementId} />
          </Suspense>
        )}
        <SkipToContent />
        <Header
          phone={settings?.phone}
          email={settings?.email}
          address={settings?.address}
          socialMedia={settings?.socialMedia}
        />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer
          phone={settings?.phone}
          email={settings?.email}
          address={settings?.address}
          socialMedia={settings?.socialMedia}
        />
      </body>
    </html>
  );
}
