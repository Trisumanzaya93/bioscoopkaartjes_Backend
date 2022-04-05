const helperWrapper = require("../../helpers/wrapper");
const bookingModels = require("./bookingModels");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;

      const setBooking = {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
      };
      const result = await bookingModels.createBooking(setBooking);

      seat.map(async (item) => {
        const setData = {
          bookingId: result.id,
          seat: item,
        };
        await bookingModels.createSeat(setData);
      });

      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await bookingModels.getBookingByUserId(userId);
      const seat = result.map((item) => item.seat);

      console.log(result);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by user id ${userId} not found`,
          null
        );
      }

      return helperWrapper.response(response, 200, "Success get data !", {
        ...result[0],
        seat,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getBookingByIdBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModels.getBookingByIdBooking(id);
      const seat = result.map((item) => item.seat);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      // PROSES UNTUK MENYIMPAN DATA KE REDIS
      // redis.setEx(`getMovie: ${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(response, 200, "Success get data !", {
        ...result[0],
        seat,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getSeatBooking: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;

      const date = new Date(dateBooking);

      const result = await bookingModels.getSeatBooking(
        scheduleId,
        date,
        timeBooking
      );

      const seat = result.map((item) => item.seat);

      return helperWrapper.response(
        response,
        200,
        "Success Booking Seat",
        seat
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getDashboardBooking: async (request, response) => {
    try {
      const { scheduleId, movieId, location } = request.query;

      const result = await bookingModels.getDashboardBooking(
        scheduleId,
        movieId,
        location
      );

      return helperWrapper.response(
        response,
        200,
        "Success Booking Seat",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await bookingModels.getBookingByIdBooking(id);
      console.log(checkId);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const setData = {
        statusUsed: "notActived",
      };

      const result = await bookingModels.updateStatusBooking(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success use ticket !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
