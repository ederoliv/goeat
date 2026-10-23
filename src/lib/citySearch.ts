const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function levenshtein(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

// Higher is a better match; 0 means no match. Ignores case and accents and tolerates small typos.
function score(city: string, query: string): number {
  const name = normalize(city);
  if (name.startsWith(query)) return 1000 - name.length;
  if (name.split(/\s+/).some(word => word.startsWith(query))) return 800 - name.length;
  if (name.includes(query)) return 600 - name.length;

  // Typo tolerance: compare against the start of the name, e.g. "sao pualo" ~ "sao paulo".
  const distance = levenshtein(query, name.slice(0, query.length));
  const allowed = Math.floor(query.length / 4);
  return distance <= allowed ? 400 - distance * 10 - name.length : 0;
}

// The best `limit` registered cities for what the user typed. Empty query returns nothing.
export function searchCities(cities: string[], query: string, limit = 3): string[] {
  const q = normalize(query);
  if (!q) return [];
  return cities
    .map(city => ({ city, points: score(city, q) }))
    .filter(r => r.points > 0)
    .sort((a, b) => b.points - a.points || a.city.localeCompare(b.city))
    .slice(0, limit)
    .map(r => r.city);
}
