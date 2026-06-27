import cloudinary from "../config/cloudinary.js";
import File from "../models/file.js";
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "uploads",
      display_name: file.originalname,
      resource_type: "auto",
    });
    const files = new File({
      name: file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      owner: req.user?.id || "test",
      size: file.size,
      mimetype: file.mimetype,
      resource_type: result.resource_type
    });
    await files.save();
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};