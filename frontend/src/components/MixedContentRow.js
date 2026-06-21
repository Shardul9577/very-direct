import ContentCard from './ContentCard';
import VideoCard from './VideoCard';
import './VideoGrid.css';
import './MixedContentRow.css';

export default function MixedContentRow({ items, emptyMessage }) {
  if (!items.length) {
    return <p className="yt-empty">{emptyMessage}</p>;
  }

  const videos = items.filter((i) => i.type === 'video');
  const blogs = items.filter((i) => i.type === 'blog');

  return (
    <div className="mixed-content">
      {videos.length > 0 && (
        <div className="yt-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} variant="grid" />
          ))}
        </div>
      )}
      {blogs.length > 0 && (
        <div className={`mixed-blogs ${videos.length ? 'has-videos' : ''}`}>
          {blogs.map((blog) => (
            <ContentCard key={blog.id} item={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
