(function registerTodoView(namespace) {
  const {
    createElement,
    clearElement,
    formatDateTime,
    constants,
  } = {
    createElement: namespace.shared.createElement,
    clearElement: namespace.shared.clearElement,
    formatDateTime: namespace.shared.formatDateTime,
    constants: namespace.shared.constants,
  };

  function createTodoView(root) {
    function render(state) {
      clearElement(root);

      const shell = createElement("main", { className: "app-shell" });

      const hero = createElement("section", { className: "hero" }, [
        createElement(
          "div",
          { className: "panel hero-card" },
          createHeroCopy(),
        ),
        createElement("div", { className: "panel hero-card" }, [
          createElement("div", { className: "hero-meta" }, [
            createMetric(state.counts.total, "Total"),
            createMetric(state.counts.active, "Active"),
            createMetric(state.counts.completed, "Completed"),
          ]),
        ]),
      ]);

      const workspace = createElement("section", {
        className: "panel workspace-card workspace",
      });

      workspace.append(
        createElement("div", { className: "workspace-top" }, [
          createElement("form", { className: "form-row", attrs: { "data-role": "add-form" } }, [
            createElement("input", {
              className: "field",
              type: "text",
              attrs: {
                "data-role": "new-todo-input",
                placeholder: "Write a new task",
                maxlength: "120",
                "aria-label": "새 할 일 입력",
              },
            }),
            createElement("button", {
              className: "primary-button",
              type: "submit",
              text: "+ Add",
            }),
          ]),
          createElement("button", {
            className: "secondary-button",
            type: "button",
            attrs: {
              "data-action": "clear-completed",
              disabled: state.counts.completed === 0 ? "disabled" : null,
            },
            text: "Clear completed",
          }),
        ]),
      );

      const toolbar = createElement("div", { className: "toolbar" }, [
        createElement("div", { className: "segmented", attrs: { role: "tablist", "aria-label": "필터" } }, [
          createFilterButton("All", constants.filters.all, state.filter),
          createFilterButton("Active", constants.filters.active, state.filter),
          createFilterButton("Done", constants.filters.completed, state.filter),
        ]),
        createElement("div", { className: "notice " + noticeClassName(state.notice), attrs: { "aria-live": "polite" }, text: (state.notice && state.notice.message) || "Add a task, and keep the flow moving." }),
      ]);

      const listCard = createElement("section", { className: "panel list-card" });
      const listHead = createElement("div", { className: "list-head" }, [
        createElement("div", {}, [
          createElement("h2", { className: "list-title", text: "Tasks" }),
          createElement("p", {
            className: "list-count",
            text: listSummary(state),
          }),
        ]),
      ]);

      const list = createElement("ul", {
        className: "todo-list",
        attrs: { "data-role": "todo-list" },
      });

      if (state.visibleTodos.length === 0) {
        list.append(
          createElement("li", { className: "empty-state", text: emptyStateText(state.filter) }),
        );
      } else {
        state.visibleTodos.forEach((todo) => {
          list.append(createTodoItem(todo, state));
        });
      }

      const footer = createElement("footer", { className: "footer" }, [
        createElement("p", {
          text: "Stored locally in your browser.",
        }),
        createElement("p", {
          text: "Last updated: " + (state.lastUpdated ? formatDateTime(state.lastUpdated) : "just now"),
        }),
      ]);

      listCard.append(listHead, list);
      shell.append(hero, workspace, toolbar, listCard, footer);
      root.append(shell);
    }

    function createHeroCopy() {
      return [
        createElement("p", { className: "eyebrow", text: "Task flow" }),
        createElement("h1", { className: "title", text: "To-Do App" }),
        createElement("p", {
          className: "subtitle",
          text: "A clean, extensible task manager with local persistence and a layered architecture.",
        }),
      ];
    }

    function createMetric(value, label) {
      return createElement("div", { className: "metric" }, [
        createElement("span", { className: "metric-value", text: String(value) }),
        createElement("span", { className: "metric-label", text: label }),
      ]);
    }

    function createFilterButton(label, filterValue, currentFilter) {
      return createElement("button", {
        className: `segment ${filterValue === currentFilter ? "is-active" : ""}`,
        type: "button",
        attrs: {
          "data-action": "set-filter",
          "data-filter": filterValue,
          role: "tab",
          "aria-selected": String(filterValue === currentFilter),
        },
        text: label,
      });
    }

    function createTodoItem(todo, state) {
      const isEditing = state.editingId === todo.id;
      const item = createElement("li", {
        className: `todo-item ${todo.completed ? "is-complete" : ""}`,
        attrs: { "data-id": todo.id },
      });

      const toggleLabel = createElement("label", { className: "todo-toggle" }, [
        createElement("input", {
          type: "checkbox",
          attrs: {
            "data-action": "toggle",
            "data-id": todo.id,
            "aria-label": `${todo.completed ? "Mark active" : "Mark complete"}: ${todo.title}`,
          },
          checked: todo.completed,
        }),
        createElement("span", { className: "box", text: "✓" }),
      ]);

      const content = isEditing
        ? createElement("form", {
            className: "todo-editor",
            attrs: { "data-action": "save-edit", "data-id": todo.id },
          }, [
            createElement("input", {
              className: "field",
              type: "text",
              value: state.editDraft,
              attrs: {
                "data-role": "edit-input",
                maxlength: "120",
                "aria-label": "할 일 수정",
              },
            }),
            createElement("div", { className: "editor-actions" }, [
              createElement("button", {
                className: "primary-button",
                type: "submit",
                text: "Save",
              }),
              createElement("button", {
                className: "secondary-button",
                type: "button",
                attrs: {
                  "data-action": "cancel-edit",
                  "data-id": todo.id,
                },
                text: "Cancel",
              }),
            ]),
          ])
        : createElement("div", { className: "todo-copy" }, [
            createElement("p", { className: "todo-title", text: todo.title }),
            createElement("p", {
              className: "todo-meta",
              text: `Created ${formatDateTime(todo.createdAt)}${todo.updatedAt !== todo.createdAt ? ` · Updated ${formatDateTime(todo.updatedAt)}` : ""}`,
            }),
          ]);

      const actions = isEditing
        ? createElement("div", { className: "todo-actions" })
        : createElement("div", { className: "todo-actions" }, [
            createElement("button", {
              className: "secondary-button",
              type: "button",
              attrs: {
                "data-action": "edit",
                "data-id": todo.id,
              },
              text: "Edit",
            }),
            createElement("button", {
              className: "danger-button",
              type: "button",
              attrs: {
                "data-action": "delete",
                "data-id": todo.id,
              },
              text: "Delete",
            }),
          ]);

      item.append(toggleLabel, content, actions);
      return item;
    }

    function listSummary(state) {
      const total = state.counts.total;
      const active = state.counts.active;
      const filterLabel =
        state.filter === constants.filters.active
          ? "Active"
          : state.filter === constants.filters.completed
            ? "Completed"
            : "All";

      return `${total} total · ${active} active · ${filterLabel} view`;
    }

    function noticeClassName(notice) {
      if (!notice) {
        return "is-info";
      }

      return notice.type === "error" ? "is-error" : "is-info";
    }

    function emptyStateText(filter) {
      if (filter === constants.filters.active) {
        return "No active tasks right now. Nice work.";
      }

      if (filter === constants.filters.completed) {
        return "Nothing completed yet. The list is still moving.";
      }

      return "There are no tasks yet. Add the first one above.";
    }

    return {
      render,
    };
  }

  namespace.presentation.createTodoView = createTodoView;
})(window.TodoApp);
