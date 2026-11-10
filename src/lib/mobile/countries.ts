export interface Country {
  code: string;
  name: string;
  flag: string;
  langCode: string;
  langName: string;
  formality: string;
  formalityHint: string;
  fillerPhrase: string;
  fillerMeaning: string;
}

export const COUNTRIES: Country[] = [
  {
    code: "jp",
    name: "Japan",
    flag: "🇯🇵",
    langCode: "ja",
    langName: "Japanese",
    formality: "Keigo (polite)",
    formalityHint: "honorifics for ryokans & restaurants",
    fillerPhrase: "少々お待ちください。お客様にご確認いたしております。",
    fillerMeaning: "One moment please, I am confirming with the customer.",
  },
  {
    code: "kr",
    name: "South Korea",
    flag: "🇰🇷",
    langCode: "ko",
    langName: "Korean",
    formality: "존댓말 (honorific)",
    formalityHint: "polite verb endings for service staff",
    fillerPhrase: "잠시만 기다려 주십시오. 손님께 확인 중입니다.",
    fillerMeaning: "Please wait a moment, I am checking with the guest.",
  },
  {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
    langCode: "fr",
    langName: "French",
    formality: "vous (formal)",
    formalityHint: "standard polite address for hotels & restaurants",
    fillerPhrase: "Un instant s'il vous plaît, je vérifie auprès du client.",
    fillerMeaning: "One moment please, I'm checking with the client.",
  },
  {
    code: "es",
    name: "Spain / Latin America",
    flag: "🇪🇸",
    langCode: "es",
    langName: "Spanish",
    formality: "usted (formal)",
    formalityHint: "polite form for service situations",
    fillerPhrase: "Un momento por favor, lo confirmo con el cliente.",
    fillerMeaning: "One moment please, I'll confirm with the client.",
  },
  {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
    langCode: "de",
    langName: "German",
    formality: "Sie (formal)",
    formalityHint: "Sie form for all professional calls",
    fillerPhrase: "Einen Moment bitte, ich frage kurz beim Gast nach.",
    fillerMeaning: "One moment please, I'll quickly ask the guest.",
  },
  {
    code: "it",
    name: "Italy",
    flag: "🇮🇹",
    langCode: "it",
    langName: "Italian",
    formality: "Lei (formal)",
    formalityHint: "polite third-person form for service calls",
    fillerPhrase: "Un momento per favore, sto verificando con il cliente.",
    fillerMeaning: "One moment please, I am verifying with the client.",
  },
  {
    code: "cn",
    name: "China",
    flag: "🇨🇳",
    langCode: "zh",
    langName: "Chinese",
    formality: "polite",
    formalityHint: "standard polite service language",
    fillerPhrase: "请稍等，我正在与客户确认。",
    fillerMeaning: "Please wait, I am confirming with the customer.",
  },
  {
    code: "th",
    name: "Thailand",
    flag: "🇹🇭",
    langCode: "th",
    langName: "Thai",
    formality: "polite (ค่ะ/ครับ)",
    formalityHint: "polite particles for hotel & transport staff",
    fillerPhrase: "กรุณารอสักครู่ กำลังตรวจสอบกับลูกค้าครับ",
    fillerMeaning: "Please wait a moment, confirming with the customer.",
  },
  {
    code: "other",
    name: "Other countries",
    flag: "🌐",
    langCode: "en",
    langName: "Local language",
    formality: "polite",
    formalityHint: "auto-detect and respond politely",
    fillerPhrase: "One moment please, let me check with the customer.",
    fillerMeaning: "Universal polite filler.",
  },
];

export const SERVICE_CATEGORIES = [
  { id: "hotel", label: "Hotel & Ryokan", icon: "🏨" },
  { id: "restaurant", label: "Restaurant & Omakase", icon: "🍽️" },
  { id: "delivery", label: "Delivery & Courier", icon: "📦" },
  { id: "taxi", label: "Taxi & Transport", icon: "🚕" },
  { id: "airline", label: "Airline", icon: "✈️" },
  { id: "clinic", label: "Clinic & Pharmacy", icon: "🏥" },
  { id: "emergency", label: "Emergency", icon: "🚨" },
] as const;
