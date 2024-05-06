import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Varities.css';

function SelectPokemon(params) {
  const [pokemon, setPokemon] = useState([]);
  const [imagen, setImagen] = useState('');

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const response = params.pokemonUrl;

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

  return (
    <>
      <>
        <Link to={`/pokemon/${pokemon.name}`}>
          <div className='varitiesCard'>
            <img
              src={imagen}
              className='varitiesImg'
              alt={pokemon.name}
            />
          </div>
        </Link>
      </>
    </>
  );
}

export default SelectPokemon;
