const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('vd_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const contentApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/content${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/content/${id}`),
  create: (body) => request('/content', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/content/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggle: (id, field) =>
    request(`/content/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ field }) }),
  delete: (id) => request(`/content/${id}`, { method: 'DELETE' }),
  recordView: (id) => request(`/content/${id}/view`, { method: 'POST' }),
  toggleLike: (id, visitorId) =>
    request(`/content/${id}/like`, { method: 'POST', body: JSON.stringify({ visitorId }) }),
  getLikeStatus: (id, visitorId) =>
    request(`/content/${id}/like-status?visitorId=${encodeURIComponent(visitorId)}`),
};

export const analyticsApi = {
  getAll: () => request('/analytics'),
};

export const adminApi = {
  login: (username, password) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  verify: () => request('/admin/verify'),
};

async function uploadRequest(path, file) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: formData });
  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (text.includes('Cannot POST')) {
      throw new Error(
        'Upload API not found. Restart the backend: cd backend && npm start'
      );
    }
    throw new Error('Upload failed — unexpected server response');
  }

  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export const uploadApi = {
  image: (file) => uploadRequest('/upload/image', file),
  video: (file) => uploadRequest('/upload/video', file),
};
