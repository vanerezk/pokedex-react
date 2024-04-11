import { useState, useEffect } from "react";
import { colorTypeGradients } from "../../utils/utils";
import "./Pokemon.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardImg, Badge, Button, CardText } from "reactstrap";

function Pokemon(params) {
  const [pokemon, setPokemon] = useState([]);
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const response = params.poke.url;
    axios.get(response).then(async (response) => {
      const respuesta = response.data;
      if (respuesta.sprites.other["official-artwork"].front_default != null) {
        setImagen(respuesta.sprites.other["official-artwork"].front_default);
      } else {
        setImagen(respuesta.sprites.other.dream_world.front_default);
      }
      setPokemon(respuesta);
    });
  };

  const typePhotoMap = {
    normal: "normal.png",
    fire: "fire.png",
    water: "water.png",
    electric: "electric.png",
    grass: "grass.png",
    ice: "ice.png",
    fighting: "fighting.png",
    poison: "poison.png",
    ground: "ground.png",
    flying: "flying.png",
    psychic: "psychic.png",
    bug: "bug.png",
    rock: "rock.png",
    ghost: "ghost.png",
    dragon: "dragon.png",
    dark: "dark.png",
    steel: "steel.png",
    fairy: "fairy.png",
  };

  const typePhotos = pokemon.types
    ? pokemon.types.map((type) => typePhotoMap[type.type.name])
    : [];

  if (!pokemon.types) {
    return null;
  }

  return (
    <>
      <Card
        className="pokemonCard"
        style={{
          background: `linear-gradient(to right, ${colorTypeGradients(
            pokemon.types[0].type.name,
            pokemon.types[1] ? pokemon.types[1].type.name : "",
            2
          ).join(", ")})`,
        }}>
        <Badge className="pokemonId">#{pokemon.id}</Badge>
        <label className="pokemonName"> {pokemon.name}</label>

        <CardImg
          src={imagen}
          className="pokemonImg"
          alt={pokemon.name}
        />
        <CardText>
          {pokemon.types && (
            <ul className="pokemonTypes">
              {pokemon.types.map((type, index) => (
                <li key={index}>
                  <img
                    src={`../src/assets/images/${typePhotos[index]}`}
                    alt={type.type.name}
                    title={type.type.name}
                    style={{
                      backgroundColor: colorTypeGradients(
                        type.type.name,
                        pokemon.types[1] ? pokemon.types[1].type.name : "",
                        1
                      )[0],
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardText>
        <Link to={`/pokemon/` + pokemon.name}>
          <Button className="btnInfo">Info</Button>
        </Link>
      </Card>
    </>
  );
}

export default Pokemon;
