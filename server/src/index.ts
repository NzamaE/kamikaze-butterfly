import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/index';
import authRoutes from './routes/auth';
import planRoutes from './routes/plans';
import vendorRoutes from './routes/vendors';
import requestRoutes from './routes/serviceRequests';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', message: 'Server and database are running' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});