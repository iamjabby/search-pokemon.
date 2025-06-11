// app/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import SearchInput from './components/SearchInput';
import PokemonResult from './components/PokemonResult';

export default function Home() {
  const searchParams = useSearchParams();
  const pokemonName = searchParams.get('name');
  return (
     <main className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Pokemon Search</h1>
      
      <SearchInput />
      
      <PokemonResult pokemonName={pokemonName} />
    </main>
  );
}