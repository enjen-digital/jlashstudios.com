import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/api_url';

interface StatsProps {
  stats: {
    clients: number;
    experience: number;
    satisfaction: number;
  };
  location: 'Sun Prairie' | 'Waunakee';
}

interface ApiResponse {
  status: boolean;
  data: {
    id: number;
    happy_clients: string;
    experience: string;
    client_satisfaction: string;
    created_at: string;
    updated_at: string;
  };
}

export function Stats({ stats, location }: StatsProps) {
  const [apiStats, setApiStats] = useState<{
    clients: number;
    experience: number;
    satisfaction: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/feedback`);
        if (response.data.status) {
          setApiStats({
            clients: parseInt(response.data.data.happy_clients, 10),
            experience: parseInt(response.data.data.experience, 10),
            satisfaction: parseInt(response.data.data.client_satisfaction, 10),
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
  }, []);

  const displayStats = apiStats || stats;

  return (
    <section id="stats" className="py-16 bg-theme-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-theme-primary mb-2" key={displayStats.clients}>
              {displayStats.clients}+
            </div>
            <p className="text-theme-text">Happy Clients</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-theme-primary mb-2" key={displayStats.experience}>
              {displayStats.experience}+
            </div>
            <p className="text-theme-text">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-theme-primary mb-2" key={displayStats.satisfaction}>
              {displayStats.satisfaction}%
            </div>
            <p className="text-theme-text">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}