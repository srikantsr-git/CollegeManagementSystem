import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../components/ThemeManager';
import { Event } from '../types';
import { 
  Users, Globe, CheckCircle, Building2, Calendar, 
  ArrowRight, ArrowRight as ArrowRightIcon, Award, Newspaper, Star, Sparkles,
  ChevronLeft, ChevronRight, Briefcase, FileText
} from 'lucide-react';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
  currentUser: any;
}

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

// ─── CSS keyframes injected once ──────────────────────────────────────────────
const SLIDER_STYLE = `
@keyframes heroFadeUp {
  0% { opacity: 0; transform: translateY(30px); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes heroFadeDown {
  0% { opacity: 0; transform: translateY(-20px); letter-spacing: 0.05em; }
  100% { opacity: 1; transform: translateY(0); letter-spacing: 0.15em; }
}
@keyframes heroFadeLeft {
  0% { opacity: 0; transform: translateX(-30px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes heroScaleIn {
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes verticalMarquee {
  0% { transform: translateY(0%); }
  100% { transform: translateY(-50%); }
}
.hero-tag-anim { animation: heroFadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.15s; }
.hero-h1-anim  { animation: heroFadeUp   0.9s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.3s; }
.hero-p-anim   { animation: heroFadeLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.5s; }
.hero-cta-anim { animation: heroScaleIn  0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.7s; }
.vertical-marquee-anim { animation: verticalMarquee 22s linear infinite; }
.vertical-marquee-anim:hover { animation-play-state: paused; }
`;

const DEFAULT_SLIDES = [
  {
    id: 1, sort_order: 1,
    title: 'Excellence in Sports',
    subtitle: 'Pune City Zone Sports Committee',
    description: 'Promoting athletic excellence and organizing collegiate tournaments across Pune City Zone.',
    btn_text: 'Explore Events', btn_link: 'events',
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80',
    overlay_opacity: 0.55, active: 1
  },
  {
    id: 2, sort_order: 2,
    title: 'Champion Athletes',
    subtitle: 'Nurturing the Stars of Tomorrow',
    description: 'Our programs develop physical fitness, sportsmanship, and competitive spirit among thousands of students.',
    btn_text: 'About Committee', btn_link: 'about-about_us',
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=80',
    overlay_opacity: 0.6, active: 1
  },
  {
    id: 3, sort_order: 3,
    title: 'Annual Sports Calendar',
    subtitle: 'Inter-Collegiate Tournaments',
    description: 'View the complete schedule of zonal, district, and state-level sports events for 2025-26.',
    btn_text: 'View Calendar', btn_link: 'about-calendar',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80',
    overlay_opacity: 0.5, active: 1
  }
];

