// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import { GET_POKEMON_DETAILS } from '@/graphql/queries';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from './components/SearchInput';
import { getTypeColor } from '@/utils/pokemonColors';

// Pokemon Type 1
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

  const [pokemonResult, setPokemonResult] = useState<PokemonSummary | null>(null);

  const [getPokemon, { loading, error }] = useLazyQuery<PokemonData>(GET_POKEMON_DETAILS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (initialSearchNameFromUrl !== submittedSearchName) {
      setSubmittedSearchName(initialSearchNameFromUrl);
    }
  }, [initialSearchNameFromUrl, submittedSearchName]);

  useEffect(() => {
    const trimmed = submittedSearchName.trim();

    if (!trimmed) {
      setPokemonResult(null);
      return;
    }

    getPokemon({ variables: { name: trimmed } }).then((result) => {
      setPokemonResult(result.data?.pokemon || null);
    });
  }, [submittedSearchName, getPokemon]);

  const handleSearchSubmit = useCallback(
    (name: string) => {
      const trimmedName = name.trim();
      setSubmittedSearchName(trimmedName);

      if (!trimmedName) {
        setPokemonResult(null); 
      }

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedName) {
        params.set('name', trimmedName);
      } else {
        params.delete('name');
      }

      router.push(`/?${params.toString()}`);
    },
    [searchParams, router]
  );

  const pokemon = pokemonResult;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-red-600 p-2 shadow-lg flex justify-center items-center ">
        <Image
          src="/logo.png"
          alt="Pokemon Logo"
          width={200}
          height={75}
          priority
        />
      </div>

      <div className="p-8 flex flex-col items-center w-full max-w-4xl">
        {!submittedSearchName.trim() && !loading && (
          <div className="text-center text-gray-500 p-4">
            Need to find a Pokémon? Enter its name below!
          </div>
        )}

        <SearchInput
          initialSearchName={initialSearchNameFromUrl}
          onSearchSubmit={handleSearchSubmit}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center p-4">
            <Image
              src="/pokeball.gif"
              alt="Loading..."
              width={50}
              height={50}
              unoptimized={true}
            />
            <p className="text-blue-500 mt-2">Loading Pokemon data...</p>
          </div>
        )}

        {error && <div className="text-center text-red-500">Error: {error.message}</div>}

        {!loading && !error && !pokemon && submittedSearchName.trim() && (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <Image
              src="/not_found.png"
              alt="Pokemon not found"
              width={300}
              height={100}
            />
            <div className="mt-6">
              <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                NOT FOUND
              </h2>
              <p className="text-xl font-medium text-black">
                Pokemon &quot;<span className="font-bold text-blue-700">{submittedSearchName}</span>&quot; not found.
              </p>
            </div>
          </div>
        )}

        {pokemon && submittedSearchName.trim() && (
          <Link href={`/pokemon/${pokemon.name}`} className="block w-full max-w-sm">
            <div className="bg-white p-4 rounded-lg shadow-md text-gray-800 text-center w-full transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <p className="text-base font-semibold text-gray-400 mb-1">
                #{pokemon.number}
              </p>
              <h2 className="text-2xl font-bold mb-2">{pokemon.name}</h2>
              <div className="flex justify-center mb-4">
                <Image src={pokemon.image} alt={pokemon.name} width={150} height={150} className="object-contain" />
              </div>
              <div className="mb-2">
                <p className="font-semibold text-gray-600 mb-1">Types:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {pokemon.types?.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
