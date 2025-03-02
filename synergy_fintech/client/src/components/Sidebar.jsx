import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  MessageSquare, 
  TrendingUp, 
  List, 
  FileText, 
  Newspaper,
  ChevronLeft,
  ChevronRight,
  LineChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { path: '/stock-prediction', icon: <LineChart size={20} />, label: 'Stock Analysis' },
    { path: '/chatbot', icon: <MessageSquare size={20} />, label: 'AI Assistant' },
    { path: '/news', icon: <Newspaper size={20} />, label: 'Financial News' },
    { path: '/documents', icon: <FileText size={20} />, label: 'Document Analysis' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div 
      className={`h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out bg-gray-900 text-white ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-blue-400" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              FinAI Insights
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-700 text-gray-400"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 