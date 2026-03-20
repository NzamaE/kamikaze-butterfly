import { Request, Response } from 'express';
import pool from '../db/index';

// ================================================
// GET DASHBOARD STATS
// GET /api/admin/stats
// ================================================
export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      clientsResult,
      vendorsResult,
      plansResult,
      revenueResult,
      requestsResult,
      publicPlansResult,
    ] = await Promise.all([
      // Total clients
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'client'`),
      // Total verified vendors
      pool.query(`SELECT COUNT(*) FROM vendor_profiles WHERE is_verified = true`),
      // Total plans
      pool.query(`SELECT COUNT(*) FROM wedding_plans`),
      // Total revenue (paid invoices)
      pool.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM invoices WHERE payment_status = 'paid'`),
      // Total accepted requests
      pool.query(`SELECT COUNT(*) FROM service_requests WHERE status = 'accepted'`),
      // Total public plans
      pool.query(`SELECT COUNT(*) FROM public_plans`),
    ]);

    // Plans by status
    const plansByStatus = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM wedding_plans
       GROUP BY status`
    );

    // Revenue per vendor
    const revenuePerVendor = await pool.query(
      `SELECT
         u.name AS vendor_name,
         vp.service_type,
         COALESCE(SUM(i.amount), 0) AS total_revenue,
         COUNT(sr.id) AS total_bookings
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       LEFT JOIN service_requests sr ON vp.id = sr.vendor_id AND sr.status = 'accepted'
       LEFT JOIN invoices i ON sr.id = i.service_request_id AND i.payment_status = 'paid'
       GROUP BY vp.id, u.name, vp.service_type
       ORDER BY total_revenue DESC`
    );

    res.json({
      overview: {
        total_clients:       parseInt(clientsResult.rows[0].count),
        total_vendors:       parseInt(vendorsResult.rows[0].count),
        total_plans:         parseInt(plansResult.rows[0].count),
        total_revenue:       parseFloat(revenueResult.rows[0].total),
        total_bookings:      parseInt(requestsResult.rows[0].count),
        total_public_plans:  parseInt(publicPlansResult.rows[0].count),
      },
      plans_by_status: plansByStatus.rows,
      revenue_per_vendor: revenuePerVendor.rows,
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET PENDING VENDORS (awaiting verification)
// GET /api/admin/vendors/pending
// ================================================
export const getPendingVendors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
         vp.*,
         u.name  AS vendor_name,
         u.email AS vendor_email
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       WHERE vp.is_verified = false
       AND vp.is_active = true
       ORDER BY vp.created_at ASC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get pending vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET ALL VENDORS
// GET /api/admin/vendors
// ================================================
export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
         vp.*,
         u.name  AS vendor_name,
         u.email AS vendor_email,
         COUNT(DISTINCT sr.id) AS total_requests
       FROM vendor_profiles vp
       JOIN users u ON vp.user_id = u.id
       LEFT JOIN service_requests sr ON vp.id = sr.vendor_id
       GROUP BY vp.id, u.name, u.email
       ORDER BY vp.created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get all vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// VERIFY VENDOR
// PATCH /api/admin/vendors/:id/verify
// ================================================
export const verifyVendor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE vendor_profiles
       SET is_verified = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      message: 'Vendor verified successfully',
      vendor: result.rows[0],
    });

  } catch (error) {
    console.error('Verify vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// REMOVE VENDOR
// DELETE /api/admin/vendors/:id
// ================================================
export const removeVendor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Soft delete — just deactivate
    const result = await pool.query(
      `UPDATE vendor_profiles
       SET is_active = false
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor removed successfully' });

  } catch (error) {
    console.error('Remove vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET ALL CLIENTS
// GET /api/admin/clients
// ================================================
export const getAllClients = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
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
       ORDER BY u.created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};