"use strict";
// import express, { Request, Response } from "express";
// import Room from "../models/Rooms";
// import User from "../models/Users";
// import { ChatReturnType, RUser } from "../types/types";
// import {
//     getResponseBody,
//     responseStatus,
//     responseStatusCode,
// } from "../utils";
// import { Op } from "sequelize";
// import Status from "../models/Status";
// import Message from "../models/Messages";
// const router = express.Router();
// ////////////////////////// GET ALL USER MESSAGES ///////////////////
// router.get(
//     "/messages/:roomId/",
//     async (req: Request, res: Response) => {
//         try {
//             let { roomId} = req.params;
//             let { pageNumber = 1, numberOfRecord: numRec } = req.query;
//             let numberOfRecord = Number(numRec || 15);
//             let start = (Number(pageNumber) - 1) * numberOfRecord;
//             const { rows: chats, count } =
//                 await Message.findAndCountAll({
//                     where: { roomId },
//                     order: [["createdAt", "DESC"]],
//                     limit: numberOfRecord,
//                     offset: start,
//                 });
//             // console.log({chats:chats[0].dataValues})
//             const formattedChats: any = await Promise.all(
//                 chats.map(async (chat) => {
//                     let _user = await User.findOne({
//                         where: {
//                             userId: chat.getDataValue("senderId")
//                         }})
//                     const user: RUser = {
//                         _id: _user?.getDataValue("userId"),
//                         name: _user?.getFullname() ?? "",
//                         avatar:_user?.getDataValue("profileImage") ?? "",
//                     };
//                     const formattedChat: ChatReturnType = {
//                         _id: chat.getDataValue("messageId"),
//                         text: chat.getDataValue("text"),
//                         image: chat.getDataValue("image"),
//                         audio: chat.getDataValue("audio"),
//                         video: chat.getDataValue("video"),
//                         sent: chat.getDataValue("sent") || false,
//                         received: chat.getDataValue("received") || false,
//                         pending: chat.getDataValue("pending") || false,
//                         createdAt: chat.getDataValue("createdAt"),
//                         user,
//                     };
//                     return formattedChat;
//                 })
//             );
//             res.status(200).json({data:{messages: formattedChats, count }});
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message: String(error),
//             });
//         }
//     }
// );
// //////////// DELETE A MESSAGE ////////////////////
// router.delete(
//     "/messages/:MessageId",
//     async (req: Request, res: Response) => {
//         try {
//             let MessageId = req.params.messageId;
//             let chat = await Message.findOne({
//                 where: { MessageId },
//             });
//             if (!chat) {
//                 return res
//                     .status(responseStatusCode.NOT_FOUND)
//                     .json(
//                         getResponseBody(
//                             responseStatus.ERROR,
//                             `Message with id ${MessageId} does not exist.`,
//                             {}
//                         )
//                     );
//             }
//             let deleteRow = await Message.destroy({
//                 where: {MessageId},
//             });
//             if (deleteRow >= 1) {
//                 return res
//                     .status(responseStatusCode.ACCEPTED)
//                     .json(
//                         getResponseBody(
//                             responseStatus.SUCCESS,
//                             "Delete Successfully",
//                             { affectedNumber: deleteRow }
//                         )
//                     );
//             } else {
//                 return res.status(responseStatusCode.BAD_REQUEST).json(
//                     getResponseBody(responseStatus.SUCCESS, "Delete Failed", {
//                         affectedNumber: deleteRow,
//                     })
//                 );
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message:String(error)
//             });
//         }
//     }
// );
// ///////////////////////// GET ALL USER CHATS //////////////////////
// router.get(
//     "/rooms/",
//     async (req: Request, res: Response) => {
//         try {
//             let {userId} = res.locals
//             let {pageNumber = 1, numberOfRecord: numRec } = req.query;
//             let numberOfRecord = Number(numRec || 20);
//             let start = (Number(pageNumber) - 1) * numberOfRecord;
//             const { rows: chats, count } =
//                 await Room.findAndCountAll({
//                     where: {
//                         [Op.and]: [
//                             {
//                                 [Op.or]: [
//                                     { recipientId: userId },
//                                     { senderId: userId },
//                                 ],
//                             },
//                             { lastText: { [Op.not]: null } },
//                         ],
//                     },
//                     order: [["updatedAt", "DESC"]],
//                     limit: numberOfRecord,
//                     offset: start,
//                 });
//             res.status(200).json({ chats, count });
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message:String(error),
//             });
//         }
//     }
// );
// ///////////////////////// GET ALL USER UNREAD ROOMS OR CHATS //////////////////////
// router.get(
//     "/rooms/unread",
//     async (req: Request, res: Response) => {
//         try {
//             let {userId} = res.locals
//             const { rows: chats, count } =
//                 await Room.findAndCountAll({
//                     where: {
//                         [Op.and]: [
//                             {
//                                recipientId:userId
//                             },
//                             {  recipientReadStatus:false},
//                         ],
//                     }
//                 });
//             res.status(200).json({ chats, count });
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message:String(error),
//             });
//         }
//     }
// );
// /////////////////////// DELETE room OR CHAT CLEAR USER CHAT MESSAGES /////////////////////////////
// router.delete(
//     "/rooms/:roomId",
//     async (req: Request, res: Response) => {
//         try {
//             let {roomId} = req.params;
//             let chat = await Room.findOne({
//                 where: { roomId },
//             });
//             if (!chat) {
//                 return res
//                     .status(responseStatusCode.NOT_FOUND)
//                     .json(
//                         getResponseBody(
//                             responseStatus.ERROR,
//                             `Chat with id ${roomId} does not exist.`,
//                             {}
//                         )
//                     );
//             }
//             let deleteRow = await Room.destroy({
//                 where: { roomId },
//             });
//             if (deleteRow >= 1) {
//                 return res
//                     .status(responseStatusCode.ACCEPTED)
//                     .json(
//                         getResponseBody(
//                             responseStatus.SUCCESS,
//                             "Delete Successfully",
//                             { affectedNumber: deleteRow }
//                         )
//                     );
//             } else {
//                 return res.status(responseStatusCode.BAD_REQUEST).json(
//                     getResponseBody(responseStatus.SUCCESS, "Delete Failed", {
//                         affectedNumber: deleteRow,
//                     })
//                 );
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message:String(error),
//             });
//         }
//     }
// );
// ////////////////////// READ room ///////////////////////////////
// router.put(
//     "/rooms/read/:roomId/",
//     async (req: Request, res: Response) => {
//         try {
//             let { roomId} = req.params;
//             let { userId} = res.locals;
//             let room = await Room.findOne({
//                 where: { roomId: roomId },
//             });
//             if (!room) {
//                 return res
//                     .status(responseStatusCode.NOT_FOUND)
//                     .json(
//                         getResponseBody(
//                             responseStatus.ERROR,
//                             `Chat with roomId ${roomId} does not exist`,
//                             {}
//                         )
//                     );
//             }
//             if (room.getDataValue("recipientId") == userId) {
//                 room.setDataValue("recipientReadStatus", true);
//                 room.setDataValue("numberOfUnreadText", null);
//             }
//             await room.save();
//             res.status(responseStatusCode.ACCEPTED).json(
//                 getResponseBody(
//                     responseStatus.SUCCESS,
//                     `recipient read messages`,
//                     {}
//                 )
//             );
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message:String(error),
//             });
//         }
//     }
// );
// //////////////////////  GET OR CREATE roomId ////////////////////////////
// router.get(
//     "/rooms/:userIdOne/:userIdTwo",
//     async (req: Request, res: Response) => {
//         try {
//             const { userIdOne, userIdTwo } = req.params;
//             let chat = await Room.findOne({
//                 where: {
//                     [Op.or]: [
//                         {
//                             [Op.and]: [
//                                 { senderId: userIdOne },
//                                 { recipientId: userIdTwo },
//                             ],
//                         },
//                         {
//                             [Op.and]: [
//                                 { senderId: userIdTwo },
//                                 { recipientId: userIdOne },
//                             ],
//                         },
//                     ],
//                 },
//             });
//             if (chat) {
//                 return res.status(responseStatusCode.OK).json(
//                     getResponseBody(responseStatus.SUCCESS, "", {
//                         roomId: chat.getDataValue("roomId"),
//                     })
//                 );
//             }
//             let newChat = await Room.create({
//                 senderId: userIdOne,
//                 recipientId: userIdTwo,
//             });
//             res.status(responseStatusCode.OK).json(
//                 getResponseBody(responseStatus.SUCCESS, "", {
//                     roomId: newChat.getDataValue("roomId"),
//                 })
//             );
//         } catch (error) {
//             console.error(error);
//             res.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 message:String(error),
//             });
//         }
//     }
// );
// export default router;
