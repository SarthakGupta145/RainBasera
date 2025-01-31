const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/drzwwcagk/image/upload/v1710267379/Yelpcamp/gfq0okrt35mmgjx1bcew.jpg
const ImageSchema = new Schema({
  url: String,
  filename: String,
});
//replace cloudinary image api with sizing thumbnail
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = {toJSON: {virtuals: true}};

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
},opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <a href="/campgrounds/${this._id}">${this.title}</a>
  <p>${this.description}</p>` 
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
