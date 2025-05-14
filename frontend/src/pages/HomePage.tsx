import CreateTeamModal from "@/components/CreateTeamModal";
import EmptyState from "@/components/EmptyState";
import TeamGrid from "@/components/TeamGrid";
import { Button } from "@/components/ui/button";
import useUserStore, { useTeamStore } from "@/store";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { getAllTeams , teams , myTeam , getMyTeam} = useTeamStore();
  const { user } = useUserStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if(teams.length === 0){
      getAllTeams()
    }
    if(!myTeam){
      getMyTeam()
    }
  },[getAllTeams , getMyTeam , user])
  console.log(teams);
  
  return (  
    <main className="flex-grow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
            <p className="text-gray-600 mt-1">
              Browse available teams or create your own
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Team
            </Button>
          </div>
        </div>

        {teams!.length > 0 ? (
            <TeamGrid />
          ) : (
            <EmptyState
              title="No teams available"
              description="There are currently no teams available. Be the first to create one!"
              actionText="Create Team"
              onAction={() => setIsCreateModalOpen(true)}
            />
          )}

        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </main>
  );
};

export default HomePage;
