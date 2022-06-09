const mongoose = require("mongoose");

mongoose.connection.on("connected", () => {
    console.log("Connection to mongoDB is Established.");
});

mongoose.connection.on("reconnected", () => {
    console.log("Connection to mongoDB is Reestablished.");
});

mongoose.connection.on("disconnected", () => {
    console.log("Connection to mongoDB is Disconnected.");
});

mongoose.connection.on("close", () => {
    console.log("Connection to mongoDB is Closed.");
});

mongoose.connection.on("error", error => {
    console.log("ERROR: " + error);
});

async function connect(url) {
    return await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports.connect = connect;