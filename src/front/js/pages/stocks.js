import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/stocks.css';

const logoMap = {
  AAPL: 'https://logo.clearbit.com/apple.com',
  MSFT: 'https://logo.clearbit.com/microsoft.com',
  GOOGL: 'https://logo.clearbit.com/google.com',
  AMZN: 'https://logo.clearbit.com/amazon.com',
  TSLA: 'https://logo.clearbit.com/tesla.com',
  FB: 'https://logo.clearbit.com/facebook.com',
  NFLX: 'https://logo.clearbit.com/netflix.com',
  NVDA: 'https://logo.clearbit.com/nvidia.com',
  DIS: 'https://logo.clearbit.com/disney.com',
  MA: 'https://logo.clearbit.com/mastercard.com',
  JPM: 'https://logo.clearbit.com/jpmorganchase.com',
  HD: 'https://logo.clearbit.com/homedepot.com',
  PG: 'https://logo.clearbit.com/pg.com',
  KO: 'https://logo.clearbit.com/cocacola.com',
  PEP: 'https://logo.clearbit.com/pepsico.com',
  UNH: 'https://logo.clearbit.com/unitedhealthgroup.com',
  MRK: 'https://logo.clearbit.com/merck.com',
  PFE: 'https://logo.clearbit.com/pfizer.com',
  ABBV: 'https://logo.clearbit.com/abbvie.com',
  T: 'https://logo.clearbit.com/att.com',
  VZ: 'https://logo.clearbit.com/verizon.com',
  CSCO: 'https://logo.clearbit.com/cisco.com',
  ORCL: 'https://logo.clearbit.com/oracle.com',
  INTC: 'https://logo.clearbit.com/intel.com',
  QCOM: 'https://logo.clearbit.com/qualcomm.com',
  CRM: 'https://logo.clearbit.com/salesforce.com',
  ADBE: 'https://logo.clearbit.com/adobe.com',
  PYPL: 'https://logo.clearbit.com/paypal.com',
  CMCSA: 'https://logo.clearbit.com/comcast.com',
  NKE: 'https://logo.clearbit.com/nike.com',
};

const StockTracker = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('name');

  const stockSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'DIS',
    'MA', 'JPM', 'HD', 'PG', 'KO', 'PEP', 'UNH', 'MRK', 'PFE',
    'ABBV', 'T', 'VZ', 'CSCO', 'ORCL', 'INTC', 'QCOM', 'CRM', 'ADBE', 'PYPL',
    'CMCSA', 'NKE'
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchStocks = async () => {
      try {
        if (!isMounted) return;

        setLoading(true);
        const symbolQueries = stockSymbols.map(symbol =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cr84anhr01qptfa330p0cr84anhr01qptfa330pg`)
            .then(response => response.json())
            .then(data => ({ symbol, ...data }))
        );
        const stockData = await Promise.all(symbolQueries);

        if (isMounted) {
          setStocks(stockData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStocks();
    const intervalId = setInterval(fetchStocks, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [orderBy]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (orderBy === 'name') {
      return a.symbol.localeCompare(b.symbol);
    } else if (orderBy === 'current_price_asc') {
      return a.c - b.c;
    } else if (orderBy === 'current_price_desc') {
      return b.c - a.c;
    }
    return 0;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chartData = (symbol) => {
    const stock = stocks.find(stock => stock.symbol === symbol);
    if (stock) {
      return {
        labels: ['Open', 'High', 'Low', 'Current'],
        datasets: [{
          label: symbol,
          data: [
            stock.o ?? 0,
            stock.h ?? 0,
            stock.l ?? 0,
            stock.c ?? 0,
          ],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }],
      };
    }
    return {};
  };

  return (
    <div className="container my-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center mb-4 title-animation">Stock Tracker</h1>
          <div className="form-group mb-3">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Search by symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="orderBy">Order By:</label>
            <select
              id="orderBy"
              className="form-control"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <option value="name">Name (Alphabetical)</option>
              <option value="current_price_asc">Current Price (Ascending)</option>
              <option value="current_price_desc">Current Price (Descending)</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading data: {error}</div>
      ) : (
        <div className="row">
          {sortedStocks.map(stock => (
            <div key={stock.symbol} className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={logoMap[stock.symbol]}
                      alt={`${stock.symbol} logo`}
                      className="stock-icon me-3"
                      style={{ width: '30px', height: '30px' }}
                    />
                    <h5 className="card-title mb-0">{stock.symbol}</h5>
                  </div>
                  <p className="card-text">Current Price: ${stock.c}</p>
                  <p className="card-text">High: ${stock.h}</p>
                  <p className="card-text">Low: ${stock.l}</p>
                  <p className="card-text">Open: ${stock.o}</p>
                  <div className="chart-container mb-3">
                    <Line data={chartData(stock.symbol)} />
                  </div>
                  <a 
                    href={`https://www.marketwatch.com/investing/stock/${stock.symbol.toLowerCase()}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View on MarketWatch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showTopButton && (
        <button  onClick={scrollToTop} className="btn btn-primary scroll-to-top buttonTop">
          Scroll to Top
        </button>
      )}
    </div>
  );
};

export default StockTracker;
