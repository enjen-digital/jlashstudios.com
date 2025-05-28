import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/api_url';

interface HeroProps {
  location: 'Sun Prairie' | 'Waunakee';
  scrollToSection: (id: string) => void;
}

interface HeroApiResponse {
  status: boolean;
  data: {
    id: number;
    file: string;
    created_at: string;
    updated_at: string;
  }[];
}


export function Hero({ location, scrollToSection }: HeroProps) {
  const [heroImage, setHeroImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await axios.get<HeroApiResponse>(`${API_BASE_URL}/api/hero-sections`);
        
        if (response.data.status && response.data.data.length > 0) {
          const matchedImage = response.data.data.find(
            (item) => item.salon.name === location
          );
          if (matchedImage) {
            setHeroImage(matchedImage.file); 
          } else {
            setHeroImage(response.data.data[0].file);
          }
        }
      } catch (error) {
        console.error('Error fetching hero image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImage();
  }, [location]);
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
  const backgroundImage = heroImage || (location === 'Waunakee' ? '/images/brow.jpg' : '/images/hero.jpg');


  const heroContent = location === 'Waunakee' ? {
    title: "Transform Your Look With Perfect Brows",
    subtitle: "Experience the art of microblading and permanent makeup"
  } : {
    title: "Elevate Your Beauty With Perfect Lashes",
    subtitle: "Experience luxury lash treatments that enhance your natural beauty!"
  };

  return (
    <section id="home" className="relative h-screen">
      <img 
        src={backgroundImage}
        alt="Beautiful eye with long lashes"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-black/60">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{heroContent.title}</h1>
            <p className="text-xl mb-8 text-theme-accent">{heroContent.subtitle}</p>
            {/* <button 
              onClick={() => scrollToSection('services')}
              className="bg-theme-primary text-white px-8 py-3 rounded-full hover:bg-theme-primary-hover transition-colors"
            >
              Book Now
            </button> */}
             <button
              onClick={() => handleButtonClickTemp()}
              className="bg-theme-primary text-white px-6 py-2 rounded-full hover:bg-theme-primary-hover transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
