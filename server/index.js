require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. CORS CONFIGURATION (FIXED) ---
// Yeh sabse zaroori hissa hai error hatane ke liye
app.use(cors({
  origin: "*", // Sabko allow karo (Localhost aur Live Website dono ko)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Preflight Requests ko handle karo (Browser check karta hai ke server allow kar raha hai ya nahi)
app.options('*', cors());

// Middleware
app.use(express.json());

// --- ROUTES ---

// 1. Test Route
app.get('/', (req, res) => {
  res.json({ 
    status: "Success", 
    message: "Luxe Stone Backend is Live & Ready!" 
  });
});

// 2. Contact Form Email API
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Check secrets
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, message: "Server Config Error: Credentials missing" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: email, // Sender ka email (Note: Gmail isay override karke owner ka email dikha sakta hai)
      to: process.env.EMAIL_USER, // Admin ko email jayegi
      subject: `New Contact Msg from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    console.error("Contact Email Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Order Confirmation Email API
app.post('/api/order-email', async (req, res) => {
  const { customer_name, total_amount, orderId, cart_items, payment_method } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    // Items List Format
    const itemsList = cart_items 
      ? cart_items.map(i => `- ${i.name} (x${i.quantity})`).join('\n')
      : "No items details";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin Email
      subject: `📢 New Order #${orderId} - Rs. ${total_amount}`,
      text: `
        🎉 NEW ORDER RECEIVED!
        
        Order ID: #${orderId}
        Customer: ${customer_name}
        Amount: Rs. ${total_amount}
        Payment: ${payment_method || 'COD'}
        
        ITEMS:
        ${itemsList}
        
        Login to Admin Panel for details.
      `
    });

    res.status(200).json({ success: true, message: 'Order Email sent!' });

  } catch (error) {
    console.error("Order Email Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- VERCEL EXPORT SETUP ---
// Agar Localhost hai to port par chalao
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on port ${PORT}`);
  });
}

// Vercel ke liye App ko Export karo
module.exports = app;