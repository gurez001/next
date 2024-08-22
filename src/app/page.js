import Image from "next/image";
import { Data } from "@/sssss/Data";
import { Button } from "@nextui-org/react";
import Cards from "@/components/comman/Cards";
export default function Home() {
  return (
    <main className="min-h-screen p-24">
      Every tool you could possibly need for bulk image editing
      <div className="grid grid-cols-5 gap-4">
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
      </div>
    </main>
  );
}
// https://www.iloveimg.com/
