from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import finnhub
import os
from dotenv import load_dotenv
import math
import logging
import json
from pathlib import Path
import requests

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Finnhub client
api_key = os.getenv('FINNHUB_API_KEY')
if api_key and api_key != 'your_finnhub_api_key_here':
    try:
        finnhub_client = finnhub.Client(api_key=api_key)
        logger.info("Finnhub client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Finnhub client: {str(e)}")
        finnhub_client = None
else:
    logger.warning("No valid Finnhub API key found, will use Yahoo Finance as fallback")
    finnhub_client = None

# Create data directory if it doesn't exist
data_dir = Path('data')
data_dir.mkdir(exist_ok=True)
watchlist_file = data_dir / 'watchlist.json'

# API Keys
NEWS_API_KEY = 'pub_725842aabc8390c651c3a579f690a72d2d6ef'

def load_watchlist():
    """Load watchlist from file"""
    try:
        if watchlist_file.exists():
            with open(watchlist_file, 'r') as f:
                return json.load(f)
        return []
    except Exception as e:
        logger.error(f"Error loading watchlist: {str(e)}")
        return []

def save_watchlist(watchlist):
    """Save watchlist to file"""
    try:
        with open(watchlist_file, 'w') as f:
            json.dump(watchlist, f)
    except Exception as e:
        logger.error(f"Error saving watchlist: {str(e)}")

