import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTelegram } from "@/hooks/use-telegram";

import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Inventory from "@/pages/inventory";
import Friends from "@/pages/friends";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const { isLoading } = useTelegram();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h1 className="text-2xl font-display font-bold mb-2">CryptoQuest</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    const props = { activeTab, onNavigate: setActiveTab };
    
    switch (activeTab) {
      case "home":
        return <Home {...props} />;
      case "shop":
        return <Shop {...props} />;
      case "inventory":
        return <Inventory {...props} />;
      case "friends":
        return <Friends {...props} />;
      case "profile":
        return <Profile {...props} />;
      default:
        return <NotFound />;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      {renderPage()}
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
