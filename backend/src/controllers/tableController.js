const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public / Authenticated
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.status(200).json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private (Admin)
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location, status, notes } = req.body;

    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Table number already exists' });
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      location,
      status: status || 'Available',
      notes,
    });

    res.status(201).json({ success: true, message: 'Table created successfully', data: table });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Private (Admin)
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.status(200).json({ success: true, message: 'Table updated successfully', data: table });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private (Admin)
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, message: 'Table removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
