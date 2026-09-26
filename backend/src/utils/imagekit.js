const ImageKit = require('imagekit');

let imagekit = null;

const getImageKitInstance = () => {
  if (!imagekit) {
    if (
      process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
    }
  }
  return imagekit;
};

/**
 * Upload file buffer or base64 string to ImageKit
 * @param {Buffer|string} file - Buffer or base64 file data
 * @param {string} fileName - Destination file name
 * @param {string} folder - Folder name in ImageKit (e.g., '/foods')
 * @returns {Promise<Object>} ImageKit upload response containing url and fileId
 */
const uploadToImageKit = async (file, fileName, folder = '/foods') => {
  const ik = getImageKitInstance();
  if (!ik) {
    throw new Error('ImageKit configuration is missing or incomplete.');
  }

  const response = await ik.upload({
    file: file,
    fileName: fileName,
    folder: folder,
  });

  return response;
};

module.exports = {
  getImageKitInstance,
  uploadToImageKit,
};
