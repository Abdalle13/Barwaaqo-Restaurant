const Food = require('../models/Food');
const { uploadToImageKit } = require('../utils/imagekit');

// @desc    GET All Foods with Search, Filter & Pagination
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    let filter = { isDeleted: false };

    // Search by food name or description
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by status (e.g., Available)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Food.countDocuments(filter);

    const foods = await Food.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: foods.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: foods,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET Popular / Featured Foods
// @route   GET /api/foods/popular
// @access  Public
exports.getPopularFoods = async (req, res) => {
  try {
    const popularFoods = await Food.find({ isDeleted: false, isPopular: true })
      .populate('category', 'name')
      .limit(6);

    // Fallback: If no dishes are flagged as isPopular, return top rated items
    let result = popularFoods;
    if (result.length === 0) {
      result = await Food.find({ isDeleted: false })
        .populate('category', 'name')
        .sort({ rating: -1, createdAt: -1 })
        .limit(6);
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET Single Food Item
// @route   GET /api/foods/:id
// @access  Public
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findOne({ _id: req.params.id, isDeleted: false }).populate('category', 'name');
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Food item not found' });
  }
};

// @desc    CREATE Food Item with ImageKit Upload
// @route   POST /api/foods
// @access  Private (Admin)
exports.createFood = async (req, res) => {
  try {
    const { name, description, price, discount, category, status, preparationTime, isPopular } = req.body;

    let imageUrl = '';
    let imageKitId = '';

    // If image file is provided in memory, upload to ImageKit
    if (req.file) {
      const fileName = `food-${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      try {
        const uploadResult = await uploadToImageKit(req.file.buffer, fileName, '/barwaaqo/foods');
        imageUrl = uploadResult.url;
        imageKitId = uploadResult.fileId;
      } catch (uploadError) {
        console.warn('ImageKit upload warning:', uploadError.message);
        // If image upload fails or keys not active, continue with empty or provided url
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const food = new Food({
      name,
      description,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      category,
      status: status || 'Available',
      preparationTime: preparationTime ? Number(preparationTime) : 20,
      isPopular: isPopular === 'true' || isPopular === true,
      image: imageUrl,
      imageKitId,
    });

    const savedFood = await food.save();
    const populated = await Food.findById(savedFood._id).populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    UPDATE Food Item
// @route   PUT /api/foods/:id
// @access  Private (Admin)
exports.updateFood = async (req, res) => {
  try {
    let food = await Food.findOne({ _id: req.params.id, isDeleted: false });
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const updates = { ...req.body };

    if (req.file) {
      const fileName = `food-${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      try {
        const uploadResult = await uploadToImageKit(req.file.buffer, fileName, '/barwaaqo/foods');
        updates.image = uploadResult.url;
        updates.imageKitId = uploadResult.fileId;
      } catch (uploadError) {
        console.warn('ImageKit upload warning:', uploadError.message);
      }
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discount !== undefined) updates.discount = Number(updates.discount);
    if (updates.preparationTime !== undefined) updates.preparationTime = Number(updates.preparationTime);
    if (updates.isPopular !== undefined) updates.isPopular = updates.isPopular === 'true' || updates.isPopular === true;

    food = await Food.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Dish updated successfully',
      data: food,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    DELETE Food Item (Soft-delete for production safety)
// @route   DELETE /api/foods/:id
// @access  Private (Admin)
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Soft delete so existing orders can still reference it
    food.isDeleted = true;
    await food.save();

    res.status(200).json({
      success: true,
      message: 'Dish removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};