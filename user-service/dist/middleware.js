import jwt, {} from "jsonwebtoken";
import { User } from "./model.js";
export const isUserAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please login"
            });
            return;
        }
        const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!jwtUser || !jwtUser._id) {
            res.status(403).json({
                message: "Invalid token"
            });
            return;
        }
        const userId = jwtUser._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(403).json({
                message: "User does not exists"
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please login"
        });
    }
};
//# sourceMappingURL=middleware.js.map