// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Note: MongoDB connection removed because we use Supabase ---

// Test Route
app.get('/', (req, res) => {
  res.send('Luxe Stone Email Server is Running!');
});

// 1. CONTACT FORM EMAIL API
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Msg from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 2. ORDER CONFIRMATION EMAIL API
app.post('/api/order-email', async (req, res) => {
  const { customer_name, email, phone, address, total_amount, cart_items, orderId, payment_method } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    // Products list format karna
    const productDetails = cart_items.map(item => 
      `- ${item.name} (Qty: ${item.quantity}) = Rs. ${item.price * item.quantity}`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: process.env.EMAIL_USER,   // Admin ko email aayegi
      subject: `📢 New Order #${orderId} from ${customer_name}`,
      text: `
        🎉 Congratulations! A new order has arrived.
        
        ------------------------------------
        ORDER DETAILS:
        Order ID: #${orderId}
        Total Amount: Rs. ${total_amount}
        Payment Method: ${payment_method ? payment_method.toUpperCase() : 'COD'}
        ------------------------------------
        
        CUSTOMER DETAILS:
        Name: ${customer_name}
        Phone: ${phone}
        Email: ${email}
        Address: ${address}

        ------------------------------------
        PRODUCTS ORDERED:
        ${productDetails}
        ------------------------------------
        
        Please go to the Admin Panel and check.
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Order Email sent!' });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// --- VERCEL DEPLOYMENT SETUP ---

// Sirf Localhost par chalane ke liye (Vercel par ye ignore hoga)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

// Vercel ke liye Export zaroori hai
module.exports = app;