import React, { useState, useEffect } from 'react';
import { Sidebar, studentItems } from '../components/Sidebar';
import { DigitalAlumniCard } from '../components/DigitalAlumniCard';
import { StudentProfile, Mentorship, Job } from '../types';
import { 
  User, Award, Briefcase, Calendar, GraduationCap, 
  MapPin, Send, CheckCircle, RefreshCw, LayoutDashboard
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: any;
  setCurrentTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentUser, setCurrentTab }) => {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [interests, setInterests] = useState('');

  // Job Search State
  const [jobSearch, setJobSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/student/${currentUser.id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setFullName(data.full_name || '');
        setMobile(data.mobile || '');
        setGradYear(data.grad_year || '');
        setDegree(data.degree || '');
        setDepartment(data.department || '');
        setRollNumber(data.roll_number || '');
        setResumeUrl(data.resume_url || '');
        setInterests(data.interests || '');
      }
    } catch(e) {
      console.warn("Express server offline, student profile mock skipped");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await fetchProfile();
    try {
      // Mentorship connections
      const mRes = await fetch(`http://localhost:5001/api/mentorship?userId=${currentUser.id}&role=student`);
      const mData = await mRes.json();
      if (mRes.ok) setMentorships(mData);

      // Jobs applied for
      const appRes = await fetch(`http://localhost:5001/api/jobs/applied/${currentUser.id}`);
      const appData = await appRes.json();
      if (appRes.ok) setAppliedJobs(appData);

      // Available jobs
      const jobsRes = await fetch('http://localhost:5001/api/jobs');
      const jobsData = await jobsRes.json();
      if (jobsRes.ok) setAvailableJobs(jobsData);

    } catch (e) {
      console.warn("Backend data fetch error in student portal");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  // Profile Save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5001/api/student/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          mobile,
          grad_year: parseInt(gradYear),
          degree,
          department,
          roll_number: rollNumber,
          resume_url: resumeUrl,
          interests
        })
      });
      if (res.ok) {
        alert("Profile details updated successfully!");
        fetchProfile();
      }
    } catch(e) {
      alert("Failed to update profile details on backend.");
    }
  };

  // Job Apply
  const handleApplyJob = async (jobId: number) => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          resumeUrl: profile?.resume_url || 'https://apexuniversity.edu/student/resumes/dummy.pdf'
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Application successfully submitted!");
        // Refresh applied jobs list
        const appRes = await fetch(`http://localhost:5001/api/jobs/applied/${currentUser.id}`);
        const appData = await appRes.json();
        setAppliedJobs(appData);
      } else {
        alert(data.error || "Application submission failed.");
      }
    } catch (e) {
      alert("Backend connection failed.");
    }
  };

  // Filter Jobs
  const filteredJobs = availableJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
                          job.description.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesType = jobTypeFilter === '' || job.type === jobTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-16">
      <Sidebar role="student" activeTab={activeSubTab} setActiveTab={setActiveSubTab} />

      <div className="flex-1 text-left space-y-6">
        {/* ── DASHBOARD HUB TAB ── */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5">
                    <LayoutDashboard className="w-8 h-8 text-primary animate-pulse" />
                    Student Portal Hub
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Welcome back, <span className="font-bold text-slate-700 dark:text-slate-350">{currentUser.full_name || 'Student'}</span>. Update your academic profile, find internships, request guidance from alumni, or register for upcoming events.
                  </p>
                </div>
                <div className="bg-primary/10 text-primary border border-primary/20 rounded-2xl px-4 py-2.5 text-xs font-bold text-center shrink-0">
                  📖 Enrollment Portal
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {studentItems.filter(item => item.id !== 'dashboard').map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubTab(item.id)}
                      className="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 hover:border-primary/45 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-left transition-all duration-300 group flex flex-col justify-between h-40 cursor-pointer hover:shadow-xl hover:shadow-primary/5"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="mt-4">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-200">
                          {item.label}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE SUB-TAB */}
        {activeSubTab === 'profile' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-primary" /> Profile Settings
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Graduation Target Year</label>
                  <input
                    type="number"
                    required
                    value={gradYear}
                    onChange={e => setGradYear(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course / Degree</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resume Link (PDF URL / Google Drive Link)</label>
                <input
                  type="text"
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Career Interests (Comma-separated)</label>
                <input
                  type="text"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                  placeholder="Machine Learning, Product Management, UI UX Design"
                  className="glass-input text-xs"
                />
              </div>

              <button type="submit" className="btn-primary py-3 px-8 text-xs font-bold shadow-md shadow-primary/20">
                Update Student Profile
              </button>
            </form>
          </div>
        )}

        {/* ALUMNI DIRECTORY SUB-TAB */}
        {activeSubTab === 'alumni-search' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-primary" /> Request Mentorship from Classmates
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Browse approved alumni, inspect their industries, and click "Request Mentorship" to connect.
            </p>
            <button onClick={() => setCurrentTab('directory')} className="btn-primary flex gap-2">
              Search Alumni Directory <Award className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* MENTORSHIP SUB-TAB */}
        {activeSubTab === 'mentorship' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-primary" /> My Mentor Relationships
            </h2>

            <div className="space-y-4">
              {mentorships.length > 0 ? (
                mentorships.map((m) => (
                  <div key={m.id} className="p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img 
                          src={m.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80'} 
                          alt={m.mentor_name} 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{m.mentor_name}</h4>
                          <p className="text-slate-500">{m.designation} at <strong>{m.company}</strong></p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        m.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    {/* Display Meetings if approved */}
                    {m.status === 'approved' && (() => {
                      let meetingsList = [];
                      try {
                        meetingsList = JSON.parse(m.scheduled_meetings || '[]');
                      } catch(e) {
                        meetingsList = [];
                      }
                      return (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <p className="font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" /> Scheduled Videoconferences:
                          </p>
                          {meetingsList.length > 0 ? (
                            <div className="space-y-1">
                              {meetingsList.map((meet: any, idx: number) => (
                                <div key={idx} className="bg-primary-light/40 dark:bg-primary/5 text-primary text-[10px] font-bold p-2.5 rounded-xl border border-primary/10 flex justify-between items-center">
                                  <span>📅 {meet.date} at {meet.time}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-500 italic">Topic: {meet.topic}</span>
                                    <button 
                                      onClick={() => alert("Joining simulated Zoom room!")}
                                      className="bg-primary hover:bg-primary-dark text-white text-[9px] px-2 py-0.5 rounded-lg transition-all"
                                    >
                                      Join Room
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400">Ask your mentor to schedule a videoconference.</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">You have not requested any mentorship connections yet.</p>
              )}
            </div>
          </div>
        )}

        {/* JOBS BOARD SUB-TAB */}
        {activeSubTab === 'jobs' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Search internships & job titles..."
                    value={jobSearch}
                    onChange={e => setJobSearch(e.target.value)}
                    className="w-full glass-input py-2.5 text-xs"
                  />
                </div>
                <div>
                  <select
                    value={jobTypeFilter}
                    onChange={e => setJobTypeFilter(e.target.value)}
                    className="w-full glass-input py-2.5 text-xs text-slate-500 font-semibold"
                  >
                    <option value="">All Employment</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Application History Tracker */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-xs">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">My Submitted Applications</h3>
              <div className="space-y-3">
                {appliedJobs.length > 0 ? (
                  appliedJobs.map((app) => (
                    <div key={app.id} className="p-3 border border-slate-200/50 dark:border-slate-800/40 rounded-xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{app.title}</h4>
                        <p className="text-slate-500 mt-0.5">{app.company} • Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-sky-100 text-sky-700">
                        {app.app_status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 py-3">No applications submitted yet.</p>
                )}
              </div>
            </div>

            {/* List Careers */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Active Career Listings</h3>
              
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const alreadyApplied = appliedJobs.some((app) => app.id === job.id);
                  return (
                    <div key={job.id} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-base text-slate-800 dark:text-white">{job.title}</h4>
                          <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <span>🏢 {job.company}</span>
                            <span>•</span>
                            <span>📍 {job.location}</span>
                            <span>•</span>
                            <span className="bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded uppercase text-[9px]">
                              {job.type}
                            </span>
                          </p>
                        </div>
                        
                        <button
                          disabled={alreadyApplied}
                          onClick={() => handleApplyJob(job.id)}
                          className={`btn-primary text-xs py-2 px-4 shadow-none ${
                            alreadyApplied ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-800' : ''
                          }`}
                        >
                          {alreadyApplied ? 'Applied' : 'Apply Instantly'}
                        </button>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                        <p><strong>Description:</strong> {job.description}</p>
                        <p><strong>Requirements:</strong> {job.requirements}</p>
                        {job.salary && <p><strong>Compensation:</strong> <span className="text-primary font-bold">{job.salary}</span></p>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No matching jobs available.</p>
              )}
            </div>
          </div>
        )}

        {/* EVENTS REGISTER SUB-TAB */}
        {activeSubTab === 'events' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-primary" /> Upcoming Academic Seminars & Reunions
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Search available seminars or reunions. Register to download instant event admittance tickets.
            </p>
            <button onClick={() => setCurrentTab('events')} className="btn-primary flex gap-2">
              Browse Events Portal <Calendar className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* DIGITAL CARD SUB-TAB */}
        {activeSubTab === 'digital-card' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <GraduationCap className="w-6 h-6 text-primary" /> Digital Student ID Card
            </h2>
            <p className="text-sm text-slate-500 mb-6 text-center">
              Present this card for library verify checks, seminar attendance tracking, and alumni benefit matches.
            </p>
            
            <DigitalAlumniCard user={currentUser} profileDetails={profile} />
          </div>
        )}

      </div>
    </div>
  );
};
