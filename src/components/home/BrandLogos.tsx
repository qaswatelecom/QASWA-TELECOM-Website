import React from 'react';

export const AppleLogo: React.FC<{ className?: string }> = ({ className = "h-11 w-auto" }) => (
  <svg viewBox="0 0 170 170" fill="currentColor" className={`text-slate-900 dark:text-white ${className}`}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.06-7.7-7.9-12.04-14.5-6.08-9.23-10.89-19.82-14.42-31.77-3.53-11.95-5.3-23.23-5.3-33.84 0-14.35 3.59-26.46 10.77-36.33 7.18-9.87 16.48-14.88 27.9-15.02 5.03 0 10.42 1.34 16.18 4.03 5.76 2.68 9.57 4.09 11.43 4.22 1.5.08 5.48-1.4 11.94-4.44 6.46-3.04 12.18-4.43 17.15-4.17 12.83.68 23.08 5.44 30.76 14.28-11.25 6.84-16.73 16.14-16.46 27.9.27 9.23 3.82 17.06 10.66 23.49 6.84 6.43 14.87 10.08 24.1 10.95-2.07 6.43-4.58 12.77-7.53 19.01zM119.22 32.74c0-7.22 2.62-13.97 7.85-20.25 5.23-6.28 11.75-10.44 19.57-12.49.13 1.09.2 2.05.2 2.87 0 7.37-2.73 14.33-8.2 20.88-5.46 6.55-12.15 10.45-20.06 11.7-.27-.92-.4-1.84-.4-2.71z"/>
  </svg>
);

export const SamsungLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 280 60" className={className} fill="none">
    <path
      className="fill-[#1428A0] dark:fill-[#38BDF8]"
      d="M12.8 38.6c-6.8 0-11.8-3.2-12.8-8.8l6.3-1.6c.7 3.5 3.3 5.4 6.8 5.4 3.7 0 6.1-1.8 6.1-4.5 0-3-2.6-4.2-7.8-5.4-7.2-1.7-10.9-4.2-10.9-10.1 0-6.1 5.3-10 12.3-10 6.1 0 10.8 3 11.8 7.9l-6.2 1.6c-.6-2.9-2.9-4.6-5.8-4.6-3.3 0-5.6 1.7-5.6 4.3 0 2.8 2.3 3.9 7.4 5.1 7.4 1.7 11.4 4.3 11.4 10.3 0 6.4-5.3 10.4-13 10.4zm34.2-.4h-7.1l11.4-33.8h8l11.4 33.8h-7.3l-2.4-7.4h-11.6l-2.4 7.4zm9.7-27.4l-4 13.9h8.1l-4.1-13.9zm30.3 27.4h-6.8V4.8h8.6l10.3 20 10.3-20h8.6v33.4h-6.8V14.1l-9.8 18.7h-4.6l-9.8-18.7v24.1zm52.7.4c-6.8 0-11.8-3.2-12.8-8.8l6.3-1.6c.7 3.5 3.3 5.4 6.8 5.4 3.7 0 6.1-1.8 6.1-4.5 0-3-2.6-4.2-7.8-5.4-7.2-1.7-10.9-4.2-10.9-10.1 0-6.1 5.3-10 12.3-10 6.1 0 10.8 3 11.8 7.9l-6.2 1.6c-.6-2.9-2.9-4.6-5.8-4.6-3.3 0-5.6 1.7-5.6 4.3 0 2.8 2.3 3.9 7.4 5.1 7.4 1.7 11.4 4.3 11.4 10.3 0 6.4-5.3 10.4-13 10.4zm31.7-.4c-7.8 0-13.7-5.7-13.7-17.1V4.8h6.8v16.7c0 7.8 3.5 11.5 8.2 11.5 4.8 0 8.2-3.7 8.2-11.5V4.8h6.8v16.7c0 11.4-5.9 17.1-16.3 17.1zm41.2 0h-6.7V4.8h6.8l16.1 22.3V4.8h6.8v33.4h-6.8l-16.2-22.4v22.4zm38.1.4c-11.1 0-17.7-7.8-17.7-17.1 0-9.6 7-17.2 17.8-17.2 8.7 0 14.6 4.7 16 12.1l-6.8 1.4c-.9-4.3-4.4-7-9.2-7-6.5 0-10.7 4.9-10.7 10.7 0 6 4.1 10.6 10.6 10.6 4.5 0 7.7-2.1 8.9-5.4h-9v-5.6h15.9v14.1c-3.5 2.1-8.3 3.4-15.8 3.4z"
    />
  </svg>
);

