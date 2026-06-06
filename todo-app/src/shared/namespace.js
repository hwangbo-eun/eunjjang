(function initializeNamespace(global) {
  const existing = global.TodoApp || {};

  global.TodoApp = {
    shared: existing.shared || {},
    domain: existing.domain || {},
    infrastructure: existing.infrastructure || {},
    application: existing.application || {},
    presentation: existing.presentation || {},
  };
})(window);
