
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import Product from '../models/product.model.ts';

const router = Router();

const uploadDir = path.resolve('uploads/products');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

const fileFilter: multer.Options['fileFilter'] =
  (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }

    cb(null, true);
  };

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Add product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !description) {
      return res.status(400).json({
        message: 'Please provide all required product fields'
      });
    }

    console.log('Received product data:', { name, category, price, stock, description });
    console.log('Received file:', req.file);
    console.log('File name:', req.file ? req.file.filename : 'No file uploaded');

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      image: req.file
        ? `/uploads/products/${req.file.filename}`
        : ''
    });

    return res.status(201).json({
      message: 'Product added successfully',
      data: product
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Unable to add product'
    });
  }
});

// Get all products, optionally filtered by category
router.get('/', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string'
      ? req.query.category
      : undefined;
    const products = await Product.find(category ? { category } : {}).sort({ createdAt: -1 });

    return res.status(200).json({
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to fetch products'
    });
  }
});

export default router;
