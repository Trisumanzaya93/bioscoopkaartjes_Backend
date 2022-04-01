const helperWrapper = require("../../helpers/wrapper");
const userModels = require("./usersModels");

module.exports = {
  getDataUserByUserId: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await userModels.getDataUserByUserId(id);
      // untuk men-delete data password dari data query yang di keluarkan
      //   delete result.password;

      return helperWrapper.response(response, 200, "Success get data", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await userModels.getDataUserByUserId(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { firstName, lastName, noTelp } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); //property
        // console.log(setData[data]); //value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await userModels.updateProfile(id, setData);

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

  updateImage: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await userModels.getDataUserByUserId(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { image } = request.body;
      const setData = {
        image
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); //property
        // console.log(setData[data]); //value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await userModels.updateImage(id, setData);

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
};
