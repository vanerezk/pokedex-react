import {useCallback, useEffect, useState} from 'react';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

// Voz de la Pokédex con la síntesis de voz del navegador.
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.voice =
      synth.getVoices().find((voice) => voice.lang === 'es-ES') ??
      synth.getVoices().find((voice) => voice.lang.startsWith('es')) ??
      null;
    utterance.rate = 1.02;
    utterance.pitch = 0.75;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    synth.speak(utterance);
  }, []);

  useEffect(() => stop, [stop]);

  return {speak, stop, speaking, supported: isSupported};
}
