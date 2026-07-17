export type Language = "pt" | "en" | "es";

export type ProductCategory = "all" | "presence" | "operation" | "automation" | "mobile" | "integration";

export type ProductAccent = "blue" | "green" | "violet" | "cyan" | "gold";

type LocalizedProduct = {
  tag: string;
  name: string;
  summary: string;
  metric: string;
  bullets: string[];
};

export type Product = {
  id: string;
  category: Exclude<ProductCategory, "all">;
  accent: ProductAccent;
  content: Record<Language, LocalizedProduct>;
};

type Copy = {
  title: string;
  quote: string;
  menuOpen: string;
  navAbout: string;
  navSolutions: string;
  navProducts: string;
  navProcess: string;
  navProjects: string;
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  heroPrimary: string;
  heroSecondary: string;
  heroFeatureTitle: string;
  heroFeatureText: string;
  heroLanguageText: string;
  introKicker: string;
  introTitle: string;
  introText: string;
  solutionsKicker: string;
  solutionsTitle: string;
  solutionsLink: string;
  solutionOneTitle: string;
  solutionOneText: string;
  solutionTwoTitle: string;
  solutionTwoText: string;
  solutionThreeTitle: string;
  solutionThreeText: string;
  productsKicker: string;
  productsTitle: string;
  productMediaTitle: string;
  productMediaText: string;
  productCta: string;
  helpKicker: string;
  helpTitle: string;
  helpText: string;
  painOneTitle: string;
  painOneText: string;
  painTwoTitle: string;
  painTwoText: string;
  painThreeTitle: string;
  painThreeText: string;
  reachKicker: string;
  reachTitle: string;
  proofOne: string;
  proofTwo: string;
  proofThree: string;
  proofFour: string;
  processKicker: string;
  processTitle: string;
  processOneTitle: string;
  processOneText: string;
  processTwoTitle: string;
  processTwoText: string;
  processThreeTitle: string;
  processThreeText: string;
  processFourTitle: string;
  processFourText: string;
  processFiveTitle: string;
  processFiveText: string;
  projectsKicker: string;
  projectsTitle: string;
  projectsLink: string;
  projectOneTag: string;
  projectOneTitle: string;
  projectOneText: string;
  projectTwoTag: string;
  projectTwoTitle: string;
  projectTwoText: string;
  projectThreeTag: string;
  projectThreeTitle: string;
  projectThreeText: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
  ctaSecondary: string;
  footerText: string;
  footerLinks: string;
  footerContact: string;
  copyright: string;
  whatsappLabel: string;
};

export const languages: Array<{ code: Language; label: string }> = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export const categoryLabels: Record<Language, Record<ProductCategory, string>> = {
  pt: {
    all: "Todos",
    presence: "Presença digital",
    operation: "Operação",
    automation: "Automação",
    mobile: "Mobile",
    integration: "Integrações",
  },
  en: {
    all: "All",
    presence: "Digital presence",
    operation: "Operations",
    automation: "Automation",
    mobile: "Mobile",
    integration: "Integrations",
  },
  es: {
    all: "Todos",
    presence: "Presencia digital",
    operation: "Operación",
    automation: "Automatización",
    mobile: "Mobile",
    integration: "Integraciones",
  },
};

