import { Router } from 'express';
import {
  getStats,
  getPendingVendors,
  getAllVendors,
  verifyVendor,
  removeVendor,
  getAllClients,
} from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// All admin routes are protected and admin only
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats',                getStats);
router.get('/vendors',              getAllVendors);
router.get('/vendors/pending',      getPendingVendors);
router.patch('/vendors/:id/verify', verifyVendor);
router.delete('/vendors/:id',       removeVendor);
router.get('/clients',              getAllClients);

export default router;