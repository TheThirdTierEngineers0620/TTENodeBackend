const express = require('express');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete file from Cloudinary
router.delete('/delete', async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'publicId is required'
      });
    }

    console.log(`🔍 Attempting to delete file with public_id: ${publicId}`);

    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });

    console.log('📝 Cloudinary deletion result:', result);

    if (result.result === 'ok') {
      return res.status(200).json({
        success: true,
        message: 'File deleted successfully from Cloudinary',
        result: result
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to delete file from Cloudinary',
        result: result
      });
    }

  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during file deletion',
      message: error.message
    });
  }
});

// Get Cloudinary configuration (for debugging)
router.get('/config', (req, res) => {
  // Don't expose API secret in response
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'Not set',
    has_api_secret: !!process.env.CLOUDINARY_API_SECRET
  });
});

module.exports = router;