export const copy: Record<Language, Copy> = {
  pt: {
    title: "Avalace Tech | Sistemas inteligentes para empresas",
    quote: "Solicitar orçamento",
    menuOpen: "Abrir menu",
    navAbout: "Sobre Nós",
    navSolutions: "Soluções",
    navProducts: "Produtos",
    navProcess: "Processo",
    navProjects: "Projetos",
    heroKicker: "Avalace Tech",
    heroTitle: "Tecnologia em movimento para empresas que querem crescer",
    heroText:
      "Criamos sites, sistemas, automações e aplicativos sob medida para transformar ideias em soluções reais para o seu negócio.",
    heroPrimary: "Quero meu projeto",
    heroSecondary: "Conhecer soluções",
    heroFeatureTitle: "Processo claro",
    heroFeatureText: "Do diagnóstico à entrega com acompanhamento próximo.",
    heroLanguageText: "Tecnologia sob medida para empresas em todo o Brasil",
    introKicker: "Destaque da marca",
    introTitle: "A Avalace Tech está no dia a dia das empresas que querem evoluir",
    introText:
      "Ajudamos negócios a economizar tempo, organizar processos e vender mais através da tecnologia. Cada projeto é pensado de forma estratégica, unindo design, funcionalidade e resultado.",
    solutionsKicker: "Nossas soluções",
    solutionsTitle: "Encontre a solução ideal para sua empresa",
    solutionsLink: "Ver produtos",
    solutionOneTitle: "Sistemas Web",
    solutionOneText: "Painéis, dashboards, áreas administrativas e plataformas personalizadas.",
    solutionTwoTitle: "Automações",
    solutionTwoText: "Processos automáticos para atendimento, vendas, financeiro e organização interna.",
    solutionThreeTitle: "Integrações",
    solutionThreeText: "WhatsApp, pagamentos, planilhas, CRMs, APIs e ferramentas externas.",
    productsKicker: "Produtos Avalace Tech",
    productsTitle: "Navegue pelas soluções que podem virar o próximo projeto da sua empresa",
    productMediaTitle: "Produtos digitais",
    productMediaText: "Conte sua ideia e receba um caminho recomendado.",
    productCta: "Quero saber mais",
    helpKicker: "Como podemos ajudar",
    helpTitle: "Sua empresa ainda perde tempo com processos manuais?",
    helpText:
      "Se você ainda usa planilhas confusas, atendimento desorganizado ou processos repetitivos, a Avalace Tech cria soluções para automatizar, organizar e acelerar sua operação.",
    painOneTitle: "Processos manuais",
    painOneText: "Depois: automações inteligentes que reduzem retrabalho.",
    painTwoTitle: "Atendimento perdido no WhatsApp",
    painTwoText: "Depois: fluxo organizado, integrado e fácil de acompanhar.",
    painThreeTitle: "Falta de controle",
    painThreeText: "Depois: sistema com painel, relatórios e visão clara do negócio.",
    reachKicker: "Orçamento rápido",
    reachTitle: "Do diagnóstico à entrega com acompanhamento próximo.",
    proofOne: "Projetos personalizados",
    proofTwo: "Entrega profissional",
    proofThree: "Atendimento humanizado",
    proofFour: "Foco em resultado",
    processKicker: "Processo de trabalho",
    processTitle: "Do primeiro contato à entrega final",
    processOneTitle: "Entendemos sua ideia",
    processOneText: "Você explica o que precisa e analisamos o melhor caminho.",
    processTwoTitle: "Criamos a proposta",
    processTwoText: "Montamos uma solução com prazo, funcionalidades e investimento.",
    processThreeTitle: "Desenvolvemos o projeto",
    processThreeText: "Criamos o site, sistema, automação ou aplicativo.",
    processFourTitle: "Testamos tudo",
    processFourText: "Ajustamos detalhes para garantir funcionamento e qualidade.",
    processFiveTitle: "Entregamos e damos suporte",
    processFiveText: "Você recebe o projeto pronto e com orientação de uso.",
    projectsKicker: "Projetos e cases",
    projectsTitle: "Exemplos de soluções que desenvolvemos",
    projectsLink: "Conversar sobre um projeto",
    projectOneTag: "Presença digital",
    projectOneTitle: "Site institucional para empresas",
    projectOneText: "Criação de presença digital profissional com design moderno e botão direto para contato.",
    projectTwoTag: "Gestão",
    projectTwoTitle: "Sistema de gestão personalizado",
    projectTwoText: "Painel para controlar clientes, vendas, serviços, pagamentos e relatórios.",
    projectThreeTag: "Automação",
    projectThreeTitle: "Automação de atendimento",
    projectThreeText: "Fluxos automáticos para WhatsApp, captação de leads e organização de mensagens.",
    ctaKicker: "Vamos tirar sua ideia do papel",
    ctaTitle: "Pronto para transformar sua ideia em um sistema profissional?",
    ctaText: "Fale com a Avalace Tech e descubra a melhor solução para sua empresa crescer com tecnologia.",
    ctaPrimary: "Solicitar orçamento agora",
    ctaSecondary: "Enviar e-mail",
    footerText: "Sites, sistemas, automações e aplicativos para empresas.",
    footerLinks: "Links",
    footerContact: "Contato",
    copyright: "© 2026 Avalace Tech — Tecnologia para empresas que querem crescer.",
    whatsappLabel: "Chamar a Avalace Tech no WhatsApp",
  },
  en: {
    title: "Avalace Tech | Intelligent systems for companies",
    quote: "Request a quote",
    menuOpen: "Open menu",
    navAbout: "About Us",
    navSolutions: "Solutions",
    navProducts: "Products",
    navProcess: "Process",
    navProjects: "Projects",
    heroKicker: "Avalace Tech",
    heroTitle: "Technology in motion for companies that want to grow",
    heroText: "We create custom websites, systems, automations and apps to turn ideas into real business solutions.",
    heroPrimary: "Start my project",
    heroSecondary: "Explore solutions",
    heroFeatureTitle: "Clear process",
    heroFeatureText: "From diagnosis to delivery with close follow-up.",
    heroLanguageText: "Tailor-made technology for companies across Brazil",
    introKicker: "Brand highlight",
    introTitle: "Avalace Tech supports companies that want to evolve every day",
    introText:
      "We help businesses save time, organize processes and sell more through technology. Every project is designed strategically, combining design, functionality and results.",
    solutionsKicker: "Our solutions",
    solutionsTitle: "Find the ideal solution for your company",
    solutionsLink: "View products",
    solutionOneTitle: "Web Systems",
    solutionOneText: "Panels, dashboards, admin areas and custom platforms.",
    solutionTwoTitle: "Automations",
    solutionTwoText: "Automated processes for support, sales, finance and internal organization.",
    solutionThreeTitle: "Integrations",
    solutionThreeText: "WhatsApp, payments, spreadsheets, CRMs, APIs and external tools.",
    productsKicker: "Avalace Tech products",
    productsTitle: "Browse the solutions that can become your company's next project",
    productMediaTitle: "Digital products",
    productMediaText: "Tell us your idea and receive a recommended path.",
    productCta: "Learn more",
    helpKicker: "How we can help",
    helpTitle: "Is your company still losing time with manual processes?",
    helpText:
      "If you still rely on confusing spreadsheets, disorganized support or repetitive processes, Avalace Tech creates solutions to automate, organize and accelerate your operation.",
    painOneTitle: "Manual processes",
    painOneText: "After: intelligent automations that reduce rework.",
    painTwoTitle: "Lost WhatsApp conversations",
    painTwoText: "After: organized, integrated and easy-to-follow flows.",
    painThreeTitle: "Lack of control",
    painThreeText: "After: system with dashboard, reports and clear business visibility.",
    reachKicker: "Fast quote",
    reachTitle: "From diagnosis to delivery with close follow-up.",
    proofOne: "Custom projects",
    proofTwo: "Professional delivery",
    proofThree: "Human support",
    proofFour: "Results focus",
    processKicker: "Work process",
    processTitle: "From first contact to final delivery",
    processOneTitle: "We understand your idea",
    processOneText: "You explain what you need and we analyze the best path.",
    processTwoTitle: "We create the proposal",
    processTwoText: "We define the solution with timeline, features and investment.",
    processThreeTitle: "We develop the project",
    processThreeText: "We build the website, system, automation or app.",
    processFourTitle: "We test everything",
    processFourText: "We refine details to ensure quality and correct behavior.",
    processFiveTitle: "We deliver and support",
    processFiveText: "You receive the finished project with usage guidance.",
    projectsKicker: "Projects and cases",
    projectsTitle: "Examples of solutions we build",
    projectsLink: "Discuss a project",
    projectOneTag: "Digital presence",
    projectOneTitle: "Institutional website for companies",
    projectOneText: "Professional digital presence with modern design and direct contact buttons.",
    projectTwoTag: "Management",
    projectTwoTitle: "Custom management system",
    projectTwoText: "Panel to control clients, sales, services, payments and reports.",
    projectThreeTag: "Automation",
    projectThreeTitle: "Support automation",
    projectThreeText: "Automated flows for WhatsApp, lead capture and message organization.",
    ctaKicker: "Let's bring your idea to life",
    ctaTitle: "Ready to turn your idea into a professional system?",
    ctaText: "Talk to Avalace Tech and discover the best solution for your company to grow with technology.",
    ctaPrimary: "Request a quote now",
    ctaSecondary: "Send email",
    footerText: "Websites, systems, automations and apps for companies.",
    footerLinks: "Links",
    footerContact: "Contact",
    copyright: "© 2026 Avalace Tech — Technology for companies that want to grow.",
    whatsappLabel: "Contact Avalace Tech on WhatsApp",
  },
  es: {
    title: "Avalace Tech | Sistemas inteligentes para empresas",
    quote: "Solicitar presupuesto",
    menuOpen: "Abrir menú",
    navAbout: "Sobre Nosotros",
    navSolutions: "Soluciones",
    navProducts: "Productos",
    navProcess: "Proceso",
    navProjects: "Proyectos",
    heroKicker: "Avalace Tech",
    heroTitle: "Tecnología en movimiento para empresas que quieren crecer",
    heroText:
      "Creamos sitios, sistemas, automatizaciones y aplicaciones a medida para transformar ideas en soluciones reales para tu negocio.",
    heroPrimary: "Quiero mi proyecto",
    heroSecondary: "Conocer soluciones",
    heroFeatureTitle: "Proceso claro",
    heroFeatureText: "Del diagnóstico a la entrega con acompañamiento cercano.",
    heroLanguageText: "Tecnología a medida para empresas en todo Brasil",
    introKicker: "Destaque de marca",
    introTitle: "Avalace Tech está en el día a día de las empresas que quieren evolucionar",
    introText:
      "Ayudamos a negocios a ahorrar tiempo, organizar procesos y vender más con tecnología. Cada proyecto se piensa de forma estratégica, uniendo diseño, funcionalidad y resultado.",
    solutionsKicker: "Nuestras soluciones",
    solutionsTitle: "Encuentra la solución ideal para tu empresa",
    solutionsLink: "Ver productos",
    solutionOneTitle: "Sistemas Web",
    solutionOneText: "Paneles, dashboards, áreas administrativas y plataformas personalizadas.",
    solutionTwoTitle: "Automatizaciones",
    solutionTwoText: "Procesos automáticos para atención, ventas, finanzas y organización interna.",
    solutionThreeTitle: "Integraciones",
    solutionThreeText: "WhatsApp, pagos, hojas de cálculo, CRMs, APIs y herramientas externas.",
    productsKicker: "Productos Avalace Tech",
    productsTitle: "Navega por soluciones que pueden ser el próximo proyecto de tu empresa",
    productMediaTitle: "Productos digitales",
    productMediaText: "Cuéntanos tu idea y recibe un camino recomendado.",
    productCta: "Quiero saber más",
    helpKicker: "Cómo podemos ayudar",
    helpTitle: "¿Tu empresa todavía pierde tiempo con procesos manuales?",
    helpText:
      "Si todavía usas hojas confusas, atención desorganizada o procesos repetitivos, Avalace Tech crea soluciones para automatizar, organizar y acelerar tu operación.",
    painOneTitle: "Procesos manuales",
    painOneText: "Después: automatizaciones inteligentes que reducen retrabajo.",
    painTwoTitle: "Atención perdida en WhatsApp",
    painTwoText: "Después: flujo organizado, integrado y fácil de acompañar.",
    painThreeTitle: "Falta de control",
    painThreeText: "Después: sistema con panel, reportes y visión clara del negocio.",
    reachKicker: "Presupuesto rápido",
    reachTitle: "Del diagnóstico a la entrega con acompañamiento cercano.",
    proofOne: "Proyectos personalizados",
    proofTwo: "Entrega profesional",
    proofThree: "Atención humanizada",
    proofFour: "Foco en resultados",
    processKicker: "Proceso de trabajo",
    processTitle: "Del primer contacto a la entrega final",
    processOneTitle: "Entendemos tu idea",
    processOneText: "Explicas lo que necesitas y analizamos el mejor camino.",
    processTwoTitle: "Creamos la propuesta",
    processTwoText: "Definimos una solución con plazo, funcionalidades e inversión.",
    processThreeTitle: "Desarrollamos el proyecto",
    processThreeText: "Creamos el sitio, sistema, automatización o aplicación.",
    processFourTitle: "Probamos todo",
    processFourText: "Ajustamos detalles para garantizar funcionamiento y calidad.",
    processFiveTitle: "Entregamos y damos soporte",
    processFiveText: "Recibes el proyecto listo con orientación de uso.",
    projectsKicker: "Proyectos y casos",
    projectsTitle: "Ejemplos de soluciones que desarrollamos",
    projectsLink: "Hablar sobre un proyecto",
    projectOneTag: "Presencia digital",
    projectOneTitle: "Sitio institucional para empresas",
    projectOneText: "Presencia digital profesional con diseño moderno y botón directo de contacto.",
    projectTwoTag: "Gestión",
    projectTwoTitle: "Sistema de gestión personalizado",
    projectTwoText: "Panel para controlar clientes, ventas, servicios, pagos y reportes.",
    projectThreeTag: "Automatización",
    projectThreeTitle: "Automatización de atención",
    projectThreeText: "Flujos automáticos para WhatsApp, captación de leads y organización de mensajes.",
    ctaKicker: "Vamos a sacar tu idea del papel",
    ctaTitle: "¿Listo para transformar tu idea en un sistema profesional?",
    ctaText: "Habla con Avalace Tech y descubre la mejor solución para que tu empresa crezca con tecnología.",
    ctaPrimary: "Solicitar presupuesto ahora",
    ctaSecondary: "Enviar e-mail",
    footerText: "Sitios, sistemas, automatizaciones y aplicaciones para empresas.",
    footerLinks: "Links",
    footerContact: "Contacto",
    copyright: "© 2026 Avalace Tech — Tecnología para empresas que quieren crecer.",
    whatsappLabel: "Llamar a Avalace Tech por WhatsApp",
  },
};

