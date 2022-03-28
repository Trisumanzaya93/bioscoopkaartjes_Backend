const helperWrapper = require("../../helpers/wrapper");
const bookingModels = require("./bookingModels");

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
  createBooking: async (request, response) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;
      const setBooking = {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
      };
      const result = await bookingModels.createBooking(setBooking);
      console.log(result);
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
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
