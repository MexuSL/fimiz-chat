"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const Users_1 = __importDefault(require("../src/models/Users"));
const socket_io_1 = require("socket.io");
// import router from "./controllers/ChatController";
// import proxyRouter from "./controllers/ProxyController";
const Status_1 = __importDefault(require("./models/Status"));
const Messages_1 = __importDefault(require("./models/Messages"));
const ApiAccess_1 = __importDefault(require("./middlewares/ApiAccess"));
const notification_service_1 = __importDefault(require("./services/notification_service"));
const MessageStatus_1 = require("./models/MessageStatus");
// type NotificationData = {
//     token: string;
//     body: string;
//     title: string;
//     data: {
//         url: string;
//     };
// };
const notification = new notification_service_1.default();
dotenv_1.default.config();
// Create an Express app and HTTP server
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(ApiAccess_1.default);
// app.use(router);
// app.use(proxyRouter);
const server = http_1.default.createServer(app);
///// RUN USER CONSUMER FROM KAFKA BROKERS ////////
// runUserConsumer().catch(err =>{
//     console.log("Consumer Error from Server with Id",process.env.SERVER_ID,"=>",err)
// })
const socketIO = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    connectTimeout: 5000,
});
app.get("/", (req, res) => {
    res.status(200).json({ text: "Welcome" });
});
// socketIO.send("Hello client")
socketIO.on("connection", async (socket) => {
    let roomId = socket.handshake.query.roomId || ("");
    let userId = socket.handshake.query.userId;
    let roomType = socket.handshake.query.roomType || "";
    console.log({ roomId, roomType, userId });
    if (roomId) {
        /// connect or join a room if users click on the chat button on the frontend///////////////
        socket.join(String(roomId));
        console.log(`User with Id ${userId} is joins room ${roomId}`);
    }
    if (userId) {
        try {
            // update all messages
            let message = await Messages_1.default.findOne({
                where: {
                    recipientId: userId,
                },
            });
            if (message) {
                const updatedMessageRows = await Messages_1.default.update({ pending: false }, // The fields you want to update
                {
                    where: {
                        recipientId: userId,
                    },
                });
                socket.broadcast
                    .to(roomId)
                    .emit(`${userId}-pending`, JSON.stringify({ pending: false }));
                console.log(`Updated ${updatedMessageRows} rows`);
            }
            let status = await Status_1.default.findOne({
                where: { userId },
            });
            if (!status) {
                let createdStatus = await Status_1.default.create({
                    online: true,
                    userId,
                });
                socket.emit(String(userId), JSON.stringify({
                    ...createdStatus.dataValues,
                    online: "true",
                }));
                console.log({ Start: createdStatus.dataValues });
            }
            else {
                let updatedStatus = await status.update({
                    online: true,
                });
                console.log({ Start: updatedStatus.dataValues });
                socket.broadcast.emit(String(userId), JSON.stringify({ ...updatedStatus.dataValues }));
            }
            console.log(`Starting User with Id ${userId} is online`);
        }
        catch (err) {
            console.log(err);
        }
    }
    /////////////////// JOIN A ROOM //////////////////////
    socket.on("joinRoom", (data) => {
        socket.join(data.roomId);
        console.log(`User with Id ${data.userId} joins room ${data.roomId}`);
    });
    socket.on("msg", async (msgData) => {
        try {
            // console.log("From user 2");
            console.log("Message from client", msgData);
            msgData.received = false;
            msgData.pending = false;
            msgData.sent = true;
            // Save the chat message to the databases
            let recipientStatus = await Status_1.default.findOne({
                where: { userId: msgData.recipientId },
            });
            // let unReadTextNo = chat.getDataValue("numberOfUnreadText");
            let recipientActiveRoom = recipientStatus?.getDataValue("activeRoom");
            let recipientOnlineStatus = recipientStatus?.getDataValue("online");
            // check if the receiver have not opened the chat screen or is not on the chat screen
            if (recipientActiveRoom === roomId) {
                if (recipientOnlineStatus === true) {
                    msgData.received = true;
                }
            }
            else {
                if (recipientOnlineStatus === true) {
                    msgData.pending = true;
                }
            }
            // if (msgData.text !== "") {
            //     chat.setDataValue("lastText", msgData.text);
            // } else if (msgData.audio !== "") {
            //     chat.setDataValue("lastText", "🎙");
            // } else if (msgData.video !== "") {
            //     chat.setDataValue("lastText", "📹");
            // } else {
            //     chat.setDataValue("lastText", "📁");
            // }
            // await chat.update({"recipientReadStatus":false});
            const message = await Messages_1.default.create({
                senderId: msgData?.senderId,
                recipientId: msgData?.recipientId,
                text: msgData?.text,
                image: msgData?.image,
                audio: msgData?.audio,
                messageType: msgData.messageType,
                video: msgData?.video,
                otherFile: msgData?.otherFile,
                roomId: msgData?.roomId || roomId,
                sent: msgData.sent,
                received: msgData.received,
                pending: msgData.pending,
            });
            console.log("Message create", message);
            // if (initialSenderId !== msgData.senderId && chat.getDataValue("lastText") !== null) {
            //     await chat.update({
            //         numberOfUnreadText: 0,
            //         recipientReadStatus: true,
            //     });
            // }
            let messageStatus;
            let msgStatuses = [
                {
                    userId: msgData.recipientId,
                    roomId: msgData.roomId,
                    messageId: message.getDataValue("messageId"),
                    read: true,
                },
                {
                    userId: msgData.senderId,
                    roomId: msgData.roomId,
                    messageId: message.getDataValue("messageId"),
                    read: true,
                },
            ];
            if (recipientActiveRoom === msgData.roomId) {
                messageStatus = await MessageStatus_1.MessageStatus.bulkCreate(msgStatuses);
                console.log("Bulkcreated Message", messageStatus);
            }
            else {
                let msgStatuses = [
                    {
                        userId: msgData.recipientId,
                        roomId: msgData.roomId,
                        messageId: message.getDataValue("messageId"),
                        read: false,
                    },
                    {
                        userId: msgData.senderId,
                        roomId: msgData.roomId,
                        messageId: message.getDataValue("messageId"),
                        read: true,
                    },
                ];
                messageStatus = await MessageStatus_1.MessageStatus.bulkCreate(msgStatuses);
                console.log("Bulkcreated Message", messageStatus);
            }
            const sender = await Users_1.default.findOne({ where: { userId: msgData.senderId }, include: [
                    {
                        model: Status_1.default
                    },
                ] });
            if (message && sender) {
                const chatMessage = {
                    ...message.dataValues,
                    user: sender.dataValues,
                };
                console.log("Emitting message", chatMessage, msgData.roomId);
                socketIO
                    .to(msgData?.roomId)
                    .emit("msg", JSON.stringify(chatMessage));
                console.log("Message sent to room", msgData?.roomId);
                let { count } = await MessageStatus_1.MessageStatus.findAndCountAll({ where: { roomId: msgData.roomId, userId: msgData.recipientId, read: false } });
                let recipient = await Users_1.default.findOne({ where: { userId: msgData.recipientId }, include: [
                        {
                            model: Status_1.default
                        },
                    ] });
                let recipientReturnRoom = {
                    roomId: msgData.roomId,
                    recipientId: msgData.recipientId,
                    senderId: msgData.senderId,
                    recipientReadStatus: recipientActiveRoom === msgData.roomId,
                    lastText: msgData.text || "",
                    messageType: msgData.messageType,
                    createdAt: message.getDataValue("createdAt"),
                    updatedAt: message.getDataValue("updatedAt"),
                    numberOfUnreadText: count
                };
                console.log("Emmiting conversation for recipient", recipientReturnRoom);
                socket.broadcast.emit(`conversation-${msgData.recipientId}`, JSON.stringify({ room: recipientReturnRoom, user: { ...recipient?.dataValues, status: recipient?.getDataValue("Status") } }));
                let senderReturnRoom = {
                    roomId: msgData.roomId,
                    recipientId: msgData.recipientId,
                    senderId: msgData.senderId,
                    recipientReadStatus: true,
                    lastText: msgData.text || "",
                    messageType: msgData.messageType,
                    createdAt: message.getDataValue("createdAt"),
                    updatedAt: message.getDataValue("updatedAt"),
                    numberOfUnreadText: 0
                };
                console.log("Emmiting conversation for sender", senderReturnRoom);
                socket.emit(`conversation-${msgData.senderId}`, JSON.stringify({ room: senderReturnRoom, user: { ...recipient?.dataValues, status: recipient?.getDataValue("Status") } }));
                // let { data, status } = await axios.get(
                //     `http://192.168.1.105:5000/notifications/token/${msgData.recipientId}`
                // );
                // if (status === 200) {
                //     let notificationTokens = data.data;
                //     console.log({ notificationTokens });
                //     let notificationMsgs: NotificationData[] = [];
                //     for (let notificationToken of notificationTokens) {
                //         let notificationMsg: NotificationData = {
                //             body: "New message",
                //             title: sender?.getFullname() || "Message",
                //             token: notificationToken,
                //             data: {
                //                 url: `com.fimiz.sl:/chat`,
                //             },
                //         };
                //         notificationMsgs.push(notificationMsg);
                //     }
                //     notification
                //         .sendNotification(notificationMsgs)
                //         .then(() => {
                //             console.log("Notifacation Sent");
                //         })
                //         .catch((err) => {
                //             console.log(err);
                //         });
                // }
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    ///////////////////////listen for online status /////////////////////
    socket.on("online", async (data) => {
        try {
            socket.broadcast.emit(data.userId, JSON.stringify(data));
        }
        catch (err) {
            console.log(err);
        }
    });
    //////////////////////// update typing status ///////////////////////
    socket.on("typing", async (data) => {
        try {
            console.log("Typing from ", data);
            // let typingData: {
            //     userId: string;
            //     typing: boolean;
            //     roomId: string;
            // } = JSON.parse(String(data));
            // console.log(data)
            socket.broadcast
                .to(data?.roomId)
                .emit("typing", JSON.stringify(data));
        }
        catch (err) {
            console.log(err);
        }
    });
    /////////////////////// listening for recording///////////////////////////////////////
    socket.on("recording", async (data) => {
        try {
            socket.broadcast
                .to(data.roomId)
                .emit("recording", JSON.stringify(data));
        }
        catch (err) {
            console.log(err);
        }
    });
    /////////////////////// listening for delete message ///////////////////////////////////////
    socket.on("delete", async (data) => {
        try {
            socket.broadcast
                .to(data.roomId)
                .emit("delete", JSON.stringify(data));
        }
        catch (err) {
            console.log(err);
        }
    });
    /////////////////////// update and check if a user is on a particular Room ////////////////
    socket.on("activeRoom", async (data) => {
        try {
            console.log("ACTIVE ROOM", data);
            roomId = data.roomId;
            socket.join(roomId);
            console.log(`User with Id ${data.userId} Is Active on room ${data.roomId}`);
            // update all messages
            let message = await Messages_1.default.findOne({
                where: {
                    roomId: roomId,
                    recipientId: userId,
                },
            });
            if (message) {
                const updatedMessageRows = await Messages_1.default.update({ received: true, pending: false }, // The fields you want to update
                {
                    where: {
                        roomId: roomId,
                        recipientId: userId,
                    },
                });
                socket.broadcast
                    .to(roomId)
                    .emit("received", JSON.stringify({ received: true, roomId }));
                console.log(`Updated ${updatedMessageRows} rows`);
            }
            let messageStatus = await MessageStatus_1.MessageStatus.findOne({
                where: {
                    roomId: roomId,
                    userId: userId,
                },
            });
            // Update all message statuses
            if (messageStatus) {
                const updatedMessageStatusRows = await MessageStatus_1.MessageStatus.update({ read: true }, // The fields you want to update
                {
                    where: {
                        roomId: roomId,
                        userId: userId,
                    },
                });
                console.log(`Updated ${updatedMessageStatusRows} rows`);
            }
            let status = await Status_1.default.findOne({
                where: { userId: data.userId },
            });
            if (!status) {
                let createdStatus = await Status_1.default.create({
                    activeRoom: roomId,
                    userId: data.userId,
                    online: data.online,
                });
                console.log("created", {
                    ActiveRoomStatus: createdStatus.dataValues,
                });
            }
            else {
                let updatedStatus = await status.update({
                    activeRoom: roomId,
                    online: data.online,
                });
                console.log("updated", {
                    ActiveRoomStatus: updatedStatus.dataValues,
                });
            }
            console.log(`User ${data.userId} is active in room ${roomId}`);
        }
        catch (err) {
            console.log(err);
        }
    });
    //////////////////////// LISTEN FOR DISCONNECTION /////////////////////////////////////////////
    socket.on("disconnect", async () => {
        try {
            let status = await Status_1.default.findOne({
                where: { userId },
            });
            if (status) {
                let updatedStatus = await status.update({
                    online: false,
                    activeRoom: null,
                });
                console.log(`User with Id ${userId} is offline`, updatedStatus.dataValues);
                socket.broadcast.emit(String(userId), JSON.stringify({ ...updatedStatus.dataValues }));
            }
            else {
            }
        }
        catch (err) {
            console.log(err);
        }
    });
});
let PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});
