import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../store/appContext";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/crypto.css';

function CryptoApp() {
  const { store, actions } = useContext(Context);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    actions.fetchCryptoData(); // Fetch crypto data on component mount and when selectedCurrency changes
  }, [store.orderBy, store.selectedCurrency]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
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

  const filteredCryptoData = store.cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(store.searchQuery.toLowerCase())
  );

  const sortedCryptoData = [...filteredCryptoData].sort((a, b) => {
    if (store.orderBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (store.orderBy === 'market_cap_asc') {
      return a.market_cap - b.market_cap;
    } else if (store.orderBy === 'market_cap_desc') {
      return b.market_cap - a.market_cap;
    } else if (store.orderBy === 'price_asc') {
      return a.current_price - b.current_price;
    } else if (store.orderBy === 'price_desc') {
      return b.current_price - a.current_price;
    }
    return 0;
  });

  const generateSparklineData = (sparkline) => ({
    labels: sparkline.map((_, index) => index),
    datasets: [{
      data: sparkline,
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      pointRadius: 0,
    }]
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="my-4 text-center title-animation">Crypto Prices</h1>
          <div className="form-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              className="form-control mb-2"
              placeholder="Search by name..."
              value={store.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="orderBy">Order By:</label>
            <select
              id="orderBy"
              className="form-control mb-5"
              value={store.orderBy}
              onChange={(e) => actions.setOrderBy(e.target.value)}
            >
              <option value="name">Name (Alphabetical)</option>
              <option value="price_asc">Price (Ascending)</option>
              <option value="price_desc">Price (Descending)</option>
              <option value="market_cap_asc">Market Cap (Ascending)</option>
              <option value="market_cap_desc">Market Cap (Descending)</option>
            </select>
          </div>
        </div>
      </div>
      {store.loading ? (
        <div className="text-center">Loading...</div>
      ) : store.error ? (
        <div className="text-center">Error loading data: {store.error.message}</div>
      ) : (
        <div className="row">
          {sortedCryptoData.map((crypto) => (
            <div key={crypto.id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src={crypto.image}
                      alt={`${crypto.name} logo`}
                      className="crypto-icon me-3"
                      style={{ width: '30px', height: '30px' }}
                    />
                    <h5 className="card-title">{crypto.name}</h5>
                  </div>
                  <p className="card-text">Price: ${crypto.current_price.toFixed(2)}</p>
                  <p className="card-text">Market Cap: ${crypto.market_cap.toLocaleString()}</p>
                  <p className="card-text">24h High: ${crypto.high_24h.toFixed(2)}</p>
                  <p className="card-text">24h Low: ${crypto.low_24h.toFixed(2)}</p>
                  <div className="mb-3">
                    <Line data={generateSparklineData(crypto.sparkline_in_7d.price)} options={{ responsive: true }} />
                  </div>
                  <a 
                    href={`https://www.coingecko.com/en/coins/${crypto.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-2 w-100"
                  >
                    View on CoinGecko
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showTopButton && (
        <button onClick={scrollToTop} className="btn btn-primary scroll-to-top buttonTop">
          Scroll to Top
        </button>
      )}
    </div>
  );
}

export default CryptoApp;
