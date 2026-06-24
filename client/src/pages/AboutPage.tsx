import React, { useState, useEffect } from 'react';
import {
  FileDown, User, Clock, AlertCircle, Info, Users,
  Activity, FileText, BookOpen, CalendarDays, Trophy,
  ChevronRight, ExternalLink, Loader2, Filter, Download,
  Phone, Mail, X, ShieldCheck, UserCheck, FileSpreadsheet, Eye,
  Home, Building2, FlaskConical, FolderOpen, Star, Newspaper, Briefcase
} from 'lucide-react';

interface AboutPageProps {
  subpageId: string;
  setCurrentTab?: (tab: string) => void;
}

interface CustomPageData {
  id: string;
  title: string;
  content: string;
  file_url: string | null;
  file_name: string | null;
  updated_at: string;
}

interface ResultItem {
  id: number;
  title: string;
  description: string;
  date: string;
  sport: string;
  category: string;
  file_url: string | null;
  file_name: string | null;
}

// â”€â”€â”€ Sub-page metadata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ABOUT_PAGES = [
  { id: 'about_us',         group: 'about',   label: 'About Us',                   icon: Info,            color: 'from-blue-600 to-indigo-700',    badge: 'Organisation', description: 'Learn who we are, our vision and our mission.' },
  { id: 'committee',        group: 'about',   label: 'PCZSC Committee',            icon: Users,           color: 'from-emerald-600 to-teal-700',   badge: 'Governance',   description: 'Meet the dedicated committee members guiding PCZSC.' },
  { id: 'hods',             group: 'about',   label: 'From HODs/Directors Desk',   icon: Home,            color: 'from-sky-600 to-blue-700',       badge: 'Leadership',   description: 'Messages from Heads of Departments and Directors.' },
  { id: 'director',         group: 'about',   label: 'Director of Phy. Edu.',      icon: Activity,        color: 'from-violet-600 to-purple-700',  badge: 'Leadership',   description: 'Message and profile of the Director of Physical Education.' },
  { id: 'circulars',        group: 'about',   label: 'Circulars',                  icon: FileText,        color: 'from-amber-500 to-orange-600',   badge: 'Notices',      description: 'Official circulars and administrative announcements.' },
  { id: 'ncte',             group: 'about',   label: 'NCTE Mandatory Disclosures', icon: ShieldCheck,     color: 'from-emerald-600 to-teal-700',   badge: 'Regulatory',   description: 'NCTE compliance, recognition order, and regulatory disclosures.' },
  { id: 'facilities',       group: 'about',   label: 'Facilities',                 icon: Building2,       color: 'from-slate-600 to-gray-700',     badge: 'Infrastructure',description: 'Sports and academic facilities available on campus.' },
  { id: 'courses',          group: 'academic',label: 'Academic Courses',           icon: BookOpen,        color: 'from-blue-600 to-cyan-600',      badge: 'Programs',     description: 'Teacher training and sports science degrees offered.' },
  { id: 'admission',        group: 'academic',label: 'Admissions Notice',          icon: UserCheck,       color: 'from-purple-600 to-indigo-600',  badge: 'Enrollment',   description: 'Eligibility criteria, prospectus, and application guidelines.' },
  { id: 'syllabus',         group: 'academic',label: 'Curriculum Syllabus',        icon: FileSpreadsheet, color: 'from-teal-600 to-emerald-600',   badge: 'Curriculum',   description: 'Semester credit structures, course schemes, and syllabus files.' },
  { id: 'academic_results', group: 'academic',label: 'Academic Results',           icon: Trophy,          color: 'from-yellow-500 to-amber-600',   badge: 'Academic',     description: 'Physical education examination results and term marksheets.' },
  { id: 'events',           group: 'student', label: 'Events',                     icon: CalendarDays,    color: 'from-orange-500 to-red-600',     badge: 'Activities',   description: 'University events, reunions, technical panels, and seminars.' },
  { id: 'stories',          group: 'student', label: 'Stories',                    icon: Newspaper,       color: 'from-pink-500 to-rose-600',      badge: 'Alumni',       description: 'Inspiring stories from our alumni community.' },
  { id: 'careers',          group: 'student', label: 'Careers',                    icon: Briefcase,       color: 'from-blue-500 to-indigo-600',    badge: 'Jobs',         description: 'Career opportunities, internships, and job postings.' },
  { id: 'activities',       group: 'student', label: 'Activities',                 icon: Activity,        color: 'from-green-500 to-emerald-600',  badge: 'Campus',       description: 'Campus activities, clubs, and extracurricular programs.' },
  { id: 'research',         group: 'student', label: 'Research',                   icon: FlaskConical,    color: 'from-violet-500 to-purple-600',  badge: 'Academic',     description: 'Academic research, publications, and scholarly work.' },
  { id: 'projects',         group: 'student', label: 'Projects',                   icon: FolderOpen,      color: 'from-cyan-500 to-teal-600',      badge: 'Student',      description: 'Student projects, innovations, and academic assignments.' },
  { id: 'calendar',         group: 'student', label: 'Sports Calendar',            icon: CalendarDays,    color: 'from-cyan-500 to-sky-600',       badge: 'Schedule',     description: 'Annual sports events, fixtures and season schedule.' },
  { id: 'souvenirs',        group: 'student', label: 'Souvenirs',                  icon: Star,            color: 'from-rose-500 to-pink-600',      badge: 'Publications', description: 'Digital souvenir publications and commemorative editions.' },
  { id: 'draws',            group: 'student', label: 'Draws',                      icon: FileText,        color: 'from-blue-500 to-cyan-600',      badge: 'Draws',        description: 'Tournament draws, match brackets and game schedules.' },
  { id: 'results',          group: 'student', label: 'Results',                    icon: Trophy,          color: 'from-yellow-500 to-amber-600',   badge: 'Results',      description: 'Tournament champions, match results and standings.' },
];

