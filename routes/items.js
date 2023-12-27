import exppress from "express";
import {
    createItemsCtrl,
    getItemsCtrl,
    getItemCtrl,
    updateItemsCtrl,
    deleteItemsCtrl,
} from "../controllers/items.js";
import upload from "../config/multer.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
    isLoggedIn
} from "../middlewares/isLoggedIn.js";

const itemsRouter = exppress.Router();

itemsRouter.post(
    "/",
    isLoggedIn,
    isAdmin,
    upload.array("files", 3),
    createItemsCtrl
);

itemsRouter.get("/", getItemsCtrl);
itemsRouter.get("/:id", getItemCtrl);
itemsRouter.put("/:id", isLoggedIn, isAdmin, updateItemsCtrl);
itemsRouter.delete("/:id", isLoggedIn, isAdmin, deleteItemsCtrl);
export default itemsRouter;