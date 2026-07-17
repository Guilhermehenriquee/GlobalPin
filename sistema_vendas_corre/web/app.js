"use strict";

const STORAGE_KEY = "vendas-corre-web-state-v5";
const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");

const ROLES = {
  supremo: "Usuário Supremo",
  vendedor: "Vendedor",
  entregador: "Entregador"
};

const ROLE_BADGES = {
  supremo: "purple",
  vendedor: "green",
  entregador: "amber"
};

const MENU = {
  supremo: [
    ["dashboard", "Painel", "grid"],
    ["newOrder", "Nova venda", "cart"],
    ["orders", "Pedidos", "receipt"],
    ["deliveries", "Entregas", "truck"],
    ["drivers", "Motoristas", "driver"],
    ["tasks", "Tarefas", "task"],
    ["products", "Produtos", "box"],
    ["clients", "Clientes", "users"],
    ["finance", "Caixa", "money"],
    ["reports", "Relatórios", "chart"],
    ["whatsapp", "WhatsApp", "phone"],
    ["users", "Usuários", "shield"],
    ["account", "Senha", "settings"],
    ["settings", "Ajustes", "settings"],
    ["backup", "Backup", "database"],
    ["audit", "Auditoria", "eye"]
  ],
  vendedor: [
    ["sellerHome", "Minha tela", "grid"],
    ["newOrder", "Nova venda", "cart"],
    ["sellerOrders", "Meus pedidos", "receipt"],
    ["clients", "Clientes", "users"],
    ["products", "Produtos", "box"],
    ["whatsapp", "WhatsApp", "phone"],
    ["account", "Senha", "settings"],
    ["notifications", "Avisos", "bell"]
  ],
  entregador: [
    ["driverRoute", "Minha rota", "route"],
    ["driverTasks", "Minhas tarefas", "task"],
    ["driverHistory", "Histórico", "clock"],
    ["account", "Senha", "settings"],
    ["notifications", "Avisos", "bell"]
  ]
};

const ICONS = {
  grid: "▦",
  cart: "+",
  receipt: "#",
  truck: "↦",
  driver: "ID",
  task: "✓",
  box: "□",
  users: "U",
  money: "$",
  chart: "▥",
  shield: "S",
  settings: "*",
  database: "DB",
  eye: "○",
  route: "↗",
  clock: "T",
  bell: "!",
  logout: "↩",
  save: "✓",
  delete: "×",
  edit: "✎",
  phone: "P",
  map: "⌖"
};

const ICON_PATHS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  truck: '<path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  driver: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M7.5 17c1-2 2.5-3 4.5-3s3.5 1 4.5 3"/>',
  task: '<path d="M9 11l2 2 4-5"/><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 17h8"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  users: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 19c1-3 2.8-5 5.5-5s4.5 2 5.5 5"/><path d="M14.5 15c2.5.2 4.3 1.5 5.5 4"/>',
  money: '<path d="M12 2v20"/><path d="M17 6.5c-1.1-1-2.7-1.5-4.5-1.5-2.7 0-4.5 1.3-4.5 3.2 0 4.6 9 2.2 9 7 0 2-1.8 3.4-4.7 3.4-2.1 0-3.9-.7-5.3-2"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="11" width="3" height="5"/><rect x="12" y="8" width="3" height="8"/><rect x="17" y="5" width="3" height="11"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .4 1.7 1.7 0 0 0-.4 2H8.8a1.7 1.7 0 0 0-.4-2 1.7 1.7 0 0 0-2-.4l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1.2H3v-3.6h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 2-.4 1.7 1.7 0 0 0 .4-2h6.4a1.7 1.7 0 0 0 .4 2 1.7 1.7 0 0 0 2 .4l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.6 1.2h.1v3.6H21A1.7 1.7 0 0 0 19.4 15z"/>',
  database: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  eye: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="3"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a4 4 0 0 0 0-8h-1a4 4 0 0 1 0-8h5"/><path d="M16 4l2 2-2 2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bell: '<path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  message: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.3-4A8 8 0 1 1 21 12z"/><path d="M8 11h8M8 15h5"/>',
  logout: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 4v16"/>',
  save: '<path d="M5 12l4 4L19 6"/>',
  delete: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
  edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M14 7l3 3"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.7 9.8a16 16 0 0 0 6.5 6.5l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2z"/>',
  map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/>'
};

const STATUS = {
  vendedor: { label: "Com vendedor", tone: "blue", short: "Vendedor" },
  pronto: { label: "Pronto para retirada", tone: "amber", short: "Pronto" },
  atribuido: { label: "Com motoboy", tone: "purple", short: "Motoboy" },
  coletado: { label: "Coletado", tone: "blue", short: "Coletado" },
  a_caminho: { label: "A caminho", tone: "amber", short: "A caminho" },
  entregue: { label: "Entregue", tone: "green", short: "Entregue" },
  cancelado: { label: "Cancelado", tone: "red", short: "Cancelado" }
};

const STATUS_FLOW = ["vendedor", "pronto", "atribuido", "a_caminho"];

const PAYMENT_OPTIONS = [
  ["Pix", "Pix"],
  ["Dinheiro", "Dinheiro"],
  ["Cartão de débito", "Cartão de débito"],
  ["Cartão de crédito", "Cartão de crédito"],
  ["Fiado", "Fiado"]
];

const DEFAULT_WHATSAPP_AUTO_REPLY =
  "Olá! Para agilizar, me envie: quem passou o contato, seu vulgo ou nome e seu bairro em Blumenau.";

const DEFAULT_NOTIFICATION_TEXT =
  "Seu pedido saiu para entrega. Fique atento para fazer o Pix ou pagar na maquininha. Pagamento na maquininha contém taxa.";

const TEXT_FIXES = [
  ["NUNCIO", "NÚNCIO"],
  ["Joao", "João"],
  ["Cartao debito", "Cartão de débito"],
  ["Cartao credito", "Cartão de crédito"],
  ["Cartão débito", "Cartão de débito"],
  ["Cartão crédito", "Cartão de crédito"],
  ["Nova Esperanca", "Nova Esperança"],
  ["Ribeirao Fresco", "Ribeirão Fresco"],
  ["Gloria", "Glória"],
  ["Valparaiso", "Valparaíso"],
  ["Agua Verde", "Água Verde"],
  ["Escola Agricola", "Escola Agrícola"],
  ["Fidelis", "Fidélis"],
  ["Ola!", "Olá!"],
  ["contem taxa", "contém taxa"],
  ["Contem taxa", "Contém taxa"],
  ["demonstracao", "demonstração"],
  ["minimo", "mínimo"],
  ["Endereco", "Endereço"],
  ["codigo", "código"],
  ["Codigo", "Código"],
  ["Previsao", "Previsão"],
  ["cronometro", "cronômetro"],
  ["Usuario", "Usuário"],
  ["usuario", "usuário"],
  ["Notificacao", "Notificação"],
  ["notificacao", "notificação"]
];

const SELLER_IDS = {
  almeida: "u-vendedor",
  nuncio: "u-vendedor-2"
};

const SELLER_AREAS = [
  {
    sellerId: SELLER_IDS.almeida,
    base: "Ponta Aguda",
    neighborhoods: [
      "Ponta Aguda",
      "Nova Esperança",
      "Boa Vista",
      "Centro",
      "Jardim Blumenau",
      "Victor Konder",
      "Vila Nova",
      "Itoupava Seca",
      "Bom Retiro",
      "Ribeirão Fresco",
      "Vorstadt",
      "Garcia",
      "Glória",
      "Progresso",
      "Valparaíso",
      "Vila Formosa",
      "Velha",
      "Velha Central",
      "Velha Grande",
      "Água Verde",
      "Escola Agrícola"
    ]
  },
  {
    sellerId: SELLER_IDS.nuncio,
    base: "Itoupavazinha",
    neighborhoods: [
      "Itoupavazinha",
      "Itoupava Central",
      "Vila Itoupava",
      "Badenfurt",
      "Testo Salto",
      "Fidélis",
      "Salto do Norte",
      "Fortaleza",
      "Fortaleza Alta",
      "Tribess",
      "Itoupava Norte",
      "Do Salto",
      "Salto Weissbach",
      "Passo Manso"
    ]
  }
];

const ALL_NEIGHBORHOODS = SELLER_AREAS.flatMap((area) =>
  area.neighborhoods.map((name) => ({ name, sellerId: area.sellerId, base: area.base }))
);

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

const dayFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short"
});

let soundSnapshot;
let state = loadState();
let ui = {
  cart: [],
  editingProductId: null,
  editingClientId: null,
  editingUserId: null,
  editingDriverId: null,
  newOrderNeighborhood: null,
  activeView: state.session?.activeView || null
};
let deferredInstallPrompt = null;
soundSnapshot = getSoundSnapshot(state);
const notificationAudio = {
  context: null,
  element: null,
  enabled: true,
  lastPlayedAt: 0,
  unlocked: false,
  fallbackUrl: ""
};
let whatsappEventSource = null;
let whatsappServerOnline = false;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  render();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, prepareNotificationSound, { once: true, capture: true });
});

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;

  try {
    const nextState = JSON.parse(event.newValue);
    const nextSnapshot = getSoundSnapshot(nextState);
    const hasNewSignal =
      nextSnapshot.notifications > soundSnapshot.notifications ||
      nextSnapshot.orders > soundSnapshot.orders ||
      nextSnapshot.tasks > soundSnapshot.tasks;

    state = nextState;
    soundSnapshot = nextSnapshot;
    if (hasNewSignal) {
      playNotificationSound();
      showToast("Chegou novidade no sistema.");
    }
    render();
  } catch {
    // Ignora sincronizações incompletas.
  }
});

connectWhatsappServer();

function seedState() {
  const createdAt = minutesAgo(80);
  const sellerReadyAt = minutesAgo(55);
  const assignedAt = minutesAgo(42);
  const pickedAt = minutesAgo(28);
  const outForDeliveryAt = minutesAgo(12);

  return {
    version: 2,
    session: null,
    settings: {
      businessName: "Sistema de Vendas Corre",
      businessPhone: "(47) 99999-9999",
      businessAddress: "Blumenau, SC",
      pixKey: "pix@sistemavendas.local",
      defaultDeliveryFee: 8,
      cardMachineFeePct: 3.49,
      bankOpeningBalance: 0,
      sellerCommissionPct: 10,
      driverDeliveryPct: 50,
      financeRuleVersion: 2,
      whatsappConnected: false,
      whatsappNumber: "(47) 99999-9999",
      whatsappAutoReply: DEFAULT_WHATSAPP_AUTO_REPLY,
      homeLat: -26.9155,
      homeLng: -49.0709,
      notificationText: DEFAULT_NOTIFICATION_TEXT
    },
    users: [
      {
        id: "u-supremo",
        name: "SUPREMO",
        username: "supremo",
        password: "1234",
        role: "supremo",
        phone: "(47) 99999-0000",
        address: "Blumenau, SC",
        lat: -26.9155,
        lng: -49.0709,
        active: true
      },
      {
        id: "u-vendedor",
        name: "ALMEIDA",
        username: "almeida",
        password: "1234",
        role: "vendedor",
        phone: "(47) 99999-0002",
        address: "Base ALMEIDA - Ponta Aguda, Blumenau",
        lat: -26.9136,
        lng: -49.0531,
        active: true
      },
      {
        id: "u-vendedor-2",
        name: "NÚNCIO",
        username: "nuncio",
        password: "1234",
        role: "vendedor",
        phone: "(47) 99999-0003",
        address: "Base NÚNCIO - Itoupavazinha, Blumenau",
        lat: -26.8338,
        lng: -49.0834,
        active: true
      },
      {
        id: "u-driver",
        name: "BRITO",
        username: "brito",
        password: "1234",
        role: "entregador",
        phone: "(47) 99999-0004",
        address: "Ponto de apoio BRITO - Blumenau",
        lat: -26.8904,
        lng: -49.075,
        active: true
      }
    ],
    drivers: [
      {
        id: "d-brito",
        userId: "u-driver",
        name: "BRITO",
        phone: "(47) 99999-0004",
        vehicle: "Moto",
        plate: "",
        address: "Ponto de apoio BRITO - Blumenau",
        lat: -26.8904,
        lng: -49.075,
        active: true
      }
    ],
    clients: [
      {
        id: "c-ana",
        name: "Ana Lima",
        phone: "5547999991001",
        document: "000.000.000-00",
        address: "Rua XV de Novembro, Centro, Blumenau",
        neighborhood: "Centro",
        lat: -26.9215,
        lng: -49.0662,
        paymentPreference: "Pix",
        creditLimit: 300,
        balance: 0,
        active: true
      },
      {
        id: "c-joao",
        name: "João Silva",
        phone: "5547999991002",
        document: "111.111.111-11",
        address: "Rua Bahia, Itoupava Seca, Blumenau",
        neighborhood: "Itoupava Seca",
        lat: -26.9034,
        lng: -49.0838,
        paymentPreference: "Cartão de débito",
        creditLimit: 250,
        balance: 80,
        active: true
      },
      {
        id: "c-maria",
        name: "Maria Souza",
        phone: "5547999991003",
        document: "222.222.222-22",
        address: "Rua Frederico Jensen, Itoupavazinha, Blumenau",
        neighborhood: "Itoupavazinha",
        lat: -26.8332,
        lng: -49.0857,
        paymentPreference: "Dinheiro",
        creditLimit: 150,
        balance: 0,
        active: true
      }
    ],
    products: [
      {
        id: "p-produto-a",
        code: "7891001",
        name: "Produto A",
        category: "Linha principal",
        unit: "g",
        buyPrice: 1,
        sellPrice: 2,
        stock: 1000,
        stockBySeller: { "u-vendedor": 500, "u-vendedor-2": 500 },
        minStock: 80,
        active: true
      },
      {
        id: "p-produto-b",
        code: "7891002",
        name: "Produto B",
        category: "Linha principal",
        unit: "g",
        buyPrice: 2,
        sellPrice: 4,
        stock: 1000,
        stockBySeller: { "u-vendedor": 500, "u-vendedor-2": 500 },
        minStock: 80,
        active: true
      },
      {
        id: "p-produto-c",
        code: "7891003",
        name: "Produto C",
        category: "Linha extra",
        unit: "g",
        buyPrice: 3,
        sellPrice: 5,
        stock: 1000,
        stockBySeller: { "u-vendedor": 500, "u-vendedor-2": 500 },
        minStock: 60,
        active: true
      },
      {
        id: "p-produto-d",
        code: "7891004",
        name: "Produto D",
        category: "Linha extra",
        unit: "g",
        buyPrice: 4,
        sellPrice: 6,
        stock: 1000,
        stockBySeller: { "u-vendedor": 500, "u-vendedor-2": 500 },
        minStock: 60,
        active: true
      }
    ],
    orders: [
      {
        id: "PED-1001",
        createdAt,
        sellerReadyAt: null,
        assignedAt: null,
        pickedAt: null,
        outForDeliveryAt: null,
        deliveredAt: null,
        sellerId: "u-vendedor",
        clientId: "c-ana",
        deliveryNeighborhood: "Centro",
        driverId: null,
        routeCode: null,
        status: "vendedor",
        payment: "Pix",
        deliveryFee: 8,
        notes: "Cliente pediu contato antes de sair.",
        codes: {
          driver: makeCode("MOT")
        },
        items: [{ productId: "p-produto-b", qty: 50, price: 4 }]
      },
      {
        id: "PED-1002",
        createdAt: minutesAgo(58),
        sellerReadyAt,
        assignedAt: null,
        pickedAt: null,
        outForDeliveryAt: null,
        deliveredAt: null,
        sellerId: "u-vendedor-2",
        clientId: "c-maria",
        deliveryNeighborhood: "Itoupavazinha",
        driverId: null,
        routeCode: null,
        status: "pronto",
        payment: "Dinheiro",
        deliveryFee: 8,
        notes: "Levar maquininha se o cliente trocar a forma de pagamento.",
        codes: {
          driver: makeCode("MOT")
        },
        items: [
          { productId: "p-produto-c", qty: 30, price: 5 },
          { productId: "p-produto-d", qty: 20, price: 6 }
        ]
      },
      {
        id: "PED-1003",
        createdAt: minutesAgo(50),
        sellerReadyAt: minutesAgo(46),
        assignedAt,
        pickedAt: null,
        outForDeliveryAt: null,
        deliveredAt: null,
        sellerId: "u-vendedor",
        clientId: "c-joao",
        deliveryNeighborhood: "Itoupava Seca",
        driverId: "d-brito",
        routeCode: "ROTA-4821",
        status: "atribuido",
        payment: "Cartão de débito",
        deliveryFee: 10,
        notes: "Contém taxa de maquininha.",
        codes: {
          driver: makeCode("MOT")
        },
        items: [
          { productId: "p-produto-a", qty: 40, price: 2 },
          { productId: "p-produto-b", qty: 25, price: 4 }
        ]
      },
      {
        id: "PED-1004",
        createdAt: minutesAgo(44),
        sellerReadyAt: minutesAgo(40),
        assignedAt: minutesAgo(38),
        pickedAt,
        outForDeliveryAt,
        deliveredAt: null,
        sellerId: "u-vendedor",
        clientId: "c-ana",
        deliveryNeighborhood: "Centro",
        driverId: "d-brito",
        routeCode: "ROTA-4821",
        status: "a_caminho",
        payment: "Pix",
        deliveryFee: 8,
        notes: "Prioridade alta.",
        codes: {
          driver: makeCode("MOT")
        },
        items: [{ productId: "p-produto-d", qty: 35, price: 6 }]
      }
    ],
    tasks: [
      {
        id: "TAR-2001",
        title: "Conferir troco e maquininha",
        details: "Separar bobina, bateria e link Pix antes de iniciar a rota.",
        driverId: "d-brito",
        dueAt: minutesFromNow(120),
        status: "aberta",
        createdAt: minutesAgo(95),
        completedAt: null
      }
    ],
    notifications: [],
    stockPurchases: [],
    expenses: [],
    whatsappLeads: [],
    cashMovements: [],
    audit: []
  };
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return seedWithActivity();
    const parsed = JSON.parse(stored);
    if (!parsed.version) return seedWithActivity();
    normalizeOperationalState(parsed);
    saveState(parsed);
    return parsed;
  } catch {
    return seedWithActivity();
  }
}

function seedWithActivity() {
  const seeded = seedState();
  seeded.notifications.push({
    id: uid("NOT"),
    createdAt: minutesAgo(12),
    orderId: "PED-1004",
    clientId: "c-ana",
    channel: "WhatsApp",
    status: "gerada",
    tone: "warning",
    message: seeded.settings.notificationText
  });
  seeded.cashMovements = ordersToMovements(seeded.orders, seeded);
  seeded.audit.push({
    id: uid("AUD"),
    createdAt: new Date().toISOString(),
    userId: "u-supremo",
    action: "Base de demonstração criada"
  });
  saveState(seeded);
  return seeded;
}

function saveState(nextState = state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  soundSnapshot = getSoundSnapshot(nextState);
}

function getSoundSnapshot(nextState = state) {
  return {
    notifications: nextState.notifications?.length || 0,
    orders: nextState.orders?.length || 0,
    tasks: nextState.tasks?.length || 0
  };
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!notificationAudio.context) {
    notificationAudio.context = new AudioContextClass();
  }
  return notificationAudio.context;
}

