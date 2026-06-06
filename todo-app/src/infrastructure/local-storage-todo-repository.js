(function registerLocalStorageTodoRepository(namespace) {
  function normalizeStoredTodo(todo) {
    if (!todo || typeof todo !== "object") {
      return null;
    }

    if (typeof todo.id !== "string" || typeof todo.title !== "string") {
      return null;
    }

    return {
      id: todo.id,
      title: todo.title,
      completed: Boolean(todo.completed),
      createdAt: typeof todo.createdAt === "string" ? todo.createdAt : "",
      updatedAt: typeof todo.updatedAt === "string" ? todo.updatedAt : "",
    };
  }

  function createLocalStorageTodoRepository({
    storage = window.localStorage,
    storageKey = namespace.shared.constants.storageKey,
  } = {}) {
    function loadAll() {
      try {
        const raw = storage.getItem(storageKey);

        if (!raw) {
          return [];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
          return [];
        }

        return parsed.map(normalizeStoredTodo).filter(Boolean);
      } catch {
        return [];
      }
    }

    function saveAll(todos) {
      storage.setItem(storageKey, JSON.stringify(todos));
    }

    function clear() {
      storage.removeItem(storageKey);
    }

    return {
      loadAll,
      saveAll,
      clear,
    };
  }

  namespace.infrastructure.createLocalStorageTodoRepository =
    createLocalStorageTodoRepository;
})(window.TodoApp);
