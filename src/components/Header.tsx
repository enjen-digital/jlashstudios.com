import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  location: 'Sun Prairie' | 'Waunakee';
  setLocation: (location: 'Sun Prairie' | 'Waunakee') => void;
  scrollToSection: (id: string) => void;
}

const LocationToggle = ({ location, setLocation, className = '' }: {
  location: 'Sun Prairie' | 'Waunakee';
  setLocation: (location: 'Sun Prairie' | 'Waunakee') => void;
  className?: string;
}) => (
  <div className="flex flex-col items-center">
    <div className={`flex items-center space-x-1 text-sm ${className}`}>
      <button
        onClick={() => setLocation('Sun Prairie')}
        className={`px-2 py-1 rounded-l-full whitespace-nowrap transition-colors ${
          location === 'Sun Prairie'
            ? 'bg-theme-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Sun Prairie
      </button>
      <button
        onClick={() => setLocation('Waunakee')}
        className={`px-2 py-1 rounded-r-full transition-colors ${
          location === 'Waunakee'
            ? 'bg-theme-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Waunakee
      </button>
    </div>
    <div className="text-theme-primary text-sm font-medium animate-[pulse-opacity_2s_ease-in-out_infinite] mt-1 hidden md:block">
      Booking for {location}
    </div>
  </div>
);

export function Header({ isMenuOpen, setIsMenuOpen, location, setLocation, scrollToSection }: HeaderProps) {
  //temp conditiion
  const handleButtonClickTemp = () => {
    console.log(location); // Ensure this logs the expected value

    if (location.includes("Sun Prairie")) {
      window.open("https://www.vagaro.com/jlashstudios/book-now", "_blank");
    } else if (location.includes("Waunakee")) {
      window.open("https://www.vagaro.com/jlashstudios-waunakee/book-now", "_blank");
    } else {
      window.location.href = "/"; // Internal navigation to home
    }
  };
  //temp conditiion

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <img 
              src="/images/jlash logo no background.png" 
              alt="J. Lash Studios Logo" 
              className={`h-16 w-auto object-contain cursor-pointer transition-all duration-300 ${
                location === 'Sun Prairie' 
                  ? 'hue-rotate-[330deg] brightness-75'
                  : 'hue-rotate-[180deg]'
              }`}
              onClick={() => scrollToSection('home')}
            />
            <LocationToggle 
              location={location} 
              setLocation={setLocation} 
              className="hidden md:flex" 
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-theme-primary transition-colors">Home</button>
            <button onClick={() => scrollToSection('team')} className="text-gray-700 hover:text-theme-primary transition-colors">Our Team</button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-theme-primary transition-colors">Services</button>
            <button onClick={() => scrollToSection('gallery')} className="text-gray-700 hover:text-theme-primary transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-theme-primary transition-colors">FAQ</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-theme-primary transition-colors">Contact</button>
          </nav>

          <div className="hidden md:block">
            <button 
              onClick={() => handleButtonClickTemp()}
              className="bg-theme-primary text-white px-6 py-2 rounded-full hover:bg-theme-primary-hover transition-colors"
            >
              Book Now
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <LocationToggle 
              location={location} 
              setLocation={setLocation}
              className="scale-90" 
            />
            <button 
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <div 
              className="text-theme-primary text-sm font-medium mb-4 animate-[pulse-opacity_2s_ease-in-out_infinite]"
            >
              Booking for {location}
            </div>
            <nav className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-theme-primary transition-colors py-2">Home</button>
              <button onClick={() => scrollToSection('team')} className="text-left text-gray-700 hover:text-theme-primary transition-colors py-2">Our Team</button>
              <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-theme-primary transition-colors py-2">Services</button>
              <button onClick={() => scrollToSection('gallery')} className="text-left text-gray-700 hover:text-theme-primary transition-colors py-2">Gallery</button>
              <button onClick={() => scrollToSection('faq')} className="text-left text-gray-700 hover:text-theme-primary transition-colors py-2">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-theme-primary transition-colors py-2">Contact</button>
              <button
                onClick={() => handleButtonClickTemp()}
                className="w-full bg-theme-primary text-white px-6 py-2 rounded-full hover:bg-theme-primary-hover transition-colors mt-2"
              >
                Book Now
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}