// graphql/queries.ts 
import { gql } from "@apollo/client";

export const GET_POKEMON_DETAILS = gql`
    query GetPokemonDetails($name: String!) {
        pokemon(name: $name){
            id
            number
            name
            image

            weight { 
                minimum
                maximum
            }

            height {
                minimum
                maximum
            }

            classification
            types 
            resistant

            attacks {
                fast {
                    name 
                    type
                    damage
                }
                special {
                    name
                    type
                    damage
                }
            }

            weaknesses
            fleeRate
            maxCP

            evolutions {
                id
                number
                name
                image
            }
            
            evolutionRequirements {
                amount
                name
            }

            maxHP
        }
}
`;

export const GET_ALL_POKEMON_NAMES = gql`
  query GetAllPokemonNames($first: Int!) {
    pokemons(first: $first) {
      name
    }
  }
`;