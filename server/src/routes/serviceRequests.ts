import { Router } from 'express';
import {
  createRequest,
  getClientRequests,
  getVendorRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from '../controllers/serviceRequestsController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/',              restrictTo('client'),         createRequest);
router.get('/client',         restrictTo('client'),         getClientRequests);
router.get('/vendor',         restrictTo('vendor'),         getVendorRequests);
router.patch('/:id/accept',   restrictTo('vendor', 'admin'), acceptRequest);
router.patch('/:id/reject',   restrictTo('vendor', 'admin'), rejectRequest);
router.patch('/:id/cancel',   restrictTo('client'),         cancelRequest);

export default router;