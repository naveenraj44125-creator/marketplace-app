import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { products, reviews } from '../db/store.js';
import { authenticate, isSeller } from '../middleware/auth.js';
import { getUploadUrl, deleteImage } from '../services/s3.js';

const router = Router();

// Get presigned URL for image upload
router.post('/upload-url', authenticate, isSeller, async (req, res) => {
  try {
    const { fileType } = req.body;
    const result = await getUploadUrl(fileType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Create product
router.post('/', authenticate, isSeller, (req, res) => {
  const { name, description, price, imageUrl, imageKey, category } = req.body;
  const product = {
    id: uuid(),
    sellerId: req.user.id,
    sellerName: req.user.name,
    name, description, price: parseFloat(price), imageUrl, imageKey, category,
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  res.status(201).json(product);
});

// Get all products
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = products;
  if (category) result = result.filter(p => p.category === category);
  if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  
  // Add average rating to each product
  result = result.map(p => {
    const productReviews = reviews.filter(r => r.productId === p.id);
    const avgRating = productReviews.length ? productReviews.reduce((a, r) => a + r.rating, 0) / productReviews.length : 0;
    return { ...p, avgRating, reviewCount: productReviews.length };
  });
  res.json(result);
});

// Get single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const productReviews = reviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.length ? productReviews.reduce((a, r) => a + r.rating, 0) / productReviews.length : 0;
  res.json({ ...product, avgRating, reviewCount: productReviews.length, reviews: productReviews });
});

// Get seller's products
router.get('/seller/my-products', authenticate, isSeller, (req, res) => {
  res.json(products.filter(p => p.sellerId === req.user.id));
});

// Delete product
router.delete('/:id', authenticate, isSeller, async (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id && p.sellerId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  if (products[idx].imageKey) await deleteImage(products[idx].imageKey);
  products.splice(idx, 1);
  res.json({ success: true });
});

export default router;
