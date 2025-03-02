import React, { useState } from 'react';
import { Search, Plus, Trash2, TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react';

const WatchlistPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 182.63,
      change: 1.25,
      changePercent: 0.69,
      recommendation: 'buy'
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 415.32,
      change: -2.18,
      changePercent: -0.52,
      recommendation: 'hold'
    },
    {
      id: '3',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 173.45,
      change: 3.27,
      changePercent: 1.92,
      recommendation: 'buy'
    },
    {
      id: '4',
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 178.12,
      change: -1.43,
      changePercent: -0.80,
      recommendation: 'hold'
    },
    {
      id: '5',
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 248.50,
      change: -5.75,
      changePercent: -2.26,
      recommendation: 'sell'
    }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddStock = () => {
    // This would be replaced with an actual API call to search and add stocks
    alert('This feature would connect to a real stock API in the production version.');
  };

  const handleRemoveStock = (id) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      // Update with slightly different prices to simulate real-time updates
      setStocks(stocks.map(stock => ({
        ...stock,
        price: parseFloat((stock.price + (Math.random() * 2 - 1)).toFixed(2)),
        change: parseFloat((Math.random() * 4 - 2).toFixed(2)),
        changePercent: parseFloat((Math.random() * 2 - 1).toFixed(2))
      })));
      
      setIsRefreshing(false);
    }, 1000);
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

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Watchlist</h1>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 mb-8">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
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
          <button 
            onClick={handleAddStock}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ml-4"
          >
            <Plus className="h-5 w-5" />
            <span>Add Stock</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  AI Recommendation
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {stock.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {stock.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className={`flex items-center justify-end ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRecommendationColor(stock.recommendation)}`}>
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {stock.recommendation}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button 
                        onClick={() => handleRemoveStock(stock.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No stocks found. Add some stocks to your watchlist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-2">Market Sentiment</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="ml-2 text-green-400">Bullish</span>
            </div>
          </div>
          
          <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-2">Top Sector</h3>
            <p className="text-blue-400 font-medium">Technology</p>
            <p className="text-sm text-gray-400">+2.3% this week</p>
          </div>
          
          <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-2">Market Volatility</h3>
            <p className="text-yellow-400 font-medium">Moderate</p>
            <p className="text-sm text-gray-400">VIX: 18.45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage; 