import asyncHandler from "express-async-handler";
import item from "../models/items.js";
import Review from "../models/reviews.js";

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin
export const getReviewCtrl = asyncHandler(async (req, res) => {

    const reviews = await Review.find();
    res.json({
        status: "success",
        message: "Reviews fetched successfully",
        reviews,
    });

})
export const getSingleReview = asyncHandler(async (req, res) => {
    const reviews = await Review.findById(req.params.id);
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
        items_id
    } = req.body;

    // 1. Find the item
    const itemFound = await item.findById(items_id).populate("itemReviews");
    if (!itemFound) {
        throw new Error("Item Not Found");
    }

    // 2. Check if the user already reviewed this item
    let reviewCount = 0;
    itemFound?.itemReviews?.find((review) => {
        if (review?.user?.toString() === req?.userAuthId?.toString()) {
            ++reviewCount;
        }
        return null;
    });

    if (reviewCount >= 3) {
        throw new Error("You have already reviewed this item three times");
    }

    // 3. Create review
    const review = await Review.create({
        message,
        rating,
        items: itemFound?._id,
        user: req.userAuthId,
    });

    // 4. Push review into itemFound
    itemFound.itemReviews.push(review?._id);

    // 5. Resave
    await itemFound.save();

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
    const reviews = await Review.findByIdAndUpdate(
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
    await Review.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Review deleted successfully",
    });


})