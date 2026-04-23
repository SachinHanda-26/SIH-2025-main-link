import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Moon,
  Sun,
  Shield,
  Users,
  AlertTriangle,
  Globe,
  MessageSquare,
  Send,
  CheckCircle
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function ContactPage({ onBack, theme, onToggleTheme }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-500" />
              <span>सफर Suraksha</span>
            </div>

            <Button variant="ghost" size="icon" onClick={onToggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="bg-green-100 dark:bg-green-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Message Sent Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting us. Our support team will get back to you within 24 hours.
              </p>
              <div className="space-y-3">
                <Button onClick={onBack} className="w-full">
                  Return to Home
                </Button>
                <p className="text-sm text-muted-foreground">
                  For urgent matters, please call our 24/7 emergency helpline: 
                  <strong className="block mt-1">📞 +91-1363 (Tourist Helpline)</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <span>सफर Suraksha</span>
          </div>

          <Button variant="ghost" size="icon" onClick={onToggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-6">Contact & Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help with your safe journey in India? Our 24/7 support team is here to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md bg-background"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="emergency">Emergency Support</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your inquiry in detail..."
                    className="min-h-32"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-300 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-400">
                  For immediate assistance and emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold">Police Emergency</p>
                    <p className="text-sm">100</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold">Tourist Helpline</p>
                    <p className="text-sm">1363</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold">Medical Emergency</p>
                    <p className="text-sm">108</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Support Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@suraksha-tourist.gov.in</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+91-11-2336-5678</p>
                    <p className="text-xs text-muted-foreground">Mon-Sun, 9:00 AM - 9:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Office Address</p>
                    <p className="text-sm text-muted-foreground">
                      Ministry of Tourism, Government of India<br />
                      Transport Bhawan, 1, Parliament Street<br />
                      New Delhi - 110001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold">Response Times</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Emergency: Immediate</p>
                      <p>• Urgent: Within 2 hours</p>
                      <p>• General: Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Language Support
                </CardTitle>
                <CardDescription>
                  We provide support in multiple Indian languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['English', 'हिंदी', 'অসমীয়া', 'বাংলা', 'मैतैलोन्', 'बड़ो', 'नेपाली', 'ಕನ್ನಡ'].map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    +7 more
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Our multilingual support team ensures clear communication for all tourists visiting India, with special focus on North-East Indian languages.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm group-open:text-orange-600">
                    How does the safety monitoring work?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    Our AI-powered system continuously monitors your location, weather conditions, and local safety conditions to provide real-time alerts and assistance.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm group-open:text-orange-600">
                    Is my location data secure?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    Yes, all location data is encrypted using blockchain technology and only used for safety purposes. Your privacy is our priority.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-sm group-open:text-orange-600">
                    What languages are supported?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    We support 15+ Indian languages including Hindi, Assamese, Bengali, Manipuri, Bodo, Nepali, and English with special focus on North-East Indian languages for comprehensive assistance.
                  </p>
                </details>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}