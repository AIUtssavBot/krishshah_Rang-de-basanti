import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, LineChart, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI-Driven Equity Market Analysis
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Harness the power of artificial intelligence to analyze markets, predict trends, and make data-driven investment decisions.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleGetStarted}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
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
          <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with financial expertise to provide you with comprehensive market insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
              <BrainCircuit className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multimodal Financial Analysis</h3>
            <p className="text-gray-400">
              Our AI reads and understands complex financial documents, regulatory filings, and earnings reports to generate accurate summaries.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Market Integration</h3>
            <p className="text-gray-400">
              Continuously aggregates data from financial news, stock price feeds, and economic indicators to capture market sentiment.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
              <LineChart className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Stock Recommendations</h3>
            <p className="text-gray-400">
              Our governing AI model synthesizes insights to generate stock recommendations and trade decisions based on predefined strategies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 