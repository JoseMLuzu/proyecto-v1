import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Line } from 'react-chartjs-2';
import "../../styles/dashboard.css";

const Dashboard = () => {
    const { store, actions } = useContext(Context);
    const [bitcoinNews, setBitcoinNews] = useState([]);
    const [financialNews, setFinancialNews] = useState([]);

    useEffect(() => {
        let isMounted = true;

        actions.fetchCryptoData();

        const fetchFinancialNews = async () => {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=cr84anhr01qptfa330p0cr84anhr01qptfa330pg`);
                const data = await response.json();
                if (data && data.length > 0 && isMounted) {
                    setFinancialNews(data.slice(0, 18));
                }
            } catch (error) {
                console.error("Error fetching financial news:", error);
            }
        };

        const fetchBitcoinNews = async () => {
            try {
                const response = await fetch(`https://min-api.cryptocompare.com/data/v2/news/?categories=BTC&api_key=d4ec3931809b61f9f8b10fb5104a4aaf059e393a640b93a0d69b2068b653ce3d`);
                const data = await response.json();
                if (data && data.Data && data.Data.length > 0 && isMounted) {
                    setBitcoinNews(data.Data.slice(0, 18));
                }
            } catch (error) {
                console.error("Error fetching Bitcoin news:", error);
            }
        };

        fetchFinancialNews();
        fetchBitcoinNews();

        return () => {
            isMounted = false;
        };
    }, []);

    const favorites = store.cryptoData.filter(crypto => store.favorites.has(crypto.id));
    const userName = store.user?.name || "Usuario"; // Aquí obtienes el nombre del usuario, o un valor por defecto si no está disponible.

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
