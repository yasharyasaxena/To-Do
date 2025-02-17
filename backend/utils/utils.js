require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.error('MongoDB connection FAIL', error);
        process.exit(1);
    }
}

function genPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return {
        salt,
        hash
    }
}

function validPassword(password, hash, salt) {
    const hashVerify = bcrypt.hashSync(password, salt);
    return hash === hashVerify
}

function genToken(data, secret) {
    const token = jwt.sign(data, secret, { expiresIn: '10d' });
    return token;
}

module.exports = { connectDB, genPassword, validPassword, genToken };