export const Home: React.FC<HomeProps> = ({ setCurrentTab, currentUser }) => {
  const { settings } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([
    {
      name: 'John Doe',
      role: 'Staff Software Engineer at Google',
      grad: 'Class of 2012 (Computer Science)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80',
      text: '"My years at Apex University formed the bedrock of my engineering career. The alumni network opened doors to my first internships, which eventually led me to Google. Serving as a mentor now is my way of giving back."'
    },
    {
      name: 'Jane Smith',
      role: 'Vice President at Goldman Sachs',
      grad: 'Class of 2014 (Business Management)',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80',
      text: '"The mentorship and rigorous education I received set me up to tackle the challenges of Wall Street. The community is incredibly supportive, and I am proud to sponsor scholarship funds for future business leaders."'
    },
    {
      name: 'Robert Chen',
      role: 'Senior Architect at Foster + Partners',
      grad: 'Class of 2010 (Architecture)',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80',
      text: '"Design is collaborative, and the creative environment at Apex taught me to push boundaries. Reconnecting with alumni in Europe helped establish my career abroad. It is a lifelong community."'
    }
  ]);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [heroSlides, setHeroSlides] = useState<any[]>(DEFAULT_SLIDES);
  const [slideKey, setSlideKey] = useState(0); // force re-mount for re-animation

  // Inject slider CSS keyframes once
  useEffect(() => {
    if (document.getElementById('hero-slider-styles')) return;
    const style = document.createElement('style');
    style.id = 'hero-slider-styles';
    style.textContent = SLIDER_STYLE;
    document.head.appendChild(style);
  }, []);

  // Fetch slides from API
  useEffect(() => {
    fetch('http://localhost:5001/api/slider')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const active = data.filter((s: any) => s.active);
        if (active.length > 0) setHeroSlides(active);
      })
      .catch(() => {});
  }, []);

  // Auto-advance with restart on manual change
  const goToSlide = (idx: number) => {
    setActiveHeroIdx(idx);
    setSlideKey(k => k + 1);
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIdx(prev => {
        const next = (prev + 1) % heroSlides.length;
        setSlideKey(k => k + 1);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [activeHeroIdx, heroSlides.length]);

  const [newsList, setNewsList] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // Fetch events list from server API
  useEffect(() => {
    fetch('http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => setEvents(data.slice(0, 3)))
      .catch(err => console.warn('Could not load events from server:', err));
  }, []);

  // Fetch dynamic news feed
  useEffect(() => {
    fetch('http://localhost:5001/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsList(data);
        } else {
          setNewsList(staticNews);
        }
      })
      .catch(err => {
        console.warn('Could not load news from server:', err);
        setNewsList(staticNews);
      });
  }, []);

  // Fetch dynamic alumni spotlights
  useEffect(() => {
    fetch('http://localhost:5001/api/spotlights')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSuccessStories(data);
        }
      })
      .catch(err => console.warn('Could not load spotlights from server:', err));
  }, []);

  const staticNews = [
    {
      id: 1,
      title: 'Apex University Launches Center for Artificial Intelligence',
      date: '2026-06-18',
      description: 'A state-of-the-art AI laboratory funded by a generous $5M donation from our tech alumni panel.',
      image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80'
    },
    {
      id: 2,
      title: 'Annual Alumni Awards Ceremony Announced',
      date: '2026-05-30',
      description: 'Nominate outstanding graduates for leadership, innovation, and community service. Submissions close July 31.',
      image_url: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=500&q=80'
    },
    {
      id: 3,
      title: 'New Sports Complex Construction Begins',
      date: '2026-06-10',
      description: 'Construction has officially started on our new multi-purpose sports complex, sponsored by class of 2014.',
      image_url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80'
    }
  ];

  const stats = [
    { label: 'Total Alumni Network', val: '15,000+', icon: Users },
    { label: 'Countries Represented', val: '45+', icon: Globe },
    { label: 'Active Association Members', val: '5,200+', icon: CheckCircle },
    { label: 'Companies Employing Alumni', val: '350+', icon: Building2 }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Full Width Hero Slider and Notices column */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 pb-12 bg-slate-50 dark:bg-slate-900/10 border-b border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

          {/* ── Hero Slider (75%) ──────────────────────────────────────────── */}
          <section className="lg:col-span-3 relative overflow-hidden rounded-3xl h-[500px] shadow-2xl bg-black">
            {/* Background images with cross-fade transition */}
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url('${slide.image_url}')`,
                  opacity: activeHeroIdx === idx ? 1 : 0,
                  transform: activeHeroIdx === idx ? 'scale(1.06)' : 'scale(1)',
                  zIndex: activeHeroIdx === idx ? 1 : 0,
                }}
              />
            ))}

            {/* Dark overlay — configurable opacity stored in slide data */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-1000"
              style={{
                opacity: heroSlides[activeHeroIdx].overlay_opacity ?? 0.55,
                zIndex: 2
              }}
            />

            {/* Subtle gradient vignette at bottom for text legibility */}
            <div 
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
              style={{ zIndex: 3 }}
            />

            {/* ── Slide Content ── */}
            <div
              key={`content-${slideKey}`}
              className="absolute inset-0 z-10 flex flex-col items-start justify-end px-8 sm:px-12 pb-16"
            >
              {/* Subtitle / tag */}
              <span className="hero-tag-anim inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/90 text-white uppercase tracking-widest shadow-md">
                <Sparkles className="w-3 h-3" />
                {heroSlides[activeHeroIdx].subtitle || 'Sports Portal'}
              </span>

              {/* Main title */}
              <h1 className="hero-h1-anim text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white max-w-xl uppercase drop-shadow-lg">
                {heroSlides[activeHeroIdx].title}
              </h1>

              {/* Description */}
              <p className="hero-p-anim mt-3 text-[11px] sm:text-xs text-white/75 max-w-lg font-light leading-relaxed">
                {heroSlides[activeHeroIdx].description}
              </p>

              {/* CTA Button */}
              <div className="hero-cta-anim mt-5 flex items-center gap-3">
                <button
                  onClick={() => {
                    const link = heroSlides[activeHeroIdx].btn_link;
                    if (link) setCurrentTab(link);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  {heroSlides[activeHeroIdx].btn_text || 'Learn More'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Left/Right Arrow Controls ── */}
            <button
              onClick={() => goToSlide((activeHeroIdx - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goToSlide((activeHeroIdx + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* ── Slide Counter Badge (top right) ── */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white/70 tracking-widest">
              {String(activeHeroIdx + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
            </div>

            {/* ── Dot Indicators ── */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    activeHeroIdx === idx
                      ? 'bg-primary w-6 h-2'
                      : 'bg-white/40 hover:bg-white/70 w-2 h-2'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </section>

          {/* ── News & Notices (25%) ─────────────────────────────────────── */}

        <section className="lg:col-span-1 glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-5 flex flex-col justify-between h-[520px] overflow-hidden bg-white/70 dark:bg-slate-900/70 shadow-2xl">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight uppercase">News & Notices</h3>
              </div>
              <span className="text-[9px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live Ticker</span>
            </div>
            
            {/* Vertical Marquee Container */}
            <div className="flex-1 overflow-hidden relative group">
              {newsList.length > 0 ? (
                <div className="vertical-marquee-anim space-y-3.5 pt-1">
                  {(newsList.length < 4 ? [...newsList, ...newsList, ...newsList, ...newsList] : [...newsList, ...newsList]).map((news, idx) => (
                    <div 
                      key={`${news.id}-${idx}`} 
                      onClick={() => setSelectedNews(news)}
                      className="p-3.5 bg-slate-50 hover:bg-primary-light/35 dark:bg-slate-950/20 dark:hover:bg-primary/5 rounded-2xl border border-slate-100 dark:border-slate-850 hover:border-primary/30 transition-all cursor-pointer group/card flex flex-col text-left shadow-sm"
                    >
                      <span className="text-[9px] text-primary font-bold uppercase tracking-widest mb-1.5 block">
                        {new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-100 leading-snug group-hover/card:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-light">
                        {stripHtml(news.description)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <Newspaper className="w-8 h-8 mx-auto mb-2 text-slate-350 opacity-40 animate-pulse" />
                  <p className="text-xs font-semibold">No recent announcements</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      </div>

      {/* Bounded Homepage content wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Careers */}
          <div 
            onClick={() => setCurrentTab('jobs')}
            className="group relative glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 flex flex-col justify-between min-h-[260px] cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary-light/50 dark:bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 tracking-tight mb-2 group-hover:text-primary transition-colors duration-250">
                Browse Careers
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-light max-w-[240px]">
                Explore job openings and internship opportunities posted by our global alumni network.
              </p>
            </div>
            <span className="text-left font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5 mt-6 group-hover:gap-2.5 transition-all">
              Explore Careers <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Card 2: Directory */}
          <div 
            onClick={() => setCurrentTab('directory')}
            className="group relative glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 hover:border-sky-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-550/5 hover:-translate-y-1.5 flex flex-col justify-between min-h-[260px] cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 tracking-tight mb-2 group-hover:text-sky-500 transition-colors duration-250">
                Alumni Directory
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-light max-w-[240px]">
                Search classmate registries, verify graduation indices, and establish professional links.
              </p>
            </div>
            <span className="text-left font-bold text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mt-6 group-hover:gap-2.5 transition-all">
              Search Classmates <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Card 3: Mentorship */}
          <div 
            onClick={() => { if (currentUser) setCurrentTab(`${currentUser.role}-dashboard`); else setCurrentTab('login-selection'); }}
            className="group relative glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-550/5 hover:-translate-y-1.5 flex flex-col justify-between min-h-[260px] cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 tracking-tight mb-2 group-hover:text-violet-500 transition-colors duration-250">
                Expert Mentorship
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-light max-w-[240px]">
                Register as an alumni mentor or request 1-on-1 career guidance sessions with students.
              </p>
            </div>
            <span className="text-left font-bold text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5 mt-6 group-hover:gap-2.5 transition-all">
              Match Mentors <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </section>

      {/* Statistics Ticker */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-primary-light dark:bg-primary/10 rounded-xl mb-4 text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{s.val}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* Success Stories Slider */}
      <section className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Alumni Spotlight & Success</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 min-h-[250px]">
          {successStories[activeStoryIdx].photo ? (
            <img 
              src={successStories[activeStoryIdx].photo} 
              alt={successStories[activeStoryIdx].name} 
              className="w-48 h-48 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
            />
          ) : (
            <div className="w-48 h-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
              <Users className="w-16 h-16 text-slate-300 dark:text-slate-700 animate-float" />
            </div>
          )}
          <div className="text-left space-y-4">
            <div className="text-lg italic text-slate-600 dark:text-slate-300 leading-relaxed font-light html-content"
              dangerouslySetInnerHTML={{ __html: successStories[activeStoryIdx].text }}
            />
            <div>
              <h4 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                {successStories[activeStoryIdx].name}
                <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                  Spotlight
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{successStories[activeStoryIdx].role}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{successStories[activeStoryIdx].grad}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {successStories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStoryIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeStoryIdx === idx ? 'bg-primary w-6' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Events & News Side-by-Side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" /> Upcoming Events
            </h2>
            <button 
              onClick={() => setCurrentTab('events')} 
              className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((evt) => (
                <div key={evt.id} className="glass-card p-4 rounded-2xl flex gap-4 items-center border border-slate-200/50 dark:border-slate-800/40">
                  <div className="w-16 h-16 rounded-xl bg-primary-light/50 dark:bg-primary/10 flex flex-col items-center justify-center flex-shrink-0 text-primary">
                    <span className="text-xs font-extrabold uppercase leading-none">{evt.type}</span>
                    <span className="text-xs font-extrabold mt-1">{evt.date.split('-')[2]}</span>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{evt.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold truncate">📍 {evt.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No upcoming events listed.</p>
            )}
          </div>
        </div>
        {/* News Feed */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" /> Latest University News
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newsList.slice(0, 4).map((n) => (
              <div 
                key={n.id} 
                onClick={() => setSelectedNews(n)}
                className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/40 flex flex-col cursor-pointer hover:shadow-lg transition-shadow group text-left"
              >
                {n.image_url && <img src={n.image_url} alt={n.title} className="w-full h-32 object-cover" />}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(n.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-1 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {n.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed font-light">{stripHtml(n.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation CTA Banner */}
      <section className="bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-primary/20">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xs"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Invest in the Future of Apex</h2>
            <p className="text-sm text-white/80 max-w-xl">
              Your charitable contributions enable key university development projects, fund underprivileged student scholarships, and establish world-class research institutions.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('donations')}
            className="btn-accent px-8 py-3.5 text-base flex-shrink-0"
          >
            Contribute Online
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>
      </div>

      {/* Selected News Details Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200">
          <div className="glass-card max-w-lg w-full rounded-3xl border border-slate-200/50 dark:border-slate-850 bg-white/95 dark:bg-slate-900/95 overflow-hidden shadow-2xl relative text-left">
            {selectedNews.image_url && (
              <img 
                src={selectedNews.image_url} 
                alt={selectedNews.title} 
                className="w-full h-44 object-cover" 
              />
            )}
            <div className="p-6 space-y-4">
              <span className="text-[10px] text-primary font-extrabold uppercase tracking-widest">
                Announcement • {new Date(selectedNews.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-snug">
                {selectedNews.title}
              </h3>
              <div className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-light max-h-60 overflow-y-auto pr-1 html-content"
                dangerouslySetInnerHTML={{ __html: selectedNews.description }}
              />

              {selectedNews.file_url && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 dark:border-primary/10 flex items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Attached Notice Document</p>
                      <p className="text-[10px] text-slate-500 truncate">{selectedNews.file_name || 'Download attachment'}</p>
                    </div>
                  </div>
                  <a
                    href={selectedNews.file_url}
                    download={selectedNews.file_name || 'notice-document.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-1.5 px-4 text-[10px] font-extrabold shadow-sm shrink-0 cursor-pointer text-center"
                  >
                    Download / View
                  </a>
                </div>
              )}
              
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="btn-primary text-xs px-6 py-2.5 font-bold cursor-pointer"
                >
                  Dismiss Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
