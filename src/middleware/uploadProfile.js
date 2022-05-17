const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// // JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND

// Penyimpanan di cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tickitz/ProfileImage",
  },
});

const fileFilter = (request, file, callback) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    callback(null, true);
  } else {
    return callback(new Error("Invalid file extention !"));
  }
};

const file = multer({
  storage: storage,
  limits: {
    fileSize: 500000,
  },
  fileFilter: fileFilter,
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

const upload = file.single("image");
// multer({ file }).single("image");
const handlingUpload = async (request, response, next) => {
  await upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
      // limit = File to large
      // extensi = bisa di customize
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};
module.exports = handlingUpload;