export const GooglePixelLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 190 60" className={className} fill="none">
    <g transform="translate(10, 8)">
      <path fill="#4285F4" d="M42.2 22.4c0-1.5-.1-2.9-.4-4.3H22v8.2h11.4c-.5 2.6-2 4.9-4.2 6.4v5.3h6.8c4-3.7 6.2-9.1 6.2-15.6z"/>
      <path fill="#34A853" d="M22 43c5.7 0 10.4-1.9 13.9-5.1l-6.8-5.3c-1.9 1.3-4.3 2-7.1 2-5.5 0-10.1-3.7-11.7-8.7H3.3v5.5C6.8 38.3 13.8 43 22 43z"/>
      <path fill="#FBBC05" d="M10.3 25.9c-.4-1.3-.7-2.6-.7-4s.3-2.7.7-4v-5.5H3.3C1.2 16.4 0 20 0 24s1.2 7.6 3.3 11.6l7-5.7z"/>
      <path fill="#EA4335" d="M22 8.9c3.1 0 5.9 1.1 8.1 3.1l6.1-6.1C32.4 2.3 27.6 0 22 0 13.8 0 6.8 4.7 3.3 11.6l7 5.5c1.6-5 6.2-8.2 11.7-8.2z"/>
    </g>
    <text x="64" y="38" className="fill-slate-900 dark:fill-white font-extrabold text-[23px]" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Pixel</text>
  </svg>
);

export const OnePlusLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 190 60" className={className} fill="none">
    <rect x="6" y="8" width="44" height="44" rx="10" fill="#EB0028" />
    <path fill="#FFFFFF" d="M25 24h5v16h-5z" />
    <path fill="#FFFFFF" d="M28 20c-2.2 0-4 1.8-4 4h4v-4z" />
    <path fill="#FFFFFF" d="M37 28h3v3h-3v3h-3v-3h-3v-3h3v-3h3v3z" />
    <text x="60" y="38" className="fill-slate-900 dark:fill-white font-black text-[22px] tracking-wide" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">ONEPLUS</text>
  </svg>
);

export const VivoLogo: React.FC<{ className?: string }> = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 160 60" className={className} fill="none">
    <g className="fill-[#008CD6] dark:fill-[#38BDF8]">
      <path d="M26.2 14.5L16.4 43.2c-.6 1.8-2.3 3-4.2 3s-3.6-1.2-4.2-3L.3 19.3c-.5-1.5.3-3.1 1.8-3.6 1.5-.5 3.1.3 3.6 1.8l6.5 22.4 8.7-25.4c.5-1.5 2.1-2.3 3.6-1.8 1.5.5 2.3 2.1 1.7 3.6z"/>
      <path d="M42.3 12.8c-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2-1.9-4.2-4.2-4.2z"/>
      <path d="M45.1 26.3c0-1.6-1.3-2.9-2.9-2.9s-2.9 1.3-2.9 2.9v17.2c0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9V26.3z"/>
      <path d="M74.9 14.5L65.1 43.2c-.6 1.8-2.3 3-4.2 3s-3.6-1.2-4.2-3l-7.7-23.9c-.5-1.5.3-3.1 1.8-3.6 1.5-.5 3.1.3 3.6 1.8l6.5 22.4 8.7-25.4c.5-1.5 2.1-2.3 3.6-1.8 1.5.5 2.3 2.1 1.7 3.6z"/>
      <path d="M90 19c-7.9 0-14.3 6.4-14.3 14.3s6.4 14.3 14.3 14.3 14.3-6.4 14.3-14.3S97.9 19 90 19zm0 22.8c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5 8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/>
    </g>
  </svg>
);

