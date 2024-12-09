import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart
} from '../controllers/sparePartsController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllSpareParts);
router.get('/:id', getSparePartById);
router.post('/', createSparePart);
router.put('/:id', updateSparePart);
router.delete('/:id', deleteSparePart);

export default router;