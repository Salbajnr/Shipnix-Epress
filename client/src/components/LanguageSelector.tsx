import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" }
];

interface LanguageSelectorProps {
  variant?: "dropdown" | "select";
  onLanguageChange?: (language: Language) => void;
}

export default function LanguageSelector({ 
  variant = "dropdown", 
  onLanguageChange 
}: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("shipnix-language");
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
        applyLanguage(language);
      }
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      const detectedLanguage = languages.find(lang => lang.code === browserLang);
      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage);
        applyLanguage(detectedLanguage);
      }
    }
  }, []);

  const applyLanguage = (language: Language) => {
    // Save to localStorage
    localStorage.setItem("shipnix-language", language.code);
    
    // Set document direction for RTL languages
    document.documentElement.dir = language.rtl ? "rtl" : "ltr";
    document.documentElement.lang = language.code;
    
    // Update page title and meta tags
    document.title = getTranslatedText("page_title", language.code);
    
    // Trigger custom event for other components to update
    window.dispatchEvent(new CustomEvent("languageChange", { 
      detail: language 
    }));
    
    onLanguageChange?.(language);
  };

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      applyLanguage(language);
    }
  };

  const getTranslatedText = (key: string, langCode: string): string => {
    // Simple translation system - in production, use proper i18n library
    const translations: { [key: string]: { [lang: string]: string } } = {
      page_title: {
        en: "Shipnix-Express - Global Logistics Solutions",
        es: "Shipnix-Express - Soluciones Logísticas Globales",
        fr: "Shipnix-Express - Solutions Logistiques Mondiales",
        de: "Shipnix-Express - Globale Logistiklösungen",
        zh: "Shipnix-Express - 全球物流解决方案",
        ja: "Shipnix-Express - グローバル物流ソリューション",
        ar: "شيبنيكس إكسبرس - حلول لوجستية عالمية",
        ru: "Shipnix-Express - Глобальные логистические решения"
      },
      select_language: {
        en: "Select Language",
        es: "Seleccionar Idioma",
        fr: "Sélectionner la Langue",
        de: "Sprache Auswählen",
        zh: "选择语言",
        ja: "言語を選択",
        ar: "اختر اللغة",
        ru: "Выберите язык"
      }
    };
    
    return translations[key]?.[langCode] || translations[key]?.["en"] || key;
  };

  if (variant === "select") {
    return (
      <Select value={currentLanguage.code} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-40">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.nativeName}</span>
                <span className="text-muted-foreground">({language.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto">
        <div className="p-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {getTranslatedText("select_language", currentLanguage.code)}
          </div>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{language.name}</div>
                </div>
              </div>
              {currentLanguage.code === language.code && (
                <Check className="h-4 w-4 text-blue-500" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Translation hook for components
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    
    // Get current language from localStorage
    const savedLanguage = localStorage.getItem("shipnix-language");
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string): string => {
    // Translation function - would typically load from translation files
    const translations: { [key: string]: { [lang: string]: string } } = {
      // Common UI translations
      track_package: {
        en: "Track Package",
        es: "Rastrear Paquete",
        fr: "Suivre le Colis",
        de: "Paket Verfolgen",
        zh: "包裹追踪",
        ja: "荷物追跡",
        ar: "تتبع الطرد",
        ru: "Отследить посылку"
      },
      shipping_cost: {
        en: "Shipping Cost",
        es: "Costo de Envío",
        fr: "Coût d'Expédition", 
        de: "Versandkosten",
        zh: "运费",
        ja: "送料",
        ar: "تكلفة الشحن",
        ru: "Стоимость доставки"
      },
      delivery_status: {
        en: "Delivery Status",
        es: "Estado de Entrega",
        fr: "Statut de Livraison",
        de: "Lieferstatus",
        zh: "配送状态",
        ja: "配送状況",
        ar: "حالة التسليم",
        ru: "Статус доставки"
      },
      customer_support: {
        en: "Customer Support",
        es: "Atención al Cliente",
        fr: "Support Client",
        de: "Kundensupport",
        zh: "客户支持",
        ja: "カスタマーサポート",
        ar: "دعم العملاء",
        ru: "Поддержка клиентов"
      }
    };

    return translations[key]?.[currentLanguage.code] || translations[key]?.["en"] || key;
  };

  return { t, currentLanguage };
}