(function registerTodoService(namespace) {
  const { createTodo, renameTodo, toggleTodo, assertValidTitle } =
    namespace.domain.todo;

  function createTodoService({
    repository,
    now = namespace.shared.createClock,
    idGenerator = namespace.shared.createId,
  }) {
    let todos = repository.loadAll();

    function persist() {
      repository.saveAll(todos);
    }

    function listTodos() {
      return todos.slice();
    }

    function addTodo(title) {
      const todo = createTodo({
        id: idGenerator(),
        title,
        now: now(),
      });

      todos = [todo, ...todos];
      persist();

      return todo;
    }

    function updateTodoTitle(id, title) {
      const index = todos.findIndex((todo) => todo.id === id);

      if (index === -1) {
        throw new Error("할 일을 찾을 수 없어요.");
      }

      const updatedTodo = renameTodo(todos[index], title, now());
      todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
      persist();

      return updatedTodo;
    }

    function toggleTodoCompletion(id) {
      const index = todos.findIndex((todo) => todo.id === id);

      if (index === -1) {
        throw new Error("할 일을 찾을 수 없어요.");
      }

      const updatedTodo = toggleTodo(todos[index], now());
      todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
      persist();

      return updatedTodo;
    }

    function deleteTodo(id) {
      const before = todos.length;
      todos = todos.filter((todo) => todo.id !== id);

      if (todos.length === before) {
        throw new Error("할 일을 찾을 수 없어요.");
      }

      persist();
    }

    function clearCompleted() {
      const before = todos.length;
      todos = todos.filter((todo) => !todo.completed);
      const removedCount = before - todos.length;

      if (removedCount > 0) {
        persist();
      }

      return removedCount;
    }

    function seedTodos(seed) {
      todos = Array.isArray(seed) ? seed.slice() : [];
      persist();
    }

    return {
      listTodos,
      addTodo,
      updateTodoTitle,
      toggleTodoCompletion,
      deleteTodo,
      clearCompleted,
      seedTodos,
      validateTitle: assertValidTitle,
    };
  }

  namespace.application.createTodoService = createTodoService;
})(window.TodoApp);
