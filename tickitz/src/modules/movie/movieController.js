/* eslint-disable radix */
/* eslint-disable no-unused-vars */
const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModels");

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
      console.log(request.decodeToken);
      const queryString = request.query;
      const limit = parseInt(queryString.per_page ?? 2);
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

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      // request = {
      //   params: {
      //     id: 1
      //   }
      // }
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
      redis.setEx(`getMovie: $(id)`, 3600, JSON.stringify(result));

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
      console.log(request.file);
      const { name, category, synopsis } = request.body;
      const setData = {
        name,
        category,
        synopsis,
        // image: request.file ? request.file.filename : "" (untuk cek gambar)
      };
      const result = await movieModel.createMovie(request.body);
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

      const { name, category, synopsis } = request.body;
      const setData = {
        name,
        category,
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
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const newId = parseInt(id);
      const checkId = await movieModel.getMovieById(newId);

      if (checkId.length === 0) {
        return helperWrapper.response(response, 404, "Movie not found !");
      }

      await movieModel.deleteMovie(newId);
      // 1. tangkap id
      // 2. proses pengecekan apakah id berada di dalam database
      // 3. dengan query = DELETE FROM movie Whre id =?
      // 4. resolve (id)
      // 5. Set Response
      // yg diatas Buat sendiri
      return helperWrapper.response(response, 200, "delete success !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", error);
    }
  },
};
