import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import Room from "./models/Rooms";
import User from "../src/models/Users";
import {
    ChatReturnType,
    IMessage,
    OnlineType,
    RecordingType,
    TypingType,
} from "../src/types/types";
import { Server } from "socket.io";
// import router from "./controllers/ChatController";
import proxyRouter from "./controllers/ProxyController";
import Status from "./models/Status";
import Message from "./models/Messages";
import { Op } from "sequelize";
import authorizeApiAccess from "./middlewares/ApiAccess";
import { runUserConsumer } from "./events/consumers";
import NotificationService from "./services/notification_service";
import axios from "axios";
import { MessageStatus } from "./models/MessageStatus";

type NotificationData = {
    token: string;
    body: string;
    title: string;
    data: {
        url: string;
    };
};

const notification = new NotificationService();

dotenv.config();
// Create an Express app and HTTP server
const app = express();
app.use(express.json());
app.use(cors());
app.use(authorizeApiAccess);
// app.use(router);
app.use(proxyRouter);

const server = http.createServer(app);

///// RUN USER CONSUMER FROM KAFKA BROKERS ////////

// runUserConsumer().catch(err =>{
//     console.log("Consumer Error from Server with Id",process.env.SERVER_ID,"=>",err)
// })

const socketIO = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    connectTimeout: 5000,
});

app.get("/", (req, res) => {
    res.status(200).json({ text: "Welcome" });
});

// socketIO.send("Hello client")

