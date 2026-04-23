import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

interface TouristAuthProps {
  onLogin: (language: string) => void;
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function TouristAuth({ onLogin, onBack, theme, onToggleTheme }: TouristAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      backToHome: 'Back to Home',
      chooseLanguage: 'Choose Language',
      touristAccess: 'Tourist Access',
      startSafeJourney: 'Start your safe journey across India',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      yourEmail: 'your.email@example.com',
      yourPassword: 'Your password',
      yourName: 'Your full name',
      signingIn: 'Signing In...',
      secureSignIn: 'Secure Sign In',
      forgotPassword: 'Forgot password?',
      creatingAccount: 'Creating Account...',
      createSecureAccount: 'Create Secure Account',
      safetyGuaranteed: 'Your Safety Guaranteed:',
      dataSecurity: 'Data Security',
      liveTracking: 'Live Tracking',
      privacyPolicy: 'By creating an account, you agree to our privacy policy',
      createStrongPassword: 'Create a strong password'
    },
    hi: {
      backToHome: 'होम पर वापस जाएं',
      chooseLanguage: 'भाषा चुनें',
      touristAccess: 'पर्यटक पहुंच',
      startSafeJourney: 'अपनी सुरक्षित यात्रा शुरू करें',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      email: 'ईमेल',
      password: 'पासवर्ड',
      fullName: 'पूरा नाम',
      phoneNumber: 'फोन नंबर',
      yourEmail: 'आपका ईमेल',
      yourPassword: 'आपका पासवर्ड',
      yourName: 'आपका नाम',
      signingIn: 'साइन इन हो रहा है...',
      secureSignIn: 'सुरक्षित साइन इन',
      forgotPassword: 'पासवर्ड भूल गए?',
      creatingAccount: 'खाता बना रहे हैं...',
      createSecureAccount: 'सुरक्षित खाता बनाएं',
      safetyGuaranteed: 'आपकी सुरक्षा की गारंटी:',
      dataSecurity: 'डेटा सुरक्षा',
      liveTracking: 'लाइव ट्रैकिंग',
      privacyPolicy: 'खाता बनाकर आप हमारी गोपनीयता नीति से सहमत हैं',
      createStrongPassword: 'एक मजबूत पासवर्ड बनाएं'
    },
    as: {
      backToHome: 'ঘৰলৈ ঘূৰি যাওক',
      chooseLanguage: 'ভাষা বাছক',
      touristAccess: 'পৰ্যটক প্ৰৱেশ',
      startSafeJourney: 'আপোনাৰ নিৰাপদ যাত্ৰা আৰম্ভ কৰক',
      signIn: 'চাইন ইন',
      signUp: 'চাইন আপ',
      email: 'ইমেইল',
      password: 'পাছৱৰ্ড',
      fullName: 'সম্পূৰ্ণ নাম',
      phoneNumber: 'ফোন নম্বৰ',
      yourEmail: 'আপোনাৰ ইমেইল',
      yourPassword: 'আপোনাৰ পাছৱৰ্ড',
      yourName: 'আপোনাৰ নাম',
      signingIn: 'চাইন ইন কৰি আছে...',
      secureSignIn: 'নিৰাপদ চাইন ইন',
      forgotPassword: 'পাছৱৰ্ড পাহৰিছে?',
      creatingAccount: 'একাউণ্ট সৃষ্টি কৰি আছে...',
      createSecureAccount: 'নিৰাপদ একাউণ্ট সৃষ্টি কৰক',
      safetyGuaranteed: 'আপোনাৰ নিৰাপত্তাৰ নিশ্চয়তা:',
      dataSecurity: 'ডেটা নিৰাপত্তা',
      liveTracking: 'লাইভ ট্ৰেকিং',
      privacyPolicy: 'একাউণ্ট সৃষ্টি কৰি আপুনি আমাৰ গোপনীয়তা নীতিৰ সৈতে সন্মত',
      createStrongPassword: 'এটা শক্তিশালী পাছৱৰ্ড সৃষ্টি কৰক'
    },
    bn: {
      backToHome: 'হোমে ফিরে যান',
      chooseLanguage: 'ভাষা বেছে নিন',
      touristAccess: 'পর্যটক প্রবেশ',
      startSafeJourney: 'আপনার নিরাপদ যাত্রা শুরু করুন',
      signIn: 'সাইন ইন',
      signUp: 'সাইন আপ',
      email: 'ইমেইল',
      password: 'পাসওয়ার্ড',
      fullName: 'পূর্ণ নাম',
      phoneNumber: 'ফোন নম্বর',
      yourEmail: 'আপনার ইমেইল',
      yourPassword: 'আপনার পাসওয়ার্ড',
      yourName: 'আপনার নাম',
      signingIn: 'সাইন ইন করছে...',
      secureSignIn: 'নিরাপদ সাইন ইন',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
      creatingAccount: 'অ্যাকাউন্ট তৈরি করছে...',
      createSecureAccount: 'নিরাপদ অ্যাকাউন্ট তৈরি করুন',
      safetyGuaranteed: 'আপনার নিরাপত্তার গ্যারান্টি:',
      dataSecurity: 'ডেটা নিরাপত্তা',
      liveTracking: 'লাইভ ট্র্যাকিং',
      privacyPolicy: 'অ্যাকাউন্ট তৈরি করে আপনি আমাদের গোপনীয়তা নীতির সাথে সম্মত',
      createStrongPassword: 'একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন'
    },
    mni: {
      backToHome: 'য়ুমদা হল্লক্উ',
      chooseLanguage: 'লোল খনবিয়ু',
      touristAccess: 'ট্যুরিস্ট এক্সেস',
      startSafeJourney: 'নহাক্কি নিংথিনা চত্থরিবা লাম্বি হৌরক্উ',
      signIn: 'সাইন ইন',
      signUp: 'সাইন আপ',
      email: 'ইমেইল',
      password: 'পাসওয়ার্ড',
      fullName: 'মপুং ফাবা মিং',
      phoneNumber: 'ফোন নম্বর',
      yourEmail: 'নহাক্কি ইমেইল',
      yourPassword: 'নহাক্কি পাসওয়ার্ড',
      yourName: 'নহাক্কি মিং',
      signingIn: 'সাইন ইন তৌরি...',
      secureSignIn: 'নিংথিনা সাইন ইন',
      forgotPassword: 'পাসওয়ার্ড মংখ্রে?',
      creatingAccount: 'একাউন্ট শেমগত্লি...',
      createSecureAccount: 'নিংথিনা একাউন্ট শেমগৎকদবনি',
      safetyGuaranteed: 'নহাক্কি নিংথিনা লৈবা:',
      dataSecurity: 'ডেটা নিংথিনা',
      liveTracking: 'লাইভ ট্র্যাকিং',
      privacyPolicy: 'একাউন্ট শেমগৎলগা ঐখোয়গি প্রাইভেসি পলিসিদা পুম্নমক',
      createStrongPassword: 'অমত্তা পাসওয়ার্ড শেমগৎউ'
    },
    gu: {
      backToHome: 'ઘર પાછા જાઓ',
      chooseLanguage: 'ભાષા પસંદ કરો',
      touristAccess: 'પ્રવાસી ઍક્સેસ',
      startSafeJourney: 'તમારી સુરક્ષિત યાત્રા શરૂ કરો',
      signIn: 'સાઇન ઇન',
      signUp: 'સાઇન અપ',
      email: 'ઇમેઇલ',
      password: 'પાસવર્ડ',
      fullName: 'પૂર્ણ નામ',
      phoneNumber: 'ફોન નંબર',
      yourEmail: 'તમારો ઇમેઇલ',
      yourPassword: 'તમારો પાસવર્ડ',
      yourName: 'તમારું નામ',
      signingIn: 'સાઇન ઇન થઈ રહ્યું છે...',
      secureSignIn: 'સુરક્ષિત સાઇન ઇન',
      forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
      creatingAccount: 'એકાઉન્ટ બનાવાઈ રહ્યું છે...',
      createSecureAccount: 'સુરક્ષિત એકાઉન્ટ બનાવો',
      safetyGuaranteed: 'તમારી સુરક્ષાની ગેરંટી:',
      dataSecurity: 'ડેટા સુરક્ષા',
      liveTracking: 'લાઇવ ટ્રેકિંગ',
      privacyPolicy: 'એકાઉન્ટ બનાવીને તમે અમારી ગોપનીયતા નીતિ સાથે સહમત છો',
      createStrongPassword: 'મજબૂત પાસવર્ડ બનાવો'
    },
    pa: {
      backToHome: 'ਘਰ ਵਾਪਸ ਜਾਓ',
      chooseLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
      touristAccess: 'ਸੈਲਾਨੀ ਪਹੁੰਚ',
      startSafeJourney: 'ਆਪਣੀ ਸੁਰੱਖਿਅਤ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ',
      signIn: 'ਸਾਈਨ ਇਨ',
      signUp: 'ਸਾਈਨ ਅੱਪ',
      email: 'ਈਮੇਲ',
      password: 'ਪਾਸਵਰਡ',
      fullName: 'ਪੂਰਾ ਨਾਮ',
      phoneNumber: 'ਫ਼ੋਨ ਨੰਬਰ',
      yourEmail: 'ਤੁਹਾਡਾ ਈਮੇਲ',
      yourPassword: 'ਤੁਹਾਡਾ ਪਾਸਵਰਡ',
      yourName: 'ਤੁਹਾਡਾ ਨਾਮ',
      signingIn: 'ਸਾਈਨ ਇਨ ਹੋ ਰਿਹਾ ਹੈ...',
      secureSignIn: 'ਸੁਰੱਖਿਅਤ ਸਾਈਨ ਇਨ',
      forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
      creatingAccount: 'ਖਾਤਾ ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...',
      createSecureAccount: 'ਸੁਰੱਖਿਅਤ ਖਾਤਾ ਬਣਾਓ',
      safetyGuaranteed: 'ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਦੀ ਗਾਰੰਟੀ:',
      dataSecurity: 'ਡੇਟਾ ਸੁਰੱਖਿਆ',
      liveTracking: 'ਲਾਈਵ ਟਰੈਕਿੰਗ',
      privacyPolicy: 'ਖਾਤਾ ਬਣਾ ਕੇ ਤੁਸੀਂ ਸਾਡੀ ਗੋਪਨੀਯਤਾ ਨੀਤੀ ਨਾਲ ਸਹਿਮਤ ਹੋ',
      createStrongPassword: 'ਇੱਕ ਮਜ਼ਬੂਤ ਪਾਸਵਰਡ ਬਣਾਓ'
    },
    es: {
      backToHome: 'Volver al inicio',
      chooseLanguage: 'Elegir idioma',
      touristAccess: 'Acceso de turistas',
      startSafeJourney: 'Comienza tu viaje seguro por India',
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      fullName: 'Nombre completo',
      phoneNumber: 'Número de teléfono',
      yourEmail: 'tu.correo@ejemplo.com',
      yourPassword: 'Tu contraseña',
      yourName: 'Tu nombre completo',
      signingIn: 'Iniciando sesión...',
      secureSignIn: 'Inicio de sesión seguro',
      forgotPassword: '¿Olvidaste tu contraseña?',
      creatingAccount: 'Creando cuenta...',
      createSecureAccount: 'Crear cuenta segura',
      safetyGuaranteed: 'Tu seguridad garantizada:',
      dataSecurity: 'Seguridad de datos',
      liveTracking: 'Seguimiento en vivo',
      privacyPolicy: 'Al crear una cuenta, aceptas nuestra política de privacidad',
      createStrongPassword: 'Crea una contraseña fuerte'
    },
    fr: {
      backToHome: 'Retour à l\'accueil',
      chooseLanguage: 'Choisir la langue',
      touristAccess: 'Accès touristique',
      startSafeJourney: 'Commencez votre voyage sécurisé en Inde',
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      email: 'Email',
      password: 'Mot de passe',
      fullName: 'Nom complet',
      phoneNumber: 'Numéro de téléphone',
      yourEmail: 'votre.email@exemple.com',
      yourPassword: 'Votre mot de passe',
      yourName: 'Votre nom complet',
      signingIn: 'Connexion en cours...',
      secureSignIn: 'Connexion sécurisée',
      forgotPassword: 'Mot de passe oublié?',
      creatingAccount: 'Création du compte...',
      createSecureAccount: 'Créer un compte sécurisé',
      safetyGuaranteed: 'Votre sécurité garantie:',
      dataSecurity: 'Sécurité des données',
      liveTracking: 'Suivi en direct',
      privacyPolicy: 'En créant un compte, vous acceptez notre politique de confidentialité',
      createStrongPassword: 'Créez un mot de passe fort'
    }
  };

  const t = (key: string) => translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']] || translations.en[key as keyof typeof translations['en']];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(language);
    }, 1500);
  };

  const languages = [
    { code: 'en', name: 'English', label: 'English' },
    { code: 'hi', name: 'हिंदी', label: 'Hindi' },
    { code: 'as', name: 'অসমীয়া', label: 'Assamese' },
    { code: 'bn', name: 'বাংলা', label: 'Bengali' },
    { code: 'mni', name: 'মৈতৈলোন্', label: 'Manipuri' },
    { code: 'gu', name: 'ગુજરાતી', label: 'Gujarati' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', label: 'Punjabi' },
    { code: 'es', name: 'Español', label: 'Spanish' },
    { code: 'fr', name: 'Français', label: 'French' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <span>सफर Suraksha</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onToggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Language Selection */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-orange-500 mr-2" />
                <CardTitle>{t('chooseLanguage')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage(lang.code)}
                    className="text-xs p-2 h-auto"
                  >
                    <div className="text-center">
                      <div className="font-semibold">{lang.name}</div>
                      <div className="text-xs opacity-70">{lang.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('touristAccess')}</CardTitle>
              <CardDescription>
                {t('startSafeJourney')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">
                    {t('signIn')}
                  </TabsTrigger>
                  <TabsTrigger value="signup">
                    {t('signUp')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t('email')}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('yourEmail')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {t('password')}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={t('yourPassword')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                      {isLoading ? t('signingIn') : t('secureSignIn')}
                    </Button>
                  </form>
                  
                  <div className="text-center">
                    <Button variant="link" className="text-sm text-muted-foreground">
                      {t('forgotPassword')}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {t('fullName')}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder={t('yourName')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t('phoneNumber')}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">
                        {t('email')}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder={t('yourEmail')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">
                        {t('password')}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder={t('createStrongPassword')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                      {isLoading ? t('creatingAccount') : t('createSecureAccount')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Safety Features */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-center mb-3">
                  {t('safetyGuaranteed')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="text-xs justify-center">
                    <Shield className="h-3 w-3 mr-1" />
                    {t('dataSecurity')}
                  </Badge>
                  <Badge variant="outline" className="text-xs justify-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {t('liveTracking')}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {t('privacyPolicy')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}