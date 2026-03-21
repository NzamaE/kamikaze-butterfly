"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All admin routes are protected and admin only
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.restrictTo)('admin'));
router.get('/stats', adminController_1.getStats);
router.get('/vendors', adminController_1.getAllVendors);
router.get('/vendors/pending', adminController_1.getPendingVendors);
router.patch('/vendors/:id/verify', adminController_1.verifyVendor);
router.delete('/vendors/:id', adminController_1.removeVendor);
router.get('/clients', adminController_1.getAllClients);
exports.default = router;
