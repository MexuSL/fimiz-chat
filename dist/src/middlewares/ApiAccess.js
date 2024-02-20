"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = async (request, response, next) => {
    let { authorization } = request.headers;
    let accessToken = authorization?.split(" ")[1];
    if (accessToken) {
        let decodedData = (await (0, utils_1.jwtDecode)(accessToken));
        // console.log("Decoded Access Key", decodedData);
        // console.log(decodedData);
        response.locals = {
            userId: decodedData?.userId,
            token: accessToken,
            accountNumber: decodedData?.accountNumber,
        };
        next();
        return;
    }
    else {
        return response.status(utils_1.responseStatusCode.UNATHORIZED).json({
            message: "Authorization token is required"
        });
    }
};
