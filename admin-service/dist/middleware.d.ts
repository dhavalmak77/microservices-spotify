import type { NextFunction, Request, Response } from "express";
interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}
interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export declare const isAdminAuthenticated: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdminUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const uploadFile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export {};
//# sourceMappingURL=middleware.d.ts.map