import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeManager';
import { Navbar } from './components/Navbar';
import { AIChatbot } from './components/AIChatbot';
import { Home } from './pages/Home';
import { Directory } from './pages/Directory';
import { AuthPages } from './pages/AuthPages';
import { AlumniDashboard } from './pages/AlumniDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import PlacementPage from './pages/PlacementPage';

import { Event, Job } from './types';
import {
  Calendar, Briefcase, Heart, MessageSquare, Send, Award, Clock, ArrowRight, ShieldCheck,
  Info, CheckCircle2, AlertTriangle, X, Ticket, Download, Printer
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { settings } = useTheme();
  const [currentTab, setCurrentTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Custom dialog box state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  // Override window.alert to render our premium custom dialog box
  useEffect(() => {
    (window as any).alert = (message: string) => {
      let type: 'success' | 'error' | 'info' = 'info';
      let title = 'Notification';
      const msgLower = String(message).toLowerCase();
      if (
        msgLower.includes('fail') ||
        msgLower.includes('error') ||
        msgLower.includes('invalid') ||
        msgLower.includes('reject') ||
        msgLower.includes('incorrect') ||
        msgLower.includes('not readable')
      ) {
        type = 'error';
        title = 'Error';
      } else if (
        msgLower.includes('success') ||
        msgLower.includes('approved') ||
        msgLower.includes('started') ||
        msgLower.includes('submitted') ||
        msgLower.includes('added') ||
        msgLower.includes('saved') ||
        msgLower.includes('deleted')
      ) {
        type = 'success';
        title = 'Success';
      }
      setModal({ isOpen: true, title, message, type });
    };
  }, []);

  // Global shared events state
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  // Ticket modal state
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);

  const fetchGlobalData = async () => {
    try {
      const eRes = await fetch('http://localhost:5001/api/events');
      const eData = await eRes.json();
      if (eRes.ok) setEvents(eData);

      const jRes = await fetch('http://localhost:5001/api/jobs');
      const jData = await jRes.json();
      if (jRes.ok) setJobs(jData);
    } catch (err) {
      console.warn('API backend not running yet or restarting.');
    }
  };

  const fetchRegisteredEvents = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5001/api/events/registered/${currentUser.id}`);
      const data = await res.json();
      if (res.ok) setRegisteredEventIds(data.map((e: any) => e.id));
    } catch (err) {
      console.warn('Could not fetch registered events.');
    }
  };

  useEffect(() => {
    fetchGlobalData();
    fetchRegisteredEvents();
  }, [currentTab]);

  useEffect(() => {
    fetchRegisteredEvents();
    // Clear registered events when user logs out
    if (!currentUser) setRegisteredEventIds([]);
  }, [currentUser]);

  const handleRegisterEvent = async (eventId: number) => {
    if (!currentUser) {
      alert("Please sign in to register for university events.");
      setCurrentTab('login-selection');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchGlobalData();
        await fetchRegisteredEvents();
        // Auto-show ticket for the registered event
        const evt = events.find(e => e.id === eventId);
        if (evt) setTicketEvent(evt);
      } else {
        alert(data.error || "Event registration failed.");
      }
    } catch (e) {
      alert("Failed to connect to events backend server.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <main className="flex-grow">

        {/* 1. HOME TAB */}
        {currentTab === 'home' && (
          <Home setCurrentTab={setCurrentTab} currentUser={currentUser} />
        )}

        {currentTab !== 'home' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* 2. DIRECTORY TAB */}
            {currentTab === 'directory' && (
              <div className="space-y-4">
                {(currentUser?.role === 'alumni' || currentUser?.role === 'student') && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentTab(`${currentUser.role}-dashboard`)}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all duration-200 group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                      Back to Dashboard
                    </button>
                  </div>
                )}
                <Directory currentUser={currentUser} setCurrentTab={setCurrentTab} />
              </div>
            )}

            {/* 3. STORIES TAB */}
            {currentTab === 'stories' && (
              <div className="space-y-12 pb-16 text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <Award className="w-8 h-8 text-primary" /> Alumni Success Stories
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Inspiring career stories and testimonials from our global alumni network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card p-6 rounded-3xl border border-slate-200/50 flex gap-6 items-center">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80" alt="John Doe" className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">John Doe</h3>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">Staff Software Engineer at Google</p>
                      <p className="text-xs text-slate-500">"Apex University gave me the exact foundation required to excel in tech industries."</p>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-slate-200/50 flex gap-6 items-center">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80" alt="Jane Smith" className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">Jane Smith</h3>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">Vice President at Goldman Sachs</p>
                      <p className="text-xs text-slate-500">"The leadership committee matches, campus seminars, and finance courses paved my wall street career."</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. EVENTS TAB */}
            {currentTab === 'events' && (
              <div className="space-y-8 pb-16 text-left">
                {(currentUser?.role === 'alumni' || currentUser?.role === 'student') && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentTab(`${currentUser.role}-dashboard`)}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all duration-200 group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                      Back to Dashboard
                    </button>
                  </div>
                )}

                {/* Guest Registration Prompt Banner */}
                {!currentUser && (
                  <div className="rounded-3xl overflow-hidden border border-amber-200/60 dark:border-amber-700/30 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="text-4xl flex-shrink-0">🎟️</div>
                    <div className="flex-1 text-left">
                      <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Register for Full Event Access</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Create a free <strong>Student</strong> or <strong>Alumni</strong> account to register for events, download admittance tickets, and get personalised benefits.
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setCurrentTab('login-selection')}
                        className="btn-primary text-xs py-2 px-4 font-bold whitespace-nowrap"
                      >
                        Register as Student
                      </button>
                      <button
                        onClick={() => setCurrentTab('login-selection')}
                        className="btn-secondary text-xs py-2 px-4 font-bold whitespace-nowrap border border-primary/30"
                      >
                        Register as Alumni
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <Calendar className="w-8 h-8 text-primary" /> University Events
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Reunions, technical panels, startup seminars, and mixers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.length > 0 ? (
                    events.map((evt) => {
                      const slotsLeft = evt.capacity - evt.registered_count;
                      const isRegistered = currentUser && registeredEventIds.includes(evt.id);
                      return (
                        <div key={evt.id} className="glass-card rounded-3xl overflow-hidden border border-slate-200/50 flex flex-col">
                          <img src={evt.image_url} alt={evt.title} className="w-full h-48 object-cover" />
                          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2 py-0.5 rounded-full">
                                {evt.type}
                              </span>
                              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-snug">{evt.title}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed font-light">{evt.description}</p>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/30">
                              <p>📅 Date: <strong>{evt.date}</strong> at <strong>{evt.time}</strong></p>
                              <p>📍 Location: <strong>{evt.location}</strong></p>
                              <p>🎟️ Slots Left: <strong>{slotsLeft > 0 ? `${slotsLeft} / ${evt.capacity}` : 'Full'}</strong></p>
                            </div>

                            {!currentUser ? (
                              /* Guest: show locked state */
                              <button
                                onClick={() => setCurrentTab('login-selection')}
                                className="w-full btn-secondary text-xs py-2.5 font-bold justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-500"
                              >
                                🔒 Sign in to Register
                              </button>
                            ) : isRegistered ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 rounded-2xl py-2">
                                  <CheckCircle2 className="w-4 h-4" /> Registered
                                </div>
                                <button
                                  onClick={() => setTicketEvent(evt)}
                                  className="w-full btn-primary text-xs py-2.5 font-bold justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                                >
                                  <Ticket className="w-4 h-4" /> View / Download Ticket
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRegisterEvent(evt.id)}
                                disabled={slotsLeft <= 0}
                                className="w-full btn-primary text-xs py-2.5 font-bold justify-center"
                              >
                                {slotsLeft <= 0 ? 'Fully Registered' : 'Register for Event'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-400 py-10">No events currently listed in database schema.</p>
                  )}
                </div>
              </div>
            )}

            {/* 5. JOBS TAB */}
            {currentTab === 'jobs' && (
              <div className="space-y-8 pb-16 text-left">
                {(currentUser?.role === 'alumni' || currentUser?.role === 'student') && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentTab(`${currentUser.role}-dashboard`)}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all duration-200 group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                      Back to Dashboard
                    </button>
                  </div>
                )}

                {/* Guest Registration Prompt Banner */}
                {!currentUser && (
                  <div className="rounded-3xl overflow-hidden border border-blue-200/60 dark:border-blue-700/30 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="text-4xl flex-shrink-0">💼</div>
                    <div className="flex-1 text-left">
                      <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Unlock Career Opportunities</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Register as a <strong>Student</strong> to apply for internships & jobs, or as an <strong>Alumni</strong> to post career openings and access the career board.
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setCurrentTab('login-selection')}
                        className="btn-primary text-xs py-2 px-4 font-bold whitespace-nowrap"
                      >
                        Register as Student
                      </button>
                      <button
                        onClick={() => setCurrentTab('login-selection')}
                        className="btn-secondary text-xs py-2 px-4 font-bold whitespace-nowrap border border-primary/30"
                      >
                        Register as Alumni
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-8 h-8 text-primary" /> Career board & Internships
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Opportunities posted by verified alumni engineers, designers, and managers.</p>
                </div>

                <div className="space-y-4">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <div key={job.id} className="glass-card p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-lg">{job.title}</h3>
                            <span className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                              {job.type}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs flex flex-wrap gap-x-3 gap-y-1 font-semibold">
                            <span>🏢 {job.company}</span>
                            <span>📍 {job.location}</span>
                            {job.salary && <span>💰 {job.salary}</span>}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-light">{job.description}</p>
                        </div>

                        {!currentUser ? (
                          <button
                            onClick={() => setCurrentTab('login-selection')}
                            className="btn-secondary text-xs py-2 px-5 shrink-0 border border-slate-300 dark:border-slate-700 text-slate-500"
                          >
                            🔒 Sign in to Apply
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentTab(`${currentUser.role}-dashboard`)}
                            className="btn-primary text-xs py-2 px-5 shrink-0"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 py-10">No career opportunities currently listed in database schema.</p>
                  )}
                </div>
              </div>
            )}

            {/* 6. DONATIONS TAB */}
            {currentTab === 'donations' && (
              <div className="space-y-12 pb-16 text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                    <Heart className="w-8 h-8 text-primary" /> Contributions & Giving
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Fund dynamic scholarships and university infrastructure development projects.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-3xl border border-slate-200/50 flex flex-col justify-between h-64 text-left">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">Underprivileged Scholarship Fund</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">Supporting academically outstanding students requiring structural financial assistance.</p>
                    </div>
                    <button onClick={() => {
                      if (currentUser) setCurrentTab(`${currentUser.role}-dashboard`);
                      else { alert("Please log in to access the secure giving checkout."); setCurrentTab('login-selection'); }
                    }} className="btn-primary w-full text-xs py-2 justify-center mt-4">Sponsor Fund</button>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-slate-200/50 flex flex-col justify-between h-64 text-left">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">AI Scientific Laboratory</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">Equipping labs with GPU computation centers and dynamic AI workspace research resources.</p>
                    </div>
                    <button onClick={() => {
                      if (currentUser) setCurrentTab(`${currentUser.role}-dashboard`);
                      else { alert("Please log in to access the secure giving checkout."); setCurrentTab('login-selection'); }
                    }} className="btn-primary w-full text-xs py-2 justify-center mt-4 font-bold">Sponsor Lab</button>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-slate-200/50 flex flex-col justify-between h-64 text-left">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base">Campus Sports Arena</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">Constructing indoor basketball courts, soccer turfs, and track facilities.</p>
                    </div>
                    <button onClick={() => {
                      if (currentUser) setCurrentTab(`${currentUser.role}-dashboard`);
                      else { alert("Please log in to access the secure giving checkout."); setCurrentTab('login-selection'); }
                    }} className="btn-primary w-full text-xs py-2 justify-center mt-4">Sponsor Arena</button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. CONTACT US TAB */}
            {currentTab === 'contact' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-16 text-left">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-primary" /> Contact Us
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Have inquiries regarding the alumni association? We are here to support you.</p>
                  </div>

                  <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                    <p>👤 <strong>Secretary:</strong> Dr. Shaikh Aiyaz Hussain Jiyaull Hussain</p>
                    <p>🏫 <strong>Address:</strong> C/o Anjuman Khairul Islam's Poona College, 1647, Camp, New Modikhana, Pune</p>
                    <p>📞 <strong>Mobile No.:</strong> 9422517809</p>
                    <p>✉️ <strong>Email Id:</strong> aiyaz9422@yahoo.co.in</p>
                  </div>

                  {/* Google Map */}
                  <div className="w-full h-64 rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-slate-100">
                    <iframe 
                      src="https://maps.google.com/maps?q=Poona%20College,%20Camp,%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                      className="w-full h-full border-0" 
                      allowFullScreen={true} 
                      loading="lazy"
                      title="Google Map Location"
                    ></iframe>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-slate-200/50 flex flex-col justify-center">
                  <h3 className="font-extrabold text-lg mb-4">Send Us a Message</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Message submitted successfully! Our support team will reach out to you shortly.");
                      setContactName('');
                      setContactEmail('');
                      setContactMobile('');
                      setContactMsg('');
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                      <input
                        type="text" required placeholder="John Doe" className="glass-input"
                        value={contactName} onChange={e => setContactName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email" required placeholder="john.doe@gmail.com" className="glass-input"
                        value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile No. *</label>
                      <input
                        type="tel" required placeholder="e.g. 9850710713" className="glass-input"
                        value={contactMobile} onChange={e => setContactMobile(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                      <textarea
                        rows={4} required placeholder="Detail your query..." className="glass-input resize-none"
                        value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-primary text-xs font-bold py-3 justify-center gap-1.5 cursor-pointer">
                      <Send className="w-4 h-4 text-white" />
                      <span>Send Inquiries</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
            {/* 7.5. ABOUT SUBPAGES */}
            {currentTab.startsWith('about-') && (
              <AboutPage subpageId={currentTab.replace('about-', '')} setCurrentTab={setCurrentTab} />
            )}

            {/* 7.6. ACADEMIC SUBPAGES */}
            {currentTab.startsWith('academic-') && (
              <AboutPage subpageId={currentTab.replace('academic-', '')} setCurrentTab={setCurrentTab} />
            )}

            {/* 7.7. STUDENT CORNER SUBPAGES */}
            {currentTab.startsWith('student-') && currentTab !== 'student-dashboard' && (
              <AboutPage subpageId={currentTab.replace('student-', '')} setCurrentTab={setCurrentTab} />
            )}

            {/* 7.7.5. CUSTOM MENU SUBPAGES */}
            {currentTab.startsWith('custmenu__') && (() => {
              // Tab format: custmenu__{parentId}__{childId} or custmenu__{parentId}__{childId}__{subChildId}
              // The page slug is always the LAST segment
              const parts = currentTab.split('__');
              const pageId = parts[parts.length - 1];
              return <AboutPage subpageId={pageId} setCurrentTab={setCurrentTab} />;
            })()}

            {/* 7.8. GALLERY PAGE */}
            {currentTab === 'gallery' && (
              <GalleryPage />
            )}

            {/* 7.9. PLACEMENTS PAGE */}
            {currentTab === 'placements' && (
              <PlacementPage />
            )}

            {/* 8. AUTH PAGE VIEW PORT */}
            {currentTab === 'login-selection' && (
              <AuthPages setCurrentUser={setCurrentUser} setCurrentTab={setCurrentTab} />
            )}

            {/* 9. ROLE DASHBOARDS */}
            {currentTab === 'student-dashboard' && currentUser && (
              <StudentDashboard currentUser={currentUser} setCurrentTab={setCurrentTab} />
            )}
            {currentTab === 'alumni-dashboard' && currentUser && (
              <AlumniDashboard currentUser={currentUser} setCurrentTab={setCurrentTab} />
            )}
            {currentTab === 'admin-dashboard' && currentUser && (
              <AdminDashboard currentUser={currentUser} setCurrentTab={setCurrentTab} />
            )}
          </div>
        )}
      </main>

      {/* Floating Copilot assistant */}
      <AIChatbot />

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} {settings.univ_name}, Savitribai Phule Pune University. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* 🎟️ Event Ticket Modal */}
      {ticketEvent && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md rounded-3xl border border-primary/20 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900">
            {/* Ticket Header */}
            <div className="relative p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <button
                onClick={() => setTicketEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-3 z-10 relative">
                <Ticket className="w-5 h-5 text-white/80" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Event Admission Ticket</span>
              </div>
              <h2 className="text-xl font-extrabold leading-tight z-10 relative">{ticketEvent.title}</h2>
              <p className="text-xs text-white/70 font-semibold mt-1 z-10 relative">{ticketEvent.type}</p>
            </div>

            {/* Tear Line */}
            <div className="flex items-center px-4">
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 -ml-7 flex-shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700 mx-2" />
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 -mr-7 flex-shrink-0" />
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Attendee</p>
                    <p className="font-extrabold text-sm text-slate-800 dark:text-white">{currentUser?.full_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Date</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300">{ticketEvent.date}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Time</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300">{ticketEvent.time}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Venue</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{ticketEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Ticket No.</p>
                    <p className="font-mono font-bold text-primary">TKT-{ticketEvent.id.toString().padStart(3,'0')}-{currentUser?.id?.toString().padStart(4,'0')}</p>
                  </div>
                </div>

                {/* QR Code block */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="bg-slate-800 dark:bg-white p-2.5 rounded-xl shadow-md">
                    <svg className="w-16 h-16 text-white dark:text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="25" height="25" />
                      <rect x="5" y="5" width="15" height="15" fill="black" className="text-slate-800 dark:text-white" style={{fill: 'var(--qr-bg, #1e293b)'}} />
                      <rect x="8" y="8" width="9" height="9" />
                      <rect x="75" y="0" width="25" height="25" />
                      <rect x="80" y="5" width="15" height="15" fill="black" style={{fill: 'var(--qr-bg, #1e293b)'}} />
                      <rect x="83" y="8" width="9" height="9" />
                      <rect x="0" y="75" width="25" height="25" />
                      <rect x="5" y="80" width="15" height="15" fill="black" style={{fill: 'var(--qr-bg, #1e293b)'}} />
                      <rect x="8" y="83" width="9" height="9" />
                      <rect x="35" y="5" width="8" height="8" />
                      <rect x="50" y="15" width="6" height="6" />
                      <rect x="65" y="10" width="8" height="8" />
                      <rect x="40" y="30" width="10" height="10" />
                      <rect x="10" y="45" width="8" height="8" />
                      <rect x="30" y="50" width="6" height="6" />
                      <rect x="55" y="45" width="12" height="12" />
                      <rect x="75" y="75" width="8" height="8" />
                      <rect x="60" y="80" width="6" height="6" />
                      <rect x="45" y="70" width="8" height="8" />
                      <rect x="85" y="40" width="8" height="8" />
                    </svg>
                  </div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide text-center">Scan to Verify</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Registration confirmed. Present this ticket at the venue entrance.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setTicketEvent(null)}
                className="flex-1 btn-secondary text-xs py-2.5 font-bold justify-center"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 btn-primary text-xs py-2.5 font-bold justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Custom Modal / Dialog Box */}

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300">
          <div className="glass-card max-w-md w-full rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-2xl ${modal.type === 'success' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                    modal.type === 'error' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                      'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                  {modal.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                  {modal.type === 'error' && <AlertTriangle className="w-6 h-6" />}
                  {modal.type === 'info' && <Info className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">
                    {modal.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    System Message
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              {modal.message}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className={`btn-primary text-xs py-2 px-6 font-bold cursor-pointer shadow-md uppercase tracking-wider ${modal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                    modal.type === 'error' ? 'bg-rose-600 hover:bg-rose-700 text-white' :
                      'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
