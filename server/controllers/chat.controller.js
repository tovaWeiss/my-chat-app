const mongoose = require("mongoose");
require("../models/chat");
require("../models/message");

const Chat = mongoose.model("Chat");
const Message = mongoose.model("Message");

const createChat = async (req, res) => {
    let data = "";
    const { name } = req.body;

    const chatExists = await Chat.findOne({ name });

    if (!chatExists) {
        const chat = new Chat({
            name,
        });
        const newChat = await chat.save();
        data = newChat;
    }

    else {
        data = "Chat with that name already exists!";
    }
    res.json({ data });
}

const getAllChats = async (req, res) => {
    const chats = await Chat.find({});
    res.json(chats);
};

const getMessagesByChat = async (req, res) => {
    const { chatId } = req.body;
    Message.find({ chat: chatId }).populate('user').exec((error, messages) => {
        if (error) {
            res.json(error);
        }
        else
            res.json(messages);
    });
}

module.exports = {
    createChat,
    getAllChats,
    getMessagesByChat,
}