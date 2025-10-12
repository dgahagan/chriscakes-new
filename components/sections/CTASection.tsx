import Link from 'next/link';

interface CTASectionProps {
  heading: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  style?: 'primary' | 'secondary';
}

export default function CTASection({
  heading,
  description,
  buttonText,
  buttonLink,
  style = 'primary',
}: CTASectionProps) {
  const buttonClasses =
    style === 'primary'
      ? 'bg-[#dc143c] text-white hover:bg-[#b01030]'
      : 'border-2 border-[#dc143c] text-[#dc143c] hover:bg-[#dc143c] hover:text-white';

  return (
    <section className="mb-12 text-center py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
      {description && <p className="text-lg text-gray-700 mb-6">{description}</p>}
      <Link
        href={buttonLink}
        className={`inline-block px-8 py-3 rounded text-lg font-semibold transition ${buttonClasses}`}
      >
        {buttonText}
      </Link>
    </section>
  );
}
