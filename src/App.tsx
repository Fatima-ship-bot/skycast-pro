import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import SplashScreen from "@/components/SplashScreen";
import Loader from "@/components/Loader";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

// Lazy load heavy pages for code splitting
const Forecast = lazy(() => import("./pages/Forecast"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Compare = lazy(() => import("./pages/Comparisons"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  const [splash, setSplash] = useState(true);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {splash && <SplashScreen onDone={() => setSplash(false)} />}
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<AppShell />}>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/forecast"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Forecast />
                    </Suspense>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Favorites />
                    </Suspense>
                  }
                />
                <Route
                  path="/compare"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Compare />
                    </Suspense>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Alerts />
                    </Suspense>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Recommendations />
                    </Suspense>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Settings />
                    </Suspense>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<Loader />}>
                      <About />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<Loader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
