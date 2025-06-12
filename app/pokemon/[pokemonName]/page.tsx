// app/pokemon/[pokemonName]/page.tsx
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GET_POKEMON_DETAILS, GET_ALL_POKEMON_NAMES } from '@/graphql/queries';
import Image from 'next/image';
import Link from 'next/link';
import React from "react";
import { getTypeColor } from '@/utils/pokemonColors';
import { Flame, Zap, Ruler, Scale, Activity, Heart, ShieldCheck, AlertTriangle } from "lucide-react";

const API_URL = 'https://graphql-pokemon2.vercel.app/';

const serverClient = new ApolloClient({
    link: new HttpLink({ uri: API_URL }),
    cache: new InMemoryCache(),
});

interface Attack {
    name: string;
    type: string;
    damage: number;
}

interface EvolutionSummary {
    id: string;
    number: string;
    name: string;
    image: string;
}

interface PokemonDetail {
    id: string;
    number: string;
    name: string;
    image: string;
    types: string[];
    weight?: { minimum: string; maximum: string; };
    height?: { minimum: string; maximum: string; };
    classification?: string;
    resistant?: string[];
    attacks?: {
        fast?: Attack[];
        special?: Attack[];
    };
    weaknesses?: string[];
    fleeRate?: number;
    maxCP?: number;
    evolutions?: EvolutionSummary[];
    evolutionRequirements?: { amount: number; name: string; };
    maxHP?: number;
}

export async function generateStaticParams() {
    const { data } = await serverClient.query({
        query: GET_ALL_POKEMON_NAMES,
        variables: { first: 151 },
    });

    return data.pokemons.map((pokemon: { name: string }) => ({
        pokemonName: pokemon.name,
    }));
}

interface PokemonPageParams {
    pokemonName: string;
}

interface PokemonDetailPageProps {
    params: Promise<PokemonPageParams>;
}

