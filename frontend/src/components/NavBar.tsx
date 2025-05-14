// import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/store";

const NavBar = ({ status }: { status: "LoggedIn" | "LoggedOut" }) => {
  const { user, removeUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [loading, user]);
  return (
    <div className="w-full max-w-screen sticky top-0 left-0 right-0 flex justify-between bg-primary dark:bg-primary text-gray-200 border-b border-border dark:border-border p-2 z-10">
      <div className="flex pl-4 gap-3 items-center justify-center">
        {/* <img src="./logoAlgo.png" width={40} height={40} alt="Logo" /> */}
        <div className="font-semibold">
          <span className="text-2xl font-semibold text-white">TeamSync</span>
        </div>
      </div>
      <div className="gap-6 flex justify-center items-center">
        {status === "LoggedIn" && (
          <div className="flex gap-6 text-[#94A3B8] text-md font-semibold items-center">
            {!loading && (
              <div className="mr-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-secondary rounded-full p-1">
                    {" "}
                    <div className="rounded-full p-1 px-2.5 text-black font-semibold text-xl">
                      {user?.name.slice(0, 1)}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        await removeUser();
                      }}
                    >
                      logout
                    </DropdownMenuItem>
                    <div className="md:hidden block">
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Problems
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Contests
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
        {/* <ThemeToggleButton></ThemeToggleButton> */}
        {status === "LoggedOut" && (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/login")}
              className="hidden md:block"
              variant={"primary"}
            >
              Login
            </Button>
            <Button variant={"primary"} onClick={() => navigate("/signup")}>
              Join now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
