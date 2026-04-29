import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Create the AdminContext
const AdminContext = createContext();

// Export a hook for easy usage
export const useAdmin = () => useContext(AdminContext);

// Provider Component
export const AdminProvider = ({ children }) => {
  const { user, token, loading, setLoading, url } = useUser();
  const [posters, setPosters] = useState();
  const [allCategory, setAllCategory] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [AllOrders, setAllOrders] = useState([]);
  const [AllUsers, setAllUsers] = useState([]);
  const [MonthlyOrders, setMonthlyOrders] = useState([]);
  const [YearlyOrders, setYearlyOrders] = useState([]);

  const [currProductPage, setCurrentProductPage] = useState(() => {
    const storedPage = sessionStorage.getItem('adminCurrentProductPage');
    const parsedPage = parseInt(storedPage, 10);
    return !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  });




  const location = useLocation();
  const navigate = useNavigate();

  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.secure_url || !data.public_id) {
        console.error("Cloudinary upload failed:", data);
        return null;
      }

      return {
        imageUrl: data.secure_url,
        public_id: data.public_id,
      };
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };





  const fetchPosters = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${url}/api/posters/getPosters`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.data.success) {
        console.log(response.data.message);
      }
      //console.log(response.data.posters);
      setPosters(response.data.posters);
    } catch (error) {
      console.error("Error fetching posters:", error.response?.data?.message || error.message);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const addPoster = async (formData) => {
    setLoading(true);
    const { public_id, description, offer, title, imageUrl } = formData;

    // Proper validation
    if (!public_id || !description || !offer || !title || !imageUrl) {
      toast.error('All fields are required');
      setLoading(false);
      return false;
    }

    try {
      const response = await axios.post(`${url}/api/posters/addPoster`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.data.success) {
        setPosters(prev => [...prev, response.data.poster]);
        return true;
      } else {
        toast.error(response.data.message || "Failed to add poster");
        return false;
      }

    } catch (error) {
      console.error("Error adding poster:", error.response?.data?.message || error.message);
      toast.error("Something went wrong while adding poster");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePoster = async (_id, public_id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/api/posters/delete/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { public_id },
      });

      return response.data.success;
    } catch (error) {
      console.error("Error deleting poster:", error.response?.data?.message || error.message);
      return false;
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const AddCategory = async (formData) => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${url}/api/category/add-category`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAllCategory((prev) => [...prev, data.category]);
        toast.success(data.message || "Category added successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to add category.");
        return false;
      }
    } catch (err) {
      console.error("AddCategory Error:", err);
      toast.error(err.response?.data?.message || "Server error while adding category.");
      return false;
    } finally {
      // Optional delay to smooth out UI transitions
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const fetchCategory = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${url}/api/category/all-categorys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success && data.categorys) {
        setAllCategory(data.categorys);

      } else {
        console.warn('Unexpected response format:', data);
      }

    } catch (error) {
      console.error('Error fetching categories:', error.response?.data?.message || error.message);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const deleteCategory = async (_id, public_id) => {

    setLoading(true);
    try {
      const res = await axios.delete(`${url}/api/category/delete-category/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { public_id }, // Send public_id in request body
      });

      if (res.data.success) {
        toast.success(res.data.message || "Category deleted successfully");
        setAllCategory((prev) => prev.filter((cat) => cat._id !== _id));
      } else {
        toast.error(res.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(error.response?.data?.message || "Error deleting category");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const AddProduct = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/products/add-product`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAllProducts((prev) => [...prev, response.data.product]);
        return true;
      } else {
        toast.error(response.data.message || 'Failed to add product');
        return false;
      }
    } catch (error) {
      console.error('Add Product Error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong while adding the product');
      return false;
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const fetchAllProducts = async (page, limit = 10) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/products/all-products?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success && data.products) {
        setAllProducts(data.products);
        setTotalPages(data.pagination.totalPages || 0);
      } else {
        console.warn('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching products:', error.response?.data?.message || error.message);
    } finally {
      setTimeout(() => setLoading(false), 1000);
      // setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const { data } = await axios.get(`${url}/api/products/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: query },
      });

      if (data.success) {
        setSuggestions(data.products);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Suggestion fetch failed:', err.message);
      setSuggestions([]);
    }
  };

  // const getProductById = async (id) => {
  //   console.log('funcion call');
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.get(`${url}/api/products/product/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (data.success) {
  //       setCurrentProduct(data.product);
  //     } else {
  //       console.warn('Unexpected response format:', data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching product:', error.response?.data?.message || error.message);
  //   } finally {
  //     setTimeout(() => setLoading(false), 1000);
  //   }
  // };
 

const getProductById = useCallback(async (id) => {
  console.log('function call');
  setLoading(true);
  try {
    const { data } = await axios.get(`${url}/api/products/product/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      setCurrentProduct(data.product);
    } else {
      console.warn('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching product:', error.response?.data?.message || error.message);
  } finally {
    setTimeout(() => setLoading(false), 1000); 
  }
}, [token, url]); 

