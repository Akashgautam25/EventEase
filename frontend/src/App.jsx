import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import axiosClient from './utils/axiosClient';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/');
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosClient.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.log('Not authenticated');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Clear session on app start
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
    
    // Uncomment below to enable persistent login
    // checkAuth();
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
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
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