export function generateCsv(names: string[]) {
  const csvRows = names.map((name) => `"${name}"`);
  return csvRows.join('\n');
}
