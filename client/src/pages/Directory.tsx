import React, { useState, useEffect } from 'react';
import { AlumniCard } from '../components/AlumniCard';
import { RichTextEditor } from '../components/RichTextEditor';
import { AlumniProfile } from '../types';
import { Search, Filter, RefreshCw, MessageSquare, Send, Check } from 'lucide-react';

interface DirectoryProps {
  currentUser: any;
  setCurrentTab: (tab: string) => void;
}

export const Directory: React.FC<DirectoryProps> = ({ currentUser, setCurrentTab }) => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  
  // Messaging Modal State
  const [activeMessageTarget, setActiveMessageTarget] = useState<{ id: number; name: string } | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Fetch alumni from backend API
  const fetchAlumni = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (gradYear) params.append('grad_year', gradYear);
    if (degree) params.append('degree', degree);
    if (department) params.append('department', department);
    if (industry) params.append('industry', industry);
    if (country) params.append('country', country);

    fetch(`${import.meta.env.VITE_API_URL || ''}/api/alumni?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('API server unavailable');
        return res.json();
      })
      .then((data) => {
        setAlumni(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend unavailable, using static fallback for directory:', err);
        setAlumni([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlumni();
  }, [searchTerm, gradYear, degree, department, industry, country]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Simulate sending message to backend
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setActiveMessageTarget(null);
      setMessageText('');
    }, 2000);
  };

  const handleMentorshipRequest = async (mentorId: number) => {
    if (!currentUser) {
      alert("Please sign in to your Student account to request mentorship.");
      setCurrentTab('login-selection');
      return;
    }
    if (currentUser.role !== 'student') {
      alert("Only current students can request alumni mentorship.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/mentorship/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menteeId: currentUser.id,
          mentorId,
          notes: 'Requested from Alumni Directory. Interested in career guidance.'
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Mentorship request successfully submitted! You can track this in your Student Dashboard.");
      } else {
        alert(data.error || "Failed to submit request.");
      }
    } catch(e) {
      alert("Mentorship connection server failed. Please ensure backend is running.");
    }
  };

  const handleOpenMessage = (alumnusId: number, name: string) => {
    if (!currentUser) {
      alert("Please login to direct message alumni.");
      setCurrentTab('login-selection');
      return;
    }
    setActiveMessageTarget({ id: alumnusId, name });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Alumni Directory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Connect with graduates, search professional industries, and request expert career mentorship.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Main search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, job title, or skills..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full glass-input pl-11 py-3"
            />
          </div>

          {/* Grad year */}
          <div className="relative">
            <select
              value={gradYear}
              onChange={e => setGradYear(e.target.value)}
              className="w-full glass-input py-3 text-slate-500 dark:text-slate-300 font-semibold"
            >
              <option value="">Graduation Year</option>
              <option value="2010">2010</option>
              <option value="2012">2012</option>
              <option value="2014">2014</option>
              <option value="2017">2017</option>
            </select>
          </div>

          {/* Department */}
          <div className="relative">
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full glass-input py-3 text-slate-500 dark:text-slate-300 font-semibold"
            >
              <option value="">Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Management">Business Management</option>
              <option value="Architecture">Architecture</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
        </div>

        {/* Extra Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Course */}
          <div className="relative">
            <select
              value={degree}
              onChange={e => setDegree(e.target.value)}
              className="w-full glass-input text-xs py-2.5 text-slate-500 dark:text-slate-300 font-semibold"
            >
              <option value="">Degree Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MBA">MBA</option>
              <option value="B.Arch">B.Arch</option>
            </select>
          </div>

          {/* Industry */}
          <div className="relative">
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full glass-input text-xs py-2.5 text-slate-500 dark:text-slate-300 font-semibold"
            >
              <option value="">Industry Sector</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Real Estate & Design">Real Estate & Design</option>
            </select>
          </div>

          {/* Country */}
          <div className="relative">
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full glass-input text-xs py-2.5 text-slate-500 dark:text-slate-300 font-semibold"
            >
              <option value="">Country</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Searching Database...</span>
        </div>
      ) : alumni.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((profile) => (
            <AlumniCard
              key={profile.user_id}
              profile={profile}
              currentUser={currentUser}
              onMessage={handleOpenMessage}
              onMentorshipRequest={handleMentorshipRequest}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
          <Filter className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h3 className="font-extrabold text-lg text-slate-700 dark:text-slate-300">No Alumni Match Found</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            We couldn't locate records matching those specific filters. Try expanding search parameters or clearing filters.
          </p>
        </div>
      )}

      {/* Messaging Modal */}
      {activeMessageTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-primary/20 shadow-2xl relative bg-white/95 dark:bg-slate-900/95 animate-in zoom-in-95 duration-200">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white text-left mb-2">
              Send Message to {activeMessageTarget.name}
            </h3>
            <p className="text-xs text-slate-400 text-left mb-4 leading-normal">
              This message will be routed directly via the alumni notifications dispatcher.
            </p>

            {messageSent ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-emerald-600 animate-pulse">
                <Check className="w-12 h-12 bg-emerald-100 rounded-full p-2.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Message Delivered Successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Content</label>
                  <RichTextEditor
                    value={messageText}
                    onChange={setMessageText}
                    placeholder="Introduce yourself and state the purpose of your connection request..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveMessageTarget(null)}
                    className="flex-1 btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
