import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi, analyticsApi } from '../../services/api';
import { formatCount } from '../../utils/videoHelpers';
import '../Admin.css';

export default function AdminOverview() {
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getAll({ type: 'video' }),
      contentApi.getAll({ type: 'blog' }),
      analyticsApi.getAll(),
    ])
      .then(([v, b, a]) => {
        setVideos(v);
        setBlogs(b);
        setAnalytics(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your Very Direct content</p>
        </div>
      </div>

      <div className="dash-stats">
        <div className="dash-stat-card dash-stat-card--accent">
          <span className="dash-stat-card__label">Total Views</span>
          <strong className="dash-stat-card__value">
            {formatCount(analytics?.summary.totalViews || 0)}
          </strong>
          <Link to="/admin/analytics" className="dash-stat-card__link">View analytics →</Link>
        </div>
        <div className="dash-stat-card dash-stat-card--accent">
          <span className="dash-stat-card__label">Total Likes</span>
          <strong className="dash-stat-card__value">
            {formatCount(analytics?.summary.totalLikes || 0)}
          </strong>
          <span className="dash-stat-card__hint">
            {analytics?.summary.engagementRate || 0}% engagement
          </span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-card__label">Total Videos</span>
          <strong className="dash-stat-card__value">{videos.length}</strong>
          <Link to="/admin/videos" className="dash-stat-card__link">Manage videos →</Link>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-card__label">Total Blogs</span>
          <strong className="dash-stat-card__value">{blogs.length}</strong>
          <Link to="/admin/blogs" className="dash-stat-card__link">Manage blogs →</Link>
        </div>
      </div>

      <div className="dash-sections">
        <section className="dash-section-card">
          <div className="dash-section-card__head">
            <h2>Videos</h2>
            <Link to="/admin/videos/upload" className="btn btn-primary btn-sm">
              + Upload Video
            </Link>
          </div>
          {videos.length === 0 ? (
            <p className="dash-section-card__empty">No videos yet. Upload your first video.</p>
          ) : (
            <ul className="dash-preview-list">
              {videos.slice(0, 4).map((v) => (
                <li key={v.id}>
                  {v.thumbnail && <img src={v.thumbnail} alt="" />}
                  <div>
                    <strong>{v.title}</strong>
                    <span>
                      {formatCount(v.views || 0)} views · {formatCount(v.likes || 0)} likes
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/videos" className="dash-section-card__footer">View all videos →</Link>
        </section>

        <section className="dash-section-card">
          <div className="dash-section-card__head">
            <h2>Blogs</h2>
            <Link to="/admin/blogs/upload" className="btn btn-primary btn-sm">
              + Upload Blog
            </Link>
          </div>
          {blogs.length === 0 ? (
            <p className="dash-section-card__empty">No blogs yet. Publish your first blog.</p>
          ) : (
            <ul className="dash-preview-list">
              {blogs.slice(0, 4).map((b) => (
                <li key={b.id}>
                  {b.thumbnail && <img src={b.thumbnail} alt="" />}
                  <div>
                    <strong>{b.title}</strong>
                    <span>
                      {b.featured && 'Featured · '}
                      {b.trending && 'Trending · '}
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/blogs" className="dash-section-card__footer">View all blogs →</Link>
        </section>
      </div>
    </div>
  );
}
