const admin = require("firebase-admin");

const serviceAccount = require("./bioscoopkaartjes-c1573-firebase-adminsdk-fnkym-3831cdf587.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
