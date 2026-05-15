const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Handle image upload and shelf-life prediction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const predictShelfLife = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // For now, we simulate a prediction
    // In the future, we will run the image through the TensorFlow Lite model
    const simulatedShelfLife = Math.floor(Math.random() * 7) + 1; // 1 to 7 days

    // Optionally, save the file record (we already saved via multer)
    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      predictedShelfLife: simulatedShelfLife,
      timestamp: new Date()
    };

    // In a real app, we would save this to a database
    // For now, we just return the prediction

    res.status(200).json({
      success: true,
      data: {
        shelfLifeDays: simulatedShelfLife,
        confidence: 0.85, // Placeholder confidence
        fileId: req.file.filename, // Using filename as ID for now
        message: `Shelf-life prediction: ${simulatedShelfLife} day(s)`
      }
    });
  } catch (error) {
    console.error('Error in shelf-life prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  predictShelfLife
};