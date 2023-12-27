//Review Schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Review must belong to a user"],
    },
    items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: [true, "Review must belong to a items"],
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

const Review = mongoose.model("reviews", ReviewSchema);

export default Review;