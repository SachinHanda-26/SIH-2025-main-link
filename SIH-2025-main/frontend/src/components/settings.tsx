import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { ArrowLeft, Globe, Moon, Sun, Bell, Shield } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export function Settings({ onBack, theme, onToggleTheme, language, onLanguageChange }: SettingsProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">SafarSuraksha Settings</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Language Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>English</span>
                <Switch 
                  checked={language === 'en'} 
                  onCheckedChange={() => onLanguageChange('en')}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>हिंदी (Hindi)</span>
                <Switch 
                  checked={language === 'hi'} 
                  onCheckedChange={() => onLanguageChange('hi')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {theme === 'light' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={onToggleTheme}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
