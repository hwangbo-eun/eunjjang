(function registerTodoFilterDomain(namespace) {
  const filters = namespace.shared.constants.filters;

  function filterTodos(todos, filter) {
    if (filter === filters.active) {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === filters.completed) {
      return todos.filter((todo) => todo.completed);
    }

    return todos.slice();
  }

  function countTodos(todos) {
    const active = todos.filter((todo) => !todo.completed).length;
    const completed = todos.length - active;

    return {
      total: todos.length,
      active,
      completed,
    };
  }

  namespace.domain.todoFilter = {
    filterTodos,
    countTodos,
  };
})(window.TodoApp);
