const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;
//Creating model schema

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' 
        }
    ],
    author: 
        {
            type: Schema.Types.ObjectId,
            ref:'User'
        }
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//Exportingn model schema
module.exports = mongoose.model('Campground', CampgroundSchema);