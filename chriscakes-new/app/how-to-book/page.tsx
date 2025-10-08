export default function HowToBookPage() {
  const steps = [
    {
      number: 1,
      description:
        'Review website for policies, pricing, and procedures, or contact our office for further information.',
    },
    {
      number: 2,
      description:
        'Fill out the CONTACT US form on website. This holds your date on our calendar until your deposit is received.',
    },
    {
      number: 3,
      description:
        'Deposits are due within one week after the submission of the "CONTACT US" form. You will receive an email from our office when your deposit has been received. Should you decide not to confirm the date held on our calendar, please be mindful to release that date by notifying our office. If we receive a request that conflicts with your date prior to receiving your deposit, you will get first right of refusal.',
    },
    {
      number: 4,
      description:
        'Upon receiving confirmation, please review ALL DETAILS and verify correctness of the date, serving time, serving address, and cell number for day of event.',
    },
    {
      number: 5,
      description:
        "One week prior to your event date, you will receive a 'Checking In' email. At this time, you can revise your confirmed number if needed and assure us your volunteers are ready.",
    },
    {
      number: 6,
      description:
        'Three days prior to the event, you will receive a call from your Flipper.',
    },
    {
      number: 7,
      description:
        "Chris Cakes is user friendly -- we do all the hard work. Organize 2-3 volunteers, sell your tickets, and together this ensures you'll have a fun and profitable experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">How to Book an Event</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Video Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-3 items-center">
          <div className="flex items-center justify-center">
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">Image: book1.jpg</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/o1iOkNDGkFA"
              title="Chris Cakes Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
            <div className="mt-4 bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-700">
                Download this GREAT YouTube video and play it during ticket sales and the day of
                your event… sure to add excitement and create even more FUN prior to your event!
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">Image: book2.jpg</span>
            </div>
          </div>
        </div>

        {/* Steps Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {steps.map((step) => (
                <tr key={step.number} className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-900 align-top whitespace-nowrap">
                    STEP {step.number}:
                  </td>
                  <td className="p-4 text-gray-700">{step.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
