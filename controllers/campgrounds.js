const campground = require('../models/campground');
const multer = require('multer');
//const upload = multer({dest: 'uploads/'})
const { cloudinary } = require('../cloudinary/');


module.exports.index = async (req, res) => { //Similar to @router.route('/') and then declare the function.
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', {campgrounds}) // Like passing data to jinja template 
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
                            query: 'Yosemite, CA',
                            limit: 1
                            }).send();
    /*const cg= new campground(req.body.campground);
    cg.author = req.user._id;
    cg.images = req.files.map(f=> ({ url: f.path, filename: f.filename }));
    await cg.save();
    console.log(cg);
    req.flash('success', 'Successfully added a new campground');
    res.redirect('/campgrounds/'+cg._id);*/
    res.send(geoData);
    //res.send(req.body, req.file);

}

module.exports.showCampgrounds = async (req, res) => { //Similar to @app.route('/') and then declare the function.
    const campground_to_show = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    res.render('campgrounds/show', {campground_to_show});
}

module.exports.renderEditForm = async (req, res) => {
    const campground_to_show = await campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground_to_show});
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const cg = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const img = req.files.map(f=> ({ url: f.path, filename: f.filename }));
    cg.images.push(...img);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await cg.save();
    req.flash('success', 'Successfully edited campground')
    res.redirect('/campgrounds/' + id);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}