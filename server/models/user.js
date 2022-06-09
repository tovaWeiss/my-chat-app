const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
    },
    token: {
        type: String
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
