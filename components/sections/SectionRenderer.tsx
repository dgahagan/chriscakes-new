import TextSection from './TextSection';
import TwoColumnSection from './TwoColumnSection';
import HighlightBox from './HighlightBox';
import CTASection from './CTASection';
import VideoSection from './VideoSection';
import { PortableTextBlock } from '@portabletext/react';

interface SanityImage {
  asset: {
    _ref: string;
  };
  alt?: string;
}

interface Section {
  _type: string;
  _key: string;
  title?: string;
  heading?: string;
  content?: PortableTextBlock[];
  description?: string;
  items?: string[];
  backgroundColor?: 'gray' | 'crimson' | 'white';
  style?: 'default' | 'checklist' | 'numbered' | 'primary' | 'secondary';
  image?: SanityImage;
  imagePosition?: 'left' | 'right';
  ctaButton?: {
    text: string;
    link: string;
  };
  buttonText?: string;
  buttonLink?: string;
  videoUrl?: string;
}

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'textSection':
            return (
              <TextSection
                key={section._key}
                title={section.title}
                content={section.content || []}
              />
            );

          case 'twoColumnSection':
            return (
              <TwoColumnSection
                key={section._key}
                heading={section.heading || ''}
                content={section.content || []}
                image={section.image}
                imagePosition={section.imagePosition}
                ctaButton={section.ctaButton}
              />
            );

          case 'highlightBox':
            return (
              <HighlightBox
                key={section._key}
                title={section.title || ''}
                content={section.content}
                items={section.items}
                backgroundColor={section.backgroundColor}
                style={section.style as 'default' | 'checklist' | 'numbered' | undefined}
              />
            );

          case 'ctaSection':
            return (
              <CTASection
                key={section._key}
                heading={section.heading || ''}
                description={section.description}
                buttonText={section.buttonText || ''}
                buttonLink={section.buttonLink || ''}
                style={section.style as 'primary' | 'secondary' | undefined}
              />
            );

          case 'videoSection':
            return (
              <VideoSection
                key={section._key}
                title={section.title}
                videoUrl={section.videoUrl || ''}
                description={section.description}
              />
            );

          default:
            console.warn(`Unknown section type: ${section._type}`);
            return null;
        }
      })}
    </>
  );
}
