import { Router } from 'express';
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  publishPlan,
  getPublicPlans,
} from '../controllers/plansController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public route — no auth needed
router.get('/public', getPublicPlans);

// Protected routes — must be logged in
router.use(protect);
router.post('/',         createPlan);
router.get('/',          getPlans);
router.get('/:id',       getPlanById);
router.put('/:id',       updatePlan);
router.delete('/:id',    deletePlan);
router.patch('/:id/publish', publishPlan);

export default router;