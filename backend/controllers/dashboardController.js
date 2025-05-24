const { Pool } = require('pg');
const config = require('../config/config');

class DashboardController {
  constructor() {
    this.pool = new Pool(config.pgConfig);
    this.getStats = this.getStats.bind(this);
  }

  async getStats(req, res) {
    try {
      console.log('Dashboard stats request received');
      console.log('User from request:', req.user);
      
      if (!req.user || !req.user.id) {
        console.error('No user ID in request');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = req.user.id;
      console.log('Fetching stats for user ID:', userId);

      // Get total properties count
      const propertiesQuery = `
        SELECT 
          COALESCE(COUNT(*), 0) as total_properties,
          COALESCE(COUNT(CASE WHEN is_active = true THEN 1 END), 0) as active_properties
        FROM rentals 
        WHERE owner_id = $1
      `;

      // Get monthly revenue
      const revenueQuery = `
        SELECT 
          COALESCE(SUM(total_amount), 0) as monthly_revenue,
          COALESCE(SUM(CASE 
            WHEN EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) 
            THEN total_amount 
            ELSE 0 
          END), 0) as ytd_revenue
        FROM factures 
        WHERE user_id = $1 
        AND status = 'paid'
        AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      `;

      // Get occupancy rate
      const occupancyQuery = `
        WITH total_days AS (
          SELECT COUNT(DISTINCT date_trunc('day', generate_series(
            CURRENT_DATE - INTERVAL '30 days',
            CURRENT_DATE,
            '1 day'::interval
          ))) as days
        ),
        booked_days AS (
          SELECT COALESCE(COUNT(DISTINCT date_trunc('day', generate_series(
            start_date,
            end_date,
            '1 day'::interval
          ))), 0) as days
          FROM bookings b
          JOIN rentals r ON b.rental_id = r.id
          WHERE r.owner_id = $1
          AND b.status = 'confirmed'
          AND b.start_date >= CURRENT_DATE - INTERVAL '30 days'
        )
        SELECT 
          COALESCE(ROUND((COALESCE(bd.days, 0)::float / NULLIF(td.days, 0) * 100)::numeric, 1), 0) as occupancy_rate,
          COALESCE(COUNT(*), 0) as new_bookings
        FROM total_days td
        CROSS JOIN booked_days bd
        LEFT JOIN bookings b ON b.start_date = CURRENT_DATE
        WHERE b.status = 'confirmed'
        GROUP BY td.days, bd.days
      `;

      // Get average rating
      const ratingQuery = `
        SELECT 
          COALESCE(ROUND(AVG(rating)::numeric, 1), 0) as average_rating,
          COALESCE(COUNT(*), 0) as new_reviews
        FROM reviews r
        JOIN rentals rl ON r.booking_id IN (
          SELECT id FROM bookings WHERE rental_id = rl.id
        )
        WHERE rl.owner_id = $1
        AND r.created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `;

      console.log('Executing queries...');
      
      // Execute all queries in parallel
      const [
        propertiesResult,
        revenueResult,
        occupancyResult,
        ratingResult
      ] = await Promise.all([
        this.pool.query(propertiesQuery, [userId]).catch(err => {
          console.error('Error in properties query:', err);
          return { rows: [{ total_properties: 0, active_properties: 0 }] };
        }),
        this.pool.query(revenueQuery, [userId]).catch(err => {
          console.error('Error in revenue query:', err);
          return { rows: [{ monthly_revenue: 0, ytd_revenue: 0 }] };
        }),
        this.pool.query(occupancyQuery, [userId]).catch(err => {
          console.error('Error in occupancy query:', err);
          return { rows: [{ occupancy_rate: 0, new_bookings: 0 }] };
        }),
        this.pool.query(ratingQuery, [userId]).catch(err => {
          console.error('Error in rating query:', err);
          return { rows: [{ average_rating: 0, new_reviews: 0 }] };
        })
      ]);

      console.log('Queries executed successfully');
      console.log('Results:', {
        properties: propertiesResult.rows[0],
        revenue: revenueResult.rows[0],
        occupancy: occupancyResult.rows[0],
        rating: ratingResult.rows[0]
      });

      // Format the response with default values of 0
      const stats = {
        properties: {
          total: parseInt(propertiesResult.rows[0]?.total_properties || 0),
          active: parseInt(propertiesResult.rows[0]?.active_properties || 0)
        },
        revenue: {
          monthly: parseFloat(revenueResult.rows[0]?.monthly_revenue || 0),
          ytd: parseFloat(revenueResult.rows[0]?.ytd_revenue || 0)
        },
        occupancy: {
          rate: parseFloat(occupancyResult.rows[0]?.occupancy_rate || 0),
          newBookings: parseInt(occupancyResult.rows[0]?.new_bookings || 0)
        },
        rating: {
          average: parseFloat(ratingResult.rows[0]?.average_rating || 0),
          newReviews: parseInt(ratingResult.rows[0]?.new_reviews || 0)
        }
      };

      console.log('Sending response:', stats);
      res.json(stats);
    } catch (error) {
      console.error('Detailed error in getStats:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail
      });
      // Return default values in case of error
      res.json({
        properties: { total: 0, active: 0 },
        revenue: { monthly: 0, ytd: 0 },
        occupancy: { rate: 0, newBookings: 0 },
        rating: { average: 0, newReviews: 0 }
      });
    }
  }
}

module.exports = new DashboardController(); 