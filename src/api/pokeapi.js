export const API_URL = 'https://pokeapi.co/api/v2';
const SPRITES_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// Acepta rutas relativas ('/pokemon/25') o URLs completas que devuelve la propia API.
export async function fetcher(url) {
  const response = await fetch(url.startsWith('http') ? url : `${API_URL}${url}`);

  if (!response.ok) {
    const error = new Error(`La PokéAPI respondió ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export const idFromUrl = (url) => Number(url.match(/\/(\d+)\/?$/)?.[1]);

export const artworkUrl = (id) => `${SPRITES_URL}/other/official-artwork/${id}.png`;

export const pixelSpriteUrl = (id) => `${SPRITES_URL}/${id}.png`;

export const localAsset = (path) => `${import.meta.env.BASE_URL}assets/${path}`;
