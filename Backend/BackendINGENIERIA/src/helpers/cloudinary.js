const { v2 } = require("cloudinary");

v2.config({
    cloud_name: "dvgrcqa0l",
    api_key: "624394573677332",
    api_secret: "kNaImQ2TFH5eqRb9iYuOaSNHoWA"
});




const uploadPicture = async (filePath) => {
  return await v2.uploader.upload(filePath, {
    folder: "imagenes"
  });
};

const uploadAvatar = async (filePath) => {
  return await v2.uploader.upload(filePath, {
    folder: "avatar"
  });
};
const deleteAvatar = async (id) => {
  return await v2.uploader.destroy(id);
};
module.exports = {
  uploadPicture,
  uploadAvatar,
  deleteAvatar
};