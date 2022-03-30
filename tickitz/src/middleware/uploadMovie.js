const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// // JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tickitz",
  },
});
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     //destinasi berisi error, dan lokasi penyimpanan data
//     cb(null, "public/upload/movie");
//   },
//   filename(req, file, cb) {
//     // untuk mengganti nama dan namanya di ganti sesuai dengan isi cb
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

const upload = multer({ storage }).single("image");
console.log(upload);
module.exports = upload;
