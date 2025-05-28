import React from 'react';

interface PromoMessage {
  id: number;
  text: string;
  link?: string;
}

interface PromoBannerProps {
  messages: PromoMessage[];
}

export function PromoBanner({ messages }: PromoBannerProps) {
  // Create three sets of messages for smooth infinite scroll
  const repeatedMessages = [...messages, ...messages, ...messages];

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-theme-primary text-white py-2 overflow-hidden shadow-md">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-scroll py-1 whitespace-nowrap flex">
          {messages.map((message) => (
            <div
              key={message.id}
              className="inline-flex items-center px-4 text-sm font-medium"
            >
              {message.link ? (
                <a
                  href={message.link}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {message.text}
                </a>
              ) : (
                <span>{message.text}</span>
              )}
              <span className="mx-8 opacity-50">•</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 animate-scroll2 py-1 whitespace-nowrap flex">
          {messages.map((message) => (
            <div
              key={`${message.id}-clone`}
              className="inline-flex items-center px-4 text-sm font-medium"
            >
              {message.link ? (
                <a
                  href={message.link}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {message.text}
                </a>
              ) : (
                <span>{message.text}</span>
              )}
              <span className="mx-8 opacity-50">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}