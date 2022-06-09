const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Chat is required!",
        ref: "Chat",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Chat is required!",
        ref: "User",
    },
    message: {
        type: String,
        required: "Message is required!",
    },
    sent: {
        type: Boolean
    },
    wasRead: {
        type: Boolean
    }
});

module.exports = mongoose.model("Message", messageSchema);

