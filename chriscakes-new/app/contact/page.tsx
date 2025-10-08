import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';

export const revalidate = 3600; // Revalidate every hour

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-xl text-blue-100">
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
                    {settings.hours.map((day: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between text-gray-700"
                      >
                        <span className="font-medium">{day.day}</span>
                        <span>{day.hours}</span>
                      </div>
                    ))}
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

          {/* Contact Form or Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Your Event
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Chris Cakes of Michigan is a dependable catering service that is
                readily available for your 24/7 catering needs.
              </p>
              <p>
                We service the entire state of Michigan and beyond! No event is
                too large or too small, from groups of 50 to 50,000!
              </p>
              <p className="font-semibold text-blue-600">
                Call us today to discuss your event and get a quote!
              </p>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Event Types We Serve:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Fundraisers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Church gatherings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>School events</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Corporate functions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Graduations & reunions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Festivals & benefits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
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
