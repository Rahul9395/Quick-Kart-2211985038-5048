const Order = require('../model/orderModel');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { startOfMonth, endOfMonth, startOfYear, endOfYear } = require("date-fns");




const createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { cartItems, paymentMethod, totalAmount } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No items to order.' });
        }

        // This version is for offline payments
        if (!paymentMethod || paymentMethod.toLowerCase() === 'stripe') {
            return res.status(400).json({ success: false, message: 'This route is only for offline payments.' });
        }

        const user = await User.findById(userId);
        if (!user || !user.address) {
            return res.status(400).json({ success: false, message: 'User address not found.' });
        }

        const deliveryCharge = 50; // INR
        const platformFee = 20;    // INR

        const items = cartItems.map(item => {
            const product = item.productId;
            const discountPercent = product.discount || 0;
            const basePrice = product.price;
            const quantity = item.quantity || 1;

            const discountedPrice = basePrice - (basePrice * discountPercent / 100);
            const finalPrice = +(discountedPrice * quantity).toFixed(2);

            return {
                productId: product._id,
                name: product.name,
                image: product.images[0]?.url || '',
                price: basePrice,
                discount: discountPercent,
                quantity,
                finalPrice
            };
        });

        const calculatedItemsTotal = items.reduce((sum, item) => {
            const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
            return sum + (discountedPrice * item.quantity);
        }, 0);

        const calculatedTotal = +(calculatedItemsTotal + deliveryCharge + platformFee).toFixed(2);

        if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
            return res.status(400).json({ success: false, message: 'Total amount mismatch.' });
        }

        // Create order
        const newOrder = await Order.create({
            user: userId,
            items: items,
            shippingInfo: {
                houseName: user.address.houseName || '',
                landmark: user.address.landmark || '',
                street: user.address.street || '',
                city: user.address.city,
                state: user.address.state,
                zip: user.address.zip,
                country: user.address.country || 'India',
                phone: user.address.phone,
            },
            paymentInfo: {
                method: paymentMethod,
                status: 'pending'
            },
            platformFee,
            deliveryCharge,
            totalAmount: calculatedTotal,
            status: 'Pending'
        });

        // Clear cart & add order history
        user.cart = [];
        if (!Array.isArray(user.orderHistory)) {
            user.orderHistory = [];
        }
        user.orderHistory.push(newOrder._id);

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Order placed successfully with offline payment.',
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, message: 'Failed to place order.' });
    }
};



const orderCheckOut = async (req, res) => {
    try {
        const userId = req.userId;
        const { cartItems, paymentMethod, totalAmount } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        if (!paymentMethod || paymentMethod.toLowerCase() === 'cod') {
            return res.status(400).json({ success: false, message: 'Checkout is only for online payments' });
        }

        const user = await User.findById(userId);
        if (!user || !user.address) {
            return res.status(400).json({ success: false, message: 'User address not found.' });
        }

        const deliveryCharge = 50; // INR
        const platformFee = 20;   // INR

        const items = cartItems.map(item => {
            const product = item.productId;
            const discountPercent = product.discount || 0;
            const basePrice = product.price;
            const quantity = item.quantity || 1;

            const discountedPrice = basePrice - (basePrice * discountPercent / 100);
            const finalPrice = +(discountedPrice * quantity).toFixed(2);

            return {
                productId: product._id,
                name: product.name,
                image: product.images[0]?.url || '',
                price: basePrice,
                discount: discountPercent,
                quantity,
                finalPrice
            };
        });

        const calculatedItemsTotal = items.reduce((sum, item) => {
            const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
            return sum + (discountedPrice * item.quantity);
        }, 0);

        const calculatedTotal = +(calculatedItemsTotal + deliveryCharge + platformFee).toFixed(2);

        if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
            return res.status(400).json({ success: false, message: 'Total amount mismatch.' });
        }

        // Stripe Line Items
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round((item.finalPrice / item.quantity) * 100), // in paise
            },
            quantity: item.quantity,
        }));

        // Add delivery charge
        if (deliveryCharge > 0) {
            lineItems.push({
                price_data: {
                    currency: 'inr',
                    product_data: { name: 'Delivery Charge' },
                    unit_amount: deliveryCharge * 100,
                },
                quantity: 1,
            });
        }

        // Add platform fee
        if (platformFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'inr',
                    product_data: { name: 'Platform Fee' },
                    unit_amount: platformFee * 100,
                },
                quantity: 1,
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        });

        // Create Order in DB with pending status
        const newOrder = await Order.create({
            user: userId,
            items: items,
            shippingInfo: {
                houseName: user.address.houseName || '',
                landmark: user.address.landmark || '',
                street: user.address.street || '',
                city: user.address.city,
                state: user.address.state,
                zip: user.address.zip,
                country: user.address.country || 'India',
                phone: user.address.phone,
            },
            paymentInfo: {
                method: paymentMethod,
                status: 'pending',
                sessionId: session.id, // Store Stripe sessionId here
            },
            platformFee,
            deliveryCharge,
            totalAmount: calculatedTotal,
            status: 'Pending',
        });

         user.cart = [];
        if (!Array.isArray(user.orderHistory)) {
            user.orderHistory = [];
        }
        user.orderHistory.push(newOrder._id);

        await user.save();

        return res.status(200).json({
            success: true,
            sessionUrl: session.url,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ success: false, message: 'Failed to initiate payment.' });
    }
};



