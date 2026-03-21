"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendorsController_1 = require("../controllers/vendorsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', vendorsController_1.getVendors);
router.get('/:id', vendorsController_1.getVendorById);
router.get('/:id/availability', vendorsController_1.getAvailability);
// Protected — vendors only
router.use(authMiddleware_1.protect);
router.post('/', (0, authMiddleware_1.restrictTo)('vendor', 'admin'), vendorsController_1.createVendorProfile);
router.put('/:id', (0, authMiddleware_1.restrictTo)('vendor', 'admin'), vendorsController_1.updateVendorProfile);
router.post('/:id/availability', (0, authMiddleware_1.restrictTo)('vendor', 'admin'), vendorsController_1.addAvailability);
router.post('/:id/gallery', (0, authMiddleware_1.restrictTo)('vendor', 'admin'), vendorsController_1.addGalleryImage);
exports.default = router;
