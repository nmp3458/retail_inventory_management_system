
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';

import authRoutes from './src/routes/auth.routes.ts';
import { initializeAuth } from './src/config/auth.ts';
import connectDB from './src/config/db.ts';
import productRoutes from './src/routes/product.routes.ts';
import promotionRoutes from './src/routes/promotion.routes.ts';
import { initializePromotionSocket } from './src/services/promotion.socket.ts';

dotenv.config();

const app = express();
const args = process.argv;
const portIndex = args.indexOf('--port');

const PORT =
  portIndex !== -1
    ? Number(args[portIndex + 1])
    : Number(process.env.PORT || 3000);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images
app.use(
  '/uploads',
  express.static(path.resolve('uploads'))
);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);



const startServer = async () => {
  await connectDB();
  await initializeAuth();

  const httpServer = createServer(app);
  initializePromotionSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
