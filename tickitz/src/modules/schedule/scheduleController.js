const helperWrapper = require("../../helpers/wrapper");
const scheduleModel = require("./scheduleModels");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page); //1
      limit = Number(limit); //3
      const offset = page * limit - limit; // 1*3-3=0
      const totalData = await scheduleModel.getCountScedule();
      const totalPage = Math.ceil(totalData / limit); //membulatkan ke atas: Math.ceil()
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await scheduleModel.getAllSchedule(limit, offset);
      return helperWrapper.response(response, 200, "Success get data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(response, 200, "Success get data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  createSchedule: async (request, response) => {
    try {
      const { movieId, premier, price, location, dateStart, dateEnd } =
        request.body;
      const setData = {
        movieId,
        premier,
        price,
        location,
        dateStart,
        dateEnd,
      };
      const result = await movieModel.createSchedule(request.body);
      return helperWrapper.response(response, 200, "Success create data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await scheduleModel.getScheduleById(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { movieId, premier, price, location, dateStart, dateEnd } =
        request.body;
      const setData = {
        movieId,
        premier,
        price,
        location,
        dateStart,
        dateEnd,
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

      const result = await scheduleModel.updateSchedule(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  deleteSchedule: async (request, response) => {
    const { id } = request.params;
    const newId = parseInt(id);
    try {
      const checkId = await scheduleModel.getScheduleById(newId);
      if (checkId.length === 0)
        return helperWrapper.response(response, 404, "Schedule not found !");

      await scheduleModel.deleteSchedule(newId);
      return helperWrapper.response(response, 200, "Success delete schedule !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
