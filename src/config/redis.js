const { createClient } = require("redis");
require("dotenv").config(); // Pastikan dotenv di-load untuk environment variables

// Mengambil URL Redis dari environment variable
const redisUrl = process.env.REDIS_URL;

// Membuat client Redis menggunakan URL yang sudah diambil
const client = createClient({
  url: redisUrl,
});

(async () => {
  try {
    await client.connect(); // Koneksi ke Redis
    console.log("You're now connected to Redis!");
    
    // Tes koneksi dengan set dan get data
    await client.set('key', 'Hello, Redis!');
    const value = await client.get('key');
    console.log('Value from Redis:', value);  // Output: 'Hello, Redis!'
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client; // Ekspor client untuk digunakan di file lain
