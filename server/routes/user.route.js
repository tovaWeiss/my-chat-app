const router = require("express").Router();
const controller = require("../controllers/user.controller");

router.post('/create-user', controller.createUser);
router.post('/get-user', controller.getUser);
router.post('/get-all-users', controller.getAllUsers);
router.post('/delete-user', controller.deleteUser);

module.exports = router;