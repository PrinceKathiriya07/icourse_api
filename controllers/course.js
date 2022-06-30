const User = require("../models/user");
const Course = require("../models/course");
const Media = require("../models/media");
const { findById, countDocuments } = require("../models/user");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const media = require("../models/media");

// Create Course
exports.postAddCourse = async (req, res, next) => {
  console.log(req);

  // const userId = "62b050fa0f53daf18e5425fc";
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  let user_Id;
  let course_Id;
  try {
    // if (!errors.isEmpty()) {
    //   const error = new Error("Validation failed, entered data is incorrect.");
    //   error.statusCode = 422;
    //   throw error;
    // }
    const course = await Course({
      title: title,
      description: description,
      user_Id: userId,
    });
    course.save();
    const courseId = course._id;
    // const user = await User.findById(userId);
    // user_Id = user;
    // user.courses.push(course);
    // user.save();

    // if (!req.files.isEmpty()) {
    //   const error = new Error("No media provided.");
    //   error.statusCode = 422;
    //   throw error;
    // }

    if (req.files) {
      req.files.forEach((files, index, arr) => {
        const media = new Media({
          course_Id: courseId,
        });
        media.name = files.path;
        if (
          files.mimetype === "image/jpeg" ||
          files.mimetype === "image/jpg" ||
          files.mimetype === "image/png"
        ) {
          media.type = 1;
        } else if (
          files.mimetype === "video/mp4" ||
          files.mimetype === "video/mkv" ||
          files.mimetype === "video/MPEG-4"
        ) {
          media.type = 2;
        } else if (files.mimetype === "application/pdf") {
          media.type = 3;
        }

        media.save();
      });
    }

    res.status(201).json({
      message: "Course created successfully!",
      course: course,
      // user_Id: { _id: user_Id._id, name: user_Id.name },
      course_Id: { _id: course._id, title: course.title },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get data controller for update course
exports.getUpdateCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  // let mediaType;
  try {
    const course = await Course.findById(courseId).populate("user_Id");
    const media = await Media.find({ course_Id: courseId });
    // const mediaData = media;
    // console.log(mediaData);
    // for (let i = 0; i < mediaData.length; i++) {
    //   console.log(mediaData[i].type);
    //   mediaType = mediaData[i].type;
    // }
    // console.log(mediaType);

    res.status(200).json({
      message: "Course fetched.",
      course: course,
      media: media,
      // type: mediaType,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Post data controller for update course
exports.postUpdateCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  const title = req.body.title;
  const description = req.body.description;

  try {
    const course = await Course.findByIdAndUpdate(courseId, {
      title,
      description,
    });

    if (req.files) {
      req.files.forEach((files, index, arr) => {
        const media = new Media({
          course_Id: courseId,
        });
        media.name = files.path;
        if (
          files.mimetype === "image/jpeg" ||
          files.mimetype === "image/jpg" ||
          files.mimetype === "image/png"
        ) {
          media.type = 1;
        } else if (
          files.mimetype === "video/mp4" ||
          files.mimetype === "video/mkv" ||
          files.mimetype === "video/MPEG-4"
        ) {
          media.type = 2;
        } else if (files.mimetype === "application/pdf") {
          media.type = 3;
        }

        media.save();
        console.log(media);
      });
    }
    res.status(201).json({
      message: "Course updated successfully!",
      course: course,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// // Post data controller for update course media files
// exports.postUpdateCourseMedia = async (req, res, next) => {
//   // console.log(req);
//   const courseId = req.params.courseId;
//   // let course_Id;

//   try {
//     // if (!req.files.isEmpty()) {
//     //   const error = new Error("No media provided.");
//     //   error.statusCode = 422;
//     //   throw error;
//     // }

//     // if (req.files) {
//     //   req.files.forEach((files, index, arr) => {
//     //     const media = new Media({
//     //       course_Id: courseId,
//     //     });
//     //     media.name = files.path;
//     //     media.save();
//     //   });
//     // }
//     if (req.files) {
//       req.files.forEach((files, index, arr) => {
//         const media = new Media({
//           course_Id: courseId,
//         });
//         media.name = files.path;
//         if (
//           files.mimetype === "image/jpeg" ||
//           files.mimetype === "image/jpg" ||
//           files.mimetype === "image/png"
//         ) {
//           media.type = 1;
//         } else if (
//           files.mimetype === "video/mp4" ||
//           files.mimetype === "video/mkv" ||
//           files.mimetype === "video/MPEG-4"
//         ) {
//           media.type = 2;
//         }

//         media.save();
//         console.log(media);
//       });
//     }
//     res.status(201).json({
//       message: "Media added successfully!",
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// remove media
exports.removeMedia = async (req, res, next) => {
  const mediaId = req.params.mediaId;
  try {
    const media = await Media.findByIdAndDelete(mediaId);
    clearImage(media.name);
    res.status(201).json({
      message: "Media deleted successfully!",
      media,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// removeing all the media file
exports.removeallMedia = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const media = await Media.find({ course_Id: courseId });
    const mediaData = media;
    for (let i = 0; i < mediaData.length; i++) {
      clearImage(mediaData[i].name);
    }
    const mediaDelete = await Media.find({ course_Id: courseId })
      .remove()
      .exec();

    res.status(201).json({
      message: "All Media removed successfully!",
      mediaDelete,
      media,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get user Courses
exports.getCourses = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = process.env.PER_PAGE_LIMIT;
  let totalItems;
  const userId = req.params.userId;
  try {
    const count = await Course.find({ user_Id: userId }).countDocuments();
    totalItems = count;
    const courses = await Course.find({ user_Id: userId }, null, {
      sort: { createdAt: -1 },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(201).json({
      message: "all Courses",
      courses,
      totalItems: totalItems,
      pages: Math.ceil(count / perPage),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// removeing Course and media
exports.removeCourse = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const media = await Media.find({ course_Id: courseId });
    const mediaData = media;
    for (let i = 0; i < mediaData.length; i++) {
      clearImage(mediaData[i].name);
    }
    const course = await Course.findByIdAndDelete(courseId);
    const mediaDelete = await Media.find({ course_Id: courseId })
      .remove()
      .exec();

    res.status(201).json({
      message: "Course deleted successfully!",
      mediaDelete,
      course,
      media,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

// for search result
// exports.getSearchData = async (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = process.env.PER_PAGE_LIMIT;
//   let totalItems;
//   try {
//     const count = await Course.find({
//       $or: [
//         { title: { $regex: req.params.key } },
//         { description: { $regex: req.params.key } },
//       ],
//     }).countDocuments();

//     totalItems = count;
//     const course = await Course.find({
//       $or: [
//         { title: { $regex: req.params.key } },
//         { description: { $regex: req.params.key } },
//       ],
//     })
//       .skip((currentPage - 1) * perPage)
//       .limit(perPage);

//     res.status(201).json({
//       message: "This is Match",
//       course,
//       totalItems: totalItems,
//       pages: Math.ceil(count / perPage),
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// for search result
exports.getSearchData = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = process.env.PER_PAGE_LIMIT;
  let totalItems;
  const userId = req.params.userId;
  let regex = new RegExp(req.params.key, "gi");

  try {
    const count = await Course.find({
      user_Id: userId,
      title: regex,
    }).countDocuments();

    totalItems = count;
    const course = await Course.find({
      user_Id: userId,
      title: regex,
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(201).json({
      message: "This is Match",
      course,
      totalItems: totalItems,
      pages: Math.ceil(count / perPage),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// active user information
exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  let userData;
  try {
    const user = await User.findById({ _id: userId });
    userData = user;
    const name = userData.name;
    res.status(201).json({
      message: "User data",
      name,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
