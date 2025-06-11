// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import { GET_POKEMON_DETAILS } from '@/graphql/queries';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from './components/SearchInput';

// Type Pokemon 1 
interface PokemonSummary {
  id: string;
  number: string;
  name: string;
  image: string;
  types: string[];
}

interface PokemonData {
  pokemon: PokemonSummary | null;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearchNameFromUrl = searchParams.get('name') || '';

  const [submittedSearchName, setSubmittedSearchName] = useState(initialSearchNameFromUrl);

  const [getPokemon, { loading, error, data, called }] = useLazyQuery<PokemonData>(GET_POKEMON_DETAILS, {
    variables: { name: submittedSearchName },
  });

  useEffect(() => {
    if (initialSearchNameFromUrl && initialSearchNameFromUrl !== submittedSearchName) {
      setSubmittedSearchName(initialSearchNameFromUrl);
    }
  }, [initialSearchNameFromUrl, submittedSearchName]);

  useEffect(() => {
    if (submittedSearchName.trim()) {
      getPokemon({ variables: { name: submittedSearchName.trim() } });
    }
  }, [submittedSearchName, getPokemon]);

  const handleSearchSubmit = useCallback((name: string) => {
    setSubmittedSearchName(name);

    const params = new URLSearchParams(searchParams.toString());

    if (name.trim()) {
      params.set('name', name.trim());
    } else {
      params.delete('name')
    }

    router.push(`/?${params.toString()}`);

  }, [searchParams, router]);

  const pokemon = data?.pokemon;

  return (
    <main className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Pokemon Search</h1>

      <SearchInput
        initialSearchName={initialSearchNameFromUrl}
        onSearchSubmit={handleSearchSubmit}
      />

      {loading && <div className="text-center text-blue-500">Loading Pokemon data...</div>}
      {error && <div className="text-center text-red-500">Error: {error.message}</div>}

      {called && !loading && !error && !pokemon && submittedSearchName.trim() && ( 
        <div className="text-center text-yellow-500">
          Pokemon "{submittedSearchName}" not found.
        </div>
      )}

      {pokemon && (
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-800 text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-2">{pokemon.name}</h2>
          <div className="flex justify-center mb-4">
            <Image src={pokemon.image} alt={pokemon.name} width={150} height={150} className="object-contain" />
          </div>
          <p>Types: {pokemon.types?.join(', ')}</p>
          <Link href={`/pokemon/${pokemon.name}`} className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Details
          </Link>
        </div>
      )}

      {!called && !submittedSearchName.trim() && ( 
        <div className="text-center text-gray-500">
          Please enter a Pokemon name to search.
        </div>
      )}
    </main>
  );
}