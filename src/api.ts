export default async function getApiInfo(
  searchInput: string,
  offset: number = 0,
  limit: number = 10
) {
  const url = searchInput
    ? `https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase().trim()}`
    : `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || 'Nothing found for your request';
    throw new Error(message);
  }

  const data = await response.json();
  return searchInput ? [data] : data.results;
}
