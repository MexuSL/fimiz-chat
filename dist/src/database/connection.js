"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
    host: process.env.ENV == "development"
        ? process.env.DB_HOST
        : process.env.PG_DB_HOST,
    dialect: process.env.ENV == "development" ? "postgres" : "postgres",
    database: process.env.ENV == "development"
        ? process.env.DB_NAME
        : process.env.PG_DB_NAME,
    password: process.env.ENV == "development"
        ? process.env.DB_PASSWORD
        : process.env.PG_DB_PASSWORD,
    username: process.env.ENV == "development"
        ? process.env.DB_USERNAME
        : process.env.PG_DB_USERNAME,
});
exports.default = sequelize;
