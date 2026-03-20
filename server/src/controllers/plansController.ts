import { Request, Response } from 'express';
import pool from '../db/index';

// ================================================
// CREATE PLAN
// POST /api/plans
// ================================================
export const createPlan = async (req: Request, res: Response) => {
  const { name, budget, location, guest_count, theme, wedding_date } = req.body;
  const client_id = (req as any).user.id;

  try {
    const result = await pool.query(
      `INSERT INTO wedding_plans 
        (client_id, name, budget, location, guest_count, theme, wedding_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [client_id, name, budget, location, guest_count, theme, wedding_date]
    );

    const plan = result.rows[0];

    // Auto-generate all checklist items for the new plan
    const categories = [
      'venue', 'catering', 'cake', 'photography',
      'videography', 'flowers', 'decor', 'invitations',
      'makeup', 'outfits', 'entertainment', 'officiant'
    ];

    const checklistPromises = categories.map(category =>
      pool.query(
        `INSERT INTO checklist_items (plan_id, category)
         VALUES ($1, $2)`,
        [plan.id, category]
      )
    );

    await Promise.all(checklistPromises);

    res.status(201).json(plan);

  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET ALL PLANS FOR CLIENT
// GET /api/plans
// ================================================
export const getPlans = async (req: Request, res: Response) => {
  const client_id = (req as any).user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM wedding_plans
       WHERE client_id = $1
       ORDER BY created_at DESC`,
      [client_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET SINGLE PLAN WITH CHECKLIST
// GET /api/plans/:id
// ================================================
export const getPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client_id = (req as any).user.id;

  try {
    // Get the plan
    const planResult = await pool.query(
      `SELECT * FROM wedding_plans
       WHERE id = $1 AND client_id = $2`,
      [id, client_id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const plan = planResult.rows[0];

    // Get checklist items with vendor info
    const checklistResult = await pool.query(
      `SELECT 
         ci.*,
         vp.description  AS vendor_description,
         vp.base_price   AS vendor_price,
         vp.location     AS vendor_location,
         u.name          AS vendor_name
       FROM checklist_items ci
       LEFT JOIN vendor_profiles vp ON ci.vendor_id = vp.id
       LEFT JOIN users u ON vp.user_id = u.id
       WHERE ci.plan_id = $1
       ORDER BY ci.category`,
      [id]
    );

    // Calculate total spent
    const spentResult = await pool.query(
      `SELECT COALESCE(SUM(i.amount), 0) AS total_spent
       FROM invoices i
       JOIN service_requests sr ON i.service_request_id = sr.id
       WHERE sr.plan_id = $1
       AND i.payment_status = 'paid'`,
      [id]
    );

    res.json({
      ...plan,
      checklist: checklistResult.rows,
      total_spent: spentResult.rows[0].total_spent,
    });

  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// UPDATE PLAN
// PUT /api/plans/:id
// ================================================
export const updatePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client_id = (req as any).user.id;
  const { name, budget, location, guest_count, theme, wedding_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE wedding_plans
       SET 
         name         = COALESCE($1, name),
         budget       = COALESCE($2, budget),
         location     = COALESCE($3, location),
         guest_count  = COALESCE($4, guest_count),
         theme        = COALESCE($5, theme),
         wedding_date = COALESCE($6, wedding_date)
       WHERE id = $7 AND client_id = $8
       RETURNING *`,
      [name, budget, location, guest_count, theme, wedding_date, id, client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// DELETE PLAN
// DELETE /api/plans/:id
// ================================================
export const deletePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client_id = (req as any).user.id;

  try {
    const result = await pool.query(
      `DELETE FROM wedding_plans
       WHERE id = $1 AND client_id = $2
       RETURNING id`,
      [id, client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });

  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// PUBLISH PLAN (make public)
// PATCH /api/plans/:id/publish
// ================================================
export const publishPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client_id = (req as any).user.id;

  try {
    // Make sure plan belongs to client and is completed
    const planResult = await pool.query(
      `SELECT * FROM wedding_plans
       WHERE id = $1 AND client_id = $2`,
      [id, client_id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Update plan to public
    await pool.query(
      `UPDATE wedding_plans SET is_public = true WHERE id = $1`,
      [id]
    );

    // Insert into public_plans table
    await pool.query(
      `INSERT INTO public_plans (plan_id)
       VALUES ($1)
       ON CONFLICT DO NOTHING`,
      [id]
    );

    res.json({ message: 'Plan published successfully' });

  } catch (error) {
    console.error('Publish plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================================================
// GET PUBLIC PLANS (browse other couples plans)
// GET /api/plans/public
// ================================================
export const getPublicPlans = async (req: Request, res: Response) => {
  const { theme, search } = req.query;

  try {
    let query = `
      SELECT 
        wp.*,
        u.name AS client_name
      FROM wedding_plans wp
      JOIN public_plans pp ON wp.id = pp.plan_id
      JOIN users u ON wp.client_id = u.id
      WHERE wp.is_public = true
    `;

    const params: any[] = [];

    if (theme) {
      params.push(theme);
      query += ` AND wp.theme ILIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND wp.name ILIKE $${params.length}`;
    }

    query += ` ORDER BY pp.published_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Get public plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};