socketIO.on("connection", async (socket) => {
    let roomId = socket.handshake.query.roomId || ("" satisfies string);
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
            let message = await Message.findOne({
                where: {
                    recipientId: userId,
                },
            });
            if (message) {
                const updatedMessageRows = await Message.update(
                    { pending: false }, // The fields you want to update
                    {
                        where: {
                            recipientId: userId,
                        },
                    }
                );
                socket.broadcast
                    .to(roomId)
                    .emit(
                        `${userId}-pending`,
                        JSON.stringify({ pending: false })
                    );
                console.log(`Updated ${updatedMessageRows} rows`);
            }
            let status = await Status.findOne({
                where: { userId },
            });
            if (!status) {
                let createdStatus = await Status.create({
                    online: true,
                    userId,
                });
                socket.emit(
                    String(userId),
                    JSON.stringify({
                        ...createdStatus.dataValues,
                        online: "true",
                    })
                );
                console.log({ Start: createdStatus.dataValues });
            } else {
                let updatedStatus = await status.update({
                    online: true,
                });
                console.log({ Start: updatedStatus.dataValues });
                socket.broadcast.emit(
                    String(userId),
                    JSON.stringify({ ...updatedStatus.dataValues })
                );
            }
            console.log(`Starting User with Id ${userId} is online`);
        } catch (err) {
            console.log(err);
        }
    }

    /////////////////// JOIN A ROOM //////////////////////

    socket.on("joinRoom", (data: any) => {
        socket.join(data.roomId);
        console.log(`User with Id ${data.userId} joins room ${data.roomId}`);
    });

    //// chat between users ////////////////////////////////////

    type MessagePayload = {
        messageId: string;
        senderId: string;
        recipientId: string;
        image?: string;
        audio?: string;
        video?: string;
        text?: string;
        messageType: string;
        roomId: string;
        otherFile: string;
        received?: boolean;
        sent?: boolean;
        pending?: boolean;
    };

    socket.on("msg", async (msgData: MessagePayload) => {
        try {
            // console.log("From user 2");
            console.log("Message from client",msgData);
            msgData.received = false;
            msgData.pending = false;
            msgData.sent = true;
            // Save the chat message to the databases

            let recipientStatus = await Status.findOne({
                where: { userId: msgData.recipientId },
            });

            // let unReadTextNo = chat.getDataValue("numberOfUnreadText");
            let recipientActiveRoom =
                recipientStatus?.getDataValue("activeRoom");
            let recipientOnlineStatus = recipientStatus?.getDataValue("online");
            // check if the receiver have not opened the chat screen or is not on the chat screen

            if (recipientActiveRoom === roomId) {
                if (recipientOnlineStatus === true) {
                    msgData.received = true;
                }
            } else {
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
            const message = await Message.create({
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
            // if (initialSenderId !== msgData.senderId && chat.getDataValue("lastText") !== null) {
            //     await chat.update({
            //         numberOfUnreadText: 0,
            //         recipientReadStatus: true,
            //     });
            // }
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
                let messageStatus = await MessageStatus.bulkCreate(msgStatuses);
                console.log("Bulkcreated Message", messageStatus);
            } else {
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
                let messageStatus = await MessageStatus.bulkCreate(msgStatuses);
                console.log("Bulkcreated Message", messageStatus);
            }

            const sender = await User.findByPk(msgData.senderId);

            if (message && sender) {
                const chatMessage: IMessage = {
                    ...message.dataValues,
                    user: sender.dataValues,
                };
                console.log("Emitting message", chatMessage, msgData.roomId);
                socketIO
                    .to(msgData?.roomId)
                    .emit("msg", JSON.stringify(chatMessage));
                console.log("Message sent to room", msgData?.roomId);

                socket
                    .to(String(msgData.roomId))
                    .emit(
                        "conversation",
                        JSON.stringify({roomId:msgData.roomId})
                    );
                let { data, status } = await axios.get(
                    `http://192.168.1.98:5000/notifications/token/${msgData.recipientId}`
                );
                if (status === 200) {
                    let notificationTokens = data.data;
                    console.log({ notificationTokens });
                    let notificationMsgs: NotificationData[] = [];
                    for (let notificationToken of notificationTokens) {
                        let notificationMsg: NotificationData = {
                            body: "New message",
                            title: sender?.getFullname() || "Message",
                            token: notificationToken,
                            data: {
                                url: `com.fimiz.sl:/chat`,
                            },
                        };
                        notificationMsgs.push(notificationMsg);
                    }
                    notification
                        .sendNotification(notificationMsgs)
                        .then(() => {
                            console.log("Notifacation Sent");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
        } catch (err) {
            console.error(err);
        }
    });

    ///////////////////////listen for online status /////////////////////

    socket.on("online", async (data: OnlineType) => {
        try {
            socket.broadcast.emit(data.userId, JSON.stringify(data));
        } catch (err) {
            console.log(err);
        }
    });

    //////////////////////// update typing status ///////////////////////
    socket.on("typing", async (data: TypingType) => {
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
        } catch (err) {
            console.log(err);
        }
    });

    /////////////////////// listening for recording///////////////////////////////////////

    socket.on("recording", async (data: RecordingType) => {
        try {
            socket.broadcast
                .to(data.roomId)
                .emit("recording", JSON.stringify(data));
        } catch (err) {
            console.log(err);
        }
    });

    /////////////////////// update and check if a user is on a particular Room ////////////////

    socket.on("activeRoom", async (data: any) => {
        try {
            console.log("ACTIVE ROOM", data);
            roomId = data.roomId;
            socket.join(roomId);
            console.log(
                `User with Id ${data.userId} Is Active on room ${data.roomId}`
            );
            // update all messages
            let message = await Message.findOne({
                where: {
                    roomId: roomId,
                    recipientId: userId,
                },
            });

            if (message) {
                const updatedMessageRows = await Message.update(
                    { received: true, pending: false }, // The fields you want to update
                    {
                        where: {
                            roomId: roomId,
                            recipientId: userId,
                        },
                    }
                );
                socket.broadcast
                    .to(roomId)
                    .emit(
                        "received",
                        JSON.stringify({ received: true, roomId })
                    );
                console.log(`Updated ${updatedMessageRows} rows`);
            }

            let messageStatus = await MessageStatus.findOne({
                where: {
                    roomId: roomId,
                    userId: userId,
                },
            });

            // Update all message statuses
            if (messageStatus) {
                const updatedMessageStatusRows = await MessageStatus.update(
                    { read: true }, // The fields you want to update
                    {
                        where: {
                            roomId: roomId,
                            userId: userId,
                        },
                    }
                );
                console.log(`Updated ${updatedMessageStatusRows} rows`);
            }

            let status = await Status.findOne({
                where: { userId: data.userId },
            });
            if (!status) {
                let createdStatus = await Status.create({
                    activeRoom: roomId,
                    userId: data.userId,
                    online: data.online,
                });
                console.log("created", {
                    ActiveRoomStatus: createdStatus.dataValues,
                });
            } else {
                let updatedStatus = await status.update({
                    activeRoom: roomId,
                    online: data.online,
                });
                console.log("updated", {
                    ActiveRoomStatus: updatedStatus.dataValues,
                });
            }
            console.log(`User ${data.userId} is active in room ${roomId}`);
        } catch (err) {
            console.log(err);
        }
    });

    //////////////////////// LISTEN FOR DISCONNECTION /////////////////////////////////////////////
    socket.on("disconnect", async () => {
        try {
            let status = await Status.findOne({
                where: { userId },
            });

            if (status) {
                let updatedStatus = await status.update({
                    online: false,
                    activeRoom: null,
                });
                console.log(
                    `User with Id ${userId} is offline`,
                    updatedStatus.dataValues
                );
                socket.broadcast.emit(
                    String(userId),
                    JSON.stringify({ ...updatedStatus.dataValues })
                );
            } else {
            }
        } catch (err) {
            console.log(err);
        }
    });
});

let PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});
