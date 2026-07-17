import type { Category, OrderStatus, Product } from "./types";

export const categories: Category[] = [
  {
    name: "Futebol",
    slug: "futebol",
    description: "Chuteiras, bolas, camisas e performance de campo.",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Corrida",
    slug: "corrida",
    description: "Tênis, vestuário e acessórios para bater metas.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Academia",
    slug: "academia",
    description: "Treino pesado, equipamentos e recuperação.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Ciclismo",
    slug: "ciclismo",
    description: "Equipamentos para estrada, trilha e mobilidade.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lutas",
    slug: "lutas",
    description: "Proteção, luvas, kimonos e treino de combate.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Moda fitness",
    slug: "moda-fitness",
    description: "Peças premium para treino, rua e rotina.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    description: "Garrafa, mochila, grip, munhequeira e mais.",
    image: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Equipamentos",
    slug: "equipamentos",
    description: "Itens para elevar o padrão do treino.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Suplementos",
    slug: "suplementos",
    description: "Linha em preparação para alta performance.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=80",
  },
];

export const products: Product[] = [
  {
    id: "prod_chuteira_titan_flex",
    name: "Chuteira Titan Flex Elite FG",
    slug: "chuteira-titan-flex-elite-fg",
    description: "Chuteira leve com tração agressiva para gramado natural.",
    fullDescription:
      "A Titan Flex Elite FG foi criada para aceleração, estabilidade e toque preciso. O cabedal técnico se ajusta ao pé, enquanto a placa de travas entrega resposta forte em arrancadas e mudanças de direção.",
    price: 599.9,
    salePrice: 489.9,
    images: [
      "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 18,
    sku: "TIT-FUT-FLEX-FG",
    category: "Futebol",
    categorySlug: "futebol",
    brand: "Nike",
    size: ["38", "39", "40", "41", "42", "43"],
    color: ["Preto", "Prata"],
    variations: ["Campo", "Society"],
    rating: 4.8,
    reviews: 126,
    featured: true,
    bestSeller: true,
    promotion: true,
    specs: {
      Cabedal: "Mesh tecnico com reforco sintetico",
      Solado: "FG para gramado natural",
      Peso: "228 g",
      Garantia: "90 dias",
    },
    related: ["bola-titanor-pro-match", "mochila-forge-daypack"],
    modality: "Futebol",
  },
  {
    id: "prod_tenis_ignition",
    name: "Tênis Ignition Run Carbon",
    slug: "tenis-ignition-run-carbon",
    description: "Tênis de corrida com placa responsiva e espuma de alto retorno.",
    fullDescription:
      "O Ignition Run Carbon foi desenhado para treinos de ritmo e provas. A geometria rocker, a espuma leve e a placa estabilizadora entregam passadas mais fluidas sem sacrificar conforto.",
    price: 799.9,
    salePrice: 699.9,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 24,
    sku: "TIT-RUN-IGN-CBN",
    category: "Corrida",
    categorySlug: "corrida",
    brand: "Asics",
    size: ["37", "38", "39", "40", "41", "42", "43", "44"],
    color: ["Branco", "Preto", "Prata"],
    variations: ["5 km", "10 km", "Meia maratona"],
    rating: 4.9,
    reviews: 214,
    featured: true,
    bestSeller: true,
    promotion: true,
    specs: {
      Drop: "8 mm",
      Espuma: "TNR Foam Pro",
      Placa: "Carbono composto",
      Peso: "246 g",
    },
    related: ["meia-compressao-pulse", "corta-vento-aero-shield"],
    modality: "Corrida",
  },
  {
    id: "prod_corta_vento",
    name: "Corta-vento Aero Shield",
    slug: "corta-vento-aero-shield",
    description: "Jaqueta ultraleve com repelência à água e ventilação estratégica.",
    fullDescription:
      "Camada externa para treinos sob vento e garoa leve. O tecido ripstop premium reduz atrito, seca rápido e guarda no próprio bolso para transporte compacto.",
    price: 429.9,
    images: [
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506629905607-d52b1bff34f5?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 31,
    sku: "TIT-RUN-AERO-SH",
    category: "Corrida",
    categorySlug: "corrida",
    brand: "Adidas",
    size: ["P", "M", "G", "GG"],
    color: ["Preto", "Cinza", "Prata"],
    variations: ["Masculino", "Feminino"],
    rating: 4.7,
    reviews: 88,
    featured: true,
    specs: {
      Tecido: "Ripstop leve",
      Protecao: "Repelencia a agua",
      Bolsos: "2 laterais + bolso packable",
      Uso: "Corrida e treino outdoor",
    },
    related: ["tenis-ignition-run-carbon", "meia-compressao-pulse"],
    modality: "Corrida",
  },
  {
    id: "prod_luva_strike",
    name: "Luva Strike Pro Boxing",
    slug: "luva-strike-pro-boxing",
    description: "Luva de boxe com espuma multicamada e pulso firme.",
    fullDescription:
      "A Strike Pro distribui impacto com conforto e firmeza. O fechamento largo estabiliza o punho para rounds intensos em saco, manopla e sparring controlado.",
    price: 389.9,
    salePrice: 329.9,
    images: [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 12,
    sku: "TIT-LUT-STRIKE",
    category: "Lutas",
    categorySlug: "lutas",
    brand: "Everlast",
    size: ["10 oz", "12 oz", "14 oz", "16 oz"],
    color: ["Preto", "Prata", "Vermelho"],
    variations: ["Treino", "Sparring"],
    rating: 4.8,
    reviews: 73,
    promotion: true,
    specs: {
      Material: "PU premium",
      Enchimento: "Espuma multicamada",
      Fechamento: "Velcro de alta aderencia",
      Indicacao: "Boxe e muay thai",
    },
    related: ["bandagem-armor-wrap", "short-combat-training"],
    modality: "Lutas",
  },
  {
    id: "prod_mochila_forge",
    name: "Mochila Forge Daypack 32L",
    slug: "mochila-forge-daypack",
    description: "Mochila premium para treino, trabalho e viagens curtas.",
    fullDescription:
      "Compartimentos inteligentes, bolso ventilado para roupas de treino e estrutura reforçada para carregar acessórios, notebook e equipamentos com elegância atlética.",
    price: 349.9,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 44,
    sku: "TIT-ACC-FORGE-32",
    category: "Acessórios",
    categorySlug: "acessorios",
    brand: "Nike",
    size: ["32L"],
    color: ["Preto", "Cinza"],
    variations: ["Urbana", "Treino"],
    rating: 4.6,
    reviews: 54,
    bestSeller: true,
    specs: {
      Capacidade: "32 litros",
      Notebook: "Ate 16 polegadas",
      Material: "Poliester balistico",
      Bolsos: "8 compartimentos",
    },
    related: ["garrafa-hydra-steel", "corta-vento-aero-shield"],
    modality: "Acessórios",
  },
  {
    id: "prod_bike_helmet",
    name: "Capacete Velocity MIPS",
    slug: "capacete-velocity-mips",
    description: "Capacete aerodinâmico com sistema de proteção rotacional.",
    fullDescription:
      "Projetado para pedais longos, o Velocity MIPS combina ventilação generosa, ajuste fino e proteção de impacto para ciclistas que treinam forte.",
    price: 649.9,
    salePrice: 579.9,
    images: [
      "https://images.unsplash.com/photo-1575585269294-7d28dd912db8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 9,
    sku: "TIT-CIC-VEL-MIPS",
    category: "Ciclismo",
    categorySlug: "ciclismo",
    brand: "Garmin",
    size: ["P", "M", "G"],
    color: ["Preto", "Branco", "Prata"],
    variations: ["Road", "Gravel"],
    rating: 4.9,
    reviews: 61,
    featured: true,
    promotion: true,
    specs: {
      Protecao: "Sistema rotacional MIPS",
      Ventilacao: "18 entradas de ar",
      Ajuste: "Dial milimetrico",
      Peso: "285 g",
    },
    related: ["oculos-apex-vision", "garrafa-hydra-steel"],
    modality: "Ciclismo",
  },
  {
    id: "prod_legging_axis",
    name: "Legging Axis Sculpt",
    slug: "legging-axis-sculpt",
    description: "Legging compressiva de cintura alta para treino intenso.",
    fullDescription:
      "Tecido firme, toque macio e costuras pensadas para liberdade de movimento. A Axis Sculpt sustenta sem limitar, do treino funcional ao dia a dia.",
    price: 259.9,
    salePrice: 219.9,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 37,
    sku: "TIT-FIT-AXIS",
    category: "Moda fitness",
    categorySlug: "moda-fitness",
    brand: "Under Armour",
    size: ["PP", "P", "M", "G", "GG"],
    color: ["Preto", "Grafite", "Bordô"],
    variations: ["Cintura alta", "Seamless"],
    rating: 4.7,
    reviews: 97,
    bestSeller: true,
    promotion: true,
    specs: {
      Composicao: "78% poliamida, 22% elastano",
      Compressao: "Media-alta",
      Protecao: "UV50+",
      Indicado: "Musculacao e funcional",
    },
    related: ["top-impact-core", "garrafa-hydra-steel"],
    modality: "Moda fitness",
  },
  {
    id: "prod_top_impact",
    name: "Top Impact Core",
    slug: "top-impact-core",
    description: "Top de alta sustentação com bojo removível.",
    fullDescription:
      "Base firme, alças estáveis e tecido respirável para treinos de alta intensidade. O Top Impact Core foi feito para movimento com segurança.",
    price: 189.9,
    images: [
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 28,
    sku: "TIT-FIT-IMPACT",
    category: "Moda fitness",
    categorySlug: "moda-fitness",
    brand: "Puma",
    size: ["PP", "P", "M", "G", "GG"],
    color: ["Preto", "Branco", "Prata"],
    variations: ["Alta sustentacao"],
    rating: 4.6,
    reviews: 41,
    specs: {
      Sustentacao: "Alta",
      Bojo: "Removivel",
      Tecido: "Dry touch",
      Uso: "Funcional, corrida e academia",
    },
    related: ["legging-axis-sculpt", "meia-compressao-pulse"],
    modality: "Moda fitness",
  },
  {
    id: "prod_bola_pro",
    name: "Bola Titanor Pro Match",
    slug: "bola-titanor-pro-match",
    description: "Bola laminada premium com toque macio e trajetória estável.",
    fullDescription:
      "Construção laminada de alto padrão, câmara de retenção superior e textura que favorece controle em passes longos, finalizações e treino técnico.",
    price: 249.9,
    salePrice: 199.9,
    images: [
      "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 65,
    sku: "TIT-FUT-PROMATCH",
    category: "Futebol",
    categorySlug: "futebol",
    brand: "Penalty",
    size: ["5"],
    color: ["Branco", "Preto", "Prata"],
    variations: ["Campo", "Treino"],
    rating: 4.8,
    reviews: 143,
    bestSeller: true,
    promotion: true,
    specs: {
      Tamanho: "5 oficial",
      Camada: "PU texturizado",
      Costura: "Termocolada",
      Uso: "Jogo e treino",
    },
    related: ["chuteira-titan-flex-elite-fg", "mochila-forge-daypack"],
    modality: "Futebol",
  },
  {
    id: "prod_halter_prime",
    name: "Kit Halteres Prime 20kg",
    slug: "kit-halteres-prime-20kg",
    description: "Kit ajustável em aço revestido para treino de força em casa.",
    fullDescription:
      "Placas compactas, pegada confortável e presilhas firmes. Ideal para montar uma base de treino completa em casa sem abrir mão de acabamento premium.",
    price: 499.9,
    images: [
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 7,
    sku: "TIT-EQP-HALT-20",
    category: "Equipamentos",
    categorySlug: "equipamentos",
    brand: "TITANOR",
    size: ["20kg"],
    color: ["Preto"],
    variations: ["Ajustavel"],
    rating: 4.5,
    reviews: 36,
    featured: true,
    specs: {
      Peso: "20 kg total",
      Material: "Aco com revestimento",
      Pegada: "Antiderrapante",
      Conteudo: "Barras, placas e presilhas",
    },
    related: ["luva-training-grip", "garrafa-hydra-steel"],
    modality: "Academia",
  },
  {
    id: "prod_garrafa_hydra",
    name: "Garrafa Hydra Steel 950ml",
    slug: "garrafa-hydra-steel",
    description: "Garrafa térmica em aço inox com tampa esportiva.",
    fullDescription:
      "Mantém a bebida fria por horas, resiste ao uso diário e cabe em suportes de bike e mochilas de treino. Tampa com fluxo rápido e vedação firme.",
    price: 149.9,
    salePrice: 119.9,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 83,
    sku: "TIT-ACC-HYDRA-950",
    category: "Acessórios",
    categorySlug: "acessorios",
    brand: "TITANOR",
    size: ["950ml"],
    color: ["Preto", "Aço", "Prata"],
    variations: ["Termica"],
    rating: 4.7,
    reviews: 189,
    promotion: true,
    specs: {
      Capacidade: "950 ml",
      Material: "Aco inox",
      Conservacao: "Ate 12h fria",
      Tampa: "Sport flow",
    },
    related: ["mochila-forge-daypack", "capacete-velocity-mips"],
    modality: "Acessórios",
  },
  {
    id: "prod_meia_pulse",
    name: "Meia Compressão Pulse",
    slug: "meia-compressao-pulse",
    description: "Meia técnica com compressão progressiva e zonas respiráveis.",
    fullDescription:
      "A Pulse ajuda na estabilidade durante treinos e provas. O cano médio protege contra atrito, enquanto a malha ventilada melhora a sensação térmica.",
    price: 79.9,
    images: [
      "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 120,
    sku: "TIT-RUN-PULSE",
    category: "Corrida",
    categorySlug: "corrida",
    brand: "Mizuno",
    size: ["P", "M", "G"],
    color: ["Preto", "Branco", "Cinza"],
    variations: ["Cano medio"],
    rating: 4.5,
    reviews: 72,
    specs: {
      Compressao: "Progressiva",
      Cano: "Medio",
      Tecido: "Poliamida respiravel",
      Uso: "Corrida, bike e treino",
    },
    related: ["tenis-ignition-run-carbon", "corta-vento-aero-shield"],
    modality: "Corrida",
  },
];

export const banners = [
  {
    title: "Todos os esportes. Uma so forca.",
    subtitle: "Equipamentos premium para atletas, praticantes e apaixonados por movimento.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Frete para todo o Brasil",
    subtitle: "Entrega nacional, troca facil e suporte humano.",
    image: "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?auto=format&fit=crop&w=1600&q=80",
  },
];

export const coupons = [
  {
    code: "FORJA10",
    discountPercent: 10,
    active: true,
    minOrderValue: 199,
  },
  {
    code: "TITANOR15",
    discountPercent: 15,
    active: true,
    minOrderValue: 499,
  },
];

export const testimonials = [
  {
    name: "Marina Costa",
    role: "Corredora amadora",
    text: "A curadoria da TITANOR passa confiança. Comprei tênis, corta-vento e acessórios sem aquele medo de produto genérico.",
  },
  {
    name: "Rafael Mendes",
    role: "Personal trainer",
    text: "O visual é premium, mas o que me ganhou foi a performance. Os produtos parecem feitos para treino de verdade.",
  },
  {
    name: "Bianca Torres",
    role: "Atleta de funcional",
    text: "Entrega rápida, embalagem impecável e atendimento direto. Virou minha primeira busca para equipamento esportivo.",
  },
];

export const benefits = [
  "Frete gratis acima de R$ 399",
  "Pix, cartao e boleto",
  "Troca facilitada em ate 30 dias",
  "Produtos selecionados por modalidade",
  "Compra segura com dados protegidos",
  "Entrega para todo o Brasil",
];

export const orderStatuses: OrderStatus[] = [
  "aguardando pagamento",
  "pago",
  "em separacao",
  "enviado",
  "entregue",
  "cancelado",
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}

export function getRelatedProducts(product: Product) {
  return product.related
    .map((slug) => getProductBySlug(slug))
    .filter((item): item is Product => Boolean(item));
}

export function searchProducts(query?: string, filters?: Record<string, string | string[] | undefined>) {
  const normalizedQuery = query?.trim().toLowerCase();

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.modality,
      product.category,
      product.description,
      product.color.join(" "),
      product.size.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    const category = filters?.categoria;
    const promo = filters?.promocao;
    const maxPrice = filters?.preco;

    const matchesCategory =
      !category || product.categorySlug === (Array.isArray(category) ? category[0] : category);
    const matchesPromo = !promo || product.promotion;
    const matchesPrice =
      !maxPrice || (product.salePrice || product.price) <= Number(Array.isArray(maxPrice) ? maxPrice[0] : maxPrice);

    return matchesQuery && matchesCategory && matchesPromo && matchesPrice;
  });
}

export const adminMetrics = {
  totalSales: 184320.45,
  recentOrders: 38,
  revenueMonth: 54280.9,
  lowStock: products.filter((product) => product.stock <= 12).length,
  customers: 1284,
  coupons: coupons.length,
};

export const recentOrders = [
  {
    id: "TNR-10291",
    customer: "Marina Costa",
    total: 819.8,
    status: "pago" as OrderStatus,
    date: "16/05/2026",
  },
  {
    id: "TNR-10290",
    customer: "Rafael Mendes",
    total: 449.8,
    status: "em separacao" as OrderStatus,
    date: "16/05/2026",
  },
  {
    id: "TNR-10289",
    customer: "Bianca Torres",
    total: 1129.7,
    status: "enviado" as OrderStatus,
    date: "15/05/2026",
  },
  {
    id: "TNR-10288",
    customer: "Lucas Nogueira",
    total: 199.9,
    status: "aguardando pagamento" as OrderStatus,
    date: "15/05/2026",
  },
];
