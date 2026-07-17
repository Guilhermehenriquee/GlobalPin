(function () {
  "use strict";

  const STORAGE_KEYS = {
    resetTokens: "espartano_reset_tokens",
    passwordOverrides: "espartano_password_overrides"
  };

  const token = new URLSearchParams(window.location.search).get("token");
  const resetForm = document.getElementById("resetForm");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer = 0;

  resetForm.addEventListener("submit", handleReset);

  function handleReset(event) {
    event.preventDefault();
    const tokens = readJson(STORAGE_KEYS.resetTokens, {});
    const record = tokens[token];

    clearInvalid();

    if (!record || record.expiresAt <= Date.now()) {
      showToast("Link de redefinição inválido");
      return;
    }

    if (newPassword.value.length < 8) {
      newPassword.setAttribute("aria-invalid", "true");
      showToast("Senha mínima de 8 caracteres");
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setAttribute("aria-invalid", "true");
      showToast("As senhas não conferem");
      return;
    }

    const overrides = readJson(STORAGE_KEYS.passwordOverrides, {});
    overrides[record.email] = newPassword.value;
    writeJson(STORAGE_KEYS.passwordOverrides, overrides);
    delete tokens[token];
    writeJson(STORAGE_KEYS.resetTokens, tokens);

    showToast("Senha redefinida", "success");
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  }

  function clearInvalid() {
    newPassword.removeAttribute("aria-invalid");
    confirmPassword.removeAttribute("aria-invalid");
  }

  function showToast(message, type) {
    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.toggle("success", type === "success");
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
})();
