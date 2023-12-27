//items schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    sizes: {
        type: [String],
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    cusine_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "cusine",
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "restaurant",
    },
    images: [{
        type: String,
        required: false,
    }],
    itemReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviews",
    }],
    price: {
        type: Number,
        required: true,
    },
    totalQty: {
        type: Number,
        required: true,
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
});;
// Virtuals
// qty left
ItemsSchema.virtual("qtyLeft").get(function () {
    const items = this;
    return items.totalQty - items.totalSold;
});

// Total rating
ItemsSchema.virtual("totalReviews").get(function () {
    const items = this;
    return items?.itemReviews?.length; // Use 'itemReviews' instead of 'reviews'
});

ItemsSchema.virtual("averageRating").get(function () {
    let ratingsTotal = 0;
    const items = this;
    items?.itemReviews?.forEach((review) => {
        ratingsTotal += review?.rating;
    });
    // calc average rating
    const averageRating = Number(ratingsTotal / items?.itemReviews?.length).toFixed(1);
    return averageRating;
});

const items = mongoose.model("items", ItemsSchema);

export default items;