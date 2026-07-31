import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InteractiveViewer from "./components/InteractiveViewer";
import CaptureMethods from "./components/CaptureMethods";
import BimSlider from "./components/BimSlider";
import RoiCalculator from "./components/RoiCalculator";
import Solutions from "./components/Solutions";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Login from "./components/Login";
import DashboardShell from "./components/DashboardShell";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  if (isLoggedIn) {
    return (
      <DashboardShell
        userEmail={userEmail}
        onSignOut={() => setIsLoggedIn(false)}
      />
    );
  }

  if (showLogin && !isLoggedIn) {
    return (
      <Login
        onLoginSuccess={(email) => {
          setUserEmail(email);
          setIsLoggedIn(true);
          setShowLogin(false);
        }}
        onBackToHome={() => setShowLogin(false)}
      />
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen flex flex-col">
      {/* Sticky Header */}
      <Header
        isLoggedIn={isLoggedIn}
        onSignInClick={() => setShowLogin(true)}
        onSignOut={() => setIsLoggedIn(false)}
      />

      {/* Main Content Layout */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Interactive Viewer Mockup */}
        <InteractiveViewer />

        {/* Tabbed Capture Workflows */}
        <CaptureMethods />

        {/* Side-by-side CAD Slider */}
        <BimSlider />

        {/* Financial ROI Calculator */}
        <RoiCalculator />

        {/* Sector Solutions */}
        <Solutions />

        {/* Quote Testimonials */}
        <Testimonials />
      </main>

      {/* Full Links Footer */}
      <Footer />
    </div>
  );
}
