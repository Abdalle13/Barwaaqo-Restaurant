const Reservation = require('../models/Reservation');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Public / Authenticated
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, guests, reservationDate, reservationTime, specialRequests } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !guests || !reservationDate || !reservationTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, guests, date, and time',
      });
    }

    const reservation = await Reservation.create({
      user: req.user ? req.user._id : null,
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone,
      guests: Number(guests),
      reservationDate,
      reservationTime,
      specialRequests: specialRequests || '',
      status: 'Pending',
    });

    // Send confirmation email
    try {
      sendEmail({
        email: customerEmail,
        subject: `Table Reservation Received - Barwaaqo Restaurant`,
        message: `Dear ${customerName},\n\nWe have received your table booking request at Barwaaqo Restaurant for ${guests} guest(s) on ${new Date(reservationDate).toLocaleDateString()} at ${reservationTime}.\n\nOur team is reviewing it and will send you a confirmation shortly.\n\nWarm regards,\nBarwaaqo Restaurant`,
      }).catch((err) => console.log('Reservation email skipped:', err.message));
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Reservation request submitted successfully',
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
// @access  Private (Admin)
exports.getReservations = async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};

    const reservations = await Reservation.find(filter)
      .populate('user', 'name email phone')
      .populate('table', 'tableNumber location')
      .sort({ reservationDate: -1, reservationTime: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my reservations (Customer)
// @route   GET /api/reservations/my-reservations
// @access  Private (Customer)
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'tableNumber location')
      .sort({ reservationDate: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reservation status (Confirm, Cancel, Assign table)
// @route   PUT /api/reservations/:id/status
// @access  Private (Admin)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, table } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (status) reservation.status = status;
    if (table) reservation.table = table;

    const updated = await reservation.save();
    const populated = await Reservation.findById(updated._id)
      .populate('user', 'name email phone')
      .populate('table', 'tableNumber location');

    // Notify customer on status update
    try {
      if (reservation.customerEmail) {
        sendEmail({
          email: reservation.customerEmail,
          subject: `Reservation Status Update: ${status} - Barwaaqo Restaurant`,
          message: `Dear ${reservation.customerName},\n\nYour reservation status has been updated to: ${status}.\n\nDate: ${new Date(reservation.reservationDate).toLocaleDateString()}\nTime: ${reservation.reservationTime}\nGuests: ${reservation.guests}\n\nWe look forward to hosting you!\nBarwaaqo Restaurant`,
        }).catch((err) => console.log('Reservation email skipped:', err.message));
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
