import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../controllers/materialsController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router;