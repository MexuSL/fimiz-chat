// File: models/messagstatus.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../database/connection";

export class RoomStatus extends Model {}

RoomStatus.init(
    {
        roomStatusId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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
        deletedById: {
            type: DataTypes.UUID
        },
        mutedById: {
            type: DataTypes.UUID
        },
        archivedById: {
            type: DataTypes.UUID
        },

        pinnedById: {
            type: DataTypes.UUID,
        },
        deletedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        mutedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        pinnedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        archivedAt: {
            allowNull: true,
            type: DataTypes.DATE,
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
        modelName: "RoomStatus",
        timestamps: true,
        tableName: "NewRoomStatus",
    }
);
