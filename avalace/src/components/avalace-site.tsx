"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  categoryLabels,
  copy,
  languages,
  products,
  type Language,
  type Product,
  type ProductAccent,
  type ProductCategory,
} from "@/lib/content";

const heroImage = "/assets/avalace-editorial-hero.png";
const categories = ["all", "presence", "operation", "automation", "mobile", "integration"] as const;

const accentClasses: Record<ProductAccent, string> = {
  blue: "border-t-blue",
  green: "border-t-green",
  violet: "border-t-violet",
  cyan: "border-t-cyan",
  gold: "border-t-gold",
};

export function AvalaceSite() {
  const [language, setLanguage] = useState<Language>("pt");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [activeProductId, setActiveProductId] = useState(products[0].id);

  const t = copy[language];

  const visibleProducts = useMemo(() => {
    return activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const activeProduct = useMemo(() => {
    return visibleProducts.find((product) => product.id === activeProductId) ?? visibleProducts[0] ?? products[0];
  }, [activeProductId, visibleProducts]);

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
    document.title = copy[language].title;
  }, [language]);

  function moveProduct(direction: 1 | -1) {
    const currentIndex = visibleProducts.findIndex((product) => product.id === activeProduct.id);
    const nextIndex = (currentIndex + direction + visibleProducts.length) % visibleProducts.length;
    setActiveProductId(visibleProducts[nextIndex].id);
  }

  function selectCategory(category: ProductCategory) {
    const nextProducts = category === "all" ? products : products.filter((product) => product.category === category);
    setActiveCategory(category);
    setActiveProductId(nextProducts[0]?.id ?? products[0].id);
  }

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-3 focus:text-white"
        href="#conteudo"
      >
        {language === "pt" ? "Pular para o conteúdo" : language === "en" ? "Skip to content" : "Saltar al contenido"}
      </a>

      <Header
        isMenuOpen={isMenuOpen}
        language={language}
        setIsMenuOpen={setIsMenuOpen}
        setLanguage={setLanguage}
        t={t}
      />

      <main id="conteudo">
        <Hero t={t} />
        <Intro t={t} />
        <Principles t={t} />
        <Products
          activeCategory={activeCategory}
          activeProduct={activeProduct}
          language={language}
          moveProduct={moveProduct}
          setActiveCategory={selectCategory}
          setActiveProductId={setActiveProductId}
          t={t}
          visibleProducts={visibleProducts}
        />
        <Impact t={t} />
        <Reach t={t} />
        <Metrics t={t} />
        <Process t={t} />
        <Projects t={t} />
        <FinalCta t={t} />
      </main>

      <a
        aria-label={t.whatsappLabel}
        className="fixed bottom-4 right-4 z-[80] grid h-14 w-14 place-items-center rounded-full bg-navy text-xs font-black text-white shadow-[0_16px_38px_rgba(9,8,61,0.32)] md:bottom-6 md:right-6"
        href="https://wa.me/5500000000000"
        rel="noreferrer"
        target="_blank"
      >
        WA
      </a>

      <Footer t={t} />
    </>
  );
}

type CopyProps = {
  t: (typeof copy)[Language];
};

