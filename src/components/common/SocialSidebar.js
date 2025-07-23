import React from 'react';
import { FaFacebookF, FaInstagram, FaTripadvisor } from 'react-icons/fa';

const socials = [
  {
    icon: <FaFacebookF />,
    url: 'https://facebook.com',
    label: 'Facebook',
    color: 'bg-[#0a1f44] hover:bg-[#1877f2] text-white',
  },
  {
    icon: <FaInstagram />,
    url: 'https://instagram.com',
    label: 'Instagram',
    color: 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white',
  },
  {
    icon: <FaTripadvisor />,
    url: 'https://tripadvisor.com',
    label: 'TripAdvisor',
    color: 'bg-[#d4af37] hover:bg-[#bfa133] text-[#0a1f44]',
  },
];

const SocialSidebar = () => (
  <div className="fixed left-4 top-1/3 z-50 flex flex-col gap-4 md:left-4 md:top-1/3 md:flex-col sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:flex-row sm:top-auto">
    {socials.map((s, i) => (
      <a
        key={s.label}
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.label}
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 text-2xl ${s.color}`}
        style={{ boxShadow: '0 2px 8px rgba(10,31,68,0.12)' }}
      >
        {s.icon}
      </a>
    ))}
  </div>
);

export default SocialSidebar; 