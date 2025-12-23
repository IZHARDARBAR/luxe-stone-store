require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS SETUP (MOST IMPORTANT) ---
// Iska matlab hai: "Duniya ki kisi bhi website ko ye API use karne do"
// Isse connection error khatam ho jayega.
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---

// 1. Test Route (Jo browser mein dikhta hai)
app.get('/', (req, res) => {
  res.json({ status: "Success", message: "Luxe Stone Backend is Live & Running!" });
});

// 2. Contact Email API
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Msg from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    });
    res.status(200).json({ success: true, message: 'Email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Order Email API
app.post('/api/order-email', async (req, res) => {
  const { customer_name, total_amount, orderId, cart_items, payment_method } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const itemsList = cart_items.map(i => `${i.name} (x${i.quantity})`).join('\n');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order #${orderId}`,
      text: `Customer: ${customer_name}\nAmount: Rs. ${total_amount}\nPayment: ${payment_method}\n\nItems:\n${itemsList}`
    });
    res.status(200).json({ success: true, message: 'Order Email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- VERCEL EXPORT (Zaroori Hai) ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;