function buildNotificationSoundUrl() {
  if (notificationAudio.fallbackUrl) return notificationAudio.fallbackUrl;

  const sampleRate = 22050;
  const duration = 0.42;
  const sampleCount = Math.floor(sampleRate * duration);
  const dataSize = sampleCount * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeString = (offset, value) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / sampleRate;
    const envelope = Math.max(0, 1 - t / duration);
    const frequency = t < 0.18 ? 740 : 980;
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.42;
    view.setInt16(44 + index * 2, sample * 32767, true);
  }

  const blob = new Blob([view], { type: "audio/wav" });
  notificationAudio.fallbackUrl = URL.createObjectURL(blob);
  return notificationAudio.fallbackUrl;
}

function getFallbackAudio() {
  if (!document.createElement) return null;
  if (!notificationAudio.element) {
    notificationAudio.element = document.createElement("audio");
    notificationAudio.element.src = buildNotificationSoundUrl();
    notificationAudio.element.preload = "auto";
  }
  return notificationAudio.element;
}

function prepareNotificationSound() {
  const context = getAudioContext();
  if (context?.state === "suspended") {
    context.resume().catch(() => {});
  }

  const fallback = getFallbackAudio();
  if (fallback) {
    const originalVolume = fallback.volume;
    fallback.volume = 0;
    fallback.play().then(() => {
      fallback.pause();
      fallback.currentTime = 0;
      fallback.volume = originalVolume || 1;
    }).catch(() => {
      fallback.volume = originalVolume || 1;
    });
  }

  notificationAudio.unlocked = true;
  return Boolean(context || fallback);
}

function playNotificationSound({ force = false } = {}) {
  if (!notificationAudio.enabled) return;
  const context = getAudioContext();
  const fallback = getFallbackAudio();

  if (!context && fallback) {
    const nowFallback = Date.now();
    if (!force && nowFallback - notificationAudio.lastPlayedAt < 650) return;
    notificationAudio.lastPlayedAt = nowFallback;
    fallback.currentTime = 0;
    fallback.volume = 1;
    fallback.play().catch(() => {});
    return;
  }

  if (!context) return;

  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }

  const now = Date.now();
  if (!force && now - notificationAudio.lastPlayedAt < 650) return;
  notificationAudio.lastPlayedAt = now;

  const startAt = context.currentTime + 0.01;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.42);
  gain.connect(context.destination);

  [740, 980].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt + index * 0.14);
    oscillator.connect(gain);
    oscillator.start(startAt + index * 0.14);
    oscillator.stop(startAt + 0.22 + index * 0.14);
  });
}

function minutesAgo(value) {
  return new Date(Date.now() - value * 60 * 1000).toISOString();
}

