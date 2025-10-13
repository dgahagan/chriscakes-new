'use client';

interface ClickToTweetProps {
  quote: string;
  author?: string;
  via?: string;
  url?: string;
  hashtags?: string[];
  size?: 'small' | 'medium' | 'large';
}

/**
 * Click-to-Tweet Quote Component
 *
 * Creates shareable quote boxes with a Tweet button
 * Perfect for testimonials, fun facts, and promotional content
 *
 * Use Cases:
 * - Customer testimonials
 * - Special promotions
 * - Fun facts about the business
 * - Event announcements
 *
 * @param quote - The text to be tweeted
 * @param author - Quote author (optional)
 * @param via - Twitter handle to mention (without @)
 * @param url - URL to include in tweet
 * @param hashtags - Array of hashtags (without #)
 * @param size - Visual size of the quote box
 */
export default function ClickToTweet({
  quote,
  author,
  via = 'chriscakesmi',
  url,
  hashtags = [],
  size = 'medium',
}: ClickToTweetProps) {
  const handleTweet = () => {
    // Build tweet text
    let tweetText = quote;
    if (author) {
      tweetText += ` - ${author}`;
    }

    // Build URL parameters
    const params = new URLSearchParams({
      text: tweetText,
      ...(url && { url }),
      ...(via && { via }),
      ...(hashtags.length > 0 && { hashtags: hashtags.join(',') }),
    });

    // Open Twitter intent
    const twitterUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const sizeClasses = {
    small: 'p-4 text-base',
    medium: 'p-6 text-lg',
    large: 'p-8 text-xl',
  };

  return (
    <div
      className={`click-to-tweet bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500 ${sizeClasses[size]} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start gap-4">
        {/* Quote Icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote Content */}
        <div className="flex-1">
          <blockquote className="text-gray-800 font-medium mb-4">
            {quote}
          </blockquote>
          {author && (
            <cite className="text-gray-600 text-sm not-italic">
              — {author}
            </cite>
          )}
        </div>

        {/* Tweet Button */}
        <button
          onClick={handleTweet}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:bg-[#1a8cd8] transition font-semibold text-sm"
          aria-label="Share on Twitter"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          Tweet
        </button>
      </div>
    </div>
  );
}

interface TweetableTestimonialsProps {
  testimonials: Array<{
    quote: string;
    author: string;
    authorTitle?: string;
  }>;
  heading?: string;
  maxDisplay?: number;
}

/**
 * Tweetable Testimonials Section Component
 *
 * Displays a collection of testimonials as Click-to-Tweet boxes
 * Perfect for showcasing customer feedback in a shareable format
 *
 * @param testimonials - Array of testimonial objects
 * @param heading - Section heading
 * @param maxDisplay - Maximum number of testimonials to display
 */
export function TweetableTestimonials({
  testimonials,
  heading = 'Share What Our Customers Are Saying',
  maxDisplay = 3,
}: TweetableTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const displayedTestimonials = testimonials.slice(0, maxDisplay);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{heading}</h2>
          <p className="mt-4 text-lg text-gray-600">
            Help spread the word about ChrisCakes!
          </p>
        </div>

        <div className="space-y-6">
          {displayedTestimonials.map((testimonial, index) => (
            <ClickToTweet
              key={index}
              quote={testimonial.quote}
              author={
                testimonial.authorTitle
                  ? `${testimonial.author}, ${testimonial.authorTitle}`
                  : testimonial.author
              }
              url="https://www.chriscakesofmi.com"
              hashtags={['ChrisCakes', 'Catering', 'MichiganFood']}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
