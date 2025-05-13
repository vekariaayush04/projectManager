import type { Request, Response } from "express";

export const checkUser = async (req: Request, res: Response): Promise<any> => {
    try {
        return res.status(200).json({
            success: true,
            message: "User Authenticated Successfully",
            user: req.user,
        });
    } catch (error) {
        console.error("Error Authenticating user", error);
        return res.status(500).json({
            message: "Error Authenticating user",
            error,
        });
    }
};