import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { reviews, orders } from '../db/store.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Create review (only if purchased)
router.post('/', authenticate, (req, res) => {
  const { productId, rating, comment } = req.body;
  
  // Check if user purchased this product
  const hasPurchased = orders.some(o => o.buyerId === req.user.id && o.productId === productId);
  if (!hasPurchased) {
    return res.status(403).json({ error: 'You must purchase this product to review it' });
  }
  
  // Check if already reviewed
  const alreadyReviewed = reviews.some(r => r.userId === req.user.id && r.productId === productId);
  if (alreadyReviewed) {
    return res.status(400).json({ error: 'You have already reviewed this product' });
  }
  
  const review = {
    id: uuid(),
    productId,
    userId: req.user.id,
    userName: req.user.name,
    rating: parseInt(rating),
    comment,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  res.status(201).json(review);
});

// Get reviews for a product
router.get('/product/:productId', (req, res) => {
  res.json(reviews.filter(r => r.productId === req.params.productId));
});

export default router;
