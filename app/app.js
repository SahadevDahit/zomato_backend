import express from "express";
import dotenv from "dotenv";
import helmet from 'helmet';
dotenv.config();
import dbConnect from "../config/dbConnect.js";
import {
    globalErrhandler,
    notFound
} from "../middlewares/globalErrHandler.js";
import cors from "cors";
import userRoutes from "../routes/users.js";
import shippingAddressRoutes from "../routes/shippingAddress.js"
import category from "../routes/category.js"
import cusine from "../routes/cusine.js"
import restaurant from "../routes/restaurants.js"
import items from "../routes/items.js"
import reviews from "../routes/reviews.js"
import restaurantReviews from "../routes/restaurantReview.js"
import orders from "../routes/orders.js"

const app = express();
app.disable('x-powered-by')
app.use(cors());
app.use(helmet())
//pass incoming data
app.use(express.json());
//url encoded
app.use(express.urlencoded({
    extended: true
}));
dbConnect();
//routes
app.use("/v1/users", userRoutes);
app.use("/v1/shippingAddress", shippingAddressRoutes);
app.use("/v1/category", category);
app.use("/v1/cusine", cusine);
app.use("/v1/restaurant", restaurant);
app.use("/v1/items", items);
app.use("/v1/reviews", reviews);
app.use("/v1/orders", orders);
app.use("/v1/restaurantReviews", restaurantReviews);

app.get("/", (req, res) => {
    res.send("Welcome to Zomato backend API");
})

//err middleware
app.use(notFound);
app.use(globalErrhandler);

export default app;