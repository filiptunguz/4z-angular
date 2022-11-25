export function invertMap<K, V>(map: Map<K, V>): Map<V, K> {
  const invertedMap = new Map<V, K>();
  map.forEach((property, param) => invertedMap.set(property, param));

  return invertedMap;
}
