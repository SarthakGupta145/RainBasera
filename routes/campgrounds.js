const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage:storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    validateCampground,
    upload.array('image'),
    catchAsync(campgrounds.createCampground)
  );
  // .post(upload.array('image'),(req,res)=>{
  //   console.log(req.body,req.files);
  //   res.send("It worked");
  // })
  // .post(upload.array('image'),(req, res) => {
  //   // console.log(req.file,req.body);
  //   res.send('Hurrah')
  // });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
 
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    catchAsync(campgrounds.updateCampground),
    validateCampground
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
