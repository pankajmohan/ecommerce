// server/server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const multer = require('multer');
const pool = require('./db');

// Initialize dotenv (for managing environment variables)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(cors({ origin: 'https://ecommerce-ic6h71vpo-pankajmohans-projects.vercel.app/ecommerce' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');  // Correct path for upload directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the correct upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only images are allowed.'));
    }
    cb(null, true);
  },
});
// Fetch products
app.get('/api/show_products', async (req, res) => {
  const client = await pool.connect();
  try {
    // Fetch all products and their images from the database
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
          images: [],
        };
      }

      acc[product_id].images.push(image_url); // Push image URLs into the images array
      return acc;
    }, {});

    res.status(200).json({
      message: 'Products fetched successfully',
      products: Object.values(products),
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
      name,  // Assuming the input field is 'name'
      description,
      note,
      stock,
      price,
      discount,
      category,
      tags,
      brand
    } = req.body;

    const files = req.files; // Object of files (e.g., image_1, image_2, etc.)

    // Handle tags as an array
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    // Convert price and discount to numbers
    const priceNum = parseFloat(price);
    const discountNum = parseFloat(discount) || 0;  // Default to 0 if discount is undefined

    // Insert the product into the database first
    const productInsert = await client.query(
      `INSERT INTO products (name, description, note, stock, price, discount, category, tags, brand) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [name, description, note, stock, priceNum, discountNum, category, tagsArray, brand]
    );
    const productId = productInsert.rows[0].id;

    // Process the image file uploads and store the paths in the database
    const imageInserts = Object.keys(files).map((field) =>
      files[field].map((file) => 
        client.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
          [productId, `/uploads/${file.filename}`]  // Store image path in DB
        )
      )
    );

    await Promise.all(imageInserts.flat());

    res.status(200).json({
      message: 'Product submitted successfully',
      productId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    client.release();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
