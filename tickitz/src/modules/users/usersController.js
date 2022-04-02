const { token } = require("morgan");
const helperWrapper = require("../../helpers/wrapper");
const userModels = require("./usersModels");
const authModels = require("../auth/authModels.js");
const bcrypt = require("bcrypt");

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
      const setData = { id, firstName, lastName, noTelp };

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
        "Success update profile !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateImage: async (request, response) => {
    try {
      console.log(request.file);
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
        image: request.file ? request.file.path : "",
      };
      console.log("image", image);
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
        "Success update image !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updatePassword: async (request, response) => {
    try {
      const { newPassword, confirmPassword, oldPassword } = request.body;
      const { email } = request.userInfo;
      const checkOldPassword = await authModels.getUserByEmail(email);
      console.log(checkOldPassword);

      // 2. jika password ketika di cocokkan salah
      const isValid = await bcrypt.compare(
        oldPassword,
        checkOldPassword[0].password
      );
      if (!isValid) {
        return helperWrapper.response(response, 400, "Wrong password");
      }
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "Your Password doesn't Match ! "
        );
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);

      const result = await userModels.updatePassword(email, passwordHash);

      // // 3. PROSES JWT
      // const payload = checkUser[0];

      // const jwtOptions = {
      //   expiresIn: "24h",
      // };
      // delete payload.password;

      // const token = jwt.sign({ ...payload }, "RAHASIA", jwtOptions);

      return helperWrapper.response(
        response,
        200,
        "Password changed !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
