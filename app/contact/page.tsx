import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import ContactForm from '@/components/contact/ContactForm';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Contact Us - ChrisCakes | Book Your Event',
  description:
    'Contact ChrisCakes to book your breakfast catering event. Serving Michigan and beyond with 99.9% success rate. Groups of 50 to 50,000. Phone: 989-802-0755',
  openGraph: {
    title: 'Contact ChrisCakes - Book Your Event',
    description:
      'Contact ChrisCakes to book your breakfast catering event. 99.9% success rate. Groups of 50 to 50,000!',
    url: 'https://www.chriscakesofmi.com/contact',
    siteName: 'ChrisCakes of Michigan',
    images: [
      {
        url: 'https://www.chriscakesofmi.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact ChrisCakes for catering',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact ChrisCakes - Book Your Event',
    description:
      'Contact ChrisCakes to book your breakfast catering event. 99.9% success rate!',
    images: ['https://www.chriscakesofmi.com/logo.png'],
  },
};

async function getSiteSettings() {
  try {
    const settings = await client.fetch(siteSettingsQuery);
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get in touch to book your event
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            <div className="space-y-6">
              {settings?.phone && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Phone
                  </h3>
                  <a
                    href={`tel:${settings.phone}`}
                    className="mt-1 text-lg text-blue-600 hover:text-blue-500"
                  >
                    {settings.phone}
                  </a>
                </div>
              )}

              {settings?.email && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </h3>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 text-lg text-blue-600 hover:text-blue-500"
                  >
                    {settings.email}
                  </a>
                </div>
              )}

              {settings?.address && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Service Area
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 whitespace-pre-line">
                    {settings.address}
                  </p>
                </div>
              )}

              {settings?.hours && settings.hours.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    {settings.hours.map(
                      (
                        day: { day: string; hours: string },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="flex justify-between text-gray-700"
                        >
                          <span className="font-medium">{day.day}</span>
                          <span>{day.hours}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {settings?.socialMedia && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    {settings.socialMedia.facebook && (
                      <a
                        href={settings.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        Facebook
                      </a>
                    )}
                    {settings.socialMedia.instagram && (
                      <a
                        href={settings.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        Instagram
                      </a>
                    )}
                    {settings.socialMedia.twitter && (
                      <a
                        href={settings.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Your Event
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            99.9% Success Rate
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            In four feet of snow, in the dead of a Michigan winter, Chris Cakes
            has a 99.9% success rate. We&apos;re committed to making your event
            a success!
          </p>
        </div>
      </div>
    </div>
  );
}
