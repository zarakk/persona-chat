import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="text-green-500">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
