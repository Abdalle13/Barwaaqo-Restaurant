const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  getMyReservations,
  updateReservationStatus,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Booking table (Anyone / Customer)
router.post('/', createReservation);

// Customer view their own bookings
router.get('/my-reservations', protect, getMyReservations);

// Admin view and manage all bookings
router.get('/', protect, authorize(PERMISSIONS.MANAGE_RESERVATIONS), getReservations);
router.put('/:id/status', protect, authorize(PERMISSIONS.MANAGE_RESERVATIONS), updateReservationStatus);

module.exports = router;
