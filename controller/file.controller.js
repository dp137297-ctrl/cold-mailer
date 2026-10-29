import cloudinary from "../configf/cloud.config.js";
import File from "../model/file.model.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { filename } = req.body ?? {};
    if (typeof filename !== "string" || !filename.trim()) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "files",
          resource_type: "auto",
        },
        (error, uploadedFile) => {
          if (error) {
            reject(error);
          } else if (!uploadedFile) {
            reject(new Error("Cloudinary upload returned no result"));
          } else {
            resolve(uploadedFile);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    const savedFile = await File.create({
      filename: filename.trim(),
      fileurl: result.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error("File upload error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
