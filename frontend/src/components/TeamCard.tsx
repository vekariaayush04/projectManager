import useUserStore, { useTeamStore } from "@/store";
import type { Team } from "@/types";
// import { Link } from "react-router-dom";

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const { myTeam, joinTeam, getMyTeam, getAllTeams } = useTeamStore();
  const { isUserLoggedIn } = useUserStore();
  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    await joinTeam(team.id);
    await isUserLoggedIn();
    await getMyTeam();
    await getAllTeams()
  };

  const memberCount = team.members.length;
  const maxMembers = 4;

  return (
    // <Link to={`/team/${team!.id}`} className="block">
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {team!.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {team!.description}
        </p>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {team.members.slice(0, 3).map((member) => (
                <div key={member.id} className="relative z-0 inline-block">
                  <div className="rounded-full p-1 px-2.5 text-white font-semibold text-xl bg-gray-500">
                    {member.name.slice(0, 1).toUpperCase()}
                  </div>
                  {member.isAdmin && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 rounded-full h-3 w-3 border-2 border-white"></span>
                  )}
                </div>
              ))}
              {memberCount > 3 && (
                <div className="relative z-0 h-6 w-6 rounded-full bg-gray-300 text-xs text-center flex items-center justify-center ring-2 ring-white">
                  +{memberCount - 3}
                </div>
              )}
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {memberCount}/{maxMembers} members
            </span>
          </div>

          {team.id !== myTeam?.id ? (
            <button
              onClick={handleJoin}
              disabled={team.members.length === 4}
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                team.members.length === 4
                  ? "bg-gray-200 text-gray-500"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
            >
              {team.members.length === 4 ? "Full" : "Join"}
            </button>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Member
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
