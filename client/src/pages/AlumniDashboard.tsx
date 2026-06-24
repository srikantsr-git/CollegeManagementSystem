import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DigitalAlumniCard } from '../components/DigitalAlumniCard';
import { AlumniProfile, Mentorship, Job, Donation } from '../types';
import { 
  User, Users, Briefcase, Award, Heart, ClipboardCheck, Calendar,
  MessageSquare, PlusCircle, CheckCircle, XCircle, ArrowRight, Download, CreditCard
} from 'lucide-react';

interface AlumniDashboardProps {
  currentUser: any;
  setCurrentTab: (tab: string) => void;
}

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({ currentUser, setCurrentTab }) => {
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  // Profile Form
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [college, setCollege] = useState('');
  const [gradYear, setGradYear] = useState<number | ''>('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  // Job Post Form
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Internship'>('Full-time');
  const [jobDept, setJobDept] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobPostedMsg, setJobPostedMsg] = useState(false);

  // Donation Form
  const [donateAmount, setDonateAmount] = useState('');
  const [donateCampaign, setDonateCampaign] = useState('Scholarship Fund for Underprivileged Students');
  const [receiptTarget, setReceiptTarget] = useState<Donation | null>(null);

  // Meeting schedule state
  const [scheduleMeetingTarget, setScheduleMeetingTarget] = useState<Mentorship | null>(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingTopic, setMeetingTopic] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/alumni/${currentUser.id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setFullName(data.full_name || '');
        setMobile(data.mobile || '');
        setAddress(data.address || '');
        setCollege(data.college || '');
        setGradYear(data.grad_year || '');
        setCompany(data.company || '');
        setDesignation(data.designation || '');
        setIndustry(data.industry || '');
        setExperience(data.experience || 0);
        setCity(data.city || '');
        setCountry(data.country || '');
        setLinkedin(data.linkedin || '');
        setWebsite(data.website || '');
        setSkills(data.skills || '');
        setAchievements(data.achievements || '');
        setPhotoUrl(data.photo_url || '');
      }
    } catch(e) {
      console.warn("Express server offline, profile mock skipped");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await fetchProfile();
    try {
      // Mentorship matches
      const mRes = await fetch(`http://localhost:5001/api/mentorship?userId=${currentUser.id}&role=alumni`);
      const mData = await mRes.json();
      if (mRes.ok) setMentorships(mData);

      // Jobs posted by this user
      const jRes = await fetch('http://localhost:5001/api/jobs');
      const jData = await jRes.json();
      if (jRes.ok) setPostedJobs(jData.filter((job: any) => job.posted_by === currentUser.id));

      // Donations by this user
      const dRes = await fetch(`http://localhost:5001/api/donations?userId=${currentUser.id}`);
      const dData = await dRes.json();
      if (dRes.ok) setDonations(dData);

    } catch (e) {
      console.warn("Backend data fetch error");
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
      const res = await fetch(`http://localhost:5001/api/alumni/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          mobile,
          address,
          college,
          grad_year: gradYear,
          company,
          designation,
          industry,
          experience,
          city,
          country,
          linkedin,
          website,
          skills,
          achievements,
          photo_url: photoUrl
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

  // Job Posting
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          company: jobCompany,
          location: jobLoc,
          type: jobType,
          department: jobDept,
          description: jobDesc,
          requirements: jobReqs,
          salary: jobSalary,
          postedBy: currentUser.id
        })
      });
      if (res.ok) {
        setJobPostedMsg(true);
        setJobTitle('');
        setJobCompany('');
        setJobLoc('');
        setJobDept('');
        setJobDesc('');
        setJobReqs('');
        setJobSalary('');
        
        // Refresh Job List
        const jRes = await fetch('http://localhost:5001/api/jobs');
        const jData = await jRes.json();
        setPostedJobs(jData.filter((job: any) => job.posted_by === currentUser.id));

        setTimeout(() => setJobPostedMsg(false), 3000);
      }
    } catch(e) {
      alert("Job posting server request failed.");
    }
  };

  // Mentorship Response
  const handleMentorshipResponse = async (mId: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('http://localhost:5001/api/mentorship/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorshipId: mId, status })
      });
      if (res.ok) {
        alert(`Mentorship application ${status}!`);
        // Refresh Mentorship list
        const mRes = await fetch(`http://localhost:5001/api/mentorship?userId=${currentUser.id}&role=alumni`);
        const mData = await mRes.json();
        setMentorships(mData);
      }
    } catch (e) {
      alert("Mentorship response request failed.");
    }
  };

  // Schedule Meeting
  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleMeetingTarget) return;
    try {
      const res = await fetch('http://localhost:5001/api/mentorship/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorshipId: scheduleMeetingTarget.id,
          date: meetingDate,
          time: meetingTime,
          topic: meetingTopic
        })
      });
      if (res.ok) {
        alert("Mentorship meeting successfully scheduled! Calendar updated.");
        setScheduleMeetingTarget(null);
        setMeetingDate('');
        setMeetingTime('');
        setMeetingTopic('');
        
        // Refresh
        const mRes = await fetch(`http://localhost:5001/api/mentorship?userId=${currentUser.id}&role=alumni`);
        const mData = await mRes.json();
        setMentorships(mData);
      }
    } catch(e) {
      alert("Meeting scheduling failed.");
    }
  };

  // Donations Submit
  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donateAmount || isNaN(Number(donateAmount))) return;
    try {
      const res = await fetch('http://localhost:5001/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          donorName: currentUser.full_name,
          amount: parseFloat(donateAmount),
          campaign: donateCampaign
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Payment of $${donateAmount} approved! Donation added.`);
        setDonateAmount('');
        
        // Refresh Donations list
        const dRes = await fetch(`http://localhost:5001/api/donations?userId=${currentUser.id}`);
        const dData = await dRes.json();
        setDonations(dData);
      }
    } catch(e) {
      alert("Payment processor connection failed.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-16">
      <Sidebar role="alumni" activeTab={activeSubTab} setActiveTab={setActiveSubTab} />

      <div className="flex-1 text-left space-y-6">
        {/* PROFILE TAB */}
        {activeSubTab === 'profile' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-primary" /> Profile Management
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 1647, Camp, New Modikhana, Pune"
                  className="glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College</label>
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. Poona College of Arts, Science and Commerce"
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Year/Batch (Graduation Year)</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={e => setGradYear(parseInt(e.target.value) || '')}
                    placeholder="e.g. 2012"
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    placeholder="e.g. Technology"
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Years of Experience</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={e => setExperience(parseInt(e.target.value) || 0)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL (linkedin.com/in/...)</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profile Photo URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="React, Node.js, Leadership, Data Analysis"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Professional Achievements</label>
                <textarea
                  rows={3}
                  value={achievements}
                  onChange={e => setAchievements(e.target.value)}
                  className="glass-input text-xs resize-none"
                  placeholder="Summarize outstanding awards, fellowships, or publications..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary py-3 px-8 text-xs font-bold shadow-md shadow-primary/20">
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* NETWORKING TAB */}
        {activeSubTab === 'networking' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-primary" /> Alumni Network Directory
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Search and filter classmates using the general index.
            </p>
            <button onClick={() => setCurrentTab('directory')} className="btn-primary flex gap-2">
              Browse Alumni Directory <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* JOBS TAB */}
        {activeSubTab === 'jobs' && (
          <div className="space-y-6">
            {/* Create Job Form */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
                <PlusCircle className="w-6 h-6 text-primary" /> Post a Career Opportunity
              </h2>

              {jobPostedMsg && (
                <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">
                  Job posting successfully published to the Career Board!
                </div>
              )}

              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company</label>
                    <input
                      type="text"
                      required
                      value={jobCompany}
                      onChange={e => setJobCompany(e.target.value)}
                      placeholder="e.g. Google"
                      className="glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Location</label>
                    <input
                      type="text"
                      required
                      value={jobLoc}
                      onChange={e => setJobLoc(e.target.value)}
                      placeholder="e.g. Mountain View, CA"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employment Type</label>
                    <select
                      value={jobType}
                      onChange={e => setJobType(e.target.value as any)}
                      className="glass-input text-xs text-slate-500 font-semibold"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                    <input
                      type="text"
                      required
                      value={jobDept}
                      onChange={e => setJobDept(e.target.value)}
                      placeholder="e.g. Engineering"
                      className="glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
                  <textarea
                    rows={4}
                    required
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    className="glass-input text-xs resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
                  <input
                    type="text"
                    required
                    value={jobReqs}
                    onChange={e => setJobReqs(e.target.value)}
                    placeholder="React, CSS, 3+ years experience"
                    className="glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salary Range</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={e => setJobSalary(e.target.value)}
                    placeholder="e.g. $100k - $120k / year"
                    className="glass-input text-xs"
                  />
                </div>

                <button type="submit" className="btn-primary text-xs font-bold py-3 px-6 shadow-md shadow-primary/20">
                  Publish Job Opening
                </button>
              </form>
            </div>

            {/* List Posted Jobs */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">My Posted Jobs</h3>
              <div className="space-y-3">
                {postedJobs.length > 0 ? (
                  postedJobs.map((j) => (
                    <div key={j.id} className="p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{j.title}</h4>
                        <p className="text-slate-500 mt-1">{j.company} • {j.location} • <span className="bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded">{j.type}</span></p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live & Active</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">You haven't posted any jobs yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MENTORSHIP TAB */}
        {activeSubTab === 'mentorship' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-primary" /> Student Mentorship Request Queue
            </h2>

            <div className="space-y-4">
              {mentorships.length > 0 ? (
                mentorships.map((m) => (
                  <div key={m.id} className="p-5 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white">{m.mentee_name}</h3>
                        <p className="text-slate-500 mt-0.5">{m.degree} ({m.department}) • Interests: {m.interests}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        m.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/30 text-slate-600 dark:text-slate-400 italic">
                      " {m.notes || 'No notes provided by student.'} "
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/65">
                      {m.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleMentorshipResponse(m.id, 'approved')}
                            className="btn-primary text-[10px] py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 shadow-none"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve Match
                          </button>
                          <button
                            onClick={() => handleMentorshipResponse(m.id, 'rejected')}
                            className="btn-secondary text-[10px] py-1.5 px-3 text-rose-600 hover:bg-rose-50 border border-rose-200 dark:hover:bg-rose-950/20 shadow-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject Match
                          </button>
                        </>
                      )}

                      {m.status === 'approved' && (
                        <button
                          onClick={() => setScheduleMeetingTarget(m)}
                          className="btn-primary text-[10px] py-1.5 px-3 justify-center"
                        >
                          <Calendar className="w-3.5 h-3.5" /> Schedule Meeting
                        </button>
                      )}

                      {/* Display Scheduled Meetings */}
                      {(() => {
                        let meetingsList = [];
                        try {
                          meetingsList = JSON.parse(m.scheduled_meetings || '[]');
                        } catch(e) {
                          meetingsList = [];
                        }
                        if (meetingsList.length > 0) {
                          return (
                            <div className="w-full pt-2 mt-2 border-t border-dashed border-slate-100">
                              <p className="font-bold text-slate-500 mb-1">Scheduled Meetings:</p>
                              <div className="space-y-1">
                                {meetingsList.map((meet: any, idx: number) => (
                                  <div key={idx} className="bg-primary-light/40 dark:bg-primary/5 text-primary text-[10px] font-bold px-2 py-1 rounded flex justify-between">
                                    <span>📅 {meet.date} at {meet.time}</span>
                                    <span>Topic: {meet.topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No mentorship requests in your queue.</p>
              )}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeSubTab === 'events' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-primary" /> Alumni Events
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              View upcoming reunions, executive sessions, and webinars.
            </p>
            <button onClick={() => setCurrentTab('events')} className="btn-primary flex gap-2">
              Browse Events Portal <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeSubTab === 'donations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Make Donation */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-primary" /> Donations & Giving
              </h2>

              <form onSubmit={handleDonateSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donation Campaign</label>
                  <select
                    value={donateCampaign}
                    onChange={e => setDonateCampaign(e.target.value)}
                    className="glass-input text-xs text-slate-500 font-semibold"
                  >
                    <option value="Scholarship Fund for Underprivileged Students">Scholarship Fund</option>
                    <option value="New Campus Sports Center Development">Sports Center Fund</option>
                    <option value="AI Center for Scientific Research">AI Lab Sponsorship</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount (USD)</label>
                  <input
                    type="text"
                    required
                    value={donateAmount}
                    onChange={e => setDonateAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="$1,000"
                    className="glass-input text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/30 text-[10px] text-slate-400">
                  ⚡ Payments are routed through a secure simulated gateway. Instant 80G tax receipt will be downloadable.
                </div>

                <button type="submit" className="btn-primary text-xs font-bold py-3 px-6 shadow-md shadow-primary/20">
                  Process Safe Donation
                </button>
              </form>
            </div>

            {/* Donation History */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">My Donation History</h3>
                <div className="space-y-3">
                  {donations.length > 0 ? (
                    donations.map((d) => (
                      <div key={d.id} className="p-3.5 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl flex justify-between items-center text-xs">
                        <div className="text-left">
                          <p className="font-bold text-slate-800 dark:text-white">${d.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">{d.campaign}</p>
                        </div>
                        <button
                          onClick={() => setReceiptTarget(d)}
                          className="btn-secondary text-[9px] py-1 px-2.5 flex items-center gap-1 hover:text-primary border border-slate-200"
                        >
                          <Download className="w-3.5 h-3.5" /> Receipt
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4">No donation logs found.</p>
                  )}
                </div>
              </div>

              {/* Instant Receipt Pop up */}
              {receiptTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-primary/20 shadow-2xl relative bg-white dark:bg-slate-900 text-left text-xs animate-in zoom-in-95 duration-200">
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-1">Tax Donation Receipt</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Official 80G Certificate</p>
                    
                    <div className="border-t border-b border-dashed border-slate-200/60 my-4 py-4 space-y-2 text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      <p>• Receipt Number: <code>{receiptTarget.receipt_number}</code></p>
                      <p>• Donor Candidate: {receiptTarget.donor_name}</p>
                      <p>• Contribution Value: ${receiptTarget.amount.toLocaleString()} USD</p>
                      <p>• Funded Campaign: {receiptTarget.campaign}</p>
                      <p>• Transaction Status: SUCCESS</p>
                      <p>• Date logged: {new Date(receiptTarget.donated_at).toLocaleDateString()}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal mb-5 italic">
                      This document certifies tax exemption eligibility for institutional development contributions.
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setReceiptTarget(null)}
                        className="flex-1 btn-secondary"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="flex-1 btn-primary"
                      >
                        Print PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DIGITAL ALUMNI CARD TAB */}
        {activeSubTab === 'digital-card' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-2">
              <CreditCard className="w-6 h-6 text-primary" /> Digital Alumni Card
            </h2>
            <p className="text-sm text-slate-500 mb-6 text-center">
              Your verified alumni identity card. Present this for alumni events, network access, and benefit verification.
            </p>
            <DigitalAlumniCard user={currentUser} profileDetails={profile} cardType="alumni" />
          </div>
        )}

      </div>

      {/* Meeting scheduler modal */}
      {scheduleMeetingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-primary/20 shadow-2xl relative bg-white dark:bg-slate-900 text-left animate-in zoom-in-95 duration-200">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-2">Schedule Meeting</h3>
            <p className="text-xs text-slate-400 mb-4">
              Schedule a virtual videoconference session with student <strong>{scheduleMeetingTarget.mentee_name}</strong>.
            </p>

            <form onSubmit={handleScheduleMeeting} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    required
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meeting Agenda / Topic</label>
                <input
                  type="text"
                  required
                  value={meetingTopic}
                  onChange={e => setMeetingTopic(e.target.value)}
                  placeholder="Review Product Mockups & Career Options"
                  className="glass-input"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleMeetingTarget(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary justify-center"
                >
                  Confirm Calendar Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