function getMeta(id: string) {
  return ABOUT_PAGES.find((p) => p.id === id) ?? ABOUT_PAGES[0];
}

// â”€â”€â”€ Category badge colors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORY_COLORS: Record<string, string> = {
  Result:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Draw:      'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Fixtures:  'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  Bracket:   'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  Schedule:  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
  Standings: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
};

// â”€â”€â”€ Results Feed Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ResultsPanel: React.FC<{ mode: 'draws' | 'results' }> = ({ mode }) => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5001/api/results')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setResults(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sports = ['All', ...Array.from(new Set(results.map(r => r.sport)))];
  
  // Filter by Draws vs. Results based on mode prop
  const modeFiltered = results.filter(r => {
    const cat = (r.category || '').toLowerCase();
    const isDrawType = ['draw', 'fixtures', 'bracket', 'schedule'].includes(cat);
    if (mode === 'draws') return isDrawType;
    return !isDrawType; // results
  });

  const filtered = sportFilter === 'All' ? modeFiltered : modeFiltered.filter(r => r.sport === sportFilter);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading items...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Sport filter pills */}
      {sports.length > 2 && (
        <div className="flex flex-wrap gap-2 items-center pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {sports.map(s => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                sportFilter === s
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary-light dark:hover:bg-primary/10'
              }`}
            >{s}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-14 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No results published yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Check back soon for tournament draws and match results.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id}
              className="group glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm mt-0.5">
                  <Trophy className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-light dark:bg-primary/10 text-primary uppercase tracking-wide">
                      {r.sport}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${CATEGORY_COLORS[r.category] || 'bg-slate-100 text-slate-600'}`}>
                      {r.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                      <Clock className="w-3 h-3" />
                      {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-snug">{r.title}</h3>

                  {r.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{r.description}</p>
                  )}

                  {r.file_url && r.file_name && (
                    <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                      <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                      <a href={r.file_url} download={r.file_name}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary-light dark:bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                        <Download className="w-3 h-3" /> Download
                      </a>
                      <span className="text-[10px] text-slate-400 truncate">{r.file_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€ Academic Courses Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface CourseItem {
  id: number;
  name: string;
  category: string;
  duration: string;
  intake: number;
  sort_order: number;
}

const CoursesPanel: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/courses')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading academic courses...</p>
    </div>
  );

  const categories = ['Post Graduate Courses', 'Under Graduate & Professional Courses', 'Foundation & Certificate Courses', 'Other Courses'];

  return (
    <div className="space-y-8">
      {categories.map(category => {
        const filtered = courses.filter(c => c.category === category);
        if (filtered.length === 0) return null;
        return (
          <div key={category} className="space-y-3 text-left">
            <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-850 pb-2">
              {category}
            </h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4 w-20 text-center">Sr. No.</th>
                      <th className="p-4">Name of the Course</th>
                      <th className="p-4 w-40">Duration</th>
                      <th className="p-4 w-32 text-center">Intake</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
                    {filtered.map((course, idx) => (
                      <tr key={course.id} className="hover:bg-primary-light/10 dark:hover:bg-primary/5 transition-all">
                        <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-4 font-bold text-slate-800 dark:text-white leading-snug">{course.name}</td>
                        <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">{course.duration}</td>
                        <td className="p-4 text-center font-extrabold text-primary text-sm">{course.intake}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// â”€â”€â”€ Admissions Panel Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const getCourseMeta = (courseName: string) => {
  const name = courseName.toLowerCase();
  if (name.includes('m.p.ed')) {
    return { type: 'Post Graduate', duration: '2 Years', mode: 'CET Entrance Exam', badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' };
  } else if (name.includes('yoga education') || name.includes('fcye')) {
    return { type: 'Certificate', duration: '3 Months', mode: 'Direct (July & Jan Batches)', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' };
  } else if (name.includes('gym instructor') || name.includes('fcgi')) {
    return { type: 'Certificate', duration: '3 Months', mode: 'Direct (Jan Batch)', badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' };
  } else if (name.includes('fitness & sports') || name.includes('fcf')) {
    return { type: 'Certificate', duration: '3 Months', mode: 'Direct (July Batch)', badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400' };
  } else if (name.includes('ph.d') || name.includes('doctor of philosophy')) {
    return { type: 'Doctoral', duration: '3-6 Years', mode: 'Supervisor Approval', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' };
  }
  return { type: 'Other Program', duration: 'Varies', mode: 'Contact Office', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400' };
};

const AdmissionPanel: React.FC<{
  pageData: CustomPageData | null;
  loading: boolean;
  error: string | null;
}> = ({ loading: pageLoading }) => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [admFiles, setAdmFiles] = useState<any[]>([]);
  const [loadingAdm, setLoadingAdm] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/api/admissions').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('http://localhost:5001/api/admission-files').then(r => r.ok ? r.json() : []).catch(() => [])
    ]).then(([admData, filesData]) => {
      setAdmissions(Array.isArray(admData) ? admData : (admData ? [admData] : []));
      setAdmFiles(Array.isArray(filesData) ? filesData : []);
      setLoadingAdm(false);
    });
  }, []);

  if (loadingAdm || pageLoading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm sm:text-base text-slate-500 animate-pulse">Loading admission details...</p>
    </div>
  );

  if (admissions.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
          <UserCheck className="w-8 h-8 text-purple-500" />
        </div>
        <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400">Admission details not published yet</p>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">Check back soon for admission notices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tabular Admissions List */}
      <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-lg bg-white dark:bg-slate-900/50">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-50/50 to-indigo-50/30 dark:from-purple-950/10 dark:to-indigo-950/5 border-b border-slate-200/50 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white uppercase tracking-wider">
              Academic Admissions Notices
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare program details, eligibility criteria, and batch structures. Click any row or notice action to view details.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/30 text-[11px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200/40 dark:border-slate-800/30">
                <th className="py-3.5 px-4 sm:px-6 w-12 text-center">Sr.</th>
                <th className="py-3.5 px-4">Course Name</th>
                <th className="py-3.5 px-4 w-32">Program Type</th>
                <th className="py-3.5 px-4 w-28">Duration</th>
                <th className="py-3.5 px-4 w-44">Admission Mode</th>
                <th className="py-3.5 px-4 sm:px-6 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/20 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              {admissions.slice(0, 5).map((adm, idx) => {
                const meta = getCourseMeta(adm.course_name);
                return (
                  <tr key={adm.id} className="hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors cursor-pointer group"
                      onClick={() => setSelectedAdmission(adm)}>
                    <td className="py-4 px-4 sm:px-6 text-center font-bold text-slate-400 dark:text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-800 dark:text-white group-hover:text-primary transition-colors pr-6">
                      {adm.course_name.replace(/\s*:\s*$/, '')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide ${meta.badgeColor}`}>
                        {meta.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-500 dark:text-slate-400">
                      {meta.duration}
                    </td>
                    <td className="py-4 px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                      {meta.mode}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAdmission(adm); }}
                        className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Notice Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
          <div className="glass-card max-w-3xl w-full rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 p-6 text-white"
                 style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold bg-white/20 text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                  <BookOpen className="w-3.5 h-3.5 text-white" /> Admission
                </span>
                <h3 className="font-black text-base sm:text-lg leading-snug">
                  {selectedAdmission.course_name.replace(/\s*:\s*$/, '')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] text-sm sm:text-base text-slate-700 dark:text-slate-350 bg-white dark:bg-slate-900 leading-relaxed scrollbar-thin">
              {selectedAdmission.intro_text ? (
                <div
                  className="admission-content whitespace-normal text-slate-700 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: selectedAdmission.intro_text }}
                />
              ) : (
                <div className="text-center py-10 text-slate-400">No descriptive text available.</div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/40 flex justify-end">
              <button
                onClick={() => setSelectedAdmission(null)}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 font-bold uppercase tracking-wider cursor-pointer shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PDF Documents List ── */}
      {admFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700/40" />
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wide">
              <FileDown className="w-3 h-3" /> Downloads &amp; Notices
            </span>
            <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700/40" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {admFiles.map((f) => (
              <div key={f.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 glass-card rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/5 group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <FileDown className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-tight">{f.title}</p>
                    {f.file_name && <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide truncate">{f.file_name}</p>}
                  </div>
                </div>
                {f.file_url && (
                  <div className="flex gap-2 shrink-0">
                    <a href={f.file_url} download={f.file_name || 'document.pdf'}
                      className="btn-primary text-xs py-2 px-4 font-bold gap-1.5 shadow-md">
                      <FileDown className="w-3.5 h-3.5 text-white" /> Download
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// --- Circulars Feed Component ---
// â”€â”€â”€ Circulars Feed Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CircularsPanel: React.FC = () => {
  const [circulars, setCirculars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/circulars')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setCirculars(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading circulars...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {circulars.length === 0 ? (
        <div className="text-center py-14 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No circulars published yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Check back soon for official circulars and notices.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {circulars.map((c) => (
            <div key={c.id}
              className="group glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm mt-0.5">
                  <FileText className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                      <Clock className="w-3 h-3" />
                      {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-snug">{c.title}</h3>

                  {c.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{c.description}</p>
                  )}

                  {c.file_url && c.file_name && (
                    <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                      <a href={c.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                      <a href={c.file_url} download={c.file_name}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary-light dark:bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                        <Download className="w-3 h-3" /> Download
                      </a>
                      <span className="text-[10px] text-slate-400 truncate">{c.file_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€ NCTE Disclosures Panel Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NctePanel: React.FC = () => {
  const [ncte, setNcte] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/ncte-disclosures')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setNcte(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading disclosures...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {ncte.length === 0 ? (
        <div className="text-center py-14 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No disclosures published yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Check back soon for regulatory submittals and disclosures.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ncte.map((item) => (
            <div key={item.id}
              className="group glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                      <Clock className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-snug">{item.title}</h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                  )}

                  {item.file_url && item.file_name && (
                    <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                      <a href={item.file_url} download={item.file_name}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary-light dark:bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                        <Download className="w-3 h-3" /> Download
                      </a>
                      <span className="text-[10px] text-slate-400 truncate">{item.file_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€ Committee Member Photo Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CommitteeMemberPhoto: React.FC<{ src: string | null; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <User className="w-14 h-14 text-slate-400" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

// â”€â”€â”€ Committee Panel Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
  photo_url: string;
  college_name: string;
  college_address: string;
  contact_details: string;
  sort_order: number;
  profile_pdf_url?: string | null;
  profile_pdf_name?: string | null;
}

interface CommitteePanelProps {
  onSelectMember: (member: { src: string | null; name: string; role: string; theme?: 'primary' | 'violet'; profile_pdf_url?: string | null }) => void;
}

const CommitteePanel: React.FC<CommitteePanelProps> = ({ onSelectMember }) => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/committee')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setMembers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading committee members...</p>
    </div>
  );

  if (members.length === 0) return (
    <div className="text-center py-12 space-y-3">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-500">No committee members published yet.</p>
      <p className="text-xs text-slate-400">Admin can add members via Admin Dashboard â†’ Manage Committee.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
      {members.map((m, idx) => (
        <div
          key={m.id}
          className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
        >
          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />

          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div 
                className="shrink-0 w-32 h-32 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                onClick={() => onSelectMember({
                  src: m.photo_url,
                  name: m.name,
                  role: m.designation,
                  theme: 'primary',
                  profile_pdf_url: m.profile_pdf_url
                })}
              >
                <CommitteeMemberPhoto src={m.photo_url} alt={m.name} />
              </div>

              {/* Name & Designation */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">#{idx + 1}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{m.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                  {m.designation}
                </span>
                {m.profile_pdf_url && (
                  <div className="mt-2">
                    <a 
                      href={m.profile_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-500 transition-colors"
                    >
                      <FileText className="w-3 h-3" /> View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* College Details */}
            {(m.college_name || m.college_address) && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-0.5">
                {m.college_name && (
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{m.college_name}</p>
                )}
                {m.college_address && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{m.college_address}</p>
                )}
              </div>
            )}

            {/* Contact */}
            {m.contact_details && (
              <div className="mt-3 flex items-start gap-2">
                <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed break-words">{m.contact_details}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// â”€â”€â”€ Director Member Photo Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DirectorMemberPhoto: React.FC<{ src: string | null; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <User className="w-14 h-14 text-slate-400" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

// â”€â”€â”€ Directors Panel Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DirectorItem {
  id: number;
  name: string;
  photo_url: string;
  mobile_number: string;
  email: string;
  college_name: string;
  college_address: string;
  sort_order: number;
  profile_pdf_url?: string | null;
  profile_pdf_name?: string | null;
}

interface DirectorsPanelProps {
  onSelectMember: (member: { src: string | null; name: string; role: string; theme?: 'primary' | 'violet'; profile_pdf_url?: string | null }) => void;
}

const DirectorsPanel: React.FC<DirectorsPanelProps> = ({ onSelectMember }) => {
  const [directors, setDirectors] = useState<DirectorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/directors')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setDirectors(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading directors list...</p>
    </div>
  );

  if (directors.length === 0) return (
    <div className="text-center py-12 space-y-3">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-500">No directors published yet.</p>
      <p className="text-xs text-slate-400">Admin can add directors via Admin Dashboard â†’ Manage Directors.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
      {directors.map((d, idx) => (
        <div
          key={d.id}
          className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
        >
          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-600" />

          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div 
                className="shrink-0 w-32 h-32 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                onClick={() => onSelectMember({
                  src: d.photo_url,
                  name: d.name,
                  role: 'Director of Phy. Edu.',
                  theme: 'violet',
                  profile_pdf_url: d.profile_pdf_url
                })}
              >
                <DirectorMemberPhoto src={d.photo_url} alt={d.name} />
              </div>

              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">#{idx + 1}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{d.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/10 text-violet-600 border border-violet-500/20 uppercase tracking-wide">
                  Director of Phy. Edu.
                </span>
                {d.profile_pdf_url && (
                  <div className="mt-2">
                    <a 
                      href={d.profile_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline hover:text-violet-500 transition-colors"
                    >
                      <FileText className="w-3 h-3" /> View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* College Details */}
            {(d.college_name || d.college_address) && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-0.5">
                {d.college_name && (
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{d.college_name}</p>
                )}
                {d.college_address && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{d.college_address}</p>
                )}
              </div>
            )}

            {/* Contact details */}
            {(d.mobile_number || d.email) && (
              <div className="mt-3 space-y-1.5">
                {d.mobile_number && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                      <Phone className="w-3 h-3 text-emerald-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{d.mobile_number}</p>
                  </div>
                )}
                {d.email && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Mail className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed break-all font-semibold">{d.email}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- HODs Member Photo Component ---
const HodsMemberPhoto: React.FC<{ src: string | null; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError) return <User className="w-14 h-14 text-slate-400" />;
  return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setHasError(true)} />;
};

// --- HODs Panel Component ---
interface HodItem {
  id: number; name: string; designation: string; photo_url: string;
  college_name: string; college_address: string; mobile_number: string;
  email: string; message: string; sort_order: number;
  profile_pdf_url?: string | null; profile_pdf_name?: string | null;
}

interface HodsPanelProps {
  onSelectMember: (member: { src: string | null; name: string; role: string; theme?: 'primary' | 'violet'; profile_pdf_url?: string | null }) => void;
}

const HodsPanel: React.FC<HodsPanelProps> = ({ onSelectMember }) => {
  const [hods, setHods] = useState<HodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/hods')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setHods(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-slate-500 animate-pulse">Loading HODs Desk entries...</p>
    </div>
  );

  if (hods.length === 0) return (
    <div className="text-center py-12 space-y-3">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-500">No HODs/Directors Desk entries published yet.</p>
      <p className="text-xs text-slate-400">Admin can add entries via Admin Dashboard.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-5">
      {hods.map((h, idx) => (
        <div key={h.id} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 overflow-hidden hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1 transition-all duration-300">
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-600" />
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-32 h-32 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                onClick={() => onSelectMember({ src: h.photo_url, name: h.name, role: h.designation || 'HOD / Director', theme: 'primary', profile_pdf_url: h.profile_pdf_url })}>
                <HodsMemberPhoto src={h.photo_url} alt={h.name} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">#{idx + 1}</span>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight mt-1">{h.name}</h3>
                {h.designation && (
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20 uppercase tracking-wide">{h.designation}</span>
                )}
                {h.profile_pdf_url && (
                  <div className="mt-2.5">
                    <a href={h.profile_pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                      <FileText className="w-3.5 h-3.5" /> View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
            {h.message && (
              <div className="mt-4 p-4 rounded-xl bg-sky-50/60 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30">
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed italic">"{h.message}"</p>
              </div>
            )}
            {(h.college_name || h.college_address) && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                {h.college_name && <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{h.college_name}</p>}
                {h.college_address && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{h.college_address}</p>}
              </div>
            )}
            {(h.mobile_number || h.email) && (
              <div className="mt-4 space-y-2">
                {h.mobile_number && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-emerald-600" /></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{h.mobile_number}</p>
                  </div>
                )}
                {h.email && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-blue-600" /></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 break-all font-semibold">{h.email}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Component ---

export const AboutPage: React.FC<AboutPageProps> = ({ subpageId, setCurrentTab }) => {
  const [pageData, setPageData] = useState<CustomPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<{
    src: string | null;
    name: string;
    role: string;
    theme?: 'primary' | 'violet';
    profile_pdf_url?: string | null;
  } | null>(null);

  const meta = getMeta(subpageId);
  const Icon = meta.icon;
  const isResults = subpageId === 'results';
  const isDraws = subpageId === 'draws';
  const isCourses = subpageId === 'courses';
  const isCirculars = subpageId === 'circulars';
  const isCommittee = subpageId === 'committee';
  const isDirector = subpageId === 'director';
  const isNcte = subpageId === 'ncte';
  const isAdmission = subpageId === 'admission';
  const isHods = subpageId === 'hods';


  useEffect(() => {
    setSelectedMember(null);
    if (isResults || isDraws || isCourses || isCirculars || isCommittee || isDirector || isNcte || isHods) { setLoading(false); return; }

    setLoading(true);
    setError(null);
    setPageData(null);
    fetch(`http://localhost:5001/api/custom-pages/${subpageId}`)
      .then(res => {
        if (!res.ok) throw new Error('Content not yet published by administrator.');
        return res.json();
      })
      .then(data => { setPageData(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [subpageId]);

  const formattedDate = pageData?.updated_at
    ? new Date(pageData.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="w-full space-y-0 pb-16 text-left animate-in fade-in duration-300">

      {/* â”€â”€ Hero Banner â”€â”€ */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${meta.color} text-white p-5 sm:p-6 shadow-xl mb-6`}>
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-black/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/30">
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/60">
              <span>{meta.group === 'academic' ? 'Academic' : meta.group === 'student' ? 'Student Corner' : 'About PCZSC'}</span>
              <ChevronRight className="w-2.5 h-2.5" />
              <span className="text-white/90">{meta.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/20 text-white border border-white/30 tracking-widest">
                {meta.badge}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-white leading-tight">
              {loading ? meta.label : ((isResults || isCirculars || isNcte) ? meta.label : (pageData?.title ?? meta.label))}
            </h1>
            <p className="text-[11px] text-white/70 font-medium max-w-xl leading-relaxed">{meta.description}</p>
            {formattedDate && (
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/60 font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-white/80" /> Updated: {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-white/80" /> Admin Desk
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€ Body Grid â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden sticky top-24">
            <nav className="p-2 space-y-0.5">
              {ABOUT_PAGES.filter(page => page.group === meta.group).map((page) => {
                const PageIcon = page.icon;
                const isActive = page.id === subpageId;
                return (
                  <button key={page.id}
                    onClick={() => setCurrentTab?.(`${page.group}-${page.id}`)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                      isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10'}`}>
                      <PageIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`} />
                    </span>
                    <span className="text-left leading-tight">{page.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/70" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* â”€â”€ DRAWS: Dynamic Feed â”€â”€ */}
          {isDraws && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">Tournament Draws &amp; Brackets</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Match Schedules</p>
                </div>
              </div>
              <div className="p-6">
                <ResultsPanel mode="draws" />
              </div>
            </div>
          )}

          {/* â”€â”€ RESULTS: Dynamic Feed â”€â”€ */}
          {isResults && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">Tournament Winners &amp; Results</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Championship Standings</p>
                </div>
              </div>
              <div className="p-6">
                <ResultsPanel mode="results" />
              </div>
            </div>
          )}

          {/* â”€â”€ COURSES: Dynamic Feed â”€â”€ */}
          {isCourses && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">Academic Program Courses</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Curriculum Structure</p>
                </div>
              </div>
              <div className="p-6">
                <CoursesPanel />
              </div>
            </div>
          )}

          {/* ——— CIRCULARS: Dynamic Feed ——— */}
          {isCirculars && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">Official Circulars &amp; Announcements</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Official Notices</p>
                </div>
              </div>
              <div className="p-6">
                <CircularsPanel />
              </div>
            </div>
          )}

          {/* ——— NCTE: Dynamic Feed ——— */}
          {isNcte && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">NCTE Mandatory Disclosures</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Regulatory compliance documents</p>
                </div>
              </div>
              <div className="p-6">
                <NctePanel />
              </div>
            </div>
          )}

          {/* â”€â”€ COMMITTEE: Dynamic Member Cards â”€â”€ */}
          {isCommittee && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-sm">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">PCZSC Committee Members</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Governance</p>
                </div>
              </div>
              <div className="p-6">
                <CommitteePanel onSelectMember={setSelectedMember} />
              </div>
            </div>
          )}

          {/* â”€â”€ DIRECTORS: Dynamic Member Cards â”€â”€ */}
          {isDirector && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">Director of Physical Education &amp; Sports</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Leadership</p>
                </div>
              </div>
              <div className="p-6">
                <DirectorsPanel onSelectMember={setSelectedMember} />
              </div>
            </div>
          )}

          {/* HODs/Directors Desk */}
          {isHods && (
            <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-800 dark:text-white">From HODs / Directors Desk</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Leadership Messages</p>
                </div>
              </div>
              <div className="p-6">
                <HodsPanel onSelectMember={setSelectedMember} />
              </div>
            </div>
          )}

          {/* â”€â”€ ADMISSION: Custom Layout â”€â”€ */}
          {isAdmission && (
            <AdmissionPanel pageData={pageData} loading={loading} error={error} />
          )}

          {/* â”€â”€ OTHER PAGES: Custom Page Content â”€â”€ */}
          {!isResults && !isDraws && !isCourses && !isCirculars && !isCommittee && !isDirector && !isNcte && !isAdmission && !isHods && (
            <>
              {loading && (
                <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-16 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm text-slate-500 font-medium animate-pulse">Loading page content...</p>
                </div>
              )}

              {!loading && (error || !pageData) && (
                <div className="glass-card rounded-3xl border border-amber-200/50 dark:border-amber-900/30 p-8 sm:p-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Content Not Published Yet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      {error || 'This page has not yet been populated by the administrator.'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Admins can add content via <strong>Admin Dashboard â†’ About Section Management</strong>.
                    </p>
                  </div>
                </div>
              )}

              {!loading && pageData && (
                <>
                  <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-slate-800 dark:text-white">Description &amp; Overview</h2>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Official Content</p>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      {pageData.content ? (
                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-light">
                          {pageData.content}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 italic py-4">
                          No description provided yet. An administrator can add content from the Admin Dashboard.
                        </p>
                      )}
                    </div>
                  </div>

                  {pageData.file_url && (
                    <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="w-8 h-8 rounded-lg bg-primary-light dark:bg-primary/10 flex items-center justify-center">
                          <FileDown className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-bold text-sm text-slate-800 dark:text-white">Attached Document</h2>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Official File</p>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-light dark:bg-primary/10 flex items-center justify-center shrink-0">
                            <FileDown className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800 dark:text-white">{pageData.file_name || 'Official Document'}</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">Attached File Â· Available for Download</p>
                          </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <a href={pageData.file_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <ExternalLink className="w-4 h-4" /> Preview
                          </a>
                          <a href={pageData.file_url} download={pageData.file_name || 'attachment'}
                            className="btn-primary text-sm py-2.5 px-5 font-bold shadow-md gap-2">
                            <FileDown className="w-4 h-4 text-white" /> Download
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {!pageData.file_url && (
                    <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center space-y-2 bg-slate-50/30 dark:bg-slate-900/20">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <FileDown className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No document attached</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                        Administrative forms, results tables, or sports schedules will appear here once uploaded by the admin.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* â”€â”€ Quick Navigation Tiles â”€â”€ */}
      <div className="mt-20 pt-10 border-t border-slate-200/50 dark:border-slate-800/40">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Explore Other {meta.group === 'academic' ? 'Academic' : meta.group === 'student' ? 'Student Corner' : 'About'} Pages
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ABOUT_PAGES.filter((p) => p.id !== subpageId && p.group === meta.group).map((page) => {
            const PageIcon = page.icon;
            return (
              <button key={page.id}
                onClick={() => setCurrentTab?.(`${page.group}-${page.id}`)}
                className="glass-card glass-card-hover rounded-2xl p-4 text-left flex flex-col gap-2.5 border border-slate-200/50 dark:border-slate-800/40 group transition-all cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${page.color} flex items-center justify-center shadow-sm`}>
                  <PageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">{page.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">{page.badge}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors self-end" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Shared Photo Preview Modal Overlay */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto pt-24"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="glass-card max-w-sm w-full rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-center items-center bg-white/95 dark:bg-slate-900/95"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/30 dark:border-slate-700/30 flex items-center justify-center relative shadow-inner mt-2">
              {selectedMember.src ? (
                <img 
                  src={selectedMember.src} 
                  alt={selectedMember.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { 
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }} 
                />
              ) : null}
              <div 
                style={{ display: selectedMember.src ? 'none' : 'flex' }}
                className="absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400"
              >
                <User className="w-24 h-24 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white leading-tight">
                {selectedMember.name}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${
                selectedMember.theme === 'violet' 
                  ? 'text-violet-600 dark:text-violet-400' 
                  : 'text-primary dark:text-primary-light'
              }`}>
                {selectedMember.role}
              </p>
              {selectedMember.profile_pdf_url && (
                <a 
                  href={selectedMember.profile_pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 mt-2.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                    selectedMember.theme === 'violet'
                      ? 'bg-violet-600 hover:bg-violet-750 shadow-violet-500/15'
                      : 'bg-primary hover:bg-primary-dark text-slate-900 shadow-primary/10'
                  }`}
                >
                  <FileText className="w-4 h-4" /> View Profile Document
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

