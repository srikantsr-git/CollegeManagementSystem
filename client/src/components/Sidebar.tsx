import React from 'react';
import { 
  User, Users, Briefcase, Award, Heart, ClipboardCheck, 
  Settings, BarChart3, GraduationCap, Calendar, PlusSquare,
  Newspaper, FileText, SlidersHorizontal, Trophy, CreditCard,
  ShieldCheck, BookOpen, UserCheck, Sparkles, LayoutDashboard, Image
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const studentItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard Hub', description: 'Overview of all student portal features and activities', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', description: 'Update your degree, contact details, and resume link', icon: User },
  { id: 'alumni-search', label: 'Alumni Directory', description: 'Search, connect, and network with graduated alumni', icon: Users },
  { id: 'mentorship', label: 'Mentorship Program', description: 'Track your active mentor matches and schedule calls', icon: Award },
  { id: 'jobs', label: 'Internships & Careers', description: 'Explore and apply for internships and career opportunities', icon: Briefcase },
  { id: 'events', label: 'Events Registry', description: 'View and register for upcoming college events and reunions', icon: Calendar },
  { id: 'digital-card', label: 'Digital Student Card', description: 'Access your digital student identification card', icon: GraduationCap },
];

export const alumniItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard Hub', description: 'Overview of all alumni portal features and actions', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile Management', description: 'Update your professional experience, skills, and details', icon: User },
  { id: 'networking', label: 'Alumni Network', description: 'Browse the directory and connect with other alumni', icon: Users },
  { id: 'jobs', label: 'Post / Apply Jobs', description: 'Post career opportunities or apply for roles', icon: Briefcase },
  { id: 'mentorship', label: 'Mentorship Requests', description: 'Review student mentorship requests and schedule chats', icon: Award },
  { id: 'events', label: 'Alumni Events', description: 'View and register for alumni meetups and webinars', icon: Calendar },
  { id: 'donations', label: 'Donations & Giving', description: 'Support the college through secure online donations', icon: Heart },
  { id: 'digital-card', label: 'Digital Alumni Card', description: 'Access your premium digital alumni association card', icon: CreditCard },
];

export const adminItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard Hub', description: 'Administration overview hub and system controls', icon: LayoutDashboard },
  { id: 'approvals', label: 'Verification Center', description: 'Review and verify student & alumni registrations', icon: ClipboardCheck },
  { id: 'events-manager', label: 'Create Event', description: 'Create, schedule, and publish events to the platform', icon: PlusSquare },
  { id: 'news-manager', label: 'Manage News', description: 'Publish notices, updates, and announcements', icon: Newspaper },
  { id: 'circulars-manager', label: 'Manage Circulars', description: 'Publish official college circular documents', icon: FileText },
  { id: 'ncte-manager', label: 'NCTE Disclosures', description: 'Update and manage NCTE compliance disclosures', icon: ShieldCheck },
  { id: 'committee-manager', label: 'Manage Committee', description: 'Manage members of Pune City Zone Sports Committee', icon: Users },
  { id: 'directors-manager', label: 'Manage Directors', description: 'Manage Physical Education Directors index', icon: Users },
  { id: 'hods-manager', label: 'Manage HODs Desk', description: 'Update messages from HODs and Directors desk', icon: Users },
  { id: 'results-manager', label: 'Draws & Results', description: 'Publish sports tournament results and schedules', icon: Trophy },
  { id: 'about-manager', label: 'Manage Static pages', description: 'Manage static pages and core information under About', icon: FileText },
  { id: 'academic-pages-manager', label: 'Manage Academic Pages', description: 'Manage custom pages under the Academic menu dropdown', icon: FileText },
  { id: 'student-pages-manager', label: 'Manage Student Pages', description: 'Manage custom pages under the Student Corner menu dropdown', icon: FileText },
  { id: 'standalone-pages-manager', label: 'Manage Independent Pages', description: 'Manage custom standalone pages not under any dropdown', icon: SlidersHorizontal },
  { id: 'courses-manager', label: 'Manage Courses', description: 'Manage undergraduate and postgraduate courses', icon: BookOpen },
  { id: 'admission-manager', label: 'Manage Admissions', description: 'Manage admission announcements and eligibility details', icon: UserCheck },
  { id: 'jobs', label: 'Post / Apply Jobs', description: 'Moderate and review posted career opportunities', icon: Briefcase },
  { id: 'spotlight-manager', label: 'Manage Spotlight', description: 'Highlight success stories of distinguished alumni', icon: Sparkles },
  { id: 'gallery-manager', label: 'Photo Gallery', description: 'Upload and manage the photo gallery with categories', icon: Image },
  { id: 'placement-manager', label: 'Placement Manager', description: 'Manage placement page content and recruiter company logos', icon: Briefcase },
  { id: 'slider-manager', label: 'Hero Slider', description: 'Update home page hero slider slides and images', icon: SlidersHorizontal },
  { id: 'donations-manager', label: 'Donations Tracker', description: 'Track and audit donor contributions and campaigns', icon: Heart },
  { id: 'branding', label: 'Branding Settings', description: 'Customize logos, college name, and theme presets', icon: Settings },
  { id: 'analytics', label: 'System Analytics', description: 'Inspect portal traffic, demographics, and trends', icon: BarChart3 },
];

interface SidebarProps {
  role: 'student' | 'alumni' | 'admin';
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab }) => {
  const menuItems = role === 'admin' ? adminItems : role === 'alumni' ? alumniItems : studentItems;

  const adminSections = [
    {
      title: "Core Portal Controls",
      items: ["dashboard", "approvals", "analytics", "branding"]
    },
    {
      title: "About Us Dropdown Menu",
      items: ["about-manager", "committee-manager", "directors-manager", "hods-manager", "circulars-manager", "ncte-manager"]
    },
    {
      title: "Academic Dropdown Menu",
      items: ["academic-pages-manager", "courses-manager", "admission-manager"]
    },
    {
      title: "Student Corner Dropdown",
      items: ["student-pages-manager", "events-manager", "news-manager", "results-manager"]
    },
    {
      title: "Independent Dropdowns & Links",
      items: ["standalone-pages-manager", "gallery-manager", "placement-manager", "slider-manager", "jobs", "donations-manager"]
    }
  ];

  return (
    <aside className="w-full md:w-64 glass-card p-4 rounded-2xl flex flex-col gap-2 h-fit md:sticky md:top-28">
      <div className="px-3 py-2.5 mb-2 rounded-xl bg-primary-light/30 dark:bg-primary/5 text-primary text-xs font-extrabold uppercase tracking-widest text-center">
        {role} Dashboard
      </div>

      {role === 'admin' ? (
        <div className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1 select-none">
          {adminSections.map((section) => {
            const sectionItems = adminItems.filter(item => section.items.includes(item.id));
            return (
              <div key={section.title} className="space-y-1">
                <div className="px-2 pt-2 pb-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100/50 dark:border-slate-800/30 mb-1">
                  {section.title}
                </div>
                {sectionItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/10'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:text-primary'
                      }`}
                      title={item.description}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:text-primary'
                }`}
                title={item.description}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </aside>
  );
};

