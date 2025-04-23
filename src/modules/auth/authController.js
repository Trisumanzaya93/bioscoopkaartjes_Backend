const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const authModels = require("./authModels");
const { sendMail } = require("../../helpers/mail");
const redis = require("../../config/redis");
const { v4: uuidv4 } = require("uuid");
const userModels = require("../users/usersModels");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, email, noTelp, password } = request.body;
      // 1. password di encript
      // 2. Ketika registrasi dengan email yang sama: tambahkan kondisi email sudah terdaftar atau belum
      // ada 1 lagi

      const result = await authModels.getUserByEmail(email);

      if (result.length >= 1) {
        return helperWrapper.response(
          response,
          404,
          "Your email is registered"
        );
      }

      //HASH PASWORD
      // Create User ke database
      passwordHash = await bcrypt.hash(password, 10);

      // membuat id user unik (random) dengan uuid
      const id = uuidv4();
      const setData = {
        id,
        firstName,
        lastName,
        email,
        noTelp,
        password: passwordHash,
        pinActivation: uuidv4(),
      };

      const newResult = await authModels.register(setData);

      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: firstName,
        template: "verificationEmail.html",
        buttonUrl: `http://localhost:3001/auth/updateStatus/${id}`,
      };
      console.log(setSendEmail);
      const responsen = await sendMail(setSendEmail);

      console.log("responsen", responsen);
      return helperWrapper.response(response, 200, "Success register user", {
        newResult,
        responsen,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const checkUser = await authModels.getUserByEmail(email);
      // console.log(checkUser[0]);
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
      // if (!isValid) {
      //   return helperWrapper.response(response, 400, "Wrong password");
      // }

      // 3. PROSES JWT
      const payload = checkUser[0];
      delete payload.password;

      // const jwtOptions = {
      //   expiresIn: "24h",
      // };

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });
      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
        refreshToken,
        role: checkUser[0].role,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  refresh: async (request, response) => {
    try {
      // console.log(request.body);
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh Token cannot be use",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        delete result.iat;
        delete result.exp;
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        const token = jwt.sign({ ...result }, "RAHASIA", { expiresIn: "1h" });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateStatus: async (request, response) => {
    try {
      const { id } = request.params;
      // console.log(pinActivation);
      const checkId = await userModels.getDataUserByUserId(id);
      if (checkId.length < 1) {
        return helperWrapper.response(response, 404, "User not Found", null);
      }

      const setData = {
        status: "active",
      };

      await authModels.updateStatus(setData, id);
      return helperWrapper.response(
        response,
        200,
        "Success Activate account",
        null
      );
    } catch (error) {
      console.log("err1", error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
