const { request, response } = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// // JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND

let fileFilter = (request, file, cb) => {
  var allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  console.log("file.mimetype", file.mimetype);
  if (
    allowedMimes.includes(file.mimetype) ||
    allowedMimes.includes(file.type)
  ) {
    cb(null, true);
  } else {
    cb(
      {
        success: false,
        message: "Invalid file type. Only jpg, png image files are allowedd.",
      },
      false
    );
  }
};

const storage = new CloudinaryStorage({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: fileFilter,

  cloudinary,
  params: {
    folder: "tickitz/movie",
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

const handlingUpload = async (request, response, next) => {
  await upload(request, response, (error) => {
    console.log(response);
    // if (error) {
    //   //instanceof multer.MulterError
    //   // A Multer error occurred when uploading.
    //   return helperWrapper.response(response, 401, error.message, null);
    // }
    // if (error.code == "LIMIT_FILE_SIZE") {
    //   // An unknown error occurred when uploading.
    //   return helperWrapper.response(response, 401, error.message, null);
    // }
    return next();
  });
};
module.exports = handlingUpload;
