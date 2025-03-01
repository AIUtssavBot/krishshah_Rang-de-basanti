import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('today');

  // Mock categories
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'markets', name: 'Markets' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'economy', name: 'Economy' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' },
    { id: 'crypto', name: 'Cryptocurrency' },
  ];

  // Mock news data
  const newsData = [
    {
      id: 1,
      title: 'Federal Reserve Signals Potential Rate Cut in Coming Months',
      summary: 'Federal Reserve officials indicated they could begin cutting interest rates in the coming months if inflation continues to cool, according to minutes from their latest meeting.',
      source: 'Financial Times',
      author: 'James Wilson',
      date: '2 hours ago',
      category: 'economy',
      sentiment: 'positive',
      relevance: 95,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['JPM', 'GS', 'MS', 'BAC'],
    },
    {
      id: 2,
      title: 'Tech Stocks Rally on Strong Earnings Reports',
      summary: 'Major technology companies posted better-than-expected quarterly results, driving a broad rally in tech stocks. Analysts point to AI investments as a key growth driver.',
      source: 'Wall Street Journal',
      author: 'Sarah Chen',
      date: '4 hours ago',
      category: 'stocks',
      sentiment: 'positive',
      relevance: 90,
      image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
    },
    {
      id: 3,
      title: 'Oil Prices Drop Amid Supply Concerns',
      summary: 'Crude oil prices fell sharply as OPEC+ members consider increasing production quotas. The potential for increased supply comes as demand forecasts remain uncertain.',
      source: 'Bloomberg',
      author: 'Michael Roberts',
      date: '6 hours ago',
      category: 'markets',
      sentiment: 'negative',
      relevance: 85,
      image: 'https://images.unsplash.com/photo-1582182300890-32b9ad6f6f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['XOM', 'CVX', 'BP', 'COP'],
    },
    {
      id: 4,
      title: 'Retail Sales Data Shows Mixed Consumer Spending',
      summary: 'Latest retail sales figures indicate uneven consumer spending patterns, with strength in services but weakness in goods. Economists debate implications for broader economic growth.',
      source: 'CNBC',
      author: 'Lisa Johnson',
      date: '8 hours ago',
      category: 'economy',
      sentiment: 'neutral',
      relevance: 80,
      image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['WMT', 'TGT', 'AMZN', 'HD'],
    },
    {
      id: 5,
      title: 'Cryptocurrency Market Sees Renewed Institutional Interest',
      summary: 'Several major financial institutions announced new cryptocurrency investment products, signaling growing mainstream acceptance despite regulatory uncertainties.',
      source: 'CoinDesk',
      author: 'Alex Thompson',
      date: '10 hours ago',
      category: 'crypto',
      sentiment: 'positive',
      relevance: 75,
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['COIN', 'SQ', 'PYPL', 'MSTR'],
    },
    {
      id: 6,
      title: 'AI Chip Demand Continues to Outpace Supply',
      summary: 'Leading semiconductor manufacturers report continued strong demand for AI-capable chips, with supply constraints expected to persist through the end of the year.',
      source: 'TechCrunch',
      author: 'David Kim',
      date: '12 hours ago',
      category: 'technology',
      sentiment: 'positive',
      relevance: 88,
      image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['NVDA', 'AMD', 'INTC', 'TSM'],
    },
    {
      id: 7,
      title: 'Global Supply Chain Pressures Ease, Logistics Costs Decline',
      summary: 'Recent data shows significant improvement in global supply chain operations, with shipping costs and delivery times returning to near pre-pandemic levels.',
      source: 'Reuters',
      author: 'Emma Garcia',
      date: '14 hours ago',
      category: 'business',
      sentiment: 'positive',
      relevance: 82,
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['FDX', 'UPS', 'MAERSK.B', 'ZIM'],
    },
    {
      id: 8,
      title: 'Healthcare Stocks Under Pressure as Drug Price Negotiations Begin',
      summary: 'Pharmaceutical companies face uncertainty as government price negotiations for prescription drugs get underway. Analysts debate long-term impact on the sector.',
      source: 'Barron\'s',
      author: 'Robert Chen',
      date: '16 hours ago',
      category: 'stocks',
      sentiment: 'negative',
      relevance: 78,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#',
      relatedStocks: ['PFE', 'JNJ', 'MRK', 'ABBV'],
    },
  ];

  // Filter news based on active category and search query
  const filteredNews = newsData.filter((news) => {
    const matchesCategory = activeCategory === 'all' || news.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger an API call
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial News</h1>
          <p className="text-gray-400">
            AI-curated news and market insights
          </p>
        </div>
        <div className="w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search news..."
              className="bg-gray-700 block w-full pl-4 pr-3 py-2 border border-gray-600 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Categories and Timeframe */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-md whitespace-nowrap mr-2 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="flex">
          {['today', 'week', 'month'].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 capitalize ${
                timeframe === option
                  ? 'text-blue-400 font-medium'
                  : 'text-gray-400'
              }`}
              onClick={() => setTimeframe(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Featured News */}
      {filteredNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={filteredNews[0].image}
                  alt={filteredNews[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(filteredNews[0].sentiment)} mr-2`}></div>
                  <span className="text-sm text-gray-400">{filteredNews[0].source}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm text-gray-400">{filteredNews[0].date}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{filteredNews[0].title}</h2>
                <p className="text-gray-300 mb-4">{filteredNews[0].summary}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-300">Related Stocks: </span>
                  {filteredNews[0].relatedStocks.map((stock) => (
                    <span
                      key={stock}
                      className="inline-block bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm mr-2 mb-2"
                    >
                      {stock}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>By {filteredNews[0].author}</span>
                  <span className="mx-2">•</span>
                  <span>Relevance: {filteredNews[0].relevance}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* News Grid */}
          {filteredNews.slice(1).map((news) => (
            <div key={news.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(news.sentiment)} mr-2`}></div>
                  <span className="text-sm text-gray-400">{news.source}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm text-gray-400">{news.date}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{news.summary}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-300">Related Stocks: </span>
                  {news.relatedStocks.map((stock) => (
                    <span
                      key={stock}
                      className="inline-block bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm mr-2 mb-2"
                    >
                      {stock}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>By {news.author}</span>
                  <span className="mx-2">•</span>
                  <span>Relevance: {news.relevance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage; 