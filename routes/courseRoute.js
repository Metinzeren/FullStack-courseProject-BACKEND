const express = require("express");
const courseControllers = require("../controllers/courseControllers");
const router = express.Router();
const roleMiddleware = require("../middlewares/roleMiddleware");
//Create
router
  .route("/")
  .post(roleMiddleware(["teacher", "admin"]), courseControllers.createCourse);
router.route("/").get(courseControllers.getCourses);
router
  .route("/:id")
  .delete(roleMiddleware(["teacher", "admin"]), courseControllers.deleteCourse);
router.route("/find/:slug").get(courseControllers.getCourse);
router
  .route("/find/:slug")
  .put(roleMiddleware(["teacher", "admin"]), courseControllers.updateCourse);
router
  .route("/enroll")
  .post(roleMiddleware(["student"]), courseControllers.enrollCourse);
router.route("/leaveCourse").post(courseControllers.leaveCourse);
module.exports = router;
