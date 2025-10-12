interface VideoSectionProps {
  title?: string;
  videoUrl: string;
  description?: string;
}

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Handle youtu.be short URLs
  const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortUrlMatch) {
    return `https://www.youtube.com/embed/${shortUrlMatch[1]}`;
  }

  // Handle youtube.com watch URLs
  const watchUrlMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchUrlMatch) {
    return `https://www.youtube.com/embed/${watchUrlMatch[1]}`;
  }

  // Handle embed URLs (already in correct format)
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  return null;
}

export default function VideoSection({ title, videoUrl, description }: VideoSectionProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <section className="mb-12">
      {title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>}
      <div className="flex justify-center mb-6">
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          title={title || 'Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg max-w-full"
        ></iframe>
      </div>
      {description && (
        <div className="bg-gray-100 p-4 rounded max-w-2xl mx-auto">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
    </section>
  );
}
