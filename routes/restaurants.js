import exppress from "express";

import {
    createRestaurantCtrl,
    getAllRestaurantCtrl,
    getSingleRestaurantCtrl,
    updateRestaurantCtrl,
    deleteRestaurantCtrl,
} from "../controllers/restaurants.js";
import {
    isLoggedIn
} from "../middlewares/isLoggedIn.js";

const restaurantRouter = exppress.Router();

restaurantRouter.post(
    "/",
    isLoggedIn,
    createRestaurantCtrl
);
restaurantRouter.get("/", getAllRestaurantCtrl);
restaurantRouter.get("/:id", getSingleRestaurantCtrl);
restaurantRouter.delete("/:id", deleteRestaurantCtrl);
restaurantRouter.put("/:id", updateRestaurantCtrl);
export default restaurantRouter;