import { Categories } from "@/components/Categories";
import { Navbar } from "@/components/Navbar";
import { SearchInput } from "@/components/SearchInput";
import prismadb from "@/lib/prismadb";

const Main = async () => {
  const categories = await prismadb.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
    </div>
  );
};

export default Main;
