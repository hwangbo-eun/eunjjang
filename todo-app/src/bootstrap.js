(function bootstrap(namespace) {
  const root = document.getElementById("app");

  if (!root) {
    throw new Error("App root not found.");
  }

  document.title = "Todo App";

  const repository = namespace.infrastructure.createLocalStorageTodoRepository();
  const service = namespace.application.createTodoService({
    repository,
    now: namespace.shared.createClock,
    idGenerator: namespace.shared.createId,
  });
  const view = namespace.presentation.createTodoView(root);
  const controller = namespace.presentation.createTodoController({
    service,
    view,
    root,
  });

  controller.attach();
})(window.TodoApp);
