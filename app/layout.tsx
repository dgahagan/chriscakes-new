import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';
import SkipToContent from '@/components/common/SkipToContent';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'ChrisCakes - Premier Breakfast Caterer',
  description:
    'Michigan\'s premier breakfast caterer serving delicious pancakes and catering services since 1969.',
};

interface SiteSettings {
  analytics?: {
    googleAnalyticsId?: string;
    enabled?: boolean;
  };
}

async function getSiteSettings() {
  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
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
  const analyticsEnabled =
    settings?.analytics?.enabled && settings?.analytics?.googleAnalyticsId;

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {analyticsEnabled && settings?.analytics?.googleAnalyticsId && (
          <GoogleAnalytics measurementId={settings.analytics.googleAnalyticsId} />
        )}
        <SkipToContent />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
