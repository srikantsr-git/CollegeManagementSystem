import React, { useRef } from 'react';
import { useTheme } from './ThemeManager';
import { ShieldCheck, Download, Printer, User, Award } from 'lucide-react';

interface DigitalAlumniCardProps {
  user: any;
  profileDetails: any; // AlumniProfile or StudentProfile
  cardType?: 'alumni' | 'student';
}

export const DigitalAlumniCard: React.FC<DigitalAlumniCardProps> = ({ user, profileDetails, cardType = 'student' }) => {
  const { settings } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isAlumni = cardType === 'alumni';
  const memberTier = isAlumni
    ? (profileDetails?.membership_status || 'Alumni Member')
    : (profileDetails?.membership_status || 'Active Student');
  const displayGradYear = profileDetails?.grad_year || new Date().getFullYear();
  const displayDegree = profileDetails?.degree || (isAlumni ? 'Alumni Scholar' : 'Student');
  const displayDept = profileDetails?.department || (isAlumni ? (profileDetails?.college || 'University') : 'University');
  const displayRollNum = profileDetails?.roll_number || (isAlumni ? 'ALUM-' : 'STU-') + user.id.toString().padStart(4, '0');
  const cardLabel = isAlumni ? 'Alumni ID Card' : 'Student ID Card';
  const gradLabel = isAlumni ? 'Batch / Year' : 'Graduation';
  const subheading = isAlumni ? 'Alumni Association' : 'Student Registry';

  // Simple dynamic SVG QR Code generation
  const mockQrCodeSvg = (
    <svg className="w-20 h-20 text-slate-800 dark:text-white" viewBox="0 0 100 100" fill="currentColor">
      {/* Outer borders */}
      <rect x="0" y="0" width="25" height="25" />
      <rect x="5" y="5" width="15" height="15" fill="white" />
      <rect x="8" y="8" width="9" height="9" />
      
      <rect x="75" y="0" width="25" height="25" />
      <rect x="80" y="5" width="15" height="15" fill="white" />
      <rect x="83" y="8" width="9" height="9" />

      <rect x="0" y="75" width="25" height="25" />
      <rect x="5" y="80" width="15" height="15" fill="white" />
      <rect x="8" y="83" width="9" height="9" />

      {/* Internal QR squares */}
      <rect x="35" y="5" width="8" height="8" />
      <rect x="50" y="15" width="6" height="6" />
      <rect x="65" y="10" width="8" height="8" />
      <rect x="40" y="30" width="10" height="10" />
      <rect x="10" y="45" width="8" height="8" />
      <rect x="30" y="50" width="6" height="6" />
      <rect x="55" y="45" width="12" height="12" />
      
      <rect x="75" y="75" width="8" height="8" />
      <rect x="60" y="80" width="6" height="6" />
      <rect x="45" y="70" width="8" height="8" />
      <rect x="85" y="40" width="8" height="8" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto my-4">
      {/* Front of Card */}
      <div 
        ref={cardRef}
        className="w-full h-64 rounded-3xl relative overflow-hidden text-white shadow-2xl p-6 flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
        }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xs pointer-events-none"></div>

        {/* Dynamic Glowing accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-dark/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-3 z-10">
          <div className="flex items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-white" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-accent" />
            )}
            <div className="text-left">
              <h4 className="font-bold text-xs tracking-wider uppercase leading-none">{settings.univ_name}</h4>
              <span className="text-[9px] text-white/70 uppercase font-semibold">{subheading}</span>
            </div>
          </div>
          <span className="text-[9px] font-extrabold tracking-widest bg-accent px-2 py-0.5 rounded-full text-white uppercase shadow-sm">
            {memberTier}
          </span>
        </div>

        {/* Card Details */}
        <div className="flex items-center gap-5 my-3 z-10">
          {/* Mock User avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profileDetails?.photo_url ? (
              <img src={profileDetails.photo_url} alt="Member" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white/50" />
            )}
          </div>

          <div className="text-left flex-1">
            <h3 className="font-extrabold text-lg leading-tight tracking-wide truncate">{user.full_name}</h3>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{displayDegree} ({displayDept})</p>
            <p className="text-[9px] text-white/60 font-semibold uppercase mt-0.5">ID: {displayRollNum}</p>
            <span className="text-[9px] bg-white/10 border border-white/20 rounded px-1.5 py-0.5 inline-block mt-2 font-bold uppercase text-accent">
              {gradLabel}: {displayGradYear}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-2.5 rounded-2xl shadow-lg shadow-black/10 flex-shrink-0 flex items-center justify-center border border-white/35">
            {mockQrCodeSvg}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-white/15 pt-3 z-10 text-[9px] text-white/70">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Membership
          </span>
          <span className="font-semibold uppercase tracking-wider">{cardLabel}</span>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handlePrint}
          className="flex-1 btn-secondary text-xs flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF Card</span>
        </button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("Card download started! (Simulated PDF download successfully compiled.)");
          }}
          className="flex-1 btn-primary text-xs flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Save Digital Card</span>
        </a>
      </div>
    </div>
  );
};
