const { request, response } = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// // JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Profile Image",
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

// UNTUK PENGECEKAN LIMIT DAN EKSTENSI BISA DITAMBAH DI MIDDLEWARE
// PROSES KONDISI LIMIT DAN CEK EKSTENSI FILE IN HERE

const upload = multer({ storage }).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    } else if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;
