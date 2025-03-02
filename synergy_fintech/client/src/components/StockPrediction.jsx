import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Loader2 } from "lucide-react";

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
                            onClick={fetchStockData}
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
                </CardContent>
            </Card>
        </div>
    );
};

export default StockPrediction; 