export default function VolunteersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            As Grandma said, "Many hands makes for light work."
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-gray-700 mb-6">
              Chris Cakes is designed to make the work easy and enjoyable for everyone involved.
              Our inexpensive price per plate is based on partnering with your group and the
              volunteers that you provide. If you are unable to provide us with those volunteers,
              we reserve the right to adjust our prices accordingly.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What is expected from your group:
            </h3>
            <ul className="space-y-2 mb-6">
              {[
                'Someone to assist our Flippers upon arrival with basic unloading',
                'Set-up of tables and chairs and service tables',
                'Light serving (sausage & drinks)',
                'Refilling syrup bottles',
                'General area clean-up and several trash receptacles',
                'Two 6-8\' serving tables for each serving line required',
                'Access to potable (drinking) water',
                'Access to one 110 volts/15-amp electrical outlet',
                'Someone to assist our Flippers upon departure with basic reloading',
              ].map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-[#dc143c] flex-shrink-0">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-gray-700 mb-4">
              Chris Cakes can cook, flip, and provide a show faster than your guests can go
              through the serving line. We suggest considering the following to help the flow of
              your event:
            </p>

            <ol className="space-y-3 mb-6 list-decimal list-inside">
              <li className="text-gray-700">
                Know the occupancy for the room in which you are serving
              </li>
              <li className="text-gray-700">
                Each grill serves 200 people/hour (depending on the appetites). We allow a maximum
                of 3 hours for serving time and will dispatch an additional grill if needed.
              </li>
              <li className="text-gray-700">
                Pre-sell tickets with seating times. For groups of 300 or more (i.e., closed
                events, schools, etc.), we suggest selling 75 tickets every 30 minutes. That will
                also allow for walk-ins. For a ticket template, click here.
              </li>
              <li className="text-gray-700">
                Planning other activities to augment your event which will draw a crowd. Contact
                our office for ideas in you planning stages.
              </li>
            </ol>

            <p className="font-bold text-gray-900">
              One week prior, when you confirm your event numbers, please alert our office if
              seating times were assigned so our flippers can be prepared. Also, verify your
              volunteers are ready for the event.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
                <span className="text-gray-500">help1.jpg</span>
              </div>
              <h3 className="font-bold text-gray-900 text-center text-sm">
                National Cherry Festival Flying Flapjacks prior to the Blue Angels Air Show
              </h3>
            </div>
            <div>
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
                <span className="text-gray-500">help2.jpg</span>
              </div>
              <h3 className="font-bold text-gray-900 text-center text-sm">
                We Flip Burgers too
              </h3>
            </div>
            <div>
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded mb-2">
                <span className="text-gray-500">help3.jpg</span>
              </div>
              <h3 className="font-bold text-gray-900 text-center text-sm">
                Breakfast with Santa An ongoing Chris Cakes tradition
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
