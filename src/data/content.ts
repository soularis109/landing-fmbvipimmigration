import { env } from "../lib/env";

export type Lang = "en" | "ru";

export type ServiceCategory = "citizenship" | "residency" | "business" | "lifestyle";

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  title: string;
  text: string;
  href: string;
}

export interface GoldenVisaFact {
  /** Numeric target for the scroll-driven count-up. `null` = text-only value. */
  value: number | null;
  prefix?: string;
  display: string;
  label: string;
}

export const SITE_URL = "https://fmbvipimmigration.com";
export const WHATSAPP_NUMBER = env.whatsappNumber;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const EVALUATION_PDF = `${SITE_URL}/wp-content/uploads/2021/01/fmbvip.pdf`;
export const MAP_EMBED =
  "https://www.google.com/maps?q=Georgiou+A+85,+Limassol+4048,+Cyprus&output=embed";

/* -------------------------------------------------------------------------- */
/*  CONTENT NOTE — program terms below may be outdated.                       */
/*  Edit ONLY this block when the client confirms current numbers/wording.    */
/* -------------------------------------------------------------------------- */

// TODO: verify current program terms with client
export const CITIZENSHIP_BY_INVESTMENT_CARD: Record<Lang, { title: string; text: string }> = {
  en: {
    title: "Citizenship by Investment",
    text: "Routes to Cypriot citizenship through investment. Conditions depend on the program rules in force — contact us for current terms.",
  },
  ru: {
    title: "Гражданство за инвестиции",
    text: "Пути к гражданству Кипра через инвестиции. Условия зависят от действующих правил программы — свяжитесь с нами для актуальных данных.",
  },
};

// TODO: verify current program terms with client
export const GOLDEN_VISA_FACTS: Record<Lang, GoldenVisaFact[]> = {
  en: [
    { value: 250000, prefix: "€", display: "€250,000", label: "Minimum property investment" },
    { value: null, display: "3 months", label: "To obtain Permanent Residency" },
    {
      value: null,
      display: "5 years",
      label: "Renewable permit, family incl. children up to 24 and parents of both spouses",
    },
  ],
  ru: [
    { value: 250000, prefix: "€", display: "€250 000", label: "Минимальные инвестиции в недвижимость" },
    { value: null, display: "3 месяца", label: "Для получения вида на жительство" },
    {
      value: null,
      display: "5 лет",
      label: "Продлеваемый вид на жительство, включая детей до 24 лет и родителей обоих супругов",
    },
  ],
};

/* -------------------------------------------------------------------------- */

interface Content {
  meta: { title: string; description: string };
  preloader: { label: string };
  header: {
    wordmarkSub: string;
    nav: { id: string; label: string }[];
    whatsapp: string;
    menu: string;
    close: string;
    callAria: string;
  };
  hero: {
    eyebrow: string;
    lines: string[];
    italicLine: number;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
    chips: string[];
    alt: string;
  };
  marquee: string[];
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    stats: { value: number; suffix: string; label: string; plain?: boolean }[];
    photoAlts: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    filters: { id: "all" | ServiceCategory; label: string }[];
    learnMore: string;
    items: ServiceItem[];
  };
  goldenVisa: {
    eyebrow: string;
    title: string;
    cta: string;
    ctaHref: string;
    altA: string;
    altB: string;
  };
  process: {
    title: string;
    sub: string;
    steps: { title: string; text: string }[];
  };
  regions: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    sub: string;
    button: string;
    ringText: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    address: string;
    mapTitle: string;
    form: {
      name: string;
      email: string;
      phone: string;
      service: string;
      message: string;
      submit: string;
      errName: string;
      errEmail: string;
      success: string;
      whatsapp: string;
    };
  };
  footer: {
    rights: string;
    top: string;
  };
  booking: {
    bookCall: string;
    bookConsultation: string;
    title: string;
    close: string;
    notConnected: string;
  };
  whatsapp: { aria: string; message: string };
  cookie: { text: string; accept: string; decline: string };
}

type ServiceBase = Omit<ServiceItem, "title" | "text" | "id"> & { id: string };

