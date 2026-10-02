import {getTypeMatchups} from '../../utils/pokedex';
import TypeBadge from '../TypeBadge/TypeBadge';
import './TypeMatchups.css';

const GROUPS = [
  {multiplier: 4, label: 'Muy débil', value: '×4'},
  {multiplier: 2, label: 'Débil', value: '×2'},
  {multiplier: 0.5, label: 'Resistente', value: '×½'},
  {multiplier: 0.25, label: 'Muy resistente', value: '×¼'},
  {multiplier: 0, label: 'Inmune', value: '×0'},
];

function TypeMatchups({types}) {
  const matchups = getTypeMatchups(types);

  return (
    <div className='matchups'>
      <p className='lcdMuted'>Daño que recibe de cada tipo de ataque.</p>
      {GROUPS.filter(({multiplier}) => matchups[multiplier].length > 0).map(
        ({multiplier, label, value}) => (
          <div
            className='matchupRow'
            key={multiplier}>
            <span className='matchupLabel'>
              <strong>{value}</strong> {label}
            </span>
            <span className='matchupTypes'>
              {matchups[multiplier].map((type) => (
                <TypeBadge
                  key={type}
                  type={type}
                  small
                />
              ))}
            </span>
          </div>
        ),
      )}
    </div>
  );
}

export default TypeMatchups;
