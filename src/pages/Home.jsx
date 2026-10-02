import {useMemo, useRef} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import useSWR from 'swr';
import {idFromUrl} from '../api/pokeapi';
import {useSpeciesList} from '../hooks/useSpeciesList';
import {useDexProgress} from '../hooks/DexProgressContext';
import {DPad, DexLights, PokeballIcon} from '../components/DexParts/DexParts';
import Loader from '../components/Loader/Loader';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import {POKEMON_TYPES, REGIONS, formatName, normalizeText, typeLabel} from '../utils/pokedex';
import './Home.css';

const PAGE_SIZE = 24;

function Home() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const [params, setParams] = useSearchParams();
  const {species, total, error, isLoading, retry} = useSpeciesList();
  const {seen, caught} = useDexProgress();

  const search = params.get('q') ?? '';
  const type = params.get('tipo') ?? 'all';
  const regionId = params.get('region') ?? 'all';
  const onlyCaught = params.get('capturados') === '1';
  const requestedPage = Number(params.get('pagina')) || 1;

  const typeRequest = useSWR(type === 'all' ? null : `/type/${type}`);
  const typeIds = useMemo(
    () => new Set(typeRequest.data?.pokemon.map(({pokemon}) => idFromUrl(pokemon.url))),
    [typeRequest.data],
  );

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') next.delete(key);
      else next.set(key, value);
    });
    if (!('pagina' in changes)) next.delete('pagina');
    setParams(next, {replace: true});
  };

  const filtered = useMemo(() => {
    const region = REGIONS.find(({id}) => id === regionId);
    const query = normalizeText(search).replace(/^#/, '');
    const isNumber = /^\d+$/.test(query);

    return species.filter(({id, name}) => {
      if (region && (id < region.from || id > region.to)) return false;
      if (type !== 'all' && !typeIds.has(id)) return false;
      if (onlyCaught && !caught.has(id)) return false;
      if (!query) return true;
      if (isNumber) return id === Number(query);
      return name.includes(query) || normalizeText(formatName(name)).includes(query);
    });
  }, [caught, onlyCaught, regionId, search, species, type, typeIds]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const waiting = isLoading || typeRequest.isLoading;
  const loadError = error ?? typeRequest.error;

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    updateParams({pagina: nextPage === 1 ? null : String(nextPage)});
    resultsRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  const openRandom = () => {
    const pool = filtered.length > 0 ? filtered : species;
    if (pool.length === 0) return;
    navigate(`/pokemon/${pool[Math.floor(Math.random() * pool.length)].id}`);
  };

  return (
    <main className='dex'>
      <div className='dexTopBar'>
        <Link
          to='/'
          className='dexBrand'
          aria-label='Pokédex, inicio'>
          <DexLights />
          <h1 className='dexTitle'>Pokédex</h1>
        </Link>
        <dl className='lcd dexCounter'>
          <div>
            <dt>Vistos</dt>
            <dd>{String(seen.size).padStart(3, '0')}</dd>
          </div>
          <div>
            <dt>Capturados</dt>
            <dd>{String(caught.size).padStart(3, '0')}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{total ? String(total).padStart(3, '0') : '---'}</dd>
          </div>
        </dl>
      </div>

      <form
        className='dexFilters'
        role='search'
        onSubmit={(event) => event.preventDefault()}>
        <label className='dexField dexFieldSearch'>
          <span>Nombre o número</span>
          <input
            type='search'
            autoComplete='off'
            placeholder='Ej. Pikachu o 25'
            value={search}
            onChange={(event) => updateParams({q: event.target.value})}
          />
        </label>
        <label className='dexField'>
          <span>Tipo</span>
          <select
            value={type}
            onChange={(event) => updateParams({tipo: event.target.value})}>
            <option value='all'>Todos</option>
            {POKEMON_TYPES.map((pokemonType) => (
              <option
                key={pokemonType}
                value={pokemonType}>
                {typeLabel(pokemonType)}
              </option>
            ))}
          </select>
        </label>
        <label className='dexField'>
          <span>Región</span>
          <select
            value={regionId}
            onChange={(event) => updateParams({region: event.target.value})}>
            <option value='all'>Todas</option>
            {REGIONS.map(({id, label}) => (
              <option
                key={id}
                value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className='dexFilterButtons'>
          <button
            type='button'
            className='dexButton'
            aria-pressed={onlyCaught}
            onClick={() => updateParams({capturados: onlyCaught ? null : '1'})}>
            <PokeballIcon /> Capturados
          </button>
          <button
            type='button'
            className='dexButton dexButtonYellow'
            onClick={openRandom}
            disabled={species.length === 0}>
            ¿Quién es ese Pokémon?
          </button>
        </div>
      </form>

      <div
        className='screenBezel homeScreen'
        ref={resultsRef}>
        <div
          className='screenBezelDots'
          aria-hidden='true'>
          <span />
          <span />
        </div>
        <section
          className='homeScreenInner'
          aria-label='Resultados'
          aria-busy={waiting}>
          {waiting ? (
            <Loader label='Cargando' />
          ) : loadError ? (
            <div className='homeMessage'>
              <p role='alert'>No se pudo conectar con la Pokédex. Revisa tu conexión.</p>
              <button
                type='button'
                className='dexButton dexButtonYellow'
                onClick={() => {
                  retry();
                  typeRequest.mutate();
                }}>
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className='homeMessage'
              role='status'>
              {onlyCaught && caught.size === 0
                ? 'Aún no has capturado ningún Pokémon. Abre una ficha y pulsa «Capturar».'
                : 'No hay Pokémon registrados con esos filtros.'}
            </div>
          ) : (
            <>
              <p
                className='homeStatus'
                role='status'>
                {filtered.length} Pokémon
              </p>
              <div className='pokemonGrid'>
                {visible.map(({id, name}) => (
                  <PokemonCard
                    key={id}
                    id={id}
                    name={name}
                  />
                ))}
              </div>
            </>
          )}
        </section>
        <div
          className='screenBezelFooter'
          aria-hidden='true'>
          <span className='bezelButton' />
          <span className='speakerGrill'>
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>

      {!waiting && !loadError && pageCount > 1 && (
        <nav
          className='dexPager'
          aria-label='Páginas'>
          <DPad
            onLeft={page > 1 ? () => goToPage(page - 1) : undefined}
            onRight={page < pageCount ? () => goToPage(page + 1) : undefined}
            labels={{left: 'Página anterior', right: 'Página siguiente'}}
          />
          <p
            className='lcd pagerLcd'
            aria-live='polite'>
            PÁG {String(page).padStart(2, '0')}/{String(pageCount).padStart(2, '0')}
          </p>
          <div className='pagerButtons'>
            <button
              type='button'
              className='dexButton dexButtonDark'
              onClick={() => goToPage(1)}
              disabled={page === 1}>
              Inicio
            </button>
            <button
              type='button'
              className='dexButton dexButtonDark'
              onClick={() => goToPage(pageCount)}
              disabled={page === pageCount}>
              Final
            </button>
          </div>
        </nav>
      )}
    </main>
  );
}

export default Home;
