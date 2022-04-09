const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-TiDy-3te3B0NjzC31cpOCedU",
  clientKey: "SB-Mid-client-colXFZFEB8UPcyc4",
});

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      console.log("POST MIDTRANS RUN");
      let parameter = {
        transaction_details: {
          order_id: data.id,
          gross_amount: data.total,
        },
        credit_card: {
          secure: true,
        },
      };

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          // transaction token
          //   let transactionToken = transaction.token;
          //   console.log("transactionToken:", transactionToken);
          // console.log (transaction) = transaction menampilkan token dan redirect_url (ke proses pembayaran midtrans)
          // yang di tampilkan termasuk parameter (transaction detail dan payment methode)
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  notif: () =>
    new Promise((resolve, reject) => {
      console.log("NOTIF MIDTRANS RUN");
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          //   console.log(statusResponse);
          resolve(statusResponse);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
