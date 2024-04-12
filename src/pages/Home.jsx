import {useState, useEffect} from 'react';
import axios from 'axios';
import Pokemon from '../components/Pokemon/Pokemon';
import {Container, InputGroup} from 'react-bootstrap';
import {getRegions, getTypes} from '../utils/services';

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
          setListado(allPokemones.filter((p) => p.name.includes(filtros)));
        }, 1000);
      } else if (filtros.trim() == '') {
        setListado([]);
        setTimeout(() => {
          setListado(pokemones);
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
            onChange={handleRegion}>
            <option value='All'>Search by region</option>
            {regions.map((region) => (
              <option
                key={region.id}
                value={region.name}>
                {region.name}
              </option>
            ))}
          </select>

          {/* <select
            value={type}
            onChange={handleType}>
            <option value='All'>Search by type</option>
            {types.map((type) => (
              <option
                key={type.id}
                value={type.name}>
                {type.name}
              </option>
            ))}
          </select> */}
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
    </>
  );
}

export default Home;