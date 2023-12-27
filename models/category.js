//category schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
    }, ],
}, {
    timestamps: true
});

const Category = mongoose.model("category", CategorySchema);

export default Category;