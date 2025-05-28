import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Team } from "./components/Team";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { SEO } from "./components/SEO";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import ArtistAvailability from "./components/ArtistAvailability";

// Data
import { services } from "./data/services";
import { teamMembers } from "./data/team";

export type LocationTheme = {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
};

export const themes: Record<"Sun Prairie" | "Waunakee", LocationTheme> = {
  "Sun Prairie": {
    primary: "teal",
    secondary: "teal",
    accent: "teal",
    text: "teal",
  },
  "Waunakee": {
    primary: "tan",
    secondary: "warmGray",
    accent: "amber",
    text: "warmGray",
  },
};


function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState<"Sun Prairie" | "Waunakee">("Sun Prairie");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ clients: 0, experience: 0, satisfaction: 0 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const targetStats = { clients: 1000, experience: 5, satisfaction: 98 };
          const duration = 2000;
          const frames = 60;
          const interval = duration / frames;

          let frame = 0;
          const timer = setInterval(() => {
            frame++;
            const progress = frame / frames;

            setStats({
              clients: Math.round(targetStats.clients * progress),
              experience: Math.round(targetStats.experience * progress),
              satisfaction: Math.round(targetStats.satisfaction * progress),
            });

            if (frame === frames) {
              clearInterval(timer);
            }
          }, interval);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <Router>
      <div className={`min-h-screen bg-white ${location === "Waunakee" ? "theme-waunakee" : "theme-sun-prairie"}`}>
        <SEO location={location} />
        <ToastContainer />
        <div className="fixed-header">
          <Header
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            location={location}
            setLocation={setLocation}
            scrollToSection={scrollToSection}
          />
        </div>

        <Routes>
          {/* Main Home Page */}
          <Route
            path="/"
            element={
              <div className="pt-20">
                <Hero location={location} scrollToSection={scrollToSection} />
                <div ref={statsRef}>
                  <Stats stats={stats} location={location} />
                </div>
                <Team members={teamMembers} location={location} />
                <Services
                  services={services}
                  expandedCategory={expandedCategory}
                  setExpandedCategory={setExpandedCategory}
                  expandedService={expandedService}
                  setExpandedService={setExpandedService}
                  location={location}
                />
                <Gallery location={location} />
                <FAQ />
              </div>
            }
          />

          {/* Artist Availability Page */}
          <Route 
            path="/artist-availability" 
            element={
              <>
                <SEO 
                  title="Book Your Appointment"
                  description="Schedule your lash extension or microblading appointment with our expert artists at J. Lash Studios."
                  location={location}
                />
                <div className="pt-40">
                  <ArtistAvailability />
                </div>
              </>
            } 
          />
        </Routes>

        <Footer location={location} />
      </div>
    </Router>
  );
}

export default App