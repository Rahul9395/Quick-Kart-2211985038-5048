import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { toast } from 'react-toastify';

function CartProductItem({ item }) {
  const { removeFromCart, updateCartQuantity, cartItems, setCartItems } = useUser();
  const product = item?.productId;

  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleDecrease = async () => {
    if (item.quantity <= 1) return;

    setLoading(true);
    const success = await updateCartQuantity(product._id, item.quantity - 1);
    if (success) {
      const updatedItems = cartItems.map((cartItem) =>
        cartItem.productId._id === product._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCartItems(updatedItems);
    } else {
      toast.error("Could not decrease quantity.");
    }
    setLoading(false);
  };

  const handleIncrease = async () => {
    if (item.quantity >= product.stock) return;

    setLoading(true);
    const success = await updateCartQuantity(product._id, item.quantity + 1);
    if (success) {
      const updatedItems = cartItems.map((cartItem) =>
        cartItem.productId._id === product._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedItems);
    } else {
      toast.error("Could not increase quantity.");
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    const removed = await removeFromCart(product._id);
    if (!removed) {
      toast.error("Could not remove item.");
    }
    setLoading(false);
  };

  const itemTotalPrice = (product.price * item.quantity).toFixed(2);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200 transition-all duration-200 hover:shadow-xl">
      <Link to={`/product/${product._id}`} className="flex-shrink-0">
        <img
          src={product?.images?.[0]?.url || 'https://placehold.co/96x96/E0E0E0/333333?text=Product'}
          alt={product?.name}
          className="w-24 h-24 object-cover rounded-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/96x96/E0E0E0/333333?text=Product';
          }}
        />
      </Link>

      <div className="flex-1 w-full flex flex-col justify-between">
        <div>
          <Link to={`/product/${product._id}`} className="text-xl font-bold text-gray-800 hover:underline">
            {product?.name}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{product?.brand}</p>
        </div>

        {(item.size || item.color) && (
          <div className="mt-2 text-sm text-gray-600">
            {item.size && <p>Size: <span className="font-medium">{item.size}</span></p>}
            {item.color && <p>Color: <span className="font-medium">{item.color}</span></p>}
          </div>
        )}

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || loading}
              className={`p-2 ${item.quantity <= 1 || loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'} text-gray-700 rounded-full shadow-sm`}
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>

            <span className="text-lg font-bold text-gray-800 min-w-[30px] text-center">{item.quantity}</span>

            <button
              onClick={handleIncrease}
              disabled={item.quantity >= product.stock || loading}
              className={`p-2 ${item.quantity >= product.stock || loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'} text-gray-700 rounded-full shadow-sm`}
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 mt-2 sm:mt-0">
            <p className="text-sm text-gray-600">
              Price: ₹ {product?.price.toFixed(2)} / item
            </p>
            <p className="text-xl font-semibold text-gray-900">
              Total: ₹ {itemTotalPrice}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium text-sm"
            disabled={loading}
          >
            <Trash2 size={18} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartProductItem;
