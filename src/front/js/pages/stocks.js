import React, { useContext, useEffect } from 'react';
import { Context } from '../store/appContext';

function StockApp() {
  const { store, actions } = useContext(Context);
  const { stocksData, favorites, searchQuery, orderBy, loading, error } = store;

  useEffect(() => {
    actions.fetchStockData();
    actions.loadFavorites();
  }, []);

  const handleSearchChange = (event) => {
    actions.setSearchQuery(event.target.value);
  };

  const handleOrderByChange = (event) => {
    actions.setOrderBy(event.target.value);
  };

  const filteredStocksData = stocksData.filter(({ companyName }) =>
    companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStocksData = [...filteredStocksData].sort((a, b) => {
    if (orderBy === 'name') {
      return a.companyName.localeCompare(b.companyName);
    } else if (orderBy === 'value_asc') {
      return a.price - b.price;
    } else if (orderBy === 'value_desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="my-4 text-center title-animation">Stock Prices</h1>
          <div className="form-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="orderBy">Order By:</label>
            <select
              id="orderBy"
              className="form-control"
              value={orderBy}
              onChange={handleOrderByChange}
            >
              <option value="value_desc">Value (Descending)</option>
              <option value="value_asc">Value (Ascending)</option>
              <option value="name">Name (Alphabetical)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        {loading && <div className="col-12"><p>Loading...</p></div>}
        {error && <div className="col-12"><p>Error: {error}</p></div>}
        {!loading && !error && (sortedStocksData.length > 0 ? (
          sortedStocksData.map(({ symbol, price, change, companyName, logo }) => (
            <div key={symbol} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={logo}
                  className="card-img-top"
                  alt={companyName}
                  style={{ width: '50px', height: '50px', margin: 'auto' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{companyName}</h5>
                  <p className="card-text">Price: ${price}</p>
                  <p className="card-text">Change: ${change}</p>
                  <button
                    className={`btn ${favorites.has(symbol) ? 'btn-danger' : 'btn-outline-danger'} mt-2`}
                    onClick={() => actions.toggleFavorite(symbol)}
                  >
                    {favorites.has(symbol) ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12"><p>No companies available.</p></div>
        )
      )}
      </div>
    </div>
  );
}

export default StockApp;
