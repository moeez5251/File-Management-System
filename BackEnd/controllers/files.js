import File from "../models/file.js";
import User from "../models/user.js";
export const getallfiles = async (req, res) => {

    try {
        const files = await File.find();
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