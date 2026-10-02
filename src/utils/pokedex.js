import {localAsset} from '../api/pokeapi';

export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

const TYPE_LABELS = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

export const TYPE_COLORS = {
  normal: '#9099a1',
  fire: '#e8803a',
  water: '#4d90d5',
  electric: '#e9c51c',
  grass: '#4fae4a',
  ice: '#5ac4b7',
  fighting: '#ce4069',
  poison: '#a864c7',
  ground: '#d97845',
  flying: '#8fa8dd',
  psychic: '#f66f71',
  bug: '#90c12c',
  rock: '#b9a671',
  ghost: '#5269ac',
  dragon: '#0a6dc4',
  dark: '#5a5366',
  steel: '#5a8ea1',
  fairy: '#ec8fe6',
};

export const typeLabel = (type) => TYPE_LABELS[type] ?? formatName(type);
export const typeIcon = (type) => localAsset(`images/${type}.png`);

export const REGIONS = [
  {id: 'kanto', label: 'Kanto', from: 1, to: 151},
  {id: 'johto', label: 'Johto', from: 152, to: 251},
  {id: 'hoenn', label: 'Hoenn', from: 252, to: 386},
  {id: 'sinnoh', label: 'Sinnoh', from: 387, to: 493},
  {id: 'teselia', label: 'Teselia', from: 494, to: 649},
  {id: 'kalos', label: 'Kalos', from: 650, to: 721},
  {id: 'alola', label: 'Alola', from: 722, to: 809},
  {id: 'galar', label: 'Galar y Hisui', from: 810, to: 905},
  {id: 'paldea', label: 'Paldea', from: 906, to: 1025},
];

export const regionForId = (id) => REGIONS.find((region) => id >= region.from && id <= region.to);

const SPECIAL_NAMES = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'mr-rime': 'Mr. Rime',
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  'type-null': 'Código Cero',
  flabebe: 'Flabébé',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'wo-chien': 'Wo-Chien',
  'chien-pao': 'Chien-Pao',
  'ting-lu': 'Ting-Lu',
  'chi-yu': 'Chi-Yu',
};

