// components/PokemonResult.tsx
'use client'; 

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_POKEMON_DETAILS } from '../../graphql/queries'; 
import { useRouter } from 'next/navigation'; 

interface Pokemon {
  id: string;
  number: string;
  name: string;
  image: string;
  weight?: {
    minimum: string;
    maximum: string;
  };
  height?: {
    minimum: string;
    maximum: string;
  };
  classification?: string;
  types: string[];
  resistant?: string[];
  attacks?: {
    fast?: Array<{ name: string; type: string; damage: number }>;
    special?: Array<{ name: string; type: string; damage: number }>;
  };
  weaknesses?: string[];
  fleeRate?: number;
  maxCP?: number;
  evolutions?: Pokemon[]; 
  evolutionRequirements?: {
    amount: number;
    name: string;
  };
  maxHP?: number;
}

interface PokemonData {
  pokemon: Pokemon | null; 
}

interface PokemonResultProps {
  pokemonName: string | null; 
}

const PokemonResult: React.FC<PokemonResultProps> = ({ pokemonName }) => {
  const router = useRouter();

  const { loading, error, data } = useQuery<PokemonData>(GET_POKEMON_DETAILS, {
    variables: { name: pokemonName },
    skip: !pokemonName, 
  });

  if (!pokemonName) {
    return (
      <div className="text-center text-gray-500">
        Please enter a Pokemon name to search.
      </div>
    );
  }

  if (loading) {
    return <div className="text-center text-blue-500">Loading Pokemon data...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading Pokemon: {error.message}
      </div>
    );
  }

  const pokemon = data?.pokemon;

  if (!pokemon) {
    return (
      <div className="text-center text-yellow-500">
        Pokemon "{pokemonName}" not found.
      </div>
    );
  }

  const handleEvolutionClick = (evolutionName: string) => {
    router.push(`/?name=${evolutionName}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">{pokemon.name} ({pokemon.number})</h2>
      <div className="flex justify-center mb-4">
        <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48 object-contain" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>ID:</strong> {pokemon.number}</p>
          <p><strong>Classification:</strong> {pokemon.classification}</p>
          <p><strong>Types:</strong> {pokemon.types?.join(', ')}</p>
          <p><strong>Height:</strong> {pokemon.height?.minimum} - {pokemon.height?.maximum}</p>
          <p><strong>Weight:</strong> {pokemon.weight?.minimum} - {pokemon.weight?.maximum}</p>
          <p><strong>Max HP:</strong> {pokemon.maxHP}</p>
          <p><strong>Max CP:</strong> {pokemon.maxCP}</p>
          <p><strong>Flee Rate:</strong> {pokemon.fleeRate}</p>
          <p><strong>Resistant:</strong> {pokemon.resistant?.join(', ')}</p>
          <p><strong>Weaknesses:</strong> {pokemon.weaknesses?.join(', ')}</p>
        </div>

        <div>
          {pokemon.attacks && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Attacks:</h3>
              {pokemon.attacks.fast && pokemon.attacks.fast.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-medium">Fast Attacks:</h4>
                  <ul className="list-disc list-inside">
                    {pokemon.attacks.fast.map((attack, index) => (
                      <li key={index}>{attack.name} ({attack.type}, Damage: {attack.damage})</li>
                    ))}
                  </ul>
                </div>
              )}
              {pokemon.attacks.special && pokemon.attacks.special.length > 0 && (
                <div>
                  <h4 className="font-medium">Special Attacks:</h4>
                  <ul className="list-disc list-inside">
                    {pokemon.attacks.special.map((attack, index) => (
                      <li key={index}>{attack.name} ({attack.type}, Damage: {attack.damage})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Evolutions:</h3>
              <ul className="list-disc list-inside">
                {pokemon.evolutions.map((evolution) => (
                  <li key={evolution.id} className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleEvolutionClick(evolution.name)}>
                    {evolution.name} ({evolution.number})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pokemon.evolutionRequirements && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Evolution Requirements:</h3>
              <p>{pokemon.evolutionRequirements.amount} {pokemon.evolutionRequirements.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonResult;