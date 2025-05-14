import { create } from "zustand";
import axios from "axios";
// import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type UserStoreType = {
  user: User;
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
        window.location.reload()
        // toast(data.data.message);
      }
    } catch (error: any) {
      console.log(error);
    //   toast(error.response.data.message);
    }
  },
}));

export default useUserStore;
