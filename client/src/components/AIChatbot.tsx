import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your SPPU Sports & Physical Education assistant. I can help you with:\n\n🎓 Academic Courses (M.P.Ed, Ph.D, Yoga, Gym Instructor)\n🏆 Tournaments, Draws & Results\n📅 Sports Calendar & Events\n📋 Circulars & NCTE Disclosures\n📍 Admissions & Contact Info\n\nWhat would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      let botResponse = "I'm here to help! Try asking about 'courses', 'admissions', 'tournaments', 'draws', 'results', 'circulars', 'calendar', 'committee', 'facilities', or 'contact'.";
      const q = text.toLowerCase();

      // ── Courses ──────────────────────────────────────────────────────────────
      if (q.includes('m.p.ed') || q.includes('mped') || (q.includes('master') && q.includes('physical'))) {
        botResponse = "📘 M.P.Ed (Master of Physical Education)\n\nDuration: 2 Years\nType: Post Graduate\nAdmission: CET Entrance Exam\n\nThis flagship post-graduate programme covers sports science, coaching methodology, exercise physiology, and physical education administration. Apply via SPPU's central CET process.\n\nHead to Academic → Admissions or Academic → Academic Courses on the menu for full details.";

      } else if (q.includes('ph.d') || q.includes('phd') || q.includes('doctorate') || q.includes('doctor of philosophy')) {
        botResponse = "🎓 Ph.D. in Physical Education\n\nDuration: 3–6 Years\nType: Doctoral Programme\nAdmission: Supervisor Approval + University Registration\n\nCandidates must identify an approved supervisor and register through the SPPU Ph.D. Coordination Committee. The programme involves coursework, research, and thesis submission.\n\nVisit Academic → Courses for more information.";

      } else if (q.includes('yoga') || q.includes('fcye')) {
        botResponse = "🧘 Foundation Certificate in Yoga Education (FCYE)\n\nDuration: 3 Months\nType: Certificate Course\nBatches: July & January\nAdmission: Direct (no entrance exam)\n\nThis certificate course trains students in the theory and practice of yoga, suitable for educators and fitness professionals. Offered twice a year.\n\nSee Academic → Admissions for application details.";

      } else if (q.includes('gym instructor') || q.includes('fcgi')) {
        botResponse = "💪 Foundation Certificate in Gym Instructor (FCGI)\n\nDuration: 3 Months\nType: Certificate Course\nBatch: January\nAdmission: Direct Admission\n\nDesigned for those wishing to build careers as gym and fitness instructors. Covers anatomy, exercise techniques, nutrition basics, and practical training.\n\nVisit Academic → Admissions for the application process.";

      } else if (q.includes('fitness') || q.includes('fcf') || (q.includes('certificate') && q.includes('fitness'))) {
        botResponse = "🏋️ Foundation Certificate in Fitness & Sports (FCFS)\n\nDuration: 3 Months\nType: Certificate Course\nBatch: July\nAdmission: Direct Admission\n\nFocuses on fitness science, sports training principles, and health promotion. Ideal for aspiring fitness coaches and sports trainers.\n\nCheck Academic → Admissions for enrollment details.";

      } else if (q.includes('course') || q.includes('programme') || q.includes('degree') || q.includes('study') || q.includes('program')) {
        botResponse = "📚 Academic Courses Offered:\n\n🎓 Post Graduate:\n• M.P.Ed – Master of Physical Education (2 Years, CET)\n\n🔬 Doctoral:\n• Ph.D. in Physical Education (3–6 Years)\n\n📜 Certificate Courses:\n• FCYE – Foundation Certificate in Yoga Education (3 Months – July & Jan)\n• FCGI – Foundation Certificate in Gym Instructor (3 Months – Jan)\n• FCFS – Foundation Certificate in Fitness & Sports (3 Months – July)\n\nNavigate to Academic → Academic Courses on the menu for intake details, syllabus, and eligibility.";

      // ── Admissions ───────────────────────────────────────────────────────────
      } else if (q.includes('admission') || q.includes('apply') || q.includes('eligibility') || q.includes('enrollment') || q.includes('enroll') || q.includes('intake') || q.includes('cet')) {
        botResponse = "📋 Admissions at Dept. of Sports & Physical Education, SPPU:\n\n• M.P.Ed: Admission via SPPU CET Entrance Exam. Graduates with B.P.Ed (min. 45–50% marks) are eligible.\n• Certificate Courses (Yoga, Gym, Fitness): Direct admission. Applications accepted July & January for respective batch starts.\n• Ph.D.: Supervisor identification + University registration required.\n\nProspectus, eligibility criteria, and notices are published on the portal under Academic → Admissions Notice.\n\nFor queries, contact the office at:\n📞 020-25601299\n📧 sports@unipune.ac.in";

      // ── Results & Draws ───────────────────────────────────────────────────────
      } else if (q.includes('draw') || (q.includes('bracket') && q.includes('sport')) || q.includes('fixture') || q.includes('match schedule')) {
        botResponse = "📋 Tournament Draws & Fixtures\n\nDraw sheets, match brackets, and tournament fixtures for inter-collegiate sports events are published under:\n🔗 Student Corner → Draws\n\nYou can filter draws by sport (football, cricket, basketball, etc.) or search by event name. Documents are downloadable as PDFs.\n\nThe Pune City Zone holds draws for events at the start of each tournament season.";

      } else if (q.includes('result') || q.includes('score') || q.includes('winner') || q.includes('champion') || q.includes('standing') || q.includes('merit') || q.includes('rank')) {
        botResponse = "🏆 Tournament Results & Standings\n\nFinal results, champion teams, and merit lists for all zonal sports tournaments are published under:\n🔗 Student Corner → Results\n\nYou can filter results by sport, search by team or event name, sort by newest/oldest, and download result sheets (PDF) where available.\n\nCategories include: Result, Draw, Fixtures, Bracket, Schedule, Standings.";

      // ── Tournaments / Sports ───────────────────────────────────────────────────
      } else if (q.includes('tournament') || q.includes('inter-collegiate') || q.includes('zonal') || q.includes('sport') || q.includes('game') || q.includes('competition') || q.includes('pune city zone')) {
        botResponse = "🏅 Inter-Collegiate Sports Tournaments – Pune City Zone\n\nThe Department of Sports & Physical Education, SPPU organizes:\n\n• Zonal Level Tournaments (Pune City Zone)\n• Inter-Zonal Competitions\n• State & National Level Representation\n\nSports covered include: Football, Cricket, Basketball, Volleyball, Kabaddi, Athletics (Track & Field), Badminton, Table Tennis, and more.\n\n📋 Draws → Student Corner → Draws\n🏆 Results → Student Corner → Results\n📅 Schedule → Student Corner → Sports Calendar";

      // ── Sports Calendar ───────────────────────────────────────────────────────
      } else if (q.includes('calendar') || q.includes('schedule') || q.includes('annual') || q.includes('season') || (q.includes('sport') && q.includes('date'))) {
        botResponse = "📅 Sports Calendar & Annual Schedule\n\nThe annual sports calendar provides:\n• Match fixtures and event schedules\n• Deadlines for team registrations and entries\n• Zonal and inter-zonal event timelines\n• Venue and tournament bracket details\n\nAccess it via: Student Corner → Sports Calendar\n\nEvents run across the academic year (June–April), coordinated by the Pune City Zone Sports Committee.";

      // ── Circulars ─────────────────────────────────────────────────────────────
      } else if (q.includes('circular') || q.includes('notice') || q.includes('notification') || q.includes('announcement') || q.includes('order')) {
        botResponse = "📢 Circulars & Official Notices\n\nOfficial circulars from the Department of Sports & Physical Education and the Pune City Zone Sports Committee are published under:\n🔗 About → Circulars\n\nCirculars include:\n• Tournament entry deadlines\n• Inter-collegiate sports guidelines\n• Academic & administrative notifications\n• SPPU official orders\n\nAll circulars are searchable, filterable, and available for PDF download.";

      // ── NCTE Disclosures ─────────────────────────────────────────────────────
      } else if (q.includes('ncte') || q.includes('disclosure') || q.includes('recognition') || q.includes('regulatory') || q.includes('mandatory')) {
        botResponse = "🛡️ NCTE Mandatory Disclosures\n\nThe National Council for Teacher Education (NCTE) requires all physical education departments to publish mandatory disclosures including:\n• Recognition Order\n• Affiliation Details\n• Faculty & Infrastructure Data\n• Fee Structure\n• Student Intake Records\n\nAll NCTE compliance documents are available under:\n🔗 About → NCTE Mandatory Disclosures\n\nDocuments can be viewed and downloaded for reference.";

      // ── Committee ─────────────────────────────────────────────────────────────
      } else if (q.includes('committee') || q.includes('member') || q.includes('governing') || q.includes('board') || q.includes('management')) {
        botResponse = "👥 Sports Committee Members\n\nThe Pune City Zone Sports Committee comprises representatives from affiliated colleges across Pune. Committee members oversee:\n• Tournament organization and scheduling\n• Sports policy and governance\n• Zonal championship coordination\n• Student welfare in sports\n\nTo view committee member profiles, designations, and college affiliations:\n🔗 About → Committee";

      // ── Director / HOD ────────────────────────────────────────────────────────
      } else if (q.includes('director') || q.includes('head') || q.includes('hod') || q.includes('professor') || q.includes('faculty') || q.includes('staff')) {
        botResponse = "👤 Director of Physical Education & Faculty\n\nThe Department is headed by the Director of Physical Education at Savitribai Phule Pune University. The Director oversees all academic programmes, sports activities, and administrative operations.\n\nTo view the Director's message and profile:\n🔗 About → Director of Phy. Edu.\n\nFor messages from Heads of Departments of affiliated colleges:\n🔗 About → From HODs/Directors Desk";

      // ── Facilities ────────────────────────────────────────────────────────────
      } else if (q.includes('facilit') || q.includes('infrastructure') || q.includes('ground') || q.includes('gym') || q.includes('stadium') || q.includes('lab') || q.includes('equipment')) {
        botResponse = "🏟️ Sports Facilities at SPPU\n\nThe Department maintains excellent sports and academic infrastructure including:\n• Sports grounds (cricket, football, athletics track)\n• Indoor courts (badminton, table tennis, basketball)\n• Gymnasium and fitness centre\n• Sports science laboratory\n• Academic library and reading room\n• Seminar and conference facilities\n\nFor detailed infrastructure information:\n🔗 About → Facilities";

      // ── Gallery ───────────────────────────────────────────────────────────────
      } else if (q.includes('gallery') || q.includes('photo') || q.includes('image') || q.includes('picture') || q.includes('photograph')) {
        botResponse = "📸 Sports Gallery\n\nThe gallery features photographs from:\n• Inter-collegiate tournaments and championship events\n• Annual sports meets and zonal competitions\n• Award ceremonies and prize distributions\n• Campus events and activities\n\nBrowse all photos at:\n🔗 Gallery (accessible from the main navigation)";

      // ── Placements / Careers ───────────────────────────────────────────────────
      } else if (q.includes('placement') || q.includes('career') || q.includes('job') || q.includes('recruit') || q.includes('employment') || q.includes('intern')) {
        botResponse = "💼 Careers & Placements\n\nGraduates of M.P.Ed and certificate programmes from SPPU find opportunities in:\n• Government school & college teaching posts\n• Sports coaching (state, district, school level)\n• National Sports Federations\n• Fitness and wellness industry\n• Sports management and administration\n\nView career opportunities and placement records:\n🔗 Placements (main navigation)\n🔗 Student Corner → Careers";

      // ── Contact ───────────────────────────────────────────────────────────────
      } else if (q.includes('contact') || q.includes('office') || q.includes('address') || q.includes('phone') || q.includes('email') || q.includes('location') || q.includes('where') || q.includes('timing') || q.includes('hour')) {
        botResponse = "📍 Contact Information\n\nDepartment of Sports & Physical Education\nSavitribai Phule Pune University (SPPU)\nIravati Karve Social Science Complex,\nBehind SET Guest House,\nPune – 411007, Maharashtra, India\n\n📞 Phone: 020-25601299\n📧 Email: sports@unipune.ac.in\n\n⏰ Office Hours: 10:30 AM – 06:00 PM\n(Monday to Saturday; closed on public holidays)\n\nYou can also use the Contact form on the portal to send your query directly.";

      // ── Syllabus ──────────────────────────────────────────────────────────────
      } else if (q.includes('syllabus') || q.includes('curriculum') || q.includes('subject') || q.includes('paper') || q.includes('semester') || q.includes('credit')) {
        botResponse = "📖 Curriculum & Syllabus\n\nDetailed semester-wise syllabus, credit structures, and scheme of courses for M.P.Ed and other programmes are published under:\n🔗 Academic → Curriculum Syllabus\n\nSyllabus documents are available for download. These follow the SPPU credit-based grading system.";

      // ── Academic Results ─────────────────────────────────────────────────────
      } else if (q.includes('exam result') || q.includes('academic result') || q.includes('marksheet') || q.includes('mark') || (q.includes('result') && (q.includes('m.p.ed') || q.includes('exam') || q.includes('university')))) {
        botResponse = "📊 Academic Examination Results\n\nM.P.Ed and certificate course examination results and term marksheets are published under:\n🔗 Academic → Academic Results\n\nFor official SPPU university results, visit: unipune.ac.in\n\nFor result-related queries, contact the department office at 020-25601299.";

      // ── Souvenirs / Publications ───────────────────────────────────────────────
      } else if (q.includes('souvenir') || q.includes('publication') || q.includes('magazine') || q.includes('commemorat') || q.includes('book')) {
        botResponse = "📚 Souvenirs & Publications\n\nThe department publishes commemorative souvenir editions for major sports events and annual gatherings. These digital publications contain:\n• Event highlights and results\n• Photo galleries\n• Messages from the Director & Committee\n• Student achievements\n\nAccess them under:\n🔗 Student Corner → Souvenirs";

      // ── Activities / Research / Projects ──────────────────────────────────────
      } else if (q.includes('activit') || q.includes('club') || q.includes('extracurricular') || q.includes('research') || q.includes('project')) {
        botResponse = "🔬 Student Activities & Research\n\nThe department actively promotes student participation in:\n• Campus sports activities and intramural events\n• Research in sports science and physical education\n• Student project submissions\n• NSS, NCC, and fitness awareness campaigns\n\nBrowse the relevant sections:\n🔗 Student Corner → Activities\n🔗 Student Corner → Research\n🔗 Student Corner → Projects";

      // ── Navigation Help ───────────────────────────────────────────────────────
      } else if (q.includes('menu') || q.includes('navigate') || q.includes('section') || q.includes('page') || q.includes('where can') || q.includes('how do i find') || q.includes('how to')) {
        botResponse = "🗺️ Website Navigation Guide\n\n📌 Main Sections:\n• Home – Hero slider, features, news ticker\n• About – About Us, Committee, Director, Circulars, NCTE, Facilities\n• Academic – Courses, Admissions, Syllabus, Exam Results\n• Student Corner – Events, Draws, Results, Calendar, Activities, Souvenirs\n• Gallery – Sports event photographs\n• Placements – Career outcomes and opportunities\n• Contact – Address, phone, email, inquiry form\n\n🔐 Login as Student or Alumni to register for events and access your dashboard.";

      // ── Registration / Login ──────────────────────────────────────────────────
      } else if (q.includes('login') || q.includes('register') || q.includes('sign in') || q.includes('sign up') || q.includes('account') || q.includes('dashboard') || q.includes('student portal') || q.includes('alumni')) {
        botResponse = "🔐 Login & Registration\n\nYou can create a free account as a:\n• Student – Register for events, access the sports calendar, download tickets, and track registrations.\n• Alumni – Connect with the institution, access career opportunities, and view your alumni profile.\n\nClick 'Login / Register' in the top navbar to get started. Once logged in, your personalized dashboard will be accessible.";

      // ── Events ────────────────────────────────────────────────────────────────
      } else if (q.includes('event') || q.includes('seminar') || q.includes('workshop') || q.includes('fest') || q.includes('annual') && q.includes('meet')) {
        botResponse = "🎉 Sports & Academic Events\n\nEvents organized by the Department include:\n• Inter-collegiate sports tournaments (zonal and state level)\n• Annual Sports Meet\n• Physical Education seminars and workshops\n• NSS and health awareness camps\n• Prize distribution ceremonies\n\nView upcoming events and register under:\n🔗 Student Corner → Events\n\nLogin as Student or Alumni to register and download event admission tickets.";

      // ── Hello / Greeting ─────────────────────────────────────────────────────
      } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste') || q.includes('good morning') || q.includes('good afternoon')) {
        botResponse = "Hello! 👋 Welcome to the Department of Sports & Physical Education Portal, Savitribai Phule Pune University.\n\nI can help you with:\n• 🎓 Academic Courses (M.P.Ed, Ph.D, Yoga, Gym)\n• 🏆 Tournaments, Draws & Results\n• 📅 Sports Calendar & Events\n• 📋 Circulars & Admissions\n• 📍 Contact & Facilities\n\nWhat would you like to know?";

      // ── About the Dept / University ───────────────────────────────────────────
      } else if (q.includes('about') || q.includes('sppu') || q.includes('university') || q.includes('department') || q.includes('pune university') || q.includes('savitribai')) {
        botResponse = "🏛️ About the Department\n\nThe Department of Sports & Physical Education is a premier unit of Savitribai Phule Pune University (SPPU), formerly the University of Pune.\n\nLocated at the Iravati Karve Social Science Complex, the department:\n• Conducts M.P.Ed, Ph.D, and Certificate programmes\n• Organizes all inter-collegiate sports for the Pune City Zone\n• Manages zonal tournament draws, results, and sports calendars\n• Oversees sports policy for all affiliated colleges in Pune\n\nFor the full institutional profile:\n🔗 About → About Us";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
    }, 800);
  };

  const quickQuestions = [
    { label: '🎓 Courses', query: 'What academic courses are offered?' },
    { label: '🏆 Draws & Results', query: 'Where can I find tournament draws and results?' },
    { label: '📋 Admissions', query: 'How to apply for admission?' },
    { label: '📍 Contact', query: 'What is the office address and contact info?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-primary hover:bg-primary-dark text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse relative"
          title="Open AI Assistant"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[540px] glass-card rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 border border-primary/20 bg-white/95 dark:bg-slate-900/95">
          {/* Chat Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">SPPU Sports Assistant</h3>
                <span className="text-[10px] text-white/70 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" /> Dept. of Sports & Phy. Edu.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/15 transition-all text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Buttons */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 flex-wrap bg-white/40 dark:bg-slate-900/40 shrink-0">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.query)}
                className="text-[10px] font-semibold text-primary hover:bg-primary-light/50 bg-primary-light/20 px-2 py-1 rounded-lg border border-primary/20 dark:border-primary/10 transition-all"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center gap-2 bg-white dark:bg-slate-900 shrink-0">
            <input
              type="text"
              placeholder="Ask about courses, draws, results..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputValue)}
              className="flex-1 glass-input py-2 px-3 text-xs bg-slate-50 dark:bg-slate-950/50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white shadow transition-all hover:scale-105"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
