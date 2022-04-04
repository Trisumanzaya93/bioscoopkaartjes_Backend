/* eslint-disable radix */
/* eslint-disable no-unused-vars */
const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModels");
const cloudinary = require("../../config/cloudinary");

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
      const limit = parseInt(queryString.per_page ?? 3);
      const offset = parseInt(queryString.page ?? 1 * limit) - limit; // 1*3-3=0

      const result = await movieModel.getAllMovie({
        ...queryString,
        limit,
        offset,
      });
      const totalData = await movieModel.getCountMovie();

      const totalPage = Math.ceil(totalData / limit); // membulatkan ke atas: Math.ceil()
      const pageInfo = {
        offset,
        totalPage,
        limit,
        totalData,
        page: parseInt(queryString.page),
      };

      console.log(result);
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
      redis.setEx(`getMovie: ${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      console.log(
        request.file.filename + "." + request.file.mimetype.split("/")[1]
      );
      const { name, category, synopsis, image } = request.body;
      const setData = {
        name,
        category,
        synopsis,
        image: request.file
          ? request.file.filename + "." + request.file.mimetype.split("/")[1]
          : "",
      };
      const result = await movieModel.createMovie(setData);

      return helperWrapper.response(
        response,
        200,
        "Success create data !"
        // result
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

      const result = await movieModel.updateMovie(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      console.log(error);
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
      console.log(checkId);
      if (checkId.length === 0) {
        return helperWrapper.response(response, 404, "Movie not found !");
      }

      const image = checkId[0].image.split(".")[0];
      console.log(image);
      // Destroy gambar lama Cloudinary
      const destroy = await cloudinary.uploader.destroy(image, (result) => {
        console.log(result);
      });
      await movieModel.deleteMovie(newId);

      return helperWrapper.response(response, 200, "delete success !");
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", error);
    }
  },
};
