// __tests__/pokemonTypes.test.ts

import { bulbasaurMock, charmanderMock, squirtleMock } from './mocks/pokemonMocks';

describe('Pokémon Types Test Suite', () => {
    // Test case สำหรับ Bulbasaur
    test('Bulbasaur should be a Grass and Poison type Pokémon', () => {
        expect(bulbasaurMock.types).toContain('Grass');
        expect(bulbasaurMock.types).toContain('Poison');
        expect(bulbasaurMock.types).toHaveLength(2);
    });

    // Test case สำหรับ Charmander
    test('Charmander should be a Fire type Pokémon', () => {
        expect(charmanderMock.types).toContain('Fire');
        expect(charmanderMock.types).toHaveLength(1);
    });

    // Test case สำหรับ Squirtle
    test('Squirtle should be a Water type Pokémon', () => {
        expect(squirtleMock.types).toContain('Water');
        expect(squirtleMock.types).toHaveLength(1);
    });
});