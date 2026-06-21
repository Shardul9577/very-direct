import { useEffect } from 'react';
import { INSTAGRAM_URL } from '../constants/brand';
import { useNotify } from '../hooks/useNotify';
import './ShareModal.css';

const SHARE_OPTIONS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    className: 'share-option--whatsapp',
    icon: 'WA',
  },
  {
    id: 'x',
    label: 'X',
    className: 'share-option--x',
    icon: '𝕏',
  },
  {
    id: 'copy',
    label: 'Copy Link',
    className: 'share-option--copy',
    icon: '🔗',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    className: 'share-option--instagram',
    icon: 'IG',
  },
];

function buildShareUrl(platform, url, title) {
  const text = `${title} — Very Direct`;
  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    case 'x':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    default:
      return url;
  }
}

export default function ShareModal({ open, onClose, title, url }) {
  const notify = useNotify();

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      notify.success('Link copied to clipboard!');
    } catch {
      const input = document.createElement('textarea');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      notify.success('Link copied to clipboard!');
    }
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      copyLink();
      return;
    }

    if (platform === 'instagram') {
      copyLink();
      window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    const shareUrl = buildShareUrl(platform, url, title);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="share-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="share-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="share-modal__header">
          <h2 id="share-modal-title">Share</h2>
          <button type="button" className="share-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p className="share-modal__subtitle">Share this video with others</p>

        <div className="share-modal__options">
          {SHARE_OPTIONS.map(({ id, label, className, icon }) => (
            <button
              key={id}
              type="button"
              className={`share-option ${className}`}
              onClick={() => handleShare(id)}
            >
              <span className="share-option__icon">{icon}</span>
              <span className="share-option__label">{label}</span>
            </button>
          ))}
        </div>

        <div className="share-modal__url">
          <input type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
        </div>
      </div>
    </div>
  );
}
