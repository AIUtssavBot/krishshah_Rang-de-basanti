const API_BASE_URL = 'http://localhost:5000/api';

export const getStockPrice = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/stock/${symbol}/price`);
  return response.json();
};

export const getHistoricalData = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/stock/${symbol}/historical`);
  return response.json();
};

export const getCompanyInfo = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/stock/${symbol}/company`);
  return response.json();
};

export const getMarketSentiment = async () => {
  const response = await fetch(`${API_BASE_URL}/market/sentiment`);
  return response.json();
};

export const getStockRecommendations = async (symbol) => {
  const response = await fetch(`${API_BASE_URL}/stock/${symbol}/recommendations`);
  return response.json();
}; 