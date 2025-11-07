import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ComedyMascot from './components/ComedyMascot';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import YouTubeManager from './pages/admin/YouTubeManager';
import BlogManager from './pages/admin/BlogManager';
import BlogEditor from './pages/admin/BlogEditor';
import PortfolioManager from './pages/admin/PortfolioManager';
import ContactsManager from './pages/admin/ContactsManager';
import SubscribersManager from './pages/admin/SubscribersManager';
import Settings from './pages/admin/Settings';
import HeroManager from './pages/admin/HeroManager';
import NotificationsManager from './pages/admin/NotificationsManager';
import ProtectedRoute from './components/ProtectedRoute';

// Main App Content with Routes
function AppContent() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<Login />} />
      
      {/* Protected admin routes */}
      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin">
          <Route index element={<Dashboard />} />
          <Route path="youtube" element={<YouTubeManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="blog/new" element={<BlogEditor />} />
          <Route path="blog/edit/:postId" element={<BlogEditor />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="portfolio/new" element={<PortfolioManager />} />
          <Route path="contacts" element={<ContactsManager />} />
          <Route path="subscribers" element={<SubscribersManager />} />
          <Route path="hero" element={<HeroManager />} />
          <Route path="notifications" element={<NotificationsManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>

      {/* Public website routes */}
      <Route path="/" element={
        <>
          <Navbar />
          <Home />
          <Footer />
          <ComedyMascot />
        </>
      } />
      <Route path="/portfolio" element={
        <>
          <Navbar />
          <Portfolio />
          <Footer />
          <ComedyMascot />
        </>
      } />
      <Route path="/blog" element={
        <>
          <Navbar />
          <Blog />
          <Footer />
          <ComedyMascot />
        </>
      } />
      <Route path="/blog/:slug" element={
        <>
          <Navbar />
          <BlogPost />
          <Footer />
          <ComedyMascot />
        </>
      } />
      <Route path="/about" element={
        <>
          <Navbar />
          <About />
          <Footer />
          <ComedyMascot />
        </>
      } />
      <Route path="/contact" element={
        <>
          <Navbar />
          <Contact />
          <Footer />
          <ComedyMascot />
        </>
      } />
      
      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
