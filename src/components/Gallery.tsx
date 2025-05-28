import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import API_BASE_URL from '../utils/api_url';

interface GalleryImage {
  file: string;
}

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/galleries`);
        if (response.data.data && Array.isArray(response.data.data)) {
          setGalleryImages(response?.data?.data);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };

    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || galleryImages.length === 0) return;

    const originalContent = scrollContainer.innerHTML;
    scrollContainer.innerHTML = originalContent + originalContent;

    const scroll = () => {
      if (!scrollContainer) return;

      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.style.scrollBehavior = 'auto';
        scrollContainer.scrollLeft = 0;
        void scrollContainer.offsetHeight;
        scrollContainer.style.scrollBehavior = 'smooth';
      }

      scrollContainer.scrollLeft += 1;

      animationFrameId.current = requestAnimationFrame(scroll);
    };

    animationFrameId.current = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [galleryImages]);

  return (
    <section id="gallery" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Gallery</h2>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
            {galleryImages?.map((image, index) => (
              <div 
                key={index} 
                className="flex-none w-80 h-96 relative rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105"
              >
                <img
                  src={image?.file}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}