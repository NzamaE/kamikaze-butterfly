"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRequest = exports.rejectRequest = exports.acceptRequest = exports.getVendorRequests = exports.getClientRequests = exports.createRequest = void 0;
const index_1 = __importDefault(require("../db/index"));
// ================================================
// CREATE SERVICE REQUEST
// POST /api/requests
// ================================================
const createRequest = async (req, res) => {
    const client_id = req.user.id;
    const { vendor_id, plan_id, checklist_item_id, requested_date } = req.body;
    try {
        // Check vendor is verified and active
        const vendor = await index_1.default.query(`SELECT * FROM vendor_profiles
       WHERE id = $1 AND is_verified = true AND is_active = true`, [vendor_id]);
        if (vendor.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor not found or not verified' });
        }
        // Check vendor is available on that date
        const availability = await index_1.default.query(`SELECT * FROM vendor_availability
       WHERE vendor_id = $1
       AND date = $2
       AND is_booked = false`, [vendor_id, requested_date]);
        if (availability.rows.length === 0) {
            return res.status(400).json({ message: 'Vendor is not available on that date' });
        }
        // Check no duplicate request
        const duplicate = await index_1.default.query(`SELECT id FROM service_requests
       WHERE client_id = $1
       AND vendor_id = $2
       AND plan_id = $3
       AND status = 'pending'`, [client_id, vendor_id, plan_id]);
        if (duplicate.rows.length > 0) {
            return res.status(400).json({ message: 'You already have a pending request with this vendor' });
        }
        // Create the request
        const result = await index_1.default.query(`INSERT INTO service_requests
        (client_id, vendor_id, plan_id, checklist_item_id, requested_date, quoted_price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`, [client_id, vendor_id, plan_id, checklist_item_id, requested_date, vendor.rows[0].base_price]);
        // Update checklist item to in_progress
        if (checklist_item_id) {
            await index_1.default.query(`UPDATE checklist_items
         SET status = 'in_progress', vendor_id = $1, updated_at = NOW()
         WHERE id = $2`, [vendor_id, checklist_item_id]);
        }
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createRequest = createRequest;
// ================================================
// GET ALL REQUESTS FOR CLIENT
// GET /api/requests/client
// ================================================
const getClientRequests = async (req, res) => {
    const client_id = req.user.id;
    try {
        const result = await index_1.default.query(`SELECT
         sr.*,
         u.name          AS vendor_name,
         vp.service_type AS vendor_service,
         vp.location     AS vendor_location,
         wp.name         AS plan_name
       FROM service_requests sr
       JOIN vendor_profiles vp ON sr.vendor_id = vp.id
       JOIN users u ON vp.user_id = u.id
       JOIN wedding_plans wp ON sr.plan_id = wp.id
       WHERE sr.client_id = $1
       ORDER BY sr.created_at DESC`, [client_id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get client requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getClientRequests = getClientRequests;
// ================================================
// GET ALL REQUESTS FOR VENDOR
// GET /api/requests/vendor
// ================================================
const getVendorRequests = async (req, res) => {
    const user_id = req.user.id;
    try {
        // Get vendor profile
        const vendor = await index_1.default.query(`SELECT id FROM vendor_profiles WHERE user_id = $1`, [user_id]);
        if (vendor.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        const result = await index_1.default.query(`SELECT
         sr.*,
         u.name     AS client_name,
         u.email    AS client_email,
         wp.name    AS plan_name,
         wp.theme   AS plan_theme,
         wp.guest_count
       FROM service_requests sr
       JOIN users u ON sr.client_id = u.id
       JOIN wedding_plans wp ON sr.plan_id = wp.id
       WHERE sr.vendor_id = $1
       ORDER BY sr.created_at DESC`, [vendor.rows[0].id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get vendor requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVendorRequests = getVendorRequests;
// ================================================
// ACCEPT REQUEST
// PATCH /api/requests/:id/accept
// ================================================
const acceptRequest = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        // Get vendor profile
        const vendor = await index_1.default.query(`SELECT id FROM vendor_profiles WHERE user_id = $1`, [user_id]);
        if (vendor.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        // Get the request
        const requestResult = await index_1.default.query(`SELECT * FROM service_requests
       WHERE id = $1 AND vendor_id = $2 AND status = 'pending'`, [id, vendor.rows[0].id]);
        if (requestResult.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        const serviceRequest = requestResult.rows[0];
        // Accept the request
        await index_1.default.query(`UPDATE service_requests SET status = 'accepted' WHERE id = $1`, [id]);
        // Mark date as booked on vendor calendar
        await index_1.default.query(`UPDATE vendor_availability
       SET is_booked = true
       WHERE vendor_id = $1 AND date = $2`, [vendor.rows[0].id, serviceRequest.requested_date]);
        // Reject all other pending requests for same date
        await index_1.default.query(`UPDATE service_requests
       SET status = 'rejected'
       WHERE vendor_id = $1
       AND requested_date = $2
       AND id != $3
       AND status = 'pending'`, [vendor.rows[0].id, serviceRequest.requested_date, id]);
        // Auto generate invoice
        const invoice = await index_1.default.query(`INSERT INTO invoices (service_request_id, amount)
       VALUES ($1, $2)
       RETURNING *`, [id, serviceRequest.quoted_price]);
        // Update checklist item to in_progress
        if (serviceRequest.checklist_item_id) {
            await index_1.default.query(`UPDATE checklist_items
         SET status = 'in_progress', updated_at = NOW()
         WHERE id = $1`, [serviceRequest.checklist_item_id]);
        }
        res.json({
            message: 'Request accepted successfully',
            invoice: invoice.rows[0],
        });
    }
    catch (error) {
        console.error('Accept request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.acceptRequest = acceptRequest;
// ================================================
// REJECT REQUEST
// PATCH /api/requests/:id/reject
// ================================================
const rejectRequest = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const vendor = await index_1.default.query(`SELECT id FROM vendor_profiles WHERE user_id = $1`, [user_id]);
        if (vendor.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        const result = await index_1.default.query(`UPDATE service_requests
       SET status = 'rejected'
       WHERE id = $1 AND vendor_id = $2 AND status = 'pending'
       RETURNING *`, [id, vendor.rows[0].id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        // Reset checklist item back to pending
        const serviceRequest = result.rows[0];
        if (serviceRequest.checklist_item_id) {
            await index_1.default.query(`UPDATE checklist_items
         SET status = 'pending', vendor_id = NULL, updated_at = NOW()
         WHERE id = $1`, [serviceRequest.checklist_item_id]);
        }
        res.json({ message: 'Request rejected' });
    }
    catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.rejectRequest = rejectRequest;
// ================================================
// CANCEL REQUEST (client cancels)
// PATCH /api/requests/:id/cancel
// ================================================
const cancelRequest = async (req, res) => {
    const { id } = req.params;
    const client_id = req.user.id;
    try {
        const result = await index_1.default.query(`UPDATE service_requests
       SET status = 'cancelled'
       WHERE id = $1 AND client_id = $2 AND status = 'pending'
       RETURNING *`, [id, client_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        // Reset checklist item back to pending
        const serviceRequest = result.rows[0];
        if (serviceRequest.checklist_item_id) {
            await index_1.default.query(`UPDATE checklist_items
         SET status = 'pending', vendor_id = NULL, updated_at = NOW()
         WHERE id = $1`, [serviceRequest.checklist_item_id]);
        }
        res.json({ message: 'Request cancelled' });
    }
    catch (error) {
        console.error('Cancel request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.cancelRequest = cancelRequest;
