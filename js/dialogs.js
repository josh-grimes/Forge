(function (root, factory) {
  const forgeDialogs = factory();
  if (typeof module === "object" && module.exports) module.exports = forgeDialogs;
  else root.ForgeDialogs = forgeDialogs;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const queue = [];
  let active = null;

  function rootElement() {
    return document.getElementById("forge-dialog-root");
  }

  function open(request) {
    queue.push(request);
    renderNext();
  }

  function renderNext() {
    if (active || !queue.length) return;
    active = queue.shift();
    const mount = rootElement();
    if (!mount) {
      active.resolve(active.type === "prompt" ? null : false);
      active = null;
      renderNext();
      return;
    }

    mount.hidden = false;
    mount.replaceChildren();
    const panel = document.createElement("section");
    panel.className = "forge-dialog-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "forge-dialog-title");

    const title = document.createElement("h2");
    title.id = "forge-dialog-title";
    title.textContent = active.title || (active.type === "confirm" ? "Confirm" : "Forge");
    const message = document.createElement("p");
    message.id = "forge-dialog-message";
    message.className = "forge-dialog-message";
    message.textContent = active.message;
    panel.setAttribute("aria-describedby", message.id);
    panel.append(title, message);

    let input = null;
    if (active.type === "prompt") {
      input = document.createElement("input");
      input.className = "text-input forge-dialog-input";
      input.type = "text";
      input.value = active.defaultValue || "";
      input.type = active.inputType || "text";
      input.autocomplete = "off";
      input.setAttribute("aria-label", active.inputLabel || "Value");
      panel.append(input);
    }

    const actions = document.createElement("div");
    actions.className = "forge-dialog-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "btn secondary";
    cancel.textContent = active.cancelLabel || "Cancel";
    cancel.hidden = active.type === "alert";
    const accept = document.createElement("button");
    accept.type = "button";
    accept.className = active.danger ? "btn danger" : "btn primary";
    accept.textContent = active.acceptLabel || "OK";
    actions.append(cancel, accept);
    panel.append(actions);
    mount.append(panel);

    const finish = (value) => {
      if (!active) return;
      const current = active;
      active = null;
      mount.hidden = true;
      mount.replaceChildren();
      document.body.classList.remove("forge-dialog-open");
      current.resolve(value);
      renderNext();
    };
    cancel.addEventListener("click", () =>
      finish(currentResult(active.type, false, null)),
    );
    accept.addEventListener("click", () =>
      finish(currentResult(active.type, true, input?.value ?? null)),
    );
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish(currentResult(active.type, false, null));
      } else if (event.key === "Enter" && active.type !== "alert") {
        event.preventDefault();
        finish(currentResult(active.type, true, input?.value ?? null));
      }
    });
    document.body.classList.add("forge-dialog-open");
    (input || accept).focus();
  }

  function currentResult(type, accepted, value) {
    if (type === "prompt") return accepted ? value : null;
    return type === "confirm" ? accepted : undefined;
  }

  function request(type, message, options = {}) {
    return new Promise((resolve) =>
      open({ type, message: String(message), resolve, ...options }),
    );
  }

  return {
    alert(message, options) {
      return request("alert", message, { acceptLabel: "OK", ...options });
    },
    confirm(message, options) {
      return request("confirm", message, { acceptLabel: "Continue", ...options });
    },
    prompt(message, defaultValue = "", options) {
      return request("prompt", message, { defaultValue, ...options });
    },
  };
});
