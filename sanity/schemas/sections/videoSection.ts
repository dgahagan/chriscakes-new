import { defineType } from 'sanity';

export default defineType({
  name: 'videoSection',
  title: 'Video Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional heading above the video',
    },
    {
      name: 'videoUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description: 'YouTube video URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).custom((url) => {
          if (!url) return true;
          const urlString = String(url);
          const isYouTube =
            urlString.includes('youtube.com') || urlString.includes('youtu.be');
          return isYouTube || 'Please enter a valid YouTube URL';
        }),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional text to display below the video',
    },
  ],
  preview: {
    select: {
      title: 'title',
      videoUrl: 'videoUrl',
    },
    prepare({ title, videoUrl }) {
      return {
        title: title || 'Video Section',
        subtitle: videoUrl || 'No video URL',
      };
    },
  },
});
