import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiCalendarDays, 
  HiUsers, 
  HiArrowRightOnRectangle,
  HiCurrencyDollar,
  HiTicket,
  HiPencil,
  HiTrash,
  HiEye,
  HiBars3,
  HiXMark,
  HiPlus,
  HiChartBarSquare,
  HiUser,
  HiCog6Tooth,
  HiShieldCheck,
  HiClock,
  HiGlobeAlt,
  HiDevicePhoneMobile
} from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';
import CreateEventForm from '../components/CreateEventForm';

const AdminDashboard = ({ user, setUser }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    ticketsSold: 0,
    totalRevenue: 0
  });
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    location: user?.location || ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds to sync analytics
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes, registrationsRes, popularRes] = await Promise.all([
        axiosClient.get('/admin/stats'),
        axiosClient.get('/admin/events'),
        axiosClient.get('/admin/registrations'),
        axiosClient.get('/admin/popular-events')
      ]);
      
      setStats(statsRes.data.stats);
      setEvents(eventsRes.data.events || []);
      setRegistrations(registrationsRes.data.registrations || []);
      setPopularEvents(popularRes.data.events || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axiosClient.delete(`/events/${eventId}`);
        fetchDashboardData(); // Refresh all data
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axiosClient.put(`/admin/users/${userId}/status`, { 
        isActive: !currentStatus 
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await axiosClient.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      console.log('Sending event data:', eventData);
      const response = await axiosClient.post('/events', eventData);
      if (response.data) {
        setShowCreateForm(false);
        alert('Event created successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to create event: ${errorMessage}`);
    }
  };

  const handleEditEvent = async (eventData) => {
    try {
      const response = await axiosClient.put(`/events/${editingEvent.id}`, eventData);
      if (response.data) {
        setEditingEvent(null);
        alert('Event updated successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update event';
      alert(errorMessage);
    }
  };

  const handleViewEvent = (event) => {
    setViewingEvent(event);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.put('/users/profile', profileData);
      if (response.data) {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('selectedRole');
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiHome },
    { id: 'events', label: 'Event Management', icon: HiCalendarDays },
    { id: 'registrations', label: 'Registrations', icon: HiTicket },
    { id: 'analytics', label: 'Analytics', icon: HiChartBarSquare },
    { id: 'profile', label: 'Profile', icon: HiUser }
  ];

  const renderAnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Events</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <HiCalendarDays className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Registered Users</p>
            <p className="text-3xl font-bold text-gray-900">{registrations.length}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <HiUsers className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
            <p className="text-3xl font-bold text-gray-900">{stats.ticketsSold}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <HiTicket className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <HiCurrencyDollar className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventManagement = () => (
    <div className="space-y-6">
      {showCreateForm ? (
        <CreateEventForm 
          onSubmit={handleCreateEvent}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : editingEvent ? (
        <CreateEventForm 
          event={editingEvent}
          onSubmit={handleEditEvent}
          onCancel={() => setEditingEvent(null)}
          isEditing={true}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <HiPlus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <HiCalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p>No events found</p>
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-600">₹{event.price}</td>
                      <td className="px-6 py-4 text-gray-600">{event.availableSeats}/{event.totalSeats}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewEvent(event)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Event"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditClick(event)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit Event"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 text-gray-400 hover:text-gray-800 transition-colors"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderRegistrationsManagement = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Event Registrations</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  <HiTicket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No registrations found</p>
                </td>
              </tr>
            ) : (
              registrations.slice(0, 10).map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{registration.user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{registration.event.title}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(registration.event.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">{registration.ticketCount}</td>
                  <td className="px-6 py-4 text-gray-600">${(registration.event.price * registration.ticketCount).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Calculate category stats
    const categoryStats = events.reduce((acc, event) => {
      const category = event.category || 'Other';
      if (!acc[category]) {
        acc[category] = { events: 0, registrations: 0, revenue: 0 };
      }
      acc[category].events++;
      acc[category].registrations += event.registrations?.length || 0;
      acc[category].revenue += (event.registrations?.length || 0) * (event.price || 0);
      return acc;
    }, {});

    // Top events by registrations
    const topEvents = events
      .map(event => ({
        ...event,
        regCount: event.registrations?.length || 0,
        occupancy: ((event.totalSeats - event.availableSeats) / event.totalSeats * 100).toFixed(1)
      }))
      .sort((a, b) => b.regCount - a.regCount)
      .slice(0, 5);

    return (
      <div className="space-y-6">
        {renderAnalyticsCards()}
        
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(categoryStats).map(([category, data]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{category}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Events:</span>
                    <span className="font-medium">{data.events}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Registrations:</span>
                    <span className="font-medium">{data.registrations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">${data.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Registrations</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{event.title}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{event.category}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{event.regCount}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{event.occupancy}%</td>
                    <td className="px-4 py-2 text-sm text-gray-600">${(event.regCount * event.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">Most Popular Category</h4>
              <p className="text-black text-lg font-semibold mt-1">
                {Object.entries(categoryStats).sort((a, b) => b[1].registrations - a[1].registrations)[0]?.[0] || 'N/A'}
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">Average Event Capacity</h4>
              <p className="text-black text-lg font-semibold mt-1">
                {events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.totalSeats, 0) / events.length) : 0} seats
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">Registration Rate</h4>
              <p className="text-black text-lg font-semibold mt-1">
                {events.length > 0 ? (registrations.length / events.length).toFixed(1) : 0} per event
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">Revenue per Event</h4>
              <p className="text-black text-lg font-semibold mt-1">
                ${events.length > 0 ? (stats.totalRevenue / events.length).toFixed(2) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
            <HiUser className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
            <p className="text-gray-600 text-lg mb-3">{user?.email}</p>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg">
                Administrator
              </span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                {user?.provider === 'credentials' ? 'Email Account' : 'Google Account'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-6 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      {isEditingProfile ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-gray-600 mt-1">Update your personal information</p>
          </div>
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your location"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 bg-white border border-black text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-lg text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <p className="text-lg text-gray-900">Administrator</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
                <p className="text-lg text-gray-900">
                  {user?.provider === 'credentials' ? 'Email/Password' : 'Google OAuth'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Events Created</p>
                  <p className="text-2xl font-bold text-black">{stats.totalEvents}</p>
                </div>
                <HiCalendarDays className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-black">${stats.totalRevenue}</p>
                </div>
                <HiCurrencyDollar className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Registrations</p>
                  <p className="text-2xl font-bold text-black">{registrations.length}</p>
                </div>
                <HiUsers className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {renderAnalyticsCards()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex justify-between items-center">
                      <span className="text-gray-900">{event.title}</span>
                      <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Events</h3>
                <div className="space-y-3">
                  {popularEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex justify-between items-center">
                      <span className="text-gray-900">{event.title}</span>
                      <span className="text-sm text-gray-500">{event.registrationCount} registrations</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'events':
        return renderEventManagement();
      case 'registrations':
        return renderRegistrationsManagement();
      case 'analytics':
        return renderAnalytics();
      case 'profile':
        return renderProfile();
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
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
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
                    ? 'bg-gray-800 text-white' 
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
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                <p className="text-gray-600">Manage events, users, and analytics</p>
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

      {/* Event View Modal */}
      {viewingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
              <button
                onClick={() => setViewingEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Title</h4>
                <p className="text-gray-700">{viewingEvent.title}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{viewingEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                  <p className="text-gray-700">{viewingEvent.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">{viewingEvent.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Date</h4>
                  <p className="text-gray-700">{new Date(viewingEvent.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Time</h4>
                  <p className="text-gray-700">{new Date(viewingEvent.time).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Price</h4>
                  <p className="text-gray-700">${viewingEvent.price}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Total Seats</h4>
                  <p className="text-gray-700">{viewingEvent.totalSeats}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Available Seats</h4>
                  <p className="text-gray-700">{viewingEvent.availableSeats}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Registrations</h4>
                <p className="text-gray-700">{viewingEvent.registrations?.length || 0} people registered</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingEvent(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;