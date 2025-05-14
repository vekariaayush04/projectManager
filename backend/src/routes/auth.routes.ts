import { Router } from "express";
import { checkUser, logout } from "../controllers/auth.controller";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/authMiddleware";
import jwt from "jsonwebtoken"

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(req.user);
    const token = jwt.sign(
            {
                id: req.user?.id,
            },
            process.env.SECRET!,
            {
                expiresIn: "1d",
            },
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24,
        });
    req.session.save(() => {
      res.redirect("http://localhost:5173/");
    });
  }
);

authRouter.get("/check", authMiddleware , checkUser);
authRouter.post("/logout", authMiddleware , logout);

export default authRouter;
