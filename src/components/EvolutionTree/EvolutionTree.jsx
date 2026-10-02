import {Link} from 'react-router-dom';
import {artworkUrl, idFromUrl} from '../../api/pokeapi';
import {describeEvolution, formatName, formatNumber} from '../../utils/pokedex';
import './EvolutionTree.css';

function EvolutionNode({node, currentId}) {
  const id = idFromUrl(node.species.url);
  const isCurrent = id === currentId;

  return (
    <div className='evoNode'>
      <Link
        className={`evoCard${isCurrent ? ' isCurrent' : ''}`}
        to={`/pokemon/${id}`}
        aria-current={isCurrent ? 'page' : undefined}>
        <img
          src={artworkUrl(id)}
          alt=''
          loading='lazy'
          width='72'
          height='72'
        />
        <span className='evoNumber'>{formatNumber(id)}</span>
        <span className='evoName'>{formatName(node.species.name)}</span>
      </Link>

      {node.evolves_to.length > 0 && (
        <ul className={`evoBranches${node.evolves_to.length > 2 ? ' isWide' : ''}`}>
          {node.evolves_to.map((child) => (
            <li
              className='evoBranch'
              key={child.species.name}>
              <span className='evoMethod'>
                <span aria-hidden='true'>▼ </span>
                {describeEvolution(child.evolution_details)}
              </span>
              <EvolutionNode
                node={child}
                currentId={currentId}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EvolutionTree({chain, currentId}) {
  if (!chain) return <p className='lcdMuted'>Cargando evoluciones...</p>;

  if (chain.evolves_to.length === 0) {
    return <p className='lcdMuted'>Este Pokémon no evoluciona.</p>;
  }

  return (
    <div className='evoTree'>
      <EvolutionNode
        node={chain}
        currentId={currentId}
      />
    </div>
  );
}

export default EvolutionTree;
