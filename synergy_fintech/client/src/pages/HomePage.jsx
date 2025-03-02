import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, LineChart, BrainCircuit, Newspaper, Eye } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Smart Stock Analysis & News
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your one-stop platform for real-time market analysis, stock tracking, and financial news.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Go to Dashboard
            </Link>
            <a 
              href="#features" 
              className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access powerful tools for market analysis, stock tracking, and financial news in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Stock Tracking</h3>
            <p className="text-gray-400">
              Monitor your favorite stocks in real-time with advanced charts and technical indicators.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
              <Newspaper className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Financial News</h3>
            <p className="text-gray-400">
              Stay informed with the latest market news, filtered by category and sentiment analysis.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Watchlist</h3>
            <p className="text-gray-400">
              Create and manage your personalized watchlist to track your favorite stocks and markets.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Link to="/dashboard" className="p-6 rounded-lg hover:bg-gray-800/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p className="text-gray-400">View market overview and your watchlist</p>
            </Link>
            <Link to="/news" className="p-6 rounded-lg hover:bg-gray-800/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2">News</h3>
              <p className="text-gray-400">Latest financial news and updates</p>
            </Link>
            <Link to="/watchlist" className="p-6 rounded-lg hover:bg-gray-800/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Watchlist</h3>
              <p className="text-gray-400">Manage your stock watchlist</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 