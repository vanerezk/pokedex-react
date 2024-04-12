import {useState, useEffect} from 'react';

import './Evolutions.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

function Pokemon(params) {
  const [pokemon, setPokemon] = useState([]);
  const [imagen, setImagen] = useState('');

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const response = params.poke.url;
    console.log(response);
    console.log(params);
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      if (
        respuesta.sprites &&
        respuesta.sprites.other?.['official-artwork'].front_default != null
      ) {
        setImagen(respuesta.sprites.other['official-artwork'].front_default);
      } else if (respuesta.sprites && respuesta.sprites.other) {
        setImagen(respuesta.sprites.other.dream_world.front_default);
      }
      setPokemon(respuesta);
    });
  };

  if (!pokemon.types) {
    return null;
  }

  return (
    <>
      <Link to={`/pokemon/${pokemon.name}`}>
        <div className='evolutionCard'>
          <img
            src={imagen}
            className='evolutionImg'
            alt={pokemon.name}
          />
        </div>
      </Link>
    </>
  );
}

export default Pokemon;
