import { Request, Response } from 'express';
import pool from '../db/index';

// ================================================
// CREATE VENDOR PROFILE
// POST /api/vendors
// ================================================
export const createVendorProfile = async (req: Request, res: Response) => {
  const user_id = (req as any).user.id;
  const { service_type, description, base_price, location } = req.body;

  try {
    // Check if vendor profile already exists
    const existing = await pool.query(
      `SELECT id FROM vendor_profiles WHERE user_id = $1`,
      [user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Vendor profile already exists' });
    }

    const result = await pool.query(
      `INSERT INTO vendor_profiles
        (user_id, service_type, description, base_price, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, service_type, description, base_price, location]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Create vendor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET ALL VERIFIED VENDORS
// GET /api/vendors
// ================================================
export const getVendors = async (req: Request, res: Response) => {
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

    const params: any[] = [];

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

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET SINGLE VENDOR WITH GALLERY + AVAILABILITY
// GET /api/vendors/:id
// ================================================
export const getVendorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Get vendor profile
    const vendorResult = await pool.query(
      `SELECT
         vp.*,
         u.name  AS vendor_name,
         u.email AS vendor_email
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       WHERE vp.id = $1`,
      [id]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get gallery
    const galleryResult = await pool.query(
      `SELECT * FROM vendor_gallery
       WHERE vendor_id = $1
       ORDER BY uploaded_at DESC`,
      [id]
    );

    // Get availability for next 3 months
    const availabilityResult = await pool.query(
      `SELECT * FROM vendor_availability
       WHERE vendor_id = $1
       AND date >= CURRENT_DATE
       AND date <= CURRENT_DATE + INTERVAL '3 months'
       ORDER BY date ASC`,
      [id]
    );

    // Get total clients served
    const statsResult = await pool.query(
      `SELECT COUNT(*) AS total_clients
       FROM service_requests
       WHERE vendor_id = $1
       AND status = 'accepted'`,
      [id]
    );

    res.json({
      ...vendorResult.rows[0],
      gallery: galleryResult.rows,
      availability: availabilityResult.rows,
      total_clients: statsResult.rows[0].total_clients,
    });

  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// UPDATE VENDOR PROFILE
// PUT /api/vendors/:id
// ================================================
export const updateVendorProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user.id;
  const { service_type, description, base_price, location } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vendor_profiles
       SET
         service_type = COALESCE($1, service_type),
         description  = COALESCE($2, description),
         base_price   = COALESCE($3, base_price),
         location     = COALESCE($4, location)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [service_type, description, base_price, location, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// ADD AVAILABILITY DATES
// POST /api/vendors/:id/availability
// ================================================
export const addAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user.id;
  const { dates } = req.body; // array of date strings

  try {
    // Make sure vendor belongs to this user
    const vendor = await pool.query(
      `SELECT id FROM vendor_profiles WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (vendor.rows.length === 0) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    // Insert all dates
    const insertPromises = dates.map((date: string) =>
      pool.query(
        `INSERT INTO vendor_availability (vendor_id, date)
         VALUES ($1, $2)
         ON CONFLICT (vendor_id, date) DO NOTHING`,
        [id, date]
      )
    );

    await Promise.all(insertPromises);

    res.status(201).json({ message: `${dates.length} dates added successfully` });

  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET VENDOR AVAILABILITY
// GET /api/vendors/:id/availability
// ================================================
export const getAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM vendor_availability
       WHERE vendor_id = $1
       AND date >= CURRENT_DATE
       ORDER BY date ASC`,
      [id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// ADD GALLERY IMAGE
// POST /api/vendors/:id/gallery
// ================================================
export const addGalleryImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user.id;
  const { image_url } = req.body;

  try {
    // Make sure vendor belongs to this user
    const vendor = await pool.query(
      `SELECT id FROM vendor_profiles WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (vendor.rows.length === 0) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const result = await pool.query(
      `INSERT INTO vendor_gallery (vendor_id, image_url)
       VALUES ($1, $2)
       RETURNING *`,
      [id, image_url]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Add gallery image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};