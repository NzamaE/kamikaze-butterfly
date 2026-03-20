import { Router } from 'express';
import {
  createVendorProfile,
  getVendors,
  getVendorById,
  updateVendorProfile,
  addAvailability,
  getAvailability,
  addGalleryImage,
} from '../controllers/vendorsController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/',                     getVendors);
router.get('/:id',                  getVendorById);
router.get('/:id/availability',     getAvailability);

// Protected — vendors only
router.use(protect);
router.post('/',                    restrictTo('vendor', 'admin'), createVendorProfile);
router.put('/:id',                  restrictTo('vendor', 'admin'), updateVendorProfile);
router.post('/:id/availability',    restrictTo('vendor', 'admin'), addAvailability);
router.post('/:id/gallery',         restrictTo('vendor', 'admin'), addGalleryImage);

export default router;