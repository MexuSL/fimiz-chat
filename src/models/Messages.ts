import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";
import User from "./Users";

class Message extends Model {}

Message.init(
    {
        messageId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        recipientId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        partialDeletedById: {
            type: DataTypes.UUID,
        },
        messageType: {
            type: DataTypes.STRING,
        },
        text: {
            type: DataTypes.TEXT,
        },
        images: {
            type: DataTypes.JSON,
        },
        audio: {
            type: DataTypes.STRING,
        },
        video: {
            type: DataTypes.STRING,
        },
        link: {
            type: DataTypes.TEXT,
        },
        otherFile: {
            type: DataTypes.STRING,
        },
        roomId: {
            type: DataTypes.UUID,
            references: {
                model: "Rooms",
                key: "roomId",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        sent: {
            type: DataTypes.BOOLEAN,
        },
        forwarded: {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        replied: {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        repliedRef: {
            type: DataTypes.UUID,
        },
        received: {
            type: DataTypes.BOOLEAN,
        },
        pending: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "Message",
        tableName: "Messages",
    }
);

Message.belongsTo(User, { foreignKey: "senderId" });

export default Message;
