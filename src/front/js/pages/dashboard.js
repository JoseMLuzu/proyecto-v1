import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";  // Importa el contexto para acceder al estado global
import { Line } from 'react-chartjs-2';  // Importa el componente Line para gráficos de líneas (aunque no se usa en este fragmento)
import "../../styles/dashboard.css";  // Importa el archivo CSS para estilos personalizados

const Dashboard = () => {
    const { store, actions } = useContext(Context);  // Usa el contexto para acceder al estado global y a las acciones
    const [bitcoinNews, setBitcoinNews] = useState([]);  // Estado para almacenar noticias de Bitcoin
    const [financialNews, setFinancialNews] = useState([]);  // Estado para almacenar noticias financieras

    useEffect(() => {
        let isMounted = true;  // Flag para evitar actualizaciones de estado después de desmontar el componente

        actions.fetchCryptoData();  // Llama a la acción para obtener datos de criptomonedas

        // Función para obtener noticias financieras
        const fetchFinancialNews = async () => {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=cr84anhr01qptfa330p0cr84anhr01qptfa330pg`);
                const data = await response.json();
                if (data && data.length > 0 && isMounted) {
                    setFinancialNews(data.slice(0, 18));  // Actualiza el estado con las primeras 18 noticias
                }
            } catch (error) {
                console.error("Error fetching financial news:", error);  // Manejo de errores
            }
        };

        // Función para obtener noticias de Bitcoin
        const fetchBitcoinNews = async () => {
            try {
                const response = await fetch(`https://min-api.cryptocompare.com/data/v2/news/?categories=BTC&api_key=d4ec3931809b61f9f8b10fb5104a4aaf059e393a640b93a0d69b2068b653ce3d`);
                const data = await response.json();
                if (data && data.Data && data.Data.length > 0 && isMounted) {
                    setBitcoinNews(data.Data.slice(0, 18));  // Actualiza el estado con las primeras 18 noticias
                }
            } catch (error) {
                console.error("Error fetching Bitcoin news:", error);  // Manejo de errores
            }
        };

        fetchFinancialNews();  // Llama a la función para obtener noticias financieras
        fetchBitcoinNews();  // Llama a la función para obtener noticias de Bitcoin

        return () => {
            isMounted = false;  // Marca el componente como desmontado para evitar actualizaciones de estado
        };
    }, []);  // Dependencias vacías para ejecutar el efecto solo una vez al montar el componente

    const favorites = store.cryptoData.filter(crypto => store.favorites.has(crypto.id));  // Filtra los datos de criptomonedas para mostrar solo las favoritas
    const userName = store.user?.name || "Usuario";  // Obtiene el nombre del usuario o un valor por defecto si no está disponible

    return (
        <div className="container my-5">
            <h1 className="tituloH">Welcome!</h1>
            <div className="news-section my-5">
                <h2 className="mb-4" id="text1">Latest Financial News</h2>
                <div className="row">
                    {financialNews.length > 0 ? (
                        financialNews.map((article, index) => (
                            <div key={index} className="col-sm-12 col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    {article.image && (
                                        <img src={article.image} className="card-img-top" alt={article.headline} />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{article.headline}</h5>
                                        <p className="card-text text-secondary">
                                            {article.summary.length > 100 ? `${article.summary.substring(0, 100)}...` : article.summary}
                                        </p>
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read more</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No news articles available at the moment.</p>
                    )}
                </div>

                <h2 className="mb-4 pt-5" id="text2">Latest Crypto News</h2>
                <div className="row">
                    {bitcoinNews.length > 0 ? (
                        bitcoinNews.map((article, index) => (
                            <div key={index} className="col-sm-12 col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <img src={article.imageurl || 'https://cryptoslate.com/wp-content/uploads/2018/10/Cryptopanic-social.jpg'} className="card-img-top" alt={article.title || "Bitcoin News"} />
                                    <div className="card-body">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text text-secondary">
                                            {article.body.length > 100 ? `${article.body.substring(0, 100)}...` : article.body}
                                        </p>
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read more</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Bitcoin news articles available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
