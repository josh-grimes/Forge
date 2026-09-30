// Forge storage keeps a synchronous cache for the current UI while mirroring
// durable values into IndexedDB. Namespaces prevent anonymous and account data
// from sharing the same browser keys.
(() => {
  const DB_NAME = "forge-storage";
  const STORE_NAME = "values";
  const LEGACY_PREFIX = "forge-";
  const NAMESPACED_PREFIX = "forge:";
  const memoryValues = new Map();
  const forgeKey = (key) => String(key).startsWith(LEGACY_PREFIX);
  let namespace = "anonymous";
  let localStorageRef = null;
  let databasePromise = null;
  let writeQueue = Promise.resolve();

  try {
    const candidate = window.localStorage;
    const probeKey = "__forge_storage_probe__";
    candidate.setItem(probeKey, "1");
    candidate.removeItem(probeKey);
    localStorageRef = candidate;
  } catch (_) {}

  function namespacedKey(key, selectedNamespace = namespace) {
    return `${NAMESPACED_PREFIX}${selectedNamespace}:${String(key)}`;
  }

  function migrateLegacyStorage() {
    if (!localStorageRef) return;
    try {
      const legacy = [];
      for (let index = 0; index < localStorageRef.length; index += 1) {
        const key = localStorageRef.key(index);
        if (key && forgeKey(key) && !key.startsWith(NAMESPACED_PREFIX))
          legacy.push([key, localStorageRef.getItem(key)]);
      }
      legacy.forEach(([key, value]) => {
        if (value !== null)
          localStorageRef.setItem(namespacedKey(key, "anonymous"), value);
        localStorageRef.removeItem(key);
      });
    } catch (_) {}
  }

  function loadLocalNamespace(selectedNamespace) {
    memoryValues.clear();
    if (!localStorageRef) return;
    const prefix = `${NAMESPACED_PREFIX}${selectedNamespace}:`;
    try {
      for (let index = 0; index < localStorageRef.length; index += 1) {
        const key = localStorageRef.key(index);
        if (!key || !key.startsWith(prefix)) continue;
        const logicalKey = key.slice(prefix.length);
        const value = localStorageRef.getItem(key);
        if (value !== null) memoryValues.set(logicalKey, value);
      }
    } catch (_) {}
  }

  function openDatabase() {
    if (databasePromise) return databasePromise;
    if (!window.indexedDB) return Promise.resolve(null);
    databasePromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(STORE_NAME))
            request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
    return databasePromise;
  }

  async function hydrateNamespace(selectedNamespace) {
    const database = await openDatabase();
    if (!database || selectedNamespace !== namespace) return;
    await new Promise((resolve) => {
      try {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const request = transaction.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => {
          const prefix = `${selectedNamespace}\u0000`;
          request.result
            .filter((record) => record.id.startsWith(prefix))
            .forEach((record) => memoryValues.set(record.key, record.value));
          resolve();
        };
        request.onerror = resolve;
      } catch (_) {
        resolve();
      }
    });
    window.forgeStorage.onChange?.(null);
  }

  function queueDatabaseWrite(operation) {
    writeQueue = writeQueue
      .then(async () => {
        const database = await openDatabase();
        if (database) await operation(database);
      })
      .catch(() => {});
  }

  function mirrorValue(key, value) {
    if (localStorageRef) {
      try {
        localStorageRef.setItem(namespacedKey(key), value);
      } catch (_) {}
    }
    queueDatabaseWrite(
      (database) =>
        new Promise((resolve) => {
          const request = database
            .transaction(STORE_NAME, "readwrite")
            .objectStore(STORE_NAME)
            .put({ id: `${namespace}\u0000${key}`, namespace, key, value });
          request.onsuccess = request.onerror = resolve;
        }),
    );
  }

  function removeMirroredValue(key) {
    if (localStorageRef) {
      try {
        localStorageRef.removeItem(namespacedKey(key));
      } catch (_) {}
    }
    queueDatabaseWrite(
      (database) =>
        new Promise((resolve) => {
          const request = database
            .transaction(STORE_NAME, "readwrite")
            .objectStore(STORE_NAME)
            .delete(`${namespace}\u0000${key}`);
          request.onsuccess = request.onerror = resolve;
        }),
    );
  }

  function clearNamespace() {
    for (const key of memoryValues.keys()) removeMirroredValue(key);
    memoryValues.clear();
    if (localStorageRef) {
      const prefix = `${NAMESPACED_PREFIX}${namespace}:`;
      try {
        for (let index = localStorageRef.length - 1; index >= 0; index -= 1) {
          const key = localStorageRef.key(index);
          if (key?.startsWith(prefix)) localStorageRef.removeItem(key);
        }
      } catch (_) {}
    }
  }

  migrateLegacyStorage();
  loadLocalNamespace(namespace);
  void hydrateNamespace(namespace);

  window.forgeStorage = {
    onChange: null,
    persistent: Boolean(localStorageRef || window.indexedDB),
    backend: window.indexedDB ? "indexeddb" : localStorageRef ? "localstorage" : "memory",

    getItem(key) {
      return memoryValues.has(String(key)) ? memoryValues.get(String(key)) : null;
    },

    setItem(key, value) {
      const normalizedKey = String(key);
      const normalizedValue = String(value);
      memoryValues.set(normalizedKey, normalizedValue);
      mirrorValue(normalizedKey, normalizedValue);
      this.onChange?.(normalizedKey);
    },

    removeItem(key) {
      const normalizedKey = String(key);
      memoryValues.delete(normalizedKey);
      removeMirroredValue(normalizedKey);
      this.onChange?.(normalizedKey);
    },

    clear() {
      clearNamespace();
      this.onChange?.(null);
    },

    getGlobalItem(key) {
      try {
        return localStorageRef?.getItem(String(key)) ?? null;
      } catch (_) {
        return null;
      }
    },

    setGlobalItem(key, value) {
      try {
        localStorageRef?.setItem(String(key), String(value));
      } catch (_) {}
    },

    async setNamespace(nextNamespace) {
      namespace = String(nextNamespace || "anonymous");
      loadLocalNamespace(namespace);
      await hydrateNamespace(namespace);
      this.onChange?.(null);
    },

    getNamespace() {
      return namespace;
    },
  };
})();
