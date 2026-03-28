import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-campus-blue text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <BookOpen className="w-6 h-6 text-campus-accent" />
          <span>Campus Connect</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/items" className="hover:text-campus-accent transition-colors">Browse Items</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-campus-accent transition-colors">Dashboard</Link>
              <Link to="/add-item" className="bg-campus-accent text-campus-dark px-3 py-1.5 rounded hover:bg-white transition-colors">
                Report Item
              </Link>
              <div className="flex items-center space-x-4 border-l border-blue-400 pl-4">
                <span className="flex items-center text-sm font-medium">
                  <User className="w-4 h-4 mr-1" /> {user.name}
                </span>
                <button onClick={handleLogout} className="flex items-center text-sm hover:text-red-300 transition-colors">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-campus-accent transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-campus-blue px-4 py-1.5 rounded font-medium hover:bg-campus-accent transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
