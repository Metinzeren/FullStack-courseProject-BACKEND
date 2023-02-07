const Category = require("../models/Category");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
//course oluşturma
exports.createCourse = async (req, res, next) => {
  const token = req.headers["authorization"] || req.cookies["access_token"];
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  const newCourse = new Course({ ...req.body, user: decoded.id });
  try {
    const savedCourse = await newCourse.save();
    res.status(200).json(savedCourse);
  } catch (error) {
    res.status(400).send(error);
  }
};

//get courses

exports.getCourses = async (req, res, next) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });
    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }
    const categories = await Category.find();
    const courses = await Course.find(filter);
    res.status(200).json({ courses, categories });
  } catch (error) {
    res.status(400).send(error);
  }
};

//deleteCourse
exports.deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json("Course has been deleted");
  } catch (error) {
    res.status(400).send(error);
  }
};

//get single course
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json(error);
  }
};

//update Course

exports.updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(200).json(error);
  }
};

//enroll course

exports.enrollCourse = async (req, res) => {
  try {
    const token = req.headers["authorization"] || req.cookies["access_token"];
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found.");
    }
    const course = await Course.findById(req.body.course_id);
    if (!course) {
      throw new Error("The course does not exist.");
    }

    await User.updateOne(
      { _id: decoded.id },
      { $push: { courses: { _id: req.body.course_id } } }
    )
      .then(() => {
        res.status(200).json({ message: "kursa başarıyla kayıt olundu." });
      })
      .catch((error) => {
        res.status(500).send("Error enrolling in course: " + error.message);
      });
  } catch (error) {
    res.status(400).send("Error enrolling in course: " + error.message);
  }
};

exports.leaveCourse = async (req, res) => {
  try {
    const token = req.headers["authorization"] || req.cookies["access_token"];
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found.");
    }
    const course = await Course.findById(req.body.course_id);
    if (!course) {
      throw new Error("The course does not exist.");
    }

    await User.updateOne(
      { _id: decoded.id },
      { $pull: { courses: { _id: req.body.course_id } } }
    )
      .then(() => {
        res.status(200).json({ message: "Successfully left the course." });
      })
      .catch((error) => {
        console.error("Error leaving course:", error);
        res.status(500).send("Error leaving course: " + error.message);
      });
  } catch (error) {
    console.error(error);
    res.status(400).send("Error leaving course: " + error.message);
  }
};
