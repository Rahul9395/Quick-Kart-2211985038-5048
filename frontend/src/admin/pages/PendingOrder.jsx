import React from "react";
import { useAdmin } from "../../Context/AdminContext";

function PendingOrder() {
  const { allOrders } = useAdmin();

  // ✅ Filter only pending orders
  const pendingOrders = allOrders.filter(
    (order) => order.status === "Pending"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>

      {pendingOrders.length === 0 ? (
        <p className="text-gray-600">No pending orders found.</p>
      ) : (
        <div className="space-y-6">
          {pendingOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-2xl p-5 border border-gray-200"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                {/* Just show current status */}
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                  {order.status}
                </span>
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

export default PendingOrder;
