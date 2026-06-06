(function registerTodoController(namespace) {
  const { filters, messages } = namespace.shared.constants;
  const { filterTodos, countTodos } = namespace.domain.todoFilter;

  function createTodoController({ service, view, root }) {
    const state = {
      filter: filters.all,
      editingId: null,
      editDraft: "",
      focusNewInput: true,
      notice: {
        type: "info",
        message: "Add a task, and keep the flow moving.",
      },
      lastUpdated: null,
    };

    function syncAndRender() {
      const todos = service.listTodos();
      const counts = countTodos(todos);
      const visibleTodos = filterTodos(todos, state.filter);

      view.render({
        filter: state.filter,
        editingId: state.editingId,
        editDraft: state.editDraft,
        notice: state.notice,
        lastUpdated: state.lastUpdated,
        counts,
        visibleTodos,
      });

      if (state.editingId) {
        const schedule =
          typeof window.queueMicrotask === "function"
            ? window.queueMicrotask.bind(window)
            : (fn) => Promise.resolve().then(fn);

        schedule(() => {
          const input = root.querySelector('[data-role="edit-input"]');

          if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }
        });
      } else if (state.focusNewInput) {
        const schedule =
          typeof window.queueMicrotask === "function"
            ? window.queueMicrotask.bind(window)
            : (fn) => Promise.resolve().then(fn);

        schedule(() => {
          const input = root.querySelector('[data-role="new-todo-input"]');

          if (input) {
            input.focus();
          }

          state.focusNewInput = false;
        });
      }
    }

    function setNotice(message, type = "info") {
      state.notice = { message, type };
    }

    function beginEdit(id) {
      const todo = service.listTodos().find((item) => item.id === id);

      if (!todo) {
        setNotice("할 일을 찾을 수 없어요.", "error");
        state.editingId = null;
        state.editDraft = "";
        syncAndRender();
        return;
      }

      state.editingId = id;
      state.editDraft = todo.title;
      state.focusNewInput = false;
      setNotice("Edit the task, then save it.", "info");
      syncAndRender();
    }

    function cancelEdit() {
      state.editingId = null;
      state.editDraft = "";
      state.focusNewInput = false;
      setNotice("Edit cancelled.", "info");
      syncAndRender();
    }

    function handleAdd(form) {
      const input = form.querySelector('[data-role="new-todo-input"]');
      const title = input ? input.value : "";

      try {
        service.addTodo(title);
        state.lastUpdated = new Date().toISOString();
        setNotice(messages.addSuccess, "info");
        state.editingId = null;
        state.editDraft = "";
        state.focusNewInput = true;
        syncAndRender();
      } catch (error) {
        setNotice(error.message || "할 일을 추가하지 못했어요.", "error");
        syncAndRender();
        if (input) {
          input.focus();
        }
      }
    }

    function handleSaveEdit(form) {
      const id = form.dataset.id;

      try {
        service.updateTodoTitle(id, state.editDraft);
        state.lastUpdated = new Date().toISOString();
        state.editingId = null;
        state.editDraft = "";
        state.focusNewInput = false;
        setNotice(messages.updateSuccess, "info");
        syncAndRender();
      } catch (error) {
        setNotice(error.message || "할 일을 수정하지 못했어요.", "error");
        syncAndRender();
      }
    }

    function handleClick(event) {
      const actionTarget = event.target.closest("[data-action]");

      if (!actionTarget || !root.contains(actionTarget)) {
        return;
      }

      const action = actionTarget.dataset.action;
      const id = actionTarget.dataset.id;

      if (action === "set-filter") {
        state.filter = actionTarget.dataset.filter || filters.all;
        state.editingId = null;
        state.editDraft = "";
        state.focusNewInput = false;
        setNotice(
          state.filter === filters.all
            ? "Showing every task."
            : state.filter === filters.active
              ? "Showing active tasks."
              : "Showing completed tasks.",
          "info",
        );
        syncAndRender();
        return;
      }

      if (action === "clear-completed") {
        const removedCount = service.clearCompleted();
        state.lastUpdated = new Date().toISOString();
        state.editingId = null;
        state.editDraft = "";
        state.focusNewInput = false;
        setNotice(
          removedCount > 0
            ? messages.clearCompletedSuccess
            : "There were no completed tasks to clear.",
          removedCount > 0 ? "info" : "error",
        );
        syncAndRender();
        return;
      }

      if (action === "toggle") {
        try {
          service.toggleTodoCompletion(id);
          state.lastUpdated = new Date().toISOString();
          state.focusNewInput = false;
          setNotice(messages.toggleSuccess, "info");
          syncAndRender();
        } catch (error) {
          setNotice(error.message || "상태를 바꾸지 못했어요.", "error");
          syncAndRender();
        }
        return;
      }

      if (action === "edit") {
        beginEdit(id);
        return;
      }

      if (action === "cancel-edit") {
        cancelEdit();
        return;
      }

      if (action === "delete") {
        try {
          service.deleteTodo(id);
          state.lastUpdated = new Date().toISOString();
          state.focusNewInput = false;
          if (state.editingId === id) {
            state.editingId = null;
            state.editDraft = "";
          }
          setNotice(messages.deleteSuccess, "info");
          syncAndRender();
        } catch (error) {
          setNotice(error.message || "할 일을 삭제하지 못했어요.", "error");
          syncAndRender();
        }
      }
    }

    function handleSubmit(event) {
      const form = event.target;

      if (form.dataset.role === "add-form") {
        event.preventDefault();
        handleAdd(form);
      }

      if (form.dataset.action === "save-edit") {
        event.preventDefault();
        handleSaveEdit(form);
      }
    }

    function handleInput(event) {
      const target = event.target;

      if (target.dataset.role === "edit-input") {
        state.editDraft = target.value;
      }
    }

    function handleKeydown(event) {
      const target = event.target;

      if (target.dataset.role === "edit-input" && event.key === "Escape") {
        event.preventDefault();
        cancelEdit();
      }
    }

    function attach() {
      root.addEventListener("click", handleClick);
      root.addEventListener("submit", handleSubmit);
      root.addEventListener("input", handleInput);
      root.addEventListener("keydown", handleKeydown);
      syncAndRender();
    }

    return {
      attach,
    };
  }

  namespace.presentation.createTodoController = createTodoController;
})(window.TodoApp);
