import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeManager';
import { Sun, Moon, Menu, X, GraduationCap, ChevronDown, User, LogOut, Bell, Info, Users, Activity, FileText, BookOpen, CalendarDays, Trophy, ShieldCheck, UserCheck, FileSpreadsheet, Home, FlaskConical, FolderOpen, Star, Newspaper, Briefcase, Building2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, currentUser, setCurrentUser }) => {
  const { settings, darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(false);
  const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false);
  const [studentCornerOpen, setStudentCornerOpen] = useState(false);
  const [mobileStudentCornerOpen, setMobileStudentCornerOpen] = useState(false);

  const aboutSubpages = [
    { id: 'about_us', label: 'About Us', icon: Info, badge: 'Organisation' },
    { id: 'committee', label: 'Committee', icon: Users, badge: 'Governance' },
    { id: 'hods', label: 'From HODs/Directors Desk', icon: Home, badge: 'Leadership' },
    { id: 'director', label: 'Director of Phy. Edu.', icon: Activity, badge: 'Leadership' },
    { id: 'circulars', label: 'Circulars', icon: FileText, badge: 'Notices' },
    { id: 'ncte', label: 'NCTE Mandatory Disclosures', icon: ShieldCheck, badge: 'Regulatory' },
    { id: 'facilities', label: 'Facilities', icon: Building2, badge: 'Infrastructure' },
  ];

  const academicSubpages = [
    { id: 'courses', label: 'Academic Courses', icon: BookOpen, badge: 'Programs' },
    { id: 'admission', label: 'Admissions Notice', icon: UserCheck, badge: 'Enrollment' },
    { id: 'syllabus', label: 'Curriculum Syllabus', icon: FileSpreadsheet, badge: 'Curriculum' },
    { id: 'academic_results', label: 'Academic Results', icon: Trophy, badge: 'Academic' },
  ];

  const studentCornerSubpages = [
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
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { id: 'directory', label: 'Alumni' },
    { id: 'donations', label: 'Donations' },
    { id: 'contact', label: 'Contact' }
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
      <div className="bg-secondary text-white/70 border-b border-white/5 py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-2">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-5 text-[10px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              📞 +953 012 3654 896
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              ✉️ support@apex.edu
            </span>
          </div>

          {/* Right: Quick Social Shortcuts */}
          <div className="flex items-center gap-4 text-[10px] font-semibold">
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 glass-card bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & University Name */}
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
                        const isActive = currentTab === `student-${sub.id}`;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentTab(`student-${sub.id}`);
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
                        const isActive = currentTab === `student-${sub.id}`;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentTab(`student-${sub.id}`);
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
