"use strict";
// File: migrations/YYYYMMDDHHMMSS-create-message-status-table.ts

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("MessageStatus", {
            messageStatusId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            roomId: {
                type: Sequelize.UUID,
            },
            messageId: {
                type: Sequelize.UUID,
            },
            read: {
                type: Sequelize.BOOLEAN,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("MessageStatus");
    },
};
