import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How long do lash extensions last?",
    answer: "Lash extensions typically last through a full growth cycle of your natural lashes, usually about 6-8 weeks. However, we recommend getting fills every 2-3 weeks to maintain a full look as your natural lashes shed."
  },
  {
    question: "Is the lash extension application process painful?",
    answer: "No, the lash extension application is painless. You'll lie down comfortably with your eyes closed while the extensions are applied. Many clients find the process so relaxing they fall asleep!"
  },
  {
    question: "How long does a full set application take?",
    answer: "A full set of classic lashes typically takes 2-2.5 hours, while volume sets can take 2.5-3 hours. Fill appointments are shorter, usually 1-2 hours depending on the type of lashes."
  },
  {
    question: "How should I care for my lash extensions?",
    answer: "Keep your lashes dry for the first 24 hours after application. Avoid oil-based products around your eyes, don't use mechanical eyelash curlers, and gently clean your lashes daily with a lash-safe cleanser. Brush them gently with a clean spoolie brush to maintain their shape."
  },
  {
    question: "What is the difference between classic and volume lashes?",
    answer: "Classic lashes involve applying one extension to each natural lash for a more natural look. Volume lashes use multiple lightweight extensions per natural lash, creating a fuller, more dramatic appearance."
  },
  {
    question: "How long does microblading last?",
    answer: "Microblading typically lasts 1-3 years, depending on your skin type and aftercare routine. A touch-up is recommended 4-6 weeks after the initial procedure, and annual touch-ups can help maintain the look."
  },
  {
    question: "What should I do before my appointment?",
    answer: "Come to your appointment with clean lashes/brows, no eye makeup, and avoid caffeine before lash appointments (it can make your eyes flutter). For microblading, avoid blood thinners, alcohol, and retinol products for 48 hours before your appointment."
  }
];

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <h3 className="text-lg font-medium text-gray-900 text-left">{faq.question}</h3>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-theme-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-theme-primary flex-shrink-0" />
                )}
              </button>
              {expandedIndex === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}