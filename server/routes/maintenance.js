import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllMaintenanceRecords,
  getMaintenanceRecordById,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord
} from '../controllers/maintenanceController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllMaintenanceRecords);
router.get('/:id', getMaintenanceRecordById);
router.post('/', createMaintenanceRecord);
router.put('/:id', updateMaintenanceRecord);
router.delete('/:id', deleteMaintenanceRecord);

export default router;