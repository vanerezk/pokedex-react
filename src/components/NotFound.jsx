import {Link} from 'react-router-dom';
import {localAsset} from '../api/pokeapi';
import {DexLights} from './DexParts/DexParts';

function NotFound({message = 'Esta página no está registrada en la Pokédex.'}) {
  return (
    <main className='dex'>
      <div className='dexTopBar'>
        <Link
          to='/'
          className='dexBrand'>
          <DexLights />
          <span className='dexTitle'>Pokédex</span>
        </Link>
      </div>
      <div
        className='lcd notFoundBody'
        style={{marginTop: 20}}>
        <img
          src={localAsset('images/psyduck.gif')}
          alt=''
        />
        <h1>¿Psy...? ¡Error de datos!</h1>
        <p className='lcdMuted'>{message}</p>
        <Link
          className='dexButton dexButtonYellow'
          to='/'>
          Volver a la Pokédex
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
