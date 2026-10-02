import './DexParts.css';

export function DexLights({active = false}) {
  return (
    <div
      className='dexLights'
      aria-hidden='true'>
      <span className={`dexLens${active ? ' isActive' : ''}`} />
      <span className='dexLed dexLedRed' />
      <span className='dexLed dexLedYellow' />
      <span className='dexLed dexLedGreen' />
    </div>
  );
}

export function DPad({onUp, onDown, onLeft, onRight, labels = {}}) {
  return (
    <div className='dPad'>
      <button
        type='button'
        className='dPadUp'
        onClick={onUp}
        disabled={!onUp}
        aria-label={labels.up ?? 'Arriba'}
      />
      <button
        type='button'
        className='dPadLeft'
        onClick={onLeft}
        disabled={!onLeft}
        aria-label={labels.left ?? 'Izquierda'}
      />
      <span
        className='dPadCenter'
        aria-hidden='true'
      />
      <button
        type='button'
        className='dPadRight'
        onClick={onRight}
        disabled={!onRight}
        aria-label={labels.right ?? 'Derecha'}
      />
      <button
        type='button'
        className='dPadDown'
        onClick={onDown}
        disabled={!onDown}
        aria-label={labels.down ?? 'Abajo'}
      />
    </div>
  );
}

export function SpeakerIcon() {
  return (
    <svg
      className='speakerIcon'
      viewBox='0 0 24 24'
      aria-hidden='true'>
      <path
        d='M3 9v6h4l5 4V5L7 9H3Z'
        fill='currentColor'
      />
      <path
        d='M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function PokeballIcon({filled = true, className = ''}) {
  return (
    <svg
      className={`pokeballIcon ${className}`}
      viewBox='0 0 24 24'
      aria-hidden='true'>
      <circle
        cx='12'
        cy='12'
        r='10.5'
        fill={filled ? '#fff' : 'none'}
        stroke='currentColor'
        strokeWidth='2'
      />
      {filled && (
        <path
          d='M1.5 12a10.5 10.5 0 0 1 21 0Z'
          fill='#e3350d'
        />
      )}
      <path
        d='M1.5 12h21'
        stroke='currentColor'
        strokeWidth='2'
      />
      <circle
        cx='12'
        cy='12'
        r='3.4'
        fill={filled ? '#fff' : 'none'}
        stroke='currentColor'
        strokeWidth='2'
      />
    </svg>
  );
}
