const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const authModels = require("./authModels");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, email, password } = request.body;
      // 1. password di encript
      // 2. Ketika registrasi dengan email yang sama: tambahkan kondisi email sudah terdaftar atau belum
      // ada 1 lagi

      const result = await authModels.getUserByEmail(email);
      if (result.length >= 1) {
        return helperWrapper.response(
          response,
          404,
          "Your email is registered",
          null
        );
      }
      passwordHash = await bcrypt.hash(password, 10);
      const setData = {
        firstName,
        email,
        password: passwordHash,
      };

      const newResult = await authModels.register(setData);
      return helperWrapper.response(
        response,
        200,
        "Success register user",
        newResult
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const checkUser = await authModels.getUserByEmail(email);

      //   1. jika email tidak ada di dalam database
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Email not registed",
          null
        );
      }

      // 2. jika password ketika di cocokkan salah
      const isValid = await bcrypt.compare(password, checkUser[0].password);
      if (!isValid) {
        return helperWrapper.response(response, 400, "Wrong password");
      }

      // 3. PROSES JWT
      const payload = checkUser[0];
      const jwtOptions = {
        expiresIn: "24h",
      };
      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", jwtOptions);

      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
