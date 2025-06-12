// app/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import HomePageClientContent from './HomePageClientContent';

interface SearchParamsType {
  [key: string]: string | string[] | undefined;
}

interface HomeProps {
  searchParams?: Promise<SearchParamsType>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  console.log("Server received searchParams:", resolvedSearchParams);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col"> 
      {/* Header */}
      <div className="w-full bg-red-600 p-2 shadow-lg flex justify-center items-center ">
        <Image
          src="/logo.png"
          alt="Pokemon Logo"
          width={200}
          height={75}
          priority
        />
      </div>

      <div className="flex-grow flex flex-col items-center justify-start w-full"> 
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-4">
            <Image
              src="/pokeball.gif"
              alt="Loading homepage..."
              width={50}
              height={50}
              unoptimized={true}
            />
            <p className="text-blue-500 mt-2">Loading content...</p>
          </div>
        }>
          <HomePageClientContent />
        </Suspense>
      </div>

      <footer className="mt-10 py-6 w-full bg-white border-t text-center text-sm text-gray-600">
          <p>Made by <span className="text-red-500">❤️</span> by <span className="font-semibold text-pink-600">julaluck yeta</span></p>
      </footer>
    </main>
  );
}