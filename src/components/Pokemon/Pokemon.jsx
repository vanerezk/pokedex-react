import {useState, useEffect} from 'react';
import {colorTypeGradients} from '../../utils/utils';
import './Pokemon.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Card, CardImg, Badge, Button, CardText} from 'reactstrap';
import normal from '../public/assets/images/normal.png';
import fire from '../public/assets/images/fire.png';
import water from '../public/assets/images/water.png';
import electric from '../public/assets/images/electric.png';
import grass from '../public/assets/images/grass.png';
import ice from '../public/assets/images/ice.png';
import fighting from '../public/assets/images/fighting.png';
import poison from '../public/assets/images/poison.png';
import ground from '../public/assets/images/ground.png';
import flying from '../public/assets/images/flying.png';
import psychic from '../public/assets/images/psychic.png';
import bug from '../public/assets/images/bug.png';
import rock from '../public/assets/images/rock.png';
import ghost from '../public/assets/images/ghost.png';
import dragon from '../public/assets/images/dragon.png';
import dark from '../public/assets/images/dark.png';
import steel from '../public/assets/images/steel.png';
import fairy from '../public/assets/images/fairy.png';

function Pokemon(params) {
  const [pokemon, setPokemon] = useState([]);
  const [imagen, setImagen] = useState('');

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const response = params.poke.url;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      if (respuesta.sprites.other['official-artwork'].front_default != null) {
        setImagen(respuesta.sprites.other['official-artwork'].front_default);
      } else {
        setImagen(respuesta.sprites.other.dream_world.front_default);
      }
      setPokemon(respuesta);
    });
  };

  const typePhotoMap = {
    normal: {normal},
    fire: {fire},
    water: {water},
    electric: {electric},
    grass: {grass},
    ice: {ice},
    fighting: {fighting},
    poison: {poison},
    ground: {ground},
    flying: {flying},
    psychic: {psychic},
    bug: {bug},
    rock: {rock},
    ghost: {ghost},
    dragon: {dragon},
    dark: {dark},
    steel: {steel},
    fairy: {fairy},
  };

  const typePhotos = pokemon.types
    ? pokemon.types.map(
        (type) => typePhotoMap[type.type.name][Object.keys(typePhotoMap[type.type.name])[0]]
      )
    : [];
  if (!pokemon.types) {
    return null;
  }

  return (
    <>
      <Card
        className='pokemonCard'
        style={{
          background: `linear-gradient(to right, ${colorTypeGradients(
            pokemon.types[0].type.name,
            pokemon.types[1] ? pokemon.types[1].type.name : '',
            2
          ).join(', ')})`,
        }}>
        <Badge className='pokemonId'>#{pokemon.id}</Badge>
        <label className='pokemonName'> {pokemon.name}</label>

        <CardImg
          src={imagen}
          className='pokemonImg'
          alt={pokemon.name}
        />
        {pokemon.types && (
          <div>
            <ul className='pokemonTypes'>
              {pokemon.types.map((type, index) => (
                <li key={index}>
                  <img
                    src={typePhotos[index]}
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
        <Link to={`/pokemon/` + pokemon.name}>
          <Button className='btnInfo'>Info</Button>
        </Link>
      </Card>
    </>
  );
}

export default Pokemon;
