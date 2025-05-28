import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import axios from "axios";
import DOMPurify from 'dompurify';
import API_BASE_URL from "../utils/api_url";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  location: string;
}

interface TeamProps {
  members: TeamMember[];
  location: "Sun Prairie" | "Waunakee";
}

interface ApiResponse {
  status: boolean;
  data: {
    id: number;
    user_id: string;
    phone_no: string;
    role: string;
    profile_img: string;
    about: string;
    salon_assignment: string;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      is_admin: string;
      email_verified_at: string | null;
      created_at: string;
      updated_at: string;
    };
  }[];
  message: string;
}

export function Team({ members, location }: TeamProps) {
  const [apiMembers, setApiMembers] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}/api/stylists`
        );
        if (response.data.status) {
          const formattedMembers = response.data.data.map((stylist) => ({
            name: stylist.user.name,
            role: stylist.role,
            image: stylist.profile_img,
            description: stylist.about,
            location: stylist.salon_assignment,
          }));
          setApiMembers(formattedMembers);
        }
      } catch (error) {
        console.error("Error fetching stylists:", error);
      }
    };

    fetchData();
  }, []);

  const displayMembers = apiMembers || members;

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Meet Our Team</h2>
        <p className="text-theme-text text-center mb-12 max-w-2xl mx-auto">
          Our talented team of beauty professionals is dedicated to helping you
          look and feel your best.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-lg mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[400px] object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-theme-accent font-medium">{member.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(member.description),
                  }}
                />
                <p className="text-sm text-theme-primary font-medium flex items-center">
                  <MapPin className="w-4 h-4 inline-block mr-1" />
                  {member.location === "both" ? "Sun Prairie & Waunakee" : member.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}