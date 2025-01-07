const DB_USER = process.env.DB_USER|| "localhost";
const DB_PASSWORD =process.env.DB_PASSWORD|| "123456";
const DB_HOST = process.env.DB_HOST||"web-db";

const API_VERSION = process.env.API_VERSION||"v1";
const IP_SERVER = process.env.IP_SERVER||"localhost";

const JWT_SECRET_KEY = "gR7cH9Svfj8JLe4c186Ghs48hheb3902nh5DsA";

module.exports = {
    DB_HOST,
    DB_PASSWORD,
    DB_USER,
    API_VERSION,
    IP_SERVER,
    JWT_SECRET_KEY
}
