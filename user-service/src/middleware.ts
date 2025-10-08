import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type IUser } from "./model.js";

export interface AuthenticatedRequest extends Request {
	user?: IUser | null
}

export const isUserAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.headers.token as string;
		if (!token) {
			res.status(403).json({
				message: "Please login"
			});
			return;
		}

		const jwtUser = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

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
	} catch (error) {
		res.status(403).json({
			message: "Please login"
		});
	}
};