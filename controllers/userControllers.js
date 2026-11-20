let Users = require('../model/userModel');
let validationResult = require('express-validator').validationResult;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let getAllusers = async (req, res) => {
    let users = await Users.find();
    res.send(users);
}

let registerUser = async(req, res) => {
    let results = validationResult(req);
    let errors = results.errors;
    if (errors.length) {
        let errorMessages = errors.map(ele => ele.msg);
        return res.status(400).send(errorMessages[0]);
    }

    let data = req.body;
    let existingUser = await Users.findOne({ email: data.email });
    if (existingUser) {
        return res.status(400).send("User with this email already exists");
    }

    let hashedPassword = bcrypt.hashSync(data.password, 10);
    let newUser = await Users.create({ ...data, password: hashedPassword });

    // Generate token using the newly created user's ID
    let token = jwt.sign({ id: newUser._id }, "thisisyourprivatekey");

    res.status(201).send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        isSuperAdmin: newUser.isSuperAdmin, // Include the Super Admin flag in the response
        bookmarks: newUser.bookmarks, // Include bookmarks in the response
        token: token
    });
}

let loginUser = async(req, res) => {
    let data = req.body;
    let existingUser = await Users.findOne({ email: data.email });
    
    if (!existingUser) {
        return res.status(400).send("User with this email does not exist");
    }
    if (!bcrypt.compareSync(data.password, existingUser.password)) {
        return res.status(400).send("Incorrect password");
    }

    // Generate token for the returning user
    let token = jwt.sign({ id: existingUser._id }, "thisisyourprivatekey");

    res.send({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        isSuperAdmin: existingUser.isSuperAdmin, // Include the Super Admin flag in the response
        bookmarks: existingUser.bookmarks, // Include bookmarks in the response
        token: token
    });
}

let updateUser = async(req, res) => {
    let id = req.query.id;
    let data = req.body;
    
    // Fixed deprecation warning
    let updatedUser = await Users.findByIdAndUpdate(id, data, { returnDocument: "after" });
    res.send(updatedUser);
}

let deleteUser = async(req, res) => {
    let id = req.query.id;
    let deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
        return res.status(404).send("User not found");
    }
    res.send(deletedUser);
}
let getUserProfile = async (req, res) => {
    try {
        // .select('-password') ensures we don't accidentally send the password hash back
        let user = await Users.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Server error fetching profile");
    }
}
const toggleBookmark = async (req, res) => {
    try {
        let userId = req.query.userId;
        let newsId = req.body.newsId;

        // 1. Safety check for missing data
        if (!userId || !newsId) {
            return res.status(400).send("Missing userId or newsId");
        }

        let user = await Users.findById(userId);
        if (!user) return res.status(404).send("User not found");

        // 2. Safety check: Initialize array if it doesn't exist
        if (!user.bookmarks) {
            user.bookmarks = [];
        }

        // 3. Ultra-safe comparison using .some() and .toString()
        const isBookmarked = user.bookmarks.some(id => id && id.toString() === newsId.toString());
        
        if (isBookmarked) {
            // Remove it
            user.bookmarks = user.bookmarks.filter(id => id && id.toString() !== newsId.toString());
        } else {
            // Add it
            user.bookmarks.push(newsId);
        }

        // 4. Save to database
        await user.save();
        
        // 5. Return the raw user (Removing .populate() here completely prevents the MissingSchemaError crash)
        res.send(user);

    } catch (error) {
        console.error("CRASH IN BOOKMARK CONTROLLER:", error);
        res.status(500).send("Error updating bookmarks");
    }
}
module.exports = { getAllusers, registerUser, loginUser, updateUser, deleteUser,getUserProfile, toggleBookmark };