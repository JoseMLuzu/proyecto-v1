import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../store/appContext";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/crypto.css';

function CryptoApp() {
  const { store, actions } = useContext(Context);
  const [showTopButton, setShowTopButton] = useState(false); // Estado para controlar la visibilidad del botón

  useEffect(() => {
    actions.fetchCryptoData(); // Fetch crypto data on component mount
  }, [store.orderBy]); // Fetch new data when orderBy changes

  // Event listener para el scroll
  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón si el usuario ha bajado más de 100 píxeles
      if (window.scrollY > 100) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    // Agregar el listener al scroll
    window.addEventListener('scroll', handleScroll);

    // Limpiar el listener cuando el componente se desmonte
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

  // Función para desplazarse hacia arriba
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
        <div>Loading...</div>
      ) : store.error ? (
        <div>Error: {store.error}</div>
      ) : (
        <div className="row">
          {sortedCryptoData.map(crypto => (
            <div key={crypto.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={crypto.image}
                  className="card-img-top mt-2"
                  alt={crypto.name}
                  style={{ width: '50px', height: '50px', margin: 'auto' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{crypto.name}</h5>
                  <p className="card-text">Price: ${crypto.current_price.toFixed(2)}</p>
                  {crypto.sparkline_in_7d && (
                    <div style={{ height: '50px' }}>
                      <Line
                        data={generateSparklineData(crypto.sparkline_in_7d.price)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: { display: false },
                            y: { display: false },
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false },
                          },
                          elements: { line: { tension: 0.1 } }
                        }}
                        height={50}
                      />
                    </div>
                  )}
                  <a
                    href={`https://www.coingecko.com/en/coins/${crypto.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-2"
                  >
                    View on CoinGecko
                  </a>
                  <button
                    className={`btn ${store.favorites.has(crypto.id) ? 'btn-danger' : 'btn-outline-danger'} mt-2 ms-2`}
                    onClick={() => actions.toggleFavorite(crypto.id)}
                  >
                    {store.favorites.has(crypto.id) ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Botón para subir al tope de la página */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="btn btn-outline-secondary"
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        >
          Top
        </button>
      )}
    </div>
  );
}

export default CryptoApp;
