import { Navbar } from "@/components/Navbar";
import { SearchInput } from "@/components/SearchInput";

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
    </div>
  );
};

export default Main;
