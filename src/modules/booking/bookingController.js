const helperWrapper = require("../../helpers/wrapper");
const bookingModels = require("./bookingModels");
const helperMidtrans = require("../../helpers/midtrans");
const { v4: uuidv4 } = require("uuid");

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
        id: uuidv4(),
        userId,
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

      const setDataMidtrans = {
        id: result.id,
        total: totalPayment,
      };
      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result,
        { redirectUrl: resultMidtrans.redirect_url }
      );
    } catch (error) {
      console.log(error);
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
        "Success Get Dasboard checkout",
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

  postMidtransNotification: async (request, response) => {
    try {
      console.log(request.body);
      const result = await helperMidtrans.notif(request.body);
      let orderId = result.order_id;
      let transactionStatus = result.transaction_status;
      let fraudStatus = result.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      const id = orderId;
      setData = {
        paymentMethod: result.payment_type,
        statusPayment: result.transaction_status,
        updatedAt: new Date(),
      };

      // Sample transactionStatus handling logic

      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          // UBAH STATUS PEMBAYARAN MENJADI PENDING
          // PROSES MEMANGGIL MODEL untuk ubah data di dalam database
          // id = orderId;
          // setData = {
          //   paymentMethod: result.payment_type,
          //   statusPayment: result.transaction_status,
          //   updatedAt,
          // };
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your databaase to 'success'
          // UBAH STATUS PEMBAYARAN JADI SUCCSES
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // UBAH STATUS PEMBAYARAN JADI SUCCES
        // id = orderId;
        // (setData = {
        //   paymentMethod: result.payment_type,
        //   statusPayment: result.transaction_status,
        //   updatedAt,
        // }),
        console.log(
          `Sukses melakukan pembayaran dengan id ${orderId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // // UBAH STATUS PEMBAYARAN JADI FAILED
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN JADI FAILED
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN JADI PENDING
      }
      return helperWrapper.response(
        response,
        200,
        "Success update status booking !",
        statusBooking
      );
    } catch (error) {
      console.log("error", error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
