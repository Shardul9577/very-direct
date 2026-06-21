import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentApi } from '../services/api';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    contentApi
      .getById(id)
      .then(setBlog)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading">Loading...</div>;
  if (error || !blog) return <div className="page-error">{error || 'Blog not found'}</div>;

  return (
    <div className="detail-page blog-detail">
      <Link to="/blogs" className="back-link">← Back to Blogs</Link>
      {blog.thumbnail && (
        <img src={blog.thumbnail} alt={blog.title} className="detail-hero-image" />
      )}
      <article className="detail-article">
        <div className="detail-badges">
          {blog.featured && <span className="badge featured">Featured</span>}
          {blog.trending && <span className="badge trending">Trending</span>}
        </div>
        <h1>{blog.title}</h1>
        <p className="detail-desc">{blog.description}</p>
        <time className="detail-date">
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        <div className="blog-content">
          {blog.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
