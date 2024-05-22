import {useState, useEffect} from 'react';
import axios from 'axios';
import Pokemon from '../components/Pokemon/Pokemon';
import {Container, InputGroup} from 'react-bootstrap';
import Header from '../components/Header/Header';

import './Home.css';

function Home() {
  const [pokemones, setPokemones] = useState([]);
  const [allPokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtros, setFiltros] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(150);
  const [region, setRegion] = useState('All');
  const [regions, setRegions] = useState([]);
  const [type, setType] = useState('All');
  const [types, setTypes] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    getPokemones(offset);
    getAllPokemones();
  }, []);

  useEffect(() => {
    getRegions();
    getTypes();
  }, []);

  const getPokemones = async (o) => {
    const response = `https://pokeapi.co/api/v2/pokemon?offset=${o}&limit=${limit}`;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setListado(respuesta.results);
    });
  };

  const getAllPokemones = async (o) => {
    const response = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000`;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setAllPokemones(respuesta.results);
    });
  };

  const buscar = async (e) => {
    if (e.keyCode === 13) {
      if (filtros.trim() != '') {
        setListado([]);
        setTimeout(() => {
          const filteredPokemons = allPokemones.filter((p) => p.name.includes(filtros));
          setListado(filteredPokemons);
          setIsNotFound(filteredPokemons.length === 0);
        }, 1000);
      } else if (filtros.trim() == '') {
        setListado([]);
        setTimeout(() => {
          setListado(pokemones);
          setIsNotFound(false);
        }, 1000);
      }
    }
  };

  const getRegions = async () => {
    const response = `https://pokeapi.co/api/v2/region`;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setRegions(respuesta.results);
    });
  };

  const getTypes = async () => {
    const response = `https://pokeapi.co/api/v2/type`;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setTypes(respuesta.results);
    });
  };

  const handleRegion = (e) => {
    setRegion(e.target.value);
  };

  const handleType = (e) => {
    setType(e.target.value);
  };
  return (
    <>
      <Header />
      <Container>
        <InputGroup className='buscadorPokemon'>
          <input
            value={filtros}
            onChange={(e) => setFiltros(e.target.value)}
            placeholder='Search by name'
            onKeyDown={buscar}
          />

          <select
            value={region}
            onChange={handleRegion}
            disabled>
            <option value='All'>COMING SOON...</option>
            {regions.map((region) => (
              <option
                key={region.id}
                value={region.name}>
                {region.name}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={handleType}
            disabled>
            <option value='All'>COMING SOON...</option>
            {types.map((type) => (
              <option
                key={type.id}
                value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </InputGroup>
      </Container>
      <div className='pokemonList'>
        {listado.map((pok, i) => (
          <Pokemon
            key={i}
            poke={pok}
          />
        ))}
      </div>
      {isNotFound && (
        <p className='notFound text-center mt-5 mb-5 '>
          Your search did not match any pokemon, please try again with another name!
        </p>
      )}
    </>
  );
}

export default Home;
