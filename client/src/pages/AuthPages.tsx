import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, Briefcase, GraduationCap, Award, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthPagesProps {
  setCurrentUser: (user: any) => void;
  setCurrentTab: (tab: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ setCurrentUser, setCurrentTab }) => {
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'register'>('select');
  const [selectedRole, setSelectedRole] = useState<'student' | 'alumni' | 'admin'>('student');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  
  // Register State
  const [regRole, setRegRole] = useState<'student' | 'alumni'>('alumni');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [mobile, setMobile] = useState('');
  
  // Profile specific fields
  const [gradYear, setGradYear] = useState('');
  const [degree, setDegree] = useState('');
  const [dept, setDept] = useState('');
  const [rollNum, setRollNum] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [industry, setIndustry] = useState('');

  // Additional profile uploader and details states
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [interests, setInterests] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  
  const [successRegister, setSuccessRegister] = useState(false);

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setOtpRequired(false);
    setOtpValue('');
    setSuccessRegister(false);
    setPhotoUrl(null);
    setResumeUrl('');
    setResumeName('');
    setInterests('');
    setLinkedin('');
    setSkills('');
    setAchievements('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed');
        return;
      }
      if (data.otpRequired) {
        setOtpRequired(true);
      }
    } catch (e) {
      setErrorMsg('Cannot connect to authentication server. Please check if Express is running.');
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'OTP verification failed');
        return;
      }
      setCurrentUser(data.user);
      setCurrentTab(`${data.user.role}-dashboard`);
    } catch (e) {
      setErrorMsg('OTP connection failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const profileData = regRole === 'alumni' ? {
      grad_year: parseInt(gradYear),
      degree,
      department: dept,
      roll_number: rollNum,
      company,
      designation,
      industry,
      photo_url: photoUrl,
      linkedin,
      skills,
      achievements
    } : {
      grad_year: parseInt(gradYear),
      degree,
      department: dept,
      roll_number: rollNum,
      photo_url: photoUrl,
      resume_url: resumeUrl,
      resume_name: resumeName,
      interests
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: regRole,
          email: regEmail,
          password: regPassword,
          full_name: fullName,
          mobile,
          profileData
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed');
        return;
      }
      setSuccessRegister(true);
    } catch (e) {
      setErrorMsg('Failed to reach registration server.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 relative shadow-2xl">
        
        {/* Glow Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

        {/* 1. SELECTION SCREEN */}
        {authMode === 'select' && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-primary-light dark:bg-primary/10 rounded-2xl text-primary animate-float">
                <ShieldCheck className="w-10 h-10" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Sign In to Portal</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Select your portal role below to get started</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedRole('student');
                  setAuthMode('login');
                }}
                className="w-full btn-secondary text-left justify-start hover:border-primary/30 border border-slate-200/40 py-3.5 hover:scale-[1.01]"
              >
                <GraduationCap className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Student Portal</p>
                  <p className="text-[10px] text-slate-400">Search mentors, internships & templates</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedRole('alumni');
                  setAuthMode('login');
                }}
                className="w-full btn-secondary text-left justify-start hover:border-primary/30 border border-slate-200/40 py-3.5 hover:scale-[1.01]"
              >
                <Award className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Alumni Association Portal</p>
                  <p className="text-[10px] text-slate-400">Connect, job postings, mentorship & donations</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedRole('admin');
                  setAuthMode('login');
                }}
                className="w-full btn-secondary text-left justify-start hover:border-primary/30 border border-slate-200/40 py-3.5 hover:scale-[1.01]"
              >
                <KeyRound className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Administration Console</p>
                  <p className="text-[10px] text-slate-400">Approve users, publish events & change colors</p>
                </div>
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 my-4 pt-4 text-center">
              <p className="text-xs text-slate-500">
                New graduate or student?{' '}
                <button
                  onClick={() => {
                    setAuthMode('register');
                    resetForms();
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  Register Account
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 2. LOGIN FORM SCREEN */}
        {authMode === 'login' && !otpRequired && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white capitalize">
                {selectedRole} Portal Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Enter credentials to receive simulated OTP code
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 rounded-xl p-3.5 text-xs text-left">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full glass-input pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input pl-10 text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 mt-2 text-sm font-bold">
                Send OTP Verification
              </button>
            </form>

            {/* Test Helpers snippet */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/40 rounded-xl text-left text-[11px] text-slate-500 leading-normal">
              <strong>Testing accounts available in Database:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Admin: <code>admin@apex.edu</code> / password: <code>admin123</code></li>
                <li>Alumni: <code>john.doe@gmail.com</code> / password: <code>alumni123</code></li>
                <li>Student: <code>student.bob@apex.edu</code> / password: <code>student123</code></li>
              </ul>
            </div>

            <div className="flex justify-between text-xs pt-2">
              <button onClick={() => { setAuthMode('select'); resetForms(); }} className="text-slate-500 hover:text-slate-700 font-semibold">
                ← Back to Roles
              </button>
              <button onClick={() => { setAuthMode('register'); resetForms(); }} className="text-primary font-bold hover:underline">
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* 3. OTP VERIFICATION CODE MODAL (INTEGRATED VIEW) */}
        {authMode === 'login' && otpRequired && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/20 rounded-2xl text-amber-600 animate-pulse">
                <KeyRound className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">OTP Verification</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                A simulated verification code has been dispatched to <strong>{email}</strong>.
              </p>
              <div className="bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs py-2 px-3 border border-amber-500/20 rounded-xl mt-3 inline-block">
                Simulated Code: <span className="underline">123456</span>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="0 0 0 0 0 0"
                  className="w-full glass-input text-center tracking-[1em] text-xl font-extrabold"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3 mt-2 text-sm font-bold">
                Verify & Access Account
              </button>
            </form>

            <button
              onClick={() => {
                setOtpRequired(false);
                setOtpValue('');
              }}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
            >
              ← Cancel Verification
            </button>
          </div>
        )}

        {/* 4. REGISTRATION SHEET */}
        {authMode === 'register' && !successRegister && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Portal Registration</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Submit details for college database matching and admin verification
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-xs text-left">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('alumni')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      regRole === 'alumni'
                        ? 'border-primary bg-primary-light/50 text-primary'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Alumnus / Graduate
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      regRole === 'student'
                        ? 'border-primary bg-primary-light/50 text-primary'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Current Student
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="john.doe@gmail.com"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2"></div>

              {/* Education details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={rollNum}
                    onChange={e => setRollNum(e.target.value)}
                    placeholder="CS12B001"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={gradYear}
                    onChange={e => setGradYear(e.target.value)}
                    placeholder="2012"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Degree</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="B.Tech"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    required
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    placeholder="Computer Science"
                    className="glass-input py-2 px-3 text-xs"
                  />
                </div>
              </div>

              {/* Professional fields (Only for Alumni) */}
              {regRole === 'alumni' && (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Google"
                        className="glass-input py-2 px-3 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={e => setDesignation(e.target.value)}
                        placeholder="Software Engineer"
                        className="glass-input py-2 px-3 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry</label>
                      <input
                        type="text"
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        placeholder="Technology"
                        className="glass-input py-2 px-3 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Additional profile fields for Alumni */}
              {regRole === 'alumni' && (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="glass-input py-1.5 px-3 text-[10px] file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
                      <input
                        type="text"
                        value={linkedin}
                        onChange={e => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/..."
                        className="glass-input py-2 px-3 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                      placeholder="React, SQL, Project Management"
                      className="glass-input py-2 px-3 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professional Achievements</label>
                    <textarea
                      value={achievements}
                      onChange={e => setAchievements(e.target.value)}
                      placeholder="List key awards, honors, or certificates..."
                      className="glass-input py-2 px-3 text-xs h-16 resize-none"
                    />
                  </div>
                </>
              )}

              {/* Additional profile fields for Student */}
              {regRole === 'student' && (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="glass-input py-1.5 px-3 text-[10px] file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Resume / CV File</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setResumeUrl(reader.result as string);
                              setResumeName(file.name);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="glass-input py-1.5 px-3 text-[10px] file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary cursor-pointer"
                      />
                      {resumeName && <p className="text-[9px] text-emerald-600 font-bold mt-1">Selected: {resumeName}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career Interests (Comma-separated)</label>
                    <input
                      type="text"
                      value={interests}
                      onChange={e => setInterests(e.target.value)}
                      placeholder="UI UX Design, Software Development, Data Analytics"
                      className="glass-input py-2 px-3 text-xs"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="w-full btn-primary py-3.5 mt-4 text-xs font-bold">
                Submit Registration Request
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setAuthMode('select');
                  resetForms();
                }}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                ← Back to Roles
              </button>
            </div>
          </div>
        )}

        {/* 5. REGISTRATION SUCCESS PAGE */}
        {authMode === 'register' && successRegister && (
          <div className="space-y-6 text-center py-4">
            <div className="flex justify-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Registration Submitted!</h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Your credentials have been logged in the college records. Under normal security protocol, an administrator must verify your graduation parameters.
              </p>
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl text-left text-xs text-slate-600 dark:text-slate-400 mt-5 space-y-1">
                <p><strong>Verification details:</strong></p>
                <p>• Candidate: {fullName}</p>
                <p>• Role Requested: {regRole.toUpperCase()}</p>
                <p>• ID Reference: {rollNum} ({dept})</p>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-500 font-bold mt-4">
                Tip: You can login as Admin and approve this request inside the Verification Center!
              </p>
            </div>

            <button
              onClick={() => {
                setAuthMode('select');
                resetForms();
              }}
              className="w-full btn-secondary text-sm font-bold mt-6"
            >
              Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
