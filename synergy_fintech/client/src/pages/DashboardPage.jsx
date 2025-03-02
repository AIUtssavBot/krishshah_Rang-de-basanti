import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  RefreshCw,
  TrendingDown as Bearish,
  TrendingUp as Bullish,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import StockChart from '../components/StockChart';
import { getStockPrice, getMarketSentiment } from '../services/stockService';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState([]);  // Start with empty array
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [realTimeData, setRealTimeData] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [error, setError] = useState('');

  // Initial stock symbols to track
  const initialStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

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

  // Mock data for market sentiment
  const marketSentimentData = [
    { name: 'Bullish', value: 65, fill: '#4CAF50' },
    { name: 'Neutral', value: 20, fill: '#FFC107' },
    { name: 'Bearish', value: 15, fill: '#F44336' },
  ];

  useEffect(() => {
    // Load initial stocks
    const loadInitialStocks = async () => {
      try {
        const stockPromises = initialStocks.map(async (symbol) => {
          const response = await getStockPrice(symbol);
          return {
            id: symbol,
            symbol: symbol,
            name: response.name || symbol,
            price: response.price,
            change: response.change,
            changePercent: response.percent_change,
            high: response.high,
            low: response.low,
            open: response.open,
            prevClose: response.prev_close,
            currency: response.currency,
            recommendation: 'hold'  // Default recommendation
          };
        });

        const stocksData = await Promise.all(stockPromises);
        setStocks(stocksData);
      } catch (err) {
        setError('Failed to load initial stocks');
        console.error('Error loading initial stocks:', err);
      }
    };

    loadInitialStocks();
  }, []);

  const fetchStockPrices = async () => {
    setIsLoadingPrices(true);
    try {
      const pricePromises = stocks.map(stock => getStockPrice(stock.symbol));
      const prices = await Promise.all(pricePromises);
      
      const newRealTimeData = {};
      stocks.forEach((stock, index) => {
        newRealTimeData[stock.symbol] = prices[index];
      });
      
      setRealTimeData(newRealTimeData);
      updateStockPrices(newRealTimeData);

      // Update selected stock if one is selected
      if (selectedStock) {
        const updatedStock = stocks.find(s => s.id === selectedStock.id);
        if (updatedStock) {
          setSelectedStock(updatedStock);
        }
      }
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      setError('Failed to update prices');
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const updateStockPrices = (newData) => {
    setStocks(stocks.map(stock => {
      const rtData = newData[stock.symbol];
      if (!rtData) return stock;

      return {
        ...stock,
        price: rtData.price,
        change: rtData.change,
        changePercent: rtData.percent_change,
        high: rtData.high,
        low: rtData.low,
        open: rtData.open,
        prevClose: rtData.prev_close,
        currency: rtData.currency,
        name: rtData.name || stock.name
      };
    }));
  };

  const handleAddStock = () => {
    // This would be replaced with an actual API call to search and add stocks
    alert('This feature would connect to a real stock API in the production version.');
  };

  const handleRemoveStock = (id) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStockPrices();
    setIsRefreshing(false);
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'buy':
        return 'text-green-400';
      case 'sell':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
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

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to format price with currency
  const formatPrice = (price, currency = 'USD') => {
    if (typeof price !== 'number' || isNaN(price)) return '---';
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    return `${currencySymbol}${price.toFixed(2)}`;
  };

  // Helper function to format change
  const formatChange = (change, changePercent) => {
    if (typeof change !== 'number' || typeof changePercent !== 'number' || isNaN(change) || isNaN(changePercent)) {
      return { change: '---', percent: '---' };
    }
    return {
      change: change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
      percent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Dashboard</h1>
        <div className="flex space-x-4">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingPrices}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${(isRefreshing || isLoadingPrices) ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
            <button
            onClick={handleAddStock}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            <Plus className="h-5 w-5" />
            <span>Add Stock</span>
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Stock Chart for Selected Stock */}
      {selectedStock && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{selectedStock.name} ({selectedStock.symbol})</h2>
            <div className={`text-lg font-semibold ${(selectedStock.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${formatPrice(selectedStock.price)}
              <span className="ml-2">
                {formatChange(selectedStock.change, selectedStock.changePercent).percent}
              </span>
            </div>
          </div>
          <div className="relative min-h-[400px]">
            <StockChart symbol={selectedStock.symbol} />
          </div>
        </div>
      )}

      {/* Watchlist and Market Sentiment Row */}
      <div className="grid grid-cols-4 gap-6">
        {/* Watchlist Section */}
        <div className="col-span-3 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md flex-1 mr-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                />
              </div>
              {isLoadingPrices && (
                <div className="flex items-center text-gray-400 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Updating prices...
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <table className="w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
                    Symbol
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[25%]">
                    Company
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[25%]">
                    24h Change
                  </th>
                  <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
                    AI Signal
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[5%]">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <tr 
                      key={stock.id} 
                      className={`transition-colors duration-150 hover:bg-gray-750 cursor-pointer ${selectedStock?.id === stock.id ? 'bg-gray-750 border-l-4 border-blue-500' : ''}`}
                      onClick={() => handleStockClick(stock)}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white">
                        {stock.symbol}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300 truncate max-w-[200px]">
                        {stock.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-300">
                        <div className="flex items-center justify-end space-x-1">
                          <span className="tabular-nums">{formatPrice(stock.price, stock.currency)}</span>
                          {isLoadingPrices && <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        <div className={`flex items-center justify-end ${(stock.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(stock.change || 0) >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="tabular-nums">
                            {formatChange(stock.change, stock.changePercent).change}
                            <span className="text-xs ml-1">
                              ({formatChange(stock.change, stock.changePercent).percent})
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRecommendationColor(stock.recommendation)}`}>
                          <BarChart3 className="h-3 w-3 mr-1" />
                          {stock.recommendation}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStock(stock.id);
                          }}
                          className="text-gray-500 hover:text-red-400 transition-colors duration-150"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-gray-400">
                      {searchQuery ? (
                        <div className="flex flex-col items-center">
                          <Search className="h-5 w-5 mb-2" />
                          No stocks found matching "{searchQuery}"
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Plus className="h-5 w-5 mb-2" />
                          Your watchlist is empty. Add some stocks to get started.
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Sentiment Chart */}
        <div className="col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Market Sentiment</h2>
            <div className="flex flex-col space-y-2">
              {marketSentimentData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: entry.fill }}></div>
                  <span className="text-xs text-gray-400">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketSentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
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
        </div>

        {/* Recent News */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
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
    </div>
  );
};

export default DashboardPage; 