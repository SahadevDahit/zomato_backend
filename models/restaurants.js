//category schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    restaurantReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurantReview",
    }],
    image: {
        type: String,
        required: false,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
    }, ],
}, {
    timestamps: true
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);

export default Restaurant;