const Category = require("../models/Category");

//category oluşturma
exports.createCategory = async (req, res, next) => {
  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res.status(400).send(error);
  }
};

//get category

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find(req.params.id);
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).send(error);
  }
};
