import React from 'react';
import {
  Package, MapPin, CreditCard, Clock, Truck, Phone, Receipt,
  ShoppingBag
} from 'lucide-react';
import { useUser } from '../Context/UserContext';
import OrderActions from '../components/OrderActions';
import axios from "axios";
import { Link } from 'react-router-dom';

// ---------- Utility Functions ----------
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPaymentStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

// ---------- Subcomponents as functions ----------
const OrderHeader = ({ order, grandTotal }) => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
        <Package className="h-6 w-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.orderedAt)}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
        <span className="text-lg font-bold text-gray-900">
          {formatCurrency(grandTotal)}
        </span>
      </div>
    </div>
  </div>
);

const OrderItems = ({ items, navigate }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <ShoppingBag className="h-6 w-6 mr-3 text-blue-600" />
        Items Ordered
      </h4>
      <div className="space-y-6">
        {items.map((item, index) => {
          const discountedPrice = item.price - (item.price * item.discount) / 100;
          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 border border-gray-200 rounded-lg transition-shadow duration-300 hover:shadow-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-lg border border-gray-300 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h5>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>Quantity: {item.quantity}</span>
                  {item.discount > 0 && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.discount}% off
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(discountedPrice * item.quantity)}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 mt-4 sm:mt-0">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-md"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PaymentInfo = ({ paymentInfo }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <CreditCard className="h-5 w-5 mr-2 text-green-600" /> Payment Info
    </h4>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Method:</span>
        <span className="font-medium uppercase">{paymentInfo.method}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Status:</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(paymentInfo.status)}`}>
          {paymentInfo.status}
        </span>
      </div>
    </div>
  </div>
);

const PriceDetails = ({ originalTotal, discountTotal, order, grandTotal }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <Receipt className="h-5 w-5 mr-2 text-blue-600" /> Price Details
    </h4>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Original Price:</span>
        <span>{formatCurrency(originalTotal)}</span>
      </div>
      <div className="flex justify-between text-green-600 font-medium">
        <span>Discount:</span>
        <span>-{formatCurrency(discountTotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Delivery Charge:</span>
        <span>{formatCurrency(order.deliveryCharge)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Platform Fee:</span>
        <span>{formatCurrency(order.platformFee)}</span>
      </div>
      <div className="border-t border-gray-300 pt-2 mt-2">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount:</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  </div>
);

const ShippingAddress = ({ shippingInfo }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <MapPin className="h-5 w-5 mr-2 text-red-600" /> Delivery Address
    </h4>
    <div className="space-y-1 text-sm text-gray-700">
      <p className="font-medium">{shippingInfo.houseName}</p>
      <p>{shippingInfo.street}</p>
      <p>{shippingInfo.landmark}</p>
      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
      <p>{shippingInfo.country}</p>
      <div className="flex items-center mt-2 pt-2 border-t border-gray-300">
        <Phone className="h-4 w-4 mr-2 text-gray-500" />
        <span>{shippingInfo.phone}</span>
      </div>
    </div>
  </div>
);

const OrderTimeline = ({ orderedAt, updatedAt }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <Clock className="h-5 w-5 mr-2 text-purple-600" /> Order Timeline
    </h4>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Ordered:</span>
        <span>{formatDate(orderedAt)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Last Updated:</span>
        <span>{formatDate(updatedAt)}</span>
      </div>
    </div>
  </div>
);

// ---------- Main Component ----------
function Order() {
  const { orders, url, setOrders, token, navigate } = useUser();

  const cancelOrder = async (orderId) => {
    // You should use a custom modal or component for confirmation instead of window.confirm
    // which is not supported in this environment.
    console.log(`Attempting to cancel order with ID: ${orderId}`);

    try {
      const response = await axios.patch(
        `${url}/api/users/orders/cancel/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "Cancelled" } : o
          )
        );
        console.log("Order cancelled successfully!");
      } else {
        console.error("Failed to cancel order:", response.data.message);
      }
    } catch (err) {
      console.error("Cancel order error:", err);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders.</p>
          <Link to="/">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
        <p className="text-gray-600 mb-8">Track and manage your order history</p>

        <div className="space-y-6">
          {orders.map((order) => {
            const originalTotal = order.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            const discountTotal = order.items.reduce(
              (total, item) =>
                total + ((item.price * item.discount) / 100) * item.quantity,
              0
            );
            const grandTotal =
              originalTotal -
              discountTotal +
              order.deliveryCharge +
              order.platformFee;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                {/* Header with order ID and status */}
                <OrderHeader order={order} grandTotal={grandTotal} />

                <div className="p-6">
                  {/* Grid layout for items and details */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="xl:col-span-2">
                       <OrderItems items={order.items} navigate={navigate} />
                    </div>

                    {/* Right column: payment, price details, shipping, timeline */}
                    <div className="space-y-6">
                      <PaymentInfo paymentInfo={order.paymentInfo} />
                      <PriceDetails
                        originalTotal={originalTotal}
                        discountTotal={discountTotal}
                        order={order}
                        grandTotal={grandTotal}
                      />
                      <ShippingAddress shippingInfo={order.shippingInfo} />
                      <OrderTimeline
                        orderedAt={order.orderedAt}
                        updatedAt={order.updatedAt}
                      />
                    </div>
                  </div>

                  {/* Actions (track, invoice, rate & review) */}
                  <OrderActions order={order} />

                  {/* Cancel Order Button */}
                  {(order.status.toLowerCase() === "pending" ||
                    order.status.toLowerCase() === "processing") && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Order;




