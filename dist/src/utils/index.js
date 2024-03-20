"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser =
    exports.updateUserVerification =
    exports.deleteUser =
    exports.addUser =
    exports.responseStatus =
    exports.responseStatusCode =
    exports.getResponseBody =
    exports.hashData =
    exports.jwtDecode =
    exports.jwtEncode =
        void 0;
const Users_1 = __importDefault(require("../models/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function jwtEncode(data) {
    let encodedData = jsonwebtoken_1.default.sign(
        data,
        process.env.APP_SECRET_KEY + ""
    );
    return encodedData;
}
exports.jwtEncode = jwtEncode;
async function jwtDecode(token) {
    let decodedData = jsonwebtoken_1.default.decode(token);
    return decodedData;
}
exports.jwtDecode = jwtDecode;
async function hashData(_data) {
    let data = String(_data);
    let salt = await bcrypt_1.default.genSalt(10);
    let encryptedData = await bcrypt_1.default.hash(data, salt);
    return encryptedData;
}
exports.hashData = hashData;
const getResponseBody = (status, message, data) => {
    return {
        status,
        message,
        data,
    };
};
exports.getResponseBody = getResponseBody;
exports.responseStatusCode = {
    UNATHORIZED: 401,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNPROCESSIBLE_ENTITY: 422,
};
exports.responseStatus = {
    SUCCESS: "success",
    ERROR: "error",
    UNATHORIZED: "unathorized",
    WARNING: "warning",
    UNPROCESSED: "unprocessed",
};
const SERVER_ID = process.env.SERVER_ID;
async function addUser(data) {
    try {
        let personal = data;
        let newPersonalInfo;
        let personalInfo = await Users_1.default.create({
            ...personal,
        });
        newPersonalInfo = await personalInfo.save();
        let savePersonalData = await Users_1.default.findOne({
            where: { email: personal?.email },
        });
        // console.log(process.env.SERVER_ID, "User created successfully.", savePersonalData);
    } catch (err) {
        throw err;
    }
}
exports.addUser = addUser;
async function deleteUser(data) {
    try {
        let { userId } = data;
        let deleteObj = await Users_1.default.destroy({
            where: { userId },
        });
        if (deleteObj > 0) {
            // console.log(process.env.SERVER_ID, "User deleted successfully.");
        }
    } catch (err) {
        throw err;
    }
}
exports.deleteUser = deleteUser;
async function updateUserVerification(data) {
    try {
        let { verificationData, userId } = data;
        let personalInfo = await Users_1.default.findOne({
            where: { userId },
        });
        if (personalInfo) {
            let upatedResponse = await Users_1.default.update(
                verificationData,
                {
                    where: { userId },
                }
            );
            // console.log(`Server with Id ${SERVER_ID} Row Affected:, ${upatedResponse[0]}`);
        } else {
            // console.log("User doesnot exist.");
        }
    } catch (err) {
        throw err;
    }
}
exports.updateUserVerification = updateUserVerification;
async function updateUser(data) {
    try {
        let { key, value, userId } = data;
        let personalInfo = await Users_1.default.findOne({
            where: { userId },
        });
        if (personalInfo) {
            if (key === "password") {
                personalInfo?.set(key, await hashData(value));
                let info = await personalInfo?.save();
                // console.log(`Server with Id ${SERVER_ID} Row Affected:, ${info}`);
            } else if (key === "pinCode") {
                personalInfo?.set(key, await hashData(value));
                let info = await personalInfo?.save();
                // console.log(`Server with Id ${SERVER_ID} Row Affected:, ${info}`);
            } else {
                personalInfo?.set(key, value);
                let info = await personalInfo?.save();
                // console.log(`Server with Id ${SERVER_ID} Row Affected:, ${info}`);
            }
        } else {
            // console.log("User doesnot exist.");
        }
    } catch (err) {
        throw err;
    }
}
exports.updateUser = updateUser;
