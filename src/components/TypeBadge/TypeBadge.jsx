import {TYPE_COLORS, typeIcon, typeLabel} from '../../utils/pokedex';
import './TypeBadge.css';

function TypeBadge({type, small = false}) {
  return (
    <span
      className={`typeBadge${small ? ' typeBadgeSmall' : ''}`}
      style={{'--type-color': TYPE_COLORS[type] ?? '#888'}}>
      <img
        src={typeIcon(type)}
        alt=''
      />
      {typeLabel(type)}
    </span>
  );
}

export default TypeBadge;
