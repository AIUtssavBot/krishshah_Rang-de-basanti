from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your newsdata.io API key from environment variable
API_KEY = os.getenv("NEWSDATA_API_KEY")

@app.route('/api/news', methods=['GET'])
def get_news():
    # Get query parameters
    category = request.args.get('category', 'business')
    days = int(request.args.get('days', 30))  # Default to 30 days
    custom_query = request.args.get('q', '')  # Get custom query parameter
    
    # Make request to newsdata.io API
    # Note: newsdata.io free tier doesn't support from_date parameter in the news endpoint
    # We'll just use the category and query parameters
    url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&category={category}&language=en"
    
    # Add query terms based on the category and custom query
    if custom_query:
        # If a custom query is provided, use it
        url += f"&q={custom_query}"
    elif category == 'business':
        # Default business query if no custom query is provided
        url += "&q=finance OR stock OR market OR economy OR investment"
    elif category == 'technology':
        url += "&q=tech OR startup OR innovation OR digital OR software"
    elif category == 'health':
        url += "&q=healthcare OR medical OR wellness OR biotech OR pharma"
    elif category == 'science':
        url += "&q=research OR discovery OR breakthrough OR study OR innovation"
    elif category == 'sports':
        url += "&q=sports business OR athlete endorsement OR sports investment OR team valuation"
    elif category == 'entertainment':
        url += "&q=media business OR streaming OR box office OR entertainment industry"
    
    try:
        print(f"Making API request to: {url}")
        response = requests.get(url)
        data = response.json()
        
        # Debug the API response
        print(f"API Response Status: {response.status_code}")
        
        # Check if the API returned an error
        if 'status' in data and data['status'] == 'error':
            print(f"API Error: {data.get('results', {}).get('message', 'Unknown error')}")
            # Return mock data instead
            return get_mock_data()
        
        # Transform the data to match our frontend format
        articles = []
        
        if 'results' in data and isinstance(data['results'], list):
            # Calculate current time for time ago calculation
            end_date = datetime.now()
            
            for idx, article in enumerate(data['results']):
                # Simple sentiment analysis based on title (in a real app, use NLP)
                sentiment = 'neutral'
                title_lower = article.get('title', '').lower()
                positive_words = ['rise', 'gain', 'growth', 'positive', 'up', 'rally', 'surge', 'jump', 'increase']
                negative_words = ['fall', 'drop', 'decline', 'negative', 'down', 'plunge', 'crash', 'decrease', 'loss']
                
                if any(word in title_lower for word in positive_words):
                    sentiment = 'positive'
                elif any(word in title_lower for word in negative_words):
                    sentiment = 'negative'
                
                # Calculate time ago
                pub_date = article.get('pubDate', '')
                time_ago = '1 day ago'  # Default
                
                if pub_date:
                    try:
                        pub_datetime = datetime.strptime(pub_date, '%Y-%m-%d %H:%M:%S')
                        delta = end_date - pub_datetime
                        
                        if delta.days > 0:
                            time_ago = f"{delta.days} days ago"
                        elif delta.seconds // 3600 > 0:
                            time_ago = f"{delta.seconds // 3600} hours ago"
                        else:
                            time_ago = f"{delta.seconds // 60} minutes ago"
                    except Exception as e:
                        print(f"Error parsing date: {e}")
                
                # Filter articles by date if days parameter is provided
                # This is a client-side filter since the API doesn't support from_date
                if days > 0:
                    try:
                        pub_datetime = datetime.strptime(pub_date, '%Y-%m-%d %H:%M:%S')
                        cutoff_date = end_date - timedelta(days=days)
                        if pub_datetime < cutoff_date:
                            continue  # Skip this article if it's older than the cutoff date
                    except Exception as e:
                        print(f"Error filtering by date: {e}")
                
                articles.append({
                    'id': idx + 1,
                    'title': article.get('title', 'No Title'),
                    'source': article.get('source_id', 'Unknown Source'),
                    'time': time_ago,
                    'sentiment': sentiment,
                    'url': article.get('link', '#'),
                    'description': article.get('description', ''),
                    'image_url': article.get('image_url', '')
                })
        
        # Return the transformed data
        if articles:
            return jsonify({
                'status': 'success',
                'data': articles
            })
        else:
            print("No articles found, returning mock data")
            return get_mock_data()
            
    except Exception as e:
        print(f"Error fetching news: {e}")
        # Return mock data on error
        return get_mock_data()

def get_mock_data():
    """Return mock news data for the recent news endpoint"""
    return jsonify({
        'status': 'success',
        'data': [
            {
                'id': 1,
                'title': 'Fed signals potential rate cuts in coming months',
                'source': 'Financial Times',
                'time': '2 hours ago',
                'sentiment': 'positive',
                'url': '#',
                'description': 'Federal Reserve officials indicated they could cut interest rates in the coming months if inflation continues to cool.',
            },
            {
                'id': 2,
                'title': 'Tech stocks rally on strong earnings reports',
                'source': 'Wall Street Journal',
                'time': '4 hours ago',
                'sentiment': 'positive',
                'url': '#',
                'description': 'Technology stocks surged as major companies reported better-than-expected quarterly earnings.',
            },
            {
                'id': 3,
                'title': 'Oil prices drop amid supply concerns',
                'source': 'Bloomberg',
                'time': '6 hours ago',
                'sentiment': 'negative',
                'url': '#',
                'description': 'Crude oil prices fell as concerns about oversupply outweighed expectations of higher demand.',
            },
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 