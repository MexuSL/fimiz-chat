"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Status extends sequelize_1.Model {}
Status.init(
    {
        statusId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        gesture: {
            type: sequelize_1.DataTypes.ENUM(
                "typing",
                "posting",
                "recording",
                "reading",
                "unknown"
            ),
        },
        online: {
            type: sequelize_1.DataTypes.BOOLEAN,
        },
        activeRoom: {
            type: sequelize_1.DataTypes.UUID,
        },
        lastSeen: {
            type: sequelize_1.DataTypes.DATE,
        },
        createdAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: sequelize_1.DataTypes.DATE,
        },
    },
    {
        sequelize: connection_1.default,
        modelName: "Status",
        tableName: "Status",
    }
);
exports.default = Status;
