import { Request, Response, NextFunction } from "express";
import { jwtDecode, responseStatusCode } from "../utils";

export default async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    let { authorization } = request.headers;
    let accessToken = authorization?.split(" ")[1];

    let url = request.url;
    if (url.includes("metrics")) {
        next();
        return;
    }

    if (accessToken) {
        let decodedData = (await jwtDecode(accessToken)) as {
            userId: string;
            keys: Record<string, string>;
            accountNumber: string;
        };
        // // console.log("Decoded Access Key", decodedData);
        // // console.log(decodedData);
        response.locals = {
            userId: decodedData?.userId,
            token: accessToken,
            accountNumber: decodedData?.accountNumber,
        };
        next();
        return;
    } else {
        return response.status(responseStatusCode.UNATHORIZED).json({
            message: "Authorization token is required",
        });
    }
};
