import {useMemo} from 'react';
import useSWR from 'swr';
import {idFromUrl} from '../api/pokeapi';

// Solo especies (sin megas ni formas regionales); SWR comparte la caché entre páginas.
export function useSpeciesList() {
  const {data, error, isLoading, mutate} = useSWR('/pokemon-species?limit=2000');

  const species = useMemo(
    () => data?.results.map(({name, url}) => ({id: idFromUrl(url), name})) ?? [],
    [data],
  );

  return {species, total: data?.count ?? 0, error, isLoading, retry: () => mutate()};
}
