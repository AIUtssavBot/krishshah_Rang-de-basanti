import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI financial assistant. How can I help you with market analysis or stock recommendations today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      const botResponses = [
        "Based on recent market trends, tech stocks are showing strong momentum. Consider adding AAPL or MSFT to your watchlist.",
        "The latest earnings report for Tesla shows promising growth in their energy division. This could be a good long-term investment opportunity.",
        "Market volatility has increased in the past week. It might be wise to diversify your portfolio with some defensive stocks.",
        "I've analyzed the financial statements of Amazon, and their cloud services division continues to be their main profit driver.",
        "Recent Fed announcements suggest interest rates may remain stable. This could benefit financial sector stocks in the coming months."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 h-[calc(100vh-12rem)]">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold">FinAI Assistant</h2>
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-700 mr-2'
                  }`}>
                    {message.sender === 'user' ? 
                      <UserIcon className="h-5 w-5 text-white" /> : 
                      <Bot className="h-5 w-5 text-blue-400" />
                    }
                  </div>
                  <div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
                    }`}>
                      <p>{message.text}</p>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 mr-2 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-gray-700 text-gray-200">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about market trends, stock analysis, or investment advice..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage; 