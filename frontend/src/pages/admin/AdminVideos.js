import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../services/api';
import ContentTable from '../../components/admin/ContentTable';
import VideoAnalyticsTable from '../../components/admin/VideoAnalyticsTable';
import { useConfirm } from '../../context/ConfirmContext';
import { useNotify } from '../../hooks/useNotify';
import { formatCount } from '../../utils/videoHelpers';
import '../Admin.css';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const notify = useNotify();

  const loadVideos = () => {
    contentApi
      .getAll({ type: 'video' })
      .then(setVideos)
      .catch(() => notify.error('Failed to load videos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async (id, field) => {
    try {
      const updated = await contentApi.toggle(id, field);
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
      notify.success(`${field} updated for "${updated.title}"`);
    } catch (err) {
      notify.error(err.message);
    }
  };

  const handleDelete = async (id, title) => {
    const ok = await confirm({
      title: 'Delete video?',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await contentApi.delete(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      notify.success('Video deleted successfully');
    } catch (err) {
      notify.error(err.message);
    }
  };

  const totalViews = videos.reduce((s, v) => s + (v.views || 0), 0);
  const totalLikes = videos.reduce((s, v) => s + (v.likes || 0), 0);

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1>Videos</h1>
          <p>Manage videos and view per-video analytics</p>
        </div>
        <div className="dash-page__actions">
          <Link to="/admin/analytics" className="btn btn-outline">
            Full Analytics
          </Link>
          <Link to="/admin/videos/upload" className="btn btn-primary">
            + Upload Video
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">Loading videos...</div>
      ) : (
        <>
          <div className="dash-stats dash-stats--compact">
            <div className="dash-stat-card">
              <span className="dash-stat-card__label">Videos</span>
              <strong className="dash-stat-card__value">{videos.length}</strong>
            </div>
            <div className="dash-stat-card dash-stat-card--accent">
              <span className="dash-stat-card__label">Total Views</span>
              <strong className="dash-stat-card__value">{formatCount(totalViews)}</strong>
            </div>
            <div className="dash-stat-card dash-stat-card--accent">
              <span className="dash-stat-card__label">Total Likes</span>
              <strong className="dash-stat-card__value">{formatCount(totalLikes)}</strong>
            </div>
          </div>

          <section className="analytics-full-table">
            <h2>Video Analytics</h2>
            <VideoAnalyticsTable videos={videos} emptyMessage="No videos yet." />
          </section>

          <section className="analytics-full-table">
            <h2>Manage Videos</h2>
            <ContentTable
              items={videos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              emptyMessage="No videos yet. Upload your first video."
            />
          </section>
        </>
      )}
    </div>
  );
}