export const OppoLogo: React.FC<{ className?: string }> = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 190 60" className={className} fill="none">
    <g className="fill-[#00855A] dark:fill-[#34D399]">
      <path d="M26 15c-10.5 0-19 8.5-19 19s8.5 19 19 19 19-8.5 19-19-8.5-19-19-19zm0 30.5c-6.3 0-11.5-5.2-11.5-11.5S19.7 22.5 26 22.5s11.5 5.2 11.5 11.5-5.2 11.5-11.5 11.5z"/>
      <path d="M68 15c-10.5 0-19 8.5-19 19 0 7.8 4.7 14.5 11.5 17.3V56h7.5V45.5c6.8-2.8 11.5-9.5 11.5-17.3 0-10.5-8.5-19-19-19zm0 30.5c-6.3 0-11.5-5.2-11.5-11.5S61.7 22.5 68 22.5s11.5 5.2 11.5 11.5-5.2 11.5-11.5 11.5z"/>
      <path d="M112 15c-10.5 0-19 8.5-19 19 0 7.8 4.7 14.5 11.5 17.3V56h7.5V45.5c6.8-2.8 11.5-9.5 11.5-17.3 0-10.5-8.5-19-19-19zm0 30.5c-6.3 0-11.5-5.2-11.5-11.5s5.2-11.5 11.5-11.5 11.5 5.2 11.5 11.5-5.2 11.5-11.5 11.5z"/>
      <path d="M156 15c-10.5 0-19 8.5-19 19s8.5 19 19 19 19-8.5 19-19-8.5-19-19-19zm0 30.5c-6.3 0-11.5-5.2-11.5-11.5s5.2-11.5 11.5-11.5 11.5 5.2 11.5 11.5-5.2 11.5-11.5 11.5z"/>
    </g>
  </svg>
);

export const PocoLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 160 50" className={className} fill="none">
    <rect width="160" height="50" rx="8" fill="#FFD200"/>
    <text x="80" y="36" fontFamily="'Arial Black', Impact, sans-serif" fontSize="28" fontWeight="900" fill="#000000" textAnchor="middle" letterSpacing="4">POCO</text>
  </svg>
);

export const RealmeLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 170 50" className={className} fill="none">
    <rect x="4" y="4" width="42" height="42" rx="10" fill="#FFC915"/>
    <text x="25" y="35" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="30" fontWeight="900" fill="#000000" textAnchor="middle">r</text>
    <text x="56" y="35" className="fill-slate-900 dark:fill-white font-extrabold text-[25px]" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">realme</text>
  </svg>
);

export const MotorolaLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg viewBox="0 0 190 50" className={className} fill="none">
    <circle cx="25" cy="25" r="20" className="fill-[#00142E] dark:fill-[#0284C7]"/>
    <path fill="#FFFFFF" d="M15.5 32c2.2-4.2 4.2-8.8 6-12.8 1.6 3.6 2.8 6.2 2.8 6.2s1.1-2.6 2.8-6.2c1.8 4 3.8 8.6 6 12.8-1.6.7-4.1 1.4-6.8 1.4s-5.2-.7-6.8-1.4zm-2.5-1.1c-1.6-1.4-2.5-3.4-2.5-5.8 0-5.3 4.6-10 13.7-10s13.7 4.7 13.7 10c0 2.4-.8 4.4-2.5 5.8-2.9-5.9-6.2-12.8-6.2-12.8L25 18l-4.4-9.9s-3.3 6.9-6.2 12.8z"/>
    <text x="56" y="32" className="fill-slate-900 dark:fill-white font-bold text-[19px] tracking-tight" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">motorola</text>
  </svg>
);

export const TecnoLogo: React.FC<{ className?: string }> = ({ className = "h-7 w-auto" }) => (
  <svg viewBox="0 0 180 50" className={className} fill="none">
    <g className="fill-[#0082CA] dark:fill-[#38BDF8]">
      <path d="M10 14h24v6H25v20h-6V20H10v-6z"/>
      <path d="M38 14h18v6H44v6h11v6H44v8h14v6H38V14z"/>
      <path d="M82 14c-8 0-14 5.5-14 13s6 13 14 13c4.5 0 8.5-1.8 11-4.8l-4.5-4.2c-1.8 2-4 3-6.5 3-4.5 0-7.8-3.5-7.8-7s3.3-7 7.8-7c2.5 0 4.7 1 6.5 3l4.5-4.2C90.5 15.8 86.5 14 82 14z"/>
      <path d="M98 14h6l12 17V14h6v26h-6L104 23v17h-6V14z"/>
      <path d="M142 14c-8 0-14 5.5-14 13s6 13 14 13 14-5.5 14-13-6-13-14-13zm0 20c-4.5 0-8-3-8-7s3.5-7 8-7 8 3 8 7-3.5 7-8 7z"/>
    </g>
  </svg>
);
