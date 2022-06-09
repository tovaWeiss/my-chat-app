

const router = require("express").Router();
const controller = require("../controllers/chat.controller");

const auth = require("../middlewares/auth");

router.get("/", auth, controller.getAllChats);
router.post("/create-chat", auth, controller.createChat);
router.post("/get-messages-by-chat", auth, controller.getMessagesByChat);

module.exports = router;