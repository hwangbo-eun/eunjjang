(function registerTodoDomain(namespace) {
  const { createClock } = namespace.shared;

  function normalizeTitle(title) {
    return String(title || "").replace(/\s+/g, " ").trim();
  }

  function assertValidTitle(title) {
    const normalized = normalizeTitle(title);

    if (!normalized) {
      throw new Error("할 일 제목을 입력해 주세요.");
    }

    if (normalized.length > 120) {
      throw new Error("할 일 제목은 120자 이하로 입력해 주세요.");
    }

    return normalized;
  }

  function createTodo({ id, title, now = createClock() }) {
    return {
      id,
      title: assertValidTitle(title),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  function renameTodo(todo, title, now = createClock()) {
    return {
      ...todo,
      title: assertValidTitle(title),
      updatedAt: now,
    };
  }

  function toggleTodo(todo, now = createClock()) {
    return {
      ...todo,
      completed: !todo.completed,
      updatedAt: now,
    };
  }

  function isTodoCompleted(todo) {
    return Boolean(todo.completed);
  }

  namespace.domain.todo = {
    createTodo,
    renameTodo,
    toggleTodo,
    normalizeTitle,
    assertValidTitle,
    isTodoCompleted,
  };
})(window.TodoApp);
