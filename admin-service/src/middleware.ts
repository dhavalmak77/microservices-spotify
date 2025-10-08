import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

interface IUser {
	_id: string,
	name: string,
	email: string,
	password: string,
	role: string,
	playlist: string[]
}

interface AuthenticatedRequest extends Request {
	user?: IUser
}

export const isAdminAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.headers.token as string;
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
	} catch (error) {
		res.status(403).json({
			message: "Please login"
		});
		return;
	}
};

export const isAdminUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	if (req.user?.role !== "admin") {
		return res.status(403).json({
			message: "Insufficent permissions!"
		});
	}
	next();
}

const storage = multer.memoryStorage();
export const uploadFile = multer({ storage }).single("file");