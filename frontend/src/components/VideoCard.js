import { Link } from 'react-router-dom';
import Logo from './Logo';
import { formatRelativeTime, formatViews, formatDuration, CHANNEL_NAME } from '../utils/videoHelpers';
import './VideoCard.css';

export default function VideoCard({ video, variant = 'grid' }) {
  const duration = formatDuration(video.duration);

  return (
    <Link to={`/videos/${video.id}`} className={`yt-card yt-card--${variant}`}>
      <div className="yt-card__thumb-wrap">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="yt-card__thumb" loading="lazy" />
        ) : (
          <div className="yt-card__thumb-placeholder" />
        )}
        {duration && <span className="yt-card__duration">{duration}</span>}
      </div>

      <div className="yt-card__meta">
        <Logo size="xs" avatar className="yt-card__avatar" />
        <div className="yt-card__info">
          <h3 className="yt-card__title" title={video.title}>
            {video.title}
          </h3>
          <p className="yt-card__channel">{CHANNEL_NAME}</p>
          <p className="yt-card__stats">
            {formatViews(video.views || 0)} · {formatRelativeTime(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
