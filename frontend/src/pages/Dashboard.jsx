import { HiHome, HiCalendar, HiUser, HiArrowRightOnRectangle, HiPlus, HiMagnifyingGlass } from 'react-icons/hi2';

const Dashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black">EventEase</h1>
            <nav className="flex space-x-6">
              <button className="flex items-center px-3 py-2 text-black bg-gray-100 rounded-lg">
                <HiHome className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                <HiCalendar className="w-4 h-4 mr-2" />
                Events
              </button>
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                <HiUser className="w-4 h-4 mr-2" />
                Profile
              </button>
            </nav>
          </div>
          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-black transition-colors">
            <HiArrowRightOnRectangle className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">
            Welcome, {user?.name || user?.email}!
          </h2>
          <p className="text-gray-600">Manage your events and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <div className="text-3xl font-bold text-black mb-2">0</div>
            <h3 className="text-lg font-semibold text-black mb-1">Created Events</h3>
            <p className="text-gray-600 text-sm">Events you have organized</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <div className="text-3xl font-bold text-black mb-2">0</div>
            <h3 className="text-lg font-semibold text-black mb-1">Registrations</h3>
            <p className="text-gray-600 text-sm">Events you've joined</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <div className="text-3xl font-bold text-black mb-2">0</div>
            <h3 className="text-lg font-semibold text-black mb-1">Upcoming</h3>
            <p className="text-gray-600 text-sm">Events this week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-black mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <button className="flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <HiPlus className="w-4 h-4 mr-2" />
              Create Event
            </button>
            <button className="flex items-center px-6 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors">
              <HiMagnifyingGlass className="w-4 h-4 mr-2" />
              Browse Events
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <h3 className="text-xl font-semibold text-black mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Name</span>
              <span className="text-black font-medium">{user?.name || 'Not provided'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Email</span>
              <span className="text-black font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Account Type</span>
              <span className="text-black font-medium">
                {user?.provider === 'google' ? 'Google Account' : 'Email Account'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;