const serviceBase: ServiceBase[] = [
  { id: "eu-citizenship", category: "citizenship", href: "/cyprus-eu-citizenship" },
  { id: "permanent", category: "residency", href: "/permanent-residency" },
  { id: "pink-slip", category: "residency", href: "/temporary-residency" },
  { id: "yellow-slip", category: "residency", href: "/cyprus-registration-certificate-yellow-slip" },
  { id: "brexit", category: "residency", href: "/cyprus-uk-citizenship" },
  { id: "work", category: "business", href: "/work-permit" },
  { id: "corporate", category: "business", href: "/corporate-services" },
  { id: "banking", category: "business", href: "/banking-sector" },
  { id: "legal", category: "business", href: "/legal-division" },
  { id: "property", category: "lifestyle", href: "/property-management" },
  { id: "student", category: "lifestyle", href: "/student-visa" },
  { id: "driving", category: "lifestyle", href: "/driving-licence" },
  { id: "investment", category: "citizenship", href: "/cyprus-citizenship-by-investment" },
];

const serviceTextEn: Record<string, { title: string; text: string }> = {
  "eu-citizenship": {
    title: "Cyprus EU Citizenship",
    text: "Several routes to Cypriot nationality: naturalization, marriage to a Cypriot, birth or Cypriot origins.",
  },
  permanent: {
    title: "Permanent Residency",
    text: "Non-EU citizens who buy property in Cyprus can use the accelerated procedure for a lifetime Permanent Residence Permit.",
  },
  "pink-slip": {
    title: "Temporary Residency (Pink Slip)",
    text: "One-year temporary resident status allowing you to stay in Cyprus up to 365 days a year.",
  },
  "yellow-slip": {
    title: "Registration Certificate (Yellow Slip)",
    text: "The registration certificate for EU citizens, known for the yellow paper it's printed on.",
  },
  brexit: {
    title: "Residency after Brexit",
    text: "Procedure for UK nationals who did not register in Cyprus before 31 December 2020.",
  },
  work: {
    title: "Companies of Foreign Interest & Employment Visa",
    text: "Work permits for EU and non-EU citizens — timely, professional, cost-effective.",
  },
  corporate: {
    title: "Corporate Services",
    text: "Local and international company registration and administration.",
  },
  banking: {
    title: "Banking Services",
    text: "Opening personal and corporate bank accounts in Cyprus on your behalf.",
  },
  legal: {
    title: "Legal Division",
    text: "A team of professional lawyers with a client-centric approach.",
  },
  property: {
    title: "Property & Real Estate",
    text: "Advisory on purchase, investment and sale of property all over Cyprus.",
  },
  student: {
    title: "Student Visa",
    text: "Student permits issued by the Civil Registry and Migration Department for a specific institution.",
  },
  driving: {
    title: "Cyprus Driving Licence",
    text: "Provisional or full driving licence — we handle the whole process.",
  },
};

const serviceTextRu: Record<string, { title: string; text: string }> = {
  "eu-citizenship": {
    title: "Гражданство ЕС через Кипр",
    text: "Несколько путей к кипрскому гражданству: натурализация, брак с киприотом, рождение или кипрские корни.",
  },
  permanent: {
    title: "Постоянное проживание",
    text: "Граждане стран вне ЕС, купившие недвижимость на Кипре, могут воспользоваться ускоренной процедурой получения бессрочного ВНЖ.",
  },
  "pink-slip": {
    title: "Временное проживание (Pink Slip)",
    text: "Годовой временный статус резидента, позволяющий находиться на Кипре до 365 дней в году.",
  },
  "yellow-slip": {
    title: "Свидетельство о регистрации (Yellow Slip)",
    text: "Регистрационное свидетельство для граждан ЕС, получившее название по цвету бумаги, на которой оно печатается.",
  },
  brexit: {
    title: "Резидентство после Brexit",
    text: "Процедура для граждан Великобритании, не зарегистрировавшихся на Кипре до 31 декабря 2020 года.",
  },
  work: {
    title: "Компании с иностранным участием и рабочая виза",
    text: "Разрешения на работу для граждан ЕС и стран вне ЕС — вовремя, профессионально, экономично.",
  },
  corporate: {
    title: "Корпоративные услуги",
    text: "Регистрация и сопровождение местных и международных компаний.",
  },
  banking: {
    title: "Банковские услуги",
    text: "Открытие личных и корпоративных банковских счетов на Кипре от вашего имени.",
  },
  legal: {
    title: "Юридический отдел",
    text: "Команда профессиональных юристов с клиентоориентированным подходом.",
  },
  property: {
    title: "Недвижимость",
    text: "Консультации по покупке, инвестициям и продаже недвижимости по всему Кипру.",
  },
  student: {
    title: "Студенческая виза",
    text: "Студенческие разрешения, выдаваемые Управлением записи актов гражданского состояния и миграции для конкретного учебного заведения.",
  },
  driving: {
    title: "Водительские права Кипра",
    text: "Временные или полные водительские права — мы берём на себя весь процесс.",
  },
};

