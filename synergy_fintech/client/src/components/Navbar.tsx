import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, MessageSquare, Home, List, LogOut, Bell, Search, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`bg-gray-800 border-b border-gray-700 ${isAuthenticated ? 'ml-20 md:ml-64' : ''} transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {!isAuthenticated && (
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  FinAI Insights
                </span>
              </Link>
            </div>
          )}
          
          <div className="flex-1 flex justify-center">
            {isAuthenticated && (
              <div className="max-w-lg w-full hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for stocks, news, or analysis..."
                    className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <>
                <Link to="/" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/login" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <button className="text-gray-300 hover:text-white">
                  <Bell className="h-5 w-5" />
                </button>
                
                <div className="border-l border-gray-700 h-6 mx-2"></div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden md:block text-sm text-gray-300">
                    {user?.name}
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;