
import Image from "next/image";
import { Data } from "@/sssss/Data";
import { Button } from "@nextui-org/react";
import Cards from "@/components/comman/Cards";
export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <div className="p-10">
        <div>
          <h1 className="text-3xl font-medium text-center">
            Every tool you could possibly need for bulk image editing
          </h1>
        </div>
      </div>
      <section>
        <div className="p-10">
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
        </div>
      </section>
    </main>
  );
}
// https://www.iloveimg.com/
