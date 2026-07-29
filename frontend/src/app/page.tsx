import OutfitSwiper from "@/components/OutfitSwiper";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-black font-sans">
      <header className="absolute top-0 w-full p-6 flex justify-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">OcevStudio</h1>
      </header>
      
      <main className="flex flex-col items-center justify-center w-full px-4 pt-16">
        <OutfitSwiper />
      </main>
    </div>
  );
}
