// import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Map, 
  Brain, 
  Lock, 
  MapPin, 
  Users, 
  Phone, 
  Moon, 
  Sun,
  Heart,
  Globe,
  Zap
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LandingPage({ onNavigate, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
              <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Panic Alert</h1>
              <p className="text-xs text-muted-foreground">Smart Safety Monitoring</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('contact')} className="flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-950/20">
              <Phone className="h-4 w-4" />
              Contact
            </Button>
            <Button onClick={() => onNavigate('tourist-auth')} className="bg-orange-600 hover:bg-orange-700 shadow-sm transition-all hover:shadow">
              Tourist Login
            </Button>
            <Button variant="outline" onClick={() => onNavigate('authority-auth')} className="border-orange-200 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-900 dark:hover:bg-orange-950/20 transition-all">
              Authority Login
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggleTheme} className="rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onToggleTheme} className="rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button size="sm" onClick={() => onNavigate('tourist-auth')} className="bg-orange-600 hover:bg-orange-700 shadow-sm transition-all hover:shadow">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with Merged Experience Content */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-300/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 px-4 py-1.5 text-sm shadow-sm">
            🇮🇳 Experience India Safely - Made for Incredible India
          </Badge>
          <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-bold">
            Panic Alert
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience India safely with AI-powered monitoring, real-time alerts, and instant emergency response. 
            From ancient temples to modern cities, explore India with confidence. Your security is our priority, 
            from the Himalayas to the beaches of Goa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => onNavigate('tourist-auth')} className="bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all">
              <MapPin className="mr-2 h-5 w-5" />
              Start Your Safe Journey
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('authority-auth')} className="border-orange-200 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-900 dark:hover:bg-orange-950/20 transition-all">
              <Shield className="mr-2 h-5 w-5" />
              Authority Access
            </Button>
          </div>

          {/* Enhanced Statistics and Experience Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">10K+</p>
              <p className="text-sm font-medium text-muted-foreground">Safe Tourists</p>
            </div>
            <div className="text-center bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">500+</p>
              <p className="text-sm font-medium text-muted-foreground">Monitored Zones</p>
            </div>
            <div className="text-center bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24/7</p>
              <p className="text-sm font-medium text-muted-foreground">AI Monitoring</p>
            </div>
            <div className="text-center bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">15+</p>
              <p className="text-sm font-medium text-muted-foreground">Languages</p>
            </div>
          </div>

          {/* Integrated Experience Preview */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/30 rounded-full p-3 mr-4 shadow-inner">
                  <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Sacred Experiences</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visit temples and heritage sites with cultural guidance, safety alerts, and real-time crowd monitoring for authentic spiritual experiences.
              </p>
              <div className="mt-4 pt-3 border-t border-orange-100 dark:border-orange-900/30 flex justify-end">
                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">Popular Choice</Badge>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/30 rounded-full p-3 mr-4 shadow-inner">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vibrant Markets</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Navigate bustling bazaars with real-time crowd monitoring, safety tips, and cultural insights for safe shopping adventures.
              </p>
              <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/30 flex justify-end">
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">Trending</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the System */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-6">About Panic Alert System</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A revolutionary safety platform combining ancient Indian wisdom of hospitality 
              with cutting-edge technology to protect and guide tourists across Bharat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1741687290557-052d0e9c37bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGdhdGUlMjBtb251bWVudCUyMHRvdXJpc218ZW58MXx8fHwxNzU3NTIzMjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="India Gate Monument"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
            <div className="space-y-6">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-3 h-6 w-6 text-orange-500" />
                    Complete Safety Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From bustling markets of Old Delhi to serene backwaters of Kerala, 
                    our system ensures your safety across all of India's diverse landscapes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Map className="mr-3 h-6 w-6 text-blue-500" />
                    Real-time Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Live tracking with geo-fencing technology that understands local conditions, 
                    weather patterns, and cultural events across different states.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-3 h-6 w-6 text-green-500" />
                    Cultural Sensitivity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Multilingual support and culturally aware recommendations that respect 
                    local traditions while ensuring tourist safety and authentic experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Highlights */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-6">Core Technologies</h2>
            <p className="text-lg text-muted-foreground">
              Powered by cutting-edge technology for unmatched safety and experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <CardHeader>
                <CardTitle>24/7 AI Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced machine learning algorithms continuously analyze location data, 
                  weather patterns, and local conditions to predict and prevent risks.
                </p>
                <ul className="mt-4 text-sm space-y-2 text-left">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    Predictive risk analysis
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    Real-time threat detection
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    Automated emergency alerts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Smart Geo-Fencing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dynamic virtual boundaries that adapt to local conditions, events, 
                  and real-time safety data across India's diverse geography.
                </p>
                <ul className="mt-4 text-sm space-y-2 text-left">
                  <li className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                    Dynamic safe zones
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                    Cultural event awareness
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                    Weather-based adjustments
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <CardHeader>
                <CardTitle>Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Immutable security records and decentralized emergency response 
                  ensuring data integrity and rapid assistance coordination.
                </p>
                <ul className="mt-4 text-sm space-y-2 text-left">
                  <li className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    Encrypted location data
                  </li>
                  <li className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    Tamper-proof logs
                  </li>
                  <li className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    Decentralized emergency response
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-6">Ready for Your Safe Indian Adventure?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of travelers who explore India with confidence using our smart safety platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => onNavigate('tourist-auth')}>
              <MapPin className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('contact')} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Phone className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-orange-500" />
                <span>Panic Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart safety monitoring for incredible India experiences
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto" onClick={() => onNavigate('tourist-auth')}>Tourist Login</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => onNavigate('authority-auth')}>Authority Access</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => onNavigate('contact')}>Contact Support</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>24/7 AI Monitoring</li>
                <li>Smart Geo-fencing</li>
                <li>Emergency Response</li>
                <li>Cultural Guidance</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Languages</h4>
              <div className="flex flex-wrap gap-1">
                {['English', 'हिंदी', 'অসমীয়া', 'বাংলা', 'মৈতৈলোন্', 'बड़ो', 'नेपाली', 'ಕನ್ನಡ'].map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  +7 more
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Panic Alert Safety System. Made with ❤️ for Incredible India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
