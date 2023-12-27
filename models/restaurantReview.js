//Review Schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Review must belong to a user"],
    },
    restaurant: { // Correct field name based on the error
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurant",
        required: [true, "Review must belong to a restaurant"],
    },
    message: {
        type: String,
        required: [true, "Please add a message"],
    },
    rating: {
        type: Number,
        required: [true, "Please add a rating between 1 and 5"],
        min: 1,
        max: 5,
    },
}, {
    timestamps: true,
});

const RestaurantReview = mongoose.model("restaurantReview", ReviewSchema);

export default RestaurantReview;