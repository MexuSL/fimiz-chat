"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const Users_1 = __importDefault(require("./Users"));
class Message extends sequelize_1.Model {
}
Message.init({
    messageId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    senderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    recipientId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    partialDeletedById: {
        type: sequelize_1.DataTypes.UUID,
    },
    messageType: {
        type: sequelize_1.DataTypes.STRING,
    },
    text: {
        type: sequelize_1.DataTypes.TEXT,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
    },
    audio: {
        type: sequelize_1.DataTypes.STRING,
    },
    video: {
        type: sequelize_1.DataTypes.STRING,
    },
    otherFile: {
        type: sequelize_1.DataTypes.STRING,
    },
    roomId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: "Rooms",
            key: "roomId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    sent: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    received: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    pending: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        allowNull: true,
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: connection_1.default,
    modelName: "Message",
    tableName: "Messages",
});
Message.belongsTo(Users_1.default, { foreignKey: "senderId" });
exports.default = Message;