function buildServices(lang: Lang): ServiceItem[] {
  const texts = lang === "en" ? serviceTextEn : serviceTextRu;
  return serviceBase.map((s) => {
    const t = s.id === "investment" ? CITIZENSHIP_BY_INVESTMENT_CARD[lang] : texts[s.id];
    return { ...s, ...t, href: `${SITE_URL}${s.href}` };
  });
}

export const content: Record<Lang, Content> = {
  en: {
    meta: {
      title: "F.M.B. VIP Immigration — EU Citizenship & Residency in Cyprus",
      description:
        "F.M.B. VIP Immigration Services in Limassol, Cyprus since 2013: EU citizenship, permanent residency, work and student visas, corporate, banking, real estate and legal services.",
    },
    preloader: { label: "F.M.B. VIP IMMIGRATION SERVICES" },
    header: {
      wordmarkSub: "VIP IMMIGRATION",
      nav: [
        { id: "about", label: "Why Cyprus" },
        { id: "services", label: "Services" },
        { id: "golden-visa", label: "Golden Visa" },
        { id: "contact", label: "Contact" },
      ],
      whatsapp: "WhatsApp",
      menu: "Open menu",
      close: "Close menu",
      callAria: "Call us",
    },
    hero: {
      eyebrow: "LIMASSOL · CYPRUS · SINCE 2013",
      lines: ["EU CITIZENSHIP", "& IMMIGRATION", "IN CYPRUS"],
      italicLine: 1,
      sub: "A full range of consulting, legal, financial, citizenship, real estate, taxation, accounting and banking services in Cyprus and across the world.",
      ctaPrimary: "Get free evaluation",
      ctaSecondary: "Our services",
      scroll: "Scroll",
      chips: ["100% success rate", "Answer in 48h", "EN · RU · GR"],
      alt: "Limassol coastline, Cyprus",
    },
    marquee: [
      "Citizenship by Naturalization",
      "Permanent Residence",
      "Pink Slip",
      "Yellow Slip",
      "Student Visa",
      "Corporate Services",
      "Employment Visa",
      "Banking",
      "Real Estate",
      "Legal Division",
    ],
    about: {
      eyebrow: "WHO WE ARE",
      title: "Experienced immigration specialists",
      paragraphs: [
        "F.M.B. VIP Immigration is a company specializing in all types of immigration and legal matters in Cyprus.",
        "Working with clients from Russia and the CIS, the Middle East and Asia, we have earned a reputation for first-class service and the highest standards of honesty and professionalism.",
        "We deal with most governmental meetings and paperwork, asking you to attend only when essential.",
      ],
      stats: [
        { value: 2013, suffix: "", label: "Serving clients since", plain: true },
        { value: 100, suffix: "%", label: "Success rate for PR & citizenship applications" },
        { value: 13, suffix: "+", label: "Immigration & business services" },
        { value: 48, suffix: "h", label: "Free eligibility evaluation" },
      ],
      photoAlts: [
        "F.M.B. VIP Immigration office, Limassol",
        "Consultation room at the F.M.B. office",
        "Reception area at the F.M.B. office",
        "Meeting space at the F.M.B. office",
      ],
    },
    services: {
      eyebrow: "OUR SERVICES",
      title: "Everything for your move — in one office",
      filters: [
        { id: "all", label: "All" },
        { id: "citizenship", label: "Citizenship" },
        { id: "residency", label: "Residency" },
        { id: "business", label: "Business" },
        { id: "lifestyle", label: "Lifestyle" },
      ],
      learnMore: "+ Learn more",
      items: buildServices("en"),
    },
    goldenVisa: {
      eyebrow: "GREECE · GOLDEN VISA",
      title: "Residency in the EU for the whole family",
      cta: "+ Learn more",
      ctaHref: `${SITE_URL}/greece-golden-visa`,
      altA: "Greek coastline",
      altB: "Greek island village",
    },
    process: {
      title: "We make it easy",
      sub: "Step-by-step guidance that helps you avoid application errors and costly delays.",
      steps: [
        { title: "Free evaluation", text: "Find out if you're eligible in less than 48 hours." },
        { title: "Strategy", text: "We choose the right route: residency, citizenship, work or study." },
        { title: "Documents", text: "We prepare and check every application to avoid errors." },
        { title: "Government", text: "We attend meetings and handle paperwork; you come only when essential." },
        { title: "Life in Cyprus", text: "Our legal team stays with you before, during and after your move." },
      ],
    },
    regions: {
      title: "Trusted by clients from three regions",
      items: ["Russia & CIS", "Middle East", "Asia"],
    },
    cta: {
      title: "Are you eligible to immigrate to Cyprus?",
      sub: "Before representing you, we offer a FREE immigration evaluation. Answer in less than 48 hours.",
      button: "GET FREE EVALUATION",
      ringText: "FREE EVALUATION · ANSWER IN 48H · ",
    },
    contact: {
      eyebrow: "CONTACT US",
      title: "Let's start your case",
      address: "Georgiou A, 85D, Germasogeia 4048, Limassol, Cyprus",
      mapTitle: "F.M.B. VIP Immigration office on the map",
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        service: "Service",
        message: "Message",
        submit: "Send request",
        errName: "Please enter your name",
        errEmail: "Please enter a valid email",
        success: "Thank you. We'll contact you within 48 hours.",
        whatsapp: "Prefer WhatsApp? Message us",
      },
    },
    footer: {
      rights: "© 2026 F.M.B. VIP Immigration Services Ltd",
      top: "Back to top ↑",
    },
    booking: {
      bookCall: "Book a call",
      bookConsultation: "Book a consultation",
      title: "Book a consultation",
      close: "Close",
      notConnected: "Booking calendar not connected yet — set VITE_CAL_LINK in .env",
    },
    whatsapp: {
      aria: "Chat on WhatsApp",
      message: "Hello, I'm interested in Cyprus immigration services.",
    },
    cookie: {
      text: "We use analytics cookies to improve this site. You can accept or decline.",
      accept: "Accept",
      decline: "Decline",
    },
  },
  ru: {
    meta: {
      title: "F.M.B. VIP Immigration — гражданство ЕС и ВНЖ на Кипре",
      description:
        "F.M.B. VIP Immigration Services в Лимасоле с 2013 года: гражданство ЕС, постоянное проживание, рабочие и студенческие визы, корпоративные, банковские, юридические услуги и недвижимость.",
    },
    preloader: { label: "F.M.B. VIP IMMIGRATION SERVICES" },
    header: {
      wordmarkSub: "VIP IMMIGRATION",
      nav: [
        { id: "about", label: "Почему Кипр" },
        { id: "services", label: "Услуги" },
        { id: "golden-visa", label: "Golden Visa" },
        { id: "contact", label: "Контакты" },
      ],
      whatsapp: "WhatsApp",
      menu: "Открыть меню",
      close: "Закрыть меню",
      callAria: "Позвонить",
    },
    hero: {
      eyebrow: "ЛИМАСОЛ · КИПР · С 2013 ГОДА",
      lines: ["ГРАЖДАНСТВО ЕС", "& ИММИГРАЦИЯ", "НА КИПРЕ"],
      italicLine: 1,
      sub: "Полный спектр консалтинговых, юридических, финансовых услуг, услуг по гражданству, недвижимости, налогообложению, бухгалтерии и банкингу на Кипре и по всему миру.",
      ctaPrimary: "Бесплатная оценка",
      ctaSecondary: "Наши услуги",
      scroll: "Листайте",
      chips: ["100% успешных дел", "Ответ за 48 часов", "EN · RU · GR"],
      alt: "Побережье Лимасола, Кипр",
    },
    marquee: [
      "Гражданство через натурализацию",
      "Постоянное проживание",
      "Pink Slip",
      "Yellow Slip",
      "Студенческая виза",
      "Корпоративные услуги",
      "Рабочая виза",
      "Банковские услуги",
      "Недвижимость",
      "Юридический отдел",
    ],
    about: {
      eyebrow: "КТО МЫ",
      title: "Опытные специалисты по иммиграции",
      paragraphs: [
        "F.M.B. VIP Immigration — компания, специализирующаяся на всех видах иммиграционных и юридических вопросов на Кипре.",
        "Работая с клиентами из России и СНГ, Ближнего Востока и Азии, мы заслужили репутацию первоклассного сервиса и высочайших стандартов честности и профессионализма.",
        "Мы берём на себя большинство встреч в госорганах и бумажную работу, прося вас приезжать только в случае крайней необходимости.",
      ],
      stats: [
        { value: 2013, suffix: "", label: "Работаем с клиентами с", plain: true },
        { value: 100, suffix: "%", label: "Успешных заявок на ПМЖ и гражданство" },
        { value: 13, suffix: "+", label: "Иммиграционных и бизнес-услуг" },
        { value: 48, suffix: "ч", label: "Бесплатная оценка соответствия" },
      ],
      photoAlts: [
        "Офис F.M.B. VIP Immigration в Лимасоле",
        "Переговорная в офисе F.M.B.",
        "Зона ресепшн в офисе F.M.B.",
        "Пространство для встреч в офисе F.M.B.",
      ],
    },
    services: {
      eyebrow: "НАШИ УСЛУГИ",
      title: "Всё для вашего переезда — в одном офисе",
      filters: [
        { id: "all", label: "Все" },
        { id: "citizenship", label: "Гражданство" },
        { id: "residency", label: "Проживание" },
        { id: "business", label: "Бизнес" },
        { id: "lifestyle", label: "Жизнь" },
      ],
      learnMore: "+ Подробнее",
      items: buildServices("ru"),
    },
    goldenVisa: {
      eyebrow: "ГРЕЦИЯ · GOLDEN VISA",
      title: "Резидентство в ЕС для всей семьи",
      cta: "+ Подробнее",
      ctaHref: `${SITE_URL}/greece-golden-visa`,
      altA: "Побережье Греции",
      altB: "Деревня на греческом острове",
    },
    process: {
      title: "Мы делаем это просто",
      sub: "Пошаговое сопровождение, которое помогает избежать ошибок в заявках и дорогостоящих задержек.",
      steps: [
        { title: "Бесплатная оценка", text: "Узнайте, подходите ли вы, менее чем за 48 часов." },
        { title: "Стратегия", text: "Мы выбираем верный путь: проживание, гражданство, работа или учёба." },
        { title: "Документы", text: "Мы готовим и проверяем каждую заявку, чтобы избежать ошибок." },
        { title: "Госорганы", text: "Мы ходим на встречи и занимаемся бумагами; вы приезжаете только при необходимости." },
        { title: "Жизнь на Кипре", text: "Наша юридическая команда рядом до, во время и после вашего переезда." },
      ],
    },
    regions: {
      title: "Нам доверяют клиенты из трёх регионов",
      items: ["Россия и СНГ", "Ближний Восток", "Азия"],
    },
    cta: {
      title: "Вы можете иммигрировать на Кипр?",
      sub: "Прежде чем представлять ваши интересы, мы проводим БЕСПЛАТНУЮ иммиграционную оценку. Ответ менее чем за 48 часов.",
      button: "БЕСПЛАТНАЯ ОЦЕНКА",
      ringText: "БЕСПЛАТНАЯ ОЦЕНКА · ОТВЕТ ЗА 48 ЧАСОВ · ",
    },
    contact: {
      eyebrow: "СВЯЖИТЕСЬ С НАМИ",
      title: "Начнём ваше дело",
      address: "Georgiou A, 85D, Germasogeia 4048, Limassol, Cyprus",
      mapTitle: "Офис F.M.B. VIP Immigration на карте",
      form: {
        name: "Имя",
        email: "Email",
        phone: "Телефон",
        service: "Услуга",
        message: "Сообщение",
        submit: "Отправить заявку",
        errName: "Пожалуйста, укажите имя",
        errEmail: "Пожалуйста, укажите корректный email",
        success: "Спасибо. Мы свяжемся с вами в течение 48 часов.",
        whatsapp: "Удобнее в WhatsApp? Напишите нам",
      },
    },
    footer: {
      rights: "© 2026 F.M.B. VIP Immigration Services Ltd",
      top: "Наверх ↑",
    },
    booking: {
      bookCall: "Записаться на звонок",
      bookConsultation: "Записаться на консультацию",
      title: "Запись на консультацию",
      close: "Закрыть",
      notConnected: "Календарь записи ещё не подключён — укажите VITE_CAL_LINK в .env",
    },
    whatsapp: {
      aria: "Написать в WhatsApp",
      message: "Здравствуйте, меня интересуют услуги по иммиграции на Кипр.",
    },
    cookie: {
      text: "Мы используем аналитические cookies, чтобы улучшать сайт. Вы можете принять или отказаться.",
      accept: "Принять",
      decline: "Отказаться",
    },
  },
};

export const PHONES = [
  { label: "+357 99 445099", href: "tel:+35799445099" },
  { label: "+357 99 252255", href: "tel:+35799252255" },
];
export const EMAIL = "info@fmbvipimmigration.com";
export const INSTAGRAM_HANDLE = "@fmbimmigration";
export const SOCIALS = {
  instagram: "https://www.instagram.com/fmbimmigration/",
  facebook: "https://www.facebook.com/fmbimmigrationservices/",
  linkedin: "https://www.linkedin.com/company/f-m-b-vip-immigration-services-ltd/",
};
