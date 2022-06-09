module.exports = {
    port: process.env.SERVER_PORT,
    mongoUri: process.env.MONGODB_URI,
    secretCode: process.env.SECRET_CODE,
    clientServer: "http://localhost:3000",
};
