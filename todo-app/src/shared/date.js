(function registerDateHelpers(namespace) {
  function createClock() {
    return new Date().toISOString();
  }

  function formatDateTime(value, locale = "ko-KR") {
    if (!value) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    } catch {
      return new Date(value).toLocaleString(locale);
    }
  }

  namespace.shared.createClock = createClock;
  namespace.shared.formatDateTime = formatDateTime;
})(window.TodoApp);
