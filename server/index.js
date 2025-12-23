require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. MANUAL CORS MIDDLEWARE (Sabse Pehle) ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Sabko allow karo
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Agar browser OPTIONS request bheje (Preflight), toh wahin OK kar do
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// --- 2. Standard Middleware ---
app.use(express.json());

// --- ROUTES ---

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Backend is Live & CORS Enabled!" });
});

// Contact API
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Check credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing Email Credentials on Server");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact: ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`
    });

    res.status(200).json({ success: true, message: 'Email sent!' });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Order Email API
app.post('/api/order-email', async (req, res) => {
  const { customer_name, total_amount, orderId, cart_items, payment_method } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const itemsList = cart_items ? cart_items.map(i => `${i.name} (x${i.quantity})`).join('\n') : "";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order #${orderId}`,
      text: `Customer: ${customer_name}\nAmount: Rs. ${total_amount}\nPayment: ${payment_method}\n\nItems:\n${itemsList}`
    });

    res.status(200).json({ success: true, message: 'Order Email sent!' });

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- VERCEL EXPORT ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}
module.exports = app;