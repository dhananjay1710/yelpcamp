const express = require('express');
const router = express.Router();
const campground = require('../models/campground'); // base structure for our mongo DB schema
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor } = require('../middleware');
const campgroundsController = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/');
const upload = multer({storage});
//Show All Campgrounds
router.get('/', campgroundsController.index)

//Show form to add new campground
router.get('/new',isLoggedIn, campgroundsController.renderNewForm)

//Create the new campground from form
router.post('/',isLoggedIn, upload.array('image'), campgroundsController.createCampground)

/*router.post('/', upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send(req.body);
})*/

//Show the selected campground
router.get('/:id', campgroundsController.showCampgrounds)

//Show edit form for a given campground
router.get('/:id/edit',isLoggedIn, isAuthor, campgroundsController.renderEditForm)

//Actually edit the campground
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), campgroundsController.editCampground)

//Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, campgroundsController.deleteCampground)

module.exports = router;