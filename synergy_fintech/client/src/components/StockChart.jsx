import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const StockChart = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('candle');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/stock/${symbol}/visualization`);
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  if (isLoading) {
    return <div className="text-center py-4 text-gray-300">Loading chart...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-4">{error}</div>;
  }

  if (!data) {
    return null;
  }

  const isIndianStock = symbol.toLowerCase().endsWith('.ns');
  const getCurrencySymbol = () => isIndianStock ? '₹' : '$';

  const chartData = [
    // Candlestick or Line chart based on chartType
    chartType === 'candle' ? {
      x: data.dates,
      open: data.prices.open,
      high: data.prices.high,
      low: data.prices.low,
      close: data.prices.close,
      type: 'candlestick',
      name: 'Price',
      increasing: { line: { color: '#22c55e' }, fillcolor: '#22c55e33' },
      decreasing: { line: { color: '#ef4444' }, fillcolor: '#ef444433' },
      hovertemplate:
        `Date: %{x}<br>` +
        `Open: ${getCurrencySymbol()}%{open:.2f}<br>` +
        `High: ${getCurrencySymbol()}%{high:.2f}<br>` +
        `Low: ${getCurrencySymbol()}%{low:.2f}<br>` +
        `Close: ${getCurrencySymbol()}%{close:.2f}<br>` +
        '<extra></extra>'
    } : {
      x: data.dates,
      y: data.prices.close,
      type: 'scatter',
      mode: 'lines',
      name: 'Price',
      line: { color: '#60a5fa', width: 2 },
      hovertemplate:
        `Date: %{x}<br>` +
        `Price: ${getCurrencySymbol()}%{y:.2f}<br>` +
        '<extra></extra>'
    },
    // 20-day MA
    {
      x: data.dates,
      y: data.prices.ma20,
      type: 'scatter',
      mode: 'lines',
      name: '20-day MA',
      line: { color: '#fbbf24', width: 1.5 },
      hovertemplate:
        `Date: %{x}<br>` +
        `MA20: ${getCurrencySymbol()}%{y:.2f}<br>` +
        '<extra></extra>'
    }
  ];

  const layout = {
    dragmode: 'zoom',
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      orientation: 'h',
      yanchor: 'bottom',
      font: { color: '#9ca3af' }
    },
    margin: { l: 60, r: 10, t: 40, b: 40 },
    xaxis: {
      rangeslider: { visible: false },
      type: 'date',
      gridcolor: '#1f2937',
      linecolor: '#374151',
      title: { text: 'Date', standoff: 10 },
      color: '#9ca3af'
    },
    yaxis: {
      gridcolor: '#1f2937',
      linecolor: '#374151',
      title: { text: `Price (${getCurrencySymbol()})`, standoff: 10 },
      color: '#9ca3af',
      tickformat: '.2f'
    },
    plot_bgcolor: '#111827',
    paper_bgcolor: '#111827',
    hovermode: 'x unified'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
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
      </div>
      <Plot
        data={chartData}
        layout={layout}
        config={{
          displayModeBar: 'hover',
          displaylogo: false,
          modeBarButtonsToRemove: [
            'select2d',
            'lasso2d',
            'autoScale2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian'
          ]
        }}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default StockChart; 