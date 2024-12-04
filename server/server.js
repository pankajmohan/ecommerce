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
app.use(cors());
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
      productName,
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

    // Insert the product into the database first
    const productInsert = await client.query(
      `INSERT INTO products (product_name, description, note, stock, price, discount, category, tags, brand) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING product_id`,
      [productName, description, note, stock, price, discount, category, tags, brand]
    );
    const productId = productInsert.rows[0].product_id;

    // Process the image file uploads and store the paths in the database
    const imageInserts = Object.keys(files).map((field) =>
      files[field].map((file) => 
        client.query(
          `INSERT INTO product_images (product_id, file_path) VALUES ($1, $2)`,
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

// Test route to fetch users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Error querying the database:', err.stack);
    res.status(500).send('Error querying the database');
  }
});

// Fetch all products with their images
app.get('/api/products', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT p.product_id, p.product_name, p.note, p.price, 
             ARRAY_AGG(pi.file_path) AS images
      FROM products p
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      GROUP BY p.product_id
    `);

    res.status(200).json({ products: result.rows });
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    client.release();
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
