# Stock Analysis & News Platform

A comprehensive platform for real-time stock analysis, market news, and watchlist management.

## Requirements

### Backend Requirements (Python)
- Python 3.8 or higher
- pip (Python package manager)

### Frontend Requirements (Node.js)
- Node.js 16.x or higher
- npm 8.x or higher

## Installation

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the server directory with your API keys:
```env
FINNHUB_API_KEY=your_finnhub_api_key_here
NEWS_API_KEY=your_newsdata_api_key_here
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install Node.js dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server
```bash
cd server
python app.py
```
The server will start at `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will start at `http://localhost:5173`

## Dependencies

### Backend Dependencies (Python)
```
# Web Framework
Flask==3.0.0
flask-cors==4.0.0

# Data Processing
pandas==2.1.4
numpy==1.26.2
yfinance==0.2.33

# API Clients
finnhub-python==2.4.19
requests==2.31.0

# Environment and Utils
python-dotenv==1.0.0
pathlib==1.0.1

# Date and Time
python-dateutil==2.8.2
```

### Frontend Dependencies (Node.js)
```json
{
  "dependencies": {
    "@radix-ui/react-scroll-area": "^1.2.3",
    "clsx": "^2.1.1",
    "lucide-react": "^0.344.0",
    "plotly.js-dist": "^3.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-plotly.js": "^2.6.0",
    "react-router-dom": "^6.22.3",
    "recharts": "^2.12.2",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^4.5.2"
  }
}
```

## Features
- Real-time stock tracking with technical indicators
- Financial news with category filtering and sentiment analysis
- Personalized watchlist management
- Interactive charts and visualizations
- Market sentiment analysis

## API Keys Required
1. Finnhub API (https://finnhub.io/)
   - Used for real-time stock data and market information
2. NewsData.io API (https://newsdata.io/)
   - Used for financial news aggregation

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest) 