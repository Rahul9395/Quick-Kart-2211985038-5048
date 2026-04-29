import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";
import axios from "axios";

function AllOrders() {
  const { AllOrders, token, getAllOrders } = useAdmin();
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fixed delivery boy list
  const deliveryBoys = [
    { name: "Rahul Singh", phone: "9876543210" },
    { name: "Ankit Sharma", phone: "9123456789" },
    { name: "Suman Roy", phone: "9988776655" },
  ];

  // Handle status update
  const handleStatusChange = async (orderId, newStatus, deliveryBoy = null) => {
    try {
      setUpdatingOrderId(orderId);
      await axios.put(
        `http://localhost:5000/api/orders/update-status/${orderId}`,
        { status: newStatus, deliveryBoy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await getAllOrders(); // refresh orders after update
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtered Orders based on search
const filteredOrders = AllOrders.filter((order) => {
  const query = searchQuery.toLowerCase();

  const userMatch = order.user?.name?.toLowerCase().includes(query);
  const productMatch = order.items.some((item) =>
    item.name?.toLowerCase().includes(query)
  );
  const statusMatch = order.status?.toLowerCase().includes(query);

  return userMatch || productMatch || statusMatch;
});


 return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">All Orders</h1>

    {/* Search Bar */}
    <div className="mb-6 flex items-center">
      <input
        type="text"
        placeholder="Search by User Name or Product Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {filteredOrders.length === 0 ? (
      <p className="text-gray-600">No matching orders found.</p>
    ) : (
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-2xl p-5 border border-gray-200"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Order #{order._id.slice(-6).toUpperCase()}
              </h2>

              {/* Status + Delivery Boy */}
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={
                      updatingOrderId === order._id ||
                      order.status === "Cancelled"
                    }
                    className={`border rounded px-2 py-1 text-sm ${
                      order.status === "Cancelled"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "border-gray-300"
                    }`}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                {/* Delivery Boy Selection */}
                {order.status === "Out for Delivery" && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Assign To:</label>
                    <select
                      value={order.deliveryBoy?.name || ""}
                      onChange={(e) => {
                        const boy = deliveryBoys.find(
                          (d) => d.name === e.target.value
                        );
                        handleStatusChange(order._id, "Out for Delivery", boy);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
                    >
                      <option value="">Select Delivery Boy</option>
                      {deliveryBoys.map((boy, idx) => (
                        <option key={idx} value={boy.name}>
                          {boy.name} ({boy.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Show Assigned Delivery Boy */}
                {order.deliveryBoy?.name && (
                  <div className="mt-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      🚚 Assigned to: {order.deliveryBoy.name} (
                      {order.deliveryBoy.phone})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="text-sm text-gray-700 mb-3">
              <p>
                <strong>User:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Ordered At:</strong>{" "}
                {new Date(order.orderedAt).toLocaleString()}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 p-3 rounded-md mb-3 text-sm">
              <p className="font-semibold">Shipping Info:</p>
              <p>
                {order.shippingInfo?.houseName}, {order.shippingInfo?.street},{" "}
                {order.shippingInfo?.city}, {order.shippingInfo?.state},{" "}
                {order.shippingInfo?.zip}, {order.shippingInfo?.country}
              </p>
              <p>📞 {order.shippingInfo?.phone}</p>
            </div>

            {/* Items */}
            <div className="mb-3">
              <p className="font-semibold mb-2">Items:</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Total */}
            <div className="flex justify-between items-center border-t pt-3">
              <div>
                <p className="text-sm">
                  <strong>Payment:</strong>{" "}
                  {order.paymentInfo?.method || "N/A"} (
                  {order.paymentInfo?.status})
                </p>
                <p className="text-sm">
                  <strong>Delivery Charge:</strong> ₹{order.deliveryCharge}
                </p>
                <p className="text-sm">
                  <strong>Platform Fee:</strong> ₹{order.platformFee}
                </p>
              </div>
              <p className="text-lg font-bold text-green-600">
                Total: ₹{order.totalAmount}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

}

export default AllOrders;
