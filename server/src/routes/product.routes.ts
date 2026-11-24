
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
    const { name, category, price, stock, description, discount, color } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !description) {
      return res.status(400).json({
        message: 'Please provide all required product fields'
      });
    }

    const discountValue = discount === undefined || discount === ''
      ? 0
      : Number(discount);

    if (!Number.isFinite(discountValue) || discountValue < 0 || discountValue > 100) {
      return res.status(400).json({
        message: 'Discount must be between 0 and 100'
      });
    }

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      discount: discountValue,
      color: typeof color === 'string' ? color.trim() : '',
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

// Get products, optionally filtered by category and free-text search
router.get('/', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string'
      ? req.query.category
      : undefined;
    const search = typeof req.query.search === 'string'
      ? req.query.search.trim()
      : '';
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = {
      ...(category ? { category } : {}),
      ...(search ? {
        $or: [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { description: { $regex: escapedSearch, $options: 'i' } }
        ]
      } : {})
    };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    console.log('Fetched products:', products.length);
    return res.status(200).json({
      data: products
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to fetch products'
    });
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, stock, description, discount, color } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !description) {
      return res.status(400).json({
        message: 'Please provide all required product fields'
      });
    }

    const discountValue = discount === undefined || discount === ''
      ? 0
      : Number(discount);

    if (!Number.isFinite(discountValue) || discountValue < 0 || discountValue > 100) {
      return res.status(400).json({
        message: 'Discount must be between 0 and 100'
      });
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    existingProduct.name = name;
    existingProduct.category = category;
    existingProduct.price = Number(price);
    existingProduct.stock = Number(stock);
    existingProduct.description = description;
    existingProduct.discount = discountValue;
    existingProduct.color = typeof color === 'string' ? color.trim() : '';
    if (req.file) {
      existingProduct.image = `/uploads/products/${req.file.filename}`;
    }

    await existingProduct.save();

    return res.status(200).json({
      message: 'Product updated successfully',
      data: existingProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to update product'
    });
  }
});

export default router;
