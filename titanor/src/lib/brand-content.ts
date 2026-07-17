export type TitanorCategoryGroup = {
  title: string;
  slug: string;
  description: string;
  image: string;
  sports: string[];
};

export type PartnerBrand = {
  name: string;
  slug: string;
  segment: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
};

export const titanorCategoryGroups: TitanorCategoryGroup[] = [
  {
    title: "Esportes de equipe",
    slug: "esportes-de-equipe",
    description: "Futebol, basquete, volei, rugby, handebol e modalidades coletivas para jogar em alto nivel.",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=85",
    sports: [
      "Futebol",
      "Futsal",
      "Society",
      "Futebol de areia",
      "Basquete",
      "Basquete 3x3",
      "Volei",
      "Volei de praia",
      "Rugby",
      "Futebol americano",
      "Flag football",
      "Handebol",
      "Hoquei",
      "Polo aquatico",
      "Lacrosse",
      "Ultimate frisbee",
    ],
  },
  {
    title: "Rede e parede",
    slug: "rede-e-parede",
    description: "Raquetes, bolas e acessorios para tenis, beach tennis, padel, badminton e squash.",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=85",
    sports: ["Tenis", "Tenis de mesa", "Beach tennis", "Badminton", "Squash", "Padel", "Futevolei", "Pickleball", "Pelota basca", "Sepaktakraw"],
  },
  {
    title: "Combate e lutas",
    slug: "combate-e-lutas",
    description: "Luvas, protecoes, kimonos e equipamentos para treino tecnico, sparring e competicao.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=85",
    sports: ["Boxe", "Judo", "Karate", "Taekwondo", "Jiu-jitsu", "Muay Thai", "MMA", "Wrestling", "Esgrima", "Capoeira", "Kung Fu", "Sumo", "Kickboxing", "Krav Maga", "Sambo"],
  },
  {
    title: "Esportes aquaticos",
    slug: "aquaticos",
    description: "Natacao, surf, SUP, canoagem, vela e produtos para agua, velocidade e resistencia.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=85",
    sports: ["Natacao", "Maratonas aquaticas", "Nado artistico", "Saltos ornamentais", "Surf", "Bodyboard", "Skimboard", "Stand Up Paddle", "Canoagem", "Remo", "Vela", "Windsurf", "Kitesurf", "Mergulho", "Esqui aquatico", "Wakeboard"],
  },
  {
    title: "Atletismo e forca",
    slug: "atletismo-e-forca",
    description: "Corrida, academia, levantamento, cross training e tudo para evoluir potencia e resistencia.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85",
    sports: ["Corrida", "Maratona", "Revezamento", "Barreiras", "Saltos", "Arremessos", "Marcha atletica", "Levantamento olimpico", "Powerlifting", "CrossFit", "Ginastica artistica", "Ginastica ritmica", "Ginastica de trampolim", "Ginastica acrobatica"],
  },
  {
    title: "Radicais e aventura",
    slug: "radicais-e-aventura",
    description: "Trilha, montanha, bike, skate, escalada e equipamentos para movimento fora da zona comum.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85",
    sports: ["Hiking", "Trekking", "Montanhismo", "Alpinismo", "Escalada", "Bouldering", "Skate", "Parkour", "Ciclismo", "MTB", "BMX", "Paraquedismo", "Base jump", "Parapente", "Asa delta", "Bungee jumping", "Rafting", "Slackline", "Highline"],
  },
  {
    title: "Esportes de precisao",
    slug: "precisao-e-mentais",
    description: "Foco, controle e estrategia para tiro, boliche, sinuca, xadrez e jogos mentais.",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=85",
    sports: ["Tiro com arco", "Tiro esportivo", "Boliche", "Sinuca", "Bilhar", "Snooker", "Dardos", "Bocha", "Boccia", "Xadrez", "Damas", "Poker", "Go"],
  },
  {
    title: "Esportes de inverno",
    slug: "esportes-de-inverno",
    description: "Camadas, acessorios e equipamentos para frio, gelo, neve e modalidades de inverno.",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=85",
    sports: ["Esqui", "Snowboard", "Patinacao no gelo", "Bobsleigh", "Skeleton", "Luge", "Curling", "Biatlo"],
  },
  {
    title: "Automobilismo e motos",
    slug: "motorizados",
    description: "Performance, protecao e cultura de velocidade para pista, rally, kart e motos.",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85",
    sports: ["Formula 1", "Formula E", "IndyCar", "NASCAR", "Rally", "Motovelocidade", "MotoGP", "Motocross", "Supercross", "Enduro", "Kart"],
  },
  {
    title: "E-sports e mentais",
    slug: "esports",
    description: "Setup, foco e ergonomia para competidores digitais, estrategistas e alta concentracao.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85",
    sports: ["E-sports", "LoL", "CS2", "Valorant", "Dota 2", "Xadrez", "Poker", "Go"],
  },
];

export const partnerBrands: PartnerBrand[] = [
  { name: "Nike", slug: "nike", segment: "Futebol e treino" },
  { name: "Adidas", slug: "adidas", segment: "Performance global" },
  { name: "Puma", slug: "puma", segment: "Campo e lifestyle" },
  { name: "Mizuno", slug: "mizuno", segment: "Corrida" },
  { name: "Under Armour", slug: "under-armour", segment: "Treino e basquete" },
  { name: "Asics", slug: "asics", segment: "Corrida" },
  { name: "Wilson", slug: "wilson", segment: "Raquetes e bolas" },
  { name: "Speedo", slug: "speedo", segment: "Aquaticos" },
  { name: "Everlast", slug: "everlast", segment: "Lutas" },
  { name: "Garmin", slug: "garmin", segment: "Tecnologia esportiva" },
  { name: "Penalty", slug: "penalty", segment: "Futebol" },
  { name: "Titanor", slug: "titanor", segment: "Multiesportivo" },
];

export const blogPosts: BlogPost[] = [
  {
    title: "Como escolher a chuteira ideal",
    slug: "como-escolher-a-chuteira-ideal",
    category: "Guias de compra",
    excerpt: "Campo, society ou futsal: entenda solado, cabedal e ajuste antes de comprar.",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=85",
    readTime: "5 min",
  },
  {
    title: "Qual luva de boxe comprar para iniciantes",
    slug: "qual-luva-de-boxe-comprar-para-iniciantes",
    category: "Dicas de treino",
    excerpt: "Peso, fechamento, protecao de punho e indicacao de uso para treinar com seguranca.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=85",
    readTime: "6 min",
  },
  {
    title: "Tenis de corrida ou tenis casual",
    slug: "diferenca-entre-tenis-de-corrida-e-tenis-casual",
    category: "Comparativos",
    excerpt: "Amortecimento, estabilidade e durabilidade: veja onde cada modelo faz sentido.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
    readTime: "4 min",
  },
  {
    title: "O que levar para uma trilha",
    slug: "o-que-levar-para-uma-trilha",
    category: "Esportes para iniciantes",
    excerpt: "Checklist direto para sair com conforto, hidratacao e seguranca no outdoor.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85",
    readTime: "7 min",
  },
];

export function getCategoryGroupBySlug(slug: string) {
  return titanorCategoryGroups.find((group) => group.slug === slug);
}

export function getBrandBySlug(slug: string) {
  return partnerBrands.find((brand) => brand.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
