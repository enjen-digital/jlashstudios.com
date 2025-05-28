import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Clock, Star } from "lucide-react";
import { toast } from "react-toastify";
import API_BASE_URL from '../utils/api_url';
import { useNavigate } from "react-router-dom";

interface ServiceItem {
  title: string;
  basePrice: number;
  description: string;
  image: string;
  duration: string;
  maintenance: string;
}

interface ServiceCategory {
  category: string;
  items: ServiceItem[];
}

interface ServicesProps {
  services?: ServiceCategory[];
  expandedCategory: string | null;
  setExpandedCategory: (category: string | null) => void;
  expandedService: string | null;
  setExpandedService: (service: string | null) => void;
  location: "Sun Prairie" | "Waunakee";
}

export function Services({
  services: staticServices,
  expandedCategory,
  setExpandedCategory,
  expandedService,
  setExpandedService,
  location,
}: ServicesProps) {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/services`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        const transformedData = transformApiData(data.data);
        setServices(transformedData);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to fetch services. Using static data as fallback.");
        if (staticServices) {
          setServices(staticServices);
        }
      } finally {
        setApiLoading(false);
      }
    };

    fetchServices();
  }, [staticServices]);

  const transformApiData = (apiData: any[]): ServiceCategory[] => {
    const categoryMap: { [key: string]: ServiceCategory } = {};

    apiData.forEach((service) => {
      const categoryName = service.category.name;
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = {
          category: categoryName,
          items: [],
        };
      }

      categoryMap[categoryName].items.push({
        title: service.name,
        basePrice: parseFloat(service.price),
        description: service.note.replace(/<[^>]+>/g, ""), 
        image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80",
        duration: service.time,
        maintenance: service.maintanance,
      });
    });

    return Object.values(categoryMap);
  };

  const handleBookingClick = (
    serviceTitle: string,
    servicePrice: number,
    serviceDuration: string
  ) => {
    navigate(`/artist-availability`, {
      state: {
        serviceTitle,
        servicePrice,
        serviceDuration,
        location,
      },
    });
  };

  if (apiLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-16">Our Services</h2>
      <div className="px-4 max-w-4xl mx-auto space-y-4">
        {services.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 flex items-center justify-between bg-theme-secondary hover:bg-theme-accent/50 transition-colors"
              onClick={() =>
                setExpandedCategory(
                  expandedCategory === category.category
                    ? null
                    : category.category
                )
              }
            >
              <h3 className="text-xl font-semibold text-theme-text">
                {category.category}
              </h3>
              {expandedCategory === category.category ? (
                <ChevronUp className="w-6 h-6 text-theme-primary" />
              ) : (
                <ChevronDown className="w-6 h-6 text-theme-primary" />
              )}
            </button>

            {expandedCategory === category.category && (
              <div className="divide-y divide-theme-secondary">
                {category.items.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="px-6 py-4">
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedService(
                          expandedService === service.title
                            ? null
                            : service.title
                        )
                      }
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-800">
                          {service.title}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-theme-primary">
                            ${service.basePrice}
                          </span>
                          {expandedService === service.title ? (
                            <ChevronUp className="w-5 h-5 text-theme-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-theme-primary" />
                          )}
                        </div>
                      </div>

                      {expandedService === service.title && (
                        <div className="mt-4 space-y-4">
                          <p className="text-gray-600 whitespace-pre-line">
                            {service.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-theme-primary" />
                              <span className="text-gray-600">
                                {service.duration}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-theme-primary" />
                              <span className="text-gray-600">
                                Maintenance: {service.maintenance}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}