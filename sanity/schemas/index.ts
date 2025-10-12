import menuCategory from './menuCategory';
import menuItem from './menuItem';
import siteSettings from './siteSettings';
import page from './page';
import faq from './faq';
import testimonial from './testimonial';

// Page section types
import textSection from './sections/textSection';
import twoColumnSection from './sections/twoColumnSection';
import highlightBox from './sections/highlightBox';
import ctaSection from './sections/ctaSection';
import videoSection from './sections/videoSection';

export const schemaTypes = [
  // Content types
  menuCategory,
  menuItem,
  siteSettings,
  page,
  faq,
  testimonial,
  // Section types for pages
  textSection,
  twoColumnSection,
  highlightBox,
  ctaSection,
  videoSection,
];
