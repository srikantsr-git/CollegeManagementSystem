import React, { useState } from 'react';
import { AlumniProfile } from '../types';
import { Briefcase, MapPin, Linkedin, MessageSquare, Award, Star, GraduationCap, User, X } from 'lucide-react';

interface AlumniCardProps {
  profile: AlumniProfile;
  currentUser: any;
  onMessage: (alumnusId: number, name: string) => void;
  onMentorshipRequest?: (alumnusId: number) => void;
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ profile, currentUser, onMessage, onMentorshipRequest }) => {
  const isStudent = currentUser?.role === 'student';
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  // Format skills string to array
  const skillsArray = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];

  const photoUrl = profile.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80';

  return (
    <>
      <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden">
        {/* Membership status ribbon */}
        {profile.membership_status && profile.membership_status !== 'Active' && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {profile.membership_status}
          </span>
        )}

        <div>
          {/* Profile Head */}
          <div className="flex items-center gap-4 mb-4">
            {/* Clickable photo */}
            <button
              onClick={() => setPhotoDialogOpen(true)}
              className="relative group flex-shrink-0 focus:outline-none"
              title="View photo"
            >
              <img
                src={photoUrl}
                alt={profile.full_name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 dark:group-hover:ring-offset-slate-950 transition-all duration-200 cursor-pointer"
              />
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 rounded-2xl bg-slate-900/0 group-hover:bg-slate-900/25 flex items-center justify-center transition-all duration-200">
                <span className="text-white text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 tracking-wider uppercase">View</span>
              </div>
            </button>

            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white hover:text-primary transition-colors flex items-center gap-1.5">
                {profile.full_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                Class of {profile.grad_year} • {profile.degree} ({profile.department})
              </p>
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-2 mb-4 text-sm text-slate-600 dark:text-slate-300">
            {profile.company && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{profile.designation} at <strong className="text-slate-800 dark:text-slate-200">{profile.company}</strong></span>
              </div>
            )}

            {profile.college && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{profile.college}</span>
              </div>
            )}
            
            {profile.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{profile.address}</span>
              </div>
            )}

            {!profile.address && (profile.city || profile.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}{profile.country ? ` (${profile.country})` : ''}</span>
              </div>
            )}
          </div>

          {/* Skills list */}
          {skillsArray.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {skillsArray.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400"
                >
                  {skill}
                </span>
              ))}
              {skillsArray.length > 4 && (
                <span className="text-[11px] font-bold text-primary px-1 py-1">
                  +{skillsArray.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto flex items-center gap-2">
          {/* Direct Messaging */}
          <button
            onClick={() => onMessage(profile.user_id, profile.full_name)}
            className="flex-1 btn-secondary text-xs py-2 px-3 justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message</span>
          </button>

          {/* Mentorship for student users */}
          {isStudent && onMentorshipRequest && (
            <button
              onClick={() => onMentorshipRequest(profile.user_id)}
              className="flex-1 btn-primary text-xs py-2 px-3 justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Request Mentorship</span>
            </button>
          )}

          {/* LinkedIn Link */}
          {profile.linkedin && (
            <a
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:text-sky-600 hover:border-sky-500/30 transition-all text-slate-400"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* ── Photo Dialog ── */}
      {photoDialogOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto pt-24"
          onClick={() => setPhotoDialogOpen(false)}
        >
          <div
            className="glass-card max-w-sm w-full rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-center items-center bg-white/95 dark:bg-slate-900/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPhotoDialogOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Enlarged Photo */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/30 dark:border-slate-700/30 flex items-center justify-center relative shadow-inner mt-2">
              <img
                src={photoUrl}
                alt={profile.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                style={{ display: 'none' }}
                className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400"
              >
                <User className="w-24 h-24 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">
                {profile.full_name}
              </h3>
              {profile.designation && profile.company && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary-light">
                  {profile.designation} · {profile.company}
                </p>
              )}
              {profile.college && (
                <p className="text-xs text-slate-500 font-semibold">{profile.college}</p>
              )}
              {profile.grad_year && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Class of {profile.grad_year}
                </p>
              )}
              {(profile.city || profile.country) && (
                <p className="text-[10px] text-slate-400">
                  📍 {profile.city}{profile.country ? `, ${profile.country}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
