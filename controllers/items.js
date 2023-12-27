import asyncHandler from "express-async-handler";
import category from "../models/category.js";
import cusine from "../models/cusine.js";
import restaurant from "../models/restaurants.js";
import item from "../models/items.js";
import cloudinaryImageUpload from "../config/uploadMultipleFiles.js"
// @desc    Create new items
// @route   POST /api/v1/items
// @access  Private/Admin
export const createItemsCtrl = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category_id,
        sizes,
        colors,
        price,
        totalQty,
        cusine_id,
        restaurant_id
    } = req.body;

    // Items exist check
    const itemsExists = await item.findOne({
        name
    });
    if (itemsExists) {
        throw new Error("Item Already Exists");
    }

    // Find the category
    const categoryFound = await category.findById(category_id);
    if (!categoryFound) {
        throw new Error(
            "Category not found, please create category first or check category name"
        );
    }

    // Find the cuisine
    const cusineFound = await cusine.findById(cusine_id);
    if (!cusineFound) {
        throw new Error(
            "Cuisine not found, please create cuisine first or check cuisine name"
        );
    }

    // Find the restaurant
    const restaurantFound = await restaurant.findById(restaurant_id);
    if (!restaurantFound) {
        throw new Error(
            "Restaurant not found, please create restaurant first or check restaurant name"
        );
    }

    // Upload images to Cloudinary
    const urls = await Promise.all(req.files.map(async (file) => {
        const {
            path
        } = file;
        const newPath = await cloudinaryImageUpload(path, {
            folder: "items"
        });
        return newPath.res;
    }));

    // Create the item
    const itemFound = await item.create({
        name,
        description,
        category_id,
        restaurant_id,
        cusine_id,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        images: urls,
    });

    // Push the item into the category, cuisine, and restaurant
    categoryFound.items.push(item._id);
    await categoryFound.save();

    cusineFound.items.push(item._id);
    await cusineFound.save();

    restaurantFound.items.push(item._id);
    await restaurantFound.save();

    // Send response
    return res.status(200).json({
        status: "success",
        message: "Item created successfully",
        itemFound,
    });
});


// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

export const getItemsCtrl = asyncHandler(async (req, res) => {
    //query
    let itemsQuery = item.find();

    //search by name
    if (req.query.name) {
        itemsQuery = itemsQuery.find({
            name: {
                $regex: req.query.name,
                $options: "i"
            },
        });
    }

    //filter by category
    if (req.query.category) {
        itemsQuery = itemsQuery.find({
            category: {
                $regex: req.query.category,
                $options: "i"
            },
        });
    }

    //filter by color
    if (req.query.color) {
        itemsQuery = itemsQuery.find({
            colors: {
                $regex: req.query.color,
                $options: "i"
            },
        });
    }

    //filter by size
    if (req.query.size) {
        itemsQuery = itemsQuery.find({
            sizes: {
                $regex: req.query.size,
                $options: "i"
            },
        });
    }
    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        //gte: greater or equal
        //lte: less than or equal to
        itemsQuery = itemsQuery.find({
            price: {
                $gte: priceRange[0],
                $lte: priceRange[1]
            },
        });
    }
    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //startIdx
    const startIndex = (page - 1) * limit;
    //endIdx
    const endIndex = page * limit;
    //total
    const total = await item.countDocuments();

    itemsQuery = itemsQuery.skip(startIndex).limit(limit);

    //pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    //await the query
    const itemFound = await itemsQuery;
    res.json({
        status: "success",
        total,
        results: itemFound.length,
        pagination,
        message: "Items fetched successfully",
        itemFound,
    });
});

// @desc    Get single product
// @route   GET /api/items/:id
// @access  Public

export const getItemCtrl = asyncHandler(async (req, res) => {
    const itemFound = await item.findById(req.params.id)
        .populate({
            path: "itemReviews",
            populate: {
                path: "user",
                select: "fullname",
            },
        });
    if (!itemFound) {
        throw new Error("Items not found");
    }
    res.json({
        status: "success",
        message: "Items fetched successfully",
        itemFound,
    });
});

// @desc    update  items
// @route   PUT /api/items/:id/update
// @access  Private/Admin

export const updateItemsCtrl = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category_id,
        cusine_id,
        restaurant_id,
        sizes,
        colors,
        user,
        price,
        totalQty,
    } = req.body;
    //validation

    //update
    const items = await item.findByIdAndUpdate(
        req.params.id, {
            name,
            description,
            category_id,
            cusine_id,
            restaurant_id,
            sizes,
            colors,
            user,
            price,
            totalQty,
        }, {
            new: true,
            runValidators: true,
        }
    );
    res.json({
        status: "success",
        message: "items updated successfully",
        items,
    });
});

// @desc    delete  items
// @route   DELETE /api/items/:id/delete
// @access  Private/Admin
export const deleteItemsCtrl = asyncHandler(async (req, res) => {
    await item.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Items deleted successfully",
    });
});