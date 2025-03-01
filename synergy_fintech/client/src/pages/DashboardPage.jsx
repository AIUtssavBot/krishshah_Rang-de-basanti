import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState('1W');

  // Mock data for market performance
  const marketPerformanceData = [
    { date: '2023-02-01', value: 1500 },
    { date: '2023-02-02', value: 1520 },
    { date: '2023-02-03', value: 1480 },
    { date: '2023-02-04', value: 1510 },
    { date: '2023-02-05', value: 1540 },
    { date: '2023-02-06', value: 1580 },
    { date: '2023-02-07', value: 1620 },
  ];

  // Mock data for sector performance
  const sectorPerformanceData = [
    { name: 'Technology', value: 35, fill: '#0088FE' },
    { name: 'Healthcare', value: 20, fill: '#00C49F' },
    { name: 'Finance', value: 15, fill: '#FFBB28' },
    { name: 'Consumer', value: 10, fill: '#FF8042' },
    { name: 'Energy', value: 10, fill: '#8884d8' },
    { name: 'Other', value: 10, fill: '#82ca9d' },
  ];

  // Mock data for market sentiment
  const marketSentimentData = [
    { name: 'Bullish', value: 65, fill: '#4CAF50' },
    { name: 'Neutral', value: 20, fill: '#FFC107' },
    { name: 'Bearish', value: 15, fill: '#F44336' },
  ];

  // Mock data for recent news
  const recentNewsData = [
    {
      id: 1,
      title: 'Fed signals potential rate cuts in coming months',
      source: 'Financial Times',
      time: '2 hours ago',
      sentiment: 'positive',
    },
    {
      id: 2,
      title: 'Tech stocks rally on strong earnings reports',
      source: 'Wall Street Journal',
      time: '4 hours ago',
      sentiment: 'positive',
    },
    {
      id: 3,
      title: 'Oil prices drop amid supply concerns',
      source: 'Bloomberg',
      time: '6 hours ago',
      sentiment: 'negative',
    },
  ];

  // Mock data for top recommendations
  const topRecommendationsData = [
    {
      id: 1,
      ticker: 'AAPL',
      name: 'Apple Inc.',
      price: 182.63,
      change: 1.25,
      recommendation: 'Buy',
      confidence: 85,
    },
    {
      id: 2,
      ticker: 'MSFT',
      name: 'Microsoft Corp.',
      price: 337.50,
      change: 2.75,
      recommendation: 'Buy',
      confidence: 82,
    },
    {
      id: 3,
      ticker: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.21,
      change: -0.45,
      recommendation: 'Hold',
      confidence: 70,
    },
    {
      id: 4,
      ticker: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 145.68,
      change: 1.85,
      recommendation: 'Buy',
      confidence: 78,
    },
    {
      id: 5,
      ticker: 'TSLA',
      name: 'Tesla Inc.',
      price: 215.35,
      change: -3.20,
      recommendation: 'Sell',
      confidence: 65,
    },
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Buy':
        return 'bg-green-100 text-green-800';
      case 'Sell':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Dashboard</h1>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-md text-sm ${
                timeframe === period 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setTimeframe(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Performance */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Market Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketPerformanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#374151',
                    color: '#f9fafb'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Market Sentiment</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketSentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {marketSentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#374151',
                    color: '#f9fafb'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Sector Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorPerformanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sectorPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#374151',
                    color: '#f9fafb'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent News</h2>
          <div className="space-y-4">
            {recentNewsData.map((news) => (
              <div key={news.id} className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="font-medium">{news.title}</h3>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <span>{news.source}</span>
                    <span className="mx-2">•</span>
                    <span>{news.time}</span>
                    <span className="mx-2">•</span>
                    <span className={getSentimentColor(news.sentiment)}>
                      {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Top Recommendations</h2>
          <div className="space-y-4">
            {topRecommendationsData.map((stock) => (
              <div key={stock.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{stock.ticker}</div>
                  <div className="text-sm text-gray-400">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stock.price}</div>
                  <div className={`text-sm ${getChangeColor(stock.change)}`}>
                    {stock.change > 0 ? '+' : ''}{stock.change}%
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(stock.recommendation)}`}>
                    {stock.recommendation}
                  </span>
                  <div className="mt-1 h-1 w-16 bg-gray-700 rounded-full">
                    <div 
                      className={`h-1 rounded-full ${getConfidenceColor(stock.confidence)}`}
                      style={{ width: `${stock.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 