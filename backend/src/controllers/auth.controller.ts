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

export const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(200).json({
            success: true,
            message: "User Logged Out Successfully",
        });
    } catch (error) {
        console.error("Error logging out user", error);
        return res.status(500).json({
            message: "Error logging out user",
            error,
        });
    }
};