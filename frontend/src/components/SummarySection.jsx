import React, { useMemo } from 'react';
import { useUser } from '../Context/UserContext';

function SummarySection() {
  const { cartItems } = useUser();

  const deliveryCharge = 50;
  const platformFee = 20;

  // Calculate subtotal and totalSavings together
  const { subtotal, totalSavings } = useMemo(() => {
    let subtotal = 0;
    let totalSavings = 0;

    for (const item of cartItems) {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;
      const discountedPrice = price - (price * discount) / 100;

      subtotal += discountedPrice * item.quantity;
      totalSavings += (price - discountedPrice) * item.quantity;
    }

    return { subtotal, totalSavings };
  }, [cartItems]);

  const grandTotal = subtotal + deliveryCharge + platformFee;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-gray-500 mt-4">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>

      {cartItems.map((item) => {
        const product = item.productId;
        const quantity = item.quantity;
        const originalPrice = product.price;
        const discount = product.discount || 0;
        const discountAmount = (originalPrice * discount) / 100;
        const discountedPrice = originalPrice - discountAmount;
        const totalPrice = discountedPrice * quantity;
        const totalItemSavings = discountAmount * quantity;

        return (
          <div key={item._id} className="border-b py-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">Qty: {quantity}</p>
                {discount > 0 && (
                  <p className="text-sm text-green-600">You save ₹{totalItemSavings.toFixed(2)}</p>
                )}
              </div>
              <div className="text-right">
                {discount > 0 ? (
                  <>
                    <p className="line-through text-sm text-gray-400">₹{(originalPrice * quantity).toFixed(2)}</p>
                    <p className="text-base font-semibold text-black">₹{totalPrice.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-base font-semibold text-black">₹{totalPrice.toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-4 text-sm text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>₹{deliveryCharge}</span>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        <div className="flex justify-between text-green-600 font-medium">
          <span>Total Savings</span>
          <span>₹{totalSavings.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base mt-2">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default SummarySection;
