(function registerConstants(namespace) {
  namespace.shared.constants = {
    storageKey: "todo-app.todos.v1",
    filters: {
      all: "all",
      active: "active",
      completed: "completed",
    },
    messages: {
      addSuccess: "할 일을 추가했어요.",
      updateSuccess: "할 일을 수정했어요.",
      toggleSuccess: "상태를 바꿨어요.",
      deleteSuccess: "할 일을 삭제했어요.",
      clearCompletedSuccess: "완료된 할 일을 정리했어요.",
    },
  };
})(window.TodoApp);
