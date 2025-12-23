import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { orders, products } from '../db/store.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Create order (purchase)
router.post('/', authenticate, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  const order = {
    id: uuid(),
    buyerId: req.user.id,
    buyerName: req.user.name,
    productId,
    productName: product.name,
    productImage: product.imageUrl,
    sellerId: product.sellerId,
    quantity,
    totalPrice: product.price * quantity,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

// Get buyer's orders
router.get('/my-orders', authenticate, (req, res) => {
  res.json(orders.filter(o => o.buyerId === req.user.id));
});

// Get seller's orders (sales)
router.get('/my-sales', authenticate, (req, res) => {
  res.json(orders.filter(o => o.sellerId === req.user.id));
});

export default router;
