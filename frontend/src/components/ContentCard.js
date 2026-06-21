import { Link } from 'react-router-dom';
import './ContentCard.css';

export default function ContentCard({ item }) {
  const path = item.type === 'video' ? `/videos/${item.id}` : `/blogs/${item.id}`;

  return (
    <Link to={path} className="content-card">
      <div className="card-image-wrap">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="card-image" />
        ) : (
          <div className="card-image-placeholder">
            {item.type === 'video' ? '▶' : '✎'}
          </div>
        )}
        <span className="card-type-badge">{item.type}</span>
        {(item.featured || item.trending) && (
          <div className="card-badges">
            {item.featured && <span className="badge featured">Featured</span>}
            {item.trending && <span className="badge trending">Trending</span>}
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.description}</p>
        <time className="card-date">
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
      </div>
    </Link>
  );
}
