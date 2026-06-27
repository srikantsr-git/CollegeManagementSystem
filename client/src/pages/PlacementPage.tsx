import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, TrendingUp, Award, Building2, Users, Star,
  ChevronRight, ArrowRight, Sparkles, Globe, Target, BarChart3
} from 'lucide-react';

interface PlacementContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  content: string;
  stat_placed: number;
  stat_companies: number;
  stat_package_avg: string;
  stat_package_highest: string;
}

interface Company {
  id: number;
  name: string;
  logo_url: string;
  website: string;
  sort_order: number;
}

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return value;
}

// Fallback placeholder for company without logo
const CompanyLogo: React.FC<{ company: Company }> = ({ company }) => {
  const [hasError, setHasError] = useState(false);
  const colors = ['from-violet-500 to-purple-600', 'from-blue-500 to-cyan-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600', 'from-indigo-500 to-blue-600'];
  const colorClass = colors[company.id % colors.length];
  if (!company.logo_url || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${colorClass} rounded-2xl`}>
        <span className="text-white font-black text-lg tracking-tight text-center px-2 leading-tight">{company.name.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }
  return (
    <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-3"
      onError={() => setHasError(true)} />
  );
};

const PlacementPage: React.FC = () => {
  const [content, setContent] = useState<PlacementContent | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const placedCount = useCounter(content?.stat_placed || 0, 2200, statsVisible);
  const companiesCount = useCounter(content?.stat_companies || 0, 1800, statsVisible);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/api/placement/content').then(r => r.ok ? r.json() : null),
      fetch('http://localhost:5001/api/placement/companies').then(r => r.ok ? r.json() : []),
    ]).then(([c, comp]) => {
      if (c) setContent(c);
      if (comp) setCompanies(comp);
    }).catch(console.warn).finally(() => setLoading(false));
  }, []);

  // Intersection observer for stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const scrollItems = companies.length > 0 ? [...companies, ...companies, ...companies] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">Loading Placements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 space-y-0 text-left">

      {/* ─── HERO SECTION ─── */}
      <div className="relative overflow-hidden rounded-3xl mb-12"
        style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 60%, #7c3aed 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-white/10" />

        {/* Animated grid dots */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative px-8 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] bg-white/15 text-white/90 px-3 py-1.5 rounded-full border border-white/20">
                <Sparkles className="w-3 h-3" /> Training & Placement Cell
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-none mb-4 tracking-tight">
              {content?.hero_title || 'Placements'}
            </h1>
            <p className="text-white/75 text-base font-medium leading-relaxed max-w-lg mb-8">
              {content?.hero_subtitle || 'Building careers, shaping futures'}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-2xl px-5 py-2.5 text-white text-sm font-bold backdrop-blur-sm transition-all cursor-default">
                <Target className="w-4 h-4" /> Career Counselling
              </div>
              <div className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-2xl px-5 py-2.5 text-white text-sm font-bold backdrop-blur-sm transition-all cursor-default">
                <Globe className="w-4 h-4" /> Global Recruiters
              </div>
              <div className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-2xl px-5 py-2.5 text-white text-sm font-bold backdrop-blur-sm transition-all cursor-default">
                <BarChart3 className="w-4 h-4" /> Industry Training
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS SECTION ─── */}
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          {
            icon: Users, label: 'Students Placed', value: placedCount.toLocaleString(), suffix: '+',
            color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800/40'
          },
          {
            icon: Building2, label: 'Recruiting Companies', value: companiesCount.toLocaleString(), suffix: '+',
            color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800/40'
          },
          {
            icon: TrendingUp, label: 'Average Package', value: content?.stat_package_avg || '0 LPA', suffix: '',
            color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/40'
          },
          {
            icon: Award, label: 'Highest Package', value: content?.stat_package_highest || '0 LPA', suffix: '',
            color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800/40'
          }
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden ${stat.bg} border ${stat.border} rounded-3xl p-6 group hover:shadow-lg transition-all duration-500 hover:-translate-y-1`}>
            <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-125`} />
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tabular-nums">
              {stat.value}{stat.suffix}
            </p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── CONTENT SECTION ─── */}
      {content?.content && (
        <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">Placement Overview</h2>
              <p className="text-xs text-slate-400 font-semibold">Connecting students with opportunities</p>
            </div>
          </div>

          <div
            className="prose prose-sm sm:prose max-w-none dark:prose-invert
              prose-headings:font-extrabold prose-headings:text-slate-800 dark:prose-headings:text-white
              prose-h2:text-lg prose-h2:mb-3 prose-h2:mt-6
              prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
              prose-strong:text-slate-800 dark:prose-strong:text-white
              prose-ul:text-slate-600 dark:prose-ul:text-slate-400
              prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      )}

      {/* ─── COMPANY MARQUEE SCROLL ─── */}
      {companies.length > 0 && (
        <div className="space-y-6">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" /> Our Recruiters
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {companies.length} companies trust our graduates
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Top Recruiters
            </div>
          </div>

          {/* Scrolling rows container */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 p-6 shadow-sm">
            {/* Left & Right fade masks */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Row 1 — scrolls LEFT */}
            <div className="overflow-hidden mb-4">
              <div className="flex gap-4 animate-marquee-left w-max">
                {scrollItems.map((company, idx) => (
                  <a
                    key={`l-${company.id}-${idx}`}
                    href={company.website || '#'}
                    target={company.website ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    title={company.name}
                    className="group flex-shrink-0 w-28 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <CompanyLogo company={company} />
                  </a>
                ))}
              </div>
            </div>

            {/* Row 2 — scrolls RIGHT */}
            <div className="overflow-hidden">
              <div className="flex gap-4 animate-marquee-right w-max">
                {[...scrollItems].reverse().map((company, idx) => (
                  <a
                    key={`r-${company.id}-${idx}`}
                    href={company.website || '#'}
                    target={company.website ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    title={company.name}
                    className="group flex-shrink-0 w-28 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <CompanyLogo company={company} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Company name pills */}
          <div className="flex flex-wrap gap-2">
            {companies.map(c => (
              <span key={c.id}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-default">
                <Building2 className="w-3 h-3" /> {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── EMPTY COMPANIES ─── */}
      {companies.length === 0 && !loading && (
        <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary/40" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Recruiter logos will appear here once added by admin.</p>
        </div>
      )}
    </div>
  );
};

export default PlacementPage;
