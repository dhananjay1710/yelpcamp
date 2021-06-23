const express = require('express');
const router = express.Router({mergeParams: true});
const campground = require('../models/campground'); // base structure for our mongo DB schema
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewsController = require('../controllers/reviews')

//Add a review
router.post('/',isLoggedIn, reviewsController.addReview)

//Delete a review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, reviewsController.deleteReview)

module.exports = router;