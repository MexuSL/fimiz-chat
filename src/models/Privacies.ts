import { DataTypes, Model} from "sequelize";
import sequelize from "../database/connection";

class Privacy extends Model {}

Privacy.init(
    {
        privacyId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "userId",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        blockedUserId: {
            type: DataTypes.UUID,
        },

        blocked: {
            type: DataTypes.BOOLEAN,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "Privacy",
        tableName: "Privacies",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    }
);
export default Privacy;
