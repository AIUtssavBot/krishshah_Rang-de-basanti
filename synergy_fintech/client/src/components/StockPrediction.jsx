import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Loader2, AlertCircle } from "lucide-react";
import StockChart from './StockChart';

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-700 bg-gray-900 text-white shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}>
    {children}
  </h3>
);

const Button = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
  />
);

const StockPrediction = () => {
    const [stockSymbol, setStockSymbol] = useState('');
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState('candle');
    const [showBollingerBands, setShowBollingerBands] = useState(true);
    const [showEMA200, setShowEMA200] = useState(true);
    const [recommendation, setRecommendation] = useState(null);

    const isIndianStock = (symbol) => symbol.toLowerCase().endsWith('.ns');
    const getCurrencySymbol = (symbol) => isIndianStock(symbol) ? '₹' : '$';

    const fetchStockData = async () => {
        if (!stockSymbol) {
            setError('Please enter a stock symbol');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Fetch visualization data
            const response = await fetch(`http://localhost:5000/api/stock/${stockSymbol}/visualization`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Filter out null values from the data
            const cleanData = {
                ...data,
                prices: {
                    close: data.prices.close.map((val, i) => val === null ? undefined : val),
                    ma20: data.prices.ma20.map((val, i) => val === null ? undefined : val),
                    ma50: data.prices.ma50.map((val, i) => val === null ? undefined : val),
                    open: data.prices.open.map((val, i) => val === null ? undefined : val),
                    high: data.prices.high.map((val, i) => val === null ? undefined : val),
                    low: data.prices.low.map((val, i) => val === null ? undefined : val)
                },
                volume: data.volume.map((val, i) => val === null ? undefined : val),
                summary: {
                    ...data.summary,
                    current_price: data.summary.current_price || 0,
                    price_change: data.summary.price_change || 0,
                    price_change_percent: data.summary.price_change_percent || 0,
                    highest_price: data.summary.highest_price || 0,
                    lowest_price: data.summary.lowest_price || 0,
                    average_volume: data.summary.average_volume || 0
                }
            };

            setStockData(cleanData);

            // If the symbol is AAPL, also fetch recommendation data
            if (stockSymbol.toUpperCase() === 'AAPL') {
                const recResponse = await fetch(`http://localhost:5000/api/recommendation/AAPL`);
                const recData = await recResponse.json();
                
                if (!recData.error) {
                    setRecommendation(recData.report);
                }
            } else {
                setRecommendation(null);
            }

        } catch (err) {
            setError(err.message || 'Failed to fetch stock data');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price, symbol) => {
        const currency = isIndianStock(symbol) ? '₹' : '$';
        return `${currency}${price.toFixed(2)}`;
    };

    const getPriceChartData = () => {
        if (!stockData) return [];

        const baseData = [
            // Candlestick or Line chart
            chartType === 'candle' ? {
                x: stockData.dates,
                open: stockData.prices.open,
                high: stockData.prices.high,
                low: stockData.prices.low,
                close: stockData.prices.close,
                type: 'candlestick',
                name: 'Price',
                increasing: { line: { color: '#22c55e' }, fillcolor: '#22c55e33' },
                decreasing: { line: { color: '#ef4444' }, fillcolor: '#ef444433' },
                hovertemplate:
                    `Date: %{x}<br>` +
                    `Open: ${getCurrencySymbol(stockSymbol)}%{open:.2f}<br>` +
                    `High: ${getCurrencySymbol(stockSymbol)}%{high:.2f}<br>` +
                    `Low: ${getCurrencySymbol(stockSymbol)}%{low:.2f}<br>` +
                    `Close: ${getCurrencySymbol(stockSymbol)}%{close:.2f}<br>` +
                    '<extra></extra>'
            } : {
                x: stockData.dates,
                y: stockData.prices.close,
                type: 'scatter',
                mode: 'lines',
                name: 'Price',
                line: { color: '#60a5fa', width: 2 },
                hovertemplate:
                    `Date: %{x}<br>` +
                    `Price: ${getCurrencySymbol(stockSymbol)}%{y:.2f}<br>` +
                    '<extra></extra>'
            },
            // 20-day MA
            {
                x: stockData.dates,
                y: stockData.prices.ma20,
                type: 'scatter',
                mode: 'lines',
                name: '20 MA',
                line: { color: '#fbbf24', width: 1 },
                hovertemplate:
                    `Date: %{x}<br>` +
                    `MA20: ${getCurrencySymbol(stockSymbol)}%{y:.2f}<br>` +
                    '<extra></extra>'
            }
        ];

        // Add EMA 200
        if (showEMA200) {
            baseData.push({
                x: stockData.dates,
                y: stockData.prices.ema200,
                type: 'scatter',
                mode: 'lines',
                name: '200 EMA',
                line: { color: '#c084fc', width: 1 },
                hovertemplate:
                    `Date: %{x}<br>` +
                    `EMA200: ${getCurrencySymbol(stockSymbol)}%{y:.2f}<br>` +
                    '<extra></extra>'
            });
        }

        // Add Bollinger Bands
        if (showBollingerBands) {
            baseData.push(
                {
                    x: stockData.dates,
                    y: stockData.prices.bb_upper,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'BB Upper',
                    line: { color: '#94a3b8', width: 1, dash: 'dash' },
                    hovertemplate:
                        `Date: %{x}<br>` +
                        `Upper Band: ${getCurrencySymbol(stockSymbol)}%{y:.2f}<br>` +
                        '<extra></extra>'
                },
                {
                    x: stockData.dates,
                    y: stockData.prices.bb_lower,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'BB Lower',
                    line: { color: '#94a3b8', width: 1, dash: 'dash' },
                    fill: 'tonexty',
                    fillcolor: 'rgba(148, 163, 184, 0.1)',
                    hovertemplate:
                        `Date: %{x}<br>` +
                        `Lower Band: ${getCurrencySymbol(stockSymbol)}%{y:.2f}<br>` +
                        '<extra></extra>'
                }
            );
        }

        return baseData;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (stockSymbol.trim()) {
            fetchStockData();
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6 bg-gray-900 min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Stock Analysis & Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <Input
                            placeholder="Enter stock symbol (e.g., TATAMOTORS.NS, AAPL)"
                            value={stockSymbol}
                            onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                            className="max-w-xs"
                        />
                        <Button 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analyze
                        </Button>
                    </div>

                    {error && (
                        <div className="text-red-400 mb-4">{error}</div>
                    )}

                    {stockData && (
                        <div className="space-y-6">
                            {/* Chart Controls */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-300">Chart Type:</label>
                                    <select
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value)}
                                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-2 py-1 text-sm"
                                    >
                                        <option value="candle">Candlestick</option>
                                        <option value="line">Line</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={showBollingerBands}
                                            onChange={(e) => setShowBollingerBands(e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">Bollinger Bands</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={showEMA200}
                                            onChange={(e) => setShowEMA200(e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">200 EMA</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Price History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Plot
                                        data={getPriceChartData()}
                                        layout={{
                                            autosize: true,
                                            margin: { l: 50, r: 20, t: 20, b: 30 },
                                            showlegend: true,
                                            legend: { 
                                                orientation: 'h', 
                                                y: -0.2,
                                                bgcolor: 'rgba(17, 24, 39, 0.7)',
                                                font: { color: '#9ca3af' }
                                            },
                                            xaxis: { 
                                                rangeslider: { visible: false },
                                                gridcolor: '#374151',
                                                color: '#9ca3af',
                                                type: 'date',
                                                tickformat: '%Y-%m-%d'
                                            },
                                            yaxis: {
                                                gridcolor: '#374151',
                                                color: '#9ca3af',
                                                title: {
                                                    text: isIndianStock(stockSymbol) ? 'Price (₹)' : 'Price ($)',
                                                    font: { color: '#9ca3af' }
                                                },
                                                tickprefix: getCurrencySymbol(stockSymbol),
                                                tickformat: '.2f'
                                            },
                                            paper_bgcolor: 'rgba(17, 24, 39, 0)',
                                            plot_bgcolor: 'rgba(17, 24, 39, 0)',
                                            font: { color: '#9ca3af' },
                                            hoverlabel: {
                                                bgcolor: '#1f2937',
                                                font: { color: '#ffffff' },
                                                bordercolor: '#374151'
                                            }
                                        }}
                                        useResizeHandler={true}
                                        className="w-full h-[400px]"
                                        config={{
                                            displayModeBar: true,
                                            displaylogo: false,
                                            modeBarButtonsToRemove: [
                                                'lasso2d',
                                                'select2d'
                                            ]
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* MACD Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>MACD</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Plot
                                        data={[
                                            {
                                                x: stockData.dates,
                                                y: stockData.macd.histogram,
                                                type: 'bar',
                                                name: 'Histogram',
                                                marker: {
                                                    color: stockData.macd.histogram.map(h => 
                                                        h >= 0 ? '#22c55e33' : '#ef444433'
                                                    )
                                                }
                                            },
                                            {
                                                x: stockData.dates,
                                                y: stockData.macd.macd,
                                                type: 'scatter',
                                                mode: 'lines',
                                                name: 'MACD',
                                                line: { color: '#60a5fa', width: 1 }
                                            },
                                            {
                                                x: stockData.dates,
                                                y: stockData.macd.signal,
                                                type: 'scatter',
                                                mode: 'lines',
                                                name: 'Signal',
                                                line: { color: '#f87171', width: 1 }
                                            }
                                        ]}
                                        layout={{
                                            autosize: true,
                                            height: 200,
                                            margin: { l: 50, r: 20, t: 20, b: 30 },
                                            showlegend: true,
                                            legend: {
                                                orientation: 'h',
                                                y: -0.2,
                                                bgcolor: 'rgba(17, 24, 39, 0.7)',
                                                font: { color: '#9ca3af' }
                                            },
                                            xaxis: {
                                                gridcolor: '#374151',
                                                color: '#9ca3af'
                                            },
                                            yaxis: {
                                                gridcolor: '#374151',
                                                color: '#9ca3af'
                                            },
                                            paper_bgcolor: 'rgba(17, 24, 39, 0)',
                                            plot_bgcolor: 'rgba(17, 24, 39, 0)',
                                            font: { color: '#9ca3af' }
                                        }}
                                        useResizeHandler={true}
                                        className="w-full"
                                    />
                                </CardContent>
                            </Card>

                            {/* Volume Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trading Volume</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Plot
                                        data={[
                                            {
                                                x: stockData.dates,
                                                y: stockData.volume,
                                                type: 'bar',
                                                name: 'Volume',
                                                marker: { color: '#3b82f6' }
                                            }
                                        ]}
                                        layout={{
                                            autosize: true,
                                            margin: { l: 50, r: 20, t: 20, b: 30 },
                                            showlegend: false,
                                            xaxis: { 
                                                gridcolor: '#374151',
                                                color: '#9ca3af'
                                            },
                                            yaxis: {
                                                gridcolor: '#374151',
                                                color: '#9ca3af'
                                            },
                                            paper_bgcolor: 'rgba(17, 24, 39, 0)',
                                            plot_bgcolor: 'rgba(17, 24, 39, 0)',
                                            font: { color: '#9ca3af' }
                                        }}
                                        useResizeHandler={true}
                                        className="w-full h-[200px]"
                                    />
                                </CardContent>
                            </Card>

                            {/* Summary Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Current Price</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-white">
                                            {formatPrice(stockData.summary.current_price, stockSymbol)}
                                        </div>
                                        <div className={`text-sm ${stockData.summary.price_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stockData.summary.price_change_percent.toFixed(2)}%
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Price Range</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-300">
                                                High: {formatPrice(stockData.summary.highest_price, stockSymbol)}
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                Low: {formatPrice(stockData.summary.lowest_price, stockSymbol)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Average Volume</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl text-gray-300">
                                            {(stockData.summary.average_volume / 1000000).toFixed(2)}M
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {recommendation && (
                        <div className="space-y-6">
                            {/* Main Recommendation */}
                            <div className="p-6 bg-blue-900/20 border border-blue-700 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3 text-blue-300">Recommendation</h3>
                                <p className="text-gray-200">{recommendation.recommendation}</p>
                            </div>

                            {/* Market Sentiment Chart - Updated with NASDAQ Data */}
                            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h3 className="text-xl font-semibold mb-6">NASDAQ Market Sentiment 2024</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Analyst Predictions */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-300">Major Bank Forecasts</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-green-400">Bullish</span>
                                                <div className="flex-1 mx-4">
                                                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500" style={{ width: '65%' }} />
                                                    </div>
                                                </div>
                                                <span>65%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-yellow-400">Neutral</span>
                                                <div className="flex-1 mx-4">
                                                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-500" style={{ width: '25%' }} />
                                                    </div>
                                                </div>
                                                <span>25%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-red-400">Bearish</span>
                                                <div className="flex-1 mx-4">
                                                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-red-500" style={{ width: '10%' }} />
                                                    </div>
                                                </div>
                                                <span>10%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Targets */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-300">2024 Price Targets</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400">High Target</span>
                                                <span className="text-green-400">18,500</span>
                                            </div>
                                            <div className="relative h-2 bg-gray-700 rounded-full">
                                                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style={{ width: '100%' }} />
                                                <div className="absolute w-2 h-4 bg-white rounded-full -top-1" style={{ left: '60%' }} />
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400">Low Target</span>
                                                <span className="text-red-400">14,000</span>
                                            </div>
                                            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="text-sm text-gray-400">Support Level</div>
                                                        <div className="text-lg font-semibold text-blue-400">17,000</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-400">Expected Growth</div>
                                                        <div className="text-lg font-semibold text-green-400">+10-19%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Key Insights */}
                                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                                    <h4 className="text-lg font-medium text-blue-300 mb-3">Key Market Insights</h4>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Major banks including Bank of America and Deutsche Bank maintain bullish outlook</li>
                                        <li>• 17,000 identified as key support level for continued bull market</li>
                                        <li>• Tech sector showing resilience despite recent corrections</li>
                                        <li>• AI remains a significant growth driver for 2024</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Financial Indicators */}
                            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">Key Financial Indicators</h3>
                                <div className="prose prose-invert max-w-none">
                                    {recommendation.financial_indicators.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>

                            {/* News Insights */}
                            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">News Insights</h3>
                                <div className="prose prose-invert max-w-none">
                                    {recommendation.news_insights.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Comparative Analysis */}
                            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3">Comparative Analysis</h3>
                                <div className="prose prose-invert max-w-none">
                                    {recommendation.comparative_analysis.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="p-6 bg-green-900/20 border border-green-700 rounded-lg">
                                <h3 className="text-xl font-semibold mb-3 text-green-300">Conclusion</h3>
                                <div className="prose prose-invert max-w-none">
                                    {recommendation.conclusion.split('\n').map((line, index) => (
                                        <p key={index} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {stockSymbol && <StockChart symbol={stockSymbol} />}
                </CardContent>
            </Card>
        </div>
    );
};

export default StockPrediction; 