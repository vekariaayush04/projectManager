import type { Request, Response } from "express";
import { db } from "../db/db";

export const createTeam = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: true,
      message: "Missing Team Details",
    });
  }

  try {
    //check if already in a team or admin of team
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        team: true,
        adminTeam: true,
      },
    });

    if (user?.team || user?.adminTeam) {
      return res.status(400).json({
        success: true,
        message: "User is already part of a team (as member or admin)",
      });
    }

    //creating team and making user admin
    const team = await db.team.create({
      data: {
        name: title,
        description,
        adminId: userId!,
      },
      include: {
        admin: true,
        members: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Team Created Successfully",
      team,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Creating Team",
      error,
    });
  }
};

export const joinTeam = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({
      success: true,
      message: "Missing Details",
    });
  }

  try {
    //check if already in a team or admin of team
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        team: true,
        adminTeam: true,
      },
    });

    if (user?.team || user?.adminTeam) {
      return res.status(400).json({
        success: true,
        message: "User is already part of a team (as member or admin)",
      });
    }

    //finding team
    const team = await db.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(400).json({
        success: true,
        message: "Team Does not Exist",
      });
    }

    if (team._count.members === 3) {
      return res.status(400).json({
        success: true,
        message: "Team is Full",
      });
    }

    const updated_user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        teamId,
      },
      include: {
        team: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully joined the team",
      updated_user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Joining Team",
      error,
    });
  }
};

export const leaveTeam = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({
      success: true,
      message: "Missing Details",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        adminTeam: true,
      },
    });

    if (teamId !== user?.teamId && teamId !== user?.adminTeam?.id) {
      return res.status(400).json({
        success: true,
        message: "You are not part of this team",
      });
    }

    if (user?.adminTeam) {
      return res.status(400).json({
        success: true,
        message: "Admin cannot leave the team",
      });
    }

    if (!user?.teamId) {
      return res.status(400).json({
        success: true,
        message: "Not Part of any team",
      });
    }

    const updated_user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        teamId : null
      },
      include: {
        team : true
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully left the team",
      user : updated_user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error leaving Team",
      error,
    });
  }
};

export const getTeams = async (req: Request, res: Response): Promise<any> => {
    try {
        const teams = await db.team.findMany({
            include:{
                admin:true,
                members:true
            }
        })

        return res.status(200).json({
            success: true,
            message: "Teams fetched Successfully",
            teams,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
        message: "Error fetching Teams",
        error,
        });
    }
}
