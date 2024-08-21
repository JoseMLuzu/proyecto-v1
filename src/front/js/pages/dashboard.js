import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Line } from 'react-chartjs-2';
import "../../styles/dashboard.css";

const Dashboard = () => {
    const { store, actions } = useContext(Context);
    const [bitcoinNews, setBitcoinNews] = useState([]);
    const [financialNews, setFinancialNews] = useState([]);

    useEffect(() => {
        let isMounted = true; // Variable de control para evitar actualizaciones en un componente desmontado

        actions.fetchCryptoData();

        const fetchFinancialNews = async () => {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=cqkjfmhr01qjqssgembgcqkjfmhr01qjqssgemc0`);
                const data = await response.json();
                console.log("Finnhub API Response:", data);
                if (data && data.length > 0 && isMounted) {
                    setFinancialNews(data.slice(0, 18)); // Limita a los primeros 18 artículos
                }
            } catch (error) {
                console.error("Error fetching financial news:", error);
            }
        };

        const fetchBitcoinNews = async () => {
            try {
                const response = await fetch(`https://min-api.cryptocompare.com/data/v2/news/?categories=BTC&api_key=d4ec3931809b61f9f8b10fb5104a4aaf059e393a640b93a0d69b2068b653ce3d`);
                const data = await response.json();
                console.log("CryptoCompare API Response:", data);
                if (data && data.Data && data.Data.length > 0 && isMounted) {
                    setBitcoinNews(data.Data.slice(0, 18)); // Limita a los primeros 18 artículos
                } else {
                    console.log("No Bitcoin news available");
                }
            } catch (error) {
                console.error("Error fetching Bitcoin news:", error);
            }
        };

        fetchFinancialNews();
        fetchBitcoinNews();

        return () => {
            isMounted = false; // Establecer a false cuando el componente se desmonte
        };
    }, []);

    const favorites = store.cryptoData.filter(crypto => store.favorites.has(crypto.id));

    return (
        <div className="container my-5">
            <h1 className="my-4 text-center title-animation">Favorites Dashboard</h1>
            <div className="row">
                {favorites.map(crypto => (
                    <div key={crypto.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <img
                                src={crypto.image}
                                className="card-img-top rounded-circle mx-auto mt-3"
                                alt={crypto.name}
                                style={{ width: '80px', height: '80px' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{crypto.name}</h5>
                                <p className="card-text">Price: ${crypto.current_price.toFixed(2)}</p>
                                {crypto.sparkline_in_7d && (
                                    <div style={{ height: '70px' }}>
                                        <Line
                                            data={{
                                                labels: crypto.sparkline_in_7d.price.map((_, index) => index),
                                                datasets: [{
                                                    data: crypto.sparkline_in_7d.price,
                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                    borderWidth: 2,
                                                    pointRadius: 0,
                                                }]
                                            }}
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
                                            height={70}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="news-section my-5">
                <h2 className="mb-4" id = "text1">Latest Financial News</h2>
                <div className="row">
                    {financialNews.length > 0 ? (
                        financialNews.map((article, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    {article.image && (
                                        <img src={article.image} className="card-img-top" alt={article.headline} />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{article.headline}</h5>
                                        <p className="card-text text-secondary">{article.summary}</p>
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read more</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No news articles available at the moment.</p>
                    )}
                </div>

                <h2 className="mb-4 pt-5" id = "text2">Latest Bitcoin News</h2>
                <div className="row">
                    {bitcoinNews.length > 0 ? (
                        bitcoinNews.map((article, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <img src={article.imageurl || 'https://cryptoslate.com/wp-content/uploads/2018/10/Cryptopanic-social.jpg'} className="card-img-top" alt={article.title || "Bitcoin News"} />
                                    <div className="card-body">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text text-secondary">{article.body}</p>
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
