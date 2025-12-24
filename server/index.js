require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS SETUP ---
app.use(cors({
  origin: "*", // Sabko allow karo
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false 
}));

app.use(express.json());

// --- ROUTES ---

// 1. Home Route
app.get('/', (req, res) => {
  res.status(200).send("Luxe Stone Server is Running!");
});

// 2. Contact API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact: ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Order Email API
app.post('/api/order-email', async (req, res) => {
  try {
    const { customer_name, total_amount, orderId, cart_items, payment_method } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemsList = Array.isArray(cart_items) 
      ? cart_items.map(i => `${i.name} (x${i.quantity})`).join('\n') 
      : "Items data missing";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order #${orderId}`,
      text: `Order #${orderId}\nCustomer: ${customer_name}\nTotal: Rs. ${total_amount}\nPayment: ${payment_method}\n\nItems:\n${itemsList}`
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- SERVER START ---
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;