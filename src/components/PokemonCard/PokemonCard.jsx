import useSWR from 'swr';
import {Link} from 'react-router-dom';
import {artworkUrl} from '../../api/pokeapi';
import {TYPE_COLORS, formatName, formatNumber} from '../../utils/pokedex';
import {useDexProgress} from '../../hooks/DexProgressContext';
import {PokeballIcon} from '../DexParts/DexParts';
import TypeBadge from '../TypeBadge/TypeBadge';
import './PokemonCard.css';

function PokemonCard({id, name}) {
  const {data: pokemon} = useSWR(`/pokemon/${id}`);
  const {seen, caught} = useDexProgress();
  const types = pokemon?.types.map(({type}) => type.name) ?? [];
  const isCaught = caught.has(id);
  const displayName = formatName(name);

  return (
    <Link
      className='pokemonCard'
      to={`/pokemon/${id}`}
      style={{'--type-color': TYPE_COLORS[types[0]] ?? '#9aa49c'}}
      aria-label={`${formatNumber(id)} ${displayName}${isCaught ? ', capturado' : ''}`}>
      <span className='pokemonCardTop'>
        <span className='pokemonCardNumber'>{formatNumber(id)}</span>
        {isCaught ? (
          <PokeballIcon className='pokemonCardCaught' />
        ) : (
          seen.has(id) && (
            <PokeballIcon
              filled={false}
              className='pokemonCardSeen'
            />
          )
        )}
      </span>
      <span className='pokemonCardScreen'>
        <img
          src={artworkUrl(id)}
          alt=''
          loading='lazy'
          decoding='async'
          width='140'
          height='140'
        />
      </span>
      <span className='pokemonCardName'>{displayName}</span>
      <span className='pokemonCardTypes'>
        {types.length > 0 ? (
          types.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              small
            />
          ))
        ) : (
          <span className='pokemonCardTypesLoading' />
        )}
      </span>
    </Link>
  );
}

export default PokemonCard;
