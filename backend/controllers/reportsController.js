const { Pool } = require('pg');
const config = require('../config/config');

class ReportsController {
  constructor() {
    this.pool = new Pool(config.pgConfig);
    this.getPropertyStats = this.getPropertyStats.bind(this);
    this.getFinancialStats = this.getFinancialStats.bind(this);
    this.getBookingStats = this.getBookingStats.bind(this);
    this.getReviewStats = this.getReviewStats.bind(this);
    this.getCurrentGuests = this.getCurrentGuests.bind(this);
    this.getUpcomingBookings = this.getUpcomingBookings.bind(this);
    this.getComprehensiveReport = this.getComprehensiveReport.bind(this);
  }

  async getPropertyStats(req, res) {
    try {
      const userId = req.user.id;
      const timeRange = req.query.timeRange || 'month';

      // Get property statistics
      const propertyQuery = `
        SELECT 
          COUNT(*) as total_listed,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_listings,
          COUNT(CASE WHEN is_available = true THEN 1 END) as available_listings,
          AVG(price) as average_price,
          AVG(rating) as average_rating
        FROM rentals 
        WHERE owner_id = $1
      `;

      // Get occupancy rate for the specified time range
      const occupancyQuery = `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $2 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $2 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $2 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        ),
        total_days AS (
          SELECT COUNT(DISTINCT date_trunc('day', generate_series(
            dr.start_date,
            dr.end_date,
            '1 day'::interval
          ))) as days
          FROM date_range dr
        ),
        booked_days AS (
          SELECT COALESCE(COUNT(DISTINCT date_trunc('day', generate_series(
            GREATEST(b.start_date, dr.start_date),
            LEAST(b.end_date, dr.end_date),
            '1 day'::interval
          ))), 0) as days
          FROM bookings b
          JOIN rentals r ON b.rental_id = r.id
          CROSS JOIN date_range dr
          WHERE r.owner_id = $1
          AND b.status = 'confirmed'
          AND b.start_date <= dr.end_date
          AND b.end_date >= dr.start_date
        )
        SELECT 
          COALESCE(ROUND((COALESCE(bd.days, 0)::float / NULLIF(td.days, 0) * 100)::numeric, 1), 0) as occupancy_rate
        FROM total_days td
        CROSS JOIN booked_days bd
      `;

      const [propertyResult, occupancyResult] = await Promise.all([
        this.pool.query(propertyQuery, [userId]),
        this.pool.query(occupancyQuery, [userId, timeRange])
      ]);

      const stats = {
        totalListed: parseInt(propertyResult.rows[0]?.total_listed || 0),
        activeListings: parseInt(propertyResult.rows[0]?.active_listings || 0),
        availableListings: parseInt(propertyResult.rows[0]?.available_listings || 0),
        averagePrice: parseFloat(propertyResult.rows[0]?.average_price || 0),
        averageRating: parseFloat(propertyResult.rows[0]?.average_rating || 0),
        occupancyRate: parseFloat(occupancyResult.rows[0]?.occupancy_rate || 0)
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching property stats:', error);
      res.status(500).json({ error: 'Failed to fetch property statistics' });
    }
  }

  async getFinancialStats(req, res) {
    try {
      const userId = req.user.id;
      const timeRange = req.query.timeRange || 'month';

      // Get financial statistics
      const financialQuery = `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $2 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $2 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $2 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        )
        SELECT 
          COALESCE(SUM(b.total_amount), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) as paid_earnings,
          COALESCE(SUM(CASE WHEN b.status = 'pending' THEN b.total_amount ELSE 0 END), 0) as pending_payouts,
          COALESCE(AVG(b.total_amount), 0) as average_booking_value,
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as paid_bookings
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        CROSS JOIN date_range dr
        WHERE r.owner_id = $1
        AND b.created_at >= dr.start_date
        AND b.created_at <= dr.end_date
      `;

      // Get ADR (Average Daily Rate) and RevPAR (Revenue Per Available Room)
      const metricsQuery = `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $2 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $2 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $2 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        ),
        booking_metrics AS (
          SELECT 
            AVG(r.price) as adr,
            COUNT(DISTINCT b.id) as total_bookings,
            COUNT(DISTINCT r.id) as total_properties
          FROM bookings b
          JOIN rentals r ON b.rental_id = r.id
          CROSS JOIN date_range dr
          WHERE r.owner_id = $1
          AND b.status = 'confirmed'
          AND b.start_date >= dr.start_date
          AND b.start_date <= dr.end_date
        )
        SELECT 
          COALESCE(adr, 0) as adr,
          COALESCE(adr * (total_bookings::float / NULLIF(total_properties, 0)), 0) as revpar
        FROM booking_metrics
      `;

      const [financialResult, metricsResult] = await Promise.all([
        this.pool.query(financialQuery, [userId, timeRange]),
        this.pool.query(metricsQuery, [userId, timeRange])
      ]);

      const stats = {
        totalEarnings: parseFloat(financialResult.rows[0]?.total_earnings || 0),
        paidEarnings: parseFloat(financialResult.rows[0]?.paid_earnings || 0),
        pendingPayouts: parseFloat(financialResult.rows[0]?.pending_payouts || 0),
        averageBookingValue: parseFloat(financialResult.rows[0]?.average_booking_value || 0),
        totalBookings: parseInt(financialResult.rows[0]?.total_bookings || 0),
        paidBookings: parseInt(financialResult.rows[0]?.paid_bookings || 0),
        adr: parseFloat(metricsResult.rows[0]?.adr || 0),
        revpar: parseFloat(metricsResult.rows[0]?.revpar || 0)
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      res.status(500).json({ error: 'Failed to fetch financial statistics' });
    }
  }

  async getBookingStats(req, res) {
    try {
      const userId = req.user.id;
      const timeRange = req.query.timeRange || 'month';

      // Get booking statistics
      const bookingQuery = `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $2 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $2 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $2 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        )
        SELECT 
          COUNT(CASE WHEN b.created_at >= CURRENT_DATE THEN 1 END) as new_bookings_today,
          COUNT(CASE WHEN b.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_bookings_week,
          COUNT(CASE WHEN b.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_bookings_month,
          COUNT(CASE WHEN b.status = 'cancelled' AND b.created_at >= dr.start_date THEN 1 END) as cancelled_bookings,
          COUNT(CASE WHEN b.start_date = CURRENT_DATE AND b.status = 'confirmed' THEN 1 END) as checkins_today,
          COUNT(CASE WHEN b.start_date >= CURRENT_DATE AND b.start_date <= CURRENT_DATE + INTERVAL '7 days' AND b.status = 'confirmed' THEN 1 END) as checkins_week,
          COUNT(CASE WHEN b.end_date = CURRENT_DATE AND b.status = 'confirmed' THEN 1 END) as checkouts_today,
          COUNT(CASE WHEN b.end_date >= CURRENT_DATE AND b.end_date <= CURRENT_DATE + INTERVAL '7 days' AND b.status = 'confirmed' THEN 1 END) as checkouts_week
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        CROSS JOIN date_range dr
        WHERE r.owner_id = $1
        AND b.created_at >= dr.start_date
      `;

      const result = await this.pool.query(bookingQuery, [userId, timeRange]);

      const stats = {
        newBookings: {
          today: parseInt(result.rows[0]?.new_bookings_today || 0),
          week: parseInt(result.rows[0]?.new_bookings_week || 0),
          month: parseInt(result.rows[0]?.new_bookings_month || 0)
        },
        cancelledBookings: parseInt(result.rows[0]?.cancelled_bookings || 0),
        checkIns: {
          today: parseInt(result.rows[0]?.checkins_today || 0),
          week: parseInt(result.rows[0]?.checkins_week || 0)
        },
        checkOuts: {
          today: parseInt(result.rows[0]?.checkouts_today || 0),
          week: parseInt(result.rows[0]?.checkouts_week || 0)
        }
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      res.status(500).json({ error: 'Failed to fetch booking statistics' });
    }
  }

  async getReviewStats(req, res) {
    try {
      const userId = req.user.id;
      const timeRange = req.query.timeRange || 'month';

      // Get review statistics
      const reviewQuery = `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $2 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $2 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $2 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        )
        SELECT 
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(*) as total_reviews,
          COUNT(CASE WHEN r.created_at >= dr.start_date THEN 1 END) as new_reviews,
          COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star_reviews,
          COUNT(CASE WHEN r.rating = 4 THEN 1 END) as four_star_reviews,
          COUNT(CASE WHEN r.rating = 3 THEN 1 END) as three_star_reviews,
          COUNT(CASE WHEN r.rating = 2 THEN 1 END) as two_star_reviews,
          COUNT(CASE WHEN r.rating = 1 THEN 1 END) as one_star_reviews
        FROM reviews r
        JOIN rentals rental ON r.rental_id = rental.id
        CROSS JOIN date_range dr
        WHERE rental.owner_id = $1
        AND r.created_at >= dr.start_date
      `;

      // Get latest reviews
      const latestReviewsQuery = `
        SELECT 
          r.rating,
          r.comment,
          r.created_at,
          rental.title as property_name,
          u.full_name as reviewer_name
        FROM reviews r
        JOIN rentals rental ON r.rental_id = rental.id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE rental.owner_id = $1
        ORDER BY r.created_at DESC
        LIMIT 5
      `;

      const [reviewResult, latestReviewsResult] = await Promise.all([
        this.pool.query(reviewQuery, [userId, timeRange]),
        this.pool.query(latestReviewsQuery, [userId])
      ]);

      const stats = {
        averageRating: parseFloat(reviewResult.rows[0]?.average_rating || 0),
        totalReviews: parseInt(reviewResult.rows[0]?.total_reviews || 0),
        newReviews: parseInt(reviewResult.rows[0]?.new_reviews || 0),
        ratingDistribution: {
          fiveStar: parseInt(reviewResult.rows[0]?.five_star_reviews || 0),
          fourStar: parseInt(reviewResult.rows[0]?.four_star_reviews || 0),
          threeStar: parseInt(reviewResult.rows[0]?.three_star_reviews || 0),
          twoStar: parseInt(reviewResult.rows[0]?.two_star_reviews || 0),
          oneStar: parseInt(reviewResult.rows[0]?.one_star_reviews || 0)
        },
        latestReviews: latestReviewsResult.rows.map(review => ({
          rating: review.rating,
          comment: review.comment,
          date: review.created_at,
          property: review.property_name,
          reviewer: review.reviewer_name
        }))
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching review stats:', error);
      res.status(500).json({ error: 'Failed to fetch review statistics' });
    }
  }

  async getCurrentGuests(req, res) {
    try {
      const userId = req.user.id;

      const query = `
        SELECT 
          u.full_name as guest_name,
          r.title as property_name,
          b.start_date,
          b.end_date,
          b.guests,
          b.status
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE r.owner_id = $1
        AND b.status = 'confirmed'
        AND b.start_date <= CURRENT_DATE
        AND b.end_date >= CURRENT_DATE
        ORDER BY b.start_date ASC
      `;

      const result = await this.pool.query(query, [userId]);

      const guests = result.rows.map(guest => ({
        name: guest.guest_name || 'Anonymous',
        property: guest.property_name,
        checkIn: guest.start_date,
        checkOut: guest.end_date,
        guests: guest.guests,
        status: guest.status
      }));

      res.json(guests);
    } catch (error) {
      console.error('Error fetching current guests:', error);
      res.status(500).json({ error: 'Failed to fetch current guests' });
    }
  }

  async getUpcomingBookings(req, res) {
    try {
      const userId = req.user.id;

      const query = `
        SELECT 
          u.full_name as guest_name,
          r.title as property_name,
          b.start_date,
          b.end_date,
          b.guests,
          b.status
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE r.owner_id = $1
        AND b.status = 'confirmed'
        AND b.start_date > CURRENT_DATE
        ORDER BY b.start_date ASC
        LIMIT 10
      `;

      const result = await this.pool.query(query, [userId]);

      const bookings = result.rows.map(booking => ({
        name: booking.guest_name || 'Anonymous',
        property: booking.property_name,
        checkIn: booking.start_date,
        checkOut: booking.end_date,
        guests: booking.guests,
        status: booking.status
      }));

      res.json(bookings);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming bookings' });
    }
  }

  async getComprehensiveReport(req, res) {
    try {
      let userId = null;
      if (req.user && req.user.id) {
        userId = req.user.id;
      }
      const timeRange = req.query.timeRange || 'month';

      // Property stats
      const propertyQuery = userId
        ? `
        SELECT 
          COUNT(*) as total_listed,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_listings,
          COUNT(CASE WHEN is_available = true THEN 1 END) as available_listings,
          AVG(price) as average_price,
          AVG(rating) as average_rating
        FROM rentals 
        WHERE owner_id = $1
      `
        : `
        SELECT 
          COUNT(*) as total_listed,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_listings,
          COUNT(CASE WHEN is_available = true THEN 1 END) as available_listings,
          AVG(price) as average_price,
          AVG(rating) as average_rating
        FROM rentals
      `;

      // Financial stats
      const financialQuery = userId
        ? `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $2 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $2 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $2 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        )
        SELECT 
          COALESCE(SUM(b.total_amount), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) as paid_earnings,
          COALESCE(SUM(CASE WHEN b.status = 'pending' THEN b.total_amount ELSE 0 END), 0) as pending_payouts,
          COALESCE(AVG(b.total_amount), 0) as average_booking_value,
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as paid_bookings
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        CROSS JOIN date_range dr
        WHERE r.owner_id = $1
        AND b.created_at >= dr.start_date
        AND b.created_at <= dr.end_date
      `
        : `
        WITH date_range AS (
          SELECT 
            CASE 
              WHEN $1 = 'week' THEN CURRENT_DATE - INTERVAL '7 days'
              WHEN $1 = 'month' THEN CURRENT_DATE - INTERVAL '30 days'
              WHEN $1 = 'year' THEN CURRENT_DATE - INTERVAL '365 days'
              ELSE CURRENT_DATE - INTERVAL '30 days'
            END as start_date,
            CURRENT_DATE as end_date
        )
        SELECT 
          COALESCE(SUM(b.total_amount), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) as paid_earnings,
          COALESCE(SUM(CASE WHEN b.status = 'pending' THEN b.total_amount ELSE 0 END), 0) as pending_payouts,
          COALESCE(AVG(b.total_amount), 0) as average_booking_value,
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as paid_bookings
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        CROSS JOIN date_range dr
        WHERE b.created_at >= dr.start_date
        AND b.created_at <= dr.end_date
      `;

      // Booking stats
      const bookingQuery = userId
        ? `
        SELECT 
          COUNT(CASE WHEN b.created_at >= CURRENT_DATE THEN 1 END) as new_bookings_today,
          COUNT(CASE WHEN b.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_bookings_week,
          COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings,
          COUNT(CASE WHEN b.start_date = CURRENT_DATE AND b.status = 'confirmed' THEN 1 END) as checkins_today,
          COUNT(CASE WHEN b.end_date = CURRENT_DATE AND b.status = 'confirmed' THEN 1 END) as checkouts_today
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        WHERE r.owner_id = $1
      `
        : `
        SELECT 
          COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as new_bookings_today,
          COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_bookings_week,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
          COUNT(CASE WHEN start_date = CURRENT_DATE AND status = 'confirmed' THEN 1 END) as checkins_today,
          COUNT(CASE WHEN end_date = CURRENT_DATE AND status = 'confirmed' THEN 1 END) as checkouts_today
        FROM bookings
      `;

      // Review stats
      const reviewQuery = userId
        ? `
        SELECT 
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(*) as total_reviews
        FROM reviews r
        JOIN rentals rental ON r.rental_id = rental.id
        WHERE rental.owner_id = $1
      `
        : `
        SELECT 
          COALESCE(AVG(rating), 0) as average_rating,
          COUNT(*) as total_reviews
        FROM reviews
      `;
      const latestReviewsQuery = userId
        ? `
        SELECT 
          r.rating,
          r.comment,
          r.created_at,
          rental.title as property_name,
          u.full_name as reviewer_name
        FROM reviews r
        JOIN rentals rental ON r.rental_id = rental.id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE rental.owner_id = $1
        ORDER BY r.created_at DESC
        LIMIT 5
      `
        : `
        SELECT 
          r.rating,
          r.comment,
          r.created_at,
          rental.title as property_name,
          u.full_name as reviewer_name
        FROM reviews r
        JOIN rentals rental ON r.rental_id = rental.id
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
        LIMIT 5
      `;

      // Current guests
      const currentGuestsQuery = userId
        ? `
        SELECT 
          u.full_name as guest_name,
          r.title as property_name,
          b.start_date,
          b.end_date,
          b.guests
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE r.owner_id = $1
        AND b.status = 'confirmed'
        AND b.start_date <= CURRENT_DATE
        AND b.end_date >= CURRENT_DATE
        ORDER BY b.start_date ASC
      `
        : `
        SELECT 
          u.full_name as guest_name,
          r.title as property_name,
          b.start_date,
          b.end_date,
          b.guests
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.status = 'confirmed'
        AND b.start_date <= CURRENT_DATE
        AND b.end_date >= CURRENT_DATE
        ORDER BY b.start_date ASC
      `;

      // Upcoming bookings
      const upcomingBookingsQuery = userId
        ? `
        SELECT 
          u.full_name as guest_name,
          r.title as property_name,
          b.start_date,
          b.end_date,
          b.guests
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE r.owner_id = $1
        AND b.status = 'confirmed'
        AND b.start_date > CURRENT_DATE
        ORDER BY b.start_date ASC
        LIMIT 5
      `
        : `
        SELECT 
          u.full_name as guest_name,
          r.title as property_name,
          b.start_date,
          b.end_date,
          b.guests
        FROM bookings b
        JOIN rentals r ON b.rental_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.status = 'confirmed'
        AND b.start_date > CURRENT_DATE
        ORDER BY b.start_date ASC
        LIMIT 5
      `;

      const propertyParams = userId ? [userId] : [];
      const financialParams = userId ? [userId, timeRange] : [timeRange];
      const bookingParams = userId ? [userId] : [];
      const reviewParams = userId ? [userId] : [];
      const latestReviewParams = userId ? [userId] : [];
      const currentGuestsParams = userId ? [userId] : [];
      const upcomingBookingsParams = userId ? [userId] : [];

      // For public (no user), ensure only financialParams gets [timeRange], all others get []
      if (!userId) {
        // propertyParams = [];
        // bookingParams = [];
        // reviewParams = [];
        // latestReviewParams = [];
        // currentGuestsParams = [];
        // upcomingBookingsParams = [];
      }

      const [propertyResult, financialResult, bookingResult, reviewResult, latestReviewsResult, currentGuestsResult, upcomingBookingsResult] = await Promise.all([
        this.pool.query(propertyQuery, propertyParams),
        this.pool.query(financialQuery, financialParams),
        this.pool.query(bookingQuery, bookingParams),
        this.pool.query(reviewQuery, reviewParams),
        this.pool.query(latestReviewsQuery, latestReviewParams),
        this.pool.query(currentGuestsQuery, currentGuestsParams),
        this.pool.query(upcomingBookingsQuery, upcomingBookingsParams)
      ]);

      res.json({
        propertyStats: {
          ...propertyResult.rows[0],
          average_price: propertyResult.rows[0]?.average_price ? Number(propertyResult.rows[0].average_price).toFixed(2) : null,
          average_rating: propertyResult.rows[0]?.average_rating ? Number(propertyResult.rows[0].average_rating).toFixed(2) : null,
        },
        financialStats: {
          ...financialResult.rows[0],
          total_earnings: financialResult.rows[0]?.total_earnings ? Number(financialResult.rows[0].total_earnings).toFixed(2) : null,
          paid_earnings: financialResult.rows[0]?.paid_earnings ? Number(financialResult.rows[0].paid_earnings).toFixed(2) : null,
          pending_payouts: financialResult.rows[0]?.pending_payouts ? Number(financialResult.rows[0].pending_payouts).toFixed(2) : null,
          average_booking_value: financialResult.rows[0]?.average_booking_value ? Number(financialResult.rows[0].average_booking_value).toFixed(2) : null,
        },
        bookingStats: bookingResult.rows[0],
        reviewStats: {
          ...reviewResult.rows[0],
          average_rating: reviewResult.rows[0]?.average_rating ? Number(reviewResult.rows[0].average_rating).toFixed(2) : null,
          latestReviews: latestReviewsResult.rows
        },
        currentGuests: currentGuestsResult.rows,
        upcomingBookings: upcomingBookingsResult.rows,
        generatedAt: new Date().toISOString(),
        timeRange
      });
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      res.status(500).json({ error: 'Failed to generate comprehensive report' });
    }
  }
}

module.exports = new ReportsController(); 