(function () {
  "use strict";

  const STORAGE_KEYS = {
    session: "espartano_auth_token",
    user: "espartano_auth_user"
  };

  const STATUS = {
    active: { label: "Ativo", color: "#4f8f5e", className: "status-active" },
    inactive: { label: "Inativo", color: "#b84a4a", className: "status-inactive" },
    connecting: { label: "Conectando", color: "#b89443", className: "status-connecting" }
  };

  const TRANSFER_VISUAL = { label: "Transferiu", color: "#40a7a0", className: "status-transferred" };

  const BRAZIL_MAP = {
    width: 620,
    height: 520,
    padding: 34,
    bounds: { minLat: -34.3, maxLat: 5.6, minLng: -74.2, maxLng: -34.4 }
  };

  const brazilOutline = [
    [-7.6, -73.9], [-10.0, -70.5], [-11.0, -67.1], [-9.5, -64.9], [-10.8, -62.8],
    [-12.8, -60.0], [-14.0, -57.6], [-16.6, -57.9], [-18.2, -59.1], [-20.6, -57.9],
    [-22.0, -55.4], [-23.8, -54.7], [-26.5, -54.8], [-29.6, -53.4], [-31.8, -51.2],
    [-30.1, -49.6], [-27.5, -48.6], [-24.4, -47.0], [-23.0, -44.8], [-22.0, -41.8],
    [-20.0, -40.1], [-17.6, -39.0], [-15.0, -38.6], [-12.7, -38.8], [-10.5, -37.2],
    [-8.8, -35.2], [-6.8, -34.8], [-4.7, -36.0], [-2.5, -38.4], [-1.8, -41.6],
    [-2.2, -44.2], [-0.6, -48.2], [1.8, -50.2], [4.0, -51.8], [5.1, -55.2],
    [4.8, -58.4], [4.2, -60.4], [2.0, -62.6], [1.2, -64.8], [2.5, -67.6],
    [1.6, -69.9], [-1.9, -72.2], [-5.1, -72.8]
  ];

  const brazilStateLines = [
    [[1.4, -69.5], [-1.5, -67.7], [-5.3, -66.0], [-8.8, -64.5], [-11.0, -62.8]],
    [[4.2, -60.5], [0.8, -60.2], [-3.0, -60.8], [-6.3, -61.5], [-10.5, -61.8]],
    [[1.4, -56.0], [-2.0, -55.5], [-5.4, -54.8], [-8.8, -54.0], [-12.2, -53.5]],
    [[-12.2, -60.1], [-13.7, -56.8], [-15.6, -54.4], [-18.2, -53.0], [-22.1, -52.8]],
    [[-10.5, -61.8], [-12.2, -60.1], [-14.0, -58.2], [-16.3, -56.6], [-18.8, -55.8]],
    [[-22.1, -52.8], [-23.6, -50.3], [-25.4, -49.5], [-28.0, -49.3]],
    [[-15.6, -54.4], [-15.9, -51.1], [-16.4, -48.2], [-17.5, -45.8], [-19.2, -43.4]],
    [[-19.2, -43.4], [-21.0, -44.6], [-22.7, -46.8], [-23.6, -50.3]],
    [[-17.5, -45.8], [-15.3, -43.8], [-13.2, -42.1], [-11.2, -41.6], [-9.6, -40.6]],
    [[-12.2, -53.5], [-12.8, -50.0], [-13.8, -46.5], [-15.3, -43.8]],
    [[-8.8, -54.0], [-8.7, -50.2], [-9.2, -46.6], [-11.2, -41.6]],
    [[-5.4, -54.8], [-5.0, -50.6], [-5.3, -46.8], [-6.6, -43.2], [-8.2, -39.8]],
    [[-2.0, -55.5], [-1.8, -51.5], [-2.2, -48.4], [-3.2, -45.0], [-4.7, -41.2]],
    [[-4.7, -41.2], [-6.5, -39.2], [-8.2, -37.3], [-10.5, -37.2]],
    [[-9.6, -40.6], [-11.4, -39.2], [-13.0, -38.8], [-15.0, -38.6]],
    [[-23.0, -44.8], [-22.2, -42.5], [-20.0, -40.1]],
    [[-28.0, -49.3], [-30.0, -51.1], [-31.8, -51.2]]
  ];

  const brazilStateLabels = [
    { uf: "AC", lat: -8.8, lng: -70.4 }, { uf: "AM", lat: -4.3, lng: -63.4 },
    { uf: "RR", lat: 2.2, lng: -61.0 }, { uf: "RO", lat: -10.6, lng: -63.5 },
    { uf: "PA", lat: -4.2, lng: -52.2 }, { uf: "AP", lat: 1.0, lng: -51.8 },
    { uf: "MT", lat: -13.2, lng: -56.0 }, { uf: "MS", lat: -20.5, lng: -54.6 },
    { uf: "GO", lat: -16.0, lng: -49.6 }, { uf: "DF", lat: -15.8, lng: -47.9 },
    { uf: "MA", lat: -5.0, lng: -45.1 }, { uf: "PI", lat: -7.0, lng: -42.7 },
    { uf: "CE", lat: -5.4, lng: -39.5 }, { uf: "RN", lat: -5.8, lng: -36.8 },
    { uf: "PB", lat: -7.2, lng: -36.7 }, { uf: "PE", lat: -8.5, lng: -37.8 },
    { uf: "AL", lat: -9.7, lng: -36.7 }, { uf: "SE", lat: -10.7, lng: -37.3 },
    { uf: "BA", lat: -12.8, lng: -41.6 }, { uf: "TO", lat: -10.4, lng: -48.2 },
    { uf: "MG", lat: -18.7, lng: -44.2 }, { uf: "ES", lat: -19.5, lng: -40.6 },
    { uf: "RJ", lat: -22.2, lng: -42.7 }, { uf: "SP", lat: -22.6, lng: -48.7 },
    { uf: "PR", lat: -25.2, lng: -51.4 }, { uf: "SC", lat: -27.4, lng: -50.5 },
    { uf: "RS", lat: -30.3, lng: -53.2 }
  ];

  const bankAccounts = [
    { id: "bb", bank: "Banco do Brasil", account: "Ag. 0001 / Cc. 4812-9", balance: 1284900, totalTransferred: 842900, runningAmount: 126000, runningTransfers: 2 },
    { id: "itau", bank: "Itaú", account: "Ag. 0332 / Cc. 7790-4", balance: 932300, totalTransferred: 615420, runningAmount: 84000, runningTransfers: 1 },
    { id: "bradesco", bank: "Bradesco", account: "Ag. 1204 / Cc. 2201-7", balance: 571870, totalTransferred: 438750, runningAmount: 67000, runningTransfers: 3 },
    { id: "caixa", bank: "Caixa", account: "Ag. 0911 / Cc. 3042-1", balance: 264880, totalTransferred: 214880, runningAmount: 0, runningTransfers: 0 }
  ];

  const devices = [
    { id: "dev-001", name: "DESKTOP-SP01", ip: "189.28.4.12", os: "Windows", status: "active", city: "São Paulo, SP", country: "BR", state: "SP", lat: -23.55, lng: -46.63, lastSeen: "agora", tx: 984000000, rx: 286000000, transferred: true, bankAccountId: "bb", transferAmount: 428500 },
    { id: "dev-002", name: "ANDROID-RJ02", ip: "177.44.19.22", os: "Android", status: "active", city: "Rio de Janeiro, RJ", country: "BR", state: "RJ", lat: -22.91, lng: -43.17, lastSeen: "há 2min", tx: 420000000, rx: 116000000, transferred: false, bankAccountId: "itau", transferAmount: 84000 },
    { id: "dev-003", name: "PC-MG04", ip: "179.91.44.7", os: "Windows", status: "inactive", city: "Belo Horizonte, MG", country: "BR", state: "MG", lat: -19.92, lng: -43.94, lastSeen: "há 15min", tx: 198000000, rx: 92000000, transferred: true, bankAccountId: "bradesco", transferAmount: 163200 },
    { id: "dev-004", name: "LINUX-RS11", ip: "191.34.86.4", os: "Linux", status: "active", city: "Porto Alegre, RS", country: "BR", state: "RS", lat: -30.03, lng: -51.23, lastSeen: "agora", tx: 312000000, rx: 174000000, transferred: true, bankAccountId: "itau", transferAmount: 219700 },
    { id: "dev-005", name: "IOS-BA55", ip: "187.64.12.3", os: "iOS", status: "connecting", city: "Salvador, BA", country: "BR", state: "BA", lat: -12.97, lng: -38.5, lastSeen: "há 1min", tx: 122000000, rx: 49000000, transferred: false, bankAccountId: "bb", transferAmount: 126000 },
    { id: "dev-006", name: "DESKTOP-DF33", ip: "200.100.3.5", os: "Windows", status: "active", city: "Brasília, DF", country: "BR", state: "DF", lat: -15.79, lng: -47.88, lastSeen: "agora", tx: 688000000, rx: 204000000, transferred: false, bankAccountId: "bradesco", transferAmount: 67000 },
    { id: "dev-007", name: "ANDROID-PE07", ip: "186.217.1.9", os: "Android", status: "active", city: "Recife, PE", country: "BR", state: "PE", lat: -8.05, lng: -34.9, lastSeen: "há 5min", tx: 264000000, rx: 87000000, transferred: false, bankAccountId: "bradesco", transferAmount: 0 },
    { id: "dev-008", name: "PC-PA12", ip: "170.135.22.1", os: "Windows", status: "inactive", city: "Belém, PA", country: "BR", state: "PA", lat: -1.46, lng: -48.5, lastSeen: "há 22min", tx: 142000000, rx: 64000000, transferred: true, bankAccountId: "caixa", transferAmount: 214880 },
    { id: "dev-009", name: "LINUX-CA21", ip: "64.90.11.3", os: "Linux", status: "active", city: "Toronto, CA", country: "CA", lat: 43.65, lng: -79.38, lastSeen: "agora", tx: 236000000, rx: 101000000, transferred: false, bankAccountId: "", transferAmount: 0 },
    { id: "dev-010", name: "ANDROID-US88", ip: "72.14.196.22", os: "Android", status: "active", city: "New York, US", country: "US", lat: 40.71, lng: -74.0, lastSeen: "há 3min", tx: 118000000, rx: 45000000, transferred: false, bankAccountId: "", transferAmount: 0 },
    { id: "dev-011", name: "PC-DE-04", ip: "82.113.44.7", os: "Windows", status: "inactive", city: "Berlin, DE", country: "DE", lat: 52.52, lng: 13.4, lastSeen: "há 41min", tx: 76000000, rx: 31000000, transferred: false, bankAccountId: "", transferAmount: 0 },
    { id: "dev-012", name: "IOS-MX09", ip: "201.174.2.8", os: "iOS", status: "connecting", city: "Mexico City, MX", country: "MX", lat: 19.43, lng: -99.13, lastSeen: "há 6min", tx: 118000000, rx: 45000000, transferred: false, bankAccountId: "", transferAmount: 0 }
  ];

  const DEVICE_METADATA = {
    "dev-001": {
      mac: "8C:16:45:9A:20:01",
      osVersion: "Windows 11 Pro 23H2",
      agentVersion: "2.8.4",
      lastUpdate: "hoje 16:10",
      group: "Financeiro SP",
      tags: ["financeiro", "desktop", "brasil"],
      notes: "Estação administrativa autorizada.",
      hardware: { cpu: "Intel Core i7-12700", memory: "32 GB", disks: "1 TB NVMe", network: "Intel I219-V" },
      software: ["Chrome", "Edge", "Warsaw", "Banco do Brasil Empresas", "Office"],
      bankingApps: ["Banco do Brasil Empresas"],
      alertHistory: ["Domínio bancário fora do perfil", "Transferência concluída"]
    },
    "dev-002": {
      mac: "44:67:55:AA:19:02",
      osVersion: "Android 14",
      agentVersion: "2.8.2",
      lastUpdate: "hoje 15:42",
      group: "Mobile RJ",
      tags: ["mobile", "android", "vip"],
      notes: "Aparelho corporativo com múltiplos apps bancários.",
      hardware: { cpu: "Snapdragon 8 Gen 2", memory: "12 GB", disks: "256 GB UFS", network: "Wi-Fi 6 / 5G" },
      software: ["Chrome", "Drive", "Authenticator", "Itaú", "Nubank", "Caixa Tem"],
      bankingApps: ["Itaú", "Nubank", "Caixa Tem"],
      alertHistory: ["Três apps bancários detectados", "Conexão recente"]
    },
    "dev-003": {
      mac: "70:85:C2:41:77:03",
      osVersion: "Windows 10 Pro 22H2",
      agentVersion: "2.7.9",
      lastUpdate: "ontem 21:18",
      group: "Financeiro MG",
      tags: ["desktop", "legado"],
      notes: "Equipamento em observação.",
      hardware: { cpu: "Intel Core i5-10400", memory: "16 GB", disks: "512 GB SSD", network: "Realtek PCIe" },
      software: ["Firefox", "Office", "Bradesco Net Empresa"],
      bankingApps: ["Bradesco Net Empresa"],
      alertHistory: ["Volume anormal recebido"]
    },
    "dev-004": {
      mac: "24:4B:FE:30:11:04",
      osVersion: "Ubuntu 24.04 LTS",
      agentVersion: "2.8.4",
      lastUpdate: "hoje 14:02",
      group: "Operação Sul",
      tags: ["linux", "servidor"],
      notes: "Terminal autorizado para rotinas internas.",
      hardware: { cpu: "AMD Ryzen 7 5800X", memory: "32 GB", disks: "2 TB SSD", network: "Intel X550" },
      software: ["Firefox", "OpenSSH", "Itaú Empresas"],
      bankingApps: ["Itaú Empresas"],
      alertHistory: ["Transferência concluída"]
    },
    "dev-005": {
      mac: "F4:0F:24:76:31:05",
      osVersion: "iOS 18.4",
      agentVersion: "2.8.1",
      lastUpdate: "hoje 13:50",
      group: "Mobile Nordeste",
      tags: ["mobile", "ios", "teste"],
      notes: "Aparelho corporativo de homologação.",
      hardware: { cpu: "Apple A17", memory: "8 GB", disks: "256 GB", network: "Wi-Fi 6E / 5G" },
      software: ["Safari", "Files", "Banco do Brasil", "Nubank"],
      bankingApps: ["Banco do Brasil", "Nubank"],
      alertHistory: ["Conexão em andamento"]
    },
    "dev-006": {
      mac: "18:31:BF:90:18:06",
      osVersion: "Windows 11 Enterprise",
      agentVersion: "2.8.4",
      lastUpdate: "hoje 16:05",
      group: "Operação DF",
      tags: ["desktop", "brasilia"],
      notes: "Ponto central de conferência.",
      hardware: { cpu: "Intel Core i9-12900", memory: "64 GB", disks: "2 TB NVMe", network: "Intel AX211" },
      software: ["Chrome", "Teams", "Bradesco Empresas"],
      bankingApps: ["Bradesco Empresas"],
      alertHistory: ["Sem alertas críticos"]
    },
    "dev-007": {
      mac: "90:2B:34:ED:76:07",
      osVersion: "Android 13",
      agentVersion: "2.8.0",
      lastUpdate: "hoje 12:32",
      group: "Mobile Nordeste",
      tags: ["mobile", "android", "recife"],
      notes: "Inventário de apps habilitado.",
      hardware: { cpu: "Exynos 2200", memory: "8 GB", disks: "128 GB", network: "Wi-Fi 6 / 5G" },
      software: ["Chrome", "Gmail", "RecargaPay", "Banco Inter", "Santander"],
      bankingApps: ["Banco Inter", "Santander"],
      alertHistory: ["Dois apps bancários detectados"]
    },
    "dev-008": {
      mac: "6A:11:90:C4:19:08",
      osVersion: "Windows 11 Home",
      agentVersion: "2.7.8",
      lastUpdate: "ontem 20:45",
      group: "Norte",
      tags: ["desktop", "offline"],
      notes: "Sem conexão recente.",
      hardware: { cpu: "Intel Core i3-10100", memory: "8 GB", disks: "256 GB SSD", network: "Realtek PCIe" },
      software: ["Edge", "Caixa Internet Banking"],
      bankingApps: ["Caixa Internet Banking"],
      alertHistory: ["Dispositivo inativo"]
    },
    "dev-009": {
      mac: "48:8F:5A:21:90:09",
      osVersion: "Debian 12",
      agentVersion: "2.8.3",
      lastUpdate: "hoje 10:21",
      group: "Exterior",
      tags: ["linux", "canada"],
      notes: "Listado apenas como informação.",
      hardware: { cpu: "Intel Xeon E-2288G", memory: "32 GB", disks: "1 TB SSD", network: "Broadcom BCM" },
      software: ["Firefox", "OpenSSH"],
      bankingApps: [],
      alertHistory: ["Fora do escopo Brasil"]
    },
    "dev-010": {
      mac: "62:70:D1:44:AE:10",
      osVersion: "Android 14",
      agentVersion: "2.8.0",
      lastUpdate: "hoje 11:02",
      group: "Exterior",
      tags: ["mobile", "android", "eua"],
      notes: "Listado apenas como informação.",
      hardware: { cpu: "Tensor G3", memory: "8 GB", disks: "128 GB", network: "Wi-Fi 6E / 5G" },
      software: ["Chrome", "Bank of America", "Chase"],
      bankingApps: ["Bank of America", "Chase"],
      alertHistory: ["Fora do escopo Brasil"]
    },
    "dev-011": {
      mac: "84:21:2B:E8:31:11",
      osVersion: "Windows 11 Pro",
      agentVersion: "2.7.7",
      lastUpdate: "ontem 19:08",
      group: "Exterior",
      tags: ["desktop", "alemanha"],
      notes: "Listado apenas como informação.",
      hardware: { cpu: "Intel Core i5-11400", memory: "16 GB", disks: "512 GB SSD", network: "Intel AX200" },
      software: ["Chrome", "Deutsche Bank"],
      bankingApps: ["Deutsche Bank"],
      alertHistory: ["Fora do escopo Brasil"]
    },
    "dev-012": {
      mac: "E2:30:91:77:42:12",
      osVersion: "iOS 18.2",
      agentVersion: "2.8.1",
      lastUpdate: "hoje 09:22",
      group: "Exterior",
      tags: ["mobile", "ios", "mexico"],
      notes: "Listado apenas como informação.",
      hardware: { cpu: "Apple A16", memory: "6 GB", disks: "128 GB", network: "Wi-Fi 6 / 5G" },
      software: ["Safari", "BBVA", "Santander MX"],
      bankingApps: ["BBVA", "Santander MX"],
      alertHistory: ["Fora do escopo Brasil"]
    }
  };

  devices.forEach((device) => {
    Object.assign(device, {
      group: "Sem grupo",
      tags: [],
      notes: "",
      mac: "--",
      osVersion: device.os,
      agentVersion: "2.8.0",
      lastUpdate: "hoje",
      hardware: { cpu: "--", memory: "--", disks: "--", network: "--" },
      software: [],
      bankingApps: [],
      alertHistory: [],
      distributionReceived: 0
    }, DEVICE_METADATA[device.id] || {});
  });

  const trend = {
    7: [214, 228, 219, 236, 242, 231, 247],
    30: [162, 169, 173, 181, 179, 188, 193, 201, 198, 206, 214, 211, 219, 226, 223, 231, 235, 238, 229, 241, 245, 249, 252, 246, 251, 258, 262, 267, 264, 271]
  };

  let alerts = [
    { id: "alt-001", type: "warn", title: "Domínio bancário", message: "DESKTOP-SP01 acessou domínio bancário fora do perfil esperado.", time: "hoje 03:47", read: false },
    { id: "alt-002", type: "info", title: "Transferência concluída", message: "LINUX-RS11 concluiu transferência vinculada à conta Itaú.", time: "hoje 07:12", read: false },
    { id: "alt-003", type: "info", title: "Novo dispositivo", message: "Novo dispositivo registrado: ANDROID-PE07 / 186.217.1.9.", time: "hoje 09:05", read: false },
    { id: "alt-004", type: "warn", title: "Volume anormal", message: "PC-MG04 excedeu o tráfego médio recebido nas últimas 24 horas.", time: "ontem 22:18", read: true }
  ];

  let aiMode = false;
  let selectedRange = 7;
  let toastTimer = 0;
  let selectedDeviceId = null;
  let selectedDeviceIds = new Set();
  let devicePage = 1;
  let detailDeviceId = null;
  let detailTab = "general";
  let editDeviceId = null;
  let consoleDeviceId = null;
  let contextDeviceId = null;
  let mirrorDeviceId = null;
  let terminalDeviceId = null;
  let fileTransferDeviceId = null;
  let selectedRemotePath = "/home/operador";
  const terminalHistory = [];
  const terminalAudit = [];
  const pageSize = 5;

  const token = localStorage.getItem(STORAGE_KEYS.session) || sessionStorage.getItem(STORAGE_KEYS.session);
  const user = readStoredUser();

  if (!token || !user || isExpired(user.exp)) {
    clearSession();
    window.location.href = "index.html";
    return;
  }

  boot();

  function boot() {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("sessionInfo").textContent = user.remember
      ? "Sessão persistente neste computador"
      : "Sessão temporária nesta janela";

    document.getElementById("logoutButton").addEventListener("click", function () {
      clearSession();
      window.location.href = "index.html";
    });

    document.querySelectorAll("[data-range]").forEach((button) => {
      button.addEventListener("click", () => setRange(Number(button.dataset.range)));
    });
    document.querySelectorAll("[data-view-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveView(link.dataset.viewLink);
      });
    });

    document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
    document.getElementById("disconnectDevice").addEventListener("click", disconnectSelectedDevice);
    document.getElementById("syncNow").addEventListener("click", syncNow);
    document.getElementById("toggleAi").addEventListener("click", toggleAiMode);
    document.getElementById("openKillSwitch").addEventListener("click", openKillSwitch);
    document.getElementById("cancelKillSwitch").addEventListener("click", closeKillSwitch);
    document.getElementById("confirmKillSwitch").addEventListener("click", function (event) {
      event.preventDefault();
      executeKillSwitch();
    });
    document.getElementById("exportAlerts").addEventListener("click", exportAlertsCsv);
    document.getElementById("applyDistribution").addEventListener("click", applyDistribution);
    document.getElementById("deviceSearch").addEventListener("input", resetDeviceFilters);
    document.getElementById("statusFilter").addEventListener("change", resetDeviceFilters);
    document.getElementById("osFilter").addEventListener("change", resetDeviceFilters);
    document.getElementById("groupFilter").addEventListener("change", resetDeviceFilters);
    document.getElementById("selectAllDevices").addEventListener("change", togglePageSelection);
    document.getElementById("prevDevicePage").addEventListener("click", () => changeDevicePage(-1));
    document.getElementById("nextDevicePage").addEventListener("click", () => changeDevicePage(1));
    document.getElementById("deviceTableBody").addEventListener("click", handleDeviceTableClick);
    document.getElementById("deviceTableBody").addEventListener("change", handleDeviceTableChange);
    document.getElementById("batchScript").addEventListener("click", () => openTerminalForSelection("script"));
    document.getElementById("batchUpdate").addEventListener("click", batchUpdateAgents);
    document.getElementById("batchRemove").addEventListener("click", batchRemoveDevices);
    document.getElementById("closeDeviceDetail").addEventListener("click", closeDeviceDetail);
    document.querySelectorAll("[data-device-tab]").forEach((button) => {
      button.addEventListener("click", () => setDeviceDetailTab(button.dataset.deviceTab));
    });
    document.getElementById("cancelDeviceEdit").addEventListener("click", closeDeviceEdit);
    document.getElementById("deviceEditForm").addEventListener("submit", saveDeviceEdit);
    document.getElementById("closeTerminal").addEventListener("click", closeTerminal);
    document.getElementById("runTerminalCommand").addEventListener("click", runTerminalCommand);
    document.getElementById("terminalCommand").addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        runTerminalCommand();
      }
    });
    document.getElementById("terminalDeviceSelect").addEventListener("change", function (event) {
      setTerminalDevice(event.target.value);
    });
    document.getElementById("clearTerminal").addEventListener("click", clearTerminalSession);
    document.getElementById("exportTerminal").addEventListener("click", exportTerminalSession);
    document.getElementById("closeFileTransfer").addEventListener("click", closeFileTransfer);
    document.getElementById("fileDeviceSelect").addEventListener("change", function (event) {
      openFileTransfer(event.target.value);
    });
    document.getElementById("remoteFileTree").addEventListener("click", handleRemoteTreeClick);
    document.getElementById("fileUploadInput").addEventListener("change", handleFileUpload);
    document.getElementById("createRemoteFolder").addEventListener("click", () => simulateFileAction("Criar pasta"));
    document.getElementById("renameRemoteItem").addEventListener("click", () => simulateFileAction("Renomear"));
    document.getElementById("deleteRemoteItem").addEventListener("click", () => simulateFileAction("Excluir"));
    document.getElementById("downloadRemoteFile").addEventListener("click", downloadRemoteFile);
    document.getElementById("closeMirror").addEventListener("click", closeMirror);
    document.getElementById("stopMirror").addEventListener("click", closeMirror);
    document.getElementById("startMirror").addEventListener("click", () => updateMirrorState("Espelhando"));
    document.getElementById("pauseMirror").addEventListener("click", () => updateMirrorState("Pausado"));
    ["saveMirror", "blockMirror", "controlMirror", "mirrorMode", "mirrorFps", "mirrorQuality"].forEach((id) => {
      document.getElementById(id).addEventListener("change", updateMirrorSettings);
    });
    document.getElementById("consoleSearch").addEventListener("input", renderConnectedConsole);
    document.getElementById("connectedClientList").addEventListener("click", handleConnectedClientClick);
    document.getElementById("connectedClientList").addEventListener("contextmenu", handleDeviceContextMenu);
    document.querySelector(".ops-console-action-grid").addEventListener("click", handleConsoleAction);
    document.getElementById("deviceTableBody").addEventListener("contextmenu", handleDeviceContextMenu);
    document.getElementById("deviceContextMenu").addEventListener("click", handleContextMenuClick);
    document.addEventListener("click", hideContextMenu);

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    });
    window.addEventListener("hashchange", () => {
      setActiveView(window.location.hash === "#devices" ? "devices" : "dashboard");
    });

    populateStaticControls();
    setActiveView(window.location.hash === "#devices" ? "devices" : "dashboard");
    renderAll();
    tickClock();
    window.setInterval(tickClock, 1000);
    window.setInterval(simulateRealtimeDrift, 12000);
  }

  function renderAll() {
    renderDeviceSelects();
    renderMetrics();
    renderMap();
    renderOsBars();
    renderLineChart();
    renderBankAccounts();
    renderDistributionAccounts();
    renderBankingAppsOverview();
    renderConnectedConsole();
    renderDeviceManager();
    renderAlerts();
  }

  function setActiveView(view) {
    const activeView = view === "devices" ? "devices" : "dashboard";
    const titles = {
      dashboard: { eyebrow: "Visão geral", title: "Painel operacional", sync: "Aguardando atualização" },
      devices: { eyebrow: "Dispositivos", title: "Gerenciamento de dispositivos", sync: "Celulares e agentes conectados" }
    };

    document.querySelectorAll("[data-view-section]").forEach((section) => {
      section.hidden = section.dataset.viewSection !== activeView;
    });

    document.querySelectorAll("[data-view-link]").forEach((link) => {
      const isActive = link.dataset.viewLink === activeView;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.getElementById("contentEyebrow").textContent = titles[activeView].eyebrow;
    document.getElementById("dashboardTitle").textContent = titles[activeView].title;
    document.getElementById("syncStatus").textContent = titles[activeView].sync;
    window.history.replaceState(null, "", `#${activeView === "devices" ? "devices" : "dashboard"}`);

    if (activeView === "devices") {
      renderDeviceManager();
      renderBankingAppsOverview();
      renderConnectedConsole();
    }
  }

  function renderMetrics() {
    const activeCount = devices.filter((device) => device.status === "active").length;
    const totalBytesTx = devices.reduce((sum, device) => sum + device.tx, 0);
    const totalBytesRx = devices.reduce((sum, device) => sum + device.rx, 0);

    document.getElementById("metricActive").textContent = activeCount.toLocaleString("pt-BR");
    document.getElementById("metricActiveSub").textContent = `${devices.filter((device) => device.status === "connecting").length} conectando agora`;
    document.getElementById("metricTotal").textContent = devices.length.toLocaleString("pt-BR");
    document.getElementById("metricTx").textContent = formatBytes(totalBytesTx);
    document.getElementById("metricRx").textContent = formatBytes(totalBytesRx);
  }

  function renderMap() {
    const markerLayer = document.getElementById("mapMarkers");
    const tooltip = document.getElementById("mapTooltip");
    const brazilDevices = devices.filter(isBrazilDevice);

    renderBrazilMapBase();
    renderForeignDevices();
    markerLayer.replaceChildren();

    brazilDevices.forEach((device) => {
      const point = projectBrazil(device.lat, device.lng);
      const visual = getDeviceVisual(device);
      const group = svg("g");
      const pulse = svg("circle");
      const marker = svg("circle");

      group.classList.add("ops-marker-group");
      pulse.classList.add("ops-marker-pulse");
      marker.classList.add("ops-marker", visual.className);

      pulse.setAttribute("cx", point.x);
      pulse.setAttribute("cy", point.y);
      pulse.setAttribute("r", device.status === "active" ? "15" : "11");
      pulse.setAttribute("stroke", visual.color);

      marker.setAttribute("cx", point.x);
      marker.setAttribute("cy", point.y);
      marker.setAttribute("r", device.transferred ? "9" : "8");
      marker.setAttribute("tabindex", "0");
      marker.setAttribute("role", "button");
      marker.setAttribute("aria-label", `${device.name}, ${device.ip}, ${STATUS[device.status].label}${device.transferred ? ", transferência concluída" : ""}`);

      group.addEventListener("mouseenter", (event) => showMapTooltip(event, device, tooltip));
      group.addEventListener("mousemove", (event) => positionTooltip(event, tooltip));
      group.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
      group.addEventListener("click", () => openDrawer(device));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDrawer(device);
        }
      });

      group.append(pulse, marker);
      markerLayer.append(group);
    });
  }

  function renderBrazilMapBase() {
    const base = document.getElementById("brazilMapBase");
    if (base.dataset.rendered === "true") {
      return;
    }

    const outline = svg("path");
    outline.classList.add("ops-brazil-outline");
    outline.setAttribute("d", geoPath(brazilOutline, true));
    base.append(outline);

    brazilStateLines.forEach((linePoints) => {
      const line = svg("path");
      line.classList.add("ops-brazil-state-line");
      line.setAttribute("d", geoPath(linePoints, false));
      base.append(line);
    });

    brazilStateLabels.forEach((state) => {
      const point = projectBrazil(state.lat, state.lng);
      const label = svg("text");
      label.classList.add("ops-brazil-state-label");
      label.setAttribute("x", point.x);
      label.setAttribute("y", point.y);
      label.textContent = state.uf;
      base.append(label);
    });

    base.dataset.rendered = "true";
  }

  function renderForeignDevices() {
    const container = document.getElementById("foreignDevices");
    const foreignDevices = devices.filter((device) => !isBrazilDevice(device));

    container.replaceChildren();
    container.hidden = foreignDevices.length === 0;

    if (!foreignDevices.length) {
      return;
    }

    const heading = document.createElement("div");
    heading.className = "ops-foreign-heading";
    heading.innerHTML = `<strong>Fora do Brasil</strong><span>${foreignDevices.length} informativo</span>`;
    container.append(heading);

    foreignDevices.forEach((device) => {
      const visual = getDeviceVisual(device);
      const row = document.createElement("button");
      row.type = "button";
      row.className = "ops-foreign-row";
      row.innerHTML = `
        <i class="${visual.className}"></i>
        <span><strong>${device.name}</strong><em>${device.city} · ${device.ip}</em></span>
        <small>${STATUS[device.status].label}</small>
      `;
      row.addEventListener("click", () => openDrawer(device));
      container.append(row);
    });
  }

  function renderOsBars() {
    const container = document.getElementById("osBars");
    const counts = countBy(devices, "os");
    const total = devices.length;
    const osOrder = ["Windows", "Android", "iOS", "Linux"];

    container.replaceChildren();

    osOrder.forEach((os) => {
      const count = counts[os] || 0;
      const percent = Math.round((count / total) * 100);
      const row = document.createElement("div");
      row.className = "ops-os-row";
      row.innerHTML = `
        <span>${os}</span>
        <div class="ops-os-bar"><i style="width: ${percent}%"></i></div>
        <strong title="${percent}%">${count}</strong>
      `;
      container.append(row);
    });
  }

  function renderLineChart() {
    const svgEl = document.getElementById("lineChart");
    const values = trend[selectedRange];
    const width = 640;
    const height = 220;
    const pad = 22;
    const min = Math.min(...values) - 8;
    const max = Math.max(...values) + 8;
    const x = (index) => pad + ((width - pad * 2) * index) / (values.length - 1);
    const y = (value) => height - pad - ((height - pad * 2) * (value - min)) / (max - min);
    const points = values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
    const areaPoints = `${pad},${height - pad} ${points} ${width - pad},${height - pad}`;

    svgEl.replaceChildren();

    for (let i = 0; i < 4; i += 1) {
      const line = svg("line");
      const yy = pad + ((height - pad * 2) * i) / 3;
      line.setAttribute("x1", pad);
      line.setAttribute("x2", width - pad);
      line.setAttribute("y1", yy);
      line.setAttribute("y2", yy);
      line.classList.add("ops-chart-gridline");
      svgEl.append(line);
    }

    const area = svg("polygon");
    area.setAttribute("points", areaPoints);
    area.classList.add("ops-chart-area");
    svgEl.append(area);

    const line = svg("polyline");
    line.setAttribute("points", points);
    line.classList.add("ops-chart-line");
    svgEl.append(line);

    values.forEach((value, index) => {
      const dot = svg("circle");
      dot.setAttribute("cx", x(index));
      dot.setAttribute("cy", y(value));
      dot.setAttribute("r", "4");
      dot.classList.add("ops-chart-dot");
      dot.append(svgTitle(`${value} ativos`));
      svgEl.append(dot);
    });

    document.getElementById("rangeLabel").textContent = selectedRange === 7 ? "Últimos 7 dias" : "Últimos 30 dias";
  }

  function renderBankAccounts() {
    const container = document.getElementById("bankAccounts");
    container.replaceChildren();

    bankAccounts.forEach((account) => {
      const row = document.createElement("article");
      row.className = "ops-bank-row";
      row.innerHTML = `
        <div class="ops-bank-title">
          <strong>${account.bank}</strong>
          <span>${account.account}</span>
        </div>
        <dl>
          <div><dt>Saldo</dt><dd>${formatCurrency(account.balance)}</dd></div>
          <div><dt>Total transferido</dt><dd>${formatCurrency(account.totalTransferred)}</dd></div>
          <div><dt>Rodando</dt><dd>${formatCurrency(account.runningAmount)}</dd></div>
          <div><dt>Operações</dt><dd>${account.runningTransfers}</dd></div>
        </dl>
      `;
      container.append(row);
    });
  }

  function populateStaticControls() {
    const groupFilter = document.getElementById("groupFilter");
    const groups = [...new Set(devices.map((device) => device.group))].sort((a, b) => a.localeCompare(b));

    groups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      groupFilter.append(option);
    });

    renderDistributionAccounts();
    renderDeviceSelects();
  }

  function renderDeviceSelects() {
    ["terminalDeviceSelect", "fileDeviceSelect"].forEach((id) => {
      const select = document.getElementById(id);
      const currentValue = select.value;

      select.replaceChildren();
      devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = `${device.name} · ${device.ip}`;
        select.append(option);
      });

      if (devices.some((device) => device.id === currentValue)) {
        select.value = currentValue;
      }
    });
  }

  function renderDistributionAccounts() {
    const select = document.getElementById("distributionAccount");
    const currentValue = select.value;

    select.replaceChildren();
    bankAccounts.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.id;
      option.textContent = `${account.bank} · ${formatCurrency(account.balance)}`;
      select.append(option);
    });

    if (bankAccounts.some((account) => account.id === currentValue)) {
      select.value = currentValue;
    }
  }

  function renderBankingAppsOverview() {
    const container = document.getElementById("bankingAppsOverview");
    const mobileDevices = devices.filter((device) => ["Android", "iOS"].includes(device.os) && device.bankingApps.length);

    container.replaceChildren();

    if (!mobileDevices.length) {
      container.innerHTML = `<p class="ops-empty-state">Nenhum app bancário detectado no inventário simulado.</p>`;
      return;
    }

    mobileDevices.forEach((device) => {
      const row = document.createElement("article");
      row.className = "ops-bank-app-row";
      row.innerHTML = `
        <div>
          <strong>${device.name}</strong>
          <span>${device.os} · ${device.ip}</span>
        </div>
        <div class="ops-bank-app-tags">${device.bankingApps.map((app) => `<em>${app}</em>`).join("")}</div>
      `;
      row.addEventListener("click", () => openDeviceDetail(device.id, "software"));
      container.append(row);
    });
  }

  function renderConnectedConsole() {
    const container = document.getElementById("connectedClientList");
    const query = normalize(document.getElementById("consoleSearch").value);
    const connectedDevices = devices.filter((device) => {
      const isConnected = device.status !== "inactive";
      const matchesQuery = !query || normalize(`${device.name} ${device.ip} ${device.city} ${device.os}`).includes(query);
      return isConnected && matchesQuery;
    });

    container.replaceChildren();

    if (!connectedDevices.length) {
      container.innerHTML = `<div class="ops-console-empty">Nenhum dispositivo conectado encontrado.</div>`;
      return;
    }

    if (!consoleDeviceId || !connectedDevices.some((device) => device.id === consoleDeviceId)) {
      consoleDeviceId = connectedDevices[0].id;
    }

    connectedDevices.forEach((device) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `ops-console-client${device.id === consoleDeviceId ? " is-selected" : ""}`;
      row.dataset.deviceId = device.id;
      row.innerHTML = `
        <span class="ops-console-phone-icon"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M11 18h2"></path></svg></span>
        <span class="ops-console-avatar"></span>
        <span class="ops-console-country">${device.country || "BR"}</span>
        <strong>${device.name}</strong>
        <em>${device.ip}</em>
        <small>${device.os}</small>
        <span class="ops-console-badges"><i title="Bateria"></i><i title="Rede"></i></span>
        <span>${device.lastSeen}</span>
      `;
      container.append(row);
    });

    renderConsoleActionOutput();
  }

  function renderConsoleActionOutput(actionLabel = "Firewall") {
    const device = findDevice(consoleDeviceId);
    const output = document.getElementById("consoleActionOutput");

    if (!device) {
      output.textContent = "Selecione um dispositivo conectado.";
      return;
    }

    output.innerHTML = `
      <strong>${actionLabel}</strong>
      <span>${device.name} · ${device.ip}</span>
      <em>Ação disponível apenas como simulação autorizada.</em>
    `;
  }

  function handleConnectedClientClick(event) {
    const row = event.target.closest("[data-device-id]");
    if (!row) {
      return;
    }

    consoleDeviceId = row.dataset.deviceId;
    renderConnectedConsole();
  }

  function handleConsoleAction(event) {
    const button = event.target.closest("[data-console-action]");
    const device = findDevice(consoleDeviceId);

    if (!button || !device) {
      return;
    }

    const action = button.dataset.consoleAction;
    const labels = {
      dashboard: "Dashboard",
      clients: "Clientes",
      notifications: "Notificações",
      servers: "Servidores",
      connections: "Conexões",
      blocked: "Bloqueados",
      files: "Arquivos",
      phone: "Espelhamento",
      camera: "Câmera",
      mic: "Microfone",
      sms: "SMS",
      calls: "Chamadas",
      contacts: "Contatos",
      accounts: "Contas",
      apps: "Aplicativos",
      permissions: "Permissões"
    };

    if (action === "phone") {
      openMirror(device.id);
      return;
    }

    if (action === "files") {
      openFileTransfer(device.id);
    } else if (action === "apps") {
      openDeviceDetail(device.id, "software");
    } else if (action === "permissions" || action === "accounts") {
      openDeviceDetail(device.id, "general");
    } else if (action === "connections") {
      openTerminal(device.id);
    }

    renderConsoleActionOutput(labels[action] || "Ação");
    showToast(`${labels[action] || "Ação"} simulada`, "success");
  }

  function renderDeviceManager() {
    const body = document.getElementById("deviceTableBody");
    const filtered = getFilteredDevices();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    if (devicePage > totalPages) {
      devicePage = totalPages;
    }

    const start = (devicePage - 1) * pageSize;
    const pageDevices = filtered.slice(start, start + pageSize);

    body.replaceChildren();

    if (!pageDevices.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="7" class="ops-table-empty">Nenhum dispositivo encontrado.</td>`;
      body.append(emptyRow);
    }

    pageDevices.forEach((device) => {
      const row = document.createElement("tr");
      row.dataset.deviceId = device.id;
      row.innerHTML = `
        <td><input class="device-select" type="checkbox" data-device-id="${device.id}" ${selectedDeviceIds.has(device.id) ? "checked" : ""} aria-label="Selecionar ${device.name}"></td>
        <td><span class="ops-table-status"><i class="${STATUS[device.status].className}"></i>${statusTableLabel(device.status)}</span></td>
        <td><strong>${device.name}</strong><small>${device.tags.join(", ") || "sem tags"}</small></td>
        <td>${device.ip}</td>
        <td>${device.os}</td>
        <td>${device.lastSeen}</td>
        <td>
          <div class="ops-row-actions">
            <button type="button" data-device-action="view" data-device-id="${device.id}">Ver</button>
            <button type="button" class="ops-phone-action" data-device-action="mirror" data-device-id="${device.id}" title="Espelhar celular" aria-label="Espelhar celular ${device.name}">
              <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M11 18h2"></path></svg>
            </button>
            <button type="button" data-device-action="edit" data-device-id="${device.id}">Editar</button>
            <button type="button" data-device-action="terminal" data-device-id="${device.id}">Terminal</button>
            <button type="button" class="is-danger" data-device-action="remove" data-device-id="${device.id}">Remover</button>
          </div>
        </td>
      `;
      body.append(row);
    });

    const selectedOnPage = pageDevices.length > 0 && pageDevices.every((device) => selectedDeviceIds.has(device.id));
    document.getElementById("selectAllDevices").checked = selectedOnPage;
    document.getElementById("devicePageInfo").textContent = `Página ${devicePage} de ${totalPages}`;
    document.getElementById("deviceManagerCount").textContent = `${filtered.length} de ${devices.length} dispositivos`;
    document.getElementById("selectedDevicesCount").textContent = `${selectedDeviceIds.size} selecionados`;
    document.getElementById("prevDevicePage").disabled = devicePage <= 1;
    document.getElementById("nextDevicePage").disabled = devicePage >= totalPages;
  }

  function getFilteredDevices() {
    const search = normalize(document.getElementById("deviceSearch").value);
    const status = document.getElementById("statusFilter").value;
    const os = document.getElementById("osFilter").value;
    const group = document.getElementById("groupFilter").value;

    return devices.filter((device) => {
      const tagText = device.tags.join(" ");
      const matchesSearch = !search || normalize(`${device.name} ${device.ip} ${tagText}`).includes(search);
      const matchesStatus = status === "all" || device.status === status;
      const matchesOs = os === "all" || device.os === os;
      const matchesGroup = group === "all" || device.group === group;

      return matchesSearch && matchesStatus && matchesOs && matchesGroup;
    });
  }

  function resetDeviceFilters() {
    devicePage = 1;
    renderDeviceManager();
  }

  function togglePageSelection(event) {
    getCurrentPageDevices().forEach((device) => {
      if (event.target.checked) {
        selectedDeviceIds.add(device.id);
      } else {
        selectedDeviceIds.delete(device.id);
      }
    });
    renderDeviceManager();
  }

  function getCurrentPageDevices() {
    const filtered = getFilteredDevices();
    const start = (devicePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }

  function changeDevicePage(delta) {
    const totalPages = Math.max(1, Math.ceil(getFilteredDevices().length / pageSize));
    devicePage = Math.min(Math.max(devicePage + delta, 1), totalPages);
    renderDeviceManager();
  }

  function handleDeviceTableChange(event) {
    if (!event.target.classList.contains("device-select")) {
      return;
    }

    if (event.target.checked) {
      selectedDeviceIds.add(event.target.dataset.deviceId);
    } else {
      selectedDeviceIds.delete(event.target.dataset.deviceId);
    }

    renderDeviceManager();
  }

  function handleDeviceTableClick(event) {
    const button = event.target.closest("[data-device-action]");
    if (!button) {
      return;
    }

    const deviceId = button.dataset.deviceId;
    const action = button.dataset.deviceAction;

    if (action === "view") {
      openDeviceDetail(deviceId);
    } else if (action === "mirror") {
      openMirror(deviceId);
    } else if (action === "edit") {
      openDeviceEdit(deviceId);
    } else if (action === "terminal") {
      openTerminal(deviceId);
    } else if (action === "remove") {
      removeDevice(deviceId);
    }
  }

  function handleDeviceContextMenu(event) {
    const row = event.target.closest("[data-device-id]");
    const deviceId = row?.dataset.deviceId;

    if (!deviceId || !findDevice(deviceId)) {
      return;
    }

    event.preventDefault();
    contextDeviceId = deviceId;
    consoleDeviceId = deviceId;
    renderConnectedConsole();
    showContextMenu(event.clientX, event.clientY);
  }

  function showContextMenu(x, y) {
    const menu = document.getElementById("deviceContextMenu");
    menu.innerHTML = `
      <div class="ops-context-item has-submenu">
        <button type="button" data-context-action="managers">Gerenciadores <span>›</span></button>
        <div class="ops-context-submenu">
          <button type="button" data-context-action="files">Arquivos</button>
          <button type="button" data-context-action="sms">SMS</button>
          <button type="button" data-context-action="calls">Chamadas</button>
          <button type="button" data-context-action="contacts">Contatos</button>
          <button type="button" data-context-action="accounts">Contas</button>
          <button type="button" data-context-action="applications">Aplicativos</button>
          <button type="button" data-context-action="permissions">Permissoes</button>
        </div>
      </div>
      <div class="ops-context-item has-submenu">
        <button type="button" data-context-action="monitors">Monitores <span>›</span></button>
        <div class="ops-context-submenu">
          <button type="button" data-context-action="screen">Tela</button>
          <button type="button" data-context-action="network">Rede</button>
          <button type="button" data-context-action="battery">Bateria</button>
        </div>
      </div>
      <div class="ops-context-item"><button type="button" data-context-action="admin">Admin</button></div>
      <div class="ops-context-item"><button type="button" data-context-action="tools">Ferramentas</button></div>
      <div class="ops-context-item"><button type="button" data-context-action="connection">Conexao</button></div>
      <div class="ops-context-item"><button type="button" data-context-action="keyboard">Teclado virtual</button></div>
      <div class="ops-context-item"><button type="button" data-context-action="client-folder">Pasta do cliente</button></div>
    `;
    menu.hidden = false;
    menu.style.left = `${Math.min(x, window.innerWidth - 270)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - 320)}px`;
  }

  function hideContextMenu() {
    document.getElementById("deviceContextMenu").hidden = true;
  }

  function handleContextMenuClick(event) {
    const button = event.target.closest("[data-context-action]");
    const device = findDevice(contextDeviceId);

    if (!button || !device) {
      return;
    }

    event.stopPropagation();
    const action = button.dataset.contextAction;
    const labels = {
      files: "Arquivos",
      sms: "SMS",
      calls: "Chamadas",
      contacts: "Contatos",
      accounts: "Contas",
      applications: "Aplicativos",
      permissions: "Permissões",
      screen: "Tela",
      network: "Rede",
      battery: "Bateria",
      admin: "Admin",
      tools: "Ferramentas",
      connection: "Conexão",
      keyboard: "Teclado virtual",
      "client-folder": "Pasta do cliente"
    };

    if (action === "files") {
      openFileTransfer(device.id);
    } else if (action === "applications") {
      openDeviceDetail(device.id, "software");
    } else if (action === "screen") {
      openMirror(device.id);
    } else if (action === "connection") {
      openTerminal(device.id);
    } else if (!["managers", "monitors"].includes(action)) {
      renderConsoleActionOutput(labels[action] || "Ação");
      showToast(`${labels[action] || "Ação"} simulada`, "success");
    }

    if (!["managers", "monitors"].includes(action)) {
      hideContextMenu();
    }
  }

  function resetMirrorControls() {
    document.getElementById("saveMirror").checked = false;
    document.getElementById("blockMirror").checked = false;
    document.getElementById("controlMirror").checked = false;
    document.getElementById("mirrorMode").value = "Silent";
    document.getElementById("mirrorFps").value = "30";
    document.getElementById("mirrorQuality").value = "100";
  }

  function updateMirrorState(state) {
    const modal = document.getElementById("mirrorModal");

    if (!modal.open) {
      return;
    }

    document.getElementById("mirrorConnectionState").textContent = state;
    document.getElementById("mirrorRuntimeStatus").dataset.state = state.toLowerCase();
    updateMirrorSettings(false);
    showToast(`Espelhamento ${state.toLowerCase()} no painel`, state === "Pausado" ? "error" : "success");
  }

  function updateMirrorSettings(announce = true) {
    const mode = document.getElementById("mirrorMode").value;
    const fps = document.getElementById("mirrorFps").value;
    const quality = document.getElementById("mirrorQuality").value;
    const save = document.getElementById("saveMirror").checked;
    const block = document.getElementById("blockMirror").checked;
    const control = document.getElementById("controlMirror").checked;
    const state = document.getElementById("mirrorConnectionState").textContent || "Espelhando";
    const runtime = document.getElementById("mirrorRuntimeStatus");
    const device = findDevice(mirrorDeviceId || consoleDeviceId);

    runtime.dataset.state = state.toLowerCase();
    runtime.innerHTML = `
      ${state} · modo ${mode} · ${fps} FPS · qualidade ${quality}%
      <span>Salvar ${save ? "ON" : "OFF"} · Bloquear ${block ? "ON" : "OFF"} · Controle ${control ? "ON" : "OFF"}</span>
    `;

    if (device) {
      document.getElementById("consoleActionOutput").innerHTML = `
        <strong>Espelhamento</strong>
        <span>${device.name} · ${device.ip}</span>
        <em>${mode} · ${fps} FPS · qualidade ${quality}% · controles simulados</em>
      `;
    }

    if (announce) {
      showToast(`Espelhamento ajustado: ${fps} FPS, qualidade ${quality}%`, "success");
    }
  }

  function applyDistribution() {
    const account = getBankAccount(document.getElementById("distributionAccount").value);
    const limit = Number(document.getElementById("distributionLimit").value);
    const amount = Number(document.getElementById("distributionAmount").value);
    const selectedDevices = devices.filter((device) => selectedDeviceIds.has(device.id));
    const result = document.getElementById("distributionResult");

    if (!account || !selectedDevices.length || !limit || !amount) {
      result.textContent = "Escolha conta, limite, valor e pelo menos um dispositivo.";
      showToast("Distribuição incompleta", "error");
      return;
    }

    let allocated = 0;
    const processed = [];
    const skipped = [];

    selectedDevices.forEach((device) => {
      if (allocated + amount > limit) {
        skipped.push(device.name);
        return;
      }

      allocated += amount;
      device.bankAccountId = account.id;
      device.transferAmount += amount;
      device.distributionReceived += amount;
      device.transferred = true;
      device.status = "inactive";
      device.lastSeen = "desconectado automático";
      processed.push(device.name);
    });

    account.balance = Math.max(0, account.balance - allocated);
    account.totalTransferred += allocated;
    account.runningAmount = Math.min(limit, allocated);
    account.runningTransfers += processed.length;

    alerts.unshift({
      id: `alt-${Date.now()}`,
      type: "info",
      title: "Distribuição simulada",
      message: `${formatCurrency(allocated)} distribuídos para ${processed.length} dispositivo(s).`,
      time: "agora",
      read: false
    });

    result.innerHTML = `
      <strong>${formatCurrency(allocated)} simulados</strong>
      <span>${processed.length} dispositivo(s) processados · limite ${formatCurrency(limit)}</span>
      ${skipped.length ? `<em>${skipped.length} ficaram fora do limite.</em>` : ""}
    `;
    renderAll();
    document.getElementById("syncStatus").textContent = "Distribuição simulada concluída";
    showToast("Distribuição simulada", "success");
  }

  function removeDevice(deviceId) {
    const index = devices.findIndex((device) => device.id === deviceId);
    if (index < 0) {
      return;
    }

    const [removed] = devices.splice(index, 1);
    selectedDeviceIds.delete(deviceId);
    alerts.unshift({
      id: `alt-${Date.now()}`,
      type: "warn",
      title: "Dispositivo removido",
      message: `${removed.name} foi removido da base local simulada.`,
      time: "agora",
      read: false
    });
    renderAll();
    showToast("Dispositivo removido", "success");
  }

  function batchRemoveDevices() {
    const ids = [...selectedDeviceIds];
    if (!ids.length) {
      showToast("Selecione dispositivos primeiro", "error");
      return;
    }

    ids.forEach((id) => removeDevice(id));
    selectedDeviceIds = new Set();
    renderAll();
  }

  function batchUpdateAgents() {
    const selected = devices.filter((device) => selectedDeviceIds.has(device.id));
    if (!selected.length) {
      showToast("Selecione dispositivos primeiro", "error");
      return;
    }

    selected.forEach((device) => {
      device.agentVersion = "2.8.5";
      device.lastUpdate = "agora";
    });
    renderAll();
    showToast("Agentes atualizados na simulação", "success");
  }

  function renderAlerts() {
    const list = document.getElementById("alertsList");
    const unread = alerts.filter((alert) => !alert.read).length;

    list.replaceChildren();
    document.getElementById("navAlertCount").textContent = String(unread);

    alerts.forEach((alert) => {
      const item = document.createElement("article");
      item.className = `ops-alert-item alert-${alert.type}${alert.read ? " is-read" : ""}`;
      item.dataset.alertId = alert.id;
      item.innerHTML = `
        <span class="ops-alert-icon">${alertIcon(alert.type)}</span>
        <div class="ops-alert-copy">
          <strong>${alert.title}</strong>
          <p>${alert.message}</p>
          <time>${alert.time}</time>
          <div class="ops-alert-actions">
            <button type="button" data-action="ignore">Ignorar</button>
            <button type="button" data-action="read">Marcar como lido</button>
          </div>
        </div>
      `;
      item.querySelector('[data-action="ignore"]').addEventListener("click", () => ignoreAlert(alert.id));
      item.querySelector('[data-action="read"]').addEventListener("click", () => markAlertRead(alert.id));
      list.append(item);
    });
  }

  function setRange(range) {
    selectedRange = range;
    document.querySelectorAll("[data-range]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.range) === range);
    });
    renderLineChart();
  }

  function syncNow() {
    const syncButton = document.getElementById("syncNow");
    const syncStatus = document.getElementById("syncStatus");

    syncButton.classList.add("is-working");
    syncStatus.textContent = "Sincronizando status...";

    window.setTimeout(() => {
      devices.forEach((device) => {
        if (device.status === "connecting" && Math.random() > 0.35) {
          device.status = "active";
          device.lastSeen = "agora";
        }
        device.tx += randomBetween(1200000, 9200000);
        device.rx += randomBetween(600000, 5100000);
      });

      syncButton.classList.remove("is-working");
      syncStatus.textContent = `Atualizado às ${currentTime()}`;
      renderAll();
      showToast("Status sincronizados", "success");
    }, 900);
  }

  function toggleAiMode() {
    aiMode = !aiMode;
    const button = document.getElementById("toggleAi");
    const badge = document.getElementById("aiBadge");

    button.setAttribute("aria-pressed", String(aiMode));
    button.classList.toggle("is-enabled", aiMode);
    badge.textContent = aiMode ? "ON" : "OFF";
    showToast(aiMode ? "Modo automático ativado" : "Modo automático desativado", "success");
  }

  function openKillSwitch() {
    const modal = document.getElementById("killSwitchModal");
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  function closeKillSwitch() {
    const modal = document.getElementById("killSwitchModal");
    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }
  }

  function executeKillSwitch() {
    closeKillSwitch();

    devices.forEach((device) => {
      device.status = "inactive";
      device.lastSeen = "desconectado";
    });

    alerts.unshift({
      id: `alt-${Date.now()}`,
      type: "danger",
      title: "Kill switch simulado",
      message: "Desconexão geral executada em modo de simulação. Nenhum dado real foi removido.",
      time: "agora",
      read: false
    });

    renderAll();
    closeDrawer();
    document.getElementById("syncStatus").textContent = "Kill switch simulado executado";
    showToast("Desconexão geral simulada", "success");
  }

  function openDrawer(device) {
    const drawer = document.getElementById("deviceDrawer");
    const visual = getDeviceVisual(device);
    const bank = getBankAccount(device.bankAccountId);
    const disconnectButton = document.getElementById("disconnectDevice");

    selectedDeviceId = device.id;
    document.getElementById("drawerDeviceName").textContent = device.name;
    document.getElementById("drawerStatus").textContent = STATUS[device.status].label;
    document.getElementById("drawerStatusDot").style.background = visual.color;
    document.getElementById("drawerIp").textContent = device.ip;
    document.getElementById("drawerOs").textContent = device.os;
    document.getElementById("drawerLocation").textContent = device.city;
    document.getElementById("drawerBank").textContent = bank ? `${bank.bank} · ${bank.account} · Saldo ${formatCurrency(bank.balance)}` : "Sem conta vinculada";
    document.getElementById("drawerTransfer").textContent = formatTransferStatus(device);
    document.getElementById("drawerLastSeen").textContent = device.lastSeen;
    document.getElementById("drawerTraffic").textContent = `${formatBytes(device.tx)} enviados / ${formatBytes(device.rx)} recebidos`;
    disconnectButton.disabled = device.status === "inactive";
    disconnectButton.textContent = device.status === "inactive" ? "Dispositivo desconectado" : "Desconectar dispositivo";
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    const drawer = document.getElementById("deviceDrawer");
    selectedDeviceId = null;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function disconnectSelectedDevice() {
    const device = devices.find((item) => item.id === selectedDeviceId);

    if (!device || device.status === "inactive") {
      return;
    }

    device.status = "inactive";
    device.lastSeen = "desconectado";
    alerts.unshift({
      id: `alt-${Date.now()}`,
      type: "warn",
      title: "Dispositivo desconectado",
      message: `${device.name} foi desconectado manualmente do painel.`,
      time: "agora",
      read: false
    });

    renderAll();
    openDrawer(device);
    document.getElementById("syncStatus").textContent = `${device.name} desconectado`;
    showToast("Dispositivo desconectado", "success");
  }

  function openDeviceDetail(deviceId, tabName = "general") {
    const device = findDevice(deviceId);
    if (!device) {
      return;
    }

    detailDeviceId = deviceId;
    detailTab = tabName;
    document.getElementById("deviceDetailTitle").textContent = device.name;
    renderDeviceDetail();
    openDialog(document.getElementById("deviceDetailModal"));
  }

  function closeDeviceDetail() {
    closeDialog(document.getElementById("deviceDetailModal"));
    detailDeviceId = null;
  }

  function setDeviceDetailTab(tabName) {
    detailTab = tabName;
    renderDeviceDetail();
  }

  function renderDeviceDetail() {
    const device = findDevice(detailDeviceId);
    const body = document.getElementById("deviceDetailBody");

    if (!device) {
      return;
    }

    document.querySelectorAll("[data-device-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.deviceTab === detailTab);
    });

    if (detailTab === "general") {
      body.innerHTML = detailGrid([
        ["Nome", device.name],
        ["IP", device.ip],
        ["MAC", device.mac],
        ["Versão do SO", device.osVersion],
        ["Agente instalado", device.agentVersion],
        ["Última atualização", device.lastUpdate],
        ["Grupo", device.group],
        ["Tags", device.tags.join(", ") || "sem tags"]
      ]);
    } else if (detailTab === "hardware") {
      body.innerHTML = detailGrid([
        ["CPU", device.hardware.cpu],
        ["Memória", device.hardware.memory],
        ["Discos", device.hardware.disks],
        ["Placa de rede", device.hardware.network]
      ]);
    } else if (detailTab === "software") {
      body.innerHTML = `
        <div class="ops-detail-section">
          <strong>Apps bancários</strong>
          ${detailList(device.bankingApps.length ? device.bankingApps : ["Nenhum app bancário no inventário"])}
        </div>
        <div class="ops-detail-section">
          <strong>Aplicativos instalados</strong>
          ${detailList(device.software)}
        </div>
      `;
    } else if (detailTab === "alerts") {
      body.innerHTML = detailList(device.alertHistory.length ? device.alertHistory : ["Sem alertas registrados"]);
    } else if (detailTab === "metrics") {
      body.innerHTML = renderDeviceMetricDashboard(device);
      body.querySelector("[data-metric-save]").addEventListener("click", () => saveMetricThresholds(device));
    } else {
      body.innerHTML = `
        <div class="ops-detail-actions">
          <button type="button" data-detail-action="terminal">Executar comando</button>
          <button type="button" data-detail-action="transfer">Transferir arquivo</button>
          <button type="button" data-detail-action="screenshot">Capturar tela</button>
          <button type="button" data-detail-action="metrics">Monitorar métricas</button>
        </div>
        <p class="ops-safe-note">Ações demonstrativas: nenhum comando real é enviado ao dispositivo.</p>
      `;
      body.querySelector('[data-detail-action="terminal"]').addEventListener("click", () => openTerminal(device.id));
      body.querySelector('[data-detail-action="transfer"]').addEventListener("click", () => openFileTransfer(device.id));
      body.querySelector('[data-detail-action="screenshot"]').addEventListener("click", () => requestSimulatedScreenshot(device));
      body.querySelector('[data-detail-action="metrics"]').addEventListener("click", () => setDeviceDetailTab("metrics"));
    }
  }

  function renderDeviceMetricDashboard(device) {
    const snapshot = getDeviceMetricSnapshot(device);
    const cards = [
      ["CPU", `${snapshot.cpu}%`, snapshot.cpu, "#7bcfc7"],
      ["Memória", `${snapshot.memory}%`, snapshot.memory, "#d2a24e"],
      ["Disco", `${snapshot.disk}%`, snapshot.disk, "#9bc9ff"],
      ["Rede", formatBytes(snapshot.network), Math.min(100, Math.round(snapshot.network / 1200000)), "#d46b6b"]
    ];

    return `
      <div class="ops-device-metrics">
        <div class="ops-device-metric-grid">
          ${cards.map(([label, value, percent, color]) => `
            <article>
              <span>${label}</span>
              <strong>${value}</strong>
              <div><i style="width:${percent}%; background:${color}"></i></div>
            </article>
          `).join("")}
        </div>
        <div class="ops-metric-history">
          <section>
            <strong>Últimas 24h</strong>
            ${metricLine(metricTrend(device, 24), "#7bcfc7")}
          </section>
          <section>
            <strong>Últimos 7d</strong>
            ${metricLine(metricTrend(device, 7), "#d2a24e")}
          </section>
        </div>
        <div class="ops-threshold-panel">
          <strong>Limites de alerta</strong>
          <label>CPU acima de (%)<input data-threshold="cpu" type="number" min="1" max="100" value="80"></label>
          <label>Memória acima de (%)<input data-threshold="memory" type="number" min="1" max="100" value="85"></label>
          <label>Duração mínima (min)<input data-threshold="minutes" type="number" min="1" max="60" value="5"></label>
          <div class="ops-notify-options">
            <label><input type="checkbox" data-notify="email" checked> E-mail</label>
            <label><input type="checkbox" data-notify="webhook"> Webhook</label>
            <label><input type="checkbox" data-notify="panel" checked> Painel</label>
          </div>
          <button class="ops-small-btn" data-metric-save type="button">Salvar limites</button>
        </div>
      </div>
    `;
  }

  function getDeviceMetricSnapshot(device) {
    const seed = [...device.id, ...device.ip].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return {
      cpu: 18 + (seed % 64),
      memory: 24 + ((seed * 3) % 59),
      disk: 32 + ((seed * 5) % 52),
      network: Math.max(380000, Math.round((device.tx + device.rx) / 900))
    };
  }

  function metricTrend(device, salt) {
    const seed = [...device.id].reduce((sum, char) => sum + char.charCodeAt(0), salt);
    return Array.from({ length: 18 }, (_, index) => 20 + ((seed + index * 13 + salt * 7) % 72));
  }

  function metricLine(values, color) {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 240;
      const y = 86 - (value / 100) * 72;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    return `
      <svg viewBox="0 0 240 96" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg>
    `;
  }

  function saveMetricThresholds(device) {
    const body = document.getElementById("deviceDetailBody");
    const cpu = body.querySelector('[data-threshold="cpu"]').value;
    const memory = body.querySelector('[data-threshold="memory"]').value;
    const minutes = body.querySelector('[data-threshold="minutes"]').value;
    const channels = [...body.querySelectorAll("[data-notify]:checked")].map((item) => item.dataset.notify).join(", ");

    alerts.unshift({
      id: `alt-${Date.now()}`,
      type: "info",
      title: "Limites configurados",
      message: `${device.name}: CPU > ${cpu}% ou memória > ${memory}% por ${minutes} min. Notificações: ${channels || "nenhuma"}.`,
      time: "agora",
      read: false
    });

    renderAlerts();
    showToast("Limites de métricas salvos", "success");
  }

  function requestSimulatedScreenshot(device) {
    terminalAudit.unshift({
      device: device.name,
      command: "captura de tela simulada",
      time: currentTime()
    });
    renderTerminalLists();
    showToast("Captura simulada registrada para auditoria", "success");
  }

  function openDeviceEdit(deviceId) {
    const device = findDevice(deviceId);
    if (!device) {
      return;
    }

    editDeviceId = deviceId;
    document.getElementById("editDeviceName").value = device.name;
    document.getElementById("editDeviceGroup").value = device.group;
    document.getElementById("editDeviceTags").value = device.tags.join(", ");
    document.getElementById("editDeviceNotes").value = device.notes;
    openDialog(document.getElementById("deviceEditModal"));
  }

  function closeDeviceEdit() {
    closeDialog(document.getElementById("deviceEditModal"));
    editDeviceId = null;
  }

  function saveDeviceEdit(event) {
    event.preventDefault();
    const device = findDevice(editDeviceId);

    if (!device) {
      return;
    }

    device.name = document.getElementById("editDeviceName").value.trim() || device.name;
    device.group = document.getElementById("editDeviceGroup").value.trim() || "Sem grupo";
    device.tags = document.getElementById("editDeviceTags").value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    device.notes = document.getElementById("editDeviceNotes").value.trim();

    closeDeviceEdit();
    renderAll();
    showToast("Dispositivo atualizado", "success");
  }

  function openTerminal(deviceId) {
    const device = findDevice(deviceId);
    terminalDeviceId = device?.id || terminalDeviceId || devices[0]?.id || null;
    const target = findDevice(terminalDeviceId)?.name || `${selectedDeviceIds.size} selecionados`;

    renderDeviceSelects();
    document.getElementById("terminalDeviceSelect").value = terminalDeviceId || "";
    document.getElementById("terminalTitle").textContent = `Terminal simulado · ${target}`;
    document.getElementById("terminalOutput").textContent = `Sessão demonstrativa iniciada para ${target}.\nNenhum comando real será executado.\nTodos os comandos ficam registrados no log de auditoria.`;
    document.getElementById("terminalCommand").value = "";
    renderTerminalLists();
    openDialog(document.getElementById("terminalModal"));
  }

  function openTerminalForSelection(mode) {
    if (!selectedDeviceIds.size) {
      showToast("Selecione dispositivos primeiro", "error");
      return;
    }

    terminalDeviceId = [...selectedDeviceIds][0];
    openTerminal(terminalDeviceId);
    document.getElementById("terminalOutput").textContent += `\nModo em lote: ${mode === "script" ? "executar script" : "ação administrativa"} para ${selectedDeviceIds.size} dispositivo(s).`;
  }

  function closeTerminal() {
    closeDialog(document.getElementById("terminalModal"));
  }

  function setTerminalDevice(deviceId) {
    terminalDeviceId = deviceId;
    const device = findDevice(deviceId);

    if (!device) {
      return;
    }

    document.getElementById("terminalTitle").textContent = `Terminal simulado · ${device.name}`;
    document.getElementById("terminalOutput").textContent += `\n[${currentTime()}] dispositivo selecionado: ${device.name} (${device.ip})`;
    renderTerminalLists();
  }

  function runTerminalCommand() {
    const input = document.getElementById("terminalCommand");
    const output = document.getElementById("terminalOutput");
    const command = input.value.trim() || "status";
    const device = findDevice(terminalDeviceId) || devices[0];
    const time = currentTime();

    terminalHistory.unshift(command);
    terminalAudit.unshift({ device: device.name, command, time });
    output.textContent += `\n${device.name} $ ${command}\n[${time}] [simulado] comando registrado apenas no painel e auditado.`;
    input.value = "";
    renderTerminalLists();
  }

  function clearTerminalSession() {
    const device = findDevice(terminalDeviceId);
    document.getElementById("terminalOutput").textContent = `Sessão limpa para ${device ? device.name : "dispositivo selecionado"}.\nAuditoria preservada.`;
    showToast("Terminal limpo", "success");
  }

  function exportTerminalSession() {
    const output = document.getElementById("terminalOutput").textContent;
    const audit = terminalAudit.map((item) => `[${item.time}] ${item.device}: ${item.command}`).join("\n");
    const blob = new Blob([`${output}\n\nAuditoria\n${audit}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `terminal-simulado-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Sessão exportada", "success");
  }

  function renderTerminalLists() {
    const history = document.getElementById("terminalHistory");
    const audit = document.getElementById("terminalAudit");

    if (!history || !audit) {
      return;
    }

    history.innerHTML = terminalHistory.length
      ? terminalHistory.slice(0, 8).map((command) => `<li>${command}</li>`).join("")
      : "<li>Nenhum comando ainda</li>";
    audit.innerHTML = terminalAudit.length
      ? terminalAudit.slice(0, 8).map((item) => `<li><span>${item.time}</span>${item.device}<br>${item.command}</li>`).join("")
      : "<li>Sem eventos auditados</li>";
  }

  function openFileTransfer(deviceId) {
    const device = findDevice(deviceId);

    if (!device) {
      return;
    }

    fileTransferDeviceId = device.id;
    selectedRemotePath = "/home/operador";
    renderDeviceSelects();
    document.getElementById("fileDeviceSelect").value = device.id;
    document.getElementById("fileTransferTitle").textContent = `Transferência simulada · ${device.name}`;
    renderFileTransfer();
    openDialog(document.getElementById("fileTransferModal"));
  }

  function closeFileTransfer() {
    closeDialog(document.getElementById("fileTransferModal"));
  }

  function getRemoteEntries(device) {
    const base = normalize(device.name).replace(/[^a-z0-9]+/g, "-") || "dispositivo";
    return [
      { path: "/", label: "/", type: "folder", depth: 0, size: "--" },
      { path: "/home", label: "home", type: "folder", depth: 1, size: "--" },
      { path: "/home/operador", label: "operador", type: "folder", depth: 2, size: "--" },
      { path: "/home/operador/documentos", label: "documentos", type: "folder", depth: 3, size: "--" },
      { path: `/home/operador/documentos/${base}-inventario.csv`, label: `${base}-inventario.csv`, type: "file", depth: 4, size: "42 KB" },
      { path: "/home/operador/downloads", label: "downloads", type: "folder", depth: 3, size: "--" },
      { path: "/home/operador/downloads/log-auditoria.txt", label: "log-auditoria.txt", type: "file", depth: 4, size: "18 KB" },
      { path: "/var", label: "var", type: "folder", depth: 1, size: "--" },
      { path: "/var/log", label: "log", type: "folder", depth: 2, size: "--" },
      { path: "/var/log/agente.log", label: "agente.log", type: "file", depth: 3, size: "86 KB" }
    ];
  }

  function renderFileTransfer() {
    const device = findDevice(fileTransferDeviceId);
    const tree = document.getElementById("remoteFileTree");
    const list = document.getElementById("remoteFileList");

    if (!device) {
      return;
    }

    const entries = getRemoteEntries(device);
    const selected = entries.find((entry) => entry.path === selectedRemotePath) || entries[2];
    selectedRemotePath = selected.path;

    tree.innerHTML = entries.map((entry) => `
      <button class="${entry.path === selectedRemotePath ? "is-selected" : ""}" type="button" data-file-path="${entry.path}" style="--depth:${entry.depth}">
        <span>${entry.type === "folder" ? "▸" : "•"}</span>${entry.label}
      </button>
    `).join("");

    const children = entries.filter((entry) => dirname(entry.path) === selected.path && entry.path !== selected.path);
    const visibleEntries = children.length ? children : [selected];

    list.innerHTML = `
      <header>
        <strong>${selected.path}</strong>
        <span>${device.name} · ${device.ip}</span>
      </header>
      <table>
        <thead><tr><th>Nome</th><th>Tipo</th><th>Tamanho</th><th>Status</th></tr></thead>
        <tbody>
          ${visibleEntries.map((entry) => `
            <tr>
              <td>${entry.label}</td>
              <td>${entry.type === "folder" ? "Pasta" : "Arquivo"}</td>
              <td>${entry.size}</td>
              <td>simulado</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function handleRemoteTreeClick(event) {
    const button = event.target.closest("[data-file-path]");

    if (!button) {
      return;
    }

    selectedRemotePath = button.dataset.filePath;
    renderFileTransfer();
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const device = findDevice(fileTransferDeviceId);

    if (!file || !device) {
      return;
    }

    showToast(`Upload simulado: ${file.name} para ${device.name}`, "success");
    event.target.value = "";
  }

  function simulateFileAction(action) {
    const device = findDevice(fileTransferDeviceId);

    if (!device) {
      return;
    }

    showToast(`${action} simulada em ${selectedRemotePath}`, action === "Excluir" ? "error" : "success");
  }

  function downloadRemoteFile() {
    const device = findDevice(fileTransferDeviceId);

    if (!device) {
      return;
    }

    const blob = new Blob([
      `Download remoto simulado\nDispositivo: ${device.name}\nOrigem: ${selectedRemotePath}\nNenhum arquivo real foi acessado.`
    ], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `download-simulado-${device.id}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Download simulado exportado", "success");
  }

  function dirname(path) {
    if (path === "/") {
      return "";
    }

    const parts = path.split("/");
    parts.pop();
    return parts.join("/") || "/";
  }

  function openMirror(deviceId) {
    const device = findDevice(deviceId);

    if (!device) {
      return;
    }

    if (!["Android", "iOS"].includes(device.os)) {
      showToast("Espelhamento disponível apenas para celulares", "error");
      return;
    }

    if (device.status === "inactive") {
      showToast("Celular offline para espelhamento", "error");
      return;
    }

    mirrorDeviceId = device.id;
    consoleDeviceId = device.id;
    resetMirrorControls();
    document.getElementById("mirrorTitle").textContent = `Espelhamento · ${device.name}`;
    document.getElementById("mirrorDeviceName").textContent = device.name;
    document.getElementById("mirrorConnectionState").textContent = "Espelhando";
    document.getElementById("mirrorAppGrid").innerHTML = device.software
      .slice(0, 9)
      .map((app) => `<span class="${device.bankingApps.includes(app) ? "is-bank" : ""}"><i></i>${app}</span>`)
      .join("");
    document.getElementById("mirrorInfoFields").innerHTML = `
      <div><dt>IP</dt><dd>${device.ip}</dd></div>
      <div><dt>Sistema</dt><dd>${device.osVersion}</dd></div>
      <div><dt>Apps bancários</dt><dd>${device.bankingApps.length || 0}</dd></div>
      <div><dt>Status</dt><dd>${statusTableLabel(device.status)}</dd></div>
    `;

    openDialog(document.getElementById("mirrorModal"));
    updateMirrorSettings(false);
    renderConnectedConsole();
    document.getElementById("syncStatus").textContent = `${device.name} em espelhamento simulado`;
    showToast("Espelhamento simulado iniciado", "success");
  }

  function closeMirror() {
    closeDialog(document.getElementById("mirrorModal"));
    document.getElementById("mirrorConnectionState").textContent = "Encerrado";
    document.getElementById("mirrorRuntimeStatus").dataset.state = "encerrado";
    document.getElementById("mirrorRuntimeStatus").textContent = "Espelhamento encerrado no painel";
    mirrorDeviceId = null;
  }

  function ignoreAlert(id) {
    alerts = alerts.filter((alert) => alert.id !== id);
    renderAlerts();
    showToast("Alerta ignorado", "success");
  }

  function markAlertRead(id) {
    alerts = alerts.map((alert) => alert.id === id ? { ...alert, read: true } : alert);
    renderAlerts();
    showToast("Alerta marcado como lido", "success");
  }

  function exportAlertsCsv() {
    const header = ["tipo", "titulo", "mensagem", "data_hora", "lido"];
    const rows = alerts.map((alert) => [
      alert.type,
      alert.title,
      alert.message,
      alert.time,
      alert.read ? "sim" : "nao"
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alertas-espartano-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("CSV de alertas exportado", "success");
  }

  function simulateRealtimeDrift() {
    const candidates = devices.filter((device) => device.status !== "inactive");
    if (!candidates.length) {
      return;
    }

    const target = candidates[Math.floor(Math.random() * candidates.length)];
    target.tx += randomBetween(250000, 2400000);
    target.rx += randomBetween(120000, 1300000);
    target.lastSeen = "agora";
    renderMetrics();
    document.getElementById("syncStatus").textContent = `Atualização automática às ${currentTime()}`;
  }

  function showMapTooltip(event, device, tooltip) {
    const visual = getDeviceVisual(device);
    tooltip.innerHTML = `
      <strong>${device.name}</strong>
      <span>${device.city} · ${device.ip}</span>
      <em style="color:${visual.color}">${device.transferred ? `${TRANSFER_VISUAL.label} · ${formatCurrency(device.transferAmount)}` : STATUS[device.status].label}</em>
    `;
    positionTooltip(event, tooltip);
    tooltip.classList.add("show");
  }

  function positionTooltip(event, tooltip) {
    const rect = document.getElementById("mapCanvas").getBoundingClientRect();
    const x = Math.min(event.clientX - rect.left + 12, rect.width - 190);
    const y = Math.max(event.clientY - rect.top - 58, 8);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function tickClock() {
    document.getElementById("clock").textContent = currentTime();
  }

  function currentTime() {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
  }

  function projectBrazil(lat, lng) {
    const { width, height, padding, bounds } = BRAZIL_MAP;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    return {
      x: padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * usableWidth,
      y: padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * usableHeight
    };
  }

  function geoPath(points, closePath) {
    const commands = points.map((point, index) => {
      const projected = projectBrazil(point[0], point[1]);
      return `${index === 0 ? "M" : "L"}${projected.x.toFixed(1)} ${projected.y.toFixed(1)}`;
    });

    return `${commands.join(" ")}${closePath ? " Z" : ""}`;
  }

  function isBrazilDevice(device) {
    return device.country === "BR";
  }

  function getDeviceVisual(device) {
    return device.transferred ? TRANSFER_VISUAL : STATUS[device.status];
  }

  function getBankAccount(id) {
    return bankAccounts.find((account) => account.id === id);
  }

  function formatTransferStatus(device) {
    if (device.transferred) {
      return `Concluída · ${formatCurrency(device.transferAmount)}`;
    }

    if (device.transferAmount > 0) {
      return `Rodando · ${formatCurrency(device.transferAmount)}`;
    }

    return "Sem transferência";
  }

  function findDevice(id) {
    return devices.find((device) => device.id === id);
  }

  function statusTableLabel(status) {
    if (status === "active") {
      return "Online";
    }
    if (status === "inactive") {
      return "Offline";
    }
    return "Conectando";
  }

  function detailGrid(rows) {
    return `
      <dl class="ops-detail-grid">
        ${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
      </dl>
    `;
  }

  function detailList(items) {
    return `<ul class="ops-detail-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function countBy(items, key) {
    return items.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  }

  function formatBytes(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toLocaleString("pt-BR", { maximumFractionDigits: value >= 10 ? 1 : 2 })} ${units[unitIndex]}`;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(value);
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function alertIcon(type) {
    if (type === "danger") {
      return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path></svg>`;
    }
    if (type === "warn") {
      return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`;
    }
    return `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;
  }

  function csvCell(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  function svg(tagName) {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
  }

  function svgTitle(text) {
    const title = svg("title");
    title.textContent = text;
    return title;
  }

  function showToast(message, type) {
    const toast = document.getElementById("dashboardToast");
    const toastMessage = document.getElementById("dashboardToastMessage");

    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.toggle("success", type === "success");
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function readStoredUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.user) || sessionStorage.getItem(STORAGE_KEYS.user);
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function isExpired(exp) {
    return Number(exp) * 1000 <= Date.now();
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
    localStorage.removeItem(STORAGE_KEYS.user);
    sessionStorage.removeItem(STORAGE_KEYS.session);
    sessionStorage.removeItem(STORAGE_KEYS.user);
  }
})();
