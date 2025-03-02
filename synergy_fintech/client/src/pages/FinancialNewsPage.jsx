import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentNews, getMockNews } from '../services/newsService';

const FinancialNewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('today');

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'markets', name: 'Markets' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'economy', name: 'Economy' },
    { id: 'technology', name: 'Technology' },
    { id: 'crypto', name: 'Cryptocurrency' },
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('Fetching news data with category:', selectedCategory);
      
      // Map custom categories to API categories
      let apiCategory = selectedCategory;
      let customQuery = '';
      
      // Handle specific category mappings
      if (selectedCategory === 'all' || selectedCategory === 'markets') {
        apiCategory = 'business';
        customQuery = selectedCategory === 'markets' ? 'finance OR market' : '';
      } else if (selectedCategory === 'stocks') {
        apiCategory = 'business';
        customQuery = 'stock market';
      } else if (selectedCategory === 'economy') {
        apiCategory = 'business';
        customQuery = 'economy';
      } else if (selectedCategory === 'crypto') {
        apiCategory = 'business';
        customQuery = 'cryptocurrency';
      }
      
      const response = await getRecentNews({ 
        days: timeFilter === 'today' ? 1 : 7,
        category: apiCategory,
        q: customQuery
      });
      console.log('API Response:', response);
      
      if (response.status === 'success' && response.data && response.data.length > 0) {
        console.log('Setting news data from API');
        setNews(response.data);
        setIsUsingMockData(false);
        setError(null);
      } else {
        console.log('API returned no results, using mock data');
        // Fallback to mock data if API returns no results
        const mockData = getMockNews();
        setNews(mockData.data);
        setIsUsingMockData(true);
        setError('No news data available from API. Using sample data instead.');
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news. Using sample data instead.');
      // Fallback to mock data on error
      const mockData = getMockNews();
      setNews(mockData.data);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, timeFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  // Filter news based on search query
  const filteredNews = searchQuery 
    ? news.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : news;

  const displayedNews = showAllNews ? filteredNews : filteredNews.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Financial News</h2>
              <p className="text-gray-400 text-sm">AI-curated news and market insights</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <svg 
                className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={`${category.id}-${category.name}`}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 text-sm rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleTimeFilterChange('today')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeFilter === 'today'
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => handleTimeFilterChange('week')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeFilter === 'week'
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {isUsingMockData && !error && (
          <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-blue-400">
              Currently displaying sample news data. To see real-time news, please ensure your API key is correctly set in the backend/.env file.
            </p>
          </div>
        )}
        
        {loading && !refreshing ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-400">Loading news...</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[calc(100vh-350px)] overflow-y-auto">
            {displayedNews.length > 0 ? (
              displayedNews.map((newsItem) => (
                <div key={newsItem.id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-400">{newsItem.source}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-sm text-gray-400">{newsItem.time}</span>
                  </div>
                  
                  <a 
                    href={newsItem.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2">{newsItem.title}</h3>
                  </a>
                  
                  {newsItem.description && (
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {newsItem.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {newsItem.relatedStocks && newsItem.relatedStocks.map((stock, index) => (
                        <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">
                          {stock}
                        </span>
                      ))}
                      {!newsItem.relatedStocks && (
                        <>
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">JPM</span>
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">GS</span>
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">MS</span>
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">BAC</span>
                        </>
                      )}
                    </div>
                    
                    <a 
                      href={newsItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                    >
                      Read Full Article
                      <svg 
                        className="w-4 h-4 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No news articles found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleRefresh}
            className="flex items-center text-blue-400 hover:text-blue-300"
            disabled={refreshing}
          >
            <svg 
              className={`w-5 h-5 mr-1 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAllNews(!showAllNews)}
              className="text-blue-400 hover:text-blue-300"
            >
              {showAllNews ? 'Show Less' : 'Show More'}
            </button>
            
            <Link
              to="/news/archive"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              View Archive
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialNewsPage; 