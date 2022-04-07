const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const mustache = require("mustache");

const clientId =
  "788116442855-bphtj58231dlbhu25snufm3apd58fol3.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//044JeoSkTi52sCgYIARAAGAQSNwF-L9IrNV3fKDr2X0RpZwzlDCK7_s6B3xr5qFMlcKUo9NtqQeSGL_TpWGDOT4OGmg_el1NEAKg";

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "alakrucil@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/templates/email/${data.template}`,
        "utf8"
      );
      //   console.log(fileTemplate);

      const mailOptions = {
        from: '"Tickitz 👻" <alakrucil@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};
