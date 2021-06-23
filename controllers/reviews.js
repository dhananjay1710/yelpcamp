const campground = require('../models/campground');
const Review = require('../models/review');

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const cg = await campground.findById(id);
    const rv = new Review(req.body.review);
    rv.author = req.user._id;
    cg.reviews.push(rv);
    await rv.save();
    await cg.save();
    req.flash('success', 'Review added!');
    res.redirect('/campgrounds/'+id);
}

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review deleted!')
    res.redirect('/campgrounds/' + id);
}