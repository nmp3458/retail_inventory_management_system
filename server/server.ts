import express from "express";
import cors from "cors";
import path from 'path';
import fs from 'fs';
import multer from "multer";


const app = express();
const PORT = 3000;


// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for Angular application
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static(
  path.join(process.cwd(), 'uploads')
));

// Home route
app.get("/", (req, res) => {
  res.send("Hello from Node.js Express Server!");
});

// API route
app.get("/api/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Classic White Shirt',
      category: 'Clothing',
      price: 1499,
      stock: 25,
      image: 'https://placehold.co/400x400?text=Shirt'
    },
    {
      id: 2,
      name: 'Urban Sneakers',
      category: 'Shoes',
      price: 2499,
      stock: 12,
      image: 'https://placehold.co/400x400?text=Shoes'
    },
    {
      id: 3,
      name: 'Classic Watch',
      category: 'Watches',
      price: 3999,
      stock: 8,
      image: 'https://placehold.co/400x400?text=Watch'
    },
    {
      id: 4,
      name: 'Leather Wallet',
      category: 'Accessories',
      price: 899,
      stock: 30,
      image: 'https://placehold.co/400x400?text=Wallet'
    }
  ]);
});

// POST API
app.post("/api/users", (req, res) => {
  const user = req.body;

  res.status(201).json({
    message: "User created successfully",
    user: user
  });
});



// Create product image directory
const uploadPath = path.join(process.cwd(), 'uploads/products');

fs.mkdirSync(uploadPath, { recursive: true });

// Serve uploaded images
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG and WEBP images are allowed'));
    }
  }
});

// Add product API
app.post('/api/products', upload.single('image'), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: 'Product image is required'
    });
  }

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    image: `/uploads/products/${req.file.filename}`
  };

  // TODO: Save newProduct in your database

  res.status(201).json({
    message: 'Product added successfully',
    product: newProduct
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
