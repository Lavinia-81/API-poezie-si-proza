// src/utils/cache.js

// Maximum items allowed in each cache (prevents memory DoS)
const MAX_ITEMS = 500;

// Helper to enforce cache limits
function enforceLimit(map) {
  if (map.size > MAX_ITEMS) {
    // delete oldest entry
    const firstKey = map.keys().next().value;
    map.delete(firstKey);
  }
}

export const cache = {
  autoriData: new Map(),
  poezieText: new Map(),
  prozaText: new Map(),
  bibliografieText: new Map(),
  pozaAutor: new Map(),

  set(mapName, key, value) {
    const map = this[mapName];
    if (!map) return;

    // Prevent caching extremely large objects
    if (JSON.stringify(value).length > 2 * 1024 * 1024) {
      // > 2MB → too large
      return;
    }

    map.set(key, value);
    enforceLimit(map);
  },

  get(mapName, key) {
    const map = this[mapName];
    return map ? map.get(key) : null;
  }
};