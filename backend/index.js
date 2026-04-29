const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const morgan = require('morgan');

const userRoute=require('./routes/userRoute');
const connectDB=require('./config/db');
const posterRoute = require('./routes/posterRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
dotenv.config();

const app=express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



const PORT=process.env.PORT||5000;

app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to QuickKart API</h1>
        <p>Your backend server is up and running.</p>
    `)
});

// admin route 
app.use("/api/users", userRoute);
app.use('/api/posters', posterRoute);
app.use('/api/category', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

// user

app.use('/api/users/posters',posterRoute);
app.use('/api/users/categories', categoryRoute);
app.use('/api/users/products', productRoute);
app.use('/api/users/cart', cartRoute);
app.use('/api/users/orders',orderRoute);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});