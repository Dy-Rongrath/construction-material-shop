'use client'; // This component has interactive elements (accordion)

import React, { useState } from 'react';

// TypeScript interface for FAQ item props
interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

// Reusable component for a single FAQ item
const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="py-6 border-b border-gray-700">
      <dt>
        <button
          onClick={onClick}
          className="flex w-full items-start justify-between text-left text-gray-300"
          aria-expanded={isOpen}
        >
          <span className="text-base font-semibold leading-7 text-white">{question}</span>
          <span className="ml-6 flex h-7 items-center">
            <svg
              className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </button>
      </dt>
      {isOpen && (
        <dd className="mt-4 pr-12">
          <p className="text-base leading-7 text-gray-400">{answer}</p>
        </dd>
      )}
    </div>
  );
};

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What are your shipping options and delivery times?',
      answer:
        'We offer standard and expedited shipping. Standard delivery is typically 3-5 business days for in-stock items. Expedited shipping is 1-2 business days. Delivery times for bulk orders or special items may vary and will be communicated at checkout.',
    },
    {
      question: 'Do you deliver to residential addresses?',
      answer:
        'Yes, we deliver to both commercial job sites and residential addresses. Please ensure there is adequate space and access for our delivery vehicles. Additional charges may apply for deliveries requiring special equipment.',
    },
    {
      question: 'How can I track my order?',
      answer:
        "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also view your order status and tracking information in the 'My Account' section of our website.",
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns on most unopened items within 30 days of purchase. A restocking fee may apply. Custom-ordered or cut materials are non-returnable. Please visit our Returns page or contact customer service to initiate a return.',
    },
    {
      question: 'Can I change or cancel my order after it has been placed?',
      answer:
        'If you need to change or cancel an order, please contact us as soon as possible. If the order has not yet been processed or shipped, we will do our best to accommodate your request. Custom orders cannot be canceled once they are in production.',
    },
    {
      question: 'Do you offer bulk pricing or contractor accounts?',
      answer:
        "Absolutely. We offer competitive pricing for bulk orders and special accounts for professional contractors. Please fill out the form on our 'Contractor Accounts' page or contact our sales team to learn more about the benefits.",
    },
  ];

  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-white/10">
          <h1 className="text-4xl font-bold leading-10 tracking-tight text-white text-center">
            Frequently Asked Questions
          </h1>
          <dl className="mt-10 space-y-6 divide-y divide-white/10">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
