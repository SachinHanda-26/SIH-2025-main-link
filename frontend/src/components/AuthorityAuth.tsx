import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Building,
  Moon,
  Sun,
  Eye,
  EyeOff,
  AlertTriangle,
  Megaphone
} from 'lucide-react';

interface AuthorityAuthProps {
  onLogin: () => void;
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AuthorityAuth({ onLogin, onBack, theme, onToggleTheme }: AuthorityAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>सफर Suraksha Authority</span>
          </div>

          <Button variant="ghost" size="icon" onClick={onToggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Authority Access</CardTitle>
              <CardDescription>
                Secure login for authorized personnel and emergency responders
              </CardDescription>
              
              <div className="flex justify-center mt-4">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300">
                  🔒 High Security Access
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="authority-id">Authority ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="authority-id"
                      type="text"
                      placeholder="AUTH_ID_XXXX"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      type="text"
                      placeholder="Tourism Board / Police / Emergency Services"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Official Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="official@department.gov.in"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Secure Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your secure password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? 'Authenticating...' : 'Secure Login'}
                </Button>
              </form>

              {/* Security Features */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-center mb-3">Security Features:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Two-Factor Authentication</span>
                    <Badge variant="outline" className="text-xs">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Encrypted Communication</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Activity Logging</span>
                    <Badge variant="outline" className="text-xs">Monitored</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center space-y-2">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Request Access
                </Button>
                <p className="text-xs text-muted-foreground">
                  For official access requests, contact your department administrator
                </p>
              </div>

              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-orange-800 dark:text-orange-300 text-center">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Authorized personnel only. All access is logged and monitored.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Broadcast Alert System */}
          <Card className="mt-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-300 text-lg flex items-center">
                <Megaphone className="h-5 w-5 mr-2" />
                Broadcast Alert System
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-400">
                Send immediate safety alerts to all tourists in your jurisdiction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white mb-3">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Broadcast Emergency Alert
              </Button>
              <p className="text-xs text-orange-600 dark:text-orange-400 text-center">
                Instant notifications to tourists in monitored areas
              </p>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="mt-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-300 text-lg">Emergency Access</CardTitle>
              <CardDescription className="text-red-700 dark:text-red-400">
                For immediate emergency response access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Emergency Login
              </Button>
              <p className="text-xs text-red-600 dark:text-red-400 text-center mt-2">
                Use only during active emergency situations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}