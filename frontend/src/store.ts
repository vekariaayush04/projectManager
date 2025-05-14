import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import type { Team, User } from "./types";
// import { toast } from "sonner";

type UserStoreType = {
  user: User | null;
  isUserLoggedIn: () => Promise<void>;
  removeUser: () => Promise<void>;
};

const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  isLoggingIn: false,
  isSigningUp: false,

  isUserLoggedIn: async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/check`,
        {
          withCredentials: true,
        }
      );
      console.log(data.data);

      if (data.data.success) {
        set({ user: data.data.user });
      }
    } catch (error) {}
  },

  removeUser: async () => {
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.data.success) {
        set({ user: null });
        window.location.reload();
        toast(data.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    }
  },
}));

export default useUserStore;

type TeamStoreType = {
  myTeam: Team | null;
  teams: Team[];
  createTeam: (name: string, description: string) => Promise<void>;
  getAllTeams: () => Promise<void>;
  getMyTeam: () => Promise<void>;
  joinTeam: (teamId: string) => Promise<void>;
};

export const useTeamStore = create<TeamStoreType>((set) => ({
  myTeam: null,
  teams: [],
  createTeam: async (name: string, description: string) => {
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/teams/create-team`,
        {
          title: name,
          description,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data.data);

      if (data.data.success) {
        set({ myTeam: data.data.team });
        toast(data.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    }
  },

  getMyTeam: async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/teams/get-team`,
        {
          withCredentials: true,
        }
      );
      console.log(data.data);

      if (data.data.success) {
        set({ myTeam: data.data.team });
        toast(data.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    }
  },

  getAllTeams: async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/teams/get-teams`,
        {
          withCredentials: true,
        }
      );
      console.log(data.data);

      if (data.data.success) {
        set({ teams: data.data.teams });
        toast(data.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    }
  },

  joinTeam: async (teamId: string) => {
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/teams/join-team`,
        {
          teamId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data.data);

      if (data.data.success) {
        toast(data.data.message);
      }

    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    }
  },
}));
