import {useState, useEffect} from 'react';
import {colorTypeGradients} from '../utils/utils';
import {useParams, useNavigate} from 'react-router-dom';
import {Row, Col, Badge, Progress, CardText} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Evolutions from '../components/Evolutions/Evolutions';
import './Detail.css';
import SelectPokemon from '../components/Varities/Varities';
import CloseButton from 'react-bootstrap/CloseButton';
import {IoMdVolumeHigh} from 'react-icons/io';
import axios from 'axios';

const Detail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState([]);
  const [habitat, setHabitat] = useState('Unknown');
  const [species, setSpecies] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [stats, setStats] = useState([]);
  const [evoluciones, setEvoluciones] = useState([]);
  const [listaEvoluciones, setListaEvoluciones] = useState([]);
  const [description, setDescription] = useState([]);
  const [image, setImage] = useState('');
  const [isPlayingCries, setIsPlayingCries] = useState(false);
  const [varieties, setVarieties] = useState([]);
  const [volume, setVolume] = useState(0.05);
  const [showShiny, setShowShiny] = useState(false);

  useEffect(() => {
    getPokemon();
  }, [id]);

  const playCries = () => {
    const audio = new Audio(pokemon.cries.latest);
    audio.volume = volume;
    audio.play();
    setIsPlayingCries(true);
  };

  const playCriesLegacy = () => {
    const audio = new Audio(pokemon.cries.legacy);
    audio.volume = volume;
    audio.play();
    setIsPlayingCries(true);
  };

  const getPokemon = async () => {
    const response = 'https://pokeapi.co/api/v2/pokemon/' + id;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setPokemon(respuesta);
      if (respuesta.sprites.other['official-artwork'].front_default != null) {
        setImage(respuesta.sprites.other['official-artwork'].front_default);
      } else {
        setImage(respuesta.sprites.other.dream_world.front_default);
      }
      await getSpecies(respuesta.species.name);
      await getStats(respuesta.stats);
      await getAbilities(respuesta.abilities);
    });
  };

  const getAbilities = async (abi) => {
    let listAbilities = [];
    for (let i = 0; i < abi.length; i++) {
      if (i == abi.length - 1) {
        listAbilities.push(abi[i].ability.name);
      } else {
        listAbilities.push(abi[i].ability.name + ', ');
      }
    }
    setAbilities(listAbilities);
  };

  const getStats = async (stat) => {
    let listStats = [];
    stat.forEach((h) => {
      axios.get(h.stat.url).then(async (response) => {
        listStats.push({
          name: response.data.name,
          value: h.base_stat,
        });
        setStats(listStats);
      });
    });
  };

  const getSpecies = async (spe) => {
    const response = 'https://pokeapi.co/api/v2/pokemon-species/' + spe;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      setSpecies(respuesta);
      console.log(respuesta);

      if (respuesta.habitat != null) {
        await getHabitat(respuesta.habitat.url);
      }

      if (respuesta.varieties != null) {
        setVarieties(respuesta.varieties);
      }

      await getDescription(respuesta.flavor_text_entries);
      await getEvoluciones(respuesta.evolution_chain.url);
    });
  };

  const getHabitat = async (hab) => {
    axios.get(hab).then(async (response) => {
      setHabitat(response.data.name);
    });
  };

  const getEvoluciones = async (ev) => {
    axios.get(ev).then(async (response) => {
      const respuesta = response.data;
      let lista = respuesta.chain.species.url.replace('-species', '');
      lista += procesaEvoluciones(respuesta.chain);
      console.log(respuesta.chain);
      setEvoluciones(lista);

      let apoyo = lista.split(' ');
      let list = [];
      apoyo.forEach((ap) => {
        if (ap !== '') {
          list.push({url: ap});
        }
      });
      setListaEvoluciones(list);
    });
  };

  const procesaEvoluciones = (info) => {
    let res = ' ';
    info.evolves_to.forEach((evo) => {
      res += evo.species.url.replace('-species', '') + ' ';
      if (evo.evolves_to.length > 0) {
        res += procesaEvoluciones(evo);
      }
    });
    return res;
  };

  const getDescription = async (desc) => {
    let text = '';
    if (desc[0].language.name === 'en') {
      text = desc[0].flavor_text;
    }
    if (text == '' && desc.lenght > 0) {
      text = desc[1].flavor_text;
    }
    setDescription(text);
  };

  const typePhotoMap = {
    normal: 'public/assets/images/normal.png',
    fire: 'public/assets/images/fire.png',
    water: 'public/assets/images/water.png',
    electric: 'public/assets/images/electric.png',
    grass: 'public/assets/images/grass.png',
    ice: 'public/assets/images/ice.png',
    fighting: 'public/assets/images/fighting.png',
    poison: 'public/assets/images/poison.png',
    ground: 'public/assets/images/ground.png',
    flying: 'public/assets/images/flying.png',
    psychic: 'public/assets/images/psychic.png',
    bug: 'public/assets/images/bug.png',
    rock: 'public/assets/images/rock.png',
    ghost: 'public/assets/images/ghost.png',
    dragon: 'public/assets/images/dragon.png',
    dark: 'public/assets/images/dark.png',
    steel: 'public/assets/images/steel.png',
    fairy: 'public/assets/images/fairy.png',
  };

  const typePhotos = pokemon.types ? pokemon.types.map((type) => typePhotoMap[type.type.name]) : [];

  if (!pokemon.types) {
    return null;
  }

  console.log(pokemon);

  return (
    <>
      <div className='cardPokemon'>
        <div
          className='left'
          style={{
            background: `linear-gradient(to right, ${colorTypeGradients(
              pokemon.types[0].type.name,
              pokemon.types[1] ? pokemon.types[1].type.name : '',
              2
            ).join(', ')})`,
          }}>
          <img
            src={
              showShiny
                ? pokemon.sprites.other['official-artwork'].front_shiny
                : pokemon.sprites.other['official-artwork'].front_default
            }
            alt={pokemon.name}
            className='pokemon-img'
            onClick={() => setShowShiny(!showShiny)}
          />
          <Col>
            {pokemon.types && (
              <div className='pokemonTypes'>
                <ul>
                  {pokemon.types.map((type, index) => (
                    <li key={index}>
                      <img
                        src={`public/assets/images/${typePhotos[index]}`}
                        alt={type.type.name}
                        title={type.type.name}
                        style={{
                          backgroundColor: colorTypeGradients(
                            type.type.name,
                            pokemon.types[1] ? pokemon.types[1].type.name : '',
                            1
                          )[0],
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <CardText className='alturaPokemon'>
              Height: <b>{pokemon.height / 10} m.</b>
            </CardText>
            <CardText className='pesoPokemon'>
              Weight: <b>{pokemon.weight / 10} kg.</b>
            </CardText>
          </Col>
        </div>
        <div className='right'>
          <CloseButton
            onClick={() => navigate('/')}
            className='mt-3'
            aria-label='Close'
            style={{float: 'right'}}
          />
          <CardText className='tituloPokemon text-center mt-3'>
            #{pokemon.id} - {pokemon.name}
          </CardText>

          <hr />
          <Col>
            <CardText className='descripcionPokemon'>{description}</CardText>
            <CardText className='pokemonHabitat'>
              Habitat: <b>{habitat}</b>
            </CardText>
            <CardText>
              Abilities:{' '}
              {abilities.map((abi, i) => (
                <Badge
                  key={i}
                  className='m-1'>
                  {' '}
                  {abi}{' '}
                </Badge>
              ))}
            </CardText>
            <CardText>
              <b>Cries:</b>

              <IoMdVolumeHigh
                onClick={playCries}
                className='playCries'
                title='Play Cries'
                size={30}
                color='black'
                style={{cursor: 'pointer', marginLeft: '14px', marginTop: '-3px'}}
              />
              {pokemon.cries.legacy && (
                <IoMdVolumeHigh
                  onClick={playCriesLegacy}
                  className='playCries'
                  title='Play Cries'
                  size={30}
                  color='black'
                  style={{cursor: 'pointer', marginLeft: '14px', marginTop: '-3px'}}
                />
              )}
            </CardText>
            <CardText>
              Does it have shiny version?: {pokemon.sprites.front_shiny ? 'Yes' : 'No'} (Click the
              photo to see it)
            </CardText>

            <hr />
          </Col>
          <Col md='12 mt-3'>
            <CardText className='fs-4 text-center'>
              <b>Stats:</b>
            </CardText>
          </Col>
          {stats.map((stat, i) => (
            <Row
              key={i}
              className='align-items-center pokemonStats'>
              <Col
                md='3'
                xs='6'>
                <b>{stat.name}</b>
              </Col>
              <Col
                md='9'
                xs='6'>
                <Progress
                  className='my-2'
                  color='secondary'
                  max='100'
                  value={stat.value}>
                  {stat.value}
                </Progress>
              </Col>
            </Row>
          ))}
          <Row>
            <Col>
              <CardText className='fs-4 text-center'>
                <b>Evolution chain:</b>
              </CardText>
              {listaEvoluciones.map((pok, i) => (
                <Evolutions
                  key={i}
                  poke={pok}
                />
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <CardText className='fs-4 text-center'>
                <b>Varieties:</b>
              </CardText>
              {varieties.length === 1 ? (
                <CardText className=' fs-6 text-center'>This pokemon has no varieties</CardText>
              ) : (
                varieties.slice(1).map((variety, i) => (
                  <SelectPokemon
                    key={i}
                    pokemonUrl={variety.pokemon.url}
                    pokemonName={variety.pokemon.name}
                  />
                ))
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Detail;
