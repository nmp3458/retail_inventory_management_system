
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './src/config/db.ts';
import productRoutes from './src/routes/product.routes.ts';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use(
  '/uploads',
  express.static(path.resolve('uploads'))
);

// Product APIs
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
