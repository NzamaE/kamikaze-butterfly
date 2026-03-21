"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plansController_1 = require("../controllers/plansController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route — no auth needed
router.get('/public', plansController_1.getPublicPlans);
// Protected routes — must be logged in
router.use(authMiddleware_1.protect);
router.post('/', plansController_1.createPlan);
router.get('/', plansController_1.getPlans);
router.get('/:id', plansController_1.getPlanById);
router.put('/:id', plansController_1.updatePlan);
router.delete('/:id', plansController_1.deletePlan);
router.patch('/:id/publish', plansController_1.publishPlan);
exports.default = router;
