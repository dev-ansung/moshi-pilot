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
    formalityHint: "first-person honorifics for ryokans & restaurants",
    fillerPhrase: "少々お待ちください。同行者と相談いたします。",
    fillerMeaning: "One moment please, I will discuss with my travel companion.",
  },
  {
    code: "kr",
    name: "South Korea",
    flag: "🇰🇷",
    langCode: "ko",
    langName: "Korean",
    formality: "존댓말 (honorific)",
    formalityHint: "polite first-person verb endings",
    fillerPhrase: "잠시만요, 일행과 상의해 보겠습니다.",
    fillerMeaning: "Just a moment, I'll consult my companion.",
  },
  {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
    langCode: "fr",
    langName: "French",
    formality: "vous (formal)",
    formalityHint: "polite first-person address for hotels & restaurants",
    fillerPhrase: "Un instant s'il vous plaît, je vois avec mon compagnon.",
    fillerMeaning: "One moment please, I'll check with my companion.",
  },
  {
    code: "es",
    name: "Spain / Latin America",
    flag: "🇪🇸",
    langCode: "es",
    langName: "Spanish",
    formality: "usted (formal)",
    formalityHint: "polite first-person for service situations",
    fillerPhrase: "Un momento por favor, lo consulto con mi acompañante.",
    fillerMeaning: "One moment please, I'll check with my companion.",
  },
  {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
    langCode: "de",
    langName: "German",
    formality: "Sie (formal)",
    formalityHint: "polite first-person for professional calls",
    fillerPhrase: "Einen Moment bitte, ich bespreche das kurz.",
    fillerMeaning: "One moment please, I'll discuss that briefly.",
  },
  {
    code: "it",
    name: "Italy",
    flag: "🇮🇹",
    langCode: "it",
    langName: "Italian",
    formality: "Lei (formal)",
    formalityHint: "polite first-person form for service calls",
    fillerPhrase: "Un momento per favore, mi consulto un attimo.",
    fillerMeaning: "One moment please, I'll discuss for a second.",
  },
  {
    code: "cn",
    name: "China",
    flag: "🇨🇳",
    langCode: "zh",
    langName: "Chinese",
    formality: "polite",
    formalityHint: "polite first-person service language",
    fillerPhrase: "请稍等，我和同行的人商量一下。",
    fillerMeaning: "Please wait, I'll discuss with my companion.",
  },
  {
    code: "th",
    name: "Thailand",
    flag: "🇹🇭",
    langCode: "th",
    langName: "Thai",
    formality: "polite (ค่ะ/ครับ)",
    formalityHint: "polite first-person particles",
    fillerPhrase: "กรุณารอสักครู่ ขอปรึกษาเพื่อนร่วมเดินทางก่อนครับ",
    fillerMeaning: "Please wait a moment, let me consult my companion.",
  },
  {
    code: "other",
    name: "Other countries",
    flag: "🌐",
    langCode: "en",
    langName: "Local language",
    formality: "polite",
    formalityHint: "polite first-person in local language",
    fillerPhrase: "One moment please, let me check with my companion.",
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
