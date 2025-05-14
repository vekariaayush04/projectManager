import { Button } from "@/components/ui/button";
import useUserStore from "@/store";

const HomePage = () => {
  const { user , removeUser} = useUserStore();
  return (
    <div>
      {user?.email}
      <Button className="ml-2 mt-3" onClick={async() => {await removeUser()}}>Logout</Button>
    </div>
  );
};

export default HomePage;
