import React from 'react';
import { 
  User, Users, Briefcase, Award, Heart, ClipboardCheck, 
  Settings, BarChart3, GraduationCap, Calendar, PlusSquare,
  Newspaper, FileText, SlidersHorizontal, Trophy, CreditCard,
  ShieldCheck, BookOpen, UserCheck, Sparkles
} from 'lucide-react';
interface SidebarProps {
  role: 'student' | 'alumni' | 'admin';
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab }) => {
  
  const studentItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'alumni-search', label: 'Alumni Directory', icon: Users },
    { id: 'mentorship', label: 'Mentorship Program', icon: Award },
    { id: 'jobs', label: 'Internships & Careers', icon: Briefcase },
    { id: 'events', label: 'Events Registry', icon: Calendar },
    { id: 'digital-card', label: 'Digital Student Card', icon: GraduationCap },
  ];

  const alumniItems = [
    { id: 'profile', label: 'Profile Management', icon: User },
    { id: 'networking', label: 'Alumni Network', icon: Users },
    { id: 'jobs', label: 'Post / Apply Jobs', icon: Briefcase },
    { id: 'mentorship', label: 'Mentorship Requests', icon: Award },
    { id: 'events', label: 'Alumni Events', icon: Calendar },
    { id: 'donations', label: 'Donations & Giving', icon: Heart },
    { id: 'digital-card', label: 'Digital Alumni Card', icon: CreditCard },
  ];
  const adminItems = [
    { id: 'approvals', label: 'Verification Center', icon: ClipboardCheck },
    { id: 'events-manager', label: 'Create Event', icon: PlusSquare },
    { id: 'news-manager', label: 'Manage News', icon: Newspaper },
    { id: 'circulars-manager', label: 'Manage Circulars', icon: FileText },
    { id: 'ncte-manager', label: 'NCTE Disclosures', icon: ShieldCheck },
    { id: 'committee-manager', label: 'Manage Committee', icon: Users },
    { id: 'directors-manager', label: 'Manage Directors', icon: Users },
    { id: 'hods-manager', label: 'Manage HODs Desk', icon: Users },
    { id: 'results-manager', label: 'Draws & Results', icon: Trophy },
    { id: 'about-manager', label: 'Manage About Pages', icon: FileText },
    { id: 'courses-manager', label: 'Manage Courses', icon: BookOpen },
    { id: 'admission-manager', label: 'Manage Admissions', icon: UserCheck },
    { id: 'jobs', label: 'Post / Apply Jobs', icon: Briefcase },
    { id: 'spotlight-manager', label: 'Manage Spotlight', icon: Sparkles },
    { id: 'slider-manager', label: 'Hero Slider', icon: SlidersHorizontal },
    { id: 'donations-manager', label: 'Donations Tracker', icon: Heart },
    { id: 'branding', label: 'Branding Settings', icon: Settings },
    { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
  ];

  const menuItems = role === 'admin' ? adminItems : role === 'alumni' ? alumniItems : studentItems;

  return (
    <aside className="w-full md:w-64 glass-card p-4 rounded-2xl flex flex-col gap-2 h-fit md:sticky md:top-28">
      <div className="px-3 py-2.5 mb-2 rounded-xl bg-primary-light/30 dark:bg-primary/5 text-primary text-xs font-extrabold uppercase tracking-widest text-center">
        {role} Dashboard
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
