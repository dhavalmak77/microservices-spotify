import type { NextFunction, Request, RequestHandler, Response } from "express";

const TryCatch = (handler: RequestHandler): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			handler(req, res, next);
		} catch (error: any) {
			res.status(500).json({
				message: error.message
			});
			return;
		}
	};
};

export default TryCatch;