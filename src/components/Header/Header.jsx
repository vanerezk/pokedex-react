import Pokedex from "../../assets/pokedex.png";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="header">
        <Link to="/">
          <div className="pokelogo">
            <img
              src={Pokedex}
              alt="pokelogo"
              className="pokelogo"
            />
          </div>
        </Link>
      </div>
    </>
  );
}

export default Header;
