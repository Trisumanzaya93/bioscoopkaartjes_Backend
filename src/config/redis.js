const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
  // host: process.env.REDIS_HOST,
  // port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD,
  // url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  url: process.env.REDIS_URL,
});

/*
(async () => {
  await client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're now connected db redis ...");
  });
})();
*/

(async () => {
  await client.connect(); // kasih await biar tunggu selesai connect
  console.log("You're now connected to Redis!");
})();

module.exports = client;
