import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { users } from '../db/store.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, name, role = 'buyer' } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const user = {
    id: uuid(),
    email,
    password: await bcrypt.hash(password, 10),
    name,
    role, // 'buyer' or 'seller'
  };
  users.push(user);
  const token = jwt.sign({ id: user.id, email, name, role }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, email, name, role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email, name: user.name, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default router;
