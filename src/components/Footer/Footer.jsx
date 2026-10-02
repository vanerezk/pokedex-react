import './Footer.css';

function Footer() {
  return (
    <footer className='siteFooter'>
      <span>
        Datos de{' '}
        <a
          href='https://pokeapi.co'
          target='_blank'
          rel='noreferrer'>
          PokéAPI
        </a>{' '}
        · Pokémon y sus nombres son marcas de Nintendo, Game Freak y The Pokémon Company.
      </span>
    </footer>
  );
}

export default Footer;
