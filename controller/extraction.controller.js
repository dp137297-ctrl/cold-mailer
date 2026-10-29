import Extraction from "../model/extractin.modle.js";
import { extractWithNvidia } from "../ai.util.js";

export const extractContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const base64 = req.file.buffer.toString("base64");
    const imageData = `data:${req.file.mimetype};base64,${base64}`;
    const prompt =
      "Analyze this image and extract visible information. If it contains a resume, extract: - Name - Email - Phone - Skills - Education - Experience - Projects If it contains a LinkedIn recruitment post, extract: - Recruiter email, if visible - Recruiter or author name - Company - Job role - Required skills - Post content Return valid JSON. Use null for missing information. Do not invent or guess information.";
    const rawContent = await extractWithNvidia(prompt, imageData);
    let data;

    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch (parseError) {
      console.error("Error parsing extracted JSON:", parseError);
      data = { rawContent };
    }

    const savedExtraction = await Extraction.create({
      data,
      rawContent,
      createdBy: req.user._id,
    });

    return res.status(200).json({
      message: "Content extracted successfully",
      savedExtraction,
    });
  } catch (error) {
    console.error("Error extracting content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract content",
      error: error.message,
    });
  }
};