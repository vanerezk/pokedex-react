import { useState, useEffect } from "react";
import { colorTypeGradients } from "../../utils/utils";
import "./Evolutions.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardImg, Badge, Button } from "reactstrap";

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
      if (respuesta.sprites.other.dream_world.front_default != null) {
        setImagen(respuesta.sprites.other["official-artwork"].front_default);
      } else {
        setImagen(respuesta.sprites.dream_world.front_default);
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
        <div className="evolutionCard">
          <img
            src={imagen}
            className="evolutionImg"
            alt={pokemon.name}
          />
        </div>
      </Link>
    </>
  );
}

export default Pokemon;
