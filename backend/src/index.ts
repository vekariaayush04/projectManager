import express, { type Request, type Response } from "express"
import cors from "cors"
import authRouter from "./routes/auth.routes"
import passport from "./config/passport"
import session from "express-session";
import teamRouter from "./routes/team.routes";
import cookieParser from "cookie-parser";

const app = express()

app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/teams", teamRouter)

const PORT = process.env.PORT!

app.listen(PORT,() => {
    console.log("Server listening on port :", PORT);
})