import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;