import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float-slow -z-10" />
      <div className="pointer-events-none fixed top-1/3 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float-slow -z-10" style={{ animationDelay: "4s" }} />
      <div className="pointer-events-none fixed bottom-0 left-1/3 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl animate-float-slow -z-10" style={{ animationDelay: "8s" }} />

      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
