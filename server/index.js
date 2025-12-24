require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. CORS FIX (CREDENTIALS FALSE KAR DIYA) ---
app.use(cors({
  origin: "*", // Sabko allow karo (Mobile, Laptop, Localhost)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: false // <--- YEH HAI MAGIC FIX (Isay false rakhein)
}));

// Preflight Requests ko handle karo
app.options('*', cors());

app.use(express.json());

// --- ROUTES ---

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "Backend is Live & Fixed!" });
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
      subject: `New Contact Msg from ${name}`,
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