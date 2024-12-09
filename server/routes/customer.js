import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getCustomerProjects } from '../controllers/customerController.js';

const router = express.Router();

// 基本的测试路由
router.get('/test', (req, res) => {
  res.json({ message: 'Customer route is working' });
});

// 移除身份验证中间件以便测试
// router.use(authenticateToken);
router.get('/projects', getCustomerProjects);

export default router;
