const path = require("path");
const router = require("express").Router();
const couseController = require("../controllers/course");
const IsAuth = require("../middleware/is-auth");
const multer = require("multer");
const { check, body } = require("express-validator");
const fs = require("fs");

//storage
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "_" +
        Math.floor(Math.random() * 10000000000 + 1) +
        path.extname(file.originalname)
    );
  },
}); //9999999999

const uploadMedia = multer({
  storage: storage,
  limits: {
    fileSize: 1073741824, // 10000000 Bytes = 10 MB , 1 gb = 1073741824 Bytes
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|jpg|jpeg|png|pdf)$/)) {
      return cb(new Error("Please upload a video or image"));
    }
    cb(undefined, true);
  },
});

// Create Course API
router.post(
  "/add",
  IsAuth,
  // [
  //   body("title").trim().isLength({ min: 15 }),
  //   body("description").trim().isLength({ min: 50 }),
  // ],
  uploadMedia.array("MediaFile", 10),
  couseController.postAddCourse
);

// Get Update Course API
router.get("/edit/:courseId", IsAuth, couseController.getUpdateCourse);

// Update Course API
router.patch(
  "/edit/:courseId",
  IsAuth,
  uploadMedia.array("MediaFile", 10),
  couseController.postUpdateCourse
);

// Update Course Media API
// router.patch(
//   "/editmedia/:courseId",
//   IsAuth,
//   uploadMedia.array("MediaFile", 10),
//   couseController.postUpdateCourseMedia
// );

// Delete Media API
router.delete("/edit/:mediaId", IsAuth, couseController.removeMedia);

// Delete Media API
router.delete("/deleteall/:courseId", IsAuth, couseController.removeallMedia);

// Get User Courses API
router.get("/courses/:userId", IsAuth, couseController.getCourses);
// Delete Course API

router.delete("/delete/:courseId", IsAuth, couseController.removeCourse);

// Search API
router.get("/search/:userId/:key", IsAuth, couseController.getSearchData);

// User Data API
router.get("/user/:userId", IsAuth, couseController.getUser);

module.exports = router;
