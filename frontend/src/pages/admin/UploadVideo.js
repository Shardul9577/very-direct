import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contentApi } from '../../services/api';
import { useNotify } from '../../hooks/useNotify';
import MediaUpload from '../../components/admin/MediaUpload';
import '../Admin.css';

const INITIAL = {
  title: '',
  description: '',
  video: null,
  videoLink: '',
  thumbnail: null,
  thumbnailLink: '',
  duration: '',
  featured: false,
  trending: false,
};

export default function UploadVideo() {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();

  const videoUrl = form.video?.url || form.videoLink.trim();
  const thumbnailUrl =
    form.thumbnail?.url || form.thumbnailLink.trim() || form.video?.thumbnail || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) {
      notify.error('Please upload a video or paste a video link');
      return;
    }

    setSaving(true);
    try {
      await contentApi.create({
        type: 'video',
        title: form.title,
        description: form.description,
        thumbnail: thumbnailUrl,
        videoUrl,
        duration: form.video?.duration ?? (form.duration ? parseInt(form.duration, 10) : undefined),
        featured: form.featured,
        trending: form.trending,
      });
      notify.success('Video published successfully');
      navigate('/admin/videos');
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
          <Link to="/admin/videos" className="dash-breadcrumb">← Back to Videos</Link>
          <h1>Upload Video</h1>
          <p>Upload a file to Cloudinary or paste an external video link</p>
        </div>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-form__grid">
          <div className="upload-form__main">
            <div className="upload-form__section">
              <h2>Video</h2>
              <MediaUpload
                type="video"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                hint="MP4, WebM, MOV — max 200MB"
                value={form.video}
                previewType="video"
                allowLink
                linkValue={form.videoLink}
                linkPlaceholder="https://example.com/video.mp4"
                onLinkChange={(videoLink) =>
                  setForm((prev) => ({
                    ...prev,
                    videoLink,
                    video: videoLink.trim() ? null : prev.video,
                  }))
                }
                onChange={(video) => {
                  if (video?.error) {
                    notify.error(video.error);
                    return;
                  }
                  setForm((prev) => ({
                    ...prev,
                    video,
                    videoLink: video?.url ? '' : prev.videoLink,
                    duration: video?.duration ? String(video.duration) : prev.duration,
                    thumbnail:
                      video?.thumbnail && !prev.thumbnail?.url && !prev.thumbnailLink.trim()
                        ? { url: video.thumbnail }
                        : prev.thumbnail,
                  }));
                }}
              />
            </div>

            <div className="upload-form__section">
              <h2>Video Details</h2>
              <label>
                Title <span className="required">*</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter video title"
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description for the video"
                  rows={4}
                />
              </label>
            </div>
          </div>

          <div className="upload-form__side">
            <div className="upload-form__section">
              <h2>Thumbnail</h2>
              <MediaUpload
                type="image"
                accept="image/jpeg,image/png,image/webp,image/*"
                hint="Optional — auto-generated from uploaded video if skipped"
                value={form.thumbnail}
                allowLink
                linkValue={form.thumbnailLink}
                linkPlaceholder="https://example.com/thumb.jpg"
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
              <label>
                Duration (seconds)
                <input
                  type="number"
                  min="0"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder={form.video?.duration ? 'Auto-filled after upload' : 'e.g. 120'}
                  readOnly={Boolean(form.video?.duration)}
                />
              </label>
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

            <button
              type="submit"
              className="btn btn-primary upload-form__submit"
              disabled={saving || !videoUrl}
            >
              {saving ? 'Publishing...' : 'Publish Video'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
