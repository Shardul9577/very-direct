import VideoCard from './VideoCard';
import './VideoGrid.css';

export default function VideoGrid({ videos, emptyMessage = 'No videos yet.' }) {
  if (!videos.length) {
    return <p className="yt-empty">{emptyMessage}</p>;
  }

  return (
    <div className="yt-grid">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} variant="grid" />
      ))}
    </div>
  );
}
