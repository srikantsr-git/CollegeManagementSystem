import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeManager';
import { Sun, Moon, Menu, X, GraduationCap, ChevronDown, ChevronRight, User, LogOut, Bell, Info, Users, Activity, FileText, BookOpen, CalendarDays, Trophy, ShieldCheck, UserCheck, FileSpreadsheet, Home, FlaskConical, FolderOpen, Star, Newspaper, Briefcase, Building2, Award } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, currentUser, setCurrentUser }) => {
  const { settings, darkMode, toggleDarkMode } = useTheme();
  let quickLinks: { label: string; url: string }[] = [];
  try {
    quickLinks = JSON.parse(settings.top_header_links || '[]');
  } catch (e) {
    quickLinks = [];
  }

  let accreditations: { id: string; title: string; subtitle: string; image_url?: string }[] = [];
  try {
    const parsed = JSON.parse(settings.accreditation_logos || '[]');
    if (parsed && parsed.length > 0) {
      accreditations = parsed;
    } else {
      accreditations = [
        { id: 'naac', title: 'NAAC A++', subtitle: 'Accredited Grade', image_url: '/naac.png' },
        { id: 'nba', title: 'NBA', subtitle: 'Accredited Tier-1', image_url: '/nba.png' },
        { id: 'nirf', title: 'NIRF', subtitle: 'Top Engineering', image_url: '/nirf.png' },
        { id: 'ugc', title: 'UGC', subtitle: 'Autonomous', image_url: '/ugc.png' }
      ];
    }
  } catch (e) {
    accreditations = [];
  }
  const [isOpen, setIsOpen] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(false);
  const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false);
  const [studentCornerOpen, setStudentCornerOpen] = useState(false);
  const [mobileStudentCornerOpen, setMobileStudentCornerOpen] = useState(false);
  const [openCustomDropdownId, setOpenCustomDropdownId] = useState<string | null>(null);
  const [openSubDropdownId, setOpenSubDropdownId] = useState<string | null>(null);
  const [mobileCustomDropdownId, setMobileCustomDropdownId] = useState<string | null>(null);
  const [mobileSubDropdownId, setMobileSubDropdownId] = useState<string | null>(null);

  const [customPages, setCustomPages] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/custom-pages?_t=${Date.now()}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCustomPages(data))
      .catch(err => console.warn('Navbar failed to fetch custom pages:', err));
  }, [currentTab, aboutOpen, academicOpen, studentCornerOpen, mobileAboutOpen, mobileAcademicOpen, mobileStudentCornerOpen]);

  const baseAboutSubpages = [
    { id: 'about_us', label: 'About Us', icon: Info, badge: 'Organisation' },
    { id: 'committee', label: 'Committee', icon: Users, badge: 'Governance' },
    { id: 'hods', label: 'From HODs/Directors Desk', icon: Home, badge: 'Leadership' },
    { id: 'director', label: 'Director of Phy. Edu.', icon: Activity, badge: 'Leadership' },
    { id: 'circulars', label: 'Circulars', icon: FileText, badge: 'Notices' },
    { id: 'ncte', label: 'NCTE Mandatory Disclosures', icon: ShieldCheck, badge: 'Regulatory' },
    { id: 'facilities', label: 'Facilities', icon: Building2, badge: 'Infrastructure' },
  ];

  const baseAcademicSubpages = [
    { id: 'courses', label: 'Academic Courses', icon: BookOpen, badge: 'Programs' },
    { id: 'admission', label: 'Admissions Notice', icon: UserCheck, badge: 'Enrollment' },
    { id: 'syllabus', label: 'Curriculum Syllabus', icon: FileSpreadsheet, badge: 'Curriculum' },
    { id: 'academic_results', label: 'Academic Results', icon: Trophy, badge: 'Academic' },
  ];

  const baseStudentCornerSubpages = [
    { id: 'events', label: 'Events', icon: CalendarDays, badge: 'Activities' },
    { id: 'stories', label: 'Stories', icon: Newspaper, badge: 'Alumni' },
    { id: 'careers', label: 'Careers', icon: Briefcase, badge: 'Jobs' },
    { id: 'activities', label: 'Activities', icon: Activity, badge: 'Campus' },
    { id: 'research', label: 'Research', icon: FlaskConical, badge: 'Academic' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, badge: 'Student' },
    { id: 'calendar', label: 'Sports Calendar', icon: CalendarDays, badge: 'Schedule' },
    { id: 'souvenirs', label: 'Souvenirs', icon: Star, badge: 'Publications' },
    { id: 'draws', label: 'Draws', icon: FileText, badge: 'Draws' },
    { id: 'results', label: 'Results', icon: Trophy, badge: 'Results' },
  ];

  const dynamicAbout = customPages
    .filter(p => p.is_visible !== 0 && p.menu_type === 'child' && p.parent_menu === 'about' && !baseAboutSubpages.some(sp => sp.id === p.id))
    .map(p => ({ id: p.id, label: p.title, icon: FileText, badge: 'Custom' }));

  const dynamicAcademic = customPages
    .filter(p => p.is_visible !== 0 && p.menu_type === 'child' && p.parent_menu === 'academic' && !baseAcademicSubpages.some(sp => sp.id === p.id))
    .map(p => ({ id: p.id, label: p.title, icon: FileText, badge: 'Custom' }));

  const dynamicStudent = customPages
    .filter(p => p.is_visible !== 0 && p.menu_type === 'child' && p.parent_menu === 'student' && !baseStudentCornerSubpages.some(sp => sp.id === p.id))
    .map(p => ({ id: p.id, label: p.title, icon: FileText, badge: 'Custom' }));

  const dynamicStandalone = customPages
    .filter(p => p.is_visible !== 0 && p.menu_type === 'standalone');

  const aboutSubpages = [...baseAboutSubpages, ...dynamicAbout];
  const academicSubpages = [...baseAcademicSubpages, ...dynamicAcademic];
  const studentCornerSubpages = [...baseStudentCornerSubpages, ...dynamicStudent];

  // Reset logo error state when logo URL changes (e.g. after admin updates it)
  useEffect(() => {
    setLogoImgError(false);
  }, [settings.logo_url]);

  // Close dropdown when clicking outside
  const aboutRef = useRef<HTMLDivElement>(null);
  const academicRef = useRef<HTMLDivElement>(null);
  const studentCornerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
      if (academicRef.current && !academicRef.current.contains(e.target as Node)) {
        setAcademicOpen(false);
      }
      if (studentCornerRef.current && !studentCornerRef.current.contains(e.target as Node)) {
        setStudentCornerOpen(false);
      }
      const clickedInside = (e.target as HTMLElement).closest('.custom-dropdown-container');
      if (!clickedInside) {
        setOpenCustomDropdownId(null);
        setOpenSubDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const baseNavLinks = [
    { id: 'directory', label: 'Alumni' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'placements', label: 'Placements' },
    { id: 'donations', label: 'Donations' },
    { id: 'contact', label: 'Contact' }
  ];

  const navLinks = [
    ...baseNavLinks,
    ...dynamicStandalone.map(dl => ({ id: `about-${dl.id}`, label: dl.title }))
  ];

  const handleRoleSwitch = (role: 'student' | 'alumni' | 'admin' | null) => {
    setShowRoleSelector(false);
    if (role === null) {
      setCurrentUser(null);
      setCurrentTab('home');
      return;
    }

    // Mock Login trigger (bypasses UI for quick testing, but individual login pages exist!)
    const mockUsers = {
      student: { id: 6, role: 'student', email: 'student.bob@apex.edu', full_name: 'Bob Johnson', status: 'approved' },
      alumni: { id: 2, role: 'alumni', email: 'john.doe@gmail.com', full_name: 'John Doe', status: 'approved' },
      admin: { id: 1, role: 'admin', email: 'admin@apex.edu', full_name: 'Dr. Sarah Jenkins', status: 'approved' }
    };

    setCurrentUser(mockUsers[role]);
    setCurrentTab(`${role}-dashboard`);
  };

  return (
    <>
      {/* Top Header Contact & Socials Bar */}
      {settings.show_top_header === 1 && (
        <div 
          className="border-b border-white/5 py-2 text-xs transition-colors duration-200"
          style={{
            backgroundColor: 'var(--color-top-header-bg)',
            color: 'var(--color-top-header-text)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-3">
            {/* Left: Contact Info */}
            <div className="flex items-center gap-5 text-[10px] font-medium tracking-wide">
              {settings.top_header_phone && (
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  📞 {settings.top_header_phone}
                </span>
              )}
              {settings.top_header_email && (
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  ✉️ {settings.top_header_email}
                </span>
              )}
            </div>

            {/* Right: Quick Links Portals & Social Shortcuts */}
            <div className="flex items-center gap-5 text-[10px] flex-wrap">
              {/* Dynamic Quick links */}
              {quickLinks.length > 0 && (
                <div className="flex items-center gap-3 border-r border-white/10 pr-5 flex-wrap">
                  {quickLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-extrabold opacity-90 hover:opacity-100 hover:underline transition-all uppercase tracking-wider text-[9px]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Social Media Links */}
              <div className="flex items-center gap-3.5 font-bold">
                {settings.social_facebook && settings.social_facebook !== '#' && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100 transition-opacity">Facebook</a>
                )}
                {settings.social_twitter && settings.social_twitter !== '#' && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100 transition-opacity">Twitter/X</a>
                )}
                {settings.social_linkedin && settings.social_linkedin !== '#' && (
                  <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100 transition-opacity">LinkedIn</a>
                )}
                {settings.social_instagram && settings.social_instagram !== '#' && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100 transition-opacity">Instagram</a>
                )}
                {settings.social_youtube && settings.social_youtube !== '#' && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100 transition-opacity">YouTube</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tier 2: Main Branding Header Row (Logo, University Title, Accreditations like IARE) */}
      {settings.show_main_header === 1 && (
        <div className="bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/60 py-4 sm:py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Prominent Logo & University Name */}
            <div 
              className="flex items-center gap-4 cursor-pointer group text-left"
              onClick={() => setCurrentTab('home')}
            >
              <div className="relative shrink-0">
                {settings.logo_url && !logoImgError ? (
                  <img
                    src={settings.logo_url}
                    alt="University Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300 border border-slate-100 dark:border-slate-800"
                    onError={() => setLogoImgError(true)}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-primary dark:from-white dark:via-slate-200 dark:to-primary bg-clip-text text-transparent group-hover:text-primary transition-colors">
                  {settings.univ_name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5 tracking-wide flex items-center gap-1.5 flex-wrap">
                  <span>{settings.univ_tagline || 'Autonomous Institution | Approved by AICTE | Permanently Affiliated'}</span>
                </p>
              </div>
            </div>

            {/* Right: Accreditation & Recognition Badges (IARE style) */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center md:justify-end shrink-0">
              {accreditations.map((badge) => {
                const styles = {
                  naac: { border: 'border-amber-500/20', bg: 'from-amber-500/10 to-amber-600/5', text: 'text-amber-700 dark:text-amber-400', icon: Award },
                  nba: { border: 'border-blue-500/20', bg: 'from-blue-500/10 to-blue-600/5', text: 'text-blue-700 dark:text-blue-400', icon: ShieldCheck },
                  nirf: { border: 'border-emerald-500/20', bg: 'from-emerald-500/10 to-emerald-600/5', text: 'text-emerald-700 dark:text-emerald-400', icon: Trophy },
                  ugc: { border: 'border-purple-500/20', bg: 'from-purple-500/10 to-purple-600/5', text: 'text-purple-700 dark:text-purple-400', icon: Star }
                };

                const s = styles[badge.id as keyof typeof styles] || styles.naac;
                const IconComponent = s.icon;

                return (
                  <div 
                    key={badge.id} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gradient-to-r shadow-sm hover:shadow-md transition-all ${s.border} ${s.bg} ${s.text}`}
                  >
                    {badge.image_url && (
                      <img 
                        src={badge.image_url} 
                        alt={badge.title} 
                        className="h-10 w-10 object-contain rounded-lg shrink-0" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    )}
                    <IconComponent className={`w-6 h-6 shrink-0 fallback-icon ${badge.image_url ? 'hidden' : ''}`} />
                    <div className="text-left leading-none">
                      <span className="block font-black text-xs uppercase tracking-wider">{badge.title}</span>
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 block">{badge.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      <nav className="sticky top-0 z-50 glass-card bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Menu Header Brand (Shows small logo only if main header row is disabled) */}
            {settings.show_main_header !== 1 && (
              <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
                {settings.logo_url && !logoImgError ? (
                  <img
                    src={settings.logo_url}
                    alt="Logo"
                    className="w-10 h-10 rounded-xl object-cover animate-float"
                    onError={() => setLogoImgError(true)}
                  />
                ) : (
                  <GraduationCap className="w-10 h-10 text-primary" />
                )}
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {settings.univ_name}
                </span>
              </div>
            )}

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => {
                  setCurrentTab('home');
                  setIsOpen(false);
                  setAboutOpen(false);
                  setStudentCornerOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab === 'home'
                    ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                  }`}
              >
                Home
              </button>

              {/* About Dropdown */}
              <div className="relative" ref={aboutRef}>
                <button
                  onClick={() => {
                    setAboutOpen(!aboutOpen);
                    setAcademicOpen(false);
                    setStudentCornerOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab.startsWith('about-')
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                    }`}
                >
                  <span>About</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>

                {aboutOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl overflow-hidden z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-700/50">
                    <div className="px-4 py-3 bg-secondary text-white">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">About PCZSC</p>
                      <p className="text-xs font-bold text-white mt-0.5">Select a Section</p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      {aboutSubpages.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = currentTab === `about-${sub.id}`;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentTab(`about-${sub.id}`);
                              setAboutOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isActive
                                ? 'bg-primary text-white font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary font-semibold'
                              }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive
                                ? 'bg-white/20'
                                : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'
                              }`}>
                              <SubIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`} />
                            </span>
                            <span className="flex-1 text-left leading-tight">{sub.label}</span>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Dropdown */}
              <div className="relative" ref={academicRef}>
                <button
                  onClick={() => {
                    setAcademicOpen(!academicOpen);
                    setAboutOpen(false);
                    setStudentCornerOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab.startsWith('academic-')
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                    }`}
                >
                  <span>Academic</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${academicOpen ? 'rotate-180' : ''}`} />
                </button>

                {academicOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl overflow-hidden z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-700/50">
                    <div className="px-4 py-3 bg-secondary text-white">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">UNIPUNEDPE Academic</p>
                      <p className="text-xs font-bold text-white mt-0.5">Select a Section</p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      {academicSubpages.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = currentTab === `academic-${sub.id}`;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentTab(`academic-${sub.id}`);
                              setAcademicOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isActive
                                ? 'bg-primary text-white font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary font-semibold'
                              }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive
                                ? 'bg-white/20'
                                : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'
                              }`}>
                              <SubIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`} />
                            </span>
                            <span className="flex-1 text-left leading-tight">{sub.label}</span>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Corner Dropdown */}
              <div className="relative" ref={studentCornerRef}>
                <button
                  onClick={() => {
                    setStudentCornerOpen(!studentCornerOpen);
                    setAboutOpen(false);
                    setAcademicOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab.startsWith('student-')
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                    }`}
                >
                  <span>Student Corner</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${studentCornerOpen ? 'rotate-180' : ''}`} />
                </button>

                {studentCornerOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl overflow-hidden z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-700/50 max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-3 bg-secondary text-white sticky top-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">Student Corner</p>
                      <p className="text-xs font-bold text-white mt-0.5">Campus Life & Activities</p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      {studentCornerSubpages.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = currentTab === `student-${sub.id}` || 
                          (sub.id === 'events' && currentTab === 'events') ||
                          (sub.id === 'stories' && currentTab === 'stories') ||
                          (sub.id === 'careers' && currentTab === 'jobs');
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (sub.id === 'events') {
                                setCurrentTab('events');
                              } else if (sub.id === 'stories') {
                                setCurrentTab('stories');
                              } else if (sub.id === 'careers') {
                                setCurrentTab('jobs');
                              } else {
                                setCurrentTab(`student-${sub.id}`);
                              }
                              setStudentCornerOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isActive
                                ? 'bg-primary text-white font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary font-semibold'
                              }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive
                                ? 'bg-white/20'
                                : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'
                              }`}>
                              <SubIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`} />
                            </span>
                            <span className="flex-1 text-left leading-tight">{sub.label}</span>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Custom Dropdown Menus — 3 levels */}
              {customPages.filter(p => p.menu_type === 'parent').map((parent) => {
                const isOpen = openCustomDropdownId === parent.id;
                // Level-2: children that belong to this parent
                const children = customPages.filter(p =>
                  (p.menu_type === 'child' || p.menu_type === 'sub-parent') && p.parent_menu === parent.id
                );
                const isActive = currentTab.startsWith(`custmenu__${parent.id}__`);
                return (
                  <div key={parent.id} className="relative custom-dropdown-container">
                    <button
                      onClick={() => {
                        setOpenCustomDropdownId(isOpen ? null : parent.id);
                        setOpenSubDropdownId(null);
                        setAboutOpen(false);
                        setAcademicOpen(false);
                        setStudentCornerOpen(false);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive
                          ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                          : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                        }`}
                    >
                      <span>{parent.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="absolute left-0 mt-2 w-64 rounded-2xl overflow-visible z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-700/50">
                        <div className="px-4 py-3 bg-secondary text-white rounded-t-2xl">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">{parent.title}</p>
                          <p className="text-xs font-bold text-white mt-0.5">Select a Section</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                          {children.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic p-3 text-center">No subpages created.</p>
                          ) : (
                            children.map((child) => {
                              const isChildActive = currentTab.startsWith(`custmenu__${parent.id}__${child.id}`);
                              // Level-3: sub-children under this child
                              const subChildren = customPages.filter(p =>
                                p.menu_type === 'sub-child' && p.parent_menu === child.id
                              );
                              const hasSubChildren = subChildren.length > 0;
                              const isSubOpen = openSubDropdownId === child.id;

                              return (
                                <div key={child.id} className="relative">
                                  <button
                                    onClick={() => {
                                      if (hasSubChildren) {
                                        setOpenSubDropdownId(isSubOpen ? null : child.id);
                                      } else {
                                        setCurrentTab(`custmenu__${parent.id}__${child.id}`);
                                        setOpenCustomDropdownId(null);
                                        setOpenSubDropdownId(null);
                                      }
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isChildActive
                                        ? 'bg-primary text-white font-bold shadow-sm'
                                        : 'text-slate-750 dark:text-slate-200 hover:bg-primary/10 hover:text-primary font-semibold'
                                      }`}
                                  >
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isChildActive
                                        ? 'bg-white/20'
                                        : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'
                                      }`}>
                                      <FileText className={`w-4 h-4 ${isChildActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`} />
                                    </span>
                                    <span className="flex-1 text-left leading-tight">{child.title}</span>
                                    {hasSubChildren ? (
                                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSubOpen ? 'rotate-90' : ''} ${isChildActive ? 'text-white/70' : 'text-slate-400 group-hover:text-primary'}`} />
                                    ) : (
                                      isChildActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                                    )}
                                  </button>

                                  {/* Level-3 Sub-dropdown (fly-out to the right) */}
                                  {hasSubChildren && isSubOpen && (
                                    <div className="absolute left-full top-0 ml-1.5 w-56 rounded-2xl overflow-hidden z-[60] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-700/50">
                                      <div className="px-3 py-2 bg-gradient-to-r from-primary to-secondary">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">{child.title}</p>
                                        <p className="text-[11px] font-bold text-white">Sub-sections</p>
                                      </div>
                                      <div className="p-1.5 space-y-0.5">
                                        {subChildren.map(sub => {
                                          const isSubActive = currentTab === `custmenu__${parent.id}__${child.id}__${sub.id}`;
                                          return (
                                            <button
                                              key={sub.id}
                                              onClick={() => {
                                                setCurrentTab(`custmenu__${parent.id}__${child.id}__${sub.id}`);
                                                setOpenCustomDropdownId(null);
                                                setOpenSubDropdownId(null);
                                              }}
                                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all group ${isSubActive
                                                  ? 'bg-primary text-white font-bold shadow-sm'
                                                  : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary font-semibold'
                                                }`}
                                            >
                                              <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isSubActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'}`}>
                                                <ChevronRight className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                                              </span>
                                              <span className="flex-1 text-left leading-tight text-xs">{sub.title}</span>
                                              {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}


              {/* Top-level nav links: Alumni, Donations, Contact */}
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setIsOpen(false);
                    setAboutOpen(false);
                    setStudentCornerOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab === link.id
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            {/* Actions & Profile Dropdown */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-900" />}
              </button>

              {/* Quick Test Role Selector / Auth */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-primary/40 transition-all"
                >
                  {currentUser ? (
                    <>
                      <User className="w-4 h-4 text-primary" />
                      <span className="max-w-[120px] truncate">{currentUser.full_name}</span>
                      <span className="text-[10px] bg-primary-light dark:bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded uppercase">
                        {currentUser.role}
                      </span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showRoleSelector && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40 shadow-xl shadow-slate-100/20 dark:shadow-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Role Controller (Testing)
                      </span>
                    </div>
                    <div className="p-1.5 flex flex-col gap-1">
                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className="text-left w-full px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary dark:hover:bg-primary/10 transition-all"
                      >
                        Login as Admin
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('alumni')}
                        className="text-left w-full px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary dark:hover:bg-primary/10 transition-all"
                      >
                        Login as Alumnus
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('student')}
                        className="text-left w-full px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary dark:hover:bg-primary/10 transition-all"
                      >
                        Login as Student
                      </button>

                      <div className="border-t border-slate-200/50 dark:border-slate-800/40 my-1"></div>

                      {currentUser ? (
                        <button
                          onClick={() => handleRoleSwitch(null)}
                          className="flex items-center gap-2 text-left w-full px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowRoleSelector(false);
                            setCurrentTab('login-selection');
                          }}
                          className="flex items-center gap-2 text-left w-full px-3 py-2 rounded-xl text-sm font-semibold text-primary hover:bg-primary-light hover:text-primary transition-all"
                        >
                          <User className="w-4 h-4" />
                          Auth Portal Pages
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dashboard Redirect Icon */}
              {currentUser && (
                <button
                  onClick={() => setCurrentTab(`${currentUser.role}-dashboard`)}
                  className="p-2.5 rounded-xl bg-primary-light dark:bg-primary/10 text-primary transition-all relative"
                  title="Go to Dashboard"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-ping"></span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-900" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-800/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {/* Home */}
              <button
                onClick={() => {
                  setCurrentTab('home');
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${currentTab === 'home'
                    ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                Home
              </button>

              {/* About Subpages Collapsible */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${currentTab.startsWith('about-')
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <span>About</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileAboutOpen && (
                  <div className="mx-2 mb-1 rounded-xl overflow-hidden border border-slate-200/30 dark:border-slate-800/40">
                    <div className="px-4 py-2 bg-secondary">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Sections</p>
                    </div>
                    <div className="p-2 space-y-0.5 bg-slate-50/50 dark:bg-slate-950/20">
                      {aboutSubpages.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = currentTab === `about-${sub.id}`;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentTab(`about-${sub.id}`);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                ? 'bg-primary text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800'
                              }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                              <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                            </span>
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Subpages Collapsible */}
              <div>
                <button
                  onClick={() => setMobileAcademicOpen(!mobileAcademicOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${currentTab.startsWith('academic-')
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <span>Academic</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAcademicOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileAcademicOpen && (
                  <div className="mx-2 mb-1 rounded-xl overflow-hidden border border-slate-200/30 dark:border-slate-800/40">
                    <div className="px-4 py-2 bg-secondary">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Academics</p>
                    </div>
                    <div className="p-2 space-y-0.5 bg-slate-50/50 dark:bg-slate-950/20">
                      {academicSubpages.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = currentTab === `academic-${sub.id}`;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentTab(`academic-${sub.id}`);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                ? 'bg-primary text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800'
                              }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                              <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                            </span>
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Corner Collapsible */}
              <div>
                <button
                  onClick={() => setMobileStudentCornerOpen(!mobileStudentCornerOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${currentTab.startsWith('student-')
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <span>Student Corner</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileStudentCornerOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileStudentCornerOpen && (
                  <div className="mx-2 mb-1 rounded-xl overflow-hidden border border-slate-200/30 dark:border-slate-800/40">
                    <div className="px-4 py-2 bg-secondary">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Campus Life & Activities</p>
                    </div>
                    <div className="p-2 space-y-0.5 bg-slate-50/50 dark:bg-slate-950/20">
                      {studentCornerSubpages.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = currentTab === `student-${sub.id}` || 
                          (sub.id === 'events' && currentTab === 'events') ||
                          (sub.id === 'stories' && currentTab === 'stories') ||
                          (sub.id === 'careers' && currentTab === 'jobs');
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (sub.id === 'events') {
                                setCurrentTab('events');
                              } else if (sub.id === 'stories') {
                                setCurrentTab('stories');
                              } else if (sub.id === 'careers') {
                                setCurrentTab('jobs');
                              } else {
                                setCurrentTab(`student-${sub.id}`);
                              }
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                ? 'bg-primary text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800'
                              }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                              <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                            </span>
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Custom Dropdowns (Mobile) — 3 levels */}
              {customPages.filter(p => p.menu_type === 'parent').map((parent) => {
                const isMobileOpen = mobileCustomDropdownId === parent.id;
                const children = customPages.filter(p =>
                  (p.menu_type === 'child' || p.menu_type === 'sub-parent') && p.parent_menu === parent.id
                );
                const isActive = currentTab.startsWith(`custmenu__${parent.id}__`);
                return (
                  <div key={parent.id}>
                    <button
                      onClick={() => { setMobileCustomDropdownId(isMobileOpen ? null : parent.id); setMobileSubDropdownId(null); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${isActive
                          ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                          : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                      <span>{parent.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isMobileOpen && (
                      <div className="mx-2 mb-1 rounded-xl overflow-hidden border border-slate-200/30 dark:border-slate-800/40">
                        <div className="px-4 py-2 bg-secondary">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{parent.title}</p>
                        </div>
                        <div className="p-2 space-y-0.5 bg-slate-50/50 dark:bg-slate-950/20">
                          {children.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic p-3 text-center">No subpages created.</p>
                          ) : (
                            children.map((child) => {
                              const isChildActive = currentTab.startsWith(`custmenu__${parent.id}__${child.id}`);
                              const subChildren = customPages.filter(p => p.menu_type === 'sub-child' && p.parent_menu === child.id);
                              const hasSubChildren = subChildren.length > 0;
                              const isMobileSubOpen = mobileSubDropdownId === child.id;

                              return (
                                <div key={child.id}>
                                  <button
                                    onClick={() => {
                                      if (hasSubChildren) {
                                        setMobileSubDropdownId(isMobileSubOpen ? null : child.id);
                                      } else {
                                        setCurrentTab(`custmenu__${parent.id}__${child.id}`);
                                        setIsOpen(false);
                                      }
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isChildActive
                                        ? 'bg-primary text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isChildActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <FileText className={`w-3.5 h-3.5 ${isChildActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                                      </span>
                                      <span className="truncate">{child.title}</span>
                                    </div>
                                    {hasSubChildren && (
                                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isMobileSubOpen ? 'rotate-180' : ''} ${isChildActive ? 'text-white/70' : 'text-slate-400'}`} />
                                    )}
                                  </button>

                                  {/* Level-3 mobile accordion */}
                                  {hasSubChildren && isMobileSubOpen && (
                                    <div className="ml-4 mt-0.5 mb-0.5 border-l-2 border-primary/20 pl-3 space-y-0.5">
                                      {subChildren.map(sub => {
                                        const isSubActive = currentTab === `custmenu__${parent.id}__${child.id}__${sub.id}`;
                                        return (
                                          <button
                                            key={sub.id}
                                            onClick={() => {
                                              setCurrentTab(`custmenu__${parent.id}__${child.id}__${sub.id}`);
                                              setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isSubActive
                                                ? 'bg-primary text-white'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10'
                                              }`}
                                          >
                                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                                            <span className="truncate">{sub.title}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Top-level: Alumni, Donations, Contact */}
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${currentTab === link.id
                      ? 'text-primary bg-primary-light/50 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2"></div>

              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setCurrentTab(`${currentUser.role}-dashboard`);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-primary hover:bg-primary-light"
                  >
                    My {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleRoleSwitch(null);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out ({currentUser.full_name})
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setCurrentTab('login-selection');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-base font-bold text-primary hover:bg-primary-light"
                >
                  <User className="w-5 h-5" />
                  Portal Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
