/* eslint-disable radix */
/* eslint-disable no-unused-vars */
const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModels");
const authModels = require("../auth/authModels");
const cloudinary = require("../../config/cloudinary");
const { query } = require("../../config/mysql");

module.exports = {
  getHello: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getAllMovie: async (request, response) => {
    try {
      const queryString = request.query;
      const limit = parseInt(queryString.limit ? queryString.limit : 3);
      const page = parseInt(queryString.page ? queryString.page : 1);
      const offset = parseInt(page * limit) - limit; // 1*3-3=0

      const result = await movieModel.getAllMovie({
        ...queryString,
        limit,
        offset,
      });
      console.log(queryString);
      const totalData = await movieModel.getCountMovie(queryString);

      const totalPage = Math.ceil(totalData / limit); // membulatkan ke atas: Math.ceil()
      const pageInfo = {
        offset,
        totalPage,
        limit,
        totalData,
        page: parseInt(queryString.page),
      };

      // PROSES UNTUK MENYIMPAN DATA KE REDIS
      // Method JSON.stringify() untuk mengubah objek javascript menjadi string JSON
      redis.setEx(`getMovie: ${queryString}`, 3600, JSON.stringify(result));
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result,
        pageInfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      // PROSES UNTUK MENYIMPAN DATA KE REDIS
      // Method JSON.stringify() untuk mengubah objek javascript menjadi string JSON
      redis.setEx(`getMovie: ${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      // console.log(
      //   request.file.filename + "." + request.file.mimetype.split("/")[1]
      // );
      const {
        name,
        category,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
        image,
      } = request.body;
      // console.log(request.file);
      const setData = {
        name,
        category,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
        image: request.file
          ? request.file.filename + "." + request.file.mimetype.split("/")[1]
          : "",
      };
      const result = await movieModel.createMovie(setData);

      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await movieModel.getMovieById(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const {
        name,
        category,
        image,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
      } = request.body;
      console.log("request", request.file);
      const setData = {
        name,
        category,
        image: request.file
          ? request.file.filename + "." + request.file.mimetype.split("/")[1]
          : "",
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); //property
        // console.log(setData[data]); //value
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const imagePublicId = checkId[0].image.split(".")[0];
      if (request.file) {
        // Destroy gambar lama Cloudinary
        await cloudinary.uploader.destroy(imagePublicId, (result) => {
          console.log(result);
        });
      }
      const result = await movieModel.updateMovie(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      // 1. tangkap id
      const { id } = request.params;
      const newId = parseInt(id);

      // 2. proses pengecekan apakah id berada di dalam database
      const checkId = await movieModel.getMovieById(newId);

      if (checkId.length === 0) {
        return helperWrapper.response(response, 404, "Movie not found !");
      }
      // Mengambil public_id image untuk di destroy di cloudinary saat proses delete Movie
      const image = checkId[0].image.split(".")[0];
      if (image) {
        // Destroy gambar lama di Cloudinary
        await cloudinary.uploader.destroy(image, (result) => {
          console.log(result);
        });
      }
      await movieModel.deleteMovie(newId);

      return helperWrapper.response(response, 200, "delete success !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", error);
    }
  },
};
