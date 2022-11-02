export function groupBy<O, K extends keyof any, V>(
  arr: O[],
  key: (origin: O) => K,
  value: (origin: O) => V
): Record<K, V[]> {
  return arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(value(item));
    return groups;
  }, {} as Record<K, V[]>);
}
