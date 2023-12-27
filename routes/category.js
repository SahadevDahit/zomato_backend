import exppress from "express";

import {
    createCategoryCtrl,
    getAllCategoriesCtrl,
    getSingleCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl,
} from "../controllers/category.js";
import {
    isLoggedIn
} from "../middlewares/isLoggedIn.js";

const categoriesRouter = exppress.Router();

categoriesRouter.post(
    "/",
    isLoggedIn,

    createCategoryCtrl
);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.delete("/:id", deleteCategoryCtrl);
categoriesRouter.put("/:id", updateCategoryCtrl);
export default categoriesRouter;