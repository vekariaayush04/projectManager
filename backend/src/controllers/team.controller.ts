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
    let team;
    //creating team and making user admin
    await db.$transaction(async (tx) => {
      team = await tx.team.create({
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

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          isAdmin: true,
          teamId : team.id
        },
      });
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

    if (team._count.members === 4) {
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
        teamId: null,
      },
      include: {
        team: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully left the team",
      user: updated_user,
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
      include: {
        admin: true,
        members: true,
      },
    });

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
};

export const removeMember = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.id;
  const { memberId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: true,
      message: "Unauthorized",
    });
  }

  if (!memberId) {
    return res.status(400).json({
      success: true,
      message: "Missing memberId",
    });
  }

  try {
    // Fetch admin user and their team
    const adminUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        adminTeam: true,
      },
    });

    if (!adminUser?.adminTeam) {
      return res.status(403).json({
        success: true,
        message: "Only team admins can remove members",
      });
    }

    const teamId = adminUser.adminTeam.id;

    // Fetch the member to be removed
    const member = await db.user.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member || member.teamId !== teamId) {
      return res.status(400).json({
        success: true,
        message: "User is not a member of your team",
      });
    }

    // Update member's teamId to null (remove from team)
    const updatedUser = await db.user.update({
      where: {
        id: memberId,
      },
      data: {
        teamId: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error removing member from team",
      error,
    });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { teamId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: true,
      message: "Unauthorized",
    });
  }

  if (!teamId) {
    return res.status(400).json({
      success: true,
      message: "Missing teamId",
    });
  }

  try {
    // Fetch admin user and their team
    const adminUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        adminTeam: true,
      },
    });

    if (!adminUser?.adminTeam) {
      return res.status(403).json({
        success: true,
        message: "Only team admins can remove members",
      });
    }

    if (adminUser.adminTeam.id !== teamId) {
      return res.status(400).json({
        success: true,
        message: "User is not a admin of this team",
      });
    }

    const members = await db.user.findMany({
      where: {
        teamId,
      },
    });

    await db.$transaction(async (tx) => {
      await Promise.all(
        members.map((member) => {
          return tx.user.update({
            where: {
              id: member.id,
            },
            data: {
              teamId: null,
            },
          });
        })
      );

      await tx.team.delete({
        where: {
          id: teamId,
        },
      });
    });
    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting team",
      error,
    });
  }
};

export const getTeam = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  try {
    let team;

    if (req.user?.isAdmin) {
      team = await db.team.findUnique({
        where: {
          adminId: userId,
        },
      });
    } else {
      if (req.user?.teamId === null) {
        return res.status(200).json({
          success: true,
          message: "Not Part Of Any Team",
          team,
        });
      }
      team = await db.team.findUnique({
        where: {
          id: req.user?.teamId!,
        },
        include: {
          admin: true,
          members: true,
        },
      });
    }

    console.log(team);

    return res.status(200).json({
      success: true,
      message: "Team fetched Successfully",
      team,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching Team",
      error,
    });
  }
};