def get_stock_data_from_yahoo(symbol):
    """Fallback function to get stock data from Yahoo Finance"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Get the latest price data
        hist = ticker.history(period='1d')
        if hist.empty:
            raise ValueError(f"No price data found for {symbol}")
            
        current_price = hist['Close'].iloc[-1]
        prev_close = info.get('previousClose', hist['Close'].iloc[-2] if len(hist) > 1 else current_price)
        
        change = current_price - prev_close
        percent_change = (change / prev_close * 100) if prev_close != 0 else 0
        
        return {
            "symbol": symbol,
            "price": current_price,
            "change": change,
            "percent_change": percent_change,
            "high": hist['High'].iloc[-1],
            "low": hist['Low'].iloc[-1],
            "open": hist['Open'].iloc[-1],
            "prev_close": prev_close,
            "currency": "INR" if symbol.upper().endswith('.NS') else "USD",
            "name": info.get('longName', symbol)
        }
    except Exception as e:
        logger.error(f"Yahoo Finance error for {symbol}: {str(e)}")
        raise

@app.route('/api/test')
def test():
    return jsonify({"message": "Server is running successfully!"})

@app.route('/api/stock/<symbol>/price', methods=['GET'])
def get_stock_price(symbol):
    try:
        logger.info(f"Fetching price data for symbol: {symbol}")
        
        # If no Finnhub client, use Yahoo Finance
        if not finnhub_client:
            logger.info(f"Using Yahoo Finance for {symbol}")
            data = get_stock_data_from_yahoo(symbol)
            return jsonify(data)

        # Clean up the symbol (remove .NS suffix for Indian stocks temporarily)
        base_symbol = symbol.upper().split('.')[0]
        is_indian = symbol.upper().endswith('.NS')
        
        try:
            # Get real-time quote from Finnhub
            logger.debug(f"Requesting Finnhub quote for {base_symbol}")
            quote = finnhub_client.quote(base_symbol)
            
            if not quote or 'c' not in quote:
                logger.warning(f"Invalid quote data from Finnhub for {symbol}, falling back to Yahoo Finance")
                return jsonify(get_stock_data_from_yahoo(symbol))
            
            try:
                # Get company profile for additional info
                logger.debug(f"Requesting Finnhub company profile for {base_symbol}")
                profile = finnhub_client.company_profile2(symbol=base_symbol)
            except Exception as profile_error:
                logger.warning(f"Could not fetch company profile for {symbol}: {str(profile_error)}")
                profile = {}
            
            # Prepare the response
            response = {
                "symbol": symbol,
                "price": quote['c'],  # Current price
                "change": quote['d'],  # Change
                "percent_change": quote['dp'],  # Percent change
                "high": quote['h'],  # High price of the day
                "low": quote['l'],  # Low price of the day
                "open": quote['o'],  # Open price of the day
                "prev_close": quote['pc'],  # Previous close price
                "currency": "INR" if is_indian else profile.get('currency', 'USD'),
                "name": profile.get('name', symbol)
            }
            
            # Validate the response data
            for key, value in response.items():
                if key in ['price', 'change', 'percent_change', 'high', 'low', 'open', 'prev_close']:
                    if value is None or (isinstance(value, (int, float)) and (value == 0 or math.isnan(value))):
                        logger.warning(f"Invalid {key} value for {symbol}: {value}")
                        response[key] = 0
            
            logger.info(f"Successfully fetched data for {symbol}")
            return jsonify(response)
            
        except Exception as api_error:
            logger.error(f"Finnhub API error for {symbol}: {str(api_error)}")
            logger.info("Falling back to Yahoo Finance")
            return jsonify(get_stock_data_from_yahoo(symbol))
            
    except Exception as e:
        error_msg = f"Server error processing {symbol}: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/stock/<symbol>/historical', methods=['GET'])
def get_historical_data(symbol):
    try:
        logger.info(f"Fetching historical data for symbol: {symbol}")
        
        # Get historical data using yfinance
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        stock = yf.Ticker(symbol)
        hist = stock.history(start=start_date, end=end_date)
        
        if hist.empty:
            error_msg = f"No historical data found for symbol: {symbol}"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 404
        
        # Convert the data to a format suitable for charts
        data = []
        for index, row in hist.iterrows():
            entry = {
                'date': index.strftime('%Y-%m-%d'),
                'open': float(row['Open']) if not pd.isna(row['Open']) else None,
                'high': float(row['High']) if not pd.isna(row['High']) else None,
                'low': float(row['Low']) if not pd.isna(row['Low']) else None,
                'close': float(row['Close']) if not pd.isna(row['Close']) else None,
                'volume': int(row['Volume']) if not pd.isna(row['Volume']) else 0
            }
            data.append(entry)
        
        logger.info(f"Successfully fetched historical data for {symbol}")
        return jsonify(data)
    except Exception as e:
        error_msg = f"Error fetching historical data for {symbol}: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/stock/<symbol>/company', methods=['GET'])
def get_company_info(symbol):
    try:
        logger.info(f"Fetching company info for symbol: {symbol}")
        
        if not finnhub_client:
            error_msg = "Finnhub client not initialized"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 503
            
        # Get company profile
        profile = finnhub_client.company_profile2(symbol=symbol)
        
        if not profile:
            error_msg = f"No company information found for symbol: {symbol}"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 404
            
        logger.info(f"Successfully fetched company info for {symbol}")
        return jsonify(profile)
    except Exception as e:
        error_msg = f"Error fetching company info for {symbol}: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/market/sentiment', methods=['GET'])
def get_market_sentiment():
    try:
        logger.info("Fetching market sentiment data")
        
        if not finnhub_client:
            error_msg = "Finnhub client not initialized"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 503
        
        # Get market sentiment for major indices
        indices = ['SPY', 'QQQ', 'DIA']
        sentiment_data = {}
        
        for index in indices:
            try:
                logger.debug(f"Fetching news for index: {index}")
                news = finnhub_client.company_news(
                    index, 
                    _from=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
                    to=datetime.now().strftime('%Y-%m-%d')
                )
                
                if news:
                    # Process news sentiment
                    sentiment_data[index] = {
                        'bullish': len([n for n in news if n.get('sentiment', 0) > 0]),
                        'bearish': len([n for n in news if n.get('sentiment', 0) < 0]),
                        'neutral': len([n for n in news if n.get('sentiment', 0) == 0]),
                        'total_news': len(news)
                    }
                else:
                    logger.warning(f"No news data found for index: {index}")
                    sentiment_data[index] = {
                        'bullish': 0,
                        'bearish': 0,
                        'neutral': 0,
                        'total_news': 0
                    }
                    
            except Exception as index_error:
                logger.error(f"Error processing sentiment for {index}: {str(index_error)}")
                sentiment_data[index] = {
                    'error': str(index_error)
                }
        
        if not any(sentiment_data.values()):
            error_msg = "Could not fetch sentiment data for any index"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 500
            
        logger.info("Successfully fetched market sentiment data")
        return jsonify(sentiment_data)
    except Exception as e:
        error_msg = f"Error fetching market sentiment: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/stock/<symbol>/recommendations', methods=['GET'])
def get_stock_recommendations(symbol):
    try:
        logger.info(f"Fetching recommendations for symbol: {symbol}")
        
        if not finnhub_client:
            error_msg = "Finnhub client not initialized"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 503
            
        recommendations = finnhub_client.recommendation_trends(symbol)
        
        if not recommendations:
            error_msg = f"No recommendations found for symbol: {symbol}"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 404
            
        # Process and validate recommendations
        processed_recommendations = []
        for rec in recommendations:
            if all(key in rec for key in ['period', 'strongBuy', 'buy', 'hold', 'sell', 'strongSell']):
                processed_recommendations.append(rec)
            else:
                logger.warning(f"Skipping invalid recommendation data: {rec}")
                
        if not processed_recommendations:
            error_msg = f"No valid recommendations data for symbol: {symbol}"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 404
            
        logger.info(f"Successfully fetched recommendations for {symbol}")
        return jsonify(processed_recommendations)
    except Exception as e:
        error_msg = f"Error fetching recommendations for {symbol}: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/stock/<symbol>/visualization', methods=['GET'])
def get_stock_visualization(symbol):
    try:
        logger.info(f"Generating visualization data for symbol: {symbol}")
        
        # Get historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        stock = yf.Ticker(symbol)
        hist = stock.history(start=start_date, end=end_date)
        
        if hist.empty:
            error_msg = f"No data found for symbol: {symbol}"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 404
        
        try:
            # Calculate moving averages
            logger.debug("Calculating moving averages")
            hist['MA20'] = hist['Close'].rolling(window=20).mean()
            hist['MA50'] = hist['Close'].rolling(window=50).mean()
            hist['EMA200'] = hist['Close'].ewm(span=200, adjust=False).mean()
            
            # Calculate MACD
            logger.debug("Calculating MACD")
            exp1 = hist['Close'].ewm(span=12, adjust=False).mean()
            exp2 = hist['Close'].ewm(span=26, adjust=False).mean()
            hist['MACD'] = exp1 - exp2
            hist['Signal_Line'] = hist['MACD'].ewm(span=9, adjust=False).mean()
            hist['MACD_Histogram'] = hist['MACD'] - hist['Signal_Line']
            
            # Calculate Bollinger Bands
            logger.debug("Calculating Bollinger Bands")
            hist['BB_middle'] = hist['Close'].rolling(window=20).mean()
            bb_std = hist['Close'].rolling(window=20).std()
            hist['BB_upper'] = hist['BB_middle'] + (bb_std * 2)
            hist['BB_lower'] = hist['BB_middle'] - (bb_std * 2)
            
            # Convert NaN values to None (null in JSON)
            def clean_nan(x):
                return None if pd.isna(x) else float(x)
            
            # Prepare the response data
            logger.debug("Preparing response data")
            response_data = {
                'dates': hist.index.strftime('%Y-%m-%d').tolist(),
                'prices': {
                    'open': [clean_nan(x) for x in hist['Open'].tolist()],
                    'high': [clean_nan(x) for x in hist['High'].tolist()],
                    'low': [clean_nan(x) for x in hist['Low'].tolist()],
                    'close': [clean_nan(x) for x in hist['Close'].tolist()],
                    'ma20': [clean_nan(x) for x in hist['MA20'].tolist()],
                    'ma50': [clean_nan(x) for x in hist['MA50'].tolist()],
                    'ema200': [clean_nan(x) for x in hist['EMA200'].tolist()],
                    'bb_upper': [clean_nan(x) for x in hist['BB_upper'].tolist()],
                    'bb_middle': [clean_nan(x) for x in hist['BB_middle'].tolist()],
                    'bb_lower': [clean_nan(x) for x in hist['BB_lower'].tolist()]
                },
                'volume': [clean_nan(x) for x in hist['Volume'].tolist()],
                'macd': {
                    'macd': [clean_nan(x) for x in hist['MACD'].tolist()],
                    'signal': [clean_nan(x) for x in hist['Signal_Line'].tolist()],
                    'histogram': [clean_nan(x) for x in hist['MACD_Histogram'].tolist()]
                }
            }
            
            # Add summary statistics
            try:
                logger.debug("Calculating summary statistics")
                response_data['summary'] = {
                    'current_price': clean_nan(hist['Close'].iloc[-1]),
                    'price_change': clean_nan(hist['Close'].iloc[-1] - hist['Close'].iloc[-2]),
                    'price_change_percent': clean_nan((hist['Close'].iloc[-1] - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2] * 100),
                    'highest_price': clean_nan(hist['High'].max()),
                    'lowest_price': clean_nan(hist['Low'].min()),
                    'average_volume': clean_nan(hist['Volume'].mean())
                }
            except Exception as summary_error:
                logger.warning(f"Error calculating summary statistics: {str(summary_error)}")
                response_data['summary'] = {}
            
            logger.info(f"Successfully generated visualization data for {symbol}")
            return jsonify(response_data)
            
        except Exception as calc_error:
            error_msg = f"Error calculating technical indicators for {symbol}: {str(calc_error)}"
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
    except Exception as e:
        error_msg = f"Error processing visualization request for {symbol}: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    try:
        logger.info("Fetching watchlist")
        watchlist = load_watchlist()
        
        # Get current prices for all watchlist stocks
        stocks_data = []
        for symbol in watchlist:
            try:
                price_data = get_stock_price(symbol).get_json()
                if isinstance(price_data, dict) and 'error' not in price_data:
                    stocks_data.append(price_data)
                else:
                    logger.warning(f"Could not fetch price data for {symbol}")
            except Exception as e:
                logger.error(f"Error fetching data for {symbol}: {str(e)}")
        
        logger.info(f"Successfully fetched watchlist data for {len(stocks_data)} stocks")
        return jsonify(stocks_data)
    except Exception as e:
        error_msg = f"Error fetching watchlist: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/watchlist/<symbol>', methods=['POST'])
def add_to_watchlist(symbol):
    try:
        logger.info(f"Adding {symbol} to watchlist")
        watchlist = load_watchlist()
        
        # Normalize symbol
        symbol = symbol.upper()
        
        # Check if symbol exists by trying to get its price
        try:
            price_data = get_stock_price(symbol).get_json()
            if isinstance(price_data, dict) and 'error' in price_data:
                error_msg = f"Invalid symbol: {symbol}"
                logger.warning(error_msg)
                return jsonify({"error": error_msg}), 400
        except Exception as e:
            error_msg = f"Error validating symbol {symbol}: {str(e)}"
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 400
        
        # Add to watchlist if not already present
        if symbol not in watchlist:
            watchlist.append(symbol)
            save_watchlist(watchlist)
            logger.info(f"Successfully added {symbol} to watchlist")
            return jsonify({"message": f"Added {symbol} to watchlist", "symbol": symbol})
        else:
            logger.info(f"{symbol} is already in watchlist")
            return jsonify({"message": f"{symbol} is already in watchlist", "symbol": symbol})
            
    except Exception as e:
        error_msg = f"Error adding {symbol} to watchlist: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/watchlist/<symbol>', methods=['DELETE'])
def remove_from_watchlist(symbol):
    try:
        logger.info(f"Removing {symbol} from watchlist")
        watchlist = load_watchlist()
        
        # Normalize symbol
        symbol = symbol.upper()
        
        # Remove from watchlist if present
        if symbol in watchlist:
            watchlist.remove(symbol)
            save_watchlist(watchlist)
            logger.info(f"Successfully removed {symbol} from watchlist")
            return jsonify({"message": f"Removed {symbol} from watchlist", "symbol": symbol})
        else:
            logger.info(f"{symbol} is not in watchlist")
            return jsonify({"message": f"{symbol} is not in watchlist", "symbol": symbol}), 404
            
    except Exception as e:
        error_msg = f"Error removing {symbol} from watchlist: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        logger.info("Fetching financial news")
        
        # Get category from query parameters
        category = request.args.get('category', 'all')
        
        # NewsData.io API endpoint
        url = "https://newsdata.io/api/1/news"
        
        # Base search terms for financial news
        search_terms = ['finance', 'stock market', 'economy']
        
        # Add category-specific search terms
        category_terms = {
            'markets': ['stock market', 'trading', 'market analysis'],
            'stocks': ['stocks', 'shares', 'equity'],
            'economy': ['economy', 'economic', 'gdp', 'inflation'],
            'business': ['business', 'company', 'corporate'],
            'technology': ['tech stocks', 'technology companies', 'tech sector'],
            'crypto': ['cryptocurrency', 'bitcoin', 'blockchain', 'crypto'],
        }
        
        if category != 'all' and category in category_terms:
            search_terms.extend(category_terms[category])
        
        params = {
            'apikey': NEWS_API_KEY,
            'category': 'business',
            'language': 'en',
            'q': ' OR '.join(search_terms),
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            error_msg = f"News API error: {response.status_code} - {response.text}"
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
        news_data = response.json()
        
        if 'results' not in news_data or not news_data['results']:
            error_msg = "No news data available"
            logger.warning(error_msg)
            return jsonify({"error": error_msg}), 404
            
        # Process and format the news data
        processed_news = []
        for article in news_data['results']:
            # Skip articles without required fields
            if not all(key in article for key in ['title', 'link', 'pubDate', 'source_id']):
                continue
                
            # Calculate time ago
            pub_date = datetime.strptime(article['pubDate'], "%Y-%m-%d %H:%M:%S")
            time_diff = datetime.now() - pub_date
            
            if time_diff.days > 0:
                time_ago = f"{time_diff.days}d ago"
            elif time_diff.seconds // 3600 > 0:
                time_ago = f"{time_diff.seconds // 3600}h ago"
            else:
                time_ago = f"{time_diff.seconds // 60}m ago"
            
            # Determine sentiment (simplified)
            title_lower = article['title'].lower()
            if any(word in title_lower for word in ['surge', 'jump', 'rise', 'gain', 'up', 'high', 'bull', 'positive']):
                sentiment = 'positive'
            elif any(word in title_lower for word in ['drop', 'fall', 'decline', 'down', 'low', 'bear', 'negative']):
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            processed_news.append({
                'id': article.get('article_id', str(len(processed_news))),
                'title': article['title'],
                'description': article.get('description', ''),
                'url': article['link'],
                'source': article['source_id'].replace('-', ' ').title(),
                'time': time_ago,
                'sentiment': sentiment,
                'image_url': article.get('image_url', None)
            })
        
        logger.info(f"Successfully fetched {len(processed_news)} news articles")
        return jsonify({
            'articles': processed_news,
            'nextPage': news_data.get('nextPage', None)
        })
        
    except Exception as e:
        error_msg = f"Error fetching news: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/news/search/<query>', methods=['GET'])
def search_news(query):
    try:
        logger.info(f"Searching news for: {query}")
        
        url = "https://newsdata.io/api/1/news"
        
        params = {
            'apikey': NEWS_API_KEY,
            'q': query,                # Search query
            'language': 'en',          # English news only
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            error_msg = f"News API error: {response.status_code} - {response.text}"
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
        news_data = response.json()
        
        if 'results' not in news_data or not news_data['results']:
            return jsonify({"articles": [], "message": "No results found"})
            
        # Process and format the search results
        processed_news = []
        for article in news_data['results']:
            if not all(key in article for key in ['title', 'link', 'pubDate', 'source_id']):
                continue
                
            # Calculate time ago
            pub_date = datetime.strptime(article['pubDate'], "%Y-%m-%d %H:%M:%S")
            time_diff = datetime.now() - pub_date
            
            if time_diff.days > 0:
                time_ago = f"{time_diff.days}d ago"
            elif time_diff.seconds // 3600 > 0:
                time_ago = f"{time_diff.seconds // 3600}h ago"
            else:
                time_ago = f"{time_diff.seconds // 60}m ago"
            
            # Determine sentiment (simplified)
            title_lower = article['title'].lower()
            if any(word in title_lower for word in ['surge', 'jump', 'rise', 'gain', 'up', 'high', 'bull', 'positive']):
                sentiment = 'positive'
            elif any(word in title_lower for word in ['drop', 'fall', 'decline', 'down', 'low', 'bear', 'negative']):
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            processed_news.append({
                'id': article.get('article_id', str(len(processed_news))),
                'title': article['title'],
                'description': article.get('description', ''),
                'url': article['link'],
                'source': article['source_id'].replace('-', ' ').title(),
                'time': time_ago,
                'sentiment': sentiment,
                'image_url': article.get('image_url', None)
            })
        
        logger.info(f"Successfully found {len(processed_news)} articles matching '{query}'")
        return jsonify({
            'articles': processed_news,
            'nextPage': news_data.get('nextPage', None)
        })
        
    except Exception as e:
        error_msg = f"Error searching news: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 