const getSessionStatus = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }
    const order = await Order.findOne({ 'paymentInfo.sessionId': sessionId });
    order.paymentInfo.status = 'paid';
    await order.save();

    if (order) {
      return res.status(200).json({ success: true, message: 'Order found', orderId: order._id, payment_status:'paid' });
    } else {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

  } catch (err) {
    console.error('getSessionStatus error', err);
    return res.status(500).json({ success: false, message: 'Could not fetch session' });
  }
};



// const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error('⚠️  Webhook signature verification failed.', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the checkout.session.completed event
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     const metadata = session.metadata || {};
//     try {
//       const paymentIntentId = metadata.paymentIntentId;
//       const pi = await PaymentIntent.findById(paymentIntentId);
//       if (!pi) {
//         console.warn('PaymentIntent not found for id', paymentIntentId);
//       } else if (pi.status === 'paid') {
//         console.log('PaymentIntent already processed', paymentIntentId);
//       } else {
//         // Create real Order using pi.cartItems snapshot
//         const user = await User.findById(pi.user);
//         if (!user) throw new Error('User not found');

//         const order = new Order({
//           user: pi.user,
//           items: pi.cartItems,
//           shippingInfo: {
//             houseName: user.address.houseName,
//             landmark: user.address.landmark,
//             street: user.address.street,
//             city: user.address.city,
//             state: user.address.state,
//             zip: user.address.zip,
//             country: user.address.country,
//             phone: user.address.phone,
//           },
//           paymentInfo: {
//             method: 'card',
//             status: 'paid',
//             providerPaymentId: session.payment_intent
//           },
//           deliveryCharge: 50,
//           platformFee: 20,
//           totalAmount: pi.amount,
//           status: 'Paid'
//         });

//         await order.save();

//         // Clear the user's cart and push order history
//         user.cart = [];
//         user.orderHistory = user.orderHistory || [];
//         user.orderHistory.push(order._id);
//         await user.save();

//         // Update payment intent
//         pi.status = 'paid';
//         pi.providerPaymentId = session.payment_intent;
//         await pi.save();

//         console.log('Order created via webhook:', order._id.toString());
//       }
//     } catch (err) {
//       console.error('Error handling session.completed webhook', err);
//       // For production, consider retry logic or push to a queue for manual handling
//     }
//   }

//   // Other events you may want to handle: payment_intent.payment_failed, charge.refunded, etc.

//   res.json({ received: true });
// };

const stripeWebhook = async (req,res)=>{

}

const getAllOrders = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate('orderHistory');

    if (user) {
      // reverse orderHistory (latest first)
      const orders = [...user.orderHistory].reverse();

      return res.status(200).json({
        success: true,
        orders,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Cannot get orders",
      });
    }

  } catch (err) {
    console.log('Error in get orders:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch orders' });
  }
};


// const getAllOrdersForAdmin = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('user', 'name email') // Populate user details
//       .populate('items.productId', 'name price image category'); // Populate product details

//     return res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (err) {
//     console.error('Error in getAllOrdersForAdmin:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Could not fetch orders',
//       error: err.message,
//     });
//   }
// };


const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Populate user details
      .populate("items.productId", "name price image category"); // Populate product details

    // Map orders with deliveryBoy details included
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      user: order.user,
      items: order.items,
      shippingInfo: order.shippingInfo,
      paymentInfo: order.paymentInfo,
      platformFee: order.platformFee,
      deliveryCharge: order.deliveryCharge,
      totalAmount: order.totalAmount,
      status: order.status,
      orderedAt: order.orderedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      deliveryBoy: order.deliveryBoy || null, // ✅ include delivery boy info
    }));

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("Error in getAllOrdersForAdmin:", err);
    return res.status(500).json({
      success: false,
      message: "Could not fetch orders",
      error: err.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, deliveredBy } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;

    // Handle timestamps for Delivered / Cancelled
    if (status === "Delivered") {
      order.deliveredAt = new Date();
      if (deliveredBy) order.deliveredBy = deliveredBy;
    }
    if (status === "Cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Error in updateOrderStatus:", err);
    return res
      .status(500)
      .json({ success: false, message: "Could not update order status", error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId;

    // Find the order to update
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Allow cancel only if order is Pending or Processing
    if (order.status !== "Pending" && order.status !== "Processing") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this order as it is already being processed or has been completed.",
      });
    }

    // Update the order status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Order has been successfully cancelled.",
    });
  } catch (err) {
    console.error("Error cancelling order:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const getMonthlyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderedAt: {
        $gte: startOfMonth(new Date()),
        $lt: endOfMonth(new Date()),
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error in getMonthlyOrders:", err);
    return res.status(500).json({
      success: false,
      message: "Could not fetch monthly orders",
      error: err.message,
    });
  }
};

const getYearlyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderedAt: {
        $gte: startOfYear(new Date()),
        $lt: endOfYear(new Date()),
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error in getYearlyOrders:", err);
    return res.status(500).json({
      success: false,
      message: "Could not fetch yearly orders",
      error: err.message,
    });
  }
};



module.exports = {
    createOrder,
    orderCheckOut,
    getSessionStatus,
    stripeWebhook,
    getAllOrders,
    getAllOrdersForAdmin,
    updateOrderStatus,
    cancelOrder,
    getYearlyOrders,
    getMonthlyOrders
}