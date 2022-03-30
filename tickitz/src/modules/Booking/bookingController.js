const helperWrapper = require("../../helpers/wrapper");
const bookingModels = require("./bookingModels");

module.exports = {
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

  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await bookingModels.getBookingByIdBooking(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { scheduleId, statusUsed } = request.body;
      const setData = {
        scheduleId,
        statusUsed,
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

      const result = await bookingModels.updateStatusBooking(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success use ticket !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  // getSeatBooking: async (request, response) => {
  //   try {
  //     const queryString = request.params;

  //     const result = await bookingModels.getSeatBooking(queryString);
  //     return helperWrapper.response(
  //       response,
  //       200,
  //       "Success get data !",
  //       result
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return helperWrapper.response(response, 400, "Bad Request", null);
  //   }
  // },

  // getBookingByIdBooking: async (request, response) => {
  //   try {
  //     const { id } = request.params;
  //     const result = await bookingModel.getBookingByIdBooking(id);

  //     if (result.length <= 0) {
  //       return helperWrapper.response(
  //         response,
  //         404,
  //         `Data by id ${id} not found`,
  //         null
  //       );
  //     }
  //     return helperWrapper.response(
  //       response,
  //       200,
  //       "Success get data !",
  //       result
  //     );
  //   } catch (error) {
  //     return helperWrapper.response(response, 400, "Bad Request", null);
  //   }
  // },
};
