import { useEffect, useState } from 'react';
import { contentApi } from '../services/api';
import VideoGrid from '../components/VideoGrid';
import './Videos.css';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi
      .getAll({ type: 'video' })
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="yt-feed-page">
      <VideoGrid videos={videos} emptyMessage="No videos published yet." />
    </div>
  );
}
