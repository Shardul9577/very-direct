function ensureVideoAnalytics(item) {
  if (item.type !== 'video') return item;
  return {
    ...item,
    views: item.views ?? 0,
    likes: item.likes ?? 0,
    likedBy: item.likedBy ?? [],
  };
}

function publicVideo(item) {
  const v = ensureVideoAnalytics(item);
  const { likedBy, ...rest } = v;
  return rest;
}

module.exports = { ensureVideoAnalytics, publicVideo };
