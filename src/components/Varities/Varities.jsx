import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

function Varities(params) {
  const [pokemon, setPokemon] = useState([]);
  const [img, setImg] = useState('');

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const response = params.poke.url;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setImg(respuesta.sprites.other['official-artwork'].front_default);
      setPokemon(respuesta);
    });
  };

  return (
    <>
      <Link to={`/pokemon/${pokemon.name}`}>
        <div className='varitiesCard'>
          <img
            src={img}
            alt='pokemon'
          />
        </div>
      </Link>
    </>
  );
}

export default Varities;
