import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ROUTES ---

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ detail: 'User already exists.' });
    }
    user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ detail: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ detail: 'Invalid credentials.' });
    }
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ access_token: token });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});


// This is where your teammate's LLM logic will go eventually
app.post('/api/analyze', (req, res) => {
    // Placeholder for LLM analysis
    res.json({ message: 'This is the LLM analysis endpoint.'})
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});