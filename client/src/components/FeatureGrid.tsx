import React, { useEffect } from 'react';
import { Sparkles, Trophy, Calendar, Users, Target, Award } from 'lucide-react';
import { useTheme } from './ThemeManager';

interface FeatureCard {
  id: number;
  image: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  tag: string;
}

const DEFAULT_FEATURES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80",
    title: "Inter-Collegiate Tournaments",
    description: "Organizing prestigious zonal, inter-zonal, and state-level sports competitions for student-athletes.",
    tag: "Competitions"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    title: "Sports Calendar & Schedules",
    description: "Access accurate schedules, entry dates, brackets, and fixtures for the entire academic year.",
    tag: "Schedules"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&auto=format&fit=crop&q=80",
    title: "Dynamic Results Portal",
    description: "Real-time updates of tournament standings, team rosters, scoreboards, and merit notifications.",
    tag: "Real-Time Updates"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
    title: "Alumni & Sports Mentorship",
    description: "Connecting champion alumni with current athletes for career guidance, training support, and placements.",
    tag: "Community"
  }
];

const ICONS = [
  <Trophy className="w-5 h-5 text-amber-500" />,
  <Calendar className="w-5 h-5 text-blue-500" />,
  <Target className="w-5 h-5 text-violet-500" />,
  <Users className="w-5 h-5 text-emerald-500" />
];

export const FeatureGrid: React.FC = () => {
  const { settings } = useTheme();

  // Update SEO metadata dynamically
  useEffect(() => {
    const originalTitle = document.title;
    const targetTitle = "Pune City Zone Sports Committee | Apex University Portal";
    document.title = targetTitle;
    
    const titleInterval = setInterval(() => {
      if (document.title !== targetTitle) {
        document.title = targetTitle;
      }
    }, 100);
    
    // Manage meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const originalDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', 'Explore inter-collegiate sports tournaments, upcoming match draws, latest results, and career opportunities at Pune City Zone Sports Committee.');

    // Manage meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    const originalKeywords = metaKeywords.getAttribute('content') || '';
    metaKeywords.setAttribute('content', 'sports committee, pune city zone, tournaments, match draws, circulars, announcements, apex university');

    return () => {
      clearInterval(titleInterval);
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', originalDesc);
      if (metaKeywords) metaKeywords.setAttribute('content', originalKeywords);
    };
  }, []);

  // Parse dynamic features from database settings context
  let features: FeatureCard[] = [];
  try {
    if (settings.zonal_features) {
      features = JSON.parse(settings.zonal_features);
    }
  } catch (err) {
    console.error("Failed to parse settings.zonal_features JSON:", err);
  }

  if (!features || features.length === 0) {
    features = DEFAULT_FEATURES;
  }

  // Prepend icons based on index
  const renderedFeatures = features.slice(0, 4).map((f, idx) => ({
    ...f,
    icon: ICONS[idx % ICONS.length] || <Award className="w-5 h-5 text-primary" />
  }));

  return (
    <section className="py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Dynamic Sports Portal
        </span>
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white sm:text-4xl">
          {settings.zonal_features_header || "Core Zonal Features"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          {settings.zonal_features_desc || "Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities."}
        </p>
      </div>

      {/* Feature Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderedFeatures.map((item) => (
          <div 
            key={item.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:border-primary/40 hover:shadow-xl transition-all duration-300 text-left"
          >
            {/* Image section with Zoom Hover effect */}
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-slate-950/20 z-10 transition-opacity group-hover:opacity-10" />
              <img 
                src={item.image} 
                alt={item.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-slate-950/70 text-white uppercase tracking-wider backdrop-blur-xs">
                {item.tag}
              </span>
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Decorative button */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-primary uppercase tracking-wider hover:underline cursor-pointer">
                  Explore Zonal Program &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
