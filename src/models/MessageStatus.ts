// File: models/messagstatus.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../database/connection";
import Message from "./Messages";

export interface MessageStatusAttributes {
    messageStatusId: string;
    userId: string;
    roomId: string;
    messageId: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class MessageStatus extends Model {}

MessageStatus.init(
    {
        messageStatusId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.UUID,
        },
        messageId: {
            type: DataTypes.UUID,
        },
        read: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "MessageStatus",
        tableName:"MessageStatus"
    }
);

// Define associations
MessageStatus.belongsTo(Message, {
    foreignKey: "messageId",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