export default async function PokemonDetailPage({
    params,
}: PokemonDetailPageProps) {
    const resolvedParams: PokemonPageParams = await params;
    const { pokemonName } = resolvedParams;

    const { data } = await serverClient.query<{
        pokemon: PokemonDetail | null;
    }>({
        query: GET_POKEMON_DETAILS,
        variables: { name: pokemonName },
    });

    const pokemon = data?.pokemon;

    if (!pokemon) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl text-red-500">Pokemon &quot;{pokemonName}&quot; not found.</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col"> 

            {/* Header */}
            <div className="w-full bg-red-600 p-2 shadow-lg flex items-center justify-between">
                <Link href="/" className="text-white hover:text-blue-200 text-lg font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Search
                </Link>
                <Image
                    src="/logo.png"
                    alt="Pokemon Logo"
                    width={200}
                    height={75}
                    priority
                />
                <div className="w-48"></div> 
            </div>

            {/* Description */}
            <div className="flex-grow bg-white p-8 rounded-2xl shadow-2xl max-w-6xl w-full mx-auto text-gray-800 space-y-8 flex flex-col justify-center mt-6 mb-6">
                {/* Pokemon Name and Number */}
                <div className="text-center space-y-1">
                    <span className="text-gray-500 text-lg font-medium tracking-widest block">
                        #{pokemon.number}
                    </span>
                    <h1 className="text-5xl font-extrabold text-red-600 tracking-wide drop-shadow-lg">
                        {pokemon.name}
                    </h1>
                </div>

                {/* Description */}
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Left: Image + Stats */}
                    <div className="w-full lg:w-1/3 space-y-6 border-r lg:pr-10">
                        {/* Image */}
                        <div className="flex justify-center">
                            <Image
                                src={pokemon.image}
                                alt={pokemon.name}
                                width={200}
                                height={200}
                            />
                        </div>

                        <div className="space-y-3 text-base">
                            {/* Types */}
                            <div className="flex justify-center items-center flex-wrap gap-1">
                                <strong className="text-gray-600 mr-2">Types:</strong>
                                {pokemon.types?.map((type: string) => (
                                    <span
                                        key={type}
                                        className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-md border border-white"
                                        style={{ backgroundColor: getTypeColor(type) }}
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                            {/* Classification */}
                            <p className="text-center">
                                <strong className="text-gray-600">Classification:</strong> {pokemon.classification}
                            </p>

                            <p><Ruler className="inline mr-2 w-4 h-4 text-indigo-500" /> <strong>Height:</strong> {pokemon.height?.minimum} - {pokemon.height?.maximum}</p>
                            <p><Scale className="inline mr-2 w-4 h-4 text-yellow-600" /> <strong>Weight:</strong> {pokemon.weight?.minimum} - {pokemon.weight?.maximum}</p>

                            <p><Heart className="inline mr-2 w-4 h-4 text-green-500" /> <strong>Max HP:</strong> <span className="text-green-600 font-bold">{pokemon.maxHP}</span></p>
                            <p><Zap className="inline mr-2 w-4 h-4 text-blue-500" /> <strong>Max CP:</strong> <span className="text-blue-600 font-bold">{pokemon.maxCP}</span></p>
                            {pokemon.fleeRate !== undefined && (
                                <p>
                                    <Activity className="inline mr-2 w-4 h-4 text-red-400" />
                                    <strong>Flee Rate:</strong> {(pokemon.fleeRate * 100).toFixed(1)}%
                                </p>
                            )}

                        </div>

                    </div >

                    {/* Mid: Attacks */}
                    <div className="w-full lg:w-1/3 space-y-6 border-r lg:pr-10" >
                        {/* Attacks */}
                        {pokemon.attacks && (
                            <div>
                                <h2 className="text-2xl font-bold text-blue-700 border-b pb-2 mb-4">Attacks</h2>
                                {/* Fast Attacks */}
                                {pokemon.attacks.fast && (
                                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
                                        <h3 className="font-semibold text- mb-1 text-purple-600">⚡ Fast Attacks</h3>
                                        <ul className="space-y-1 list-disc list-inside">
                                            {pokemon.attacks.fast.map((a, i) => (
                                                <li key={i}><span className="font-medium">{a.name}</span> ({a.type}, Damage: <span className="text-orange-500">{a.damage}</span>)</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Special Attacks */}
                                {pokemon.attacks.special && (
                                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-lg mb-1 text-pink-600">🔥 Special Attacks</h3>
                                        <ul className="space-y-1 list-disc list-inside">
                                            {pokemon.attacks.special.map((a, i) => (
                                                <li key={i}><span className="font-medium">{a.name}</span> ({a.type}, Damage: <span className="text-orange-500">{a.damage}</span>)</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Weaknesses */}
                        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Weaknesses
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {pokemon.weaknesses?.map((type: string) => (
                                    <span
                                        key={type}
                                        className="px-3 py-1 text-xs rounded-full bg-red-200 text-red-900 font-medium"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Evolutions */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {/* Evolutions */}
                        <div>
                            <h2 className="text-2xl font-bold text-pink-700 border-b pb-2 mb-3">Evolutions</h2>

                            {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={pokemon.image}
                                            alt={pokemon.name}
                                            width={80}
                                            height={80}
                                        />
                                        <span className="mt-1 text-sm font-semibold text-gray-700">{pokemon.name}</span>
                                    </div>

                                    {pokemon.evolutions.map((evo) => (
                                        <React.Fragment key={evo.id}>
                                            <span className="text-xl text-gray-500">→</span>
                                            <Link href={`/pokemon/${evo.name}`} className="flex flex-col items-center hover:scale-105 transition-transform">
                                                <Image
                                                    src={evo.image}
                                                    alt={evo.name}
                                                    width={80}
                                                    height={80}
                                                />
                                                <span className="mt-1 text-sm font-semibold text-gray-700">{evo.name}</span>
                                            </Link>
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 mt-4 border rounded-md text-center text-gray-500 bg-gray-50">
                                    <p>This Pokémon has no known evolutions.</p>
                                </div>
                            )}
                        </div>

                        {/* Evolution Requirement */}
                        {pokemon.evolutionRequirements && (
                            <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
                                <h3 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
                                    <Flame className="w-4 h-4 mr-2 text-yellow-500" /> Evolution Requirements
                                </h3>
                                <p className="text-sm text-gray-800">
                                    {pokemon.evolutionRequirements.amount} × <strong>{pokemon.evolutionRequirements.name}</strong>
                                </p>
                            </div>
                        )}

                        {/* Resistant */}
                        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                            <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Resistant
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {pokemon.resistant?.map((type: string) => (
                                    <span
                                        key={type}
                                        className="px-3 py-1 text-xs rounded-full bg-green-200 text-green-900 font-medium"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Footer */}
            <footer className="mt-10 py-6 w-full bg-white border-t text-center text-sm text-gray-600">
                <p>Made by <span className="text-red-500">❤️</span> by <span className="font-semibold text-pink-600">julaluck yeta</span></p>
            </footer>

        </div>
    );
}