const express = require("express");
const categoryControllers = require("../controllers/categoryControllers");
const router = express.Router();

//Create
router.route("/").post(categoryControllers.createCategory);
router.route("/").get(categoryControllers.getCategories);
// router.route("/:id").delete(courseControllers.deleteCourse);
// router.route("/find/:slug").get(courseControllers.getCourse);
// router.route("/find/:slug").put(courseControllers.updateCourse);
module.exports = router;
