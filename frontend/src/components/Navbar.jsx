import { Link, useNavigate } from 'react-router-dom';
import { HiArrowRightOnRectangle, HiUserPlus } from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-800">
            EventEase
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <span className="hidden sm:block text-gray-600 text-sm truncate max-w-32">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-black transition-colors"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center px-2 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <HiUserPlus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;