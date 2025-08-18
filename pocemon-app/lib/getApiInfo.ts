interface PokemonSummary {
  name: string;
  url: string;
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
}

export default async function getApiInfo(
  searchInput: string,
  offset = 0,
  limit = 10
): Promise<PokemonDetail[] | PokemonSummary[]> {
  const baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  const url = searchInput
    ? `${baseUrl}/${encodeURIComponent(searchInput.toLowerCase().trim())}`
    : `${baseUrl}?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Nothing found for your request';
      throw new Error(message);
    }

    const data = await response.json();

    const safeData = JSON.parse(JSON.stringify(data));

    return searchInput
      ? [safeData as PokemonDetail]
      : (safeData.results as PokemonSummary[]);
  } catch (error) {
    console.error('getApiInfo error:', error);
    throw error;
  }
}
