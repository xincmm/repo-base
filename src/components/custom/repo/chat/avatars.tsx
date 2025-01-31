import { MastraIcon } from "@/components/icons/mastra";
import { User } from "lucide-react";

export const MastraAvatar: React.FC = () => {
  return (
    <div className="border rounded-lg bg-muted size-6 flex items-center justify-center shadow-lg">
      <MastraIcon className="size-4" />
    </div>
  );
};

export const UserAvatar: React.FC = () => {
  return (
    <div className="border rounded-lg bg-muted size-6 flex items-center justify-center shadow-lg">
      <User className="size-4" />
    </div>
  );
};
