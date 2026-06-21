import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import SnackbarProvider from './components/SnackbarProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Blogs from './pages/Blogs';
import VideoDetail from './pages/VideoDetail';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminVideos from './pages/admin/AdminVideos';
import AdminBlogs from './pages/admin/AdminBlogs';
import UploadVideo from './pages/admin/UploadVideo';
import UploadBlog from './pages/admin/UploadBlog';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import './App.css';

function AppLayout() {
  const { pathname } = useLocation();
  const isPrivateRoute = pathname.startsWith('/admin') || pathname === '/abhaypratap';
  const isYoutubeLayout = pathname.startsWith('/videos') && !isPrivateRoute;

  return (
    <div className="app">
      {!isPrivateRoute && <Navbar />}
      <main
        className={[
          'main-content',
          isYoutubeLayout && 'main-content--wide',
          isPrivateRoute && 'main-content--admin',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/abhaypratap" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="videos/upload" element={<UploadVideo />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/upload" element={<UploadBlog />} />
          </Route>
        </Routes>
      </main>
      {!isPrivateRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </ConfirmProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
