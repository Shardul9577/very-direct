import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../../services/api';
import VideoAnalyticsTable from '../../components/admin/VideoAnalyticsTable';
import { formatCount } from '../../utils/videoHelpers';
import '../Admin.css';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading analytics...</div>;
  if (!data) return <div className="page-error">Failed to load analytics</div>;

  const { summary, topByViews, topByLikes, videos } = data;
  const maxViews = Math.max(...topByViews.map((v) => v.views), 1);

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1>Analytics</h1>
          <p>Platform-wide video performance overview</p>
        </div>
        <Link to="/admin/videos" className="btn btn-outline">
          Manage Videos
        </Link>
      </div>

      <div className="dash-stats">
        <div className="dash-stat-card dash-stat-card--accent">
          <span className="dash-stat-card__label">Total Views</span>
          <strong className="dash-stat-card__value">{formatCount(summary.totalViews)}</strong>
        </div>
        <div className="dash-stat-card dash-stat-card--accent">
          <span className="dash-stat-card__label">Total Likes</span>
          <strong className="dash-stat-card__value">{formatCount(summary.totalLikes)}</strong>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-card__label">Avg Views / Video</span>
          <strong className="dash-stat-card__value">{formatCount(summary.avgViews)}</strong>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-card__label">Engagement Rate</span>
          <strong className="dash-stat-card__value">{summary.engagementRate}%</strong>
          <span className="dash-stat-card__hint">Likes ÷ Views</span>
        </div>
      </div>

      <div className="analytics-panels">
        <section className="analytics-panel">
          <h2>Top Videos by Views</h2>
          <ul className="analytics-rank-list">
            {topByViews.map((v, i) => (
              <li key={v.id}>
                <span className="analytics-rank">{i + 1}</span>
                <div className="analytics-rank__info">
                  <strong>{v.title}</strong>
                  <span>{formatCount(v.views)} views · {formatCount(v.likes)} likes</span>
                </div>
                <div className="analytics-bar analytics-bar--wide">
                  <div
                    className="analytics-bar__fill"
                    style={{ width: `${Math.round((v.views / maxViews) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="analytics-panel">
          <h2>Top Videos by Likes</h2>
          <ul className="analytics-rank-list">
            {topByLikes.map((v, i) => (
              <li key={v.id}>
                <span className="analytics-rank">{i + 1}</span>
                <div className="analytics-rank__info">
                  <strong>{v.title}</strong>
                  <span>{formatCount(v.likes)} likes · {formatCount(v.views)} views</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="analytics-full-table">
        <h2>All Video Analytics</h2>
        <VideoAnalyticsTable videos={videos} emptyMessage="No video data yet." />
      </section>
    </div>
  );
}
