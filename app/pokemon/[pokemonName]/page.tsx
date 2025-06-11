// app/pokemon/[pokemonName]/page.tsx
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GET_POKEMON_DETAILS, GET_ALL_POKEMON_NAMES } from '@/graphql/queries';
import Image from 'next/image';
import Link from 'next/link';

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

interface PokemonPageProps {
    params: {
        pokemonName: string;
    };
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


export default async function PokemonDetailPage({ params }: PokemonPageProps) {
    const resolvedParams = await params;
    const { pokemonName } = resolvedParams;

    const { data } = await serverClient.query<{ pokemon: PokemonDetail | null }>({
        query: GET_POKEMON_DETAILS,
        variables: { name: pokemonName },
    });

    const pokemon = data?.pokemon;

    if (!pokemon) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl text-red-500">Pokemon "{pokemonName}" not found.</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <Link href="/" className="mb-6 text-blue-600 hover:underline">
                ← Back to Search
            </Link>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 max-w-2xl w-full">
                <h1 className="text-4xl font-bold mb-4 text-center">{pokemon.name}</h1>
                <div className="flex justify-center mb-6">
                    <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
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

                    {/* Attacks และ Evolutions */}
                    <div>
                        {pokemon.attacks && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Attacks:</h3>
                                {pokemon.attacks.fast && pokemon.attacks.fast.length > 0 && (
                                    <div className="mb-2">
                                        <h4 className="font-medium">Fast Attacks:</h4>
                                        <ul className="list-disc list-inside">
                                            {pokemon.attacks.fast.map((attack: Attack, index: number) => (
                                                <li key={index}>{attack.name} ({attack.type}, Damage: {attack.damage})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {pokemon.attacks.special && pokemon.attacks.special.length > 0 && (
                                    <div>
                                        <h4 className="font-medium">Special Attacks:</h4>
                                        <ul className="list-disc list-inside">
                                            {pokemon.attacks.special.map((attack: Attack, index: number) => (
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
                                    {pokemon.evolutions.map((evolution: EvolutionSummary) => (
                                        <li key={evolution.id} className="cursor-pointer text-blue-600 hover:underline">
                                            <Link href={`/pokemon/${evolution.name}`}>
                                                {evolution.name} ({evolution.number})
                                            </Link>
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
        </div>
    );
}
