import File from "../models/file.js";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
export const getallfiles = async (req, res) => {
    try {
        const files = await File.find().populate("owner", "name");
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export const getbyid = async (req, res) => {
    try {
        const file = await File.find({ owner: req.user.id });
        const user = await User.findById(req.user.id);
        res.json({
            files: file,
            username: user.name
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const rename = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        file.name = req.body.name;
        await file.save();
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deletefile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        const result = await cloudinary.uploader.destroy(file.public_id, { resource_type: file.resource_type });
        console.log(result)

        await File.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}