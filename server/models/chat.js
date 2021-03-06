const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required!",
    },
});

module.exports = mongoose.model("Chat", chatSchema);

