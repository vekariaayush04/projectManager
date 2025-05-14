import { useTeamStore } from "@/store";
import TeamCard from "./TeamCard";

const TeamGrid = () => {
  const { teams } = useTeamStore();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams?.map((team) => (
        <TeamCard key={team?.id} team={team} />
      ))}
    </div>
  );
};

export default TeamGrid;
