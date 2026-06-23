import cloudinary from "../config/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    console.log("Received file:", file);
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "uploads",
      resource_type: "auto",
    });
    console.log("File uploaded to Cloudinary:", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};