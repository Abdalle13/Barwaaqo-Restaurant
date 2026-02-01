const Food = require('../models/Food');
const fs = require('fs');
const path = require('path');

// @desc    GET All Foods & Search
exports.getFoods = async (req, res) => {
  try {
    let filter = {};
    if (req.query.search) {
      // 'i' waxay ka dhigan tahay inuu raadiyo xitaa haddii xuruuftu yaryar yihiin ama waaweyn yihiin
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const foods = await Food.find(filter).populate('category', 'name');
    res.status(200).json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    CREATE Food
exports.createFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const food = new Food({
      name, description, price, category,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    const savedFood = await food.save();
    res.status(201).json({ success: true, data: savedFood });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path); // Tirtir sawirka haddii error jiro
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    UPDATE Food
exports.updateFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Cuntada lama helin' });

    if (req.file) {
      // Tirtir sawirkii hore ee folder-ka ku jiray
      if (food.image) {
        const oldPath = path.join(__dirname, '../../uploads', path.basename(food.image));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.image = `/uploads/${req.file.filename}`;
    }

    food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    DELETE Food
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Lama helin' });

    if (food.image) {
      const imgPath = path.join(__dirname, '../../uploads', path.basename(food.image));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await food.deleteOne();
    res.status(200).json({ success: true, message: 'Waa la tirtiray' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET Single Food
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('category', 'name');
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Lama helin' });
  }
};