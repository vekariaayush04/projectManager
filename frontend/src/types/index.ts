export type User = {
  id: string;
  name: string;
  email: string;
  teamId: string | null;
  isAdmin : boolean
}

export type Team = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: User[];
//   history: HistoryEntry[];
};