"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllClients = exports.removeVendor = exports.verifyVendor = exports.getAllVendors = exports.getPendingVendors = exports.getStats = void 0;
const index_1 = __importDefault(require("../db/index"));
// ================================================
// GET DASHBOARD STATS
// GET /api/admin/stats
// ================================================
const getStats = async (req, res) => {
    try {
        const [clientsResult, vendorsResult, plansResult, revenueResult, requestsResult, publicPlansResult,] = await Promise.all([
            // Total clients
            index_1.default.query(`SELECT COUNT(*) FROM users WHERE role = 'client'`),
            // Total verified vendors
            index_1.default.query(`SELECT COUNT(*) FROM vendor_profiles WHERE is_verified = true`),
            // Total plans
            index_1.default.query(`SELECT COUNT(*) FROM wedding_plans`),
            // Total revenue (paid invoices)
            index_1.default.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM invoices WHERE payment_status = 'paid'`),
            // Total accepted requests
            index_1.default.query(`SELECT COUNT(*) FROM service_requests WHERE status = 'accepted'`),
            // Total public plans
            index_1.default.query(`SELECT COUNT(*) FROM public_plans`),
        ]);
        // Plans by status
        const plansByStatus = await index_1.default.query(`SELECT status, COUNT(*) AS count
       FROM wedding_plans
       GROUP BY status`);
        // Revenue per vendor
        const revenuePerVendor = await index_1.default.query(`SELECT
         u.name AS vendor_name,
         vp.service_type,
         COALESCE(SUM(i.amount), 0) AS total_revenue,
         COUNT(sr.id) AS total_bookings
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       LEFT JOIN service_requests sr ON vp.id = sr.vendor_id AND sr.status = 'accepted'
       LEFT JOIN invoices i ON sr.id = i.service_request_id AND i.payment_status = 'paid'
       GROUP BY vp.id, u.name, vp.service_type
       ORDER BY total_revenue DESC`);
        res.json({
            overview: {
                total_clients: parseInt(clientsResult.rows[0].count),
                total_vendors: parseInt(vendorsResult.rows[0].count),
                total_plans: parseInt(plansResult.rows[0].count),
                total_revenue: parseFloat(revenueResult.rows[0].total),
                total_bookings: parseInt(requestsResult.rows[0].count),
                total_public_plans: parseInt(publicPlansResult.rows[0].count),
            },
            plans_by_status: plansByStatus.rows,
            revenue_per_vendor: revenuePerVendor.rows,
        });
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStats = getStats;
// ================================================
// GET PENDING VENDORS (awaiting verification)
// GET /api/admin/vendors/pending
// ================================================
const getPendingVendors = async (req, res) => {
    try {
        const result = await index_1.default.query(`SELECT
         vp.*,
         u.name  AS vendor_name,
         u.email AS vendor_email
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       WHERE vp.is_verified = false
       AND vp.is_active = true
       ORDER BY vp.created_at ASC`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get pending vendors error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getPendingVendors = getPendingVendors;
// ================================================
// GET ALL VENDORS
// GET /api/admin/vendors
// ================================================
const getAllVendors = async (req, res) => {
    try {
        const result = await index_1.default.query(`SELECT
         vp.*,
         u.name  AS vendor_name,
         u.email AS vendor_email,
         COUNT(DISTINCT sr.id) AS total_requests
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       LEFT JOIN service_requests sr ON vp.id = sr.vendor_id
       GROUP BY vp.id, u.name, u.email
       ORDER BY vp.created_at DESC`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get all vendors error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllVendors = getAllVendors;
// ================================================
// VERIFY VENDOR
// PATCH /api/admin/vendors/:id/verify
// ================================================
const verifyVendor = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await index_1.default.query(`UPDATE vendor_profiles
       SET is_verified = true
       WHERE id = $1
       RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.json({
            message: 'Vendor verified successfully',
            vendor: result.rows[0],
        });
    }
    catch (error) {
        console.error('Verify vendor error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.verifyVendor = verifyVendor;
// ================================================
// REMOVE VENDOR
// DELETE /api/admin/vendors/:id
// ================================================
const removeVendor = async (req, res) => {
    const { id } = req.params;
    try {
        // Soft delete — just deactivate
        const result = await index_1.default.query(`UPDATE vendor_profiles
       SET is_active = false
       WHERE id = $1
       RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.json({ message: 'Vendor removed successfully' });
    }
    catch (error) {
        console.error('Remove vendor error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.removeVendor = removeVendor;
// ================================================
// GET ALL CLIENTS
// GET /api/admin/clients
// ================================================
const getAllClients = async (req, res) => {
    try {
        const result = await index_1.default.query(`SELECT
         u.id,
         u.name,
         u.email,
         u.created_at,
         COUNT(DISTINCT wp.id) AS total_plans,
         COUNT(DISTINCT sr.id) AS total_requests
       FROM users u
       LEFT JOIN wedding_plans wp ON u.id = wp.client_id
       LEFT JOIN service_requests sr ON u.id = sr.client_id
       WHERE u.role = 'client'
       GROUP BY u.id
       ORDER BY u.created_at DESC`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get all clients error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllClients = getAllClients;
