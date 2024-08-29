const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                { title: "FIRST", background: "white", initial: "white" },
                { title: "SECOND", background: "white", initial: "white" }
            ],
            token: localStorage.getItem('token') || null,
            user: (() => {
                const user = localStorage.getItem('user');
                if (user) {
                    try {
                        // Validar que el JSON es un objeto y no una cadena o un número
                        const parsedUser = JSON.parse(user);
                        if (typeof parsedUser === 'object' && parsedUser !== null) {
                            return parsedUser;
                        } else {
                            throw new Error('Parsed user is not an object');
                        }
                    } catch (error) {
                        console.error("Error parsing user JSON:", error);
                        localStorage.removeItem('user'); // Elimina datos corruptos
                        return null;
                    }
                }
                return null;
            })(),
            cryptoData: [],
            favorites: (() => {
                const favorites = localStorage.getItem('favorites');
                if (favorites) {
                    try {
                        // Validar que el JSON es un array
                        const parsedFavorites = JSON.parse(favorites);
                        if (Array.isArray(parsedFavorites)) {
                            return new Set(parsedFavorites);
                        } else {
                            throw new Error('Parsed favorites is not an array');
                        }
                    } catch (error) {
                        console.error("Error parsing favorites JSON:", error);
                        localStorage.removeItem('favorites'); // Elimina datos corruptos
                        return new Set();
                    }
                }
                return new Set();
            })(),
            orderBy: 'market_cap_desc',
            searchQuery: '',
            loading: false,
            error: null
        },
        actions: {
            registerUser: async (username, email, password, confirmPassword) => {
                try {
                    const response = await fetch(`https://zany-cod-977rxw469x7qfx4qw-3001.app.github.dev/api/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, email, password, confirmPassword })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        return { success: true };
                    } else {
                        return { success: false, message: result.message };
                    }
                } catch (error) {
                    console.error("Error registering user:", error);
                    return { success: false, message: "Network error" };
                }
            },

            loginUser: async (email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        setStore({ 
                            token: result.access_token,
                            user: result.user 
                        });
                        localStorage.setItem('token', result.access_token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                        return { success: true };
                    } else {
                        return { success: false, message: result.message };
                    }
                } catch (error) {
                    console.error("Error logging in user:", error);
                    return { success: false, message: "Network error" };
                }
            },

            logoutUser: () => {
                setStore({ token: null, user: null });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            },

            getMessage: async () => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/hello`, {
                        headers: {
                            'Authorization': `Bearer ${getStore().token}`
                        }
                    });
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo });
            },

            checkToken: () => {
                const token = localStorage.getItem('token');
                const user = (() => {
                    const user = localStorage.getItem('user');
                    if (user) {
                        try {
                            // Validar que el JSON es un objeto y no una cadena o un número
                            const parsedUser = JSON.parse(user);
                            if (typeof parsedUser === 'object' && parsedUser !== null) {
                                return parsedUser;
                            } else {
                                throw new Error('Parsed user is not an object');
                            }
                        } catch (error) {
                            console.error("Error parsing user JSON:", error);
                            localStorage.removeItem('user'); // Elimina datos corruptos
                            return null;
                        }
                    }
                    return null;
                })();
                if (token) {
                    setStore({ token, user });
                }
            },

            fetchCryptoData: async () => {
                const store = getStore();
                setStore({ loading: true, error: null });
                const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
                const params = {
                    vs_currency: 'usd',
                    order: store.orderBy,
                    per_page: 60,
                    page: 1,
                    sparkline: true
                };

                try {
                    const response = await fetch(`${apiUrl}?${new URLSearchParams(params)}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setStore({ cryptoData: data });
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setStore({ error: error.message });
                } finally {
                    setStore({ loading: false });
                }
            },

            setOrderBy: (orderBy) => {
                setStore({ orderBy });
                getActions().fetchCryptoData();
            },

            setSearchQuery: (searchQuery) => {
                setStore({ searchQuery });
            },

            toggleFavorite: (cryptoId) => {
                const store = getStore();
                const newFavorites = new Set(store.favorites);
                if (newFavorites.has(cryptoId)) {
                    newFavorites.delete(cryptoId);
                } else {
                    newFavorites.add(cryptoId);
                }
                setStore({ favorites: newFavorites });
                localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
            },

            getFavoriteCryptos: () => {
                const store = getStore();
                return store.cryptoData.filter(crypto => store.favorites.has(crypto.id));
            }
        }
    };
};

export default getState;
