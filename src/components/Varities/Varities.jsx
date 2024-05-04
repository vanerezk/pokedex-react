import {useState, useEffect, Children} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

function Varities(params) {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const response = params.poke.url;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;

      setPokemon(respuesta);
    });
  };

  return (
    <>
      <Link to={`/pokemon/${pokemon.name}`}>
        <p>hola{pokemon.name}</p>
      </Link>
    </>
  );
}

export default Varities;
