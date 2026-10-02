import {localAsset} from '../../api/pokeapi';
import './Loader.css';

function Loader({label = 'Cargando', compact = false}) {
  return (
    <div
      className={`loader${compact ? ' loaderCompact' : ''}`}
      role='status'
      aria-live='polite'>
      <p className='loaderText'>
        {label}
        <span
          className='loaderDots'
          aria-hidden='true'>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
      <img
        className='loaderSprite'
        src={localAsset('images/pikachu-loading.gif')}
        alt=''
        width='50'
        height='46'
      />
    </div>
  );
}

export default Loader;
