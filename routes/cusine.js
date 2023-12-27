import exppress from "express";

import {
    createCusineCtrl,
    getAllCusineCtrl,
    getSingleCusineCtrl,
    updateCusineCtrl,
    deleteCusineCtrl,
} from "../controllers/cusine.js";
import {
    isLoggedIn
} from "../middlewares/isLoggedIn.js";

const cusineRouter = exppress.Router();
cusineRouter.post(
    "/",
    isLoggedIn,

    createCusineCtrl
);
cusineRouter.get("/", getAllCusineCtrl);
cusineRouter.get("/:id", getSingleCusineCtrl);
cusineRouter.delete("/:id", deleteCusineCtrl);
cusineRouter.put("/:id", updateCusineCtrl);
export default cusineRouter;