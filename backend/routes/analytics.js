const express = require('express');
const { readContent } = require('../store');
const { requireAdmin } = require('../middleware/auth');
const { ensureVideoAnalytics } = require('../utils/analytics');

const router = express.Router();

router.use(requireAdmin);

router.get('/', (req, res) => {
  const videos = readContent()
    .filter((i) => i.type === 'video')
    .map(ensureVideoAnalytics);

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const avgViews = videos.length ? Math.round(totalViews / videos.length) : 0;
  const avgLikes = videos.length ? Math.round((totalLikes / videos.length) * 10) / 10 : 0;

  const ranked = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .map((v) => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail,
      views: v.views || 0,
      likes: v.likes || 0,
      engagement: v.views ? Math.round(((v.likes || 0) / v.views) * 1000) / 10 : 0,
      featured: v.featured,
      trending: v.trending,
      createdAt: v.createdAt,
    }));

  const topByViews = ranked.slice(0, 5);
  const topByLikes = [...ranked].sort((a, b) => b.likes - a.likes).slice(0, 5);

  res.json({
    summary: {
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      avgViews,
      avgLikes,
      engagementRate: totalViews ? Math.round((totalLikes / totalViews) * 1000) / 10 : 0,
    },
    videos: ranked,
    topByViews,
    topByLikes,
  });
});

module.exports = router;
