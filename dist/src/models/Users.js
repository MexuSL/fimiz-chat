"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const Status_1 = __importDefault(require("./Status"));
class User extends sequelize_1.Model {
    getFullname() {
        return (this.get("firstName") +
            " " +
            this.get("middleName") +
            " " +
            this.get("lastName"));
    }
}
User.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
    },
    middleName: {
        type: sequelize_1.DataTypes.STRING,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING,
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    pinCode: {
        type: sequelize_1.DataTypes.STRING,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    dob: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verificationRank: {
        type: sequelize_1.DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "low"
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: connection_1.default,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});
User.hasOne(Status_1.default, { foreignKey: "userId" });
exports.default = User;
