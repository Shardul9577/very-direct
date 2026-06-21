import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contentApi } from '../../services/api';
import { useNotify } from '../../hooks/useNotify';
import MediaUpload from '../../components/admin/MediaUpload';
import '../Admin.css';

const INITIAL = {
  title: '',
  description: '',
  thumbnail: null,
  thumbnailLink: '',
  content: '',
  featured: false,
  trending: false,
};

export default function UploadBlog() {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();

  const thumbnailUrl = form.thumbnail?.url || form.thumbnailLink.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await contentApi.create({
        type: 'blog',
        title: form.title,
        description: form.description,
        thumbnail: thumbnailUrl,
        content: form.content,
        featured: form.featured,
        trending: form.trending,
      });
      notify.success('Blog published successfully');
      navigate('/admin/blogs');
    } catch (err) {
      notify.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <Link to="/admin/blogs" className="dash-breadcrumb">← Back to Blogs</Link>
          <h1>Upload Blog</h1>
          <p>Upload a cover image to Cloudinary or paste an image link</p>
        </div>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-form__grid">
          <div className="upload-form__main">
            <div className="upload-form__section">
              <h2>Blog Content</h2>
              <label>
                Title <span className="required">*</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter blog title"
                  required
                />
              </label>
              <label>
                Short Description
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary shown in listings"
                />
              </label>
              <label>
                Content <span className="required">*</span>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your blog content here. Use blank lines between paragraphs."
                  rows={14}
                  required
                />
              </label>
            </div>
          </div>

          <div className="upload-form__side">
            <div className="upload-form__section">
              <h2>Cover Image</h2>
              <MediaUpload
                type="image"
                accept="image/jpeg,image/png,image/webp,image/*"
                hint="JPG, PNG, WebP — max 10MB (optional)"
                value={form.thumbnail}
                allowLink
                linkValue={form.thumbnailLink}
                linkPlaceholder="https://example.com/cover.jpg"
                onLinkChange={(thumbnailLink) =>
                  setForm((prev) => ({
                    ...prev,
                    thumbnailLink,
                    thumbnail: thumbnailLink.trim() ? null : prev.thumbnail,
                  }))
                }
                onChange={(thumbnail) => {
                  if (thumbnail?.error) {
                    notify.error(thumbnail.error);
                    return;
                  }
                  setForm((prev) => ({
                    ...prev,
                    thumbnail,
                    thumbnailLink: thumbnail?.url ? '' : prev.thumbnailLink,
                  }));
                }}
              />
            </div>

            <div className="upload-form__section">
              <h2>Settings</h2>
              <label className="upload-checkbox">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Mark as Featured
              </label>
              <label className="upload-checkbox">
                <input
                  type="checkbox"
                  checked={form.trending}
                  onChange={(e) => setForm({ ...form, trending: e.target.checked })}
                />
                Mark as Trending
              </label>
            </div>

            <button type="submit" className="btn btn-primary upload-form__submit" disabled={saving}>
              {saving ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
