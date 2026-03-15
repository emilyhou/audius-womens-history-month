import { Corkboard } from "@/components/Corkboard";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="min-h-screen figjam-bg relative overflow-hidden">
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <Link
          href="/dedicate"
          className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2.5 px-5 md:py-3 md:px-6 rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 flex items-center gap-2 text-sm md:text-base"
        >
          <span className="text-lg md:text-xl">✨</span>
          <span className="hidden sm:inline">Dedicate a Song</span>
          <span className="sm:hidden">Dedicate</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2.5 md:px-5 md:py-3 shadow-sm border border-gray-200/50">
          <p className="text-xs md:text-sm text-gray-700">
            <span className="font-semibold">Audius x Women&apos;s History Month</span>
            <br />
            <span className="text-xs hidden sm:inline text-gray-500">Celebrating inspiring women artists</span>
          </p>
        </div>
      </div>

      <Corkboard />
    </main>
  );
}
