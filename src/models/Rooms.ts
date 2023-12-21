import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class Room extends Model {}

Room.init(
    {
        roomId: {
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
        modelName: "Room",
        tableName: "Rooms",
    }
);

export default Room;
