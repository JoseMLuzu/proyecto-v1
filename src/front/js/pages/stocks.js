import React, { useEffect, useState } from 'react';  // Importa React y useState para manejar el estado del componente
import { Line } from 'react-chartjs-2';  // Importa el componente Line de react-chartjs-2 para gráficos de línea
import 'chart.js/auto';  // Importa Chart.js para la creación de gráficos
import '../../styles/stocks.css';  // Importa el archivo CSS para estilos personalizados

// Mapa de logos de empresas para los símbolos de acciones
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
  const [stocks, setStocks] = useState([]);  // Estado para almacenar los datos de las acciones
  const [loading, setLoading] = useState(true);  // Estado para controlar el estado de carga
  const [error, setError] = useState(null);  // Estado para manejar errores
  const [showTopButton, setShowTopButton] = useState(false);  // Estado para mostrar el botón de "Scroll to Top"
  const [searchQuery, setSearchQuery] = useState('');  // Estado para manejar la búsqueda de acciones
  const [orderBy, setOrderBy] = useState('name');  // Estado para manejar el orden de las acciones

  // Lista de símbolos de acciones
  const stockSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'DIS',
    'MA', 'JPM', 'HD', 'PG', 'KO', 'PEP', 'UNH', 'MRK', 'PFE',
    'ABBV', 'T', 'VZ', 'CSCO', 'ORCL', 'INTC', 'QCOM', 'CRM', 'ADBE', 'PYPL',
    'CMCSA', 'NKE'
  ];

  useEffect(() => {
    let isMounted = true;  // Controla si el componente sigue montado

    const fetchStocks = async () => {
      try {
        if (!isMounted) return;

        setLoading(true);
        // Crea una solicitud para obtener datos de cada símbolo de acción
        const symbolQueries = stockSymbols.map(symbol =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cr84anhr01qptfa330p0cr84anhr01qptfa330pg`)
            .then(response => response.json())
            .then(data => ({ symbol, ...data }))  // Combina el símbolo con los datos obtenidos
        );
        const stockData = await Promise.all(symbolQueries);  // Espera a que se completen todas las solicitudes

        if (isMounted) {
          setStocks(stockData);  // Establece los datos de las acciones en el estado
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);  // Establece el mensaje de error si ocurre un problema
        }
      } finally {
        if (isMounted) {
          setLoading(false);  // Establece el estado de carga a falso
        }
      }
    };

    fetchStocks();  // Llama a la función para obtener los datos
    const intervalId = setInterval(fetchStocks, 60000);  // Refresca los datos cada minuto

    return () => {
      isMounted = false;  // Limpia el estado de montaje
      clearInterval(intervalId);  // Limpia el intervalo de actualización
    };
  }, [orderBy]);  // Vuelve a ejecutar el efecto si cambia el valor de orderBy

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowTopButton(true);  // Muestra el botón de "Scroll to Top" si el usuario se desplaza hacia abajo
      } else {
        setShowTopButton(false);  // Oculta el botón si el usuario está en la parte superior
      }
    };

    window.addEventListener('scroll', handleScroll);  // Agrega el manejador de eventos de desplazamiento

    return () => {
      window.removeEventListener('scroll', handleScroll);  // Limpia el manejador de eventos de desplazamiento
    };
  }, []);

  // Filtra las acciones según la consulta de búsqueda
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordena las acciones según el criterio seleccionado
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

  // Desplaza la vista a la parte superior de la página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Devuelve los datos para el gráfico de línea
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
              onChange={(e) => setSearchQuery(e.target.value)}  // Actualiza la consulta de búsqueda
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="orderBy">Order By:</label>
            <select
              id="orderBy"
              className="form-control"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}  // Actualiza el criterio de ordenación
            >
              <option value="name">Name (Alphabetical)</option>
              <option value="current_price_asc">Current Price (Ascending)</option>
              <option value="current_price_desc">Current Price (Descending)</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>  // Muestra un mensaje de carga si los datos están cargando
      ) : error ? (
        <div>Error loading data: {error}</div>  // Muestra un mensaje de error si ocurre un problema
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
                      style={{ width: '30px', height: '30px' }}  // Estilo del logo
                    />
                    <h5 className="card-title mb-0">{stock.symbol}</h5>
                  </div>
                  <p className="card-text">Current Price: ${stock.c}</p>
                  <p className="card-text">High: ${stock.h}</p>
                  <p className="card-text">Low: ${stock.l}</p>
                  <p className="card-text">Open: ${stock.o}</p>
                  <div className="chart-container mb-3">
                    <Line data={chartData(stock.symbol)} />  {/* Muestra el gráfico de línea para cada acción */}
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
        <button onClick={scrollToTop} className="btn btn-primary scroll-to-top buttonTop">
          Scroll to Top
        </button>
      )}
    </div>
  );
};

export default StockTracker;