const updateProduct = async (id, formData) => {
  setLoading(true);
  try {
    const response = await axios.put(
      `${url}/api/products/update-product/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message || 'Product updated successfully');
      return true;
    } else {
      toast.error(response.data.message || 'Failed to update product');
      return false;
    }
  } catch (error) {
    console.error('Update Product Error:', error);
    toast.error(
      error.response?.data?.message ||
        error.message ||
        'Something went wrong while updating the product'
    );
    return false;
  } finally {
    setLoading(false); 
  }
};

const deleteProduct = async (id) => {
  console.log('deleteProduct called with id:', id);
  setLoading(true);
  try {
    const response = await axios.delete(`${url}/api/products/delete-product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      // Remove deleted product from local state
      // setAllProducts(prevProducts => prevProducts.filter(p => p._id !== productId));

      toast.success(response.data.message || 'Product deleted successfully');
      return true;
    } else {
      toast.error(response.data.message || 'Failed to delete product');
      return false;
    }
  } catch (error) {
    console.error('Delete Product Error:', error);
    toast.error(
      error.response?.data?.message ||
      error.message ||
      'Something went wrong while deleting the product'
    );
    return false;
  } finally {
    setTimeout(() => setLoading(false), 1000);
  }
};

const getAllOrders= async ()=>{
  setLoading(true);
  try {
    const { data } = await axios.get(`${url}/api/orders/all-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success) {
      // console.log('All Orders:', data.orders);
      setAllOrders(data.orders);
    } else {
      console.warn('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching all orders:', error.response?.data?.message || error.message);
  } finally {
    setTimeout(() => setLoading(false), 1000);
  }
};

const getAllUsers = async ()=>{
  try {
    const { data } = await axios.get(`${url}/api/users/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.success) {
      setAllUsers(data.users);
    } else {
      console.warn('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching all users:', error.response?.data?.message || error.message);
  } 
};

const getMonthlyOrders = async () => {
  try {
    const { data } = await axios.get(`${url}/api/orders/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success) {
      setMonthlyOrders(data.orders);
    } else {
      console.warn('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching monthly orders:', error.response?.data?.message || error.message);
  }
};

const getYearlyOrders = async () => {
  try {
    const { data } = await axios.get(`${url}/api/orders/yearly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success) {
      setYearlyOrders(data.orders);
    } else {
      console.warn('Unexpected response format:', data);
    }
  } catch (error) {
    console.error('Error fetching yearly orders:', error.response?.data?.message || error.message);
  }
};







  useEffect(() => {
    if (!token) return;

    const path = location.pathname;


    if (path === "/admin/dashboard" && (!posters || posters.length === 0)) {
      fetchPosters();
    }

    const needsCategory = ["/admin/view-categories", "/admin/add-item"];
    if (needsCategory.includes(path) && (!allCategory || allCategory.length === 0)) {
      fetchCategory();
    }

    if (path === "/admin/view-product" && (!allProducts || allProducts.length === 0)) {
      fetchAllProducts(currProductPage);
    }

    const needOrders = ["/admin/orders/pending","/admin/orders/history"];
    if (needOrders.includes(path) && (!AllOrders || AllOrders.length === 0)) {
      getAllOrders();
    }

    if (path === "/admin/users" && (!AllUsers || AllUsers.length === 0)) {
      getAllUsers();
    }
    if(path==='/admin/reports'&& (!MonthlyOrders || MonthlyOrders.length === 0) && (!YearlyOrders || YearlyOrders.length === 0)&&(!AllOrders || AllOrders.length===0)){
      getMonthlyOrders();
      getYearlyOrders();
      getAllOrders();
    }

  }, [location.pathname, token]);





     useEffect(() => {
    // Fetch data or perform actions when component mounts
    console.log("All Orders:", AllOrders);
    console.log("Monthly Orders:", MonthlyOrders);
    console.log("Yearly Orders:", YearlyOrders);
  }, [AllOrders, MonthlyOrders, YearlyOrders]);





  // 2. Update sessionStorage when page changes
  useEffect(() => {
    sessionStorage.setItem('adminCurrentProductPage', currProductPage);
  }, [currProductPage]);




  const value = {
    user,
    url,
    token,
    navigate,
    uploadImageToCloudinary,
    posters,
    setPosters,
    addPoster,
    location,
    deletePoster,
    AddCategory,
    deleteCategory,
    allCategory,
    allProducts,
    setAllProducts,
    AddProduct,
    fetchAllProducts,
    fetchSuggestions,
    suggestions,
    setSuggestions,
    currProductPage,
    setCurrentProductPage,
    totalPages,
    getProductById,
    currentProduct,
    updateProduct,
    deleteProduct,
    AllOrders,
    setAllOrders,
    getAllOrders,
    AllUsers,
    setAllUsers,
    getAllUsers,
    MonthlyOrders,
    setMonthlyOrders,
    getMonthlyOrders,
    YearlyOrders,
    setYearlyOrders,
    getYearlyOrders
  }

  return (
    <AdminContext.Provider
      value={value}
    >
      {children}
    </AdminContext.Provider>
  );
};
