
const User = require("../models/user");
const { secretCode } = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res, next) => {
    try {
        // Get user input
        const { fullName, email, password } = req.body;

        // Validate user input
        if (!(email && password && fullName)) {
            res.status(400).json("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).json("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            fullName,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            secretCode,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }

}

const getUser = async (req, res, next) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).json("All input is required");
        }
        // Validate if user exist in database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                secretCode,
                {
                    expiresIn: "12h",
                }
            );

            // save user token
            user.token = token;
            res.status(200).json(user);
        }
        res.status(400).json("Invalid Credentials");

    } catch (err) {
        console.log(err);
    }
}

const getAllUsers = async (req, res, next) => {
    const users = await User.find({});
    res.json(users);
}

const deleteUser = (req, res, next) => {
    const { email } = req.body;
    if (email) {
        User.findOneAndDelete({ email: email }, (error, docs) => {
            if (error) {
                res.json({ message: `Error in delete user: ${email}` });
            }
            else {
                res.json({ message: `Deleted User : ${docs}` });
            }
        });
    }
    else
        res.json({ error: "Email is required!" });
}

module.exports = {
    createUser,
    getUser,
    getAllUsers,
    deleteUser
}