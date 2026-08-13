'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isValidMeasurementId } from '@/lib/analytics';

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isConfigured, setIsConfigured] = useState(false);

  const isValidId = isValidMeasurementId(measurementId);

  useEffect(() => {
    // Page views are sent only once `gtag('config')` has run, so the first one
    // can never be queued ahead of the config command that gives it a target.
    if (!isValidId || !isConfigured) return;

    const w = window as GtagWindow;
    if (typeof w.gtag !== 'function') return;

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    w.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      send_to: measurementId,
    });
  }, [pathname, searchParams, measurementId, isValidId, isConfigured]);

  if (!isValidId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onReady={() => setIsConfigured(true)}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}
