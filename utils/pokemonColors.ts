// utils/pokemonColors.ts 
export function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    grass: '#7AC74C',    // Green
    fire: '#EE8130',     // Orange
    water: '#6390F0',    // Blue
    bug: '#A6B91A',      // Light Green
    normal: '#A8A77A',   // Greyish
    poison: '#A33EA1',   // Purple
    electric: '#F7D02C', // Yellow
    ground: '#E2BF65',   // Brownish
    fairy: '#D685AD',    // Pink
    fighting: '#C22E28', // Red
    psychic: '#F95587',  // Pinkish Red
    rock: '#B6A136',     // Brownish Yellow
    ghost: '#735797',    // Dark Purple
    ice: '#96D9D6',      // Cyan
    dragon: '#6F35FC',   // Dark Purple Blue
    steel: '#B7B7CE',    // Light Grey
    dark: '#705746',     // Dark Brown
    flying: '#A98FF3',   // Light Purple
    default: '#999999',  // Default grey
  };
  return colors[type.toLowerCase()] || colors.default;
}