import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { TouristAuth } from "./components/TouristAuth";
import { AuthorityAuth } from "./components/AuthorityAuth";
import { TouristDashboard } from "./components/TouristDashboard";
import { AuthorityDashboard } from "./components/AuthorityDashboard";
import { ContactPage } from "./components/ContactPage";
import { MeshNetworkPage } from "./components/MeshNetworkPage";
import { BlockchainPage } from "./components/BlockchainPage";

type UserType = "tourist" | "authority" | null;
type Page =
  | "landing"
  | "tourist-auth"
  | "authority-auth"
  | "tourist-dashboard"
  | "authority-dashboard"
  | "contact"
  | "blockchain"
  | "mesh-network";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [, setUserType] = useState<UserType>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  const handleLogin = (type: UserType, language?: string) => {
    setUserType(type);
    if (language) {
      setSelectedLanguage(language);
    }
    if (type === "tourist") {
      setCurrentPage("tourist-dashboard");
    } else if (type === "authority") {
      setCurrentPage("authority-dashboard");
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentPage("landing");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage
            onNavigate={(page: string) => setCurrentPage(page as Page)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case "tourist-auth":
        return (
          <TouristAuth
            onLogin={(language) => handleLogin("tourist", language)}
            onBack={() => setCurrentPage("landing")}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case "authority-auth":
        return (
          <AuthorityAuth
            onLogin={() => handleLogin("authority")}
            onBack={() => setCurrentPage("landing")}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case "tourist-dashboard":
        return (
          <TouristDashboard
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
            language={selectedLanguage}
          />
        );
      case "authority-dashboard":
        return (
          <AuthorityDashboard
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
            onNavigate={(page: string) => setCurrentPage(page as Page)}
          />
        );
      case "contact":
        return (
          <ContactPage
            onBack={() => setCurrentPage("landing")}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case "blockchain":
        return (
          <BlockchainPage
            onBack={() => setCurrentPage("authority-dashboard")}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );

      case "mesh-network":
        return (
          <MeshNetworkPage
            onBack={() => setCurrentPage("authority-dashboard")}
          />
        );

      default:
        return (
          <LandingPage
            onNavigate={(page: string) => setCurrentPage(page as Page)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {renderPage()}
    </div>
  );
}
