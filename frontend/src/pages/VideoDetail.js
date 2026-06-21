import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { contentApi } from '../services/api';
import VideoCard from '../components/VideoCard';
import ShareModal from '../components/ShareModal';
import Logo from '../components/Logo';
import { getVisitorId } from '../utils/visitor';
import { formatRelativeTime, formatViews, formatLikes, CHANNEL_NAME } from '../utils/videoHelpers';
import './VideoDetail.css';

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const visitorId = getVisitorId();

  useEffect(() => {
    Promise.all([
      contentApi.getById(id),
      contentApi.getAll({ type: 'video' }),
      contentApi.getLikeStatus(id, visitorId),
    ])
      .then(([current, allVideos, status]) => {
        setVideo(current);
        setRelated(allVideos.filter((v) => v.id !== id).slice(0, 12));
        setLiked(status.liked);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, visitorId]);

  useEffect(() => {
    const viewedKey = `vd_viewed_${id}`;
    if (sessionStorage.getItem(viewedKey)) return;

    contentApi
      .recordView(id)
      .then((updated) => {
        sessionStorage.setItem(viewedKey, '1');
        setVideo((prev) => (prev ? { ...prev, views: updated.views } : prev));
      })
      .catch(() => {});
  }, [id]);

  const handleLike = useCallback(async () => {
    if (likeLoading || !video) return;
    setLikeLoading(true);
    try {
      const result = await contentApi.toggleLike(id, visitorId);
      setVideo((prev) => ({ ...prev, likes: result.likes, views: result.views }));
      setLiked(result.liked);
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  }, [id, visitorId, likeLoading, video]);

  if (loading) return <div className="page-loading">Loading...</div>;
  if (error || !video) return <div className="page-error">{error || 'Video not found'}</div>;

  return (
    <div className="yt-watch">
      <div className="yt-watch__primary">
        <div className="yt-watch__player-wrap">
          <video controls poster={video.thumbnail} className="yt-watch__player">
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>

        <h1 className="yt-watch__title">{video.title}</h1>

        <div className="yt-watch__actions-row">
          <div className="yt-watch__channel-block">
            <Logo size="sm" avatar className="yt-watch__channel-avatar" />
            <div className="yt-watch__channel-info">
              <span className="yt-watch__channel-name">{CHANNEL_NAME}</span>
              <span className="yt-watch__sub-count">@verydirect</span>
            </div>
          </div>

          <div className="yt-watch__action-btts">
            <button
              type="button"
              className={`yt-watch__action-btn${liked ? ' yt-watch__action-btn--liked' : ''}`}
              onClick={handleLike}
              disabled={likeLoading}
            >
              <span className="yt-action-icon">{liked ? '👍' : '👍'}</span>
              {formatLikes(video.likes || 0)}
            </button>
            <button type="button" className="yt-watch__action-btn" onClick={() => setShareOpen(true)}>
              <span className="yt-action-icon">↗</span>
              Share
            </button>
          </div>
        </div>

        <div className="yt-watch__desc-box">
          <div className="yt-watch__desc-stats">
            {formatViews(video.views || 0)} · {formatRelativeTime(video.createdAt)}
            {video.featured && <span className="yt-watch__tag">Featured</span>}
            {video.trending && <span className="yt-watch__tag yt-watch__tag--trending">Trending</span>}
          </div>
          <div className={`yt-watch__desc-text ${descExpanded ? 'expanded' : ''}`}>
            <p>{video.description}</p>
          </div>
          {video.description && video.description.length > 120 && (
            <button
              type="button"
              className="yt-watch__show-more"
              onClick={() => setDescExpanded(!descExpanded)}
            >
              {descExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      <aside className="yt-watch__sidebar">
        <h2 className="yt-watch__sidebar-title">Up next</h2>
        <div className="yt-watch__related">
          {related.map((v) => (
            <VideoCard key={v.id} video={v} variant="compact" />
          ))}
        </div>
      </aside>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={video.title}
        url={window.location.href}
      />
    </div>
  );
}
