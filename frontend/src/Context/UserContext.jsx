// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect, use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



// Create the context
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [AllPoster, setAllPoster] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);


    const url = "http://localhost:5000"
    const location = useLocation();
    const navigate = useNavigate();




    // all function 
    const loginUser = async (formData) => {

        try {
            const response = await axios.post(`${url}/api/users/login`, formData);
            const data = response.data;

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            toast.success('Login successful!');
            return true;

        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (formData) => {
        const { name, email, password, otp } = formData;


        if (!name || !email || !password || !otp) {
            toast.error('All fields are required.');
            setLoading(false);
            return false;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            setLoading(false);
            return false;
        }


        try {
            const response = await axios.post(`${url}/api/users/register`, formData);
            const data = response.data;

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong during registration.');
            return false;
        }
    };

    const getUserDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch user details');
            }

            setUser(response.data.user);
            setCartItems(response.data.user.cart || []);
            setCartItemCount(response.data.user.cart.length || 0);
            setOrders(response.data.user.orderHistory);


        } catch (error) {
            console.error('Error fetching user details:', error);
            // Optionally show a toast or handle token expiry here
        }
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    const SendOtp = async (formData) => {


        const { email, password } = formData;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address.');
            setLoading(false);
            return false;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            setLoading(false);
            return false;
        }

        try {
            const response = await axios.post(`${url}/api/users/send-otp`, { email });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to send OTP');
            }

            toast.success('OTP sent to your email.');
            return true;
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message || 'Something went wrong while sending OTP.');
            return false;
        }
    };

    const fetchPoster = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${url}/api/users/posters/get-all-poster`);
            setAllPoster(data.posters);
        } catch (err) {
            console.error("Failed to fetch posters:", err.message);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${url}/api/users/categories/get-all-categories`);
            setCategorys(data.categorys);
        } catch (err) {
            console.error("Failed to fetch categories:", err.message);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const fetchProducts = async (page = currPage) => {
        //   setLoading(true);
        try {
            const { data } = await axios.get(`${url}/api/users/products/get-all-products?page=${page}`);

            if (data.success) {
                setProducts(data.products);
                setCurrPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err.message);
        } finally {
            // setTimeout(() => setLoading(false), 1000);
        }
    };

    const getSearchResults = async (query) => {
        try {
            const { data } = await axios.get(`${url}/api/users/products/user-search`, {
                params: {
                    search: query,
                },
            });
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch search results');
            }
            setSearchResults(data.products);
            return true;
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
            return false;
        }
    };

    const addToCart = async (productId, quantity) => {
        if (!token) {
            toast.error("Please login to add items to cart.");

            // Just remember current page
            navigate("/login", { state: { from: location.pathname } });
            return;
        }


        try {
            const { data } = await axios.post(
                `${url}/api/users/cart/add-to-cart`,
                { productId, quantity },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                return true;
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error('Failed to add product to cart.');
            return false;
        }
    };

    const removeFromCart = async (productId) => {
        if (!token) {
            toast.error('Please login to remove items from cart.');
            return false;
        }
        try {
            const { data } = await axios.delete(
                `${url}/api/users/cart/remove-from-cart/${productId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                setCartItemCount(data.cartItemCount);
                setCartItems(data.cart);
                return true;
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
            toast.error('Failed to remove product from cart.');
            return false;
        }
    }

    const updateCartQuantity = async (productId, quantity) => {
        if (!token) {
            toast.error('Please login to update the cart.');
            return false;
        }

        try {
            const { data } = await axios.put(
                `${url}/api/users/cart/update-quantity`,
                { productId, quantity },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                setCartItemCount(data.cartItemCount);
                return true;
            }
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            toast.error('Failed to update quantity.');
            return false;
        }
    };

    const getCartItems = async () => {
        if (!token) {
            toast.error('Please login to view cart items.');
            return false;
        }

        try {
            const { data } = await axios.get(
                `${url}/api/users/cart/cart-items`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                setCartItems(data.cart);
                setCartItemCount(data.cart.length);
                return true;
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            toast.error('Failed to fetch cart items.');
        }

        return false;
    };

    const updatedAddress = async (address) => {
        try {
            const { data } = await axios.put(
                `${url}/api/users/update-address`,
                { address },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setUser((prev) => ({ ...prev, address: data.updatedAddress }));
                return true;
            }
        } catch (error) {
            console.error('Failed to update address', error);
            return false;
        }

    }

    const getOrders = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${url}/api/users/orders/get-orders`, {  // <-- await added
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                // console.log(data.orders);
                setOrders(data.orders);
            }

        } catch (err) {
            console.error("Error fetching orders:", err); // <-- fixed variable name
        }
    };

    const uploadProfileImage = async (avatar) => {
        //    console.log("Uploading profile image:", avatar);
        try {
            const { data } = await axios.put(
                `${url}/api/users/update-avatar`,
                { avatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setUser(data.user);
                toast.success("Profile image updated!");
            }
        } catch (error) {
            toast.error("Failed to update profile image");
            console.error(error);
        }
    };













    //expire token check
    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            console.error("Invalid token:", error);
            return true;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            if (isTokenExpired(storedToken)) {
                console.log('Token expired on load');
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } else {
                setToken(storedToken);
            }
        }
    }, []);



    // all useEffect 


    //useEffect to get user details when token changes
    useEffect(() => {
        if (token) {
            getUserDetails();
        }
    }, [token, location.pathname]);



    //useEffect for when location changes
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [location]);

    //useEffect for token check when reloading
    useEffect(() => {
        setLoading(true);
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);

    }, []);





    // useEffect(() => {
    //     console.log(products);
    // }, [products]);
    // useEffect(() => {
    //     console.log(orders);
    // }, [orders])






    useEffect(() => {
        if (location.pathname === '/') {
            if (!AllPoster || AllPoster.length === 0) {
                fetchPoster();
            }

            if (!categorys || categorys.length === 0) {
                fetchCategories();
            }

            if (!products || products.length === 0) {
                fetchProducts();
            }

            if (!cartItems || cartItems.length === 0) {
                getCartItems();
            }
        }
        if (location.pathname === '/orders') {

            if (!orders || orders.length === 0) {
                getOrders();
            }
        }

    }, [location.pathname, token]);







    const value = {
        user,
        url,
        navigate,
        location,
        setUser,
        registerUser,
        getUserDetails,
        loading,
        setLoading,
        loginUser,
        SendOtp,
        token,
        setToken,
        AllPoster,
        categorys,
        products,
        totalPages,
        currPage,
        setCurrPage,
        fetchProducts,
        searchResults,
        setSearchResults,
        getSearchResults,
        isFavorite,
        setIsFavorite,
        cartItemCount,
        setCartItemCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartItems,
        cartItems,
        setCartItems,
        updatedAddress,
        orders,
        setOrders,
        getOrders,
        uploadProfileImage
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
