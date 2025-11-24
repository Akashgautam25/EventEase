import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ user, setUser }) => {
  // Route to appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard user={user} setUser={setUser} />;
  }
  
  return <UserDashboard user={user} setUser={setUser} />;
};

export default Dashboard;