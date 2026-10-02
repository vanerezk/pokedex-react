import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import useSWR, {preload} from 'swr';
import {API_URL, artworkUrl, fetcher, idFromUrl, pixelSpriteUrl} from '../api/pokeapi';
import {useDexProgress} from '../hooks/DexProgressContext';
import {useSpeciesList} from '../hooks/useSpeciesList';
import {useSpeech} from '../hooks/useSpeech';
import {DPad, DexLights, PokeballIcon, SpeakerIcon} from '../components/DexParts/DexParts';
import EvolutionTree from '../components/EvolutionTree/EvolutionTree';
import Loader from '../components/Loader/Loader';
import MoveList from '../components/MoveList/MoveList';
import NotFound from '../components/NotFound';
import TypeBadge from '../components/TypeBadge/TypeBadge';
import TypeMatchups from '../components/TypeMatchups/TypeMatchups';
import {
  HABITAT_LABELS,
  STAT_LABELS,
  TYPE_COLORS,
  formatName,
  formatNumber,
  generationNumber,
  pickLanguage,
  regionForId,
  versionLabel,
} from '../utils/pokedex';
import './Detail.css';

const TABS = [
  {id: 'info', label: 'Info'},
  {id: 'stats', label: 'Stats'},
  {id: 'types', label: 'Tipos'},
  {id: 'evolution', label: 'Evolución'},
  {id: 'moves', label: 'Movim.'},
  {id: 'forms', label: 'Formas'},
];

const formatMeasure = (value) => (value / 10).toLocaleString('es-ES', {maximumFractionDigits: 1});

