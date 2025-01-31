import { MastraIcon } from "@/components/icons/mastra";
import { User } from "lucide-react";

export const MastraAvatar: React.FC = () => {
  return (
    <div className="border rounded-lg bg-secondary size-6 flex items-center justify-center">
      <MastraIcon className="size-4" />
    </div>
  );
};

export const UserAvatar: React.FC = () => {
  return (
    <div className="border rounded-lg bg-secondary size-6 flex items-center justify-center">
      <User className="size-4" />
    </div>
  );
};
