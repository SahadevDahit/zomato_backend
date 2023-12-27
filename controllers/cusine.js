import asyncHandler from "express-async-handler";
import cusine from "../models/cusine.js";
// @desc    Create new Cusine
// @route   POST /api/v1/cusine
// @access  Private/Admin

export const createCusineCtrl = asyncHandler(async (req, res) => {
    const {
        name
    } = req.body;
    //Cusine exists
    const CusineFound = await cusine.findOne({
        name
    });
    if (CusineFound) {
        throw new Error("Cusine already exists");
    }
    //create
    const Cusine = await cusine.create({
        name: name?.toLowerCase(),
        user: req.userAuthId,

    });

    res.json({
        status: "success",
        message: "Cusine created successfully",
        Cusine,
    });
});

// @desc    Get all Cusine
// @route   GET /api/Cusine
// @access  Public

export const getAllCusineCtrl = asyncHandler(async (req, res) => {
    const Cusine = await cusine.find();
    res.json({
        status: "success",
        message: "Cusine fetched successfully",
        Cusine,
    });
});

// @desc    Get single Cusine
// @route   GET /api/Cusine/:id
// @access  Public
export const getSingleCusineCtrl = asyncHandler(async (req, res) => {
    const Cusine = await cusine.findById(req.params.id);
    res.json({
        status: "success",
        message: "Cusine fetched successfully",
        Cusine,
    });
});

// @desc    Update Cusine
// @route   PUT /api/Cusine/:id
// @access  Private/Admin
export const updateCusineCtrl = asyncHandler(async (req, res) => {
    const {
        name
    } = req.body;

    //update
    const Cusine = await cusine.findByIdAndUpdate(
        req.params.id, {
            name,
        }, {
            new: true,
        }
    );
    res.json({
        status: "success",
        message: "Cusine updated successfully",
        Cusine,
    });
});

// @desc    delete Cusine
// @route   DELETE /api/Cusine/:id
// @access  Private/Admin
export const deleteCusineCtrl = asyncHandler(async (req, res) => {
    await cusine.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Cusine deleted successfully",
    });
});