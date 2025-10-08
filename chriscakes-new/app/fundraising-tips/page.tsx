import Image from 'next/image';

export default function FundraisingTipsPage() {
  const tips = [
    'Pre-selling tickets is the backbone to any successful fundraiser. Chris Cakes is always prepared for walk-ins. Many events charge an extra $1 or $2 at the door to encourage advance ticket sales. If you sell 300 tickets and only 220 actually eat, remainder 80 tickets sold is an "out right" donation to your group. The more you feed, the less we charge, the more your group makes!',
    'Chris Cakes serves in increments of 3 hours. Depending on service hours and number of people to feed, our office will determine the number of grills for your event. We strongly suggest selling seating times. Selling 75 tickets for each 30 minute time block will also allow for walk-ins. By selling seating times, you will control the flow of your crowd ensuring not all will show at the same time, or have long lines (for groups of 300 or more where applicable).',
    'Chris Cakes is most successful when planned around other activities that will draw attendance. Book fairs, science fairs, music performances, puppet shows, plays, before sporting events, etc.',
    'Theme your event Pancakes and Pajamas, Breakfast with Santa, breakfast with the Easter Bunny, superheroes, famous book characters, etc.',
    'Many hands make for light work! Chris Cakes prices are structured to partner with 2 to 4 of your volunteers. Chris Cakes can bring additional staff for a nominal fee. Volunteers will help unload, set up, light serving, reload and clean-up of your event.',
    'Don\'t forget: it\'s a fundraiser. Consider the price you pay when eating out! We have been doing this for many years. Ask our office any questions you have… we have the answers!',
    'In your advertising, please include "As Seen on Food Network," "Guinness Book World Record Holders," and "Caution: Beware of Flying Pancakes." Feel free to download our logos, a sample flyer, tickets, and word search. You are also welcome to download logos and YouTube videos from our website, especially the "Pancake Robot" YouTube video, to enhance your advertising.',
    'Book early! We take bookings up to one year in advance. If you have a specific date, call us to check the availability on our busy calendar!',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            How to Run a Successful Fundraiser
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tips List */}
        <ul className="space-y-4 mb-12">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#dc143c] text-white flex items-center justify-center text-sm font-bold mt-1">
                {index + 1}
              </span>
              <p className="text-gray-700 flex-1">{tip}</p>
            </li>
          ))}
        </ul>

        {/* Testimonial Section */}
        <div className="grid gap-8 md:grid-cols-3 items-center">
          <div className="flex flex-col items-center">
            <div className="relative h-64 w-full rounded overflow-hidden mb-4">
              <Image
                src="/howto1.jpg"
                alt="Skrumpy Skedaddle at Almar Orchard"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center">
              Skrumpy Skedaddle at Almar Orchard<br />
              Sponsored by RunFit<br />
              Over 2,025 people fed in just 3 hours!!!
            </h3>
          </div>
          <div className="md:col-span-2">
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-lg text-gray-700 mb-2">
                "You guys did an awesome job at the Skrumpy Skedaddle! Organized clean Fast good
                food with a FLAIR!"
              </p>
              <p className="font-bold text-gray-900">Thank you! -Dave Gillie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
