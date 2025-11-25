import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import axiosClient from '../utils/axiosClient';
import config from '../config/config';
import { validateEmail, formatErrorMessage } from '../utils/validation';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '', userType: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post('/auth/login', formData);
      const userData = { ...response.data.user, role: formData.userType };
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('userRole', formData.userType);
      
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      setError(formatErrorMessage(error) || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = config.GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-4 px-4 sm:py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-300 shadow-sm">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to your account</p>
          </div>
          
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="relative">
              <HiEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            
            <div>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="">Select User Type</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 sm:py-3 px-4 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
            >
              <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Continue with Google
            </button>

            <div className="text-center">
              <span className="text-gray-600 text-xs sm:text-sm">Don't have an account? </span>
              <Link to="/signup" className="text-black hover:underline text-xs sm:text-sm font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;