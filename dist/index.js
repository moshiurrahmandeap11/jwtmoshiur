"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJwtMoshiur = void 0;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.setup = setup;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const setup_1 = require("./setup");
Object.defineProperty(exports, "initializeJwtMoshiur", { enumerable: true, get: function () { return setup_1.initializeJwtMoshiur; } });
dotenv.config();
const JWT_SECRET = (process.env.JWT_SECRET || 'fallback-secret');
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
function generateToken(payload, options) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
        ...options
    });
}
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}
function setup() {
    return (0, setup_1.initializeJwtMoshiur)();
}
