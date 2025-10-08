import Link from 'next/link';

export default function DayOfEventPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Day of Event Information</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4 mb-12">
          <div className="space-y-4">
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">day1.jpg</span>
            </div>
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">day2.jpg</span>
            </div>
            <h3 className="font-bold text-gray-900 text-center">Ausable River Canoe Marathon</h3>
          </div>

          <div className="md:col-span-3 space-y-4">
            <p className="text-gray-700">
              We will arrive 1 hour before the start time of your event, and 1-2 hours prior for
              Menus N More events. You must have 2-3 volunteers meet us to unload. We will not
              unload without your help.
            </p>
            <p className="text-gray-700">
              When we arrive, our flippers will assess your room for optimum usage and the flow of
              your event. If you have questions regarding your room set-up prior to our arrival,
              please call our office. Outside events require a three-sided tent and prior approval
              from our office.
            </p>
            <p className="text-gray-700">
              After unloading, your volunteers will be asked to help set-up the serving tables, work
              the serving tables during the event, help with clean-up and reloading. Your group will
              not be asked to cook! Remember what Grandma used to say… "Many hands make for light
              work!"
            </p>
            <p className="text-gray-700">
              Someone from your group will be responsible for ticket, money, and plate distribution.
              We invoice based on the number of plates used. You may want to have signage for your
              guests to "keep their plate until they have had all they can eat."
            </p>
            <p className="text-gray-700">
              Payment is due at the conclusion of the event. Take a look at our{' '}
              <Link href="/invoice-payment" className="text-[#dc143c] hover:underline">
                INVOICE AND PAYMENT
              </Link>{' '}
              page for more information.
            </p>
          </div>
        </div>

        {/* Event Images */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div>
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
              <span className="text-gray-500">day3.jpg</span>
            </div>
            <h3 className="font-bold text-gray-900 text-center">
              MSU Extension Breakfast on the Farm
            </h3>
          </div>
          <div>
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
              <span className="text-gray-500">day4.jpg</span>
            </div>
            <h3 className="font-bold text-gray-900 text-center">Rogers Athletic Christmas Party</h3>
          </div>
          <div>
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
              <span className="text-gray-500">day5.jpg</span>
            </div>
            <h3 className="font-bold text-gray-900 text-center">Rogers Athletic Christmas Party</h3>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Scott Kefgen and the staff at UPA
          </h2>
          <p className="text-gray-700">
            "Melanie, Trevor and the gang at Chris Cakes - Thank you so much for the amazing event!
            Our team was thrilled with everything you did for us! Our families were really excited
            for our pancake fundraiser, and they really showed their support by showing up in such
            large numbers. We are so happy with the results that we hope to work with you again in
            the future! Please let us know if there is anything we can ever do to help you." -
            Sincerely, your very happy customers!
          </p>
        </div>
      </div>
    </div>
  );
}
