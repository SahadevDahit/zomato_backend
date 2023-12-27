import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Order from "../models/orders.js";
import item from "../models/items.js";
//@desc create orders
//@route POST /api/v1/orders
//@access private

export const createOrderCtrl = asyncHandler(async (req, res) => {
    const {
        itemId,
        quantityOrdered,
    } = req.body;
    const itemFound = await item.findById(itemId);
    let totalQty = parseInt(itemFound.totalQty);
    let price = parseInt(itemFound.price);
    let totalSold = parseInt(itemFound.totalSold)
    parseInt(quantityOrdered);
    if (totalQty <= 0) {
        throw new Error("Quantity of items unavailable");
    }
    if (totalQty < quantityOrdered) {
        throw new Error("Total Quantity Exceeds");
    }
    if (itemFound) {
        totalSold += quantityOrdered;
        totalQty -= quantityOrdered;

        itemFound.totalQty = totalQty;
        itemFound.totalSold = totalSold;
    }
    await itemFound.save();

    let totalPrice = quantityOrdered * price;
    let discount = 0;

    let order = {
        user: req.userAuthId,
        item: itemId,
        quantityOrdered,
        discount,
        totalPrice
    }

    const orders = await Order.create(order);
    res.json({
        status: "success",
        message: "order created successfully",
        orders,
    });
});


//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
    //find all orders
    const orders = await Order.find().populate("user");
    res.json({
        success: true,
        message: "All orders",
        orders,
    });
});

//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
    //get the id from params
    const id = req.params.id;
    const order = await Order.findById(id);
    //send response
    res.status(200).json({
        success: true,
        message: "Single order",
        order,
    });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrlAdmin = asyncHandler(async (req, res) => {
    //get the id from params
    const id = req.params.id;
    //update
    const updatedOrder = await Order.findByIdAndUpdate(
        id, {
            status: req.body.status,
        }, {
            new: true,
        }
    );
    res.status(200).json({
        success: true,
        message: "Order updated",
        updatedOrder,
    });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
    //get order stats
    const orders = await Order.aggregate([{
        $group: {
            _id: null,
            minimumSale: {
                $min: "$totalPrice",
            },
            totalSales: {
                $sum: "$totalPrice",
            },
            maxSale: {
                $max: "$totalPrice",
            },
            avgSale: {
                $avg: "$totalPrice",
            },
        },
    }, ]);
    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([{
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
    //send response
    res.status(200).json({
        success: true,
        message: "Sum of orders",
        orders,
        saleToday,
    });
});