import { formatCount } from '../../utils/videoHelpers';
import './VideoAnalyticsTable.css';

export default function VideoAnalyticsTable({ videos, emptyMessage }) {
  if (!videos.length) {
    return <div className="dash-empty">{emptyMessage}</div>;
  }

  const maxViews = Math.max(...videos.map((v) => v.views || 0), 1);

  return (
    <div className="analytics-table-wrap">
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Video</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Engagement</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => {
            const views = video.views || 0;
            const likes = video.likes || 0;
            const engagement = views ? Math.round((likes / views) * 1000) / 10 : 0;
            const barWidth = Math.round((views / maxViews) * 100);

            return (
              <tr key={video.id}>
                <td>
                  <div className="analytics-table__video">
                    {video.thumbnail && (
                      <img src={video.thumbnail} alt="" className="analytics-table__thumb" />
                    )}
                    <div>
                      <strong>{video.title}</strong>
                      <small>{new Date(video.createdAt).toLocaleDateString()}</small>
                      <div className="analytics-table__tags">
                        {video.featured && <span className="analytics-tag featured">Featured</span>}
                        {video.trending && <span className="analytics-tag trending">Trending</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="analytics-metric">{formatCount(views)}</span>
                </td>
                <td>
                  <span className="analytics-metric">{formatCount(likes)}</span>
                </td>
                <td>
                  <span className="analytics-metric analytics-metric--engagement">{engagement}%</span>
                </td>
                <td>
                  <div className="analytics-bar">
                    <div className="analytics-bar__fill" style={{ width: `${barWidth}%` }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
