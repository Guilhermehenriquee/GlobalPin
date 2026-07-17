(function () {
  "use strict";

  const LOCK_DURATION_MS = 15 * 60 * 1000;
  const MAX_FAILED_ATTEMPTS = 5;
  const SESSION_HOURS = 8;
  const REMEMBER_DAYS = 7;

  const STORAGE_KEYS = {
    session: "espartano_auth_token",
    user: "espartano_auth_user",
    lockouts: "espartano_login_lockouts",
    passwordOverrides: "espartano_password_overrides",
    resetTokens: "espartano_reset_tokens",
    mailOutbox: "espartano_mail_outbox"
  };

  const USERS = [
    {
      id: "usr_admin",
      username: "admin",
      email: "admin@espartano.local",
      password: "Espartano@123",
      name: "Administrador",
      role: "admin",
      twoFactorEnabled: false
    },
    {
      id: "usr_operador",
      username: "operador",
      email: "operador@espartano.local",
      password: "Operador@123",
      name: "Operador",
      role: "operador",
      twoFactorEnabled: true,
      totpSecret: "JBSWY3DPEHPK3PXP"
    }
  ];

  const loginForm = document.getElementById("loginForm");
  const identifierInput = document.getElementById("identifier");
  const passwordInput = document.getElementById("password");
  const twoFactorGroup = document.getElementById("twoFactorGroup");
  const twoFactorInput = document.getElementById("twoFactorCode");
  const rememberInput = document.getElementById("rememberMe");
  const togglePassword = document.getElementById("togglePassword");
  const submitButton = document.getElementById("submitButton");
  const recoverPassword = document.getElementById("recoverPassword");
  const recoverDialog = document.getElementById("recoverDialog");
  const recoverForm = document.getElementById("recoverForm");
  const recoverEmail = document.getElementById("recoverEmail");
  const closeRecover = document.getElementById("closeRecover");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  let pendingTwoFactorUser = null;
  let toastTimer = 0;

  boot();

  function boot() {
    if (getActiveToken()) {
      window.location.href = "dashboard.html";
      return;
    }

    togglePassword.addEventListener("click", handlePasswordToggle);
    loginForm.addEventListener("submit", handleLogin);
    identifierInput.addEventListener("input", handleIdentifierInput);
    recoverPassword.addEventListener("click", openRecovery);
    closeRecover.addEventListener("click", closeRecovery);
    recoverForm.addEventListener("submit", handleRecovery);
  }

  function handlePasswordToggle() {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    togglePassword.classList.toggle("is-password-visible", !isVisible);
    togglePassword.setAttribute("aria-label", isVisible ? "Mostrar senha" : "Esconder senha");
    togglePassword.setAttribute("title", isVisible ? "Mostrar senha" : "Esconder senha");
  }

  function handleIdentifierInput() {
    identifierInput.removeAttribute("aria-invalid");
    updateLockState();
  }

  async function handleLogin(event) {
    event.preventDefault();

    const identifier = normalize(identifierInput.value);
    const password = passwordInput.value;
    const twoFactorCode = onlyDigits(twoFactorInput.value);
    const lock = getLock(identifier);

    clearInvalidState();

    if (!identifier || !password) {
      markInvalid(identifierInput, !identifier);
      markInvalid(passwordInput, !password);
      showToast("Credenciais inválidas");
      return;
    }

    if (lock && lock.lockUntil > Date.now()) {
      showToast(`Acesso bloqueado por ${formatRemaining(lock.lockUntil)}.`);
      updateLockState();
      return;
    }

    setLoading(true);

    try {
      const user = pendingTwoFactorUser || findUser(identifier);
      const isPasswordValid = user && getUserPassword(user) === password;

      await wait(420);

      if (!user || !isPasswordValid) {
        pendingTwoFactorUser = null;
        hideTwoFactor();
        setLoading(false);
        handleFailedAttempt(identifier);
        return;
      }

      if (user.twoFactorEnabled) {
        if (!pendingTwoFactorUser) {
          pendingTwoFactorUser = user;
          showTwoFactor();
          setLoading(false);
          return;
        }

        if (!twoFactorCode || !(await verifyTotp(twoFactorCode, user.totpSecret))) {
          markInvalid(twoFactorInput, true);
          setLoading(false);
          handleFailedAttempt(identifier);
          return;
        }
      }

      clearLock(identifier);
      createSession(user, rememberInput.checked);
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error(error);
      showToast("Não foi possível autenticar");
      setLoading(false);
    }
  }

  function openRecovery() {
    recoverEmail.value = looksLikeEmail(identifierInput.value) ? identifierInput.value.trim() : "";
    recoverEmail.removeAttribute("aria-invalid");
    if (typeof recoverDialog.showModal === "function") {
      recoverDialog.showModal();
      recoverEmail.focus();
    } else {
      const email = window.prompt("E-mail cadastrado");
      if (email) {
        sendRecoveryEmail(email);
      }
    }
  }

  function closeRecovery() {
    recoverDialog.close();
  }

  async function handleRecovery(event) {
    event.preventDefault();
    const email = recoverEmail.value.trim().toLowerCase();

    recoverEmail.removeAttribute("aria-invalid");

    if (!looksLikeEmail(email)) {
      recoverEmail.setAttribute("aria-invalid", "true");
      showToast("Informe um e-mail válido");
      return;
    }

    document.getElementById("sendRecovery").disabled = true;
    await wait(500);
    sendRecoveryEmail(email);
    document.getElementById("sendRecovery").disabled = false;
    recoverDialog.close();
  }

  function sendRecoveryEmail(email) {
    const user = USERS.find((candidate) => candidate.email === email);
    const resetToken = createResetToken(email);
    const resetUrl = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, "")}reset.html?token=${resetToken}`;
    const outbox = readJson(STORAGE_KEYS.mailOutbox, []);

    outbox.push({
      to: email,
      resetUrl,
      status: user ? "ready" : "unknown-recipient",
      createdAt: new Date().toISOString()
    });

    writeJson(STORAGE_KEYS.mailOutbox, outbox);
    showToast("Link de redefinição enviado", "success");
  }

  function showTwoFactor() {
    twoFactorGroup.hidden = false;
    twoFactorInput.required = true;
    twoFactorInput.focus();
    submitButton.querySelector("span").textContent = "Validar 2FA";
  }

  function hideTwoFactor() {
    twoFactorGroup.hidden = true;
    twoFactorInput.required = false;
    twoFactorInput.value = "";
    submitButton.querySelector("span").textContent = "Acessar";
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle("is-loading", isLoading);
    submitButton.querySelector("span").textContent = isLoading ? "Verificando" : pendingTwoFactorUser ? "Validar 2FA" : "Acessar";
  }

  function handleFailedAttempt(identifier) {
    const attempt = registerFailedAttempt(identifier);

    if (attempt.lockUntil && attempt.lockUntil > Date.now()) {
      showToast("Acesso bloqueado por 15 minutos");
      updateLockState();
      return;
    }

    showToast("Credenciais inválidas");
  }

  function updateLockState() {
    const identifier = normalize(identifierInput.value);
    const lock = getLock(identifier);

    if (!lock || lock.lockUntil <= Date.now()) {
      submitButton.disabled = false;
      return;
    }

    submitButton.disabled = true;
    window.setTimeout(updateLockState, 1000);
  }

  function createSession(user, remember) {
    const now = Date.now();
    const ttl = remember ? REMEMBER_DAYS * 24 * 60 * 60 * 1000 : SESSION_HOURS * 60 * 60 * 1000;
    const expiresAt = now + ttl;
    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      remember,
      iat: Math.floor(now / 1000),
      exp: Math.floor(expiresAt / 1000)
    };
    const token = createDemoJwt(payload);
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem(STORAGE_KEYS.session, token);
    storage.setItem(STORAGE_KEYS.user, JSON.stringify(payload));
  }

  function getActiveToken() {
    return localStorage.getItem(STORAGE_KEYS.session) || sessionStorage.getItem(STORAGE_KEYS.session);
  }

  function createDemoJwt(payload) {
    const header = { alg: "demo", typ: "JWT" };
    return `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}.local-demo-signature`;
  }

  function findUser(identifier) {
    return USERS.find((user) => user.username === identifier || user.email === identifier);
  }

  function getUserPassword(user) {
    const overrides = readJson(STORAGE_KEYS.passwordOverrides, {});
    return overrides[user.email] || user.password;
  }

  function registerFailedAttempt(identifier) {
    const locks = readJson(STORAGE_KEYS.lockouts, {});
    const key = identifier || "unknown";
    const current = locks[key] || { count: 0, lockUntil: 0 };
    const nextCount = current.lockUntil > Date.now() ? current.count : current.count + 1;

    locks[key] = {
      count: nextCount,
      lockUntil: nextCount >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCK_DURATION_MS : 0
    };

    writeJson(STORAGE_KEYS.lockouts, locks);
    return locks[key];
  }

  function clearLock(identifier) {
    const locks = readJson(STORAGE_KEYS.lockouts, {});
    delete locks[identifier];
    writeJson(STORAGE_KEYS.lockouts, locks);
  }

  function getLock(identifier) {
    if (!identifier) {
      return null;
    }
    const locks = readJson(STORAGE_KEYS.lockouts, {});
    return locks[identifier] || null;
  }

  function createResetToken(email) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    const tokens = readJson(STORAGE_KEYS.resetTokens, {});

    tokens[token] = {
      email,
      expiresAt: Date.now() + 30 * 60 * 1000
    };

    writeJson(STORAGE_KEYS.resetTokens, tokens);
    return token;
  }

  async function verifyTotp(code, secret) {
    for (let offset = -1; offset <= 1; offset += 1) {
      const expected = await generateTotp(secret, offset);
      if (expected === code) {
        return true;
      }
    }
    return false;
  }

  async function generateTotp(secret, stepOffset) {
    const key = base32ToBytes(secret);
    const counter = Math.floor(Date.now() / 1000 / 30) + stepOffset;
    const message = new Uint8Array(8);
    const view = new DataView(message.buffer);
    view.setUint32(4, counter);

    const hmac = hmacSha1(key, message);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    return String(binary % 1000000).padStart(6, "0");
  }

  function hmacSha1(key, message) {
    const blockSize = 64;
    let normalizedKey = key;

    if (normalizedKey.length > blockSize) {
      normalizedKey = sha1(normalizedKey);
    }

    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(normalizedKey);

    const innerPad = new Uint8Array(blockSize);
    const outerPad = new Uint8Array(blockSize);

    for (let i = 0; i < blockSize; i += 1) {
      innerPad[i] = paddedKey[i] ^ 0x36;
      outerPad[i] = paddedKey[i] ^ 0x5c;
    }

    const inner = concatBytes(innerPad, message);
    return sha1(concatBytes(outerPad, sha1(inner)));
  }

  function sha1(bytes) {
    const words = [];
    const bitLength = bytes.length * 8;

    for (let i = 0; i < bytes.length; i += 1) {
      words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    }

    words[bitLength >> 5] |= 0x80 << (24 - (bitLength % 32));
    words[((bitLength + 64 >> 9) << 4) + 15] = bitLength;

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;
    let h4 = 0xc3d2e1f0;

    for (let i = 0; i < words.length; i += 16) {
      const w = new Array(80);

      for (let j = 0; j < 16; j += 1) {
        w[j] = words[i + j] || 0;
      }

      for (let j = 16; j < 80; j += 1) {
        w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;

      for (let j = 0; j < 80; j += 1) {
        let f;
        let k;

        if (j < 20) {
          f = (b & c) | (~b & d);
          k = 0x5a827999;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 0x6ed9eba1;
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8f1bbcdc;
        } else {
          f = b ^ c ^ d;
          k = 0xca62c1d6;
        }

        const temp = (rotateLeft(a, 5) + f + e + k + w[j]) | 0;
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp;
      }

      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
      h4 = (h4 + e) | 0;
    }

    const digest = new Uint8Array(20);
    const hash = [h0, h1, h2, h3, h4];

    hash.forEach((part, index) => {
      digest[index * 4] = (part >>> 24) & 0xff;
      digest[index * 4 + 1] = (part >>> 16) & 0xff;
      digest[index * 4 + 2] = (part >>> 8) & 0xff;
      digest[index * 4 + 3] = part & 0xff;
    });

    return digest;
  }

  function rotateLeft(value, bits) {
    return (value << bits) | (value >>> (32 - bits));
  }

  function concatBytes(a, b) {
    const result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }

  function base32ToBytes(value) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const clean = value.replace(/=+$/, "").toUpperCase();
    const bytes = [];
    let bits = "";

    for (const char of clean) {
      const index = alphabet.indexOf(char);
      if (index === -1) {
        continue;
      }
      bits += index.toString(2).padStart(5, "0");
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    return new Uint8Array(bytes);
  }

  function base64Url(value) {
    return btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  function clearInvalidState() {
    [identifierInput, passwordInput, twoFactorInput].forEach((input) => input.removeAttribute("aria-invalid"));
  }

  function markInvalid(input, shouldMark) {
    if (shouldMark) {
      input.setAttribute("aria-invalid", "true");
    }
  }

  function showToast(message, type) {
    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.toggle("success", type === "success");
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function normalize(value) {
    return value.trim().toLowerCase();
  }

  function onlyDigits(value) {
    return value.replace(/\D/g, "");
  }

  function looksLikeEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function formatRemaining(timestamp) {
    const seconds = Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
    const minutes = Math.floor(seconds / 60);
    const rest = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${rest}`;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
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
