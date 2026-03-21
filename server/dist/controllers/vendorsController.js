"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGalleryImage = exports.getAvailability = exports.addAvailability = exports.updateVendorProfile = exports.getVendorById = exports.getVendors = exports.createVendorProfile = void 0;
const index_1 = __importDefault(require("../db/index"));
// ================================================
// CREATE VENDOR PROFILE
// POST /api/vendors
// ================================================
const createVendorProfile = async (req, res) => {
    const user_id = req.user.id;
    const { service_type, description, base_price, location } = req.body;
    try {
        // Check if vendor profile already exists
        const existing = await index_1.default.query(`SELECT id FROM vendor_profiles WHERE user_id = $1`, [user_id]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Vendor profile already exists' });
        }
        const result = await index_1.default.query(`INSERT INTO vendor_profiles
        (user_id, service_type, description, base_price, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [user_id, service_type, description, base_price, location]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create vendor profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createVendorProfile = createVendorProfile;
// ================================================
// GET ALL VERIFIED VENDORS
// GET /api/vendors
// ================================================
const getVendors = async (req, res) => {
    const { service_type, location, search } = req.query;
    try {
        let query = `
      SELECT
        vp.*,
        u.name  AS vendor_name,
        u.email AS vendor_email,
        COUNT(DISTINCT vg.id) AS gallery_count
      FROM vendor_profiles vp
      JOIN users u ON vp.user_id = u.id
      LEFT JOIN vendor_gallery vg ON vp.id = vg.vendor_id
      WHERE vp.is_verified = true
      AND vp.is_active = true
    `;
        const params = [];
        if (service_type) {
            params.push(service_type);
            query += ` AND vp.service_type = $${params.length}`;
        }
        if (location) {
            params.push(`%${location}%`);
            query += ` AND vp.location ILIKE $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            query += ` AND (u.name ILIKE $${params.length} 
                 OR vp.description ILIKE $${params.length})`;
        }
        query += ` GROUP BY vp.id, u.name, u.email
               ORDER BY vp.created_at DESC`;
        const result = await index_1.default.query(query, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get vendors error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVendors = getVendors;
// ================================================
// GET SINGLE VENDOR WITH GALLERY + AVAILABILITY
// GET /api/vendors/:id
// ================================================
const getVendorById = async (req, res) => {
    const { id } = req.params;
    try {
        // Get vendor profile
        const vendorResult = await index_1.default.query(`SELECT
         vp.*,
         u.name  AS vendor_name,
         u.email AS vendor_email
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       WHERE vp.id = $1`, [id]);
        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        // Get gallery
        const galleryResult = await index_1.default.query(`SELECT * FROM vendor_gallery
       WHERE vendor_id = $1
       ORDER BY uploaded_at DESC`, [id]);
        // Get availability for next 3 months
        const availabilityResult = await index_1.default.query(`SELECT * FROM vendor_availability
       WHERE vendor_id = $1
       AND date >= CURRENT_DATE
       AND date <= CURRENT_DATE + INTERVAL '3 months'
       ORDER BY date ASC`, [id]);
        // Get total clients served
        const statsResult = await index_1.default.query(`SELECT COUNT(*) AS total_clients
       FROM service_requests
       WHERE vendor_id = $1
       AND status = 'accepted'`, [id]);
        res.json({
            ...vendorResult.rows[0],
            gallery: galleryResult.rows,
            availability: availabilityResult.rows,
            total_clients: statsResult.rows[0].total_clients,
        });
    }
    catch (error) {
        console.error('Get vendor error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVendorById = getVendorById;
// ================================================
// UPDATE VENDOR PROFILE
// PUT /api/vendors/:id
// ================================================
const updateVendorProfile = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { service_type, description, base_price, location } = req.body;
    try {
        const result = await index_1.default.query(`UPDATE vendor_profiles
       SET
         service_type = COALESCE($1, service_type),
         description  = COALESCE($2, description),
         base_price   = COALESCE($3, base_price),
         location     = COALESCE($4, location)
       WHERE id = $5 AND user_id = $6
       RETURNING *`, [service_type, description, base_price, location, id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update vendor error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateVendorProfile = updateVendorProfile;
// ================================================
// ADD AVAILABILITY DATES
// POST /api/vendors/:id/availability
// ================================================
const addAvailability = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { dates } = req.body; // array of date strings
    try {
        // Make sure vendor belongs to this user
        const vendor = await index_1.default.query(`SELECT id FROM vendor_profiles WHERE id = $1 AND user_id = $2`, [id, user_id]);
        if (vendor.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        // Insert all dates
        const insertPromises = dates.map((date) => index_1.default.query(`INSERT INTO vendor_availability (vendor_id, date)
         VALUES ($1, $2)
         ON CONFLICT (vendor_id, date) DO NOTHING`, [id, date]));
        await Promise.all(insertPromises);
        res.status(201).json({ message: `${dates.length} dates added successfully` });
    }
    catch (error) {
        console.error('Add availability error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addAvailability = addAvailability;
// ================================================
// GET VENDOR AVAILABILITY
// GET /api/vendors/:id/availability
// ================================================
const getAvailability = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await index_1.default.query(`SELECT * FROM vendor_availability
       WHERE vendor_id = $1
       AND date >= CURRENT_DATE
       ORDER BY date ASC`, [id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get availability error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAvailability = getAvailability;
// ================================================
// ADD GALLERY IMAGE
// POST /api/vendors/:id/gallery
// ================================================
const addGalleryImage = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { image_url } = req.body;
    try {
        // Make sure vendor belongs to this user
        const vendor = await index_1.default.query(`SELECT id FROM vendor_profiles WHERE id = $1 AND user_id = $2`, [id, user_id]);
        if (vendor.rows.length === 0) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        const result = await index_1.default.query(`INSERT INTO vendor_gallery (vendor_id, image_url)
       VALUES ($1, $2)
       RETURNING *`, [id, image_url]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Add gallery image error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addGalleryImage = addGalleryImage;
