const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const multer = require('multer');
const pool = require('./db');
const cloudinary = require('cloudinary').v2;

// Initialize dotenv (for managing environment variables)
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://ecommerce-ic6h71vpo-pankajmohans-projects.vercel.app/ecommerce',
  'https://ecommerce-brown-three-70.vercel.app',
  // 'http://localhost:3000'  // Add localhost for local development
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins in development and only specified ones in production
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Other middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (process.env.NODE_ENV === 'development') {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: process.env.NODE_ENV === 'development' ? storage : undefined,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only images are allowed.'));
    }
    cb(null, true);
  }
});

// Fetch products
app.get('/api/show_products', async (req, res) => {
  const client = await pool.connect();
  try {
    const productQuery = `
      SELECT p.id AS product_id, p.name AS product_name, p.description, p.note, p.stock, p.price, p.discount, p.category, p.tags, p.brand, 
             pi.image_url 
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
    `;

    const result = await client.query(productQuery);
    const products = result.rows.reduce((acc, row) => {
      const { product_id, product_name, description, note, stock, price, discount, category, tags, brand, image_url } = row;

      if (!acc[product_id]) {
        acc[product_id] = {
          product_id,
          product_name,
          description,
          note,
          stock,
          price,
          discount,
          category,
          tags,
          brand,
          images: []
        };
      }

      acc[product_id].images.push(image_url);
      return acc;
    }, {});

    res.status(200).json({
      message: 'Products fetched successfully',
      products: Object.values(products)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  } finally {
    client.release();
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Accept up to 4 image fields
app.post('/api/products', upload.fields([
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'image_4', maxCount: 1 }
]), async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      name,
      description,
      note,
      stock,
      price,
      discount,
      category,
      tags,
      brand
    } = req.body;

    const files = req.files;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const priceNum = parseFloat(price);
    const discountNum = parseFloat(discount) || 0;

    if (!name || !description || !stock || !price || !category || !brand) {
      return res.status(400).json({
        message: 'Validation error',
        error: 'All fields except tags and note are required.'
      });
    }

    const productInsert = await client.query(
      `INSERT INTO products (name, description, note, stock, price, discount, category, tags, brand) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [name, description, note, stock, priceNum, discountNum, category, tagsArray, brand]
    );
    const productId = productInsert.rows[0].id;

    if (process.env.NODE_ENV === 'production') {
      const uploadPromises = Object.keys(files).map((field) =>
        Promise.all(files[field].map((file) =>
          cloudinary.uploader.upload(file.path, { folder: 'products' })
        ))
      );

      const cloudinaryResults = await Promise.all(uploadPromises.flat());
      await Promise.all(
        cloudinaryResults.map((result) =>
          client.query(
            `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
            [productId, result.secure_url]
          )
        )
      );
    } else {
      const localInserts = Object.keys(files).map((field) =>
        files[field].map((file) =>
          client.query(
            `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
            [productId, `/uploads/${file.filename}`]
          )
        )
      );
      await Promise.all(localInserts.flat());
    }

    res.status(200).json({
      message: 'Product submitted successfully',
      productId
    });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(409).json({
        message: 'Conflict error',
        error: 'Product with similar name already exists.'
      });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } finally {
    client.release();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
