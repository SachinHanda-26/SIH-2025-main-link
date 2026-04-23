import React, { createContext, useContext, useState } from 'react';

interface Language {
  code: string;
  name: string;
  label: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  languages: Language[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languages: Language[] = [
  { code: 'en', name: 'English', label: 'English' },
  { code: 'hi', name: 'हिंदी', label: 'Hindi' },
  { code: 'as', name: 'অসমীয়া', label: 'Assamese' },
  { code: 'bn', name: 'বাংলা', label: 'Bengali' },
  { code: 'mni', name: 'মৈতৈলোন্', label: 'Manipuri' },
  { code: 'brx', name: 'बड़ो', label: 'Bodo' },
  { code: 'ne', name: 'नेपाली', label: 'Nepali' },
  { code: 'ta', name: 'தமிழ்', label: 'Tamil' },
  { code: 'te', name: 'తెలుగు', label: 'Telugu' },
  { code: 'gu', name: 'ગુજરાતી', label: 'Gujarati' },
  { code: 'kn', name: 'ಕನ್ನಡ', label: 'Kannada' },
  { code: 'ml', name: 'മലയാളം', label: 'Malayalam' },
  { code: 'mr', name: 'मराठी', label: 'Marathi' },
  { code: 'or', name: 'ଓଡ଼ିଆ', label: 'Odia' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', label: 'Punjabi' }
];

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'सफर Suraksha',
    'app.subtitle': 'Smart Safety Monitoring',
    'nav.contact': 'Contact',
    'nav.tourist.login': 'Tourist Login',
    'nav.authority.login': 'Authority Login',
    'hero.tagline': 'Experience India Safely - Made for Incredible India',
    'hero.description': 'Experience India safely with AI-powered monitoring, real-time alerts, and instant emergency response. From ancient temples to modern cities, explore India with confidence. Your security is our priority, from the Himalayas to the beaches of Goa.',
    'button.start.journey': 'Start Your Safe Journey',
    'button.authority.access': 'Authority Access',
    'emergency.title': 'Emergency Assistance',
    'emergency.description': 'Instant alert to authorities with your location',
    'emergency.button': 'SOS',
    'emergency.alert': '🚨 EMERGENCY ALERT SENT! Authorities have been notified of your location. Stay calm and follow safety instructions. Help is on the way!',
    'auth.choose.language': 'Choose Language',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Full Name',
    'auth.phone': 'Phone Number',
    'map.safe.zone': 'Safe Zone',
    'map.restricted': 'Restricted',
    'map.your.location': 'Your Location',
    'map.attractions': 'Attractions'
  },
  hi: {
    'app.title': 'सफर सुरक्षा',
    'app.subtitle': 'स्मार्ट सुरक्षा निगरानी',
    'nav.contact': 'संपर्क',
    'nav.tourist.login': 'पर्यटक लॉगिन',
    'nav.authority.login': 'प्राधिकरण लॉगिन',
    'hero.tagline': 'भारत की सुरक्षित यात्रा - अविश्वसनीय भारत के लिए बनाया गया',
    'hero.description': 'AI-संचालित निगरानी, रीयल-टाइम अलर्ट और तत्काल आपातकालीन प्रतिक्रिया के साथ भारत की सुरक्षित यात्रा करें। प्राचीन मंदिरों से लेकर आधुनिक शहरों तक, आत्मविश्वास के साथ भारत का अन्वेषण करें।',
    'button.start.journey': 'अपनी सुरक्षित यात्रा शुरू करें',
    'button.authority.access': 'प्राधिकरण पहुंच',
    'emergency.title': 'आपातकालीन सहायता',
    'emergency.description': 'अपने स्थान के साथ अधिकारियों को तत्काल अलर्ट',
    'emergency.button': 'SOS',
    'emergency.alert': '🚨 आपातकालीन अलर्ट भेजा गया! अधिकारियों को आपके स्थान की जानकारी दे दी गई है। शांत रहें और सुरक्षा निर्देशों का पालन करें। मदद आ रही है!',
    'auth.choose.language': 'भाषा चुनें',
    'auth.signin': 'साइन इन',
    'auth.signup': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullname': 'पूरा नाम',
    'auth.phone': 'फोन नंबर',
    'map.safe.zone': 'सुरक्षित क्षेत्र',
    'map.restricted': 'प्रतिबंधित',
    'map.your.location': 'आपका स्थान',
    'map.attractions': 'आकर्षण'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}