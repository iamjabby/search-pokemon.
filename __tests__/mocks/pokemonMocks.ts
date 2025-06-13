// __tests__/mocks/pokemonMocks.ts

interface MockPokemonDetail {
    number: string;
    name: string;
    image: string;
    types: string[];
}

export const bulbasaurMock: MockPokemonDetail = {
    number: "001",
    name: "Bulbasaur",
    image: "https://img.pokemondb.net/artwork/bulbasaur.jpg",
    types: ["Grass", "Poison"],
};

export const charmanderMock: MockPokemonDetail = {
    number: "004",
    name: "Charmander",
    image: "https://img.pokemondb.net/artwork/charmander.jpg",
    types: ["Fire"],
};

export const squirtleMock: MockPokemonDetail = {
    number: "007",
    name: "Squirtle",
    image: "https://img.pokemondb.net/artwork/squirtle.jpg",
    types: ["Water"],
};
