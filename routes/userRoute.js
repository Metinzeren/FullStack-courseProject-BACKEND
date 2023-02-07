const express = require("express");
const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//Create
router.route("/register").post(authControllers.createUser);
router.route("/login").post(authControllers.loginUser);
router.route("/dashboardPage").get(authMiddleware, authControllers.dashboard);
router.route("/sendMail").post(authControllers.sendMail);
// router.route("/").get(authControllers.getCategories);
// router.route("/:id").delete(courseControllers.deleteCourse);
// router.route("/find/:slug").get(courseControllers.getCourse);
// router.route("/find/:slug").put(courseControllers.updateCourse);
module.exports = router;
