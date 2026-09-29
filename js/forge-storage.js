// Forge's application data is session-only until it is loaded from Supabase.
// Supabase remains the persistent source of truth; this adapter exists so the
// existing synchronous UI code can continue to read and write during startup.
(() => {
  const values = new Map();

  window.forgeStorage = {
    onChange: null,

    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },

    setItem(key, value) {
      values.set(String(key), String(value));
      this.onChange?.(String(key));
    },

    removeItem(key) {
      const normalizedKey = String(key);
      values.delete(normalizedKey);
      this.onChange?.(normalizedKey);
    },

    clear() {
      values.clear();
      this.onChange?.(null);
    },
  };
})();
