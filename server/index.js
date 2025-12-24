require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. MANUAL CORS FIX (THE MAGIC FIX) ---
app.use((req, res, next) => {
  // Har request par yeh headers laga do
  res.header("Access-Control-Allow-Origin", "*"); // Sabko allow karo
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");

  // Agar browser pre-check (OPTIONS) kare, toh foran OK bol do
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
  res.json({ status: "Active", message: "Luxe Stone Backend is Working!" });
});

// Contact API
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, message: "Server Config Error" });
  }

  try {
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
    console.error("Email Error:", error);
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vercel Export
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}
module.exports = app;