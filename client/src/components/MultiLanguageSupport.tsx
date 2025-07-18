import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  CheckCircle, 
  Download, 
  Volume2, 
  Translate,
  Settings,
  Users
} from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  supported: boolean;
  completeness: number;
  rtl: boolean;
}

interface MultiLanguageSupportProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export default function MultiLanguageSupport({ 
  currentLanguage = "en",
  onLanguageChange 
}: MultiLanguageSupportProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [isChanging, setIsChanging] = useState(false);

  const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", supported: true, completeness: 100, rtl: false },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", supported: true, completeness: 98, rtl: false },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", supported: true, completeness: 95, rtl: false },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", supported: true, completeness: 92, rtl: false },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", supported: true, completeness: 90, rtl: false },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", supported: true, completeness: 88, rtl: false },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", supported: true, completeness: 85, rtl: false },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", supported: true, completeness: 93, rtl: false },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", supported: true, completeness: 87, rtl: false },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", supported: true, completeness: 82, rtl: false },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", supported: true, completeness: 80, rtl: true },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", supported: true, completeness: 75, rtl: false },
    { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", supported: true, completeness: 78, rtl: false },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", supported: true, completeness: 73, rtl: false },
    { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", supported: true, completeness: 70, rtl: false },
    { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", supported: true, completeness: 68, rtl: false },
    { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", supported: true, completeness: 85, rtl: false },
    { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", supported: true, completeness: 65, rtl: false },
    { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", supported: true, completeness: 62, rtl: false },
    { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", supported: true, completeness: 60, rtl: false }
  ];

  const regions = [
    { name: "Americas", languages: ["en", "es", "pt", "fr"] },
    { name: "Europe", languages: ["en", "es", "fr", "de", "it", "ru", "pl", "nl", "sv", "da", "no"] },
    { name: "Asia Pacific", languages: ["zh", "ja", "ko", "hi", "th", "vi"] },
    { name: "Middle East & Africa", languages: ["ar", "tr", "en", "fr"] }
  ];

  const handleLanguageChange = (languageCode: string) => {
    setIsChanging(true);
    setSelectedLanguage(languageCode);
    
    // Simulate language change
    setTimeout(() => {
      setIsChanging(false);
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
      // Here you would update the app's locale
      document.documentElement.lang = languageCode;
    }, 1000);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 90) return "text-green-600";
    if (completeness >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletenessLabel = (completeness: number) => {
    if (completeness >= 90) return "Excellent";
    if (completeness >= 70) return "Good";
    return "In Progress";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>Language & Region</span>
          </CardTitle>
          <CardDescription>
            Choose your preferred language for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Language */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCurrentLanguage().flag}</span>
                <div>
                  <div className="font-medium">{getCurrentLanguage().name}</div>
                  <div className="text-sm text-muted-foreground">
                    {getCurrentLanguage().nativeName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={getCompletenessColor(getCurrentLanguage().completeness)}>
                  {getCurrentLanguage().completeness}% Complete
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {getCompletenessLabel(getCurrentLanguage().completeness)}
                </div>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Select Language</span>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Auto-detect
              </Button>
            </div>
            
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <span>{getCurrentLanguage().flag}</span>
                    <span>{getCurrentLanguage().name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center space-x-2">
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                      <span className="text-muted-foreground">- {language.nativeName}</span>
                      {language.completeness >= 90 && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Regional Coverage */}
          <div className="space-y-4">
            <h3 className="font-medium">Regional Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regions.map((region) => (
                <Card key={region.name} className="p-4">
                  <div className="font-medium mb-2">{region.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {region.languages.map((langCode) => {
                      const language = languages.find(l => l.code === langCode);
                      return language ? (
                        <Badge
                          key={langCode}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => handleLanguageChange(langCode)}
                        >
                          {language.flag} {language.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Translation Status */}
          <div className="space-y-3">
            <h3 className="font-medium">Translation Status</h3>
            <div className="space-y-2">
              {languages.slice(0, 10).map((language) => (
                <div key={language.code} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <div className="flex items-center space-x-3">
                    <span>{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`text-sm ${getCompletenessColor(language.completeness)}`}>
                      {language.completeness}%
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full transition-all"
                        style={{ width: `${language.completeness}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Features */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Translate className="h-5 w-5 text-blue-600" />
              <span>Language Features</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Real-time translation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cultural adaptations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>RTL language support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Localized date/time formats</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Currency localization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Voice assistance</span>
              </div>
            </div>
          </div>

          {/* Help & Translation */}
          <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-600" />
              <span className="text-sm">Help us improve translations</span>
            </div>
            <Button variant="outline" size="sm" className="text-amber-600 border-amber-600">
              Contribute
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}