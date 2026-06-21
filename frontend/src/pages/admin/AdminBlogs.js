import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../services/api';
import ContentTable from '../../components/admin/ContentTable';
import { useConfirm } from '../../context/ConfirmContext';
import { useNotify } from '../../hooks/useNotify';
import '../Admin.css';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const notify = useNotify();

  const loadBlogs = () => {
    contentApi
      .getAll({ type: 'blog' })
      .then(setBlogs)
      .catch(() => notify.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async (id, field) => {
    try {
      const updated = await contentApi.toggle(id, field);
      setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
      notify.success(`${field} updated for "${updated.title}"`);
    } catch (err) {
      notify.error(err.message);
    }
  };

  const handleDelete = async (id, title) => {
    const ok = await confirm({
      title: 'Delete blog?',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await contentApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      notify.success('Blog deleted successfully');
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1>Blogs</h1>
          <p>Manage all blog posts — toggle featured & trending status</p>
        </div>
        <Link to="/admin/blogs/upload" className="btn btn-primary">
          + Upload Blog
        </Link>
      </div>

      {loading ? (
        <div className="page-loading">Loading blogs...</div>
      ) : (
        <ContentTable
          items={blogs}
          onToggle={handleToggle}
          onDelete={handleDelete}
          emptyMessage="No blogs yet. Publish your first blog."
        />
      )}
    </div>
  );
}
