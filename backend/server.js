require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'Very Direct API' });
});

app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Very Direct API running on http://localhost:${PORT}`);
  console.log('Upload routes: POST /api/upload/image, POST /api/upload/video');
});
