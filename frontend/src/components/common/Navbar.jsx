import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiBriefcase, FiHome, FiFileText } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FiBriefcase className="text-2xl text-primary" />
            <span className="text-xl font-bold text-gray-800">Placement Tracker</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary transition"
            >
              <FiHome />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/drives" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary transition"
            >
              <FiBriefcase />
              <span>Drives</span>
            </Link>
            <Link 
              to="/my-applications" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary transition"
            >
              <FiFileText />
              <span>My Applications</span>
            </Link>
            
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <FiUser className="text-gray-600" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
