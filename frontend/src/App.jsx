import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Signup from "./Pages/signup/Signup";
import Loader from "./components/Loader/Loader";
import { useUser } from "./Context/UserContext.jsx";
import Login from "./Pages/login/Login";

import AdminLayout from "./admin/pages/AdminLayout.jsx";
import AdminHome from "./admin/pages/AdminHome.jsx";
import { useEffect } from "react";
import Page404 from "./Pages/Page404.jsx";
import AdminFooter from "./admin/pages/AdminFooter.jsx";
import AddCategory from "./admin/pages/AddCategory.jsx";
import ViewCategory from "./admin/pages/VIewCategory.jsx";
import AddProduct from "./admin/pages/AddProduct.jsx";
import ViewProductByCategory from "./admin/pages/ViewProductByCategory.jsx";
import ViewProduct from "./admin/pages/ViewProduct.jsx";
import EditProduct from "./admin/pages/EditProduct.jsx";
import Home from "./Pages/Home.jsx";
import ForgetPass from "./Pages/ForgetPass.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import LargeProductCart from "./components/LargeProductCart.jsx";
import ViewProductCategory from "./components/ViewProductCategory.jsx";
import Cart from "./Pages/Cart.jsx";
import CheckOut from "./Pages/CheckOut.jsx";
import PaymentSuccess from "./Pages/PaymentSuccess.jsx";
import PaymentCancel from "./Pages/PaymentCancel.jsx";
import Order from "./Pages/Order.jsx";
import AllOrders from "./admin/pages/AllOrders.jsx";
import PendingOrder from "./admin/pages/PendingOrder.jsx";
import Profile from "./Pages/Profile.jsx";
import AllUsers from "./admin/pages/AllUsers.jsx";
import UserDetails from "./admin/pages/UserDetails.jsx";
import Report from "./admin/pages/Report.jsx";
import Footer from "./components/Footer.jsx";
import Contact from "./Pages/Contact.jsx";

// import ForgotPassword from './Pages/forgot/ForgotPassword';

// Custom App content to allow useLocation inside Router
const AppContent = () => {
  const location = useLocation();
  const { token, user, loading } = useUser();

  if (loading) return null;

  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={
            token ? (
              <>
                <Navbar />
                <Navigate to="/" />
              </>
            ) : (
              <Signup />
            )
          }
        />

        <Route
          path="/login"
          element={
            token ? (
              <>
                <Navbar />
                <Navigate to="/" />
              </>
            ) : (
              <Login />
            )
          }
        />

        <Route path="/" element={<Home />} />
        <Route
          path="/product/:Id"
          element={
            <>
              <Navbar />
              <LargeProductCart />
            </>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <>
              <Navbar />
              <ViewProductCategory />
            </>
          }
        />
        <Route path="/forgot-password" element={<ForgetPass />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Navbar />
              <CheckOut />
            </>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <Order />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
            </>
          }
        />
        <Route
          path="/wishlist"
          element={
            <>
              <Navbar />
              <h1>Wishlist Page Coming Soon</h1>
            </>
          }
        />

        {user?.role === "admin" && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="dashboard"
              element={
                <>
                  <AdminHome />
                </>
              }
            />
            <Route
              path="add-item"
              element={
                <>
                  <AddProduct />
                </>
              }
            />
            <Route
              path="add-category"
              element={
                <>
                  <AddCategory />
                </>
              }
            />
            <Route
              path="view-categories"
              element={
                <>
                  <ViewCategory />
                </>
              }
            />
            <Route
              path="view-product"
              element={
                <>
                  <ViewProductByCategory />
                </>
              }
            />
            <Route
              path="orders/pending"
              element={<>{/* <PendingOrder /> */}</>}
            />
            <Route
              path="orders/history"
              element={
                <>
                  <AllOrders />
                </>
              }
            />
            <Route
              path="profile"
              element={
                <>
                  <Profile />
                </>
              }
            />
            <Route
              path="users"
              element={
                <>
                  <AllUsers />
                </>
              }
            />
            <Route
              path="reports"
              element={
                <>
                  <Report />
                </>
              }
            />
            <Route
              path="settings"
              element={
                <>
                  <h1>Settings page coming soon</h1>
                </>
              }
            />
            <Route path="product/:id" element={<ViewProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />

            <Route path="users/:id/profile" element={<UserDetails />} />
          </Route>
        )}

        <Route path="*" element={<Page404 />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

function App() {
  const { loading } = useUser();
  return (
    <>
      <AppContent />
      {loading && <Loader />}
    </>
  );
}

export default App;