function Header({
  isMenuOpen,
  language,
  setIsMenuOpen,
  setLanguage,
  t,
}: CopyProps & {
  isMenuOpen: boolean;
  language: Language;
  setIsMenuOpen: (value: boolean) => void;
  setLanguage: (value: Language) => void;
}) {
  const navItems = [
    { href: "#sobre", label: t.navAbout },
    { href: "#solucoes", label: t.navSolutions },
    { href: "#produtos", label: t.navProducts },
    { href: "#processo", label: t.navProcess },
    { href: "#projetos", label: t.navProjects },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-[70] grid min-h-[78px] grid-cols-[auto_auto] items-center gap-4 px-[clamp(18px,4vw,52px)] py-4 text-white min-[1120px]:grid-cols-[auto_1fr_auto] min-[1120px]:gap-7">
      <a aria-label="Avalace Tech" className="inline-flex items-center gap-2.5 whitespace-nowrap text-base font-black" href="#inicio">
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[7px] bg-gradient-to-br from-cyan to-violet text-sm font-black">
          A
        </span>
        <span>Avalace Tech</span>
      </a>

      <button
        aria-controls="primary-menu"
        aria-expanded={isMenuOpen}
        className="ml-auto grid h-11 w-11 place-items-center rounded-lg border border-white/20 bg-white/15 min-[1120px]:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        type="button"
      >
        <span className="sr-only">{t.menuOpen}</span>
        <span className="grid gap-1.5">
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
        </span>
      </button>

      <nav
        className={`col-span-full rounded-lg border border-white/15 bg-navy/85 p-3 backdrop-blur min-[1120px]:col-auto min-[1120px]:flex min-[1120px]:justify-center min-[1120px]:gap-[clamp(18px,4vw,58px)] min-[1120px]:border-0 min-[1120px]:bg-transparent min-[1120px]:p-0 ${
          isMenuOpen ? "flex flex-col" : "hidden"
        }`}
        id="primary-menu"
      >
        {navItems.map((item) => (
          <a
            className="min-h-10 text-sm text-white/85 transition hover:text-white min-[1120px]:min-h-0 min-[1120px]:text-[0.82rem]"
            href={item.href}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="col-span-full flex items-center justify-between gap-3 min-[1120px]:col-auto">
        <div className="flex rounded-full border border-white/20 bg-white/15 p-1 backdrop-blur">
          {languages.map((item) => (
            <button
              className={`min-h-7 min-w-9 rounded-full px-2 text-xs font-black ${
                language === item.code ? "bg-white text-navy" : "text-white/75"
              }`}
              data-lang={item.code}
              key={item.code}
              onClick={() => setLanguage(item.code)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <a className="hidden min-h-11 items-center rounded-full bg-navy px-5 text-sm font-black text-white shadow-editorial sm:inline-flex" href="#contato">
          {t.quote}
        </a>
      </div>
    </header>
  );
}

function Hero({ t }: CopyProps) {
  return (
    <section className="relative min-h-svh overflow-hidden bg-navy text-white" id="inicio">
      <Image alt="" className="object-cover object-[63%_center]" fill priority sizes="100vw" src={heroImage} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,32,0.82)_0%,rgba(8,9,32,0.52)_54%,rgba(8,9,32,0.8)_100%),linear-gradient(90deg,rgba(8,9,32,0.58),transparent)] min-[681px]:bg-[linear-gradient(90deg,rgba(8,9,32,0.76)_0%,rgba(8,9,32,0.46)_36%,rgba(8,9,32,0.12)_68%,rgba(8,9,32,0.22)_100%),linear-gradient(0deg,rgba(8,9,32,0.64),transparent_46%)]" />

      <div className="relative z-10 grid min-h-[690px] max-w-[780px] content-center px-[clamp(20px,4vw,54px)] pb-10 pt-32 min-[681px]:min-h-[calc(100svh-152px)] min-[681px]:pb-[150px] min-[681px]:pt-[120px]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.08em] text-white/75">{t.heroKicker}</p>
        <h1 className="max-w-[11ch] text-balance text-[clamp(3.9rem,18vw,6rem)] font-medium leading-[0.96] tracking-normal min-[681px]:max-w-[12ch] min-[681px]:text-[clamp(4.3rem,8.9vw,8.9rem)]">
          {t.heroTitle}
        </h1>
        <p className="mt-7 max-w-[50ch] text-sm text-white/85 min-[681px]:text-base">{t.heroText}</p>
        <a className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-navy px-5 text-sm font-black text-white shadow-editorial min-[681px]:w-max" href="#contato">
          {t.heroPrimary}
        </a>
      </div>

      <div className="relative z-10 grid gap-3 px-[clamp(18px,4vw,54px)] pb-6 min-[1120px]:absolute min-[1120px]:inset-x-[clamp(18px,4vw,54px)] min-[1120px]:bottom-6 min-[1120px]:grid-cols-[minmax(260px,0.86fr)_minmax(260px,1fr)_minmax(170px,0.54fr)] min-[1120px]:px-0 min-[1120px]:pb-0">
        <a className="grid min-h-[120px] content-end rounded-lg p-5 text-white min-[1120px]:bg-transparent" href="#sobre">
          <span className="text-xs font-bold text-white/70">{t.heroSecondary}</span>
          <strong className="mt-2 max-w-[34ch] text-sm leading-tight">{t.productMediaText}</strong>
        </a>
        <article className="grid min-h-[120px] content-end rounded-lg border border-white/15 bg-navy/50 p-5 text-white backdrop-blur">
          <span className="text-xs font-bold text-white/70">{t.heroFeatureTitle}</span>
          <strong className="mt-2 max-w-[34ch] text-sm leading-tight">{t.heroFeatureText}</strong>
        </article>
        <article className="grid min-h-[120px] content-end rounded-lg border border-white/15 bg-navy/50 p-5 text-white backdrop-blur">
          <strong>PT · EN · ES</strong>
          <span className="mt-2 text-xs font-bold text-white/70">{t.heroLanguageText}</span>
        </article>
      </div>
    </section>
  );
}

function Intro({ t }: CopyProps) {
  return (
    <section className="mx-auto max-w-[720px] px-5 py-20 text-center md:py-28" id="sobre">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.08em] text-blue">{t.introKicker}</p>
      <h2 className="text-balance text-[clamp(1.95rem,4.1vw,4.25rem)] font-medium leading-[1.06]">{t.introTitle}</h2>
      <p className="mt-5 text-muted">{t.introText}</p>
    </section>
  );
}

function Principles({ t }: CopyProps) {
  const principles = [
    { number: "01", title: t.solutionOneTitle, text: t.solutionOneText, tone: "bg-navy" },
    { number: "02", title: t.solutionTwoTitle, text: t.solutionTwoText, tone: "bg-[#111064]" },
    { number: "03", title: t.solutionThreeTitle, text: t.solutionThreeText, tone: "bg-violet" },
  ];

  return (
    <section className="px-[clamp(18px,4vw,54px)] py-20 md:py-24" id="solucoes">
      <SectionHeading kicker={t.solutionsKicker} link={{ href: "#produtos", label: t.solutionsLink }} title={t.solutionsTitle} />
      <div className="grid gap-2 min-[900px]:grid-cols-3">
        {principles.map((principle) => (
          <article className={`${principle.tone} min-h-[280px] p-6 text-white`} key={principle.number}>
            <span className="text-xs font-black text-white/60">{principle.number}</span>
            <h3 className="mt-16 text-xl font-semibold leading-tight">{principle.title}</h3>
            <p className="mt-3 text-sm text-white/70">{principle.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Products({
  activeCategory,
  activeProduct,
  language,
  moveProduct,
  setActiveCategory,
  setActiveProductId,
  t,
  visibleProducts,
}: CopyProps & {
  activeCategory: ProductCategory;
  activeProduct: Product;
  language: Language;
  moveProduct: (direction: 1 | -1) => void;
  setActiveCategory: (category: ProductCategory) => void;
  setActiveProductId: (id: string) => void;
  visibleProducts: Product[];
}) {
  return (
    <section className="bg-white px-[clamp(18px,4vw,54px)] py-20 md:py-24" id="produtos">
      <SectionHeading
        kicker={t.productsKicker}
        title={t.productsTitle}
        trailing={
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-navy text-2xl text-white" onClick={() => moveProduct(-1)} type="button">
              ‹
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-navy text-2xl text-white" onClick={() => moveProduct(1)} type="button">
              ›
            </button>
          </div>
        }
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            className={`min-h-9 flex-none rounded-full border px-4 text-sm font-black ${
              activeCategory === category ? "border-navy bg-navy text-white" : "border-line bg-white text-muted"
            }`}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {categoryLabels[language][category]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 min-[980px]:grid-cols-[minmax(280px,0.9fr)_minmax(360px,1.1fr)]">
        <div className="relative min-h-[360px] overflow-hidden bg-navy min-[980px]:sticky min-[980px]:top-5 min-[980px]:min-h-[540px]">
          <Image alt="" className="object-cover" fill sizes="(max-width: 980px) 100vw, 42vw" src={heroImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 border border-white/15 bg-navy/60 p-5 text-white backdrop-blur">
            <span className="mb-3 inline-flex text-xs font-black uppercase text-white/70">{t.productMediaTitle}</span>
            <strong className="block leading-tight">{t.productMediaText}</strong>
          </div>
        </div>

        <div>
          <div className="grid gap-2">
            {visibleProducts.map((product) => {
              const content = product.content[language];
              return (
                <button
                  className={`border border-line bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-editorial ${
                    activeProduct.id === product.id ? "border-navy shadow-editorial" : ""
                  } border-t-4 ${accentClasses[product.accent]}`}
                  key={product.id}
                  onClick={() => setActiveProductId(product.id)}
                  type="button"
                >
                  <span className="mb-3 inline-flex text-xs font-black uppercase text-violet">{content.tag}</span>
                  <h3 className="text-xl font-semibold leading-tight">{content.name}</h3>
                  <p className="mt-2 text-sm text-muted">{content.summary}</p>
                </button>
              );
            })}
          </div>
          <ProductDetail language={language} product={activeProduct} t={t} />
        </div>
      </div>
    </section>
  );
}

function ProductDetail({ language, product, t }: CopyProps & { language: Language; product: Product }) {
  const content = product.content[language];

  return (
    <article className={`mt-2 border border-line border-t-4 bg-white p-6 ${accentClasses[product.accent]}`}>
      <span className="mb-3 inline-flex text-xs font-black uppercase text-violet">{content.tag}</span>
      <h3 className="text-[clamp(1.7rem,3vw,3rem)] font-semibold leading-tight">{content.name}</h3>
      <p className="mt-3 text-muted">{content.summary}</p>
      <ul className="mt-6 grid gap-2">
        {content.bullets.map((bullet) => (
          <li className="flex gap-3 text-muted" key={bullet}>
            <span className="mt-2 h-2 w-2 flex-none rounded-full bg-violet" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 min-[680px]:flex-row min-[680px]:items-center min-[680px]:justify-between">
        <strong className="text-navy">{content.metric}</strong>
        <a className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-black text-white" href="#contato">
          {t.productCta}
        </a>
      </div>
    </article>
  );
}

function Impact({ t }: CopyProps) {
  const items = [
    { number: "01", title: t.painOneTitle, text: t.painOneText },
    { number: "02", title: t.painTwoTitle, text: t.painTwoText },
    { number: "03", title: t.painThreeTitle, text: t.painThreeText },
  ];

  return (
    <section className="grid gap-12 border-t border-line bg-white px-[clamp(18px,4vw,54px)] py-20 min-[980px]:grid-cols-[minmax(280px,0.9fr)_minmax(320px,1.1fr)] md:py-24">
      <div className="max-w-[580px]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.08em] text-blue">{t.helpKicker}</p>
        <h2 className="text-balance text-[clamp(1.95rem,4.1vw,4.25rem)] font-medium leading-[1.06]">{t.helpTitle}</h2>
        <p className="mt-5 text-muted">{t.helpText}</p>
      </div>
      <div className="grid gap-px border border-line bg-line">
        {items.map((item) => (
          <article className="grid gap-4 bg-white p-6 min-[680px]:grid-cols-[62px_1fr]" key={item.number}>
            <span className="text-xs font-black text-violet">{item.number}</span>
            <div>
              <h3 className="text-xl font-semibold leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm text-muted">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Reach({ t }: CopyProps) {
  return (
    <section className="grid min-h-[520px] gap-8 bg-[#1e1f20] px-[clamp(18px,4vw,54px)] py-20 text-white min-[980px]:grid-cols-[minmax(280px,0.62fr)_minmax(360px,1.38fr)]">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.08em] text-white/70">{t.reachKicker}</p>
        <h2 className="max-w-[620px] text-[clamp(1.95rem,4.1vw,4.25rem)] font-medium leading-[1.06]">{t.reachTitle}</h2>
      </div>
      <div className="relative min-h-[380px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(35,103,244,0.2),transparent_55%)]">
        <div className="absolute inset-[13%_10%] border border-white/40 [clip-path:polygon(38%_4%,55%_10%,72%_20%,88%_40%,78%_62%,62%_82%,43%_88%,23%_76%,12%_54%,18%_30%)]" />
        {["left-[35%] top-[22%]", "left-[54%] top-[38%]", "left-[42%] top-[55%]", "left-[70%] top-[28%]", "left-[65%] top-[67%]"].map((position) => (
          <span className={`absolute h-[72px] w-[72px] border border-white/20 bg-violet/80 ${position}`} key={position} />
        ))}
      </div>
    </section>
  );
}

function Metrics({ t }: CopyProps) {
  return (
    <section className="grid border-y border-line min-[680px]:grid-cols-2 min-[1120px]:grid-cols-4">
      {[t.proofOne, t.proofTwo, t.proofThree, t.proofFour].map((item, index) => (
        <article className="min-h-[190px] border-b border-line p-8 min-[680px]:min-h-[240px] min-[1120px]:border-r" key={item}>
          <strong className="block text-[clamp(3rem,6vw,5rem)] font-semibold text-navy">{String(index + 1).padStart(2, "0")}</strong>
          <p className="mt-7 max-w-[24ch] text-muted">{item}</p>
        </article>
      ))}
    </section>
  );
}

function Process({ t }: CopyProps) {
  const steps = [
    { title: t.processOneTitle, text: t.processOneText },
    { title: t.processTwoTitle, text: t.processTwoText },
    { title: t.processThreeTitle, text: t.processThreeText },
    { title: t.processFourTitle, text: t.processFourText },
    { title: t.processFiveTitle, text: t.processFiveText },
  ];

  return (
    <section className="bg-white px-[clamp(18px,4vw,54px)] py-20 md:py-24" id="processo">
      <SectionHeading kicker={t.processKicker} title={t.processTitle} />
      <ol className="grid gap-px border border-line bg-line min-[680px]:grid-cols-2 min-[1120px]:grid-cols-5">
        {steps.map((step, index) => (
          <li className="min-h-[270px] bg-white p-6" key={step.title}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">{index + 1}</span>
            <h3 className="mt-11 text-lg font-semibold leading-tight">{step.title}</h3>
            <p className="mt-3 text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Projects({ t }: CopyProps) {
  const projects = [
    { tag: t.projectOneTag, title: t.projectOneTitle, text: t.projectOneText },
    { tag: t.projectTwoTag, title: t.projectTwoTitle, text: t.projectTwoText },
    { tag: t.projectThreeTag, title: t.projectThreeTitle, text: t.projectThreeText },
  ];

  return (
    <section className="bg-white px-[clamp(18px,4vw,54px)] py-20 md:py-24" id="projetos">
      <SectionHeading kicker={t.projectsKicker} link={{ href: "#contato", label: t.projectsLink }} title={t.projectsTitle} />
      <div className="grid gap-4 min-[900px]:grid-cols-3">
        {projects.map((project) => (
          <article className="min-h-[330px] border border-line bg-white p-6" key={project.title}>
            <span className="text-xs font-black uppercase text-violet">{project.tag}</span>
            <h3 className="mt-28 text-2xl font-semibold leading-tight">{project.title}</h3>
            <p className="mt-3 text-sm text-muted">{project.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ t }: CopyProps) {
  return (
    <section className="relative grid min-h-[470px] place-items-center overflow-hidden text-center text-white" id="contato">
      <Image alt="" className="object-cover" fill sizes="100vw" src={heroImage} />
      <div className="absolute inset-0 bg-navy/60" />
      <div className="relative z-10 max-w-[780px] px-5 py-16">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.08em] text-white/75">{t.ctaKicker}</p>
        <h2 className="text-balance text-[clamp(1.95rem,4.1vw,4.25rem)] font-medium leading-[1.06]">{t.ctaTitle}</h2>
        <p className="mx-auto mt-5 max-w-[62ch] text-white/80">{t.ctaText}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 min-[680px]:flex-row">
          <a className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-black text-white shadow-editorial" href="https://wa.me/5500000000000" rel="noreferrer" target="_blank">
            {t.ctaPrimary}
          </a>
          <a className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-sm font-black text-white" href="mailto:contato@avalacetech.com.br">
            {t.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }: CopyProps) {
  return (
    <footer className="grid gap-8 bg-[#1c1c1e] px-[clamp(18px,4vw,54px)] py-14 text-white min-[760px]:grid-cols-[minmax(260px,1.5fr)_repeat(2,minmax(180px,1fr))]">
      <div>
        <a className="inline-flex items-center gap-2.5 font-black" href="#inicio">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-[7px] bg-gradient-to-br from-cyan to-violet text-sm font-black">
            A
          </span>
          <span>Avalace Tech</span>
        </a>
        <p className="mt-4 max-w-[34ch] text-white/70">{t.footerText}</p>
      </div>
      <nav aria-label="Links do rodapé">
        <h2 className="mb-4 text-sm font-semibold">{t.footerLinks}</h2>
        {[
          { href: "#sobre", label: t.navAbout },
          { href: "#solucoes", label: t.navSolutions },
          { href: "#produtos", label: t.navProducts },
          { href: "#projetos", label: t.navProjects },
          { href: "#contato", label: "Contato" },
        ].map((item) => (
          <a className="my-2 block text-white/70 hover:text-white" href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div>
        <h2 className="mb-4 text-sm font-semibold">{t.footerContact}</h2>
        <a className="my-2 block text-white/70 hover:text-white" href="https://wa.me/5500000000000" rel="noreferrer" target="_blank">
          WhatsApp
        </a>
        <a className="my-2 block text-white/70 hover:text-white" href="mailto:contato@avalacetech.com.br">
          contato@avalacetech.com.br
        </a>
        <a className="my-2 block text-white/70 hover:text-white" href="#">
          Instagram
        </a>
      </div>
      <p className="border-t border-white/10 pt-6 text-white/70 min-[760px]:col-span-full">{t.copyright}</p>
    </footer>
  );
}

function SectionHeading({
  kicker,
  link,
  title,
  trailing,
}: {
  kicker: string;
  link?: { href: string; label: string };
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-6 min-[680px]:flex-row min-[680px]:items-end min-[680px]:justify-between">
      <div className="max-w-[850px]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.08em] text-blue">{kicker}</p>
        <h2 className="text-balance text-[clamp(1.95rem,4.1vw,4.25rem)] font-medium leading-[1.06]">{title}</h2>
      </div>
      {trailing}
      {link ? (
        <a className="text-sm font-black text-navy" href={link.href}>
          {link.label}
        </a>
      ) : null}
    </div>
  );
}
