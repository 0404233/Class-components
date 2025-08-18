import type { Description } from '../types';

type Item = {
  name: string;
  description: Description | null;
};

type Props = {
  items: Item[];
};

export default async function getApiInfo(
  searchInput: string,
  offset = 0,
  limit = 10
): Promise<Props> {
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

    if (searchInput) {
      const item: Item = {
        name: data.name,
        description: {
          base_experience: data.base_experience,
          height: data.height,
          is_default: data.is_default,
          weight: data.weight,
        },
      };
      return { items: [item] };
    }

    const items: Item[] = await Promise.all(
      data.results.map(async (result: { name: string; url: string }) => {
        try {
          const res = await fetch(result.url);
          const detail = await res.json();
          return {
            name: result.name,
            description: {
              base_experience: detail.base_experience,
              height: detail.height,
              is_default: detail.is_default,
              weight: detail.weight,
            },
          };
        } catch {
          return { name: result.name, description: null };
        }
      })
    );

    return { items };
  } catch (error) {
    console.error('getApiInfo error:', error);
    throw error;
  }
}