export function formatName(slug = '') {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const formatNumber = (id) => `Nº ${String(id).padStart(4, '0')}`;

export const normalizeText = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

// Busca el texto en el idioma pedido dentro de las listas multilingües de la PokéAPI.
export const pickLanguage = (entries = [], language = 'es') =>
  entries.find((entry) => entry.language.name === language);

export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

export const HABITAT_LABELS = {
  cave: 'Cueva',
  forest: 'Bosque',
  grassland: 'Pradera',
  mountain: 'Montaña',
  rare: 'Raro',
  'rough-terrain': 'Terreno agreste',
  sea: 'Mar',
  urban: 'Ciudad',
  'waters-edge': 'Orilla del agua',
};

export const VERSION_LABELS = {
  red: 'Rojo',
  blue: 'Azul',
  yellow: 'Amarillo',
  gold: 'Oro',
  silver: 'Plata',
  crystal: 'Cristal',
  ruby: 'Rubí',
  sapphire: 'Zafiro',
  emerald: 'Esmeralda',
  firered: 'Rojo Fuego',
  leafgreen: 'Verde Hoja',
  diamond: 'Diamante',
  pearl: 'Perla',
  platinum: 'Platino',
  heartgold: 'Oro HeartGold',
  soulsilver: 'Plata SoulSilver',
  black: 'Negro',
  white: 'Blanco',
  'black-2': 'Negro 2',
  'white-2': 'Blanco 2',
  x: 'X',
  y: 'Y',
  'omega-ruby': 'Rubí Omega',
  'alpha-sapphire': 'Zafiro Alfa',
  sun: 'Sol',
  moon: 'Luna',
  'ultra-sun': 'Ultrasol',
  'ultra-moon': 'Ultraluna',
  'lets-go-pikachu': "Let's Go, Pikachu!",
  'lets-go-eevee': "Let's Go, Eevee!",
  sword: 'Espada',
  shield: 'Escudo',
  'legends-arceus': 'Leyendas: Arceus',
  scarlet: 'Escarlata',
  violet: 'Púrpura',
};

export const versionLabel = (version) => VERSION_LABELS[version] ?? formatName(version);

// Del más antiguo al más reciente, para elegir el aprendizaje de movimientos más actual.
export const VERSION_GROUPS = [
  {id: 'red-blue', label: 'Rojo / Azul'},
  {id: 'yellow', label: 'Amarillo'},
  {id: 'gold-silver', label: 'Oro / Plata'},
  {id: 'crystal', label: 'Cristal'},
  {id: 'ruby-sapphire', label: 'Rubí / Zafiro'},
  {id: 'emerald', label: 'Esmeralda'},
  {id: 'firered-leafgreen', label: 'Rojo Fuego / Verde Hoja'},
  {id: 'diamond-pearl', label: 'Diamante / Perla'},
  {id: 'platinum', label: 'Platino'},
  {id: 'heartgold-soulsilver', label: 'HeartGold / SoulSilver'},
  {id: 'black-white', label: 'Negro / Blanco'},
  {id: 'black-2-white-2', label: 'Negro 2 / Blanco 2'},
  {id: 'x-y', label: 'X / Y'},
  {id: 'omega-ruby-alpha-sapphire', label: 'Rubí Omega / Zafiro Alfa'},
  {id: 'sun-moon', label: 'Sol / Luna'},
  {id: 'ultra-sun-ultra-moon', label: 'Ultrasol / Ultraluna'},
  {id: 'lets-go-pikachu-lets-go-eevee', label: "Let's Go"},
  {id: 'sword-shield', label: 'Espada / Escudo'},
  {id: 'brilliant-diamond-shining-pearl', label: 'Diamante Brillante / Perla Reluciente'},
  {id: 'legends-arceus', label: 'Leyendas: Arceus'},
  {id: 'scarlet-violet', label: 'Escarlata / Púrpura'},
];

export const DAMAGE_CLASS_LABELS = {
  physical: 'Físico',
  special: 'Especial',
  status: 'Estado',
};

const ROMAN_GENERATIONS = {i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9};
export const generationNumber = (generationName = '') =>
  ROMAN_GENERATIONS[generationName.replace('generation-', '')] ?? '?';

// Tabla de tipos (6.ª generación en adelante): atacante → multiplicadores sobre el defensor.
const TYPE_CHART = {
  normal: {half: ['rock', 'steel'], zero: ['ghost']},
  fire: {double: ['grass', 'ice', 'bug', 'steel'], half: ['fire', 'water', 'rock', 'dragon']},
  water: {double: ['fire', 'ground', 'rock'], half: ['water', 'grass', 'dragon']},
  electric: {double: ['water', 'flying'], half: ['electric', 'grass', 'dragon'], zero: ['ground']},
  grass: {
    double: ['water', 'ground', 'rock'],
    half: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
  },
  ice: {double: ['grass', 'ground', 'flying', 'dragon'], half: ['fire', 'water', 'ice', 'steel']},
  fighting: {
    double: ['normal', 'ice', 'rock', 'dark', 'steel'],
    half: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    zero: ['ghost'],
  },
  poison: {double: ['grass', 'fairy'], half: ['poison', 'ground', 'rock', 'ghost'], zero: ['steel']},
  ground: {
    double: ['fire', 'electric', 'poison', 'rock', 'steel'],
    half: ['grass', 'bug'],
    zero: ['flying'],
  },
  flying: {double: ['grass', 'fighting', 'bug'], half: ['electric', 'rock', 'steel']},
  psychic: {double: ['fighting', 'poison'], half: ['psychic', 'steel'], zero: ['dark']},
  bug: {
    double: ['grass', 'psychic', 'dark'],
    half: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
  },
  rock: {double: ['fire', 'ice', 'flying', 'bug'], half: ['fighting', 'ground', 'steel']},
  ghost: {double: ['psychic', 'ghost'], half: ['dark'], zero: ['normal']},
  dragon: {double: ['dragon'], half: ['steel'], zero: ['fairy']},
  dark: {double: ['psychic', 'ghost'], half: ['fighting', 'dark', 'fairy']},
  steel: {double: ['ice', 'rock', 'fairy'], half: ['fire', 'water', 'electric', 'steel']},
  fairy: {double: ['fighting', 'dragon', 'dark'], half: ['fire', 'poison', 'steel']},
};

function attackMultiplier(attackingType, defendingType) {
  const chart = TYPE_CHART[attackingType];
  if (chart.zero?.includes(defendingType)) return 0;
  if (chart.double?.includes(defendingType)) return 2;
  if (chart.half?.includes(defendingType)) return 0.5;
  return 1;
}

// Devuelve los tipos atacantes agrupados por multiplicador contra la combinación defensora.
export function getTypeMatchups(defendingTypes) {
  const groups = {4: [], 2: [], 0.5: [], 0.25: [], 0: []};

  POKEMON_TYPES.forEach((attackingType) => {
    const multiplier = defendingTypes.reduce(
      (total, defendingType) => total * attackMultiplier(attackingType, defendingType),
      1,
    );
    groups[multiplier]?.push(attackingType);
  });

  return groups;
}

const ITEM_LABELS = {
  'fire-stone': 'Piedra Fuego',
  'water-stone': 'Piedra Agua',
  'thunder-stone': 'Piedra Trueno',
  'leaf-stone': 'Piedra Hoja',
  'moon-stone': 'Piedra Lunar',
  'sun-stone': 'Piedra Solar',
  'shiny-stone': 'Piedra Día',
  'dusk-stone': 'Piedra Noche',
  'dawn-stone': 'Piedra Alba',
  'ice-stone': 'Piedra Hielo',
  'oval-stone': 'Piedra Oval',
  'kings-rock': 'Roca del Rey',
  'metal-coat': 'Revestimiento Metálico',
  'dragon-scale': 'Escamadragón',
  'up-grade': 'Mejora',
  'dubious-disc': 'Disco Extraño',
  protector: 'Protector',
  electirizer: 'Electrizador',
  magmarizer: 'Magmatizador',
  'reaper-cloth': 'Tela Terrible',
  'prism-scale': 'Escama Bella',
  'deep-sea-tooth': 'Diente Marino',
  'deep-sea-scale': 'Escama Marina',
  'razor-claw': 'Garra Afilada',
  'razor-fang': 'Colmillo Agudo',
  'linking-cord': 'Cordón Unión',
};

const itemLabel = (item) => ITEM_LABELS[item] ?? formatName(item);

const TIME_OF_DAY_LABELS = {day: 'de día', night: 'de noche', dusk: 'al atardecer'};

// Traduce los requisitos de evolución de la PokéAPI a una frase corta.
export function describeEvolution(detailsList = []) {
  const details = detailsList.find((entry) => entry.is_default) ?? detailsList[0];
  if (!details) return 'Evoluciona';

  const parts = [];

  switch (details.trigger?.name) {
    case 'level-up':
      parts.push(details.min_level ? `Nv. ${details.min_level}` : 'Subir de nivel');
      break;
    case 'use-item':
      parts.push(itemLabel(details.item?.name));
      break;
    case 'trade':
      parts.push('Intercambio');
      break;
    case 'shed':
      parts.push('Nv. 20 con hueco libre en el equipo');
      break;
    default:
      parts.push('Condición especial');
  }

  if (details.held_item) parts.push(`con ${itemLabel(details.held_item.name)}`);
  if (details.min_happiness) parts.push('con amistad alta');
  if (details.min_affection) parts.push('con mucho afecto');
  if (details.min_beauty) parts.push('con belleza alta');
  if (details.known_move) parts.push(`sabiendo ${formatName(details.known_move.name)}`);
  if (details.known_move_type) {
    parts.push(`con un movimiento tipo ${typeLabel(details.known_move_type.name)}`);
  }
  if (details.location) parts.push('en un lugar especial');
  if (TIME_OF_DAY_LABELS[details.time_of_day]) parts.push(TIME_OF_DAY_LABELS[details.time_of_day]);
  if (details.gender === 1) parts.push('(hembra)');
  if (details.gender === 2) parts.push('(macho)');
  if (details.needs_overworld_rain) parts.push('mientras llueve');
  if (details.turn_upside_down) parts.push('con la consola boca abajo');
  if (details.trade_species) parts.push(`por ${formatName(details.trade_species.name)}`);
  if (details.party_species) parts.push(`con ${formatName(details.party_species.name)} en el equipo`);
  if (details.relative_physical_stats === 1) parts.push('(Ataque > Defensa)');
  if (details.relative_physical_stats === -1) parts.push('(Ataque < Defensa)');
  if (details.relative_physical_stats === 0) parts.push('(Ataque = Defensa)');

  return parts.join(' ');
}
