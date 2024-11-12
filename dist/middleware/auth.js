"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withVerifyToken = exports.verifyUser = exports.verifyToken = exports.authorizationMiddleware = void 0;
const constant_helper_1 = require("../helpers/constant.helper");
const jsonwebtoken_1 = require("jsonwebtoken");
const db_1 = require("../GraphQlApi/models/db");
const api_1 = require("../errors/api");
const authorizationMiddleware = (req, res, next) => {
    const authAPIKey = process.env.AUTH_API_KEY;
    let apiKey = req.header("Api-Authorization");
    if (!apiKey) {
        return res
            .status(constant_helper_1.ENUM.HTTP_CODES.UNAUTHORIZED)
            .json({ error: constant_helper_1.MESSAGE.API_KEY_REQUIRED });
    }
    if (apiKey !== authAPIKey) {
        return res
            .status(constant_helper_1.ENUM.HTTP_CODES.UNAUTHORIZED)
            .json({ error: constant_helper_1.MESSAGE.INVALID_API_KEY });
    }
    if (apiKey === authAPIKey) {
        return next();
    }
};
exports.authorizationMiddleware = authorizationMiddleware;
// export const authorizationTokenMiddleware = (
//   isTokenRequired: boolean = true,
//   usersAllowed: string[] = []
// ) => {
//   return async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       //* Get token from request header and remove 'Bearer ' from it
//       let token = (
//         req.header("x-auth-token") || req.header("Authorization")
//       )?.replace(/Bearer\s+/g, "");
//       //* If token is required but not provided, return an error
//       if (isTokenRequired && !token) {
//         return res.status(400).json({ message: "Token is required." });
//       }
//       //* If no token is required, proceed to the next middleware
//       if (!isTokenRequired && !token) {
//         return next();
//       }
//       //* Verify token
//       let decoded: DecodedToken;
//       try {
//         decoded = verify(
//           token,
//           process.env.JWT_SECRET || "rent-payment"
//         ) as DecodedToken;
//       } catch (error) {
//         return res.status(401).json({ message: "Invalid token." });
//       }
//       //* Fetch user details using the userId from the decoded token
//       const user = await getUserByUserId(decoded.userId);
//       if (!user || !user.is_active) {
//         return res
//           .status(401)
//           .json({ message: "Unauthorized or inactive user." });
//       }
//       //* Check if user is allowed to access the route
//       if (
//         usersAllowed.length === 0 ||
//         usersAllowed.includes("*") ||
//         usersAllowed.includes(user.role_id)
//       ) {
//         //* Attach user details to the request object
//         req.user = {
//           userId: user.uuid,
//           role: user.role,
//           token,
//         };
//         return next();
//       } else {
//         return res.status(403).json({ message: "Access denied." });
//       }
//     } catch (error) {
//       return res.status(500).json({ message: "Internal Server Error", error });
//     }
//   };
// };
const verifyToken = (req, res, next) => {
    let token = (req.header("x-auth-token") || req.header("Authorization"))?.replace(/Bearer\s+/g, "");
    if (!token) {
        return res.status(403).json({
            code: 0,
            detail: "Access denied. No token provided.",
            status: "403",
        });
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, "rent-payment");
        req.user = decoded.userId;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({
                code: 0,
                detail: "Invalid token.",
                status: "401",
            });
        }
        return res.status(500).json({
            code: 0,
            detail: "An unexpected error occurred.",
            status: "500",
        });
    }
};
exports.verifyToken = verifyToken;
const verifyUser = (resolver) => async (parent, args, context) => {
    const { req } = context;
    const { userUuid } = req.params;
    const userData = await (0, db_1.getUserByUserId)(userUuid);
    if (!userData.uuid) {
        throw new api_1.ApiError({
            code: 0,
            detail: `User not found`,
            status: "400",
        });
    }
    if (userData.uuid !== req.user) {
        throw new api_1.ApiError({
            code: 0,
            detail: "Access denied. You cannot update another user's details.",
            status: "403",
        });
    }
    return resolver(parent, args, context);
};
exports.verifyUser = verifyUser;
const withVerifyToken = (resolver) => async (parent, args, context) => {
    const { req } = context; // Extract request from context
    let token = (req.header("xauthtoken") || req.header("Authorization"))?.replace(/Bearer\s+/g, "");
    if (!token) {
        throw new api_1.ApiError({
            code: 0,
            detail: "Access denied. No token provided.",
            status: "403",
        });
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, "rent-payment");
        req.user = decoded.userId; // Attach userId to request object
    }
    catch (err) {
        throw new api_1.ApiError({
            code: 0,
            detail: "Invalid token.",
            status: "401",
        });
    }
    return resolver(parent, args, context);
};
exports.withVerifyToken = withVerifyToken;
// export const verifyUser = async (
//   req: RequestWithUser,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userUuid } = req.params;
//     const userData = await getUserByUserId(userUuid);
//     if (!userData.uuid) {
//       throw new ApiError({
//         code: 0,
//         detail: User not found,
//         status: "400",
//       });
//     }
//     if (userData.uuid !== req.user) {
//       return res.status(403).json({
//         code: 0,
//         detail: "Access denied. You cannot update another user's details.",
//         status: "403",
//       });
//     }
//     next();
//   } catch (err) {
//     return res.status(500).json({
//       code: 0,
//       detail: "An unexpected error occurred.",
//       status: "500",
//     });
//   }
// };
//# sourceMappingURL=auth.js.map