export const products: Product[] = [
  {
    id: "professional-sites",
    category: "presence",
    accent: "blue",
    content: {
      pt: {
        tag: "Presença digital",
        name: "Sites Profissionais",
        summary: "Sites institucionais, landing pages e páginas de venda com alta percepção de confiança.",
        metric: "Ideal para atrair clientes",
        bullets: ["Design responsivo", "Estrutura para SEO", "Botões de conversão", "Carregamento rápido"],
      },
      en: {
        tag: "Digital presence",
        name: "Professional Websites",
        summary: "Corporate websites, landing pages and sales pages with strong trust signals.",
        metric: "Ideal to attract customers",
        bullets: ["Responsive design", "SEO-ready structure", "Conversion buttons", "Fast loading"],
      },
      es: {
        tag: "Presencia digital",
        name: "Sitios Profesionales",
        summary: "Sitios institucionales, landing pages y páginas de venta con alta confianza.",
        metric: "Ideal para atraer clientes",
        bullets: ["Diseño responsivo", "Estructura para SEO", "Botones de conversión", "Carga rápida"],
      },
    },
  },
  {
    id: "web-systems",
    category: "operation",
    accent: "green",
    content: {
      pt: {
        tag: "Operação",
        name: "Sistemas Web",
        summary: "Plataformas para controlar clientes, vendas, estoque, agenda, serviços e relatórios.",
        metric: "Controle em um só lugar",
        bullets: ["Painel administrativo", "Login por perfil", "Relatórios visuais", "Fluxos personalizados"],
      },
      en: {
        tag: "Operations",
        name: "Web Systems",
        summary: "Platforms to manage clients, sales, inventory, schedules, services and reports.",
        metric: "Control in one place",
        bullets: ["Admin dashboard", "Role-based login", "Visual reports", "Custom workflows"],
      },
      es: {
        tag: "Operación",
        name: "Sistemas Web",
        summary: "Plataformas para controlar clientes, ventas, stock, agenda, servicios y reportes.",
        metric: "Control en un solo lugar",
        bullets: ["Panel administrativo", "Login por perfil", "Reportes visuales", "Flujos personalizados"],
      },
    },
  },
  {
    id: "automations",
    category: "automation",
    accent: "violet",
    content: {
      pt: {
        tag: "Automação",
        name: "Automações Inteligentes",
        summary: "Rotinas automáticas para atendimento, captação de leads, financeiro e organização interna.",
        metric: "Menos tarefas repetitivas",
        bullets: ["Fluxos de WhatsApp", "Organização de mensagens", "Atualização de planilhas", "Avisos e lembretes"],
      },
      en: {
        tag: "Automation",
        name: "Smart Automations",
        summary: "Automated routines for support, lead capture, finance and internal organization.",
        metric: "Less repetitive work",
        bullets: ["WhatsApp flows", "Message organization", "Spreadsheet updates", "Alerts and reminders"],
      },
      es: {
        tag: "Automatización",
        name: "Automatizaciones Inteligentes",
        summary: "Rutinas automáticas para atención, captación de leads, finanzas y organización interna.",
        metric: "Menos tareas repetitivas",
        bullets: ["Flujos de WhatsApp", "Organización de mensajes", "Actualización de hojas", "Avisos y recordatorios"],
      },
    },
  },
  {
    id: "apps",
    category: "mobile",
    accent: "cyan",
    content: {
      pt: {
        tag: "Mobile",
        name: "Aplicativos e Portais",
        summary: "Experiências mobile e web para clientes, equipes e operações sempre acessíveis.",
        metric: "Acesso de qualquer lugar",
        bullets: ["Interface responsiva", "Área do cliente", "Notificações", "Experiência mobile-first"],
      },
      en: {
        tag: "Mobile",
        name: "Apps and Portals",
        summary: "Mobile and web experiences for customers, teams and operations that need constant access.",
        metric: "Access from anywhere",
        bullets: ["Responsive interface", "Customer area", "Notifications", "Mobile-first experience"],
      },
      es: {
        tag: "Mobile",
        name: "Aplicaciones y Portales",
        summary: "Experiencias móviles y web para clientes, equipos y operaciones siempre accesibles.",
        metric: "Acceso desde cualquier lugar",
        bullets: ["Interfaz responsiva", "Área del cliente", "Notificaciones", "Experiencia mobile-first"],
      },
    },
  },
  {
    id: "integrations",
    category: "integration",
    accent: "gold",
    content: {
      pt: {
        tag: "Integrações",
        name: "Integrações e APIs",
        summary: "Conexões entre WhatsApp, pagamentos, planilhas, CRMs, ERPs e ferramentas externas.",
        metric: "Ferramentas conversando entre si",
        bullets: ["APIs externas", "Pagamentos", "CRMs e planilhas", "Conexão com sistemas existentes"],
      },
      en: {
        tag: "Integrations",
        name: "Integrations and APIs",
        summary: "Connections between WhatsApp, payments, spreadsheets, CRMs, ERPs and external tools.",
        metric: "Tools talking to each other",
        bullets: ["External APIs", "Payments", "CRMs and spreadsheets", "Existing system connections"],
      },
      es: {
        tag: "Integraciones",
        name: "Integraciones y APIs",
        summary: "Conexiones entre WhatsApp, pagos, hojas de cálculo, CRMs, ERPs y herramientas externas.",
        metric: "Herramientas conectadas entre sí",
        bullets: ["APIs externas", "Pagos", "CRMs y hojas", "Conexión con sistemas existentes"],
      },
    },
  },
  {
    id: "dashboards",
    category: "operation",
    accent: "blue",
    content: {
      pt: {
        tag: "Dados",
        name: "Dashboards e BI",
        summary: "Painéis visuais para acompanhar indicadores, metas, vendas e operação em tempo real.",
        metric: "Decisão com mais clareza",
        bullets: ["Indicadores visuais", "Filtros por período", "Relatórios rápidos", "Visão executiva"],
      },
      en: {
        tag: "Data",
        name: "Dashboards and BI",
        summary: "Visual panels to track indicators, goals, sales and operations in real time.",
        metric: "Clearer decisions",
        bullets: ["Visual indicators", "Date filters", "Fast reports", "Executive overview"],
      },
      es: {
        tag: "Datos",
        name: "Dashboards y BI",
        summary: "Paneles visuales para acompañar indicadores, metas, ventas y operación en tiempo real.",
        metric: "Decisiones con más claridad",
        bullets: ["Indicadores visuales", "Filtros por período", "Reportes rápidos", "Visión ejecutiva"],
      },
    },
  },
];