function minutesFromNow(value) {
  return new Date(Date.now() + value * 60 * 1000).toISOString();
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function makeCode(prefix) {
  return `${prefix}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
}

function normalizeCode(value, prefix) {
  const digits = String(value || "").replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `${prefix}-${digits}`;
}

function normalizeOperationalState(nextState = state) {
  ensureFinanceDefaults(nextState);
  normalizePortugueseLabels(nextState);
  normalizeProducts(nextState);
  nextState.orders?.forEach((order) => {
    order.codes = order.codes || {};
    order.codes.driver = normalizeCode(order.codes.driver || order.codes.seller || makeCode("MOT"), "MOT");
    delete order.codes.seller;
    delete order.codes.customer;
    if (!order.deliveryNeighborhood) {
      const client = nextState.clients?.find((item) => item.id === order.clientId);
      order.deliveryNeighborhood = client?.neighborhood || neighborhoodFromAddress(order.deliveryAddress || client?.address || "");
    }
  });
  return nextState;
}

function ensureFinanceDefaults(nextState = state) {
  nextState.settings = nextState.settings || {};
  nextState.settings.bankOpeningBalance = Math.round(Number(nextState.settings.bankOpeningBalance || 0));
  nextState.settings.sellerCommissionPct = Math.max(0, Number(nextState.settings.sellerCommissionPct ?? 10));
  if (Number(nextState.settings.financeRuleVersion || 0) < 2) {
    nextState.settings.driverDeliveryPct = 50;
    nextState.settings.financeRuleVersion = 2;
  }
  nextState.settings.driverDeliveryPct = Math.max(0, Number(nextState.settings.driverDeliveryPct ?? 50));
  nextState.settings.whatsappConnected = Boolean(nextState.settings.whatsappConnected);
  nextState.settings.whatsappNumber = nextState.settings.whatsappNumber || "(47) 99999-9999";
  nextState.settings.whatsappAutoReply =
    nextState.settings.whatsappAutoReply ||
    DEFAULT_WHATSAPP_AUTO_REPLY;
  nextState.stockPurchases = Array.isArray(nextState.stockPurchases) ? nextState.stockPurchases : [];
  nextState.expenses = Array.isArray(nextState.expenses) ? nextState.expenses : [];
  nextState.whatsappLeads = Array.isArray(nextState.whatsappLeads) ? nextState.whatsappLeads : [];
  nextState.whatsappProcessedEvents = Array.isArray(nextState.whatsappProcessedEvents)
    ? nextState.whatsappProcessedEvents.slice(-300)
    : [];
  nextState.cashMovements = Array.isArray(nextState.cashMovements) ? nextState.cashMovements : [];

  nextState.stockPurchases.forEach((purchase) => {
    purchase.qty = Math.max(0, Math.round(Number(purchase.qty || 0)));
    purchase.unitCost = Math.max(0, Math.round(Number(purchase.unitCost || 0)));
    purchase.totalCost = Math.max(0, Math.round(Number(purchase.totalCost || purchase.qty * purchase.unitCost || 0)));
  });
  nextState.expenses.forEach((expense) => {
    expense.value = Math.max(0, Math.round(Number(expense.value || 0)));
  });
  return nextState;
}

function normalizeStoredText(value) {
  if (typeof value !== "string") return value;
  return TEXT_FIXES.reduce((text, [from, to]) => text.split(from).join(to), value);
}

function normalizePaymentLabel(value = "") {
  const normalized = normalizeText(value);
  if (normalized === "cartao debito" || normalized === "cartao de debito") return "Cartão de débito";
  if (normalized === "cartao credito" || normalized === "cartao de credito") return "Cartão de crédito";
  if (normalized === "pix") return "Pix";
  if (normalized === "dinheiro") return "Dinheiro";
  if (normalized === "fiado") return "Fiado";
  return normalizeStoredText(value || "Pix");
}

function canonicalNeighborhood(value = "") {
  const fixed = normalizeStoredText(value);
  const normalized = normalizeText(fixed);
  const found = ALL_NEIGHBORHOODS.find((item) => normalizeText(item.name) === normalized);
  return found?.name || fixed;
}

function normalizePortugueseLabels(nextState = state) {
  const normalizeFields = (items, fields) => {
    (items || []).forEach((item) => {
      fields.forEach((field) => {
        if (typeof item[field] === "string") item[field] = normalizeStoredText(item[field]);
      });
    });
  };

  nextState.settings.whatsappAutoReply = normalizeStoredText(nextState.settings.whatsappAutoReply || DEFAULT_WHATSAPP_AUTO_REPLY);
  nextState.settings.notificationText = normalizeStoredText(nextState.settings.notificationText || DEFAULT_NOTIFICATION_TEXT);

  normalizeFields(nextState.users, ["name", "address"]);
  normalizeFields(nextState.drivers, ["name", "address", "vehicle"]);
  normalizeFields(nextState.products, ["name", "category"]);
  normalizeFields(nextState.tasks, ["title", "details"]);
  normalizeFields(nextState.stockPurchases, ["productName", "sellerName"]);
  normalizeFields(nextState.expenses, ["description", "category"]);
  normalizeFields(nextState.notifications, ["message", "channel", "status"]);
  normalizeFields(nextState.audit, ["action"]);

  (nextState.clients || []).forEach((client) => {
    ["name", "address", "referredBy", "source"].forEach((field) => {
      if (typeof client[field] === "string") client[field] = normalizeStoredText(client[field]);
    });
    client.neighborhood = canonicalNeighborhood(client.neighborhood);
    client.paymentPreference = normalizePaymentLabel(client.paymentPreference);
  });

  (nextState.orders || []).forEach((order) => {
    order.deliveryNeighborhood = canonicalNeighborhood(order.deliveryNeighborhood);
    order.payment = normalizePaymentLabel(order.payment);
    if (typeof order.notes === "string") order.notes = normalizeStoredText(order.notes);
  });

  (nextState.whatsappLeads || []).forEach((lead) => {
    ["name", "referredBy"].forEach((field) => {
      if (typeof lead[field] === "string") lead[field] = normalizeStoredText(lead[field]);
    });
    lead.neighborhood = canonicalNeighborhood(lead.neighborhood);
  });

  return nextState;
}

function normalizeProducts(nextState = state) {
  nextState.products?.forEach((product) => {
    const existingStock = Math.max(0, Math.round(Number(product.stock || 0)));
    product.unit = "g";
    product.buyPrice = Math.max(0, Math.round(Number(product.buyPrice || 0)));
    product.sellPrice = Math.max(1, Math.round(Number(product.sellPrice || 1)));
    product.minStock = Math.max(0, Math.round(Number(product.minStock || 0)));

    if (!product.stockBySeller) {
      const firstHalf = Math.floor(existingStock / 2);
      product.stockBySeller = {
        [SELLER_IDS.almeida]: firstHalf,
        [SELLER_IDS.nuncio]: existingStock - firstHalf
      };
    }

    Object.values(SELLER_IDS).forEach((sellerId) => {
      product.stockBySeller[sellerId] = Math.max(0, Math.round(Number(product.stockBySeller[sellerId] || 0)));
    });
    product.stock = totalStock(product);
  });
  return nextState;
}

function money(value) {
  const rounded = Math.round(Number(value) || 0);
  return `$ ${rounded.toLocaleString("pt-BR")}`;
}

function toNumber(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "0").replace("R$", "").replace("$", "").replace(/\./g, "").replace(",", ".")) || 0;
}

function integerValue(value) {
  return Math.round(toNumber(value));
}

function hasNumber(value) {
  return Number.isFinite(Number(value));
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function sellerArea(sellerId) {
  return SELLER_AREAS.find((area) => area.sellerId === sellerId) || SELLER_AREAS[0];
}

function sellerNeighborhoods(sellerId) {
  return sellerArea(sellerId)?.neighborhoods || [];
}

function neighborhoodFromAddress(address = "") {
  const normalizedAddress = normalizeText(address);
  const found = ALL_NEIGHBORHOODS.find((item) => normalizedAddress.includes(normalizeText(item.name)));
  return found?.name || "";
}

function neighborhoodFromText(text = "") {
  const normalized = normalizeText(text);
  const found = ALL_NEIGHBORHOODS.find((item) => normalized.includes(normalizeText(item.name)));
  return found?.name || "";
}

function sellerForNeighborhood(neighborhood = "") {
  const normalized = normalizeText(neighborhood);
  const found = ALL_NEIGHBORHOODS.find((item) => normalizeText(item.name) === normalized);
  return found?.sellerId || SELLER_IDS.almeida;
}

function neighborhoodsForUser(user = currentUser()) {
  if (user?.role === "vendedor") return sellerNeighborhoods(user.id);
  return ALL_NEIGHBORHOODS.map((item) => item.name);
}

function selectedNeighborhoodForOrder(user = currentUser()) {
  const allowed = neighborhoodsForUser(user);
  if (ui.newOrderNeighborhood && allowed.includes(ui.newOrderNeighborhood)) return ui.newOrderNeighborhood;
  const clientId = document.querySelector("#order-client")?.value;
  const client = getClient(clientId);
  const clientNeighborhood = client?.neighborhood || neighborhoodFromAddress(client?.address || "");
  if (clientNeighborhood && allowed.includes(clientNeighborhood)) return clientNeighborhood;
  return allowed[0] || "";
}

function selectedSellerIdForOrder(user = currentUser()) {
  if (user?.role === "vendedor") return user.id;
  return sellerForNeighborhood(document.querySelector("#order-neighborhood")?.value || selectedNeighborhoodForOrder(user));
}

function formatGrams(value) {
  const grams = Math.max(0, Math.round(Number(value) || 0));
  return `${grams.toLocaleString("pt-BR")} g`;
}

function sellerStock(product, sellerId) {
  if (!product) return 0;
  product.stockBySeller = product.stockBySeller || {};
  return Math.max(0, Math.round(Number(product.stockBySeller[sellerId] || 0)));
}

function totalStock(product) {
  if (!product?.stockBySeller) return Math.max(0, Math.round(Number(product?.stock || 0)));
  return Object.values(SELLER_IDS).reduce((sum, sellerId) => sum + sellerStock(product, sellerId), 0);
}

function setSellerStock(product, sellerId, grams) {
  if (!product) return;
  product.stockBySeller = product.stockBySeller || {};
  product.stockBySeller[sellerId] = Math.max(0, Math.round(Number(grams) || 0));
  product.stock = totalStock(product);
}

function adjustSellerStock(product, sellerId, delta) {
  setSellerStock(product, sellerId, sellerStock(product, sellerId) + Number(delta || 0));
}

function minStock(product) {
  return Math.max(0, Math.round(Number(product?.minStock || 0)));
}

function productStockStatus(product, sellerId) {
  const stock = sellerStock(product, sellerId);
  if (stock <= 0) return { label: "Sem estoque", tone: "red", level: "empty" };
  if (stock <= minStock(product)) return { label: "Estoque baixo", tone: "amber", level: "low" };
  return { label: "Ativo", tone: "green", level: "ok" };
}

function cartCalculation(product, mode, amount) {
  const price = Math.max(1, integerValue(product?.sellPrice || 1));
  const cleanAmount = Math.max(0, integerValue(amount));
  const grams = mode === "valor" ? Math.max(1, Math.round(cleanAmount / price)) : Math.max(1, cleanAmount);
  return {
    qty: grams,
    price,
    total: grams * price,
    sourceAmount: cleanAmount
  };
}

function parseWhatsappLeadMessage(rawMessage = "") {
  const fields = {};
  const lines = String(rawMessage || "")
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line) => {
    const match = line.match(/^([^:=-]+)[:=-]\s*(.+)$/);
    if (!match) return;
    const key = normalizeText(match[1]);
    const value = match[2].trim();
    if (key.includes("bairro")) fields.neighborhood = value;
    if (key.includes("nome") || key.includes("vulgo")) fields.name = value;
    if (key.includes("passou") || key.includes("indic")) fields.referredBy = value;
  });

  if (!fields.name || !fields.neighborhood) {
    const parts = String(rawMessage || "")
      .split(/,|\n|;/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (!fields.name) fields.name = parts.find((part) => !neighborhoodFromText(part)) || "";
    if (!fields.neighborhood) fields.neighborhood = neighborhoodFromText(rawMessage);
    if (!fields.referredBy && parts.length >= 3) fields.referredBy = parts[2];
  }

  const neighborhood = neighborhoodFromText(fields.neighborhood || rawMessage);
  return {
    name: fields.name || "",
    neighborhood,
    referredBy: fields.referredBy || "",
    rawMessage: String(rawMessage || "").trim()
  };
}

function parseWhatsappContactName(displayName = "") {
  const text = String(displayName || "").trim();
  if (!text) return { name: "", neighborhood: "" };
  const parts = text.split(/\s+-\s+|–|—/).map((part) => part.trim()).filter(Boolean);
  const neighborhood = neighborhoodFromText(text);
  return {
    name: parts[0] || text,
    neighborhood: neighborhood || neighborhoodFromText(parts[1] || "")
  };
}

function whatsappEventKey(payload = {}) {
  return payload.id || payload.messageId || payload.timestamp || `${payload.phone || payload.from || ""}-${payload.body || payload.message || payload.name || ""}`;
}

function addressPoint(address = "", fallback = state.settings) {
  const text = String(address || "base").toLowerCase();
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  const latBase = Number(fallback?.homeLat || -15.7939);
  const lngBase = Number(fallback?.homeLng || -47.8828);
  const latOffset = ((hash % 2200) - 1100) / 10000;
  const lngOffset = (((hash >>> 11) % 2200) - 1100) / 10000;
  return {
    lat: Number((latBase + latOffset).toFixed(6)),
    lng: Number((lngBase + lngOffset).toFixed(6))
  };
}

function pointFor(entity) {
  if (entity && hasNumber(entity.lat) && hasNumber(entity.lng)) {
    return { ...entity, lat: Number(entity.lat), lng: Number(entity.lng) };
  }
  return { ...entity, ...addressPoint(entity?.address || entity?.name) };
}

function withAddressPoint(payload, previous) {
  return {
    ...payload,
    ...addressPoint(payload.address || previous?.address || payload.name)
  };
}

function fmtDate(value) {
  if (!value) return "-";
  return dateFormatter.format(new Date(value));
}

function fmtDay(value) {
  if (!value) return "-";
  return dayFormatter.format(new Date(value));
}

function isSameLocalDay(value, reference = new Date()) {
  if (!value) return false;
  const date = new Date(value);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function svgIcon(name) {
  const paths = ICON_PATHS[name] || ICON_PATHS.grid;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function icon(name) {
  if (name === "shield") {
    return `<img class="icon-img" src="./assets/cannabis.png" alt="" aria-hidden="true" />`;
  }
  return `<span class="icon" aria-hidden="true">${svgIcon(name)}</span>`;
}

function badge(label, tone = "") {
  return `<span class="badge ${tone}">${escapeHtml(label)}</span>`;
}

function statusBadge(status) {
  const data = STATUS[status] || { label: status, tone: "" };
  return badge(data.label, data.tone);
}

function roleBadge(role) {
  return badge(ROLES[role] || role, ROLE_BADGES[role] || "");
}

function currentUser() {
  return state.users.find((user) => user.id === state.session?.userId) || null;
}

function currentRole() {
  return currentUser()?.role || "supremo";
}

function currentMenu() {
  return MENU[currentRole()] || MENU.supremo;
}

function canManage() {
  return currentRole() === "supremo";
}

function ensureActiveView() {
  const menu = currentMenu();
  if (!ui.activeView || !menu.some(([id]) => id === ui.activeView)) {
    ui.activeView = menu[0]?.[0] || "dashboard";
  }
  if (state.session) {
    state.session.activeView = ui.activeView;
    saveState();
  }
}

function getProduct(id) {
  return state.products.find((product) => product.id === id);
}

function getClient(id) {
  return state.clients.find((client) => client.id === id);
}

function orderDestination(order) {
  const client = getClient(order.clientId);
  return pointFor({
    ...(client || {}),
    address: order.deliveryAddress || client?.address || "",
    lat: order.deliveryLat ?? client?.lat,
    lng: order.deliveryLng ?? client?.lng
  });
}

function getUser(id) {
  return state.users.find((user) => user.id === id);
}

function getDriver(id) {
  return state.drivers.find((driver) => driver.id === id);
}

function driverForUser(userId) {
  return state.drivers.find((driver) => driver.userId === userId);
}

function sellerUsers() {
  return state.users.filter((user) => user.role === "vendedor" && user.active);
}

function visibleOrders() {
  const user = currentUser();
  if (!user) return [];
  if (user.role === "vendedor") return state.orders.filter((order) => order.sellerId === user.id);
  if (user.role === "entregador") {
    const driver = driverForUser(user.id);
    return driver ? state.orders.filter((order) => order.driverId === driver.id) : [];
  }
  return state.orders;
}

function orderItemsTotal(order) {
  return order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function orderTotal(order, source = state) {
  const cardFee = normalizeText(order.payment).includes("cartao")
    ? orderItemsTotal(order) * ((Number(source.settings.cardMachineFeePct) || 0) / 100)
    : 0;
  return orderItemsTotal(order) + Number(order.deliveryFee || 0) + cardFee;
}

function cartTotal() {
  return ui.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function ordersToMovements(orders, source = state) {
  const sales = orders
    .filter((order) => order.status !== "cancelado")
    .map((order) => ({
      id: uid("MOV"),
      createdAt: order.createdAt,
      description: `Pedido ${order.id}`,
      type: "Entrada",
      method: order.payment,
      value: orderTotal(order, source)
    }));
  const restocks = (source.stockPurchases || []).map((purchase) => ({
    id: purchase.id || uid("MOV"),
    createdAt: purchase.createdAt,
    description: `Reposição ${purchase.productName || purchase.productId} - ${purchase.sellerName || "vendedor"} (${formatGrams(purchase.qty)})`,
    type: "Saída",
    method: "Estoque",
    value: -Math.abs(Number(purchase.totalCost || 0))
  }));
  const expenses = (source.expenses || []).map((expense) => ({
    id: expense.id || uid("MOV"),
    createdAt: expense.createdAt,
    description: expense.description || "Despesa",
    type: "Saída",
    method: expense.category || "Despesa",
    value: -Math.abs(Number(expense.value || 0))
  }));
  return [...sales, ...restocks, ...expenses].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

function employeePayoutRows(source = state) {
  const validOrders = source.orders.filter((order) => order.status !== "cancelado");
  const totalGross = validOrders.reduce((sum, order) => sum + orderTotal(order, source), 0);
  const sellerPct = Number(source.settings.sellerCommissionPct || 0) / 100;
  const driverPct = Number(source.settings.driverDeliveryPct || 0) / 100;
  const sellers = source.users.filter((user) => user.role === "vendedor");
  const drivers = source.drivers || [];

  const sellerRows = sellers.map((seller) => {
    const orders = validOrders.filter((order) => order.sellerId === seller.id);
    return {
      id: seller.id,
      name: seller.name,
      role: "Vendedor",
      orders: orders.length,
      base: totalGross,
      rate: source.settings.sellerCommissionPct,
      value: Math.round(totalGross * sellerPct)
    };
  });

  const driverRows = drivers.map((driver) => {
    const orders = validOrders.filter(
      (order) => order.driverId === driver.id && order.status === "entregue" && isSameLocalDay(order.deliveredAt)
    );
    const base = orders.reduce((sum, order) => sum + Number(order.deliveryFee || 0), 0);
    return {
      id: driver.id,
      name: driver.name,
      role: "Entregador diário",
      orders: orders.length,
      base,
      rate: source.settings.driverDeliveryPct,
      value: Math.round(base * driverPct)
    };
  });

  return [...sellerRows, ...driverRows];
}

function financialSummary(source = state) {
  const validOrders = source.orders.filter((order) => order.status !== "cancelado");
  const gross = validOrders.reduce((sum, order) => sum + orderTotal(order, source), 0);
  const productGross = validOrders.reduce((sum, order) => sum + orderItemsTotal(order), 0);
  const deliveryGross = validOrders.reduce((sum, order) => sum + Number(order.deliveryFee || 0), 0);
  const stockCost = (source.stockPurchases || []).reduce((sum, purchase) => sum + Number(purchase.totalCost || 0), 0);
  const expenseCost = (source.expenses || []).reduce((sum, expense) => sum + Number(expense.value || 0), 0);
  const payrollRows = employeePayoutRows(source);
  const payroll = payrollRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
  const outgoing = stockCost + expenseCost;
  const bankBalance = Number(source.settings.bankOpeningBalance || 0) + gross - outgoing;
  const liquid = gross - outgoing - payroll;

  return {
    validOrders,
    gross,
    productGross,
    deliveryGross,
    stockCost,
    expenseCost,
    outgoing,
    payroll,
    payrollRows,
    bankBalance,
    liquid
  };
}

function recordStockPurchase(product, sellerId, qty, unitCost) {
  const grams = Math.max(0, Math.round(Number(qty || 0)));
  const cost = Math.max(0, Math.round(Number(unitCost || 0)));
  if (!product || !sellerId || grams <= 0 || cost <= 0) return;
  const seller = getUser(sellerId);
  state.stockPurchases.unshift({
    id: uid("REP"),
    createdAt: new Date().toISOString(),
    productId: product.id,
    productName: product.name,
    sellerId,
    sellerName: seller?.name || "Vendedor",
    qty: grams,
    unitCost: cost,
    totalCost: grams * cost,
    userId: currentUser()?.id || "sistema"
  });
}

function commit(message) {
  ensureFinanceDefaults(state);
  state.cashMovements = ordersToMovements(state.orders);
  saveState();
  render();
  if (message) showToast(message);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.className = "show success";
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastEl.classList.remove("show"), 3000);
}

function addAudit(action) {
  state.audit.unshift({
    id: uid("AUD"),
    createdAt: new Date().toISOString(),
    userId: currentUser()?.id || "sistema",
    action
  });
}

function notifyClient(order, message, tone = "warning") {
  const client = getClient(order.clientId);
  state.notifications.unshift({
    id: uid("NOT"),
    createdAt: new Date().toISOString(),
    orderId: order.id,
    clientId: order.clientId,
    channel: "WhatsApp",
    status: "gerada",
    tone,
    message
  });
  playNotificationSound();

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`Pedido ${order.id} - ${client?.name || "Cliente"}`, {
      body: message,
      icon: "./assets/icon-192.png"
    });
  }
}

function notifySupremo(message, tone = "warning") {
  state.notifications.unshift({
    id: uid("NOT"),
    createdAt: new Date().toISOString(),
    orderId: "SUPREMO",
    clientId: null,
    audience: "supremo",
    channel: "Sistema",
    status: "gerada",
    tone,
    message
  });
  playNotificationSound();
}

function notifyStockIfNeeded(product, sellerId) {
  if (!product || !sellerId) return;
  const status = productStockStatus(product, sellerId);
  product.stockAlerts = product.stockAlerts || {};
  if (status.level === "ok") {
    product.stockAlerts[sellerId] = "ok";
    return;
  }
  if (product.stockAlerts[sellerId] === status.level) return;

  const seller = getUser(sellerId);
  const stock = sellerStock(product, sellerId);
  const message =
    status.level === "empty"
      ? `Estoque acabou para ${seller?.name || "vendedor"}: ${product.name}.`
      : `Estoque baixo para ${seller?.name || "vendedor"}: ${product.name} com ${formatGrams(stock)} (mínimo ${formatGrams(minStock(product))}).`;

  product.stockAlerts[sellerId] = status.level;
  notifySupremo(message, status.level === "empty" ? "red" : "amber");
}

async function connectWhatsappServer() {
  if (!window.EventSource || whatsappEventSource) return;
  try {
    const response = await fetch("./api/health", { cache: "no-store" });
    if (!response.ok) return;
    whatsappServerOnline = true;
    const pending = await fetch("./api/whatsapp/inbox", { cache: "no-store" }).then((item) => item.json()).catch(() => ({ events: [] }));
    (pending.events || []).forEach((event) => processWhatsappIncoming(event, { silent: true }));

    whatsappEventSource = new EventSource("./api/whatsapp/events");
    whatsappEventSource.addEventListener("whatsapp", (event) => {
      try {
        processWhatsappIncoming(JSON.parse(event.data || "{}"));
      } catch {
        showToast("Mensagem do WhatsApp chegou incompleta.");
      }
    });
    whatsappEventSource.onopen = () => {
      whatsappServerOnline = true;
    };
    whatsappEventSource.onerror = () => {
      whatsappServerOnline = false;
    };
  } catch {
    whatsappServerOnline = false;
  }
}

function processWhatsappIncoming(payload = {}, options = {}) {
  ensureFinanceDefaults(state);
  const key = whatsappEventKey(payload);
  if (key && state.whatsappProcessedEvents.includes(key)) return null;

  const phone = payload.phone || payload.from || payload.number || "";
  const displayName = payload.name || payload.contactName || payload.pushName || "";
  const body = payload.body || payload.message || payload.text || "";
  const parsedName = parseWhatsappContactName(displayName);
  const parsedBody = parseWhatsappLeadMessage(body);
  const name = parsedBody.name || parsedName.name || displayName || phone || "Contato WhatsApp";
  const neighborhood = parsedBody.neighborhood || parsedName.neighborhood || neighborhoodFromText(body || displayName);
  if (!phone || !neighborhood) return null;

  const referredBy = parsedBody.referredBy || payload.referredBy || "";
  const sellerId = sellerForNeighborhood(neighborhood);
  const seller = getUser(sellerId);
  const phoneDigits = String(phone).replace(/\D/g, "");
  let client = state.clients.find((item) => String(item.phone || "").replace(/\D/g, "") === phoneDigits);
  const clientPayload = withAddressPoint(
    {
      name,
      phone,
      document: client?.document || "",
      address: `${neighborhood}, Blumenau`,
      neighborhood,
      referredBy,
      source: "WhatsApp",
      sellerId,
      paymentPreference: client?.paymentPreference || "Pix",
      creditLimit: client?.creditLimit || 0,
      balance: client?.balance || 0,
      active: true
    },
    client
  );

  if (client) {
    Object.assign(client, clientPayload);
  } else {
    client = { id: uid("CLI"), ...clientPayload };
    state.clients.push(client);
  }

  let lead = state.whatsappLeads.find((item) => String(item.phone || "").replace(/\D/g, "") === phoneDigits);
  if (!lead) {
    lead = {
      id: uid("WPP"),
      createdAt: new Date().toISOString(),
      phone,
      name,
      referredBy,
      neighborhood,
      sellerId,
      clientId: client.id,
      rawMessage: body || displayName,
      status: "novo",
      messages: []
    };
    state.whatsappLeads.unshift(lead);
  } else {
    Object.assign(lead, { phone, name, referredBy: referredBy || lead.referredBy, neighborhood, sellerId, clientId: client.id });
  }

  if (body) {
    lead.messages = lead.messages || [];
    lead.messages.push({
      id: key || uid("MSG"),
      direction: "entrada",
      createdAt: payload.createdAt || new Date().toISOString(),
      body
    });
    lead.rawMessage = body;
    lead.updatedAt = new Date().toISOString();
  }

  if (key) state.whatsappProcessedEvents = [...state.whatsappProcessedEvents, key].slice(-300);
  state.notifications.unshift({
    id: uid("NOT"),
    createdAt: new Date().toISOString(),
    orderId: "WHATSAPP",
    clientId: client.id,
    audience: sellerId,
    channel: "WhatsApp",
    status: "gerada",
    tone: "success",
    message: `Contato WhatsApp para ${seller?.name || "vendedor"}: ${name}, bairro ${neighborhood}.`
  });
  if (!options.silent) {
    playNotificationSound();
    showToast(`WhatsApp: ${name} enviado para ${seller?.name || "vendedor"}.`);
  }
  addAudit(`WhatsApp ${name} direcionado para ${seller?.name || sellerId}`);
  commit();
  return lead;
}

async function sendWhatsappReply(phone, message) {
  const response = await fetch("./api/whatsapp/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: phone, body: message })
  });
  if (!response.ok) throw new Error("Falha ao enviar pelo servidor");
  return response.json();
}

function haversine(a, b) {
  if (!a || !b) return 0;
  a = pointFor(a);
  b = pointFor(b);
  const toRad = (value) => (value * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad((b.lat || 0) - (a.lat || 0));
  const dLng = toRad((b.lng || 0) - (a.lng || 0));
  const lat1 = toRad(a.lat || 0);
  const lat2 = toRad(b.lat || 0);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earth * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function optimizedRouteForOrders(orders, driver) {
  const start = {
    label: driver?.name || "Ponto inicial",
    address: driver?.address || "Ponto inicial",
    ...pointFor(driver || state.settings)
  };

  const pickupMap = new Map();
  const deliveryStops = [];

  orders
    .filter((order) => !["entregue", "cancelado"].includes(order.status))
    .forEach((order) => {
      const seller = getUser(order.sellerId);
      const client = getClient(order.clientId);
      if (!["coletado", "a_caminho"].includes(order.status)) {
        const key = seller?.id || "seller";
        if (!pickupMap.has(key)) {
          pickupMap.set(key, {
            type: "pickup",
            title: `Buscar com ${seller?.name || "vendedor"}`,
            address: seller?.address || "Endereço do vendedor",
            ...pointFor(seller),
            orderIds: []
          });
        }
        pickupMap.get(key).orderIds.push(order.id);
      }
      deliveryStops.push({
        type: "delivery",
        title: `Entregar para ${client?.name || "cliente"}`,
        address: orderDestination(order).address || "Endereço do cliente",
        ...orderDestination(order),
        orderIds: [order.id]
      });
    });

  const pickups = nearestStops([...pickupMap.values()], start);
  const lastPickup = pickups[pickups.length - 1] || start;
  const deliveries = nearestStops(deliveryStops, lastPickup);
  const stops = [...pickups, ...deliveries];
  let cursor = start;
  return stops.map((stop, index) => {
    const km = haversine(cursor, stop);
    cursor = stop;
    return {
      ...stop,
      index: index + 1,
      km,
      minutes: Math.max(4, Math.round((km / 24) * 60 + 3))
    };
  });
}

function nearestStops(stops, start) {
  const remaining = [...stops];
  const sorted = [];
  let cursor = start;
  while (remaining.length) {
    let bestIndex = 0;
    let bestDistance = Infinity;
    remaining.forEach((stop, index) => {
      const distance = haversine(cursor, stop);
      if (distance < bestDistance) {
        bestIndex = index;
        bestDistance = distance;
      }
    });
    const [next] = remaining.splice(bestIndex, 1);
    sorted.push(next);
    cursor = next;
  }
  return sorted;
}

function mapUrl(stops, driver) {
  if (!stops.length) return "https://www.google.com/maps";
  const origin = encodeURIComponent(driver?.address || "Minha localização");
  const destination = encodeURIComponent(stops[stops.length - 1].address);
  const waypoints = stops
    .slice(0, -1)
    .map((stop) => stop.address)
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
}

function durationBetween(start, end) {
  if (!start) return "-";
  const ms = new Date(end || new Date()).getTime() - new Date(start).getTime();
  if (ms <= 0) return "0 min";
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}min`;
}

function activeOrderDuration(order) {
  return durationBetween(order.assignedAt || order.createdAt, order.deliveredAt);
}

function deliveryTimer(order) {
  return durationBetween(order.outForDeliveryAt || order.pickedAt || order.assignedAt || order.createdAt, order.deliveredAt);
}

function etaMinutesFromKm(km) {
  return Math.max(4, Math.round((km / 24) * 60 + 3));
}

function orderProductsSummary(order) {
  return order.items
    .map((item) => {
      const product = getProduct(item.productId);
      return `${formatGrams(item.qty)} - ${product?.name || "Produto"}`;
    })
    .join(", ");
}

function orderProductsList(order) {
  return order.items
    .map((item) => {
      const product = getProduct(item.productId);
      return `<li><strong>${formatGrams(item.qty)}</strong> ${escapeHtml(product?.name || "Produto")}</li>`;
    })
    .join("");
}

function currentDriverRun(orders) {
  const priority = { a_caminho: 0, coletado: 1, atribuido: 2, pronto: 3, vendedor: 4 };
  return [...orders]
    .filter((order) => !["entregue", "cancelado"].includes(order.status))
    .sort((a, b) => {
      const byStatus = (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
      if (byStatus !== 0) return byStatus;
      return (a.assignedAt || a.createdAt).localeCompare(b.assignedAt || b.createdAt);
    })[0];
}

function estimateNextClientEta(finishedOrder, nextOrder) {
  const finishedClient = orderDestination(finishedOrder);
  const nextSeller = getUser(nextOrder.sellerId);
  const nextClient = orderDestination(nextOrder);
  if (!finishedClient || !nextClient) return 12;

  if (nextOrder.status === "atribuido") {
    const toSeller = haversine(finishedClient, nextSeller);
    const toClient = haversine(nextSeller, nextClient);
    return etaMinutesFromKm(toSeller) + etaMinutesFromKm(toClient) + 4;
  }

  return etaMinutesFromKm(haversine(finishedClient, nextClient));
}

function nextOrderForDriver(finishedOrder) {
  const driver = getDriver(finishedOrder.driverId);
  if (!driver) return null;
  return currentDriverRun(
    state.orders.filter((order) => order.driverId === driver.id && order.id !== finishedOrder.id)
  );
}

function render() {
  if (!state.session) {
    app.innerHTML = renderLogin();
    return;
  }
  ensureActiveView();
  app.innerHTML = renderShell();
}

function renderLogin() {
  return `
    <main class="login-page" data-testid="login-page">
      <section aria-hidden="true"></section>
      <section class="login-panel">
        <div class="brand-lockup">
          <img src="./assets/icone.ico" alt="" />
          <div>
            <h1>Sistema de Vendas Corre</h1>
            <p>Vendas, entregas, rotas e equipe em campo.</p>
          </div>
        </div>
        <form class="login-card form-grid" onsubmit="actions.login(event)">
          <label class="field">
            <span>Usuário</span>
            <input class="input" id="login-username" autocomplete="username" placeholder="Digite seu usuario" />
          </label>
          <label class="field">
            <span>Senha</span>
            <input class="input" id="login-password" type="password" autocomplete="current-password" placeholder="Digite sua senha" />
          </label>
          <button class="btn" type="submit">${icon("shield")}Entrar</button>
        </form>
      </section>
    </main>
  `;
}

function renderShell() {
  const user = currentUser();
  const menu = currentMenu();
  const current = menu.find(([id]) => id === ui.activeView) || menu[0];
  const installButton = deferredInstallPrompt
    ? `<button class="btn secondary small hide-mobile" onclick="actions.installApp()">${icon("phone")}Instalar</button>`
    : "";

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-head">
          <img src="./assets/icone.ico" alt="" />
          <div>
            <h2>${escapeHtml(state.settings.businessName)}</h2>
            <p>Web app / PWA</p>
          </div>
        </div>
        <div class="sidebar-user">
          <strong>${escapeHtml(user.name)}</strong>
          <p>${roleBadge(user.role)} </p>
        </div>
        <nav class="nav" aria-label="Menu principal">
          ${menu
            .map(
              ([id, label, ico]) => `
                <button class="${ui.activeView === id ? "active" : ""}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" onclick="actions.setView('${id}')">
                  ${icon(ico)}<span>${escapeHtml(label)}</span>
                </button>
              `
            )
            .join("")}
        </nav>
        <div class="sidebar-foot">
          <button class="btn secondary" style="width: 100%" title="Sair" aria-label="Sair" onclick="actions.logout()">${icon("logout")}<span>Sair</span></button>
        </div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <p>${escapeHtml(ROLES[user.role])}</p>
            <h1>${escapeHtml(current?.[1] || "Painel")}</h1>
          </div>
          <div class="topbar-actions">
            ${installButton}
            <button class="btn secondary small" onclick="actions.requestNotifications()">${icon("bell")}Avisos</button>
            <button class="btn secondary small hide-desktop" onclick="actions.logout()">${icon("logout")}Sair</button>
          </div>
        </header>
        <section class="content" data-testid="app-content">
          ${renderActivePage()}
        </section>
      </main>
      <nav class="mobile-nav" aria-label="Menu mobile">
        ${menu
          .map(
            ([id, label, ico]) => `
              <button class="${ui.activeView === id ? "active" : ""}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" onclick="actions.setView('${id}')">
                ${icon(ico)}<span>${escapeHtml(label)}</span>
              </button>
            `
          )
          .join("")}
      </nav>
    </div>
    ${renderModal()}
  `;
}

function renderActivePage() {
  const pages = {
    dashboard: renderDashboard,
    sellerHome: renderSellerHome,
    newOrder: renderNewOrder,
    orders: renderOrders,
    sellerOrders: renderOrders,
    deliveries: renderDeliveries,
    driverRoute: renderDriverRoute,
    drivers: renderDrivers,
    tasks: renderTasks,
    driverTasks: renderDriverTasks,
    driverHistory: renderDriverHistory,
    products: renderProducts,
    clients: renderClients,
    finance: renderFinance,
    reports: renderReports,
    whatsapp: renderWhatsapp,
    users: renderUsers,
    account: renderAccount,
    settings: renderSettings,
    backup: renderBackup,
    audit: renderAudit,
    notifications: renderNotifications
  };
  return (pages[ui.activeView] || renderDashboard)();
}

function renderModal() {
  return "";
}

function metricCard(label, value, subtitle, tone = "", ico = "grid") {
  return `
    <article class="card metric ${tone}">
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(subtitle)}</small>
      </div>
      <div class="icon-box">${svgIcon(ico)}</div>
    </article>
  `;
}

function emptyState(title, detail = "", ico = "grid", action = "") {
  return `
    <div class="empty empty-state">
      <div class="empty-icon">${svgIcon(ico)}</div>
      <strong>${escapeHtml(title)}</strong>
      ${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
      ${action ? `<div class="empty-action">${action}</div>` : ""}
    </div>
  `;
}

function tableCell(label, content, className = "") {
  return `<td data-label="${escapeHtml(label)}"${className ? ` class="${className}"` : ""}>${content}</td>`;
}

function executiveItem(label, value, detail, tone = "", ico = "grid") {
  return `
    <article class="executive-item ${tone}">
      <div class="icon-box">${svgIcon(ico)}</div>
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(detail)}</small>
      </div>
    </article>
  `;
}

function quickAction(label, detail, view, ico, tone = "") {
  return `
    <button class="quick-action ${tone}" onclick="actions.setView('${view}')">
      <span class="icon-box">${svgIcon(ico)}</span>
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(detail)}</small>
      </span>
    </button>
  `;
}

function renderDashboard() {
  const activeOrders = state.orders.filter((order) => !["entregue", "cancelado"].includes(order.status));
  const delivered = state.orders.filter((order) => order.status === "entregue");
  const summary = financialSummary();
  const revenue = state.orders
    .filter((order) => order.status !== "cancelado")
    .reduce((sum, order) => sum + orderTotal(order), 0);
  const ready = state.orders.filter((order) => order.status === "pronto").length;
  const lowStock = state.products.reduce(
    (sum, product) =>
      sum +
      Object.values(SELLER_IDS).filter((sellerId) => product.active && productStockStatus(product, sellerId).level !== "ok").length,
    0
  );
  const assigned = state.orders.filter((order) => ["atribuido", "coletado", "a_caminho"].includes(order.status)).length;
  const attention = activeOrders.filter((order) => ["vendedor", "pronto"].includes(order.status)).length + lowStock;
  const nextOrders = activeOrders.slice(0, 4);

  return `
    <div class="section-head">
      <div>
        <h2>Operação geral</h2>
        <p>Fluxo único: pedido feito, vendedor separa, motoboy coleta, cliente recebe o aviso e a entrega é finalizada.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="actions.setView('newOrder')">${icon("cart")}Nova venda</button>
        <button class="btn secondary" onclick="actions.setView('deliveries')">${icon("route")}Gerenciar rota</button>
      </div>
    </div>
    <div class="executive-strip">
      ${executiveItem("Valor líquido", money(summary.liquid), "Depois de estoque, gastos e equipe", summary.liquid >= 0 ? "green" : "red", "chart")}
      ${executiveItem("A pagar equipe", money(summary.payroll), "Comissões e entregas do período", "amber", "users")}
      ${executiveItem("Pedidos com atenção", String(attention), "Separação, rota ou estoque", attention ? "red" : "green", "bell")}
    </div>
    <div class="quick-action-grid">
      ${quickAction("Nova venda", "Criar pedido e cliente", "newOrder", "cart", "green")}
      ${quickAction("Montar rota", "Atribuir ao motoboy", "deliveries", "route", "purple")}
      ${quickAction("Caixa", "Ver bruto, líquido e equipe", "finance", "money", "blue")}
      ${quickAction("WhatsApp", "Leads e conversas", "whatsapp", "message", "amber")}
    </div>
    <div class="cards">
      ${metricCard("Pedidos ativos", String(activeOrders.length), `${ready} prontos para motorista`, "blue", "receipt")}
      ${metricCard("Em rota", String(assigned), "Coleta ou entrega em andamento", "purple", "truck")}
      ${metricCard("Faturamento", money(revenue), `${delivered.length} pedidos entregues`, "green", "money")}
      ${metricCard("Estoque baixo", String(lowStock), "Saldos por vendedor no mínimo", lowStock ? "red" : "", "box")}
    </div>
    <div class="grid-main-side">
      <section class="panel">
        <div class="section-head">
          <div>
            <h2>Esteira de entregas</h2>
            <p>Status operacional em tempo real.</p>
          </div>
        </div>
        ${renderStatusBoard(state.orders.filter((order) => !["entregue", "cancelado"].includes(order.status)))}
      </section>
      <section class="panel">
        <h2>Últimos avisos</h2>
        <p class="panel-subtitle">Mensagens automáticas para cliente e alertas internos.</p>
        <div class="notification-list" style="margin-top: 12px">
          ${state.notifications.slice(0, 5).map(renderNotificationItem).join("") || emptyState("Nenhum aviso gerado", "Quando houver entrega, estoque baixo ou WhatsApp novo, aparece aqui.", "bell")}
        </div>
      </section>
      <section class="panel">
        <h2>Próximos pedidos</h2>
        <p class="panel-subtitle">Atalhos para o que precisa andar agora.</p>
        <div class="list" style="margin-top: 12px">
          ${nextOrders.map(renderSmallOrderCard).join("") || emptyState("Operação zerada", "Sem pedidos ativos no momento.", "check")}
        </div>
      </section>
    </div>
  `;
}

function renderSellerHome() {
  const user = currentUser();
  const mine = state.orders.filter((order) => order.sellerId === user.id);
  const waiting = mine.filter((order) => order.status === "vendedor").length;
  const ready = mine.filter((order) => order.status === "pronto").length;
  const picked = mine.filter((order) => ["atribuido", "coletado", "a_caminho"].includes(order.status)).length;
  const delivered = mine.filter((order) => order.status === "entregue").length;
  const area = sellerArea(user.id);
  const areaSummary = area.neighborhoods.slice(0, 4).join(", ");
  const stockAttention = state.products.filter((product) => product.active && productStockStatus(product, user.id).level !== "ok").length;
  const next = mine.filter((order) => !["entregue", "cancelado"].includes(order.status)).slice(0, 3);

  return `
    <div class="section-head">
      <div>
        <h2>Tela do vendedor</h2>
        <p>Cada pedido nasce com entrega e código MOT para o motoboy confirmar a retirada.</p>
      </div>
      <button class="btn" onclick="actions.setView('newOrder')">${icon("cart")}Nova venda</button>
    </div>
    <section class="role-home">
      <div>
        <span>Base ${escapeHtml(area.base)}</span>
        <h2>${escapeHtml(user.name)}, foco nos pedidos da sua área</h2>
        <p>Área principal: ${escapeHtml(areaSummary)}. O estoque e as vendas ficam separados do outro vendedor.</p>
      </div>
      <div class="role-home-actions">
        <button class="btn" onclick="actions.setView('newOrder')">${icon("cart")}Criar pedido</button>
        <button class="btn secondary" onclick="actions.setView('products')">${icon("box")}Ver estoque</button>
      </div>
    </section>
    <div class="cards">
      ${metricCard("Para separar", String(waiting), "Pedidos recebidos", "blue", "receipt")}
      ${metricCard("Prontos", String(ready), "Aguardando motoboy", "amber", "box")}
      ${metricCard("Com entrega", String(picked), "Atribuídos ou em rota", "purple", "truck")}
      ${metricCard("Estoque em atenção", String(stockAttention), "Mínimo por gramas", stockAttention ? "red" : "green", "bell")}
    </div>
    <div class="grid-main-side">
      <section class="panel">
        <h2>Próximas ações</h2>
        <div class="list" style="margin-top: 14px">
          ${next.map(renderSmallOrderCard).join("") || emptyState("Sem pedidos pendentes", "Quando chegar venda nova, ela entra aqui para separar.", "check")}
        </div>
      </section>
      <section class="panel">
        <h2>Resultado do vendedor</h2>
        <div class="cards compact-cards" style="margin-top: 14px">
          ${metricCard("Entregues", String(delivered), "Histórico do vendedor", "green", "chart")}
          ${metricCard("Em andamento", String(waiting + ready + picked), "Separar ou acompanhar", "blue", "clock")}
        </div>
      </section>
    </div>
    ${renderOrders()}
  `;
}

function renderStatusBoard(orders) {
  return `
    <div class="status-board" style="margin-top: 14px">
      ${STATUS_FLOW.map((status) => {
        const items = orders.filter((order) =>
          status === "a_caminho" ? ["coletado", "a_caminho"].includes(order.status) : order.status === status
        );
        return `
          <div class="status-column">
            <h3>${escapeHtml(status === "a_caminho" ? "Coletado / a caminho" : STATUS[status].label)} ${badge(items.length, STATUS[status].tone)}</h3>
            ${items.map(renderSmallOrderCard).join("") || emptyState("Vazio", "Sem pedidos neste status.", "check")}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderSmallOrderCard(order) {
  const client = getClient(order.clientId);
  const seller = getUser(order.sellerId);
  return `
    <article class="order-card">
      <div>
        <strong>${escapeHtml(order.id)}</strong>
        <span class="muted">${escapeHtml(client?.name || "Cliente")} · ${escapeHtml(seller?.name || "Vendedor")}</span>
      </div>
      <div>${statusBadge(order.status)}</div>
      <div class="mono">${escapeHtml(order.codes.driver)}</div>
    </article>
  `;
}

function renderNewOrder() {
  const user = currentUser();
  const sellers = sellerUsers();
  const allowedNeighborhoods = neighborhoodsForUser(user);
  const selectedNeighborhood =
    ui.newOrderNeighborhood && allowedNeighborhoods.includes(ui.newOrderNeighborhood)
      ? ui.newOrderNeighborhood
      : allowedNeighborhoods[0] || "";
  const defaultSellerId = user.role === "vendedor" ? user.id : sellerForNeighborhood(selectedNeighborhood);
  const defaultSeller = getUser(defaultSellerId) || sellers[0];
  const defaultProduct = state.products.find((product) => product.active);
  const deliveryFee = Number(state.settings.defaultDeliveryFee || 0);
  const subtotal = cartTotal();
  const total = subtotal + deliveryFee;
  const defaultPreview = defaultProduct
    ? `${formatGrams(10)} = ${money(10 * integerValue(defaultProduct.sellPrice))} | Estoque ${defaultSeller?.name || "vendedor"}: ${formatGrams(sellerStock(defaultProduct, defaultSellerId))}`
    : "Cadastre um produto ativo.";

  return `
    <div class="section-head">
      <div>
        <h2>Nova venda com entrega</h2>
        <p>Escolha o bairro, venda por gramas ou por valor e o estoque será descontado só do vendedor responsável.</p>
      </div>
    </div>
    <div class="grid-main-side">
      <section class="panel">
        <h2>Itens do pedido</h2>
        <div class="form-grid two" style="margin-top: 14px">
          <label class="field">
            <span>Bairro da entrega</span>
            <select class="select" id="order-neighborhood" onchange="actions.setOrderNeighborhood(this.value)">
              ${allowedNeighborhoods
                .map((name) => `<option value="${escapeHtml(name)}" ${name === selectedNeighborhood ? "selected" : ""}>${escapeHtml(name)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>Vendedor pelo bairro</span>
            <select class="select" id="order-seller" disabled>
              ${sellers
                .map(
                  (seller) =>
                    `<option value="${seller.id}" ${seller.id === defaultSellerId ? "selected" : ""}>${escapeHtml(seller.name)} - base ${escapeHtml(sellerArea(seller.id)?.base || seller.address)}</option>`
                )
                .join("")}
            </select>
          </label>
        </div>
        <div class="form-grid three" style="margin-top: 14px">
          <label class="field">
            <span>Produto</span>
            <select class="select" id="cart-product" onchange="actions.updateCartPreview()">
              ${state.products
                .filter((product) => product.active)
                .map(
                  (product) =>
                    `<option value="${product.id}">${escapeHtml(product.name)} - ${money(product.sellPrice)}/g - ${formatGrams(sellerStock(product, defaultSellerId))}</option>`
                )
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>Vender por</span>
            <select class="select" id="cart-mode" onchange="actions.updateCartPreview()">
              <option value="gramas">Gramas (g)</option>
              <option value="valor">Valor ($)</option>
            </select>
          </label>
          <label class="field">
            <span>Quantidade ou valor</span>
            <input class="input" id="cart-amount" type="number" min="1" step="1" value="10" oninput="actions.updateCartPreview()" />
          </label>
        </div>
        <div class="item-row cart-preview">
          <span id="cart-preview">${escapeHtml(defaultPreview)}</span>
          <button class="btn" onclick="actions.addToCart()">${icon("cart")}Adicionar</button>
        </div>
        <div class="form-grid" style="margin-top: 14px">
          <label class="field">
            <span>Endereço da entrega</span>
            <input class="input" id="order-address" placeholder="Digite rua, número e referência" />
          </label>
        </div>
        <div class="table-wrap" style="margin-top: 14px">
          <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>
              ${ui.cart
                .map((item, index) => {
                  const product = getProduct(item.productId);
                  return `
                    <tr>
                      ${tableCell("Produto", `<strong>${escapeHtml(product?.name || "Produto")}</strong>`)}
                      ${tableCell("Qtd", `${formatGrams(item.qty)}<br><span class="muted">${item.entryMode === "valor" ? `por valor ${money(item.sourceAmount)}` : "por gramas"}</span>`)}
                      ${tableCell("Preço", `${money(item.price)}/g`)}
                      ${tableCell("Subtotal", `<strong>${money(item.qty * item.price)}</strong>`)}
                      ${tableCell("Ações", `<button class="btn danger small" onclick="actions.removeFromCart(${index})">${icon("delete")}Remover</button>`)}
                    </tr>
                  `;
                })
                .join("") || `<tr class="table-empty"><td colspan="5">${emptyState("Carrinho vazio", "Adicione um produto por gramas ou por valor para fechar o pedido.", "cart")}</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
      <aside class="panel">
        <h2>Fechamento</h2>
        <div class="form-grid" style="margin-top: 14px">
          <label class="field">
            <span>Cliente</span>
            <select class="select" id="order-client" onchange="actions.useClientNeighborhood()">
              ${state.clients
                .filter((client) => client.active)
                .map((client) => `<option value="${client.id}">${escapeHtml(client.name)} · ${escapeHtml(client.address)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>Pagamento</span>
            <select class="select" id="order-payment">
              ${PAYMENT_OPTIONS.map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Taxa de entrega</span>
            <input class="input" id="order-delivery-fee" value="${String(deliveryFee).replace(".", ",")}" />
          </label>
          <label class="field">
            <span>Observações</span>
            <textarea class="textarea" id="order-notes" placeholder="Ex: levar maquininha, chamar no WhatsApp..."></textarea>
          </label>
        </div>
        <div class="item" style="margin-top: 14px">
          <div class="item-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
          <div class="item-row"><span>Entrega</span><strong>${money(deliveryFee)}</strong></div>
          <div class="item-row"><span>Total previsto</span><strong>${money(total)}</strong></div>
        </div>
        <button class="btn" style="width: 100%; margin-top: 14px" onclick="actions.createOrder()">${icon("save")}Finalizar pedido</button>
      </aside>
    </div>
  `;
}

function renderOrders() {
  const isSellerScreen = ui.activeView === "sellerOrders" || currentRole() === "vendedor";
  const orders = (isSellerScreen ? visibleOrders() : visibleOrders()).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const title = isSellerScreen ? "Meus pedidos" : "Pedidos";

  return `
    <section class="panel flush">
      <div class="section-head" style="padding: 16px">
        <div>
          <h2>${title}</h2>
          <p>Todos os pedidos possuem entrega, vendedor responsável e código MOT de retirada.</p>
        </div>
        <button class="btn" onclick="actions.setView('newOrder')">${icon("cart")}Novo pedido</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pedido</th><th>Cliente</th><th>Vendedor</th><th>Entrega</th><th>Código MOT</th><th>Total</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(renderOrderRow).join("") || `<tr class="table-empty"><td colspan="8">${emptyState("Nenhum pedido encontrado", "Use Nova venda para criar o primeiro pedido desta lista.", "receipt")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderOrderRow(order) {
  const client = getClient(order.clientId);
  const destination = orderDestination(order);
  const seller = getUser(order.sellerId);
  const driver = getDriver(order.driverId);
  return `
    <tr>
      ${tableCell("Pedido", `<strong>${escapeHtml(order.id)}</strong><br><span class="muted">${fmtDate(order.createdAt)}</span>`)}
      ${tableCell("Cliente", `${escapeHtml(client?.name || "-")}<br><span class="muted">${escapeHtml(order.deliveryNeighborhood || client?.neighborhood || "")} - ${escapeHtml(destination.address || "")}</span>`)}
      ${tableCell("Vendedor", `${escapeHtml(seller?.name || "-")}<br><span class="muted">${escapeHtml(seller?.address || "")}</span>`)}
      ${tableCell("Entrega", `${escapeHtml(driver?.name || "Sem motoboy")}<br><span class="muted">${order.routeCode ? escapeHtml(order.routeCode) : "Sem rota"}</span>`)}
      ${tableCell("Código MOT", escapeHtml(order.codes.driver), "mono")}
      ${tableCell("Total", `<strong>${money(orderTotal(order))}</strong><br><span class="muted">${escapeHtml(order.payment)}</span>`)}
      ${tableCell("Status", statusBadge(order.status))}
      ${tableCell("Ações", `<div class="actions">${renderOrderActions(order)}</div>`)}
    </tr>
  `;
}

function renderOrderActions(order) {
  const role = currentRole();
  const actions = [];
  if (role === "vendedor" && order.status === "vendedor") {
    actions.push(`<button class="btn small" onclick="actions.sellerReady('${order.id}')">${icon("box")}Pronto</button>`);
  }
  if (canManage() && order.status === "vendedor") {
    actions.push(`<button class="btn small" onclick="actions.sellerReady('${order.id}')">${icon("box")}Marcar pronto</button>`);
  }
  if (canManage() && order.status === "pronto") {
    actions.push(`<button class="btn small blue" onclick="actions.setView('deliveries')">${icon("truck")}Atribuir</button>`);
  }
  if (!["entregue", "cancelado"].includes(order.status) && canManage()) {
    actions.push(`<button class="btn danger small" onclick="actions.cancelOrder('${order.id}')">${icon("delete")}Cancelar</button>`);
  }
  if (!actions.length) actions.push(`<span class="muted">Sem ação</span>`);
  return actions.join("");
}

function renderDeliveries() {
  const ready = state.orders.filter((order) => order.status === "pronto");
  const active = state.orders.filter((order) => ["atribuido", "coletado", "a_caminho"].includes(order.status));
  const activeDrivers = state.drivers.filter((driver) => driver.active);

  return `
    <div class="grid-main-side">
      <section class="panel">
        <div class="section-head">
          <div>
            <h2>Pedidos prontos para motoboy</h2>
            <p>Selecione uma leva ou um pedido unitário para gerar a rota e acompanhar o código MOT.</p>
          </div>
        </div>
        <div class="toolbar" style="margin-top: 14px">
          <select class="select" id="assign-driver" style="max-width: 280px">
            ${activeDrivers.map((driver) => `<option value="${driver.id}">${escapeHtml(driver.name)} · ${escapeHtml(driver.vehicle)}</option>`).join("")}
          </select>
          <button class="btn" onclick="actions.assignSelectedDeliveries()">${icon("route")}Criar rota</button>
        </div>
        <div class="list">
          ${ready.map(renderReadyDeliveryCard).join("") || emptyState("Nenhum pedido pronto", "Quando o vendedor marcar como pronto, o pedido aparece para criar rota.", "box")}
        </div>
      </section>
      <section class="panel">
        <h2>Rotas em andamento</h2>
        <p class="panel-subtitle">Status, horários e tempo de cada entrega.</p>
        <div class="list" style="margin-top: 14px">
          ${active.map(renderActiveDeliveryCard).join("") || emptyState("Nenhuma rota em andamento", "Depois de atribuir uma entrega ao BRITO, a rota aparece aqui.", "route")}
        </div>
      </section>
    </div>
  `;
}

function renderReadyDeliveryCard(order) {
  const seller = getUser(order.sellerId);
  const client = getClient(order.clientId);
  const destination = orderDestination(order);
  return `
    <label class="item">
      <div class="item-row">
        <div>
          <h3><input type="checkbox" data-order-check value="${order.id}" /> ${escapeHtml(order.id)} · ${escapeHtml(client?.name || "Cliente")}</h3>
          <p>Buscar com ${escapeHtml(seller?.name || "vendedor")} em ${escapeHtml(seller?.address || "-")}</p>
          <p>Entregar em ${escapeHtml(destination.address || "-")}</p>
          <p>Código MOT de retirada: <span class="mono">${escapeHtml(order.codes.driver)}</span></p>
        </div>
        <strong>${money(orderTotal(order))}</strong>
      </div>
    </label>
  `;
}

function renderActiveDeliveryCard(order) {
  const driver = getDriver(order.driverId);
  const seller = getUser(order.sellerId);
  const client = getClient(order.clientId);
  const destination = orderDestination(order);
  return `
    <article class="item">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(order.id)} ${statusBadge(order.status)}</h3>
          <p>${escapeHtml(driver?.name || "Motoboy")} · rota <span class="mono">${escapeHtml(order.routeCode || "-")}</span></p>
          <p>Retirada: ${escapeHtml(seller?.address || "-")} · Entrega: ${escapeHtml(destination.address || "-")}</p>
        </div>
        <div>
          <strong>${activeOrderDuration(order)}</strong>
          <p class="muted">tempo em aberto</p>
        </div>
      </div>
      <div class="grid-2" style="margin-top: 10px">
        <span class="muted">Atribuído: ${fmtDate(order.assignedAt)}</span>
        <span class="muted">Saiu para entrega: ${fmtDate(order.outForDeliveryAt)}</span>
      </div>
    </article>
  `;
}

function renderDriverRoute() {
  const user = currentUser();
  const driver = driverForUser(user.id);
  if (!driver) {
    return `<section class="panel">${emptyState("Motorista não vinculado", "O usuário atual precisa estar ligado a um cadastro de motorista.", "users")}</section>`;
  }

  const orders = state.orders
    .filter((order) => order.driverId === driver.id && !["entregue", "cancelado"].includes(order.status))
    .sort((a, b) => (a.assignedAt || a.createdAt).localeCompare(b.assignedAt || b.createdAt));
  const route = optimizedRouteForOrders(orders, driver);
  const run = currentDriverRun(orders);

  return `
    <div class="section-head">
      <div>
        <h2>Minha rota</h2>
        <p>Rota otimizada por proximidade, com retirada no vendedor antes da entrega ao cliente.</p>
      </div>
      ${route.length ? `<a class="btn secondary" target="_blank" rel="noreferrer" href="${mapUrl(route, driver)}">${icon("map")}Abrir mapa</a>` : ""}
    </div>
    ${renderCurrentRunPanel(run)}
    <div class="cards">
      ${metricCard("Pedidos na rota", String(orders.length), "Aguardando ação", "blue", "receipt")}
      ${metricCard("Paradas", String(route.length), "Retiradas e entregas", "purple", "route")}
      ${metricCard("Km estimado", `${route.reduce((sum, stop) => sum + stop.km, 0).toFixed(1)} km`, "Cálculo por coordenadas", "amber", "map")}
      ${metricCard("Tempo estimado", `${route.reduce((sum, stop) => sum + stop.minutes, 0)} min`, "Sem trânsito real", "green", "clock")}
    </div>
    <div class="grid-main-side">
      <section class="panel">
        <h2>Melhor ordem de paradas</h2>
        <div class="list" style="margin-top: 14px">
          ${route.map(renderRouteStep).join("") || emptyState("Nenhuma entrega atribuída", "Quando uma rota for criada, a melhor ordem aparece aqui.", "route")}
        </div>
      </section>
      <section class="panel">
        <h2>Pedidos para executar</h2>
        <div class="list" style="margin-top: 14px">
          ${orders.map(renderDriverOrderCard).join("") || emptyState("Sem pedidos agora", "Aguarde o vendedor marcar pedido pronto e o supremo criar a rota.", "receipt")}
        </div>
      </section>
    </div>
  `;
}

function renderCurrentRunPanel(order) {
  if (!order) {
    return `<section class="panel driver-run">${emptyState("Sem corrida ativa", "Quando cair uma entrega, a ação principal aparece aqui em destaque.", "truck")}</section>`;
  }

  const seller = getUser(order.sellerId);
  const client = getClient(order.clientId);
  const destination = orderDestination(order);
  const timerLabel = order.status === "atribuido" ? "Aguardando retirada" : `Cronômetro: ${deliveryTimer(order)}`;
  const nextAction =
    order.status === "atribuido"
      ? "Pegar produto"
      : order.status === "coletado"
        ? "Iniciar entrega"
        : order.status === "a_caminho"
          ? "Cobrar e finalizar"
          : "Acompanhar";
  const focus =
    order.status === "atribuido"
      ? "Confirme o MOT com o vendedor"
      : order.status === "coletado"
        ? "Avise o cliente e saia para entrega"
        : order.status === "a_caminho"
          ? "Cobre, confirme pagamento e finalize"
          : "Acompanhe a corrida";
  const focusLabel = order.status === "atribuido" ? "RETIRADA" : order.status === "a_caminho" ? "COBRANÇA" : "ENTREGA";

  return `
    <section class="panel driver-run">
      <div class="driver-run-head">
        <div>
          <span class="badge ${STATUS[order.status]?.tone || ""}">${escapeHtml(nextAction)}</span>
          <h2>${escapeHtml(order.id)} - ${escapeHtml(client?.name || "Cliente")}</h2>
          <p>${escapeHtml(focus)}</p>
        </div>
        <div class="driver-run-code">
          <span>Agora</span>
          <strong>${escapeHtml(focusLabel)}</strong>
        </div>
      </div>
      <div class="driver-focus-meta">
        <div><span>Tempo</span><strong>${escapeHtml(timerLabel)}</strong></div>
        <div><span>Total</span><strong>${money(orderTotal(order))}</strong></div>
        <div><span>Pagamento</span><strong>${escapeHtml(order.payment)}</strong></div>
      </div>
      <div class="driver-run-grid">
        <div class="item">
          <h3>O que pegar</h3>
          <ul class="product-list">${orderProductsList(order)}</ul>
          <p>Retirada com ${escapeHtml(seller?.name || "vendedor")} em ${escapeHtml(seller?.address || "-")}</p>
        </div>
        <div class="item">
          <h3>Destino</h3>
          <p>${escapeHtml(client?.name || "-")}</p>
          <p>${escapeHtml(destination.address || "-")}</p>
          <p class="mono">Rota: ${escapeHtml(order.routeCode || "-")}</p>
        </div>
      </div>
      ${renderDriverOrderAction(order, true)}
    </section>
  `;
}

function renderRouteStep(stop) {
  return `
    <article class="route-step">
      <div class="route-step-number">${stop.index}</div>
      <div class="item">
        <h4>${escapeHtml(stop.title)} ${badge(stop.type === "pickup" ? "Retirada" : "Entrega", stop.type === "pickup" ? "amber" : "green")}</h4>
        <p>${escapeHtml(stop.address)}</p>
        <p>${stop.orderIds.map((id) => `<span class="mono">${escapeHtml(id)}</span>`).join(" · ")} · ${stop.km.toFixed(1)} km · ${stop.minutes} min</p>
      </div>
    </article>
  `;
}

function renderDriverOrderCard(order) {
  const seller = getUser(order.sellerId);
  const client = getClient(order.clientId);
  const destination = orderDestination(order);
  return `
    <article class="item">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(order.id)} ${statusBadge(order.status)}</h3>
          <p>Vendedor: ${escapeHtml(seller?.name || "-")} · ${escapeHtml(seller?.address || "-")}</p>
          <p>Cliente: ${escapeHtml(client?.name || "-")} · ${escapeHtml(destination.address || "-")}</p>
          <p>Produtos: ${escapeHtml(orderProductsSummary(order))}</p>
          <p>Cronômetro: ${escapeHtml(deliveryTimer(order))}</p>
          <p class="mono">Rota: ${escapeHtml(order.routeCode || "-")}</p>
        </div>
        <strong>${money(orderTotal(order))}</strong>
      </div>
      ${renderDriverOrderAction(order)}
    </article>
  `;
}

function renderDriverOrderAction(order, featured = false) {
  const inputId = featured ? `pickup-code-current-${order.id}` : `pickup-code-${order.id}`;
  const buttonClass = featured ? "btn driver-action" : "btn";
  if (order.status === "atribuido") {
    return `
      <div class="form-grid two driver-action-grid" style="margin-top: 12px">
        <input class="input mono" id="${inputId}" placeholder="MOT-0000 informado pelo vendedor" />
        <button class="${buttonClass}" onclick="actions.collectOrder('${order.id}', '${inputId}')">${icon("truck")}Confirmar retirada</button>
      </div>
    `;
  }
  if (order.status === "coletado") {
    return `<button class="${buttonClass}" style="margin-top: 12px" onclick="actions.startDelivery('${order.id}')">${icon("route")}Iniciar ida ao cliente</button>`;
  }
  if (order.status === "a_caminho") {
    return `<button class="${buttonClass}" style="margin-top: 12px" onclick="actions.finishDelivery('${order.id}')">${icon("save")}Cobrar e finalizar</button>`;
  }
  return "";
}

function renderDrivers() {
  const editing = ui.editingDriverId ? getDriver(ui.editingDriverId) : null;
  const linkedUserOptions = state.users
    .filter((user) => user.role === "entregador")
    .map((user) => `<option value="${user.id}" ${editing?.userId === user.id ? "selected" : ""}>${escapeHtml(user.name)}</option>`)
    .join("");

  return `
    <div class="grid-main-side">
      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div>
            <h2>Equipe de motoristas</h2>
            <p>Crie motoristas, vincule usuários e acompanhe quem está ativo.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Usuario</th><th>Veículo</th><th>Contato</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              ${state.drivers.map(renderDriverRow).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <aside class="panel">
        <h2>${editing ? "Editar motorista" : "Novo motorista"}</h2>
        <form class="form-grid" style="margin-top: 14px" onsubmit="actions.saveDriver(event)">
          <input type="hidden" id="driver-id" value="${escapeHtml(editing?.id || "")}" />
          <label class="field"><span>Nome</span><input class="input" id="driver-name" value="${escapeHtml(editing?.name || "")}" required /></label>
          <label class="field"><span>Telefone</span><input class="input" id="driver-phone" value="${escapeHtml(editing?.phone || "")}" required /></label>
          <label class="field"><span>Usuário entregador</span><select class="select" id="driver-user"><option value="">Sem vínculo</option>${linkedUserOptions}</select></label>
          <label class="field"><span>Endereço / ponto de partida</span><input class="input" id="driver-address" value="${escapeHtml(editing?.address || "")}" placeholder="Digite o endereço do ponto de partida" /></label>
          <label class="field"><span>Veículo</span><input class="input" id="driver-vehicle" value="${escapeHtml(editing?.vehicle || "")}" /></label>
          <label class="field"><span>Placa</span><input class="input" id="driver-plate" value="${escapeHtml(editing?.plate || "")}" /></label>
          <button class="btn" type="submit">${icon("save")}Salvar motorista</button>
        </form>
      </aside>
    </div>
  `;
}

function renderDriverRow(driver) {
  const user = getUser(driver.userId);
  return `
    <tr>
      ${tableCell("Nome", `<strong>${escapeHtml(driver.name)}</strong>`)}
      ${tableCell("Usuário", escapeHtml(user?.username || "-"))}
      ${tableCell("Veículo", `${escapeHtml(driver.vehicle || "-")}<br><span class="muted">${escapeHtml(driver.plate || "")}</span>`)}
      ${tableCell("Contato", escapeHtml(driver.phone))}
      ${tableCell("Status", driver.active ? badge("Ativo", "green") : badge("Inativo", "red"))}
      ${tableCell("Ações", `
        <div class="actions">
          <button class="btn secondary small" onclick="actions.editDriver('${driver.id}')">${icon("edit")}Editar</button>
          <button class="btn secondary small" onclick="actions.toggleDriver('${driver.id}')">${driver.active ? "Inativar" : "Ativar"}</button>
        </div>
      `)}
    </tr>
  `;
}

function renderTasks() {
  return `
    <div class="grid-main-side">
      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div>
            <h2>Tarefas de campo</h2>
            <p>Atribua tarefas para a equipe de motoristas e acompanhe status e horário.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Tarefa</th><th>Motorista</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>${state.tasks.map(renderTaskRow).join("") || `<tr class="table-empty"><td colspan="5">${emptyState("Sem tarefas", "Crie uma tarefa para acompanhar atividades de campo.", "check")}</td></tr>`}</tbody>
          </table>
        </div>
      </section>
      <aside class="panel">
        <h2>Nova tarefa</h2>
        <form class="form-grid" style="margin-top: 14px" onsubmit="actions.createTask(event)">
          <label class="field"><span>Título</span><input class="input" id="task-title" required /></label>
          <label class="field"><span>Detalhes</span><textarea class="textarea" id="task-details"></textarea></label>
          <label class="field"><span>Motorista</span><select class="select" id="task-driver">${state.drivers.filter((d) => d.active).map((driver) => `<option value="${driver.id}">${escapeHtml(driver.name)}</option>`).join("")}</select></label>
          <label class="field"><span>Prazo</span><input class="input" id="task-due" type="datetime-local" /></label>
          <button class="btn" type="submit">${icon("save")}Criar tarefa</button>
        </form>
      </aside>
    </div>
  `;
}

function renderTaskRow(task) {
  const driver = getDriver(task.driverId);
  return `
    <tr>
      ${tableCell("Tarefa", `<strong>${escapeHtml(task.title)}</strong><br><span class="muted">${escapeHtml(task.details || "")}</span>`)}
      ${tableCell("Motorista", escapeHtml(driver?.name || "-"))}
      ${tableCell("Prazo", fmtDate(task.dueAt))}
      ${tableCell("Status", task.status === "concluida" ? badge("Concluída", "green") : badge("Aberta", "amber"))}
      ${tableCell("Ações", `
        <div class="actions">
          <button class="btn small" onclick="actions.setTaskStatus('${task.id}', 'concluida')">${icon("save")}Concluir</button>
          <button class="btn secondary small" onclick="actions.setTaskStatus('${task.id}', 'aberta')">Reabrir</button>
        </div>
      `)}
    </tr>
  `;
}

function renderDriverTasks() {
  const driver = driverForUser(currentUser().id);
  const tasks = driver ? state.tasks.filter((task) => task.driverId === driver.id) : [];
  return `
    <section class="panel">
      <h2>Minhas tarefas</h2>
      <div class="list" style="margin-top: 14px">
        ${tasks
          .map(
            (task) => `
              <article class="item">
                <div class="item-row">
                  <div>
                    <h3>${escapeHtml(task.title)} ${task.status === "concluida" ? badge("Concluída", "green") : badge("Aberta", "amber")}</h3>
                    <p>${escapeHtml(task.details || "")}</p>
                    <p>Prazo: ${fmtDate(task.dueAt)}</p>
                  </div>
                  <button class="btn" onclick="actions.setTaskStatus('${task.id}', 'concluida')">${icon("save")}Concluir</button>
                </div>
              </article>
            `
          )
          .join("") || emptyState("Sem tarefas atribuídas", "Quando o supremo criar uma tarefa para você, ela aparece aqui.", "check")}
      </div>
    </section>
  `;
}

function renderDriverHistory() {
  const driver = driverForUser(currentUser().id);
  const orders = driver ? state.orders.filter((order) => order.driverId === driver.id) : [];
  return `
    <section class="panel flush">
      <div class="section-head" style="padding: 16px">
        <div>
          <h2>Histórico do entregador</h2>
          <p>Tempo de coleta, saída e entrega.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Status</th><th>Atribuido</th><th>Coletado</th><th>Entregue</th><th>Tempo</th></tr></thead>
          <tbody>
            ${orders
              .map((order) => {
                const client = getClient(order.clientId);
                return `<tr>
                  ${tableCell("Pedido", `<strong>${escapeHtml(order.id)}</strong>`)}
                  ${tableCell("Cliente", escapeHtml(client?.name || "-"))}
                  ${tableCell("Status", statusBadge(order.status))}
                  ${tableCell("Atribuído", fmtDate(order.assignedAt))}
                  ${tableCell("Coletado", fmtDate(order.pickedAt))}
                  ${tableCell("Entregue", fmtDate(order.deliveredAt))}
                  ${tableCell("Tempo", deliveryTimer(order))}
                </tr>`;
              })
              .join("") || `<tr class="table-empty"><td colspan="7">${emptyState("Sem entregas", "As corridas finalizadas e em andamento aparecem neste histórico.", "clock")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderProducts() {
  const editing = ui.editingProductId ? getProduct(ui.editingProductId) : null;
  const readonly = !canManage();
  const list = `
      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div>
            <h2>Produtos</h2>
            <p>Estoque, preço de venda e alerta mínimo.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Código</th><th>Produto</th><th>Categoria</th><th>Compra</th><th>Venda</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>${state.products.map((product) => renderProductRow(product, readonly)).join("")}</tbody>
          </table>
        </div>
      </section>
  `;
  if (readonly) return list;
  return `<div class="grid-main-side">${list}${renderProductForm(editing)}</div>`;
}

function renderProductRow(product, readonly) {
  const user = currentUser();
  const sellerIds = user?.role === "vendedor" ? [user.id] : Object.values(SELLER_IDS);
  const statuses = sellerIds.map((sellerId) => productStockStatus(product, sellerId));
  const worst = statuses.find((status) => status.level === "empty") || statuses.find((status) => status.level === "low") || statuses[0];
  const stockLines = sellerIds
    .map((sellerId) => {
      const seller = getUser(sellerId);
      return `${escapeHtml(seller?.name || "Vendedor")}: ${formatGrams(sellerStock(product, sellerId))}`;
    })
    .join("<br>");
  return `
    <tr>
      ${tableCell("Código", escapeHtml(product.code), "mono")}
      ${tableCell("Produto", `<strong>${escapeHtml(product.name)}</strong>`)}
      ${tableCell("Categoria", escapeHtml(product.category))}
      ${tableCell("Compra", money(product.buyPrice))}
      ${tableCell("Venda", `<strong>${money(product.sellPrice)}/g</strong>`)}
      ${tableCell("Estoque", `${stockLines}<br><span class="muted">min ${formatGrams(minStock(product))}</span>`)}
      ${tableCell("Status", product.active ? badge(worst.label, worst.tone) : badge("Inativo", "red"))}
      ${tableCell("Ações", readonly ? `<span class="muted">Consulta</span>` : `<div class="actions"><button class="btn secondary small" onclick="actions.editProduct('${product.id}')">${icon("edit")}Editar</button><button class="btn danger small" onclick="actions.deleteProduct('${product.id}')">${icon("delete")}Excluir</button></div>`)}
    </tr>
  `;
}

function renderProductForm(editing) {
  return `
    <aside class="panel">
      <h2>${editing ? "Editar produto" : "Novo produto"}</h2>
      <p class="panel-subtitle">Ao aumentar estoque, o Caixa registra automaticamente o custo da reposição usando o valor de compra por grama.</p>
      <form class="form-grid" style="margin-top: 14px" onsubmit="actions.saveProduct(event)">
        <input type="hidden" id="product-id" value="${escapeHtml(editing?.id || "")}" />
        <label class="field"><span>Nome</span><input class="input" id="product-name" value="${escapeHtml(editing?.name || "")}" required /></label>
        <label class="field"><span>Código</span><input class="input" id="product-code" value="${escapeHtml(editing?.code || "")}" /></label>
        <label class="field"><span>Categoria</span><input class="input" id="product-category" value="${escapeHtml(editing?.category || "")}" /></label>
        <div class="form-grid two">
          <label class="field"><span>Estoque ALMEIDA (g)</span><input class="input" id="product-stock-almeida" type="number" step="1" value="${escapeHtml(sellerStock(editing, SELLER_IDS.almeida))}" /></label>
          <label class="field"><span>Estoque NÚNCIO (g)</span><input class="input" id="product-stock-nuncio" type="number" step="1" value="${escapeHtml(sellerStock(editing, SELLER_IDS.nuncio))}" /></label>
        </div>
        <div class="form-grid three">
          <label class="field"><span>Compra $/g</span><input class="input" id="product-buy" value="${escapeHtml(editing?.buyPrice ?? "")}" /></label>
          <label class="field"><span>Venda $/g</span><input class="input" id="product-sell" value="${escapeHtml(editing?.sellPrice ?? "")}" /></label>
          <label class="field"><span>Mínimo (g)</span><input class="input" id="product-min" type="number" step="1" value="${escapeHtml(editing?.minStock ?? 0)}" /></label>
        </div>
        <button class="btn" type="submit">${icon("save")}Salvar produto</button>
      </form>
    </aside>
  `;
}

function renderClients() {
  const editing = ui.editingClientId ? getClient(ui.editingClientId) : null;
  return `
    <div class="grid-main-side">
      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div>
            <h2>Clientes</h2>
            <p>Cadastro usado para entrega, aviso automático e pagamento.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Cliente</th><th>Contato</th><th>Endereço</th><th>Pagamento</th><th>Saldo</th><th>Ações</th></tr></thead>
            <tbody>${state.clients.map(renderClientRow).join("")}</tbody>
          </table>
        </div>
      </section>
      <aside class="panel">
        <h2>${editing ? "Editar cliente" : "Novo cliente"}</h2>
        <form class="form-grid" style="margin-top: 14px" onsubmit="actions.saveClient(event)">
          <input type="hidden" id="client-id" value="${escapeHtml(editing?.id || "")}" />
          <label class="field"><span>Nome</span><input class="input" id="client-name" value="${escapeHtml(editing?.name || "")}" required /></label>
          <label class="field"><span>Telefone WhatsApp</span><input class="input" id="client-phone" value="${escapeHtml(editing?.phone || "")}" /></label>
          <label class="field"><span>CPF/CNPJ</span><input class="input" id="client-document" value="${escapeHtml(editing?.document || "")}" /></label>
          <label class="field"><span>Endereço de entrega</span><input class="input" id="client-address" value="${escapeHtml(editing?.address || "")}" placeholder="Digite rua, número e referência" /></label>
          <label class="field"><span>Bairro</span><select class="select" id="client-neighborhood">${ALL_NEIGHBORHOODS.map((item) => `<option value="${escapeHtml(item.name)}" ${editing?.neighborhood === item.name ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></label>
          <label class="field"><span>Pagamento preferido</span><select class="select" id="client-payment">${PAYMENT_OPTIONS.map(([value, label]) => `<option value="${value}" ${editing?.paymentPreference === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></label>
          <div class="form-grid two">
            <label class="field"><span>Limite fiado</span><input class="input" id="client-limit" value="${escapeHtml(editing?.creditLimit ?? 0)}" /></label>
            <label class="field"><span>Saldo</span><input class="input" id="client-balance" value="${escapeHtml(editing?.balance ?? 0)}" /></label>
          </div>
          <button class="btn" type="submit">${icon("save")}Salvar cliente</button>
        </form>
      </aside>
    </div>
  `;
}

function renderClientRow(client) {
  return `
    <tr>
      ${tableCell("Cliente", `<strong>${escapeHtml(client.name)}</strong><br><span class="muted">${escapeHtml(client.document || "")}</span>`)}
      ${tableCell("Contato", escapeHtml(client.phone || "-"))}
      ${tableCell("Endereço", `${escapeHtml(client.address || "-")}<br><span class="muted">${escapeHtml(client.neighborhood || neighborhoodFromAddress(client.address) || "-")}</span>`)}
      ${tableCell("Pagamento", escapeHtml(client.paymentPreference || "-"))}
      ${tableCell("Saldo", `<strong>${money(client.balance)}</strong><br><span class="muted">limite ${money(client.creditLimit)}</span>`)}
      ${tableCell("Ações", `<div class="actions"><button class="btn secondary small" onclick="actions.editClient('${client.id}')">${icon("edit")}Editar</button><button class="btn danger small" onclick="actions.deleteClient('${client.id}')">${icon("delete")}Excluir</button></div>`)}
    </tr>
  `;
}

function renderFinance() {
  const summary = financialSummary();
  const movements = ordersToMovements(state.orders);
  const byPayment = PAYMENT_OPTIONS.map(([payment]) => ({
    payment,
    total: state.orders.filter((order) => order.payment === payment && order.status !== "cancelado").reduce((sum, order) => sum + orderTotal(order), 0)
  }));
  return `
    <div class="cards">
      ${metricCard("Conta bancária atual", money(summary.bankBalance), "Saldo base + vendas - gastos", "blue", "database")}
      ${metricCard("Valor bruto", money(summary.gross), `${summary.validOrders.length} pedidos válidos`, "green", "money")}
      ${metricCard("Valor líquido", money(summary.liquid), "Bruto - estoque - despesas - equipe", summary.liquid >= 0 ? "purple" : "red", "chart")}
      ${metricCard("A pagar equipe", money(summary.payroll), "Vendedores no bruto; BRITO nas entregas", "amber", "users")}
      ${metricCard("Estoque reposto", money(summary.stockCost), `${state.stockPurchases.length} reposições`, "red", "box")}
      ${metricCard("Gastos avulsos", money(summary.expenseCost), `${state.expenses.length} despesas`, "red", "receipt")}
    </div>

    <div class="grid-main-side">
      <section class="panel">
        <h2>Ajustes do caixa</h2>
        <p class="panel-subtitle">Vendedores recebem percentual do valor bruto total. BRITO recebe diariamente percentual das entregas concluídas no dia.</p>
        <form class="form-grid three" style="margin-top: 14px" onsubmit="actions.saveFinanceSettings(event)">
          <label class="field"><span>Saldo base/atual informado</span><input class="input" id="finance-bank" value="${escapeHtml(state.settings.bankOpeningBalance ?? 0)}" /></label>
          <label class="field"><span>Vendedores % do bruto</span><input class="input" id="finance-seller-pct" value="${escapeHtml(state.settings.sellerCommissionPct ?? 10)}" /></label>
          <label class="field"><span>BRITO % das entregas</span><input class="input" id="finance-driver-pct" value="${escapeHtml(state.settings.driverDeliveryPct ?? 50)}" /></label>
          <button class="btn" type="submit">${icon("save")}Salvar caixa</button>
        </form>
      </section>

      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div><h2>A pagar funcionários</h2><p>ALMEIDA e NÚNCIO usam o bruto total. BRITO usa somente as entregas concluídas hoje.</p></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Funcionário</th><th>Função</th><th>Pedidos/entregas</th><th>Base</th><th>Taxa</th><th>A pagar</th></tr></thead>
            <tbody>
              ${summary.payrollRows
                .map(
                  (row) => `
                    <tr>
                      ${tableCell("Funcionário", `<strong>${escapeHtml(row.name)}</strong>`)}
                      ${tableCell("Função", escapeHtml(row.role))}
                      ${tableCell("Pedidos/entregas", escapeHtml(row.orders))}
                      ${tableCell("Base", money(row.base))}
                      ${tableCell("Taxa", `${escapeHtml(row.rate)}%`)}
                      ${tableCell("A pagar", `<strong>${money(row.value)}</strong>`)}
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div class="grid-2">
      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div><h2>Reposições de estoque</h2><p>Cada aumento de estoque entra como gasto.</p></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Produto</th><th>Vendedor</th><th>Qtd</th><th>Compra</th><th>Total pago</th></tr></thead>
            <tbody>
              ${state.stockPurchases
                .map(
                  (purchase) => `
                    <tr>
                      ${tableCell("Data", fmtDate(purchase.createdAt))}
                      ${tableCell("Produto", `<strong>${escapeHtml(purchase.productName || purchase.productId)}</strong>`)}
                      ${tableCell("Vendedor", escapeHtml(purchase.sellerName || getUser(purchase.sellerId)?.name || "-"))}
                      ${tableCell("Qtd", formatGrams(purchase.qty))}
                      ${tableCell("Compra", `${money(purchase.unitCost)}/g`)}
                      ${tableCell("Total pago", `<strong>${money(purchase.totalCost)}</strong>`)}
                    </tr>
                  `
                )
                .join("") || `<tr class="table-empty"><td colspan="6">${emptyState("Nenhuma reposição registrada", "Quando o estoque aumentar, o custo entra aqui automaticamente.", "box")}</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <h2>Gastos avulsos</h2>
        <p class="panel-subtitle">Use para qualquer gasto fora da reposição automática.</p>
        <form class="form-grid" style="margin-top: 14px" onsubmit="actions.addExpense(event)">
          <label class="field"><span>Descrição</span><input class="input" id="expense-description" placeholder="Ex: gasolina, embalagem, manutenção..." required /></label>
          <div class="form-grid two">
            <label class="field"><span>Categoria</span><select class="select" id="expense-category"><option>Operação</option><option>Estoque</option><option>Equipe</option><option>Outro</option></select></label>
            <label class="field"><span>Valor $</span><input class="input" id="expense-value" required /></label>
          </div>
          <button class="btn" type="submit">${icon("save")}Registrar gasto</button>
        </form>
        <div class="list" style="margin-top: 14px">
          ${state.expenses
            .map(
              (expense) => `
                <div class="item-row item">
                  <span><strong>${escapeHtml(expense.description)}</strong><br><span class="muted">${fmtDate(expense.createdAt)} - ${escapeHtml(expense.category)}</span></span>
                  <span class="actions"><strong>${money(expense.value)}</strong><button class="btn danger small" onclick="actions.deleteExpense('${expense.id}')">${icon("delete")}Excluir</button></span>
                </div>
              `
            )
            .join("") || emptyState("Nenhum gasto avulso registrado", "Use o formulário acima para lançar custos fora da reposição.", "receipt")}
        </div>
      </section>
    </div>

    <div class="grid-2">
      <section class="panel flush">
        <div class="section-head" style="padding: 16px"><div><h2>Movimentações</h2><p>Entradas, reposições e despesas.</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Forma</th><th>Valor</th></tr></thead>
            <tbody>
              ${movements.map((m) => `<tr>
                ${tableCell("Data", fmtDate(m.createdAt))}
                ${tableCell("Tipo", badge(m.type, m.type === "Entrada" ? "green" : "red"))}
                ${tableCell("Descrição", escapeHtml(m.description))}
                ${tableCell("Forma", escapeHtml(m.method))}
                ${tableCell("Valor", `<strong>${money(m.value)}</strong>`)}
              </tr>`).join("") || `<tr class="table-empty"><td colspan="5">${emptyState("Sem movimentações", "Entradas e saídas financeiras aparecem aqui.", "money")}</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <h2>Por pagamento</h2>
        <div class="list" style="margin-top: 14px">
          ${byPayment.map((row) => `<div class="item-row item"><span>${escapeHtml(row.payment)}</span><strong>${money(row.total)}</strong></div>`).join("")}
        </div>
        <div class="item" style="margin-top: 14px">
          <div class="item-row"><span>Venda de produtos</span><strong>${money(summary.productGross)}</strong></div>
          <div class="item-row"><span>Taxas de entrega</span><strong>${money(summary.deliveryGross)}</strong></div>
          <div class="item-row"><span>Gastos totais</span><strong>${money(summary.outgoing)}</strong></div>
          <div class="item-row"><span>Saldo após pagar equipe</span><strong>${money(summary.bankBalance - summary.payroll)}</strong></div>
        </div>
      </section>
    </div>
  `;
}

function renderReports() {
  const delivered = state.orders.filter((order) => order.status === "entregue").length;
  const active = state.orders.filter((order) => !["entregue", "cancelado"].includes(order.status)).length;
  const total = state.orders.filter((order) => order.status !== "cancelado").reduce((sum, order) => sum + orderTotal(order), 0);
  const maxProductSales = Math.max(
    1,
    ...state.products.map((product) =>
      state.orders.reduce((sum, order) => sum + order.items.filter((item) => item.productId === product.id).reduce((s, item) => s + item.qty, 0), 0)
    )
  );

  return `
    <div class="section-head">
      <div><h2>Relatórios</h2><p>Visão de vendas, produtos, entregas e tempo operacional.</p></div>
      <button class="btn secondary" onclick="actions.exportCsv()">${icon("database")}Exportar CSV</button>
    </div>
    <div class="cards">
      ${metricCard("Pedidos ativos", String(active), "Aguardando conclusão", "blue", "receipt")}
      ${metricCard("Entregues", String(delivered), "Finalizados", "green", "truck")}
      ${metricCard("Receita total", money(total), "Pedidos validos", "purple", "money")}
      ${metricCard("Ticket médio", money(total / Math.max(1, state.orders.length)), "Média geral", "amber", "chart")}
    </div>
    <section class="panel">
      <h2>Produtos vendidos</h2>
      <div class="list" style="margin-top: 14px">
        ${state.products
          .map((product) => {
            const qty = state.orders.reduce((sum, order) => sum + order.items.filter((item) => item.productId === product.id).reduce((s, item) => s + item.qty, 0), 0);
            return `
              <div class="item">
                <div class="item-row"><strong>${escapeHtml(product.name)}</strong><span>${qty} ${escapeHtml(product.unit)}</span></div>
                <div style="height: 10px; border-radius: 999px; background: var(--surface-2); margin-top: 10px; overflow: hidden">
                  <div style="width: ${(qty / maxProductSales) * 100}%; height: 100%; background: var(--brand)"></div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderWhatsapp() {
  const user = currentUser();
  const isManager = canManage();
  const leads = (state.whatsappLeads || [])
    .filter((lead) => isManager || lead.sellerId === user.id)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const connectionTone = whatsappServerOnline || state.settings.whatsappConnected ? "green" : "amber";
  const connectionText = whatsappServerOnline ? "Servidor online" : state.settings.whatsappConnected ? "Conectado manual" : "Desconectado";

  return `
    <div class="section-head">
      <div>
        <h2>WhatsApp</h2>
        <p>Receba contatos, peça nome/vulgo, indicação e bairro, e direcione automaticamente para o vendedor da área.</p>
      </div>
      ${badge(connectionText, connectionTone)}
    </div>
    ${
      isManager
        ? `
          <div class="grid-main-side">
            <section class="panel">
              <h2>Conexão</h2>
              <p class="panel-subtitle">O contato salvo como "DUCA - Ponta Aguda" pode pingar direto no servidor pelo endpoint abaixo.</p>
              <form class="form-grid" style="margin-top: 14px" onsubmit="actions.saveWhatsappSettings(event)">
                <label class="field"><span>Número WhatsApp</span><input class="input" id="whatsapp-number" value="${escapeHtml(state.settings.whatsappNumber || "")}" /></label>
                <label class="field"><span>Mensagem automática</span><textarea class="textarea" id="whatsapp-auto-reply">${escapeHtml(state.settings.whatsappAutoReply || "")}</textarea></label>
                <div class="actions">
                  <button class="btn" type="submit">${icon("save")}Salvar WhatsApp</button>
                  <button class="btn secondary" type="button" onclick="actions.toggleWhatsappConnection()">${icon("phone")}${state.settings.whatsappConnected ? "Desconectar" : "Conectar"}</button>
                </div>
              </form>
              <div class="item" style="margin-top: 14px">
                <h3>Webhook local</h3>
                <p class="mono">POST /api/whatsapp/contact</p>
                <p>Envie <span class="mono">name</span> e <span class="mono">phone</span>. Ex: <span class="mono">DUCA - Ponta Aguda</span> + <span class="mono">554792625104</span>.</p>
              </div>
            </section>
            <section class="panel">
              <h2>Entrada recebida</h2>
              <p class="panel-subtitle">Cole aqui a resposta do cliente. O sistema cadastra e manda para ALMEIDA ou NÚNCIO pelo bairro.</p>
              <form class="form-grid" style="margin-top: 14px" onsubmit="actions.processWhatsappMessage(event)">
                <label class="field"><span>Telefone</span><input class="input" id="whatsapp-phone" placeholder="Ex: 5547999999999" required /></label>
                <label class="field"><span>Mensagem recebida</span><textarea class="textarea" id="whatsapp-message" placeholder="Ex: nome: João&#10;quem passou: Maria&#10;bairro: Centro" required></textarea></label>
                <button class="btn" type="submit">${icon("save")}Processar contato</button>
              </form>
            </section>
          </div>
        `
        : ""
    }
    <section class="panel flush">
      <div class="section-head" style="padding: 16px">
        <div><h2>${isManager ? "Contatos direcionados" : "Meus contatos do WhatsApp"}</h2><p>Clientes criados automaticamente pelo fluxo de WhatsApp.</p></div>
      </div>
      <div class="list" style="padding: 0 16px 16px">
        ${leads.map(renderWhatsappLead).join("") || emptyState("Nenhum contato recebido", "Quando o WhatsApp identificar nome e bairro, o lead cai aqui para o vendedor certo.", "message")}
      </div>
    </section>
  `;
}

function renderWhatsappLead(lead) {
  const seller = getUser(lead.sellerId);
  const client = getClient(lead.clientId);
  const messages = (lead.messages || []).slice(-4);
  return `
    <article class="item">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(lead.name || client?.name || "Contato")} ${badge(lead.status || "novo", lead.status === "finalizado" ? "green" : "amber")}</h3>
          <p>${escapeHtml(lead.phone || client?.phone || "-")} - ${escapeHtml(lead.neighborhood || client?.neighborhood || "-")} - ${escapeHtml(seller?.name || "Vendedor")}</p>
          <p>Indicado por: ${escapeHtml(lead.referredBy || "Não informado")}</p>
          <p>${escapeHtml(lead.rawMessage || "")}</p>
        </div>
        <div class="actions">
          <a class="btn secondary small" target="_blank" rel="noreferrer" href="${whatsappDirectUrl(lead.phone, `Olá ${lead.name || ""}, seu contato foi direcionado para ${seller?.name || "o vendedor da área"}.`)}">${icon("phone")}Abrir</a>
          <button class="btn small" onclick="actions.setWhatsappLeadStatus('${lead.id}', 'em atendimento')">${icon("save")}Atender</button>
          <button class="btn secondary small" onclick="actions.setWhatsappLeadStatus('${lead.id}', 'finalizado')">${icon("save")}Finalizar</button>
        </div>
      </div>
      ${
        messages.length
          ? `<div class="whatsapp-thread">${messages
              .map(
                (message) => `
                  <div class="whatsapp-bubble ${message.direction === "saida" ? "out" : "in"}">
                    <strong>${message.direction === "saida" ? "Sistema" : "Cliente"}</strong>
                    <span>${escapeHtml(message.body)}</span>
                    <small>${fmtDate(message.createdAt)}</small>
                  </div>
                `
              )
              .join("")}</div>`
          : ""
      }
      <div class="form-grid two driver-action-grid" style="margin-top: 12px">
        <input class="input" id="reply-${lead.id}" placeholder="Responder direto pelo sistema" />
        <button class="btn" onclick="actions.replyWhatsappLead('${lead.id}')">${icon("phone")}Enviar resposta</button>
      </div>
    </article>
  `;
}

function renderAccount() {
  const user = currentUser();
  return `
    <section class="panel">
      <h2>Alterar senha</h2>
      <p class="panel-subtitle">Atualize a senha do usuário logado.</p>
      <form class="form-grid" style="margin-top: 14px; max-width: 520px" onsubmit="actions.changeOwnPassword(event)">
        <label class="field"><span>Senha atual</span><input class="input" id="password-current" type="password" autocomplete="current-password" required /></label>
        <label class="field"><span>Nova senha</span><input class="input" id="password-new" type="password" autocomplete="new-password" required /></label>
        <label class="field"><span>Confirmar nova senha</span><input class="input" id="password-confirm" type="password" autocomplete="new-password" required /></label>
        <button class="btn" type="submit">${icon("save")}Salvar senha</button>
      </form>
      <div class="item" style="margin-top: 14px; max-width: 520px">
        <div class="item-row"><span>Usuário</span><strong>${escapeHtml(user?.username || "-")}</strong></div>
        <div class="item-row"><span>Perfil</span><strong>${escapeHtml(ROLES[user?.role] || "-")}</strong></div>
      </div>
    </section>
  `;
}

function renderUsers() {
  const editing = ui.editingUserId ? getUser(ui.editingUserId) : null;
  return `
    <div class="grid-main-side">
      <section class="panel flush">
        <div class="section-head" style="padding: 16px">
          <div><h2>Usuários e permissoes</h2><p>O Usuário Supremo pode controlar todos os perfis.</p></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Usuario</th><th>Papel</th><th>Endereço retirada</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>${state.users.map(renderUserRow).join("")}</tbody>
          </table>
        </div>
      </section>
      <aside class="panel">
        <h2>${editing ? "Editar usuário" : "Novo usuário"}</h2>
        <form class="form-grid" style="margin-top: 14px" onsubmit="actions.saveUser(event)">
          <input type="hidden" id="user-id" value="${escapeHtml(editing?.id || "")}" />
          <label class="field"><span>Nome</span><input class="input" id="user-name" value="${escapeHtml(editing?.name || "")}" required /></label>
          <label class="field"><span>Usuário</span><input class="input" id="user-username" value="${escapeHtml(editing?.username || "")}" required /></label>
          <label class="field"><span>Senha</span><input class="input" id="user-password" value="${escapeHtml(editing?.password || "1234")}" required /></label>
          <label class="field"><span>Papel</span><select class="select" id="user-role">${Object.entries(ROLES).map(([value, label]) => `<option value="${value}" ${editing?.role === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></label>
          <label class="field"><span>Telefone</span><input class="input" id="user-phone" value="${escapeHtml(editing?.phone || "")}" /></label>
          <label class="field"><span>Endereço / ponto de retirada</span><input class="input" id="user-address" value="${escapeHtml(editing?.address || "")}" placeholder="Digite o endereço usado nas retiradas" /></label>
          <button class="btn" type="submit">${icon("save")}Salvar usuário</button>
        </form>
      </aside>
    </div>
  `;
}

function renderUserRow(user) {
  return `
    <tr>
      ${tableCell("Nome", `<strong>${escapeHtml(user.name)}</strong><br><span class="muted">${escapeHtml(user.phone || "")}</span>`)}
      ${tableCell("Usuário", escapeHtml(user.username), "mono")}
      ${tableCell("Papel", roleBadge(user.role))}
      ${tableCell("Endereço retirada", escapeHtml(user.address || "-"))}
      ${tableCell("Status", user.active ? badge("Ativo", "green") : badge("Bloqueado", "red"))}
      ${tableCell("Ações", `<div class="actions"><button class="btn secondary small" onclick="actions.editUser('${user.id}')">${icon("edit")}Editar</button><button class="btn secondary small" onclick="actions.toggleUser('${user.id}')">${user.active ? "Bloquear" : "Ativar"}</button></div>`)}
    </tr>
  `;
}

function renderSettings() {
  return `
    <section class="panel">
      <h2>Ajustes da empresa</h2>
      <form class="form-grid two" style="margin-top: 14px" onsubmit="actions.saveSettings(event)">
        <label class="field"><span>Nome da empresa</span><input class="input" id="settings-name" value="${escapeHtml(state.settings.businessName)}" /></label>
        <label class="field"><span>Telefone</span><input class="input" id="settings-phone" value="${escapeHtml(state.settings.businessPhone)}" /></label>
        <label class="field"><span>Chave Pix</span><input class="input" id="settings-pix" value="${escapeHtml(state.settings.pixKey)}" /></label>
        <label class="field"><span>Endereço base</span><input class="input" id="settings-address" value="${escapeHtml(state.settings.businessAddress || "Base central")}" placeholder="Digite o endereço base da operação" /></label>
        <label class="field"><span>Taxa entrega padrão</span><input class="input" id="settings-delivery" value="${escapeHtml(state.settings.defaultDeliveryFee)}" /></label>
        <label class="field"><span>Taxa maquininha %</span><input class="input" id="settings-card" value="${escapeHtml(state.settings.cardMachineFeePct)}" /></label>
        <label class="field" style="grid-column: 1 / -1"><span>Mensagem de aviso ao cliente</span><textarea class="textarea" id="settings-notification">${escapeHtml(state.settings.notificationText)}</textarea></label>
        <button class="btn" type="submit">${icon("save")}Salvar ajustes</button>
      </form>
    </section>
  `;
}

function renderBackup() {
  return `
    <div class="grid-main-side">
      <section class="panel">
        <h2>Backup</h2>
        <p class="panel-subtitle">Exportação e importação dos dados do app web.</p>
        <div class="actions" style="margin-top: 14px">
          <button class="btn" onclick="actions.exportBackup()">${icon("database")}Gerar backup</button>
          <button class="btn secondary" onclick="actions.importBackup()">${icon("save")}Restaurar</button>
          <button class="btn danger" onclick="actions.resetDemo()">${icon("delete")}Resetar demo</button>
        </div>
        <textarea class="textarea mono" id="backup-data" style="margin-top: 14px; min-height: 360px" placeholder="O backup aparece aqui."></textarea>
      </section>
      <section class="panel">
        <h2>Estado atual</h2>
        <div class="list" style="margin-top: 14px">
          <div class="item-row item"><span>Usuários</span><strong>${state.users.length}</strong></div>
          <div class="item-row item"><span>Produtos</span><strong>${state.products.length}</strong></div>
          <div class="item-row item"><span>Clientes</span><strong>${state.clients.length}</strong></div>
          <div class="item-row item"><span>Pedidos</span><strong>${state.orders.length}</strong></div>
          <div class="item-row item"><span>Reposições</span><strong>${state.stockPurchases.length}</strong></div>
          <div class="item-row item"><span>Despesas</span><strong>${state.expenses.length}</strong></div>
          <div class="item-row item"><span>WhatsApp</span><strong>${state.whatsappLeads.length}</strong></div>
          <div class="item-row item"><span>Notificações</span><strong>${state.notifications.length}</strong></div>
        </div>
      </section>
    </div>
  `;
}

function renderAudit() {
  return `
    <section class="panel flush">
      <div class="section-head" style="padding: 16px">
        <div><h2>Auditoria do Supremo</h2><p>Registro das operações importantes.</p></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Usuario</th><th>Ação</th></tr></thead>
          <tbody>${state.audit.map((entry) => `<tr>
            ${tableCell("Data", fmtDate(entry.createdAt))}
            ${tableCell("Usuário", escapeHtml(getUser(entry.userId)?.name || entry.userId))}
            ${tableCell("Ação", escapeHtml(entry.action))}
          </tr>`).join("") || `<tr class="table-empty"><td colspan="3">${emptyState("Sem auditoria", "As operações importantes ficam registradas aqui.", "database")}</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderNotifications() {
  const user = currentUser();
  const orders = visibleOrders();
  const orderIds = new Set(orders.map((order) => order.id));
  const items = canManage()
    ? state.notifications
    : state.notifications.filter((notification) => orderIds.has(notification.orderId) || notification.audience === user.id);
  return `
    <section class="panel">
      <h2>Avisos ao cliente</h2>
      <div class="notification-list" style="margin-top: 14px">
        ${items.map(renderNotificationItem).join("") || emptyState("Nenhum aviso para este perfil", "As notificações de pedidos, estoque e WhatsApp aparecem aqui.", "bell")}
      </div>
    </section>
  `;
}

function renderNotificationItem(notification) {
  const client = getClient(notification.clientId);
  const title = notification.audience === "supremo" ? "SUPREMO" : notification.orderId;
  const target = client?.name || (notification.audience === "supremo" ? "Sistema" : "Cliente");
  const hasWhatsApp = Boolean(client?.phone);
  return `
    <article class="item notification ${notification.tone || ""}">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(title)} · ${escapeHtml(target)} ${badge(notification.status, notification.status === "enviada" ? "green" : "amber")}</h3>
          <p>${escapeHtml(notification.message)}</p>
          <p>${fmtDate(notification.createdAt)} · ${escapeHtml(notification.channel)}</p>
        </div>
        <div class="actions">
          ${hasWhatsApp ? `<a class="btn secondary small" target="_blank" rel="noreferrer" href="${whatsappUrl(notification)}">${icon("phone")}WhatsApp</a>` : ""}
          <button class="btn small" onclick="actions.markNotificationSent('${notification.id}')">${icon("save")}Enviado</button>
        </div>
      </div>
    </article>
  `;
}

function whatsappUrl(notification) {
  const client = getClient(notification.clientId);
  const phone = String(client?.phone || "").replace(/\D/g, "");
  const text = encodeURIComponent(notification.message);
  return `https://wa.me/${phone}?text=${text}`;
}

function whatsappDirectUrl(phone, message = "") {
  const digits = String(phone || "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}${text ? `?text=${text}` : ""}`;
}

function renderAuditLine(action) {
  addAudit(action);
}

window.actions = {
  login(event) {
    event.preventDefault();
    const username = document.querySelector("#login-username").value.trim();
    const password = document.querySelector("#login-password").value.trim();
    const user = state.users.find((item) => item.username === username && item.password === password && item.active);
    if (!user) {
      showToast("Usuário ou senha inválidos.");
      return;
    }
    state.session = { userId: user.id, activeView: MENU[user.role][0][0], loggedAt: new Date().toISOString() };
    ui.activeView = state.session.activeView;
    addAudit(`Login realizado por ${user.username}`);
    commit(`Bem-vindo, ${user.name}.`);
  },
  logout() {
    state.session = null;
    ui.cart = [];
    ui.newOrderNeighborhood = null;
    saveState();
    render();
  },
  setView(view) {
    ui.activeView = view;
    if (state.session) state.session.activeView = view;
    saveState();
    render();
  },
  async installApp() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    render();
  },
  async requestNotifications() {
    prepareNotificationSound();
    if (!("Notification" in window)) {
      playNotificationSound({ force: true });
      showToast("Som de notificação ativado neste navegador.");
      return;
    }
    const permission = await Notification.requestPermission();
    playNotificationSound({ force: true });
    showToast(permission === "granted" ? "Notificações e som ativados." : "Som ativado. Notificação visual não ativada.");
  },
  changeOwnPassword(event) {
    event.preventDefault();
    const user = currentUser();
    const currentPassword = document.querySelector("#password-current").value;
    const nextPassword = document.querySelector("#password-new").value.trim();
    const confirmPassword = document.querySelector("#password-confirm").value.trim();
    if (!user || currentPassword !== user.password) return showToast("Senha atual incorreta.");
    if (nextPassword.length < 4) return showToast("A nova senha precisa ter pelo menos 4 caracteres.");
    if (nextPassword !== confirmPassword) return showToast("Confirme a nova senha corretamente.");
    user.password = nextPassword;
    addAudit(`Senha alterada por ${user.username}`);
    commit("Senha alterada com sucesso.");
  },
  toggleWhatsappConnection() {
    state.settings.whatsappConnected = !state.settings.whatsappConnected;
    addAudit(`WhatsApp ${state.settings.whatsappConnected ? "conectado" : "desconectado"}`);
    commit(state.settings.whatsappConnected ? "WhatsApp conectado no sistema." : "WhatsApp desconectado.");
  },
  saveWhatsappSettings(event) {
    event.preventDefault();
    state.settings.whatsappNumber = document.querySelector("#whatsapp-number").value.trim();
    state.settings.whatsappAutoReply = document.querySelector("#whatsapp-auto-reply").value.trim();
    addAudit("Ajustes do WhatsApp atualizados");
    commit("WhatsApp salvo.");
  },
  processWhatsappMessage(event) {
    event.preventDefault();
    if (!state.settings.whatsappConnected) {
      showToast("Conecte o WhatsApp antes de processar mensagens.");
      return;
    }
    const phone = document.querySelector("#whatsapp-phone").value.trim();
    const rawMessage = document.querySelector("#whatsapp-message").value.trim();
    const lead = processWhatsappIncoming({
      id: uid("MANUAL"),
      phone,
      body: rawMessage,
      name: parseWhatsappLeadMessage(rawMessage).name
    });
    if (!lead) showToast("A mensagem precisa ter nome/vulgo e bairro de Blumenau.");
  },
  async replyWhatsappLead(id) {
    const lead = state.whatsappLeads.find((item) => item.id === id);
    const input = document.querySelector(`#reply-${id}`);
    const message = input?.value.trim();
    if (!lead || !message) return showToast("Digite a resposta.");
    try {
      const result = await sendWhatsappReply(lead.phone, message);
      lead.messages = lead.messages || [];
      lead.messages.push({
        id: uid("MSG"),
        direction: "saida",
        createdAt: new Date().toISOString(),
        body: message,
        status: result.sent ? "enviada" : "fila"
      });
      lead.status = "em atendimento";
      addAudit(`Resposta WhatsApp enviada para ${lead.name}`);
      commit(result.sent ? "Resposta enviada pelo WhatsApp." : "Resposta registrada. Configure a API real para envio automático.");
    } catch {
      showToast("Servidor WhatsApp indisponível para envio.");
    }
  },
  setWhatsappLeadStatus(id, status) {
    const lead = state.whatsappLeads.find((item) => item.id === id);
    if (!lead) return;
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    addAudit(`Lead WhatsApp ${lead.name} marcado como ${status}`);
    commit("Contato do WhatsApp atualizado.");
  },
  setOrderNeighborhood(value) {
    const user = currentUser();
    const nextSellerId = user?.role === "vendedor" ? user.id : sellerForNeighborhood(value);
    ui.newOrderNeighborhood = value;
    if (ui.cart.length && ui.cart.some((item) => item.sellerId !== nextSellerId)) {
      ui.cart = [];
      showToast("Carrinho limpo para trocar o vendedor do bairro.");
      render();
      return;
    }
    const sellerSelect = document.querySelector("#order-seller");
    if (sellerSelect) sellerSelect.value = nextSellerId;
    document.querySelectorAll("#cart-product option").forEach((option) => {
      const product = getProduct(option.value);
      if (!product) return;
      option.textContent = `${product.name} - ${money(product.sellPrice)}/g - ${formatGrams(sellerStock(product, nextSellerId))}`;
    });
    actions.updateCartPreview();
  },
  useClientNeighborhood() {
    const clientId = document.querySelector("#order-client")?.value;
    const client = getClient(clientId);
    const neighborhood = client?.neighborhood || neighborhoodFromAddress(client?.address || "");
    const allowed = neighborhoodsForUser();
    if (neighborhood && allowed.includes(neighborhood)) {
      const neighborhoodSelect = document.querySelector("#order-neighborhood");
      if (neighborhoodSelect) neighborhoodSelect.value = neighborhood;
      actions.setOrderNeighborhood(neighborhood);
      return;
    }
    actions.updateCartPreview();
  },
  updateCartPreview() {
    const preview = document.querySelector("#cart-preview");
    if (!preview) return;
    const product = getProduct(document.querySelector("#cart-product")?.value);
    if (!product) {
      preview.textContent = "Cadastre um produto ativo.";
      return;
    }
    const mode = document.querySelector("#cart-mode")?.value || "gramas";
    const amount = document.querySelector("#cart-amount")?.value || 0;
    const sellerId = selectedSellerIdForOrder();
    const seller = getUser(sellerId);
    const calc = cartCalculation(product, mode, amount);
    const stock = sellerStock(product, sellerId);
    preview.textContent = `${formatGrams(calc.qty)} = ${money(calc.total)} | Estoque ${seller?.name || "vendedor"}: ${formatGrams(stock)}`;
    preview.classList.toggle("warning", calc.qty > stock);
  },
  addToCart() {
    const productId = document.querySelector("#cart-product")?.value;
    const mode = document.querySelector("#cart-mode")?.value || "gramas";
    const amount = integerValue(document.querySelector("#cart-amount")?.value);
    const product = getProduct(productId);
    const sellerId = selectedSellerIdForOrder();
    const seller = getUser(sellerId);
    if (!product || amount <= 0) {
      showToast("Informe produto e quantidade/valor validos.");
      return;
    }
    const calc = cartCalculation(product, mode, amount);
    if (calc.qty > sellerStock(product, sellerId)) {
      showToast(`Estoque insuficiente para ${seller?.name || "vendedor"}.`);
      return;
    }
    ui.cart.push({
      productId,
      qty: calc.qty,
      price: calc.price,
      entryMode: mode,
      sourceAmount: calc.sourceAmount,
      sellerId
    });
    render();
  },
  removeFromCart(index) {
    ui.cart.splice(index, 1);
    render();
  },
  createOrder() {
    if (!ui.cart.length) {
      showToast("Adicione pelo menos um item.");
      return;
    }
    const user = currentUser();
    const clientId = document.querySelector("#order-client")?.value;
    const deliveryNeighborhood = document.querySelector("#order-neighborhood")?.value || selectedNeighborhoodForOrder(user);
    const sellerId = user.role === "vendedor" ? user.id : sellerForNeighborhood(deliveryNeighborhood);
    const payment = document.querySelector("#order-payment")?.value || "Pix";
    const deliveryFee = toNumber(document.querySelector("#order-delivery-fee")?.value);
    const deliveryAddress = document.querySelector("#order-address")?.value.trim() || "";
    const notes = document.querySelector("#order-notes")?.value.trim() || "";
    const client = getClient(clientId);
    const seller = getUser(sellerId);

    if (!client || !seller) {
      showToast("Cliente e vendedor são obrigatórios.");
      return;
    }

    const wrongSeller = ui.cart.find((item) => item.sellerId !== sellerId);
    if (wrongSeller) {
      showToast("Esse carrinho foi montado para outro vendedor. Revise o bairro.");
      return;
    }

    const invalidStock = ui.cart.find((item) => item.qty > sellerStock(getProduct(item.productId), sellerId));
    if (invalidStock) {
      showToast("Algum item ficou sem estoque. Revise o carrinho.");
      return;
    }

    ui.cart.forEach((item) => {
      const product = getProduct(item.productId);
      adjustSellerStock(product, sellerId, -Number(item.qty));
      notifyStockIfNeeded(product, sellerId);
    });
    const destinationAddress = deliveryAddress || client.address;
    const destinationPoint = addressPoint(`${destinationAddress}, ${deliveryNeighborhood}, Blumenau`);

    const order = {
      id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      sellerReadyAt: null,
      assignedAt: null,
      pickedAt: null,
      outForDeliveryAt: null,
      deliveredAt: null,
      sellerId,
      clientId,
      deliveryAddress: destinationAddress,
      deliveryNeighborhood,
      deliveryLat: destinationPoint.lat,
      deliveryLng: destinationPoint.lng,
      driverId: null,
      routeCode: null,
      status: "vendedor",
      payment,
      deliveryFee,
      notes,
      codes: {
        driver: makeCode("MOT")
      },
      items: ui.cart.map((item) => ({ ...item }))
    };

    state.orders.unshift(order);
    notifyClient(order, `Pedido ${order.id} recebido. O vendedor ${seller.name} já vai separar sua entrega.`, "success");
    addAudit(`Pedido ${order.id} criado para ${client.name}`);
    ui.cart = [];
    ui.activeView = user.role === "vendedor" ? "sellerOrders" : "orders";
    commit(`Pedido ${order.id} criado e enviado ao vendedor.`);
  },
  sellerReady(orderId) {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order) return;
    order.status = "pronto";
    order.sellerReadyAt = new Date().toISOString();
    const seller = getUser(order.sellerId);
    addAudit(`Pedido ${order.id} pronto para retirada`);
    notifyClient(order, `Pedido ${order.id} foi separado por ${seller?.name || "vendedor"} e aguarda motoboy.`, "success");
    commit("Pedido marcado como pronto para retirada.");
  },
  cancelOrder(orderId) {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order || !confirm(`Cancelar ${order.id}?`)) return;
    if (order.status !== "cancelado") {
      order.items.forEach((item) => {
        const product = getProduct(item.productId);
        adjustSellerStock(product, order.sellerId, Number(item.qty));
      });
    }
    order.status = "cancelado";
    order.items.forEach((item) => {
      const product = getProduct(item.productId);
      if (product && productStockStatus(product, order.sellerId).level === "ok") {
        product.stockAlerts = product.stockAlerts || {};
        product.stockAlerts[order.sellerId] = "ok";
      }
    });
    addAudit(`Pedido ${order.id} cancelado`);
    notifyClient(order, `Pedido ${order.id} foi cancelado.`, "warning");
    commit("Pedido cancelado e estoque devolvido.");
  },
  assignSelectedDeliveries() {
    const driverId = document.querySelector("#assign-driver")?.value;
    const ids = [...document.querySelectorAll("[data-order-check]:checked")].map((input) => input.value);
    const driver = getDriver(driverId);
    if (!driver || !ids.length) {
      showToast("Selecione motorista e pelo menos um pedido.");
      return;
    }
    const routeCode = makeCode("ROTA");
    ids.forEach((id) => {
      const order = state.orders.find((item) => item.id === id);
      if (!order) return;
      order.driverId = driver.id;
      order.routeCode = routeCode;
      order.status = "atribuido";
      order.assignedAt = new Date().toISOString();
      notifyClient(order, `Pedido ${order.id} foi atribuído ao motoboy ${driver.name}. Aguarde o aviso de saída para entrega.`, "warning");
    });
    addAudit(`Rota ${routeCode} criada para ${driver.name} com ${ids.length} pedido(s)`);
    commit(`Rota ${routeCode} criada para ${driver.name}.`);
  },
  collectOrder(orderId, inputId) {
    const order = state.orders.find((item) => item.id === orderId);
    const input = document.getElementById(inputId || `pickup-code-${orderId}`);
    const code = input?.value.trim().toUpperCase();
    if (!order || code !== order.codes.driver.toUpperCase()) {
      showToast("Código MOT inválido.");
      return;
    }
    order.status = "coletado";
    order.pickedAt = new Date().toISOString();
    order.deliveryControlStartedAt = order.pickedAt;
    const driver = getDriver(order.driverId);
    const seller = getUser(order.sellerId);
    const eta = etaMinutesFromKm(haversine(pointFor(seller), orderDestination(order))) + 3;
    notifyClient(
      order,
      `Pedido ${order.id}: ${driver?.name || "Motoboy"} confirmou a retirada com ${seller?.name || "vendedor"}. Previsão aproximada até seu destino: ${eta} min.`,
      "warning"
    );
    addAudit(`Pedido ${order.id} coletado pelo motoboy`);
    commit("Retirada confirmada. Cliente avisado e cronômetro iniciado.");
  },
  startDelivery(orderId) {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order) return;
    order.status = "a_caminho";
    order.outForDeliveryAt = new Date().toISOString();
    notifyClient(order, `Pedido ${order.id}: ${state.settings.notificationText}`, "warning");
    addAudit(`Pedido ${order.id} saiu para entrega`);
    commit("Cliente avisado: pedido a caminho.");
  },
  finishDelivery(orderId) {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order) return;
    order.status = "entregue";
    order.deliveredAt = new Date().toISOString();
    order.paymentCollectedAt = order.deliveredAt;
    const elapsed = deliveryTimer(order);
    notifyClient(order, `Pedido ${order.id} entregue e pagamento conferido. Tempo da entrega: ${elapsed}.`, "success");
    const nextOrder = nextOrderForDriver(order);
    if (nextOrder) {
      const nextClient = getClient(nextOrder.clientId);
      const eta = estimateNextClientEta(order, nextOrder);
      notifyClient(
        nextOrder,
        `BRITO finalizou a entrega anterior. Previsão aproximada para chegar até ${nextClient?.name || "você"}: ${eta} min. Fique atento ao pagamento.`,
        "warning"
      );
    }
    addAudit(`Pedido ${order.id} entregue em ${elapsed}`);
    commit(nextOrder ? "Entrega finalizada. Próximo cliente avisado." : "Entrega finalizada.");
  },
  saveProduct(event) {
    event.preventDefault();
    const id = document.querySelector("#product-id").value;
    const previous = id ? getProduct(id) : null;
    const previousStocks = Object.values(SELLER_IDS).reduce((acc, sellerId) => {
      acc[sellerId] = sellerStock(previous, sellerId);
      return acc;
    }, {});
    const payload = {
      code: document.querySelector("#product-code").value.trim(),
      name: document.querySelector("#product-name").value.trim(),
      category: document.querySelector("#product-category").value.trim(),
      unit: "g",
      buyPrice: Math.max(0, integerValue(document.querySelector("#product-buy").value)),
      sellPrice: Math.max(1, integerValue(document.querySelector("#product-sell").value)),
      stockBySeller: {
        [SELLER_IDS.almeida]: Math.max(0, integerValue(document.querySelector("#product-stock-almeida").value)),
        [SELLER_IDS.nuncio]: Math.max(0, integerValue(document.querySelector("#product-stock-nuncio").value))
      },
      minStock: Math.max(0, integerValue(document.querySelector("#product-min").value)),
      active: true
    };
    payload.stock = Object.values(SELLER_IDS).reduce((sum, sellerId) => sum + Number(payload.stockBySeller[sellerId] || 0), 0);
    if (!payload.name) return showToast("Nome do produto obrigatório.");
    let product;
    if (id) {
      product = previous;
      Object.assign(product, payload);
      addAudit(`Produto ${payload.name} editado`);
    } else {
      product = { id: uid("PROD"), ...payload };
      state.products.push(product);
      addAudit(`Produto ${payload.name} criado`);
    }
    Object.values(SELLER_IDS).forEach((sellerId) => {
      const added = Number(payload.stockBySeller[sellerId] || 0) - Number(previousStocks[sellerId] || 0);
      if (added > 0) recordStockPurchase(product, sellerId, added, payload.buyPrice);
    });
    Object.values(SELLER_IDS).forEach((sellerId) => notifyStockIfNeeded(product, sellerId));
    ui.editingProductId = null;
    commit("Produto salvo.");
  },
  editProduct(id) {
    ui.editingProductId = id;
    render();
  },
  deleteProduct(id) {
    const product = getProduct(id);
    if (!product || !confirm(`Excluir ${product.name}?`)) return;
    state.products = state.products.filter((item) => item.id !== id);
    addAudit(`Produto ${product.name} excluido`);
    commit("Produto excluido.");
  },
  saveClient(event) {
    event.preventDefault();
    const id = document.querySelector("#client-id").value;
    const previous = id ? getClient(id) : null;
    const payload = withAddressPoint({
      name: document.querySelector("#client-name").value.trim(),
      phone: document.querySelector("#client-phone").value.trim(),
      document: document.querySelector("#client-document").value.trim(),
      address: document.querySelector("#client-address").value.trim(),
      neighborhood: document.querySelector("#client-neighborhood").value,
      paymentPreference: document.querySelector("#client-payment").value,
      creditLimit: toNumber(document.querySelector("#client-limit").value),
      balance: toNumber(document.querySelector("#client-balance").value),
      active: true
    }, previous);
    if (!payload.name) return showToast("Nome do cliente obrigatório.");
    if (id) {
      Object.assign(getClient(id), payload);
      addAudit(`Cliente ${payload.name} editado`);
    } else {
      state.clients.push({ id: uid("CLI"), ...payload });
      addAudit(`Cliente ${payload.name} criado`);
    }
    ui.editingClientId = null;
    commit("Cliente salvo.");
  },
  editClient(id) {
    ui.editingClientId = id;
    render();
  },
  deleteClient(id) {
    const client = getClient(id);
    if (!client || !confirm(`Excluir ${client.name}?`)) return;
    state.clients = state.clients.filter((item) => item.id !== id);
    addAudit(`Cliente ${client.name} excluido`);
    commit("Cliente excluido.");
  },
  saveUser(event) {
    event.preventDefault();
    const id = document.querySelector("#user-id").value;
    const previous = id ? getUser(id) : null;
    const payload = withAddressPoint({
      name: document.querySelector("#user-name").value.trim(),
      username: document.querySelector("#user-username").value.trim(),
      password: document.querySelector("#user-password").value.trim(),
      role: document.querySelector("#user-role").value,
      phone: document.querySelector("#user-phone").value.trim(),
      address: document.querySelector("#user-address").value.trim(),
      active: true
    }, previous);
    if (!payload.name || !payload.username || !payload.password) return showToast("Nome, usuário e senha são obrigatórios.");
    const duplicate = state.users.find((user) => user.username === payload.username && user.id !== id);
    if (duplicate) return showToast("Esse usuário já existe.");
    if (id) {
      Object.assign(getUser(id), payload);
      addAudit(`Usuário ${payload.username} editado`);
    } else {
      state.users.push({ id: uid("USR"), ...payload });
      addAudit(`Usuário ${payload.username} criado`);
    }
    ui.editingUserId = null;
    commit("Usuário salvo.");
  },
  editUser(id) {
    ui.editingUserId = id;
    render();
  },
  toggleUser(id) {
    const user = getUser(id);
    if (!user) return;
    if (user.id === currentUser().id) return showToast("Não bloqueie o usuário logado.");
    user.active = !user.active;
    addAudit(`Usuário ${user.username} ${user.active ? "ativado" : "bloqueado"}`);
    commit("Status do usuário atualizado.");
  },
  saveDriver(event) {
    event.preventDefault();
    const id = document.querySelector("#driver-id").value;
    const previous = id ? getDriver(id) : null;
    const payload = withAddressPoint({
      name: document.querySelector("#driver-name").value.trim(),
      phone: document.querySelector("#driver-phone").value.trim(),
      userId: document.querySelector("#driver-user").value,
      address: document.querySelector("#driver-address").value.trim(),
      vehicle: document.querySelector("#driver-vehicle").value.trim(),
      plate: document.querySelector("#driver-plate").value.trim(),
      active: true
    }, previous);
    if (!payload.name) return showToast("Nome do motorista obrigatório.");
    if (id) {
      Object.assign(getDriver(id), payload);
      addAudit(`Motorista ${payload.name} editado`);
    } else {
      state.drivers.push({ id: uid("DRV"), ...payload });
      addAudit(`Motorista ${payload.name} criado`);
    }
    ui.editingDriverId = null;
    commit("Motorista salvo.");
  },
  editDriver(id) {
    ui.editingDriverId = id;
    render();
  },
  toggleDriver(id) {
    const driver = getDriver(id);
    if (!driver) return;
    driver.active = !driver.active;
    addAudit(`Motorista ${driver.name} ${driver.active ? "ativado" : "inativado"}`);
    commit("Status do motorista atualizado.");
  },
  saveFinanceSettings(event) {
    event.preventDefault();
    state.settings.bankOpeningBalance = integerValue(document.querySelector("#finance-bank").value);
    state.settings.sellerCommissionPct = Math.max(0, toNumber(document.querySelector("#finance-seller-pct").value));
    state.settings.driverDeliveryPct = Math.max(0, toNumber(document.querySelector("#finance-driver-pct").value));
    addAudit("Ajustes do caixa atualizados");
    commit("Caixa atualizado.");
  },
  addExpense(event) {
    event.preventDefault();
    const description = document.querySelector("#expense-description").value.trim();
    const category = document.querySelector("#expense-category").value;
    const value = Math.max(0, integerValue(document.querySelector("#expense-value").value));
    if (!description || value <= 0) return showToast("Informe descrição e valor do gasto.");
    state.expenses.unshift({
      id: uid("DES"),
      createdAt: new Date().toISOString(),
      description,
      category,
      value,
      userId: currentUser()?.id || "sistema"
    });
    addAudit(`Gasto registrado: ${description}`);
    commit("Gasto registrado no caixa.");
  },
  deleteExpense(id) {
    const expense = state.expenses.find((item) => item.id === id);
    if (!expense || !confirm(`Excluir gasto ${expense.description}?`)) return;
    state.expenses = state.expenses.filter((item) => item.id !== id);
    addAudit(`Gasto excluido: ${expense.description}`);
    commit("Gasto excluido.");
  },
  createTask(event) {
    event.preventDefault();
    const title = document.querySelector("#task-title").value.trim();
    const details = document.querySelector("#task-details").value.trim();
    const driverId = document.querySelector("#task-driver").value;
    const dueValue = document.querySelector("#task-due").value;
    if (!title || !driverId) return showToast("Título e motorista são obrigatórios.");
    state.tasks.unshift({
      id: uid("TAR"),
      title,
      details,
      driverId,
      dueAt: dueValue ? new Date(dueValue).toISOString() : minutesFromNow(180),
      status: "aberta",
      createdAt: new Date().toISOString(),
      completedAt: null
    });
    playNotificationSound();
    addAudit(`Tarefa ${title} criada`);
    commit("Tarefa criada.");
  },
  setTaskStatus(id, status) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    task.status = status;
    task.completedAt = status === "concluida" ? new Date().toISOString() : null;
    addAudit(`Tarefa ${task.title} marcada como ${status}`);
    commit("Tarefa atualizada.");
  },
  saveSettings(event) {
    event.preventDefault();
    state.settings.businessName = document.querySelector("#settings-name").value.trim();
    state.settings.businessPhone = document.querySelector("#settings-phone").value.trim();
    state.settings.pixKey = document.querySelector("#settings-pix").value.trim();
    state.settings.businessAddress = document.querySelector("#settings-address").value.trim();
    state.settings.defaultDeliveryFee = toNumber(document.querySelector("#settings-delivery").value);
    state.settings.cardMachineFeePct = toNumber(document.querySelector("#settings-card").value);
    Object.assign(state.settings, addressPoint(state.settings.businessAddress));
    state.settings.notificationText = document.querySelector("#settings-notification").value.trim();
    addAudit("Ajustes atualizados");
    commit("Ajustes salvos.");
  },
  markNotificationSent(id) {
    const notification = state.notifications.find((item) => item.id === id);
    if (!notification) return;
    notification.status = "enviada";
    addAudit(`Notificação ${id} marcada como enviada`);
    commit("Aviso marcado como enviado.");
  },
  exportBackup() {
    document.querySelector("#backup-data").value = JSON.stringify(state, null, 2);
    showToast("Backup gerado no campo de texto.");
  },
  importBackup() {
    const raw = document.querySelector("#backup-data").value;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.users || !parsed.orders || !parsed.products) throw new Error("Backup inválido");
      normalizeOperationalState(parsed);
      state = parsed;
      saveState();
      ui.activeView = state.session?.activeView || "dashboard";
      render();
      showToast("Backup restaurado.");
    } catch {
      showToast("Backup inválido.");
    }
  },
  resetDemo() {
    if (!confirm("Resetar dados da demo?")) return;
    state = seedWithActivity();
    ui = {
      cart: [],
      editingProductId: null,
      editingClientId: null,
      editingUserId: null,
      editingDriverId: null,
      newOrderNeighborhood: null,
      activeView: null
    };
    render();
    showToast("Demo resetada.");
  },
  exportCsv() {
    const lines = [
      ["Pedido", "Data", "Cliente", "Vendedor", "Motorista", "Status", "Pagamento", "Total"].join(";"),
      ...state.orders.map((order) =>
        [
          order.id,
          fmtDate(order.createdAt),
          getClient(order.clientId)?.name || "",
          getUser(order.sellerId)?.name || "",
          getDriver(order.driverId)?.name || "",
          STATUS[order.status]?.label || order.status,
          order.payment,
          money(orderTotal(order))
        ].join(";")
      )
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

render();
