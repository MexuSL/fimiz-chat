"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("RoomStatus", {
            roomStatusId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            roomId: {
                type: Sequelize.UUID,
                references: {
                    model: "Rooms",
                    key: "roomId",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            deletedById: {
                type: Sequelize.UUID,
            },
            mutedById: {
                type: Sequelize.UUID,
            },

            pinnedById: {
                type: Sequelize.UUID,
            },
            deletedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            mutedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            pinnedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            archivedAt: {
              allowNull: true,
              type: Sequelize.DATE,
          },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("RoomStatus");
    },
};