const cleanFlavorText = (text) =>
  text
    .replace(/[\n\f\r­]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const statColor = (value) => {
  if (value < 50) return '#d9482f';
  if (value < 80) return '#e8962c';
  if (value < 100) return '#cdb81f';
  if (value < 130) return '#3fa64a';
  return '#1d8f88';
};

// Agrupa los juegos que comparten la misma entrada de la Pokédex.
function useFlavorEntries(species) {
  return useMemo(() => {
    const all = species.flavor_text_entries ?? [];
    const language = all.some((entry) => entry.language.name === 'es') ? 'es' : 'en';
    const byText = new Map();

    all
      .filter((entry) => entry.language.name === language)
      .forEach((entry) => {
        const text = cleanFlavorText(entry.flavor_text);
        byText.set(text, [...(byText.get(text) ?? []), entry.version.name]);
      });

    return {
      language,
      entries: [...byText].map(([text, versions]) => ({
        text,
        label: versions.map(versionLabel).join(' / '),
      })),
    };
  }, [species]);
}

function Ability({ability, hidden}) {
  const {data} = useSWR(ability.url);
  const name = pickLanguage(data?.names)?.name ?? formatName(ability.name);
  const description = cleanFlavorText(
    (data?.flavor_text_entries ?? []).filter((entry) => entry.language.name === 'es').at(-1)
      ?.flavor_text ?? '',
  );

  return (
    <li>
      <strong>{name}</strong>
      {hidden && <span className='abilityHidden'> (oculta)</span>}
      {description && <span className='abilityDescription'>{description}</span>}
    </li>
  );
}

function StatsPanel({stats}) {
  const total = stats.reduce((sum, {base_stat}) => sum + base_stat, 0);

  return (
    <div className='statsPanel'>
      {stats.map(({stat, base_stat}) => (
        <div
          className='statRow'
          key={stat.name}>
          <span className='statName'>{STAT_LABELS[stat.name] ?? formatName(stat.name)}</span>
          <span className='statValue'>{base_stat}</span>
          <span
            className='statTrack'
            role='meter'
            aria-label={STAT_LABELS[stat.name] ?? stat.name}
            aria-valuemin='0'
            aria-valuemax='255'
            aria-valuenow={base_stat}>
            <span
              style={{
                width: `${Math.min((base_stat / 200) * 100, 100)}%`,
                '--stat-color': statColor(base_stat),
              }}
            />
          </span>
        </div>
      ))}
      <div className='statRow statTotal'>
        <span className='statName'>Total</span>
        <span className='statValue'>{total}</span>
      </div>
    </div>
  );
}

function FormsPanel({varieties, currentName}) {
  return (
    <ul className='formsGrid'>
      {varieties.map(({pokemon: variety}) => {
        const id = idFromUrl(variety.url);
        const isCurrent = variety.name === currentName;

        return (
          <li key={variety.name}>
            <Link
              className={`formCard${isCurrent ? ' isCurrent' : ''}`}
              to={`/pokemon/${variety.name}`}
              replace
              aria-current={isCurrent ? 'page' : undefined}>
              <img
                src={artworkUrl(id)}
                alt=''
                loading='lazy'
                onError={(event) => {
                  if (event.currentTarget.dataset.fallback) return;
                  event.currentTarget.dataset.fallback = 'true';
                  event.currentTarget.src = pixelSpriteUrl(id);
                }}
              />
              <span>{formatName(variety.name)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function DexDetail({pokemon, species, chain, tab, setTab, linkSuffix, prev, next, onPrev, onNext}) {
  const navigate = useNavigate();
  const {speak, stop, speaking, supported: speechSupported} = useSpeech();
  const {caught, toggleCaught, autoVoice, toggleAutoVoice} = useDexProgress();
  const {language, entries} = useFlavorEntries(species);
  const [entryIndex, setEntryIndex] = useState(entries.length - 1);
  const [shiny, setShiny] = useState(false);
  const [pixel, setPixel] = useState(false);
  const [captureNote, setCaptureNote] = useState('');
  const audioRef = useRef(null);

  const speciesId = species.id;
  const name = pickLanguage(species.names)?.name ?? formatName(species.name);
  const formLabel = pokemon.is_default
    ? null
    : formatName(pokemon.name.replace(`${species.name}-`, ''));
  const genus =
    pickLanguage(species.genera)?.genus ?? pickLanguage(species.genera, 'en')?.genus ?? '';
  const japaneseName =
    pickLanguage(species.names, 'ja-Hrkt')?.name ?? pickLanguage(species.names, 'ja')?.name;
  const roomaji = pickLanguage(species.names, 'roomaji')?.name;
  const types = pokemon.types.map(({type}) => type.name);
  const entry = entries[entryIndex];
  const isCaught = caught.has(speciesId);
  const region = regionForId(speciesId);
  const visibleTabs = TABS.filter(({id}) => id !== 'forms' || species.varieties.length > 1);

  const artwork = pokemon.sprites.other?.['official-artwork'];
  const showdown = pokemon.sprites.other?.showdown;
  const pixelDefault = showdown?.front_default ?? pokemon.sprites.front_default;
  const pixelShiny = showdown?.front_shiny ?? pokemon.sprites.front_shiny;
  const artDefault = artwork?.front_default ?? pokemon.sprites.front_default;
  const artShiny = artwork?.front_shiny ?? pokemon.sprites.front_shiny;
  const sprite = pixel
    ? (shiny ? pixelShiny : pixelDefault) ?? pixelDefault
    : (shiny ? artShiny : artDefault) ?? artDefault;

  const playCry = useCallback(
    (url = pokemon.cries?.latest ?? pokemon.cries?.legacy) =>
      new Promise((resolve) => {
        if (!url) return resolve();
        audioRef.current?.pause();
        const audio = new Audio(url);
        audio.volume = 0.4;
        audio.onended = resolve;
        audio.onerror = resolve;
        audioRef.current = audio;
        audio.play().catch(resolve);
      }),
    [pokemon.cries],
  );

  const entrySpeech = `${name}. ${genus}. ${language === 'es' ? entry?.text ?? '' : ''}`;
  const readEntry = () => (speaking ? stop() : speak(entrySpeech));

  // Al abrir la ficha con «Auto voz»: grito y después la entrada, como en el anime.
  useEffect(() => {
    if (!autoVoice) return undefined;
    let cancelled = false;
    playCry().then(() => {
      if (!cancelled) speak(entrySpeech);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir la ficha
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  useEffect(() => {
    if (!captureNote) return undefined;
    const timer = setTimeout(() => setCaptureNote(''), 2200);
    return () => clearTimeout(timer);
  }, [captureNote]);

  const capture = () => {
    toggleCaught(speciesId);
    setCaptureNote(isCaught ? `${name} ya no está en tu colección.` : `¡${name} capturado!`);
  };

  const cycleTab = (step) => {
    const index = visibleTabs.findIndex(({id}) => id === tab);
    const nextIndex = (Math.max(index, 0) + step + visibleTabs.length) % visibleTabs.length;
    setTab(visibleTabs[nextIndex].id);
  };

  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));
  const activeTab = visibleTabs.some(({id}) => id === tab) ? tab : 'info';

  return (
    <main className='dex dexOpen'>
      <section
        className='dexHalf dexLeft'
        aria-label='Imagen y controles'>
        <div className='dexLeftTop'>
          <DexLights active={speaking} />
          <button
            type='button'
            className='dexButton backButton'
            onClick={goBack}>
            ◀ Lista
          </button>
        </div>

        <div className='screenBezel'>
          <div
            className='screenBezelDots'
            aria-hidden='true'>
            <span />
            <span />
          </div>
          <div
            className={`spriteScreen${pixel ? ' isPixel' : ''}`}
            style={{
              '--type-a': TYPE_COLORS[types[0]],
              '--type-b': TYPE_COLORS[types[1] ?? types[0]],
            }}>
            <span className='spriteNumber'>{formatNumber(speciesId)}</span>
            {shiny && <span className='spriteTag'>★ Variocolor</span>}
            {sprite && (
              <img
                key={sprite}
                className='spriteImage'
                src={sprite}
                alt={`${name}${formLabel ? ` (${formLabel})` : ''}${shiny ? ', variocolor' : ''}`}
              />
            )}
            <span
              className='scanLine'
              aria-hidden='true'
            />
          </div>
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

        <div className='leftControls'>
          <div className='cryControl'>
            <button
              type='button'
              className='cryButton'
              onClick={() => playCry()}
              disabled={!pokemon.cries?.latest && !pokemon.cries?.legacy}
              aria-label='Reproducir grito'
            />
            <span aria-hidden='true'>Grito</span>
          </div>
          <div className='pillButtons'>
            <button
              type='button'
              className='pillButton pillRed'
              aria-pressed={shiny}
              disabled={!artShiny && !pixelShiny}
              onClick={() => setShiny((current) => !current)}>
              Variocolor
            </button>
            <button
              type='button'
              className='pillButton pillBlue'
              aria-pressed={pixel}
              disabled={!pixelDefault}
              onClick={() => setPixel((current) => !current)}>
              Pixel
            </button>
          </div>
          <DPad
            onLeft={onPrev}
            onRight={onNext}
            onUp={() => cycleTab(-1)}
            onDown={() => cycleTab(1)}
            labels={{
              left: 'Pokémon anterior',
              right: 'Pokémon siguiente',
              up: 'Sección anterior',
              down: 'Sección siguiente',
            }}
          />
        </div>

        <div className='lcd miniLcd'>
          <span>{genus || 'Pokémon'}</span>
          <span>
            Alt. {formatMeasure(pokemon.height)} m · Peso {formatMeasure(pokemon.weight)} kg
          </span>
        </div>
      </section>

      <div
        className='dexHinge'
        aria-hidden='true'
      />

      <section
        className='dexHalf dexRight'
        aria-label='Datos de la Pokédex'>
        <div
          className='keyGrid'
          role='tablist'
          aria-label='Secciones'>
          {visibleTabs.map(({id, label}) => (
            <button
              key={id}
              id={`tab-${id}`}
              type='button'
              role='tab'
              className='blueKey'
              aria-selected={activeTab === id}
              aria-controls='dex-panel'
              onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className='lcd dataScreen'>
          <header className='dataHeader'>
            <div>
              <span className='dataNumber'>{formatNumber(speciesId)}</span>
              <h1 className='dataName'>
                {name}
                {formLabel && <small> {formLabel}</small>}
              </h1>
              <p className='dataGenus'>{genus}</p>
              {japaneseName && (
                <p className='dataJapanese'>
                  <span lang='ja'>{japaneseName}</span>
                  {roomaji && ` · ${roomaji}`}
                </p>
              )}
            </div>
            <div className='dataTypes'>
              {types.map((type) => (
                <TypeBadge
                  key={type}
                  type={type}
                />
              ))}
              {species.is_legendary && <span className='rarityTag'>Legendario</span>}
              {species.is_mythical && <span className='rarityTag'>Singular</span>}
              {species.is_baby && <span className='rarityTag'>Bebé</span>}
            </div>
          </header>

          <div
            id='dex-panel'
            className='dataPanel'
            role='tabpanel'
            aria-labelledby={`tab-${activeTab}`}
            key={activeTab}>
            {activeTab === 'info' && (
              <div className='infoPanel'>
                {entry ? (
                  <>
                    {entries.length > 1 && (
                      <label className='lcdField'>
                        <span>Entrada de</span>
                        <select
                          value={entryIndex}
                          onChange={(event) => setEntryIndex(Number(event.target.value))}>
                          {entries.map(({label}, index) => (
                            <option
                              key={label}
                              value={index}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <p className='entryText'>
                      {entry.text}
                      {language !== 'es' && (
                        <span className='lcdMuted'> (sin traducción al español)</span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className='lcdMuted'>Este Pokémon aún no tiene entrada en la Pokédex.</p>
                )}

                <dl className='infoGrid'>
                  <div>
                    <dt>Región</dt>
                    <dd>
                      {region?.label ?? '—'} · Gen. {generationNumber(species.generation?.name)}
                    </dd>
                  </div>
                  <div>
                    <dt>Hábitat</dt>
                    <dd>{HABITAT_LABELS[species.habitat?.name] ?? 'Desconocido'}</dd>
                  </div>
                  <div>
                    <dt>Género</dt>
                    <dd>
                      {species.gender_rate === -1
                        ? 'Sin género'
                        : `♂ ${100 - (species.gender_rate / 8) * 100}% · ♀ ${(species.gender_rate / 8) * 100}%`}
                    </dd>
                  </div>
                  <div>
                    <dt>Ratio de captura</dt>
                    <dd>{species.capture_rate} / 255</dd>
                  </div>
                </dl>

                <div>
                  <h2 className='panelTitle'>Habilidades</h2>
                  <ul className='abilityList'>
                    {pokemon.abilities.map(({ability, is_hidden}) => (
                      <Ability
                        key={ability.name}
                        ability={ability}
                        hidden={is_hidden}
                      />
                    ))}
                  </ul>
                </div>

                {pokemon.cries?.legacy && pokemon.cries.legacy !== pokemon.cries.latest && (
                  <button
                    type='button'
                    className='lcdButton'
                    onClick={() => playCry(pokemon.cries.legacy)}>
                    <SpeakerIcon /> Grito clásico (Game Boy)
                  </button>
                )}
              </div>
            )}
            {activeTab === 'stats' && <StatsPanel stats={pokemon.stats} />}
            {activeTab === 'types' && <TypeMatchups types={types} />}
            {activeTab === 'evolution' && (
              <EvolutionTree
                chain={chain?.chain}
                currentId={speciesId}
              />
            )}
            {activeTab === 'moves' && <MoveList moves={pokemon.moves} />}
            {activeTab === 'forms' && (
              <FormsPanel
                varieties={species.varieties}
                currentName={pokemon.name}
              />
            )}
          </div>
        </div>

        <div className='rightActions'>
          {speechSupported && (
            <button
              type='button'
              className='dexButton dexButtonYellow'
              onClick={readEntry}>
              <SpeakerIcon /> {speaking ? 'Detener voz' : 'Leer entrada'}
            </button>
          )}
          {speechSupported && (
            <button
              type='button'
              className='dexButton'
              aria-pressed={autoVoice}
              onClick={toggleAutoVoice}
              title='Reproduce el grito y lee la entrada al abrir cada ficha'>
              Auto voz {autoVoice ? 'ON' : 'OFF'}
            </button>
          )}
          <button
            type='button'
            className={`dexButton captureButton${isCaught ? ' isCaught' : ''}`}
            aria-pressed={isCaught}
            onClick={capture}>
            <PokeballIcon key={String(isCaught)} />
            {isCaught ? 'Capturado' : 'Capturar'}
          </button>
          <span
            className='captureNote'
            role='status'>
            {captureNote}
          </span>
        </div>

        <nav
          className='neighborNav'
          aria-label='Pokémon anterior y siguiente'>
          {prev ? (
            <Link
              className='neighborKey'
              to={`/pokemon/${prev.id}${linkSuffix}`}
              replace>
              <span aria-hidden='true'>◀</span> {formatNumber(prev.id)} {formatName(prev.name)}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              className='neighborKey neighborNext'
              to={`/pokemon/${next.id}${linkSuffix}`}
              replace>
              {formatNumber(next.id)} {formatName(next.name)} <span aria-hidden='true'>▶</span>
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}

function Detail() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('seccion') ?? 'info';
  const linkSuffix = tab === 'info' ? '' : `?seccion=${tab}`;
  const setTab = (nextTab) =>
    setParams(nextTab === 'info' ? {} : {seccion: nextTab}, {replace: true});
  const {species: speciesList, total} = useSpeciesList();
  const {markSeen} = useDexProgress();

  const pokemonRequest = useSWR(`/pokemon/${id.toLowerCase()}`);
  const pokemon = pokemonRequest.data;
  const speciesRequest = useSWR(pokemon?.species.url ?? null);
  const species = speciesRequest.data;
  const {data: chain} = useSWR(species?.evolution_chain?.url ?? null);
  const error = pokemonRequest.error ?? speciesRequest.error;
  const ready = pokemon && species && species.id === idFromUrl(pokemon.species.url);

  const speciesId = ready ? species.id : null;
  const lastId = total || 1025;
  const prev = useMemo(
    () => (speciesId > 1 ? speciesList[speciesId - 2] ?? {id: speciesId - 1, name: ''} : null),
    [speciesId, speciesList],
  );
  const next = useMemo(
    () =>
      speciesId && speciesId < lastId
        ? speciesList[speciesId] ?? {id: speciesId + 1, name: ''}
        : null,
    [lastId, speciesId, speciesList],
  );

  const goTo = useCallback(
    (target) => target && navigate(`/pokemon/${target.id}${linkSuffix}`, {replace: true}),
    [linkSuffix, navigate],
  );

  useEffect(() => {
    if (speciesId) markSeen(speciesId);
  }, [markSeen, speciesId]);

  // Precarga los vecinos para que la cruceta vaya al instante.
  useEffect(() => {
    [prev?.id, next?.id].filter(Boolean).forEach((neighborId) => {
      preload(`/pokemon/${neighborId}`, fetcher);
      preload(`${API_URL}/pokemon-species/${neighborId}/`, fetcher);
    });
  }, [prev?.id, next?.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest?.('input, select, textarea, [role="tab"]')) return;
      if (event.key === 'ArrowLeft') goTo(prev);
      if (event.key === 'ArrowRight') goTo(next);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, next, prev]);

  if (error?.status === 404) {
    return <NotFound message='Ese Pokémon no está registrado en la Pokédex.' />;
  }

  if (error || !ready) {
    return (
      <main className='dex'>
        <div className='dexTopBar'>
          <Link
            to='/'
            className='dexBrand'
            aria-label='Volver a la Pokédex'>
            <DexLights />
            <span className='dexTitle'>Pokédex</span>
          </Link>
        </div>
        <div
          className='screenBezel'
          style={{marginTop: 20}}>
          {error ? (
            <div className='lcd detailError'>
              <p role='alert'>No se pudo cargar la ficha. Revisa tu conexión.</p>
              <button
                type='button'
                className='dexButton dexButtonYellow'
                onClick={() => {
                  pokemonRequest.mutate();
                  speciesRequest.mutate();
                }}>
                Reintentar
              </button>
            </div>
          ) : (
            <Loader label='Cargando' />
          )}
        </div>
      </main>
    );
  }

  return (
    <DexDetail
      key={pokemon.name}
      pokemon={pokemon}
      species={species}
      chain={chain}
      tab={tab}
      setTab={setTab}
      linkSuffix={linkSuffix}
      prev={prev}
      next={next}
      onPrev={prev ? () => goTo(prev) : undefined}
      onNext={next ? () => goTo(next) : undefined}
    />
  );
}

export default Detail;
