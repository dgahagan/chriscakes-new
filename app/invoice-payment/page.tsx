import Image from 'next/image';

export default function InvoicePaymentPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Invoice, Mileage, Payment & License
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Invoice Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <div className="relative h-64 w-full rounded overflow-hidden mb-4">
              <Image
                src="/invoice1.jpg"
                alt="University of Michigan Football"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center">
              University of Michigan
              <br />
              Football - GO BLUE!
            </h3>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Invoice:</h2>
            <p className="text-gray-700 mb-4">Fundraisers will be invoiced one of two ways:</p>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-gray-700">
                Either 80% of the number confirmed to serve
                <br />
                <strong>
                  Note: Confirmed number can be revised up to one week prior… or
                </strong>
              </li>
              <li className="text-gray-700">
                The actual number of people fed that day, whichever is greatest Deposit will be
                applied to final invoice.
              </li>
              <li className="text-gray-700">
                Because we purchase a-la-carte items per event based on your confirmed number, you
                will be invoiced for the a-la-carte items based on the number of people you confirm,
                not the number of people who actually eat that day.
              </li>
            </ol>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Mileage Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="relative h-64 w-full rounded overflow-hidden">
            <Image
              src="/invoice2.jpg"
              alt="Chris Cakes Catering"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mileage:</h2>
            <p className="text-gray-700">
              Because of our inexpensive price per plate, a charge of 70 cents per mile round trip
              offsets the cost of travel to your event, and helps us to maintain our vehicles,
              insurance, licenses and inspections. If reaching your event requires a drive time of
              three hours or more, or your start time is prior to 6:00am, the cost of a motel will
              be necessary.
            </p>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Payment Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <div className="relative h-64 w-full rounded overflow-hidden mb-4">
              <Image
                src="/invoice3.jpg"
                alt="Nutcake teaches Sparty how to Flip"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center">
              Nutcake teaches Sparty how to Flip!
            </h3>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment:</h2>
            <p className="text-gray-700 mb-4">
              A $200 deposit is required within ONE WEEK of your inquiry to secure your date and
              will be applied to your final invoice. We will no longer hold dates. Payment is DUE at
              the completion of your event. The prices listed are CASH prices. We accept cash,
              checks, and all major credit cards (a 3% convenience fee applies to all credit card
              payments). If you are unable to provide payment at the completion of your event, there
              will be an additional 15% administration fee added to these cash prices.
            </p>
            <p className="text-center">
              <strong className="text-[#dc143c]">
                If you enjoy our flipping, our flippers appreciate your tipping.
              </strong>{' '}
              <em className="text-gray-600">
                *Rescheduling policy: Your $200 deposit will follow you through the calendar year
                until a new date has been booked.*
              </em>
            </p>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* License Section */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative h-64 w-full rounded overflow-hidden">
            <Image
              src="/invoice4.jpg"
              alt="Licensed and Insured"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">License & Insurance:</h2>
            <p className="text-gray-700">
              We are a licensed State Transitory Food Unit through the State of Michigan and carry a
              $1,000,000 liability policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
