"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
exports.issueToken = issueToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("./data-source");
const user_1 = require("./entities/user");
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a random value of at least 32 characters");
}
function issueToken(userId) {
    return jsonwebtoken_1.default.sign({}, secret, { subject: String(userId), expiresIn: "1d" });
}
const requireAuth = async (req, res, next) => {
    const match = /^Bearer (\S+)$/i.exec(req.get("authorization") ?? "");
    if (!match) {
        res.status(401).json({ message: "Bearer token required" });
        return;
    }
    let userId;
    try {
        const payload = jsonwebtoken_1.default.verify(match[1], secret, { algorithms: ["HS256"] });
        if (typeof payload === "string" || !/^[1-9]\d*$/.test(payload.sub ?? "")) {
            throw new Error("Invalid subject");
        }
        userId = Number(payload.sub);
        if (!Number.isSafeInteger(userId))
            throw new Error("Invalid subject");
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    if (!(await data_source_1.AppDataSource.getRepository(user_1.User).existsBy({ id: userId }))) {
        res.status(401).json({ message: "Account no longer exists" });
        return;
    }
    res.locals.userId = userId;
    next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map