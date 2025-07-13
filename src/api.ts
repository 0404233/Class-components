export default async function getApiInfo(searchInput: string) {
  const url = searchInput
    ? `https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase().trim()}`
    : 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';

  const response = await fetch(url);
  if (!response.ok) throw new Error('Nothing found for your request');
  return searchInput
    ? [await response.json()]
    : (await response.json()).results;
}
