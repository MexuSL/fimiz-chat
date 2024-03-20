"use strict";
// File: models/messagstatus.ts
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatus = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const Messages_1 = __importDefault(require("./Messages"));
const Users_1 = __importDefault(require("./Users"));
class MessageStatus extends sequelize_1.Model {}
exports.MessageStatus = MessageStatus;
MessageStatus.init(
    {
        messageStatusId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        roomId: {
            type: sequelize_1.DataTypes.UUID,
        },
        messageId: {
            type: sequelize_1.DataTypes.UUID,
        },
        read: {
            type: sequelize_1.DataTypes.BOOLEAN,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
        },
    },
    {
        sequelize: connection_1.default,
        modelName: "MessageStatus",
        tableName: "MessageStatus",
    }
);
// Define associations
MessageStatus.belongsTo(Messages_1.default, {
    foreignKey: "messageId",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
MessageStatus.belongsTo(Users_1.default, {
    foreignKey: "userId",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
