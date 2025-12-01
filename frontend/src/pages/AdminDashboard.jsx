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
  HiChartBarSquare
} from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';
import CreateEventForm from '../components/CreateEventForm';
import AnalyticsChart from '../components/AnalyticsChart';

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

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('selectedRole');
    setUser(null);
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiHome },
    { id: 'events', label: 'Event Management', icon: HiCalendarDays },
    { id: 'registrations', label: 'Registrations', icon: HiTicket },
    { id: 'analytics', label: 'Analytics', icon: HiChartBarSquare }
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
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
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
            <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p>
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
                      <td className="px-6 py-4 text-gray-600">${event.price}</td>
                      <td className="px-6 py-4 text-gray-600">{event.availableSeats}/{event.totalSeats}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      {renderAnalyticsCards()}
      <AnalyticsChart stats={stats} />
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
    </div>
  );
};

export default AdminDashboard;