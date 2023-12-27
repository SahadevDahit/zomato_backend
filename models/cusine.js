//category schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CusineSchema = new Schema({
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

const Cusine = mongoose.model("cusine", CusineSchema);

export default Cusine;