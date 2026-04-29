import React, { useState } from 'react';
import SummarySection from '../components/SummarySection';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Home, CreditCard, ShoppingCart, Check, Package } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import CODSuccess from './CODSuccess'


function CheckOut() {
    const { user, token, cartItems, url } = useUser();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [ps,setPS]= useState(false);
    const [orderId, setOrderId] = useState(null);



    const calculateTotalAmount = () => {
        let subtotal = 0;

        cartItems.forEach(item => {
            const product = item.productId;
            const discount = product.discount || 0;
            const discountedPrice = product.price - (product.price * discount / 100);
            subtotal += discountedPrice * item.quantity;
        });

        const deliveryCharge = 50;
        const platformFee = 20;

        const total = subtotal + deliveryCharge + platformFee;


        return Number(total.toFixed(2));
    };


    const placeOrder = async () => {
        if (!user?.address?.phone) {
            toast.error("Please add a delivery address before placing order.");
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        const orderPayload = {
            cartItems,
            paymentMethod,
            totalAmount: calculateTotalAmount(),
        };

        try {
            setLoading(true);

            if (paymentMethod === 'cod') {


                const confirmed = window.confirm("Are you sure you want to place this order with Cash on Delivery?");
                if (!confirmed) return;
                const { data } = await axios.post(
                    `${url}/api/users/orders/create`,
                    orderPayload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (data.success) {
                   setOrderId(data.orderId); // assuming backend sends back orderId
                setPS(true); // show COD success page
                } else {
                    toast.error(data.message || "Failed to place order.");
                }
            } else {

                const { data } = await axios.post(
                    `${url}/api/users/orders/payment/checkout`,
                    orderPayload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (data.sessionUrl) {
                    window.location.href = data.sessionUrl;
                } else {
                    toast.error("Unable to redirect to payment.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

  if (ps) {
    return <CODSuccess orderId={orderId} />;
}


    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Page Title */}
            <div className="flex items-center gap-3">
                <ShoppingCart size={28} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            </div>

            {/* Address + Summary in Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Address Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Home size={20} className="text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-700">Delivery Address</h2>
                    </div>

                    {user?.address?.phone ? (
                        <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                            {/* User Name */}
                            <p className="font-medium text-gray-800">{user.name}</p>

                            {/* Address */}
                            <p>{user.address.houseName}, {user.address.street}</p>
                            <p>{user.address.landmark}</p>
                            <p>{user.address.city}, {user.address.state} - {user.address.zip}</p>
                            <p>{user.address.country}</p>
                            <p>Phone: {user.address.phone}</p>
                        </div>
                    ) : (
                        <p className="text-red-600 text-sm">
                            No address available. Please update your address before placing order.
                        </p>
                    )}
                </div>


                {/* Order Summary */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <SummarySection />
                </div>
            </div>

            {/* Payment Method (Full Width) */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={20} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-700">Select Payment Method</h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 text-sm text-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-blue-600"
                        />
                        Cash on Delivery
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            checked={paymentMethod === 'online'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-blue-600"
                        />
                        Pay Online (Stripe)
                    </label>
                </div>
            </div>

            {/* Place Order Button */}
            <div className="text-right">
                <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                </button>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
                    <p className="text-sm text-gray-600">SSL encrypted and secure</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                    <p className="text-sm text-gray-600">2-3 business days</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
