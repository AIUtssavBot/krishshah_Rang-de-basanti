import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, RefreshCw, ExternalLink, Clock, Tag } from 'lucide-react';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('today');
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'markets', name: 'Markets' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'economy', name: 'Economy' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' },
    { id: 'crypto', name: 'Cryptocurrency' },
  ];

  // Fetch news data
  const fetchNews = async (isSearch = false) => {
    try {
      setIsLoading(true);
      setError('');

      let url = isSearch && searchQuery
        ? `http://localhost:5000/api/news/search/${encodeURIComponent(searchQuery)}`
        : 'http://localhost:5000/api/news';

      // Add category parameter if not 'all' and not searching
      if (!isSearch && activeCategory !== 'all') {
        url += `?category=${activeCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setNews(data.articles);
      setNextPage(data.nextPage);
    } catch (err) {
      setError(err.message || 'Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial news fetch
  useEffect(() => {
    fetchNews();
  }, [activeCategory]); // Add activeCategory as dependency

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(true);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Clear search when changing categories
  };

  // Get sentiment color
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

  // Get sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial News</h1>
        <button
          onClick={() => fetchNews()}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Search
          </button>
        </form>

        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 gap-6">
        {news.length > 0 ? (
          news.map((article) => (
            <article
              key={article.id}
              className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors duration-200"
            >
              <div className="flex items-start space-x-6">
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-48 h-32 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold mb-2 hover:text-blue-400">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {article.title}
                    </a>
                  </h2>
                  {article.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{article.source}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getSentimentColor(article.sentiment)}`}>
                      {getSentimentIcon(article.sentiment)}
                      <span className="capitalize">{article.sentiment}</span>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Read More</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Loading news...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Search className="h-8 w-8 mb-2" />
                <p>No news articles found</p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      fetchNews();
                    }}
                    className="mt-2 text-blue-400 hover:text-blue-300"
                  >
                    Clear search and try again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage; 