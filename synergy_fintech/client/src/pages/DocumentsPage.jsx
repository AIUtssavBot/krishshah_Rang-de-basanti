import React, { useState } from 'react';
import { FileText, Upload, Link2, FileType, Search, AlertCircle, Check, BarChart3 } from 'lucide-react';

const DocumentsPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [documentType, setDocumentType] = useState('earnings');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Mock document types
  const documentTypes = [
    { id: 'earnings', name: 'Earnings Report' },
    { id: 'annual', name: 'Annual Report (10-K)' },
    { id: 'quarterly', name: 'Quarterly Report (10-Q)' },
    { id: 'prospectus', name: 'Prospectus' },
    { id: 'presentation', name: 'Investor Presentation' },
    { id: 'transcript', name: 'Earnings Call Transcript' },
    { id: 'sec', name: 'SEC Filing' },
    { id: 'research', name: 'Research Report' },
    { id: 'news', name: 'News Article' },
  ];

  // Mock recent documents
  const recentDocuments = [
    {
      id: 1,
      name: 'AAPL Q4 2023 Earnings Report',
      type: 'earnings',
      date: '2023-10-26',
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'MSFT Annual Report 2023',
      type: 'annual',
      date: '2023-08-15',
      size: '5.7 MB',
    },
    {
      id: 3,
      name: 'AMZN Q3 2023 Earnings Call Transcript',
      type: 'transcript',
      date: '2023-10-31',
      size: '1.2 MB',
    },
    {
      id: 4,
      name: 'TSLA Investor Presentation Q4 2023',
      type: 'presentation',
      date: '2023-11-10',
      size: '8.5 MB',
    },
    {
      id: 5,
      name: 'GOOGL 10-K 2023',
      type: 'annual',
      date: '2023-02-03',
      size: '6.2 MB',
    },
  ];

  // Mock analysis result
  const mockAnalysisResult = {
    documentName: 'AAPL Q4 2023 Earnings Report',
    documentType: 'earnings',
    analysisDate: '2023-11-15',
    summary: 'Apple Inc. reported strong financial results for the fourth quarter of fiscal year 2023, exceeding analyst expectations. The company achieved record revenue in its Services segment and showed resilience in iPhone sales despite market challenges. Management expressed optimism about upcoming product launches and continued growth in emerging markets.',
    keyMetrics: [
      { name: 'Revenue', value: '$89.5 billion', change: '+2.1% YoY' },
      { name: 'EPS', value: '$1.46', change: '+7.4% YoY' },
      { name: 'Gross Margin', value: '45.2%', change: '+1.3% YoY' },
      { name: 'Services Revenue', value: '$22.3 billion', change: '+16.3% YoY' },
      { name: 'iPhone Revenue', value: '$43.8 billion', change: '-0.9% YoY' },
      { name: 'Cash & Equivalents', value: '$62.5 billion', change: '-5.2% YoY' },
    ],
    sentimentAnalysis: {
      overall: 'Positive',
      score: 78,
      breakdown: {
        positive: 72,
        neutral: 23,
        negative: 5,
      },
    },
    keyInsights: [
      'Services segment achieved all-time revenue record, growing 16.3% year-over-year',
      'Gross margin expanded to 45.2%, reflecting improved operational efficiency',
      'Management announced $90 billion share repurchase program',
      'China revenue declined 2.5% amid increased competition',
      'AI investments expected to accelerate in 2024',
      'Supply chain constraints easing, but still impacting some product categories',
    ],
    riskFactors: [
      'Increasing regulatory scrutiny in multiple markets',
      'Intensifying competition in key product categories',
      'Potential macroeconomic headwinds affecting consumer spending',
      'Foreign exchange volatility impacting international revenue',
      'Dependency on China for manufacturing and as a key market',
    ],
    forwardGuidance: {
      revenue: 'Mid-single-digit growth expected for Q1 2024',
      margin: 'Gross margin between 45-46% expected',
      opex: 'Operating expenses projected to increase 3-5%',
      taxRate: 'Effective tax rate of approximately 16%',
    },
  };

  const handleAnalyzeDocument = (documentId = null) => {
    setIsAnalyzing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
      setActiveTab('result');
    }, 2000);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    handleAnalyzeDocument();
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    handleAnalyzeDocument();
  };

  const renderUploadTab = () => (
    <div className="space-y-6">
      <div className="flex border-b border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${
            uploadMethod === 'file'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setUploadMethod('file')}
        >
          Upload File
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            uploadMethod === 'url'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setUploadMethod('url')}
        >
          Document URL
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            uploadMethod === 'text'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setUploadMethod('text')}
        >
          Paste Text
        </button>
      </div>

      {uploadMethod === 'file' && (
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="bg-gray-700 block w-full pl-3 pr-10 py-2 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                PDF, DOCX, XLSX, PPTX, TXT (MAX. 20MB)
              </p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.xlsx,.pptx,.txt"
                id="file-upload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Select File
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Analyze Document
            </button>
          </div>
        </form>
      )}

      {uploadMethod === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="bg-gray-700 block w-full pl-3 pr-10 py-2 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Document URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/document.pdf"
              className="bg-gray-700 block w-full pl-3 pr-3 py-2 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter the URL of a publicly accessible document
            </p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Analyze Document
            </button>
          </div>
        </form>
      )}

      {uploadMethod === 'text' && (
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="bg-gray-700 block w-full pl-3 pr-10 py-2 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Document Text
            </label>
            <textarea
              rows={10}
              placeholder="Paste your document text here..."
              className="bg-gray-700 block w-full pl-3 pr-3 py-2 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Analyze Document
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const renderRecentTab = () => (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search documents..."
          className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {recentDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer"
            onClick={() => handleAnalyzeDocument(doc.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">{doc.name}</h3>
                <div className="mt-1 flex items-center text-xs text-gray-400">
                  <span>{doc.type}</span>
                  <span className="mx-2">•</span>
                  <span>{doc.date}</span>
                  <span className="mx-2">•</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResultTab = () => {
    if (!analysisResult) return null;

    const getChangeColor = (change) => {
      if (change.startsWith('+')) return 'text-green-500';
      if (change.startsWith('-')) return 'text-red-500';
      return 'text-gray-400';
    };

    return (
      <div className="space-y-8">
        {/* Document Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{analysisResult.documentName}</h2>
            <span className="text-sm text-gray-400">Analyzed on {analysisResult.analysisDate}</span>
          </div>
          <p className="text-gray-300">{analysisResult.summary}</p>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResult.keyMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-gray-400">{metric.name}</div>
                <div className="text-lg font-semibold mt-1">{metric.value}</div>
                <div className={`text-sm mt-1 ${getChangeColor(metric.change)}`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">{analysisResult.sentimentAnalysis.overall}</div>
                <div className="text-sm text-gray-400">Overall Sentiment</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analysisResult.sentimentAnalysis.score}/100</div>
                <div className="text-sm text-gray-400">Confidence Score</div>
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${analysisResult.sentimentAnalysis.breakdown.positive}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-green-500">{analysisResult.sentimentAnalysis.breakdown.positive}% Positive</span>
              <span className="text-yellow-500">{analysisResult.sentimentAnalysis.breakdown.neutral}% Neutral</span>
              <span className="text-red-500">{analysisResult.sentimentAnalysis.breakdown.negative}% Negative</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
          <div className="space-y-3">
            {analysisResult.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
          <div className="space-y-3">
            {analysisResult.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forward Guidance */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Forward Guidance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysisResult.forwardGuidance).map(([key, value]) => (
              <div key={key} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-gray-400 capitalize">{key}</div>
                <div className="text-lg mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Document Analysis</h1>
          <p className="text-gray-400">
            AI-powered financial document analysis and insights
          </p>
        </div>
        {activeTab === 'result' && (
          <button
            onClick={() => setActiveTab('upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Analyze New Document
          </button>
        )}
      </div>

      {!isAnalyzing && (
        <div className="flex border-b border-gray-700">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'upload'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'recent'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Documents
          </button>
          {analysisResult && (
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'result'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('result')}
            >
              Analysis Result
            </button>
          )}
        </div>
      )}

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Analyzing Document</h2>
          <p className="text-gray-400">
            Our AI is processing your document. This may take a few moments...
          </p>
        </div>
      ) : (
        <>
          {activeTab === 'upload' && renderUploadTab()}
          {activeTab === 'recent' && renderRecentTab()}
          {activeTab === 'result' && renderResultTab()}
        </>
      )}
    </div>
  );
};

export default DocumentsPage; 