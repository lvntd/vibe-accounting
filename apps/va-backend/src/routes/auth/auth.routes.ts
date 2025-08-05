import express from 'express';
import { login, me, signup } from '@/controllers';

const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/me', me);

export { authRoutes };
