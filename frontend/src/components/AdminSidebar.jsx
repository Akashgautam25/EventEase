import { 
  HiHome, 
  HiCalendarDays, 
  HiPlus, 
  HiClipboardDocumentList, 
  HiUsers, 
  HiCog6Tooth,
  HiXMark
} from 'react-icons/hi2';

const AdminSidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiHome },
    { id: 'events', label: 'Manage Events', icon: HiCalendarDays },
    { id: 'create', label: 'Create Event', icon: HiPlus },
    { id: 'registrations', label: 'Registrations', icon: HiClipboardDocumentList },
    { id: 'users', label: 'Users', icon: HiUsers },
    { id: 'settings', label: 'Settings', icon: HiCog6Tooth }
  ];

  return (
    <>
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
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EventEase</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <HiXMark className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
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
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Badge */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.userType === 'admin' ? 'Admin Panel' : 'User Panel'}</p>
                <p className="text-xs text-gray-500">{user?.userType === 'admin' ? 'Full Access' : 'Limited Access'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;