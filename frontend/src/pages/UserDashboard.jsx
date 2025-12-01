import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiTicket, 
  HiUser, 
  HiArrowRightOnRectangle,
  HiCalendarDays,
  HiClock,
  HiCurrencyDollar,
  HiEye,
  HiBars3,
  HiXMark
} from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';

const UserDashboard = ({ user, setUser }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    location: user?.location || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsRes, registrationsRes] = await Promise.all([
        axiosClient.get('/events'),
        axiosClient.get(`/registrations/${user.id}`)
      ]);
      
      const allEvents = Array.isArray(eventsRes.data) ? eventsRes.data : eventsRes.data.events || [];
      setUpcomingEvents(allEvents);
      setBookingHistory(registrationsRes.data || []);
      setRecommendedEvents(allEvents.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async () => {
    try {
      const response = await axiosClient.post(`/events/${selectedEvent.id}/register`, {
        ticketCount: ticketCount
      });
      
      if (response.data) {
        alert('Event registered successfully!');
        setShowBookingModal(false);
        setSelectedEvent(null);
        setTicketCount(1);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register for event';
      alert(errorMessage);
    }
  };

  const openBookingModal = (event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('selectedRole');
    setUser(null);
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiHome },
    { id: 'events', label: 'Browse Events', icon: HiCalendarDays },
    { id: 'bookings', label: 'My Bookings', icon: HiTicket },
    { id: 'profile', label: 'Profile', icon: HiUser }
  ];

  const renderUpcomingEvents = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HiCalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No upcoming events available</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {upcomingEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <HiCalendarDays className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <HiCurrencyDollar className="w-4 h-4 mr-1" />
                      ${event.price}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openBookingModal(event)}
                    className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <HiTicket className="w-4 h-4 mr-2" />
                    Book Now
                  </button>
                  <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <HiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBookingHistory = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : bookingHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  <HiTicket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No bookings found</p>
                </td>
              </tr>
            ) : (
              bookingHistory.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.event?.title || 'Event'}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(booking.event?.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.ticketCount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-black text-white">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRecommendedEvents = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recommended Events</h3>
      </div>
      <div className="p-6">
        {recommendedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recommendations available</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{event.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openBookingModal(event)}
                    className="px-3 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Book
                  </button>
                  <button className="px-3 py-1 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderUpcomingEvents()}
              {renderRecommendedEvents()}
            </div>
            {renderBookingHistory()}
          </div>
        );
      case 'events':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Events</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiCalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No events available</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                          <p className="text-gray-600 mt-2">{event.description}</p>
                          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <HiCalendarDays className="w-4 h-4 mr-1" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <HiClock className="w-4 h-4 mr-1" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <HiCurrencyDollar className="w-4 h-4 mr-1" />
                              ${event.price}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => openBookingModal(event)}
                          className="ml-4 flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <HiTicket className="w-4 h-4 mr-2" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'bookings':
        return renderBookingHistory();
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium">
                      {user?.role === 'admin' ? 'Administrator' : 'Event Enthusiast'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Full Name</span>
                    <span className="text-gray-900">{profileData.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Email Address</span>
                    <span className="text-gray-900">{profileData.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Phone Number</span>
                    <span className="text-gray-900">{profileData.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Date of Birth</span>
                    <span className="text-gray-900">{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600 font-medium">Location</span>
                    <span className="text-gray-900">{profileData.location || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">User ID</span>
                    <span className="text-gray-900 font-mono text-sm">{user?.id || '#USER001'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Account Type</span>
                    <span className="px-2 py-1 bg-gray-800 text-white rounded-full text-sm font-medium">
                      {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Member Since</span>
                    <span className="text-gray-900">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600 font-medium">Last Login</span>
                    <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowEditProfile(true)}
                className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setShowChangePassword(true)}
                className="flex-1 bg-white border border-black text-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Change Password
              </button>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfile && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={() => {
                        // Here you would typically make an API call to update the profile
                        setUser({...user, ...profileData});
                        setShowEditProfile(false);
                      }}
                      className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowEditProfile(false)}
                      className="flex-1 bg-white border border-black text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={() => {
                        if (passwordData.newPassword === passwordData.confirmPassword) {
                          // Here you would typically make an API call to change password
                          alert('Password changed successfully!');
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setShowChangePassword(false);
                        } else {
                          alert('New passwords do not match!');
                        }
                      }}
                      className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setShowChangePassword(false);
                      }}
                      className="flex-1 bg-white border border-black text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedEvent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Book Event</h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(selectedEvent.date).toLocaleDateString()} • ${selectedEvent.price}
                      </p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Tickets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedEvent.availableSeats || 10}
                        value={ticketCount}
                        onChange={(e) => setTicketCount(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Price per ticket:</span>
                        <span>${selectedEvent.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantity:</span>
                        <span>{ticketCount}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span>${(selectedEvent.price * ticketCount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={handleBookEvent}
                      className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedEvent(null);
                        setTicketCount(1);
                      }}
                      className="flex-1 bg-white border border-black text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">EventEase</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <HiXMark className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <HiBars3 className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h2>
                <p className="text-gray-600">Manage your event bookings and discover new events</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;