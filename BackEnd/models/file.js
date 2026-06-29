import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    resource_type: { type: String, required: true },

}, { timestamps: true })

const File = mongoose.model("File", FileSchema);

export default File;