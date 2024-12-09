import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getProjectTypes,
  getRecommendedItems,
  createQuotation,
  getQuotations,
  getQuotationById
} from '../controllers/quotationController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/project-types', getProjectTypes);
router.get('/recommended-items', getRecommendedItems);
router.post('/', createQuotation);
router.get('/', getQuotations);
router.get('/:id', getQuotationById);

export default router;