import React from "react";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import API_BASE_URL from '../utils/api_url';

interface FooterProps {
  location: "Sun Prairie" | "Waunakee";
}

export function Footer({ location }: FooterProps) {
  const year = new Date().getFullYear;

  return (
    <footer id="contact" className="bg-theme-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img
                src="/images/jlash logo no background.png"
                alt="J. Lash Studios Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-theme-accent">
              Enhancing your natural beauty with premium lash services.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-theme-accent">
              Contact
            </h4>
            <div className="space-y-2">
              <a
                href="tel:6089573140"
                className="flex items-center text-theme-accent hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" /> (608) 957-3140
              </a>
              <a
                href="mailto:jenny@jlashstudios.com"
                className="flex items-center text-theme-accent hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" /> jenny@jlashstudios.com
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-theme-accent">
              Locations
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-theme-accent mb-1">
                  Sun Prairie
                </h5>
                <a
                  href="https://maps.google.com/?q=242+E+Main+St,+Suite+4,+Sun+Prairie,+WI+53590"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start text-theme-accent hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    242 E Main St, Suite 4<br />
                    Sun Prairie, WI 53590
                  </span>
                </a>
              </div>
              <div>
                <h5 className="font-semibold text-theme-accent mb-1">
                  Waunakee
                </h5>
                <a
                  href="https://maps.google.com/?q=204+S+Century+Ave,+A3,+Waunakee,+WI+53597"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start text-theme-accent hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    204 S Century Ave, A3
                    <br />
                    Waunakee, WI 53597
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-theme-accent">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/j.lashbyjenny/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-accent hover:text-white transition-colors transform hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/jlashbyjenny"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-accent hover:text-white transition-colors transform hover:scale-110"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-theme-accent/20 mt-8 pt-8 text-center">
          <p className="text-theme-accent">
            &copy; {new Date().getFullYear()} J. Lash Studios. All rights
            reserved.
          </p>
          <div className="flex flex-col items-center">
            <span className="text-theme-accent text-sm -mb-4 relative z-10">Powered By</span>
            <a 
              href="https://enjendigital.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="/images/enjen logo.png"
                alt="Enjen"
                className="h-14 w-auto brightness-0 invert opacity-75 hover:opacity-100 transition-opacity relative z-0"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}