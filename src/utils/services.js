export const getAllPokemons = async (offset, limit) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

export const getPokemonDetails = async (selectedName) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${selectedName}`
  );
  const data = await response.json();
  return data;
};

export const getPokemonSpecies = async (name) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`
  );
  const data = await response.json();
  return data;
};

export const getRegions = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/region`);
  const data = await response.json();
  return data;
};

export const getTypes = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/type`);
  const data = await response.json();
  return data;
};

export const getPokemonByRegion = async (regionId) => {
  const response = await fetch(`https://pokeapi.co/api/v2/region/${regionId}/`);
  const data = await response.json();
  return data;
};
