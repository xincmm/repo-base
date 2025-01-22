import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const SearchRepo: React.FC = () => {
  return (
    <form className="flex gap-2">
      <Input placeholder="facebook/react" />
      <Button>Analyze Repository</Button>
    </form>
  );
};
