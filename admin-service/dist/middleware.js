import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();
export const isAdminAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please login"
            });
            return;
        }
        const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/me`, {
            headers: {
                token
            }
        });
        req.user = data;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please login"
        });
        return;
    }
};
export const isAdminUser = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Insufficent permissions!"
        });
    }
    next();
};
const storage = multer.memoryStorage();
export const uploadFile = multer({ storage }).single("file");
//# sourceMappingURL=middleware.js.map