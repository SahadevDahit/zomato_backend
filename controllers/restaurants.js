import asyncHandler from "express-async-handler";
import restaurant from "../models/restaurants.js";
// @desc    Create new Restaurant
// @route   POST /api/v1/restaurant
// @access  Private/Admin

export const createRestaurantCtrl = asyncHandler(async (req, res) => {
    const {
        name,
        location,
        city,
        street
    } = req.body;
    //Restaurant exists
    const RestaurantFound = await restaurant.findOne({
        name
    });
    if (RestaurantFound) {
        throw new Error("Restaurant already exists");
    }
    //create
    const Restaurant = await restaurant.create({
        name: name?.toLowerCase(),
        user: req.userAuthId,
        location,
        city,
        street
    });

    res.json({
        status: "success",
        message: "Restaurant created successfully",
        Restaurant,
    });
});

// @desc    Get all restaurant
// @route   GET /api/restaurant
// @access  Public

export const getAllRestaurantCtrl = asyncHandler(async (req, res) => {
    const restaurants = await restaurant.find();
    res.json({
        status: "success",
        message: "restaurant fetched successfully",
        restaurants,
    });
});

// @desc    Get single Restaurant
// @route   GET /api/restaurant/:id
// @access  Public
export const getSingleRestaurantCtrl = asyncHandler(async (req, res) => {
    const Restaurant = await restaurant.findById(req.params.id);
    res.json({
        status: "success",
        message: "Restaurant fetched successfully",
        Restaurant,
    });
});

// @desc    Update Restaurant
// @route   PUT /api/restaurant/:id
// @access  Private/Admin
export const updateRestaurantCtrl = asyncHandler(async (req, res) => {
    const {
        name
    } = req.body;

    //update
    const Restaurant = await restaurant.findByIdAndUpdate(
        req.params.id, {
            name,
        }, {
            new: true,
        }
    );
    res.json({
        status: "success",
        message: "Restaurant updated successfully",
        Restaurant,
    });
});

// @desc    delete Restaurant
// @route   DELETE /api/restaurant/:id
// @access  Private/Admin
export const deleteRestaurantCtrl = asyncHandler(async (req, res) => {
    await restaurant.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Restaurant deleted successfully",
    });
});