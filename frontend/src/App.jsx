import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import axiosClient from './utils/axiosClient';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const hideNavbar = ['/login', '/signup', '/dashboard'].includes(location.pathname) || location.pathname.startsWith('/events/');

  useEffect(() => {
    if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/');
    }
    if (user && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const selectedRole = sessionStorage.getItem('selectedRole');
        const storedUser = sessionStorage.getItem('user');
        
        if (token && selectedRole) {
          // First try to use stored user data
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } else {
            // Fallback to API call if no stored user data
            const response = await axiosClient.get('/auth/me');
            const userData = { ...response.data.user, role: selectedRole };
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.log('Not authenticated');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('selectedRole');
        sessionStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {!hideNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/events/:id" element={<EventDetails user={user} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;