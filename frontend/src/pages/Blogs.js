import { useEffect, useState } from 'react';
import { contentApi } from '../services/api';
import ContentGrid from '../components/ContentGrid';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi
      .getAll({ type: 'blog' })
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blogs</h1>
        <p>Stories and articles from Very Direct</p>
      </div>
      <ContentGrid items={blogs} emptyMessage="No blogs published yet." />
    </div>
  );
}
