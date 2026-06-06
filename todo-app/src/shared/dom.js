(function registerDomHelpers(namespace) {
  function createElement(tagName, options = {}, children = []) {
    const element = document.createElement(tagName);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined && options.text !== null) {
      element.textContent = options.text;
    }

    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          element.setAttribute(key, String(value));
        }
      });
    }

    if (options.type) {
      element.type = options.type;
    }

    if (options.value !== undefined && options.value !== null) {
      element.value = options.value;
    }

    if (options.disabled !== undefined) {
      element.disabled = Boolean(options.disabled);
    }

    if (options.checked !== undefined) {
      element.checked = Boolean(options.checked);
    }

    function appendChildValue(child) {
      if (child === null || child === undefined || child === false) {
        return;
      }

      if (Array.isArray(child)) {
        child.forEach(appendChildValue);
        return;
      }

      element.append(
        child.nodeType ? child : document.createTextNode(String(child)),
      );
    }

    children.forEach(appendChildValue);

    return element;
  }

  function clearElement(element) {
    element.replaceChildren();
  }

  namespace.shared.createElement = createElement;
  namespace.shared.clearElement = clearElement;
})(window.TodoApp);
