import asyncHandler from "express-async-handler";
import Restaurant from "../models/restaurants.js";
import RestaurantReview from "../models/restaurantReview.js";

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin
export const getReviewCtrl = asyncHandler(async (req, res) => {

    const reviews = await RestaurantReview.find();
    res.json({
        status: "success",
        message: "RestaurantReview fetched successfully",
        reviews,
    });

})
export const getSingleReview = asyncHandler(async (req, res) => {
    const reviews = await RestaurantReview.findById(req.params.id);
    res.json({
        status: "success",
        message: "reviews fetched successfully",
        reviews,
    });
});
export const createReviewCtrl = asyncHandler(async (req, res) => {
    const {
        message,
        rating,
        restaurant_id
    } = req.body;
    // 1. Find the item
    const RestaurantFound = await Restaurant.findById(restaurant_id).populate("restaurantReviews");

    if (!RestaurantFound) {
        throw new Error("Restaurant Not Found");
    }
    // 2. Check if the user already reviewed this Restaurant
    let reviewCount = 0;
    RestaurantFound?.restaurantReviews?.find((review) => {
        if (review?.user?.toString() === req?.userAuthId?.toString()) {
            ++reviewCount;
        }
        return null;
    });

    if (reviewCount >= 3) {
        throw new Error("You have already reviewed this Restaurant three times");
    }

    // 3. Create review
    const review = await RestaurantReview.create({
        message,
        rating,
        restaurant: RestaurantFound?._id,
        user: req.userAuthId,
    });

    // 4. Push review into RestaurantFound
    RestaurantFound.restaurantReviews.push(review?._id);

    // 5. Resave
    await RestaurantFound.save();

    res.status(201).json({
        success: true,
        message: "Review created successfully",
    });
});

export const updateReviewCtrl = asyncHandler(async (req, res) => {
    const {
        message,
        rating
    } = req.body;

    //update
    const reviews = await RestaurantReview.findByIdAndUpdate(
        req.params.id, {
            message,
            rating,
        }, {
            new: true,
        }
    );
    res.json({
        status: "success",
        message: "reviews updated successfully",
        reviews,
    });

})

export const deleteReviewCtrl = asyncHandler(async (req, res) => {
    await RestaurantReview.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Review deleted successfully",
    });


})