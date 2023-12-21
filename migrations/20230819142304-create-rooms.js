"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Rooms", {
            roomId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            senderId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            recipientId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            partialDeletedById: {
                type: Sequelize.UUID,
            },
            lastText: {
                type: Sequelize.TEXT,
            },
            recipientReadStatus: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            messageType: {
                type: Sequelize.STRING,
            },
            numberOfUnreadText: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
        await queryInterface.dropTable("Rooms");
    },
};
