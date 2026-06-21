const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readContent, writeContent } = require('../store');
const { requireAdmin } = require('../middleware/auth');
const { ensureVideoAnalytics, publicVideo } = require('../utils/analytics');

const router = express.Router();

function findVideoIndex(items, id) {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return { index: -1 };
  const item = ensureVideoAnalytics(items[index]);
  if (item.type !== 'video') return { index: -1 };
  items[index] = item;
  return { index, item };
}

router.get('/', (req, res) => {
  let items = readContent().map((i) => (i.type === 'video' ? publicVideo(i) : i));

  const { type, featured, trending } = req.query;
  if (type) items = items.filter((i) => i.type === type);
  if (featured === 'true') items = items.filter((i) => i.featured);
  if (trending === 'true') items = items.filter((i) => i.trending);

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items);
});

router.post('/:id/view', (req, res) => {
  const items = readContent();
  const { index, item } = findVideoIndex(items, req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });

  items[index].views = (items[index].views || 0) + 1;
  writeContent(items);
  res.json(publicVideo(items[index]));
});

router.post('/:id/like', (req, res) => {
  const { visitorId } = req.body;
  if (!visitorId) return res.status(400).json({ error: 'visitorId is required' });

  const items = readContent();
  const { index } = findVideoIndex(items, req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });

  const video = items[index];
  const likedBy = video.likedBy || [];
  const alreadyLiked = likedBy.includes(visitorId);

  if (alreadyLiked) {
    video.likedBy = likedBy.filter((v) => v !== visitorId);
    video.likes = Math.max(0, (video.likes || 0) - 1);
  } else {
    video.likedBy = [...likedBy, visitorId];
    video.likes = (video.likes || 0) + 1;
  }

  writeContent(items);
  res.json({ ...publicVideo(video), liked: !alreadyLiked });
});

router.get('/:id/like-status', (req, res) => {
  const { visitorId } = req.query;
  const item = readContent().find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Content not found' });
  if (item.type !== 'video') return res.status(400).json({ error: 'Not a video' });

  const video = ensureVideoAnalytics(item);
  res.json({
    liked: visitorId ? (video.likedBy || []).includes(visitorId) : false,
    likes: video.likes || 0,
    views: video.views || 0,
  });
});

router.get('/:id', (req, res) => {
  const item = readContent().find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Content not found' });
  res.json(item.type === 'video' ? publicVideo(item) : item);
});

router.post('/', requireAdmin, (req, res) => {
  const { type, title, description, thumbnail, videoUrl, content, duration, featured, trending } = req.body;

  if (!type || !title || !['video', 'blog'].includes(type)) {
    return res.status(400).json({ error: 'Valid type (video/blog) and title are required' });
  }
  if (type === 'video' && !videoUrl) {
    return res.status(400).json({ error: 'videoUrl is required for videos' });
  }
  if (type === 'blog' && !content) {
    return res.status(400).json({ error: 'content is required for blogs' });
  }

  const items = readContent();
  const newItem = {
    id: uuidv4(),
    type,
    title,
    description: description || '',
    thumbnail: thumbnail || '',
    ...(type === 'video'
      ? { videoUrl, views: 0, likes: 0, likedBy: [], ...(duration ? { duration: Number(duration) } : {}) }
      : { content }),
    featured: Boolean(featured),
    trending: Boolean(trending),
    createdAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  writeContent(items);
  res.status(201).json(type === 'video' ? publicVideo(newItem) : newItem);
});

router.put('/:id', requireAdmin, (req, res) => {
  const items = readContent();
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Content not found' });

  const existing = items[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    createdAt: existing.createdAt,
    ...(existing.type === 'video' && {
      views: existing.views ?? 0,
      likes: existing.likes ?? 0,
      likedBy: existing.likedBy ?? [],
    }),
  };

  if (updated.featured !== undefined) updated.featured = Boolean(updated.featured);
  if (updated.trending !== undefined) updated.trending = Boolean(updated.trending);

  items[index] = updated;
  writeContent(items);
  res.json(updated);
});

router.patch('/:id/toggle', requireAdmin, (req, res) => {
  const { field } = req.body;
  if (!['featured', 'trending'].includes(field)) {
    return res.status(400).json({ error: 'field must be "featured" or "trending"' });
  }

  const items = readContent();
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Content not found' });

  items[index][field] = !items[index][field];
  writeContent(items);
  res.json(items[index]);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const items = readContent();
  const filtered = items.filter((i) => i.id !== req.params.id);
  if (filtered.length === items.length) {
    return res.status(404).json({ error: 'Content not found' });
  }
  writeContent(filtered);
  res.json({ success: true });
});

module.exports = router;
