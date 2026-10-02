import {useMemo, useState} from 'react';
import useSWR from 'swr';
import {DAMAGE_CLASS_LABELS, VERSION_GROUPS, formatName, pickLanguage} from '../../utils/pokedex';
import TypeBadge from '../TypeBadge/TypeBadge';
import './MoveList.css';

function MoveRow({move, level}) {
  const {data} = useSWR(move.url);
  const name = pickLanguage(data?.names)?.name ?? formatName(move.name);

  return (
    <tr>
      <td className='moveLevel'>{level === 0 ? 'Evo.' : level}</td>
      <th scope='row'>{name}</th>
      <td>{data ? <TypeBadge type={data.type.name} small /> : '...'}</td>
      <td className='moveClass'>{data ? DAMAGE_CLASS_LABELS[data.damage_class?.name] ?? '—' : ''}</td>
      <td className='moveNumber'>{data?.power ?? '—'}</td>
      <td className='moveNumber'>{data?.accuracy ?? '—'}</td>
    </tr>
  );
}

// Movimientos que aprende subiendo de nivel, por juego.
function MoveList({moves}) {
  const availableGroups = useMemo(() => {
    const learned = new Set(
      moves.flatMap(({version_group_details}) =>
        version_group_details
          .filter((detail) => detail.move_learn_method.name === 'level-up')
          .map((detail) => detail.version_group.name),
      ),
    );
    return VERSION_GROUPS.filter((group) => learned.has(group.id));
  }, [moves]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const group = selectedGroup ?? availableGroups.at(-1)?.id;

  const levelUpMoves = useMemo(
    () =>
      moves
        .flatMap(({move, version_group_details}) =>
          version_group_details
            .filter(
              (detail) =>
                detail.version_group.name === group &&
                detail.move_learn_method.name === 'level-up',
            )
            .map((detail) => ({move, level: detail.level_learned_at})),
        )
        .sort((a, b) => a.level - b.level),
    [group, moves],
  );

  if (availableGroups.length === 0) {
    return <p className='lcdMuted'>No hay datos de movimientos por nivel.</p>;
  }

  return (
    <div className='moveList'>
      <label className='lcdField'>
        <span>Juego</span>
        <select
          value={group}
          onChange={(event) => setSelectedGroup(event.target.value)}>
          {availableGroups.map(({id, label}) => (
            <option
              key={id}
              value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className='moveTableWrap'>
        <table className='moveTable'>
          <thead>
            <tr>
              <th scope='col'>Nv.</th>
              <th scope='col'>Movimiento</th>
              <th scope='col'>Tipo</th>
              <th scope='col'>Clase</th>
              <th scope='col'>Pot.</th>
              <th scope='col'>Prec.</th>
            </tr>
          </thead>
          <tbody>
            {levelUpMoves.map(({move, level}) => (
              <MoveRow
                key={`${move.name}-${level}`}
                move={move}
                level={level}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MoveList;
