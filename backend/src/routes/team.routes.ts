import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createTeam, deleteTeam, getTeam, getTeams, joinTeam, leaveTeam, removeMember } from "../controllers/team.controller";

const teamRouter = Router();

//team admin routes
teamRouter.post("/create-team", authMiddleware , createTeam)
teamRouter.post("/remove-member" , authMiddleware , removeMember)
teamRouter.post("/delete-team" , authMiddleware , deleteTeam)

//team member routes
teamRouter.post("/join-team", authMiddleware , joinTeam)
teamRouter.post("/leave-team", authMiddleware , leaveTeam)

//common routes
teamRouter.get("/get-teams" , authMiddleware , getTeams)
teamRouter.get("/get-team" , authMiddleware , getTeam)

export default teamRouter
