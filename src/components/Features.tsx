import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';

export function Features() {
  const features = [
    { icon: <Star className="w-8 h-8" />, title: 'Premium Products', description: 'We use only the highest quality lash extensions' },
    { icon: <Clock className="w-8 h-8" />, title: 'Flexible Hours', description: 'Open 7 days a week for your convenience' },
    { icon: <MapPin className="w-8 h-8" />, title: 'Prime Location', description: 'Easy to find with plenty of parking' }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-block p-3 bg-teal-100 text-teal-600 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}