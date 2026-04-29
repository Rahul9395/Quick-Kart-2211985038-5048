import React from "react";
import { useUser } from "../Context/UserContext";
import CartProductItem from "../components/CartProductItem";
import AddressSection from "../components/AddressSection";
import PaymentSection from "../components/PaymentSection";
import SummarySection from "../components/SummarySection";
import { Link } from "react-router-dom";

function CartPage() {
  const { user, cartItems } = useUser();

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-4 text-center text-gray-600">
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        🛒 Your Shopping Cart{user.name && `, ${user.name}`}
      </h1>

      {cartItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
          <p className="text-lg text-gray-500">Your cart is empty.</p>

          <Link
            to="/"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Home Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section (Cart Items, Address, Payment) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Items in your cart
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <CartProductItem key={item._id || index} item={item} />
                ))}
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Shipping Address
              </h2>
              <AddressSection />
            </div>
          </div>

          {/* Right Section (Summary) */}
          <div className="space-y-6">
            <SummarySection />

            <Link
              to="/checkout "
              className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow transition"
            >
              Place Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
