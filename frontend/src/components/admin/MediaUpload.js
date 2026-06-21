import { useRef, useState } from 'react';
import { uploadApi } from '../../services/api';
import './MediaUpload.css';

export default function MediaUpload({
  accept,
  type = 'image',
  label,
  hint,
  value,
  onChange,
  previewType = 'image',
  allowLink = false,
  linkValue = '',
  onLinkChange,
  linkPlaceholder,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = type === 'video' ? await uploadApi.video(file) : await uploadApi.image(file);
      onChange(result);
    } catch (err) {
      onChange({ error: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (file) upload(file);
  };

  const linkUrl = linkValue?.trim() || '';
  const previewUrl =
    value?.url || value?.thumbnail || linkUrl || (typeof value === 'string' ? value : null);

  return (
    <div className="media-upload">
      {label && <span className="media-upload__label">{label}</span>}

      <div
        className={`media-upload__dropzone ${dragOver ? 'media-upload__dropzone--active' : ''} ${uploading ? 'media-upload__dropzone--loading' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="media-upload__input"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <p className="media-upload__status">Uploading to Cloudinary…</p>
        ) : previewUrl ? (
          <div className="media-upload__preview-wrap">
            {previewType === 'video' ? (
              <video src={previewUrl} className="media-upload__preview" controls />
            ) : (
              <img src={previewUrl} alt="Preview" className="media-upload__preview" />
            )}
            <p className="media-upload__replace">
              {linkUrl && !value?.url ? 'Using link — upload to replace' : 'Click or drop to replace'}
            </p>
          </div>
        ) : (
          <div className="media-upload__placeholder">
            <span className="media-upload__icon">{type === 'video' ? '▶' : '🖼'}</span>
            <p>Click or drag {type === 'video' ? 'video' : 'image'} here</p>
            {hint && <small>{hint}</small>}
          </div>
        )}
      </div>

      {allowLink && (
        <>
          <div className="media-upload__or">
            <span>or</span>
          </div>
          <label className="media-upload__link">
            Paste {type === 'video' ? 'video' : 'image'} link
            <input
              type="url"
              value={linkValue}
              onChange={(e) => onLinkChange?.(e.target.value)}
              placeholder={linkPlaceholder}
            />
          </label>
        </>
      )}

      {value?.error && <p className="media-upload__error">{value.error}</p>}
      {value?.duration != null && (
        <p className="media-upload__meta">Duration: {value.duration}s (auto-detected)</p>
      )}
    </div>
  );
}
