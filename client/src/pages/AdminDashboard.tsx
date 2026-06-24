import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar, adminItems } from '../components/Sidebar';
import { RichTextEditor } from '../components/RichTextEditor';
import { useTheme } from '../components/ThemeManager';
import { Donation, Job } from '../types';
import { 
  ClipboardCheck, PlusSquare, Heart, Settings, BarChart3, 
  Check, X, Sparkles, RefreshCw, Landmark, Calendar, Image,
  Newspaper, FileText, SlidersHorizontal, Trash2, Edit3, Plus, Save, Eye, Trophy,
  Users, User, AlertTriangle, CheckCircle2, Info, ShieldCheck, BookOpen, FileDown,
  Briefcase, PlusCircle, LayoutDashboard
} from 'lucide-react';


import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const AdminCommitteeMemberPhoto: React.FC<{ src: string | null; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <User className="w-5 h-5 text-slate-400" />;
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

interface AdminDashboardProps {
  currentUser: any;
  setCurrentTab: (tab: string) => void;
}

// ─── Admission Manager Panel Component ───────────────────────────────────────
interface AdmissionManagerPanelProps {
  admForm: { title: string; content: string; file_label: string; file_url: string | null; file_name: string | null; sort_order: number };
  setAdmForm: React.Dispatch<React.SetStateAction<any>>;
  admissionEditId: number | null;
  setAdmissionEditId: React.Dispatch<React.SetStateAction<number | null>>;
  admissionSaved: boolean;
  allAdmissions: any[];
  onSave: (e: React.FormEvent) => void;
  onEdit: (adm: any) => void;
  onDelete: (id: number) => void;
}

const AdmissionManagerPanel: React.FC<AdmissionManagerPanelProps> = ({
  admForm, setAdmForm, admissionEditId, setAdmissionEditId,
  admissionSaved, allAdmissions, onSave, onEdit, onDelete
}) => {
  const [editorKey, setEditorKey] = useState(0);

  const resetForm = () => {
    setAdmissionEditId(null);
    setAdmForm({ title: '', content: '', file_label: '', file_url: null, file_name: null, sort_order: 0 });
    setEditorKey(k => k + 1);
  };

  const handleEditClick = (adm: any) => {
    onEdit(adm);
    setEditorKey(k => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* ── Form Card ── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-primary" />
          {admissionEditId ? 'Edit Admission Entry' : 'Add Admission Entry'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Compose the admission notice using the rich text editor below.
        </p>

        {admissionSaved && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs mb-5 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" /> Admission entry saved successfully!
          </div>
        )}

        <form onSubmit={onSave} className="space-y-5">
          {/* 1. Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Title / Course Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Certificate / Foundation Course in Yoga Education (FCYE)"
              value={admForm.title}
              onChange={e => setAdmForm((p: any) => ({ ...p, title: e.target.value }))}
              className="glass-input text-sm font-semibold w-full"
            />
          </div>

          {/* 2. WYSIWYG Content Editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Description / Admission Details
            </label>
            <RichTextEditor
              value={admForm.content}
              onChange={html => setAdmForm((p: any) => ({ ...p, content: html }))}
              placeholder="Write eligibility criteria, batch schedules, fees, timing and other admission details here..."
              editKey={editorKey}
            />
            <p className="text-[10px] text-slate-400 mt-1">Use the toolbar to format text. Supports headings, bold, italic, bullet &amp; numbered lists.</p>
          </div>



          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" className="btn-primary text-xs py-2.5 px-6 font-bold gap-2">
              <Save className="w-4 h-4" />
              {admissionEditId ? 'Update Entry' : 'Publish Entry'}
            </button>
            {admissionEditId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Existing Entries ── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
        <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" /> Published Admission Entries ({allAdmissions.length})
        </h3>

        {allAdmissions.length === 0 ? (
          <p className="text-slate-450 text-center py-8 text-xs font-medium text-slate-400">No admission entries yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {allAdmissions.map((adm, idx) => (
              <div key={adm.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/30 hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xs font-extrabold text-primary">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{adm.course_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {adm.file_name && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        📎 {adm.file_name}
                      </span>
                    )}
                    {adm.intro_text && (
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-xs"
                        dangerouslySetInnerHTML={{ __html: adm.intro_text.replace(/<[^>]*>/g, ' ').substring(0, 80) + '...' }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(adm)}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(adm.id)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Admission Documents Manager Panel ───────────────────────────────────────
interface AdmFilesManagerPanelProps {
  allAdmFiles: any[];
  onSaveFile: (e: React.FormEvent) => void;
  onDeleteFile: (id: number) => void;
  onEditFile: (f: any) => void;
  fileForm: { id: number | null; title: string; file_url: string | null; file_name: string | null; sort_order: number };
  setFileForm: React.Dispatch<React.SetStateAction<any>>;
  fileSaved: boolean;
}

const AdmFilesManagerPanel: React.FC<AdmFilesManagerPanelProps> = ({
  allAdmFiles, onSaveFile, onDeleteFile, onEditFile, fileForm, setFileForm, fileSaved
}) => {
  const pdfRef = useRef<HTMLInputElement>(null);

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileForm((p: any) => ({ ...p, file_url: reader.result as string, file_name: file.name }));
    reader.readAsDataURL(file);
  };

  const resetForm = () => setFileForm({ id: null, title: '', file_url: null, file_name: null, sort_order: 0 });

  return (
    <div className="space-y-6">
      {/* ── Add / Edit File Card ── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-1">
          <FileDown className="w-5 h-5 text-primary" />
          {fileForm.id ? 'Edit Document' : 'Add Admission Document'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">Upload PDF notices, prospectuses, or application forms. Each document appears as an independent download button on the public Admission page.</p>

        {fileSaved && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs mb-5 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" /> Document saved successfully!
          </div>
        )}

        <form onSubmit={onSaveFile} className="space-y-4">
          {/* Label */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Custom Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Download Prospectus / Download Application Form"
              value={fileForm.title}
              onChange={e => setFileForm((p: any) => ({ ...p, title: e.target.value }))}
              className="glass-input text-sm font-semibold w-full"
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">PDF File</label>
            <div className="flex gap-3 items-center">
              <div
                className="flex-1 relative cursor-pointer group"
                onClick={() => pdfRef.current?.click()}
                title="Click to upload PDF"
              >
                <input
                  type="text"
                  readOnly
                  placeholder="Click here to attach a PDF file"
                  value={fileForm.file_name || ''}
                  className="glass-input text-xs w-full cursor-pointer group-hover:border-primary/50 transition-colors pr-28"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg pointer-events-none">
                  📎 Upload PDF
                </span>
              </div>
              {fileForm.file_name && (
                <button type="button" onClick={() => setFileForm((p: any) => ({ ...p, file_url: null, file_name: null }))}
                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer shrink-0" title="Remove file">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input ref={pdfRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleLocalUpload} />
            {fileForm.file_name && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Attached: {fileForm.file_name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" className="btn-primary text-xs py-2.5 px-6 font-bold gap-2">
              <Save className="w-4 h-4" />
              {fileForm.id ? 'Update Document' : 'Add to List'}
            </button>
            {fileForm.id && (
              <button type="button" onClick={resetForm}
                className="text-xs px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold cursor-pointer">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Documents List ── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
        <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <FileDown className="w-5 h-5 text-primary" /> Uploaded Documents ({allAdmFiles.length})
        </h3>
        {allAdmFiles.length === 0 ? (
          <p className="text-slate-400 text-center py-8 text-xs font-medium">No documents yet. Add one above — they will appear as download buttons on the public Admission page.</p>
        ) : (
          <div className="space-y-3">
            {allAdmFiles.map((f, idx) => (
              <div key={f.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/30 hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xs font-extrabold text-primary">{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{f.title}</p>
                  {f.file_name && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      📎 {f.file_name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditFile(f)}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteFile(f.id)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, setCurrentTab }) => {

  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const { settings, updateSettings } = useTheme();

  // Database lists
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: '', onConfirm: () => {} });

  // Branding Form State
  const [univName, setUnivName] = useState(settings.univ_name);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url);
  const [themePreset, setThemePreset] = useState(settings.theme_preset);
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color);
  const [secondaryColor, setSecondaryColor] = useState(settings.secondary_color);
  const [brandingSaved, setBrandingSaved] = useState(false);

  // Sync branding form state with settings context once loaded
  useEffect(() => {
    if (settings) {
      setUnivName(settings.univ_name || '');
      setLogoUrl(settings.logo_url || '');
      setThemePreset(settings.theme_preset || 'crimson');
      setPrimaryColor(settings.primary_color || '#f8b600');
      setSecondaryColor(settings.secondary_color || '#04091e');
    }
  }, [settings]);

  // Event Creation State
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtType, setEvtType] = useState<'Reunion' | 'Seminar' | 'Webinar' | 'Networking'>('Reunion');
  const [evtLoc, setEvtLoc] = useState('');
  const [evtCap, setEvtCap] = useState('');
  const [evtImg, setEvtImg] = useState('');
  const [eventCreated, setEventCreated] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  // News State variables
  const [allNews, setAllNews] = useState<any[]>([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDesc, setNewsDesc] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsImg, setNewsImg] = useState('');
  const [newsCreated, setNewsCreated] = useState(false);

  // About Pages State variables
  const [allAboutPages, setAllAboutPages] = useState<any[]>([]);
  const [selectedAboutPageId, setSelectedAboutPageId] = useState('about_us');
  const [aboutPageTitle, setAboutPageTitle] = useState('');
  const [aboutPageContent, setAboutPageContent] = useState('');
  const [aboutPageFileUrl, setAboutPageFileUrl] = useState<string | null>(null);
  const [aboutPageFileName, setAboutPageFileName] = useState<string | null>(null);
  const [aboutPageSaved, setAboutPageSaved] = useState(false);

  // Results / Draws State
  const [allResults, setAllResults] = useState<any[]>([]);
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resDate, setResDate] = useState('');
  const [resSport, setResSport] = useState('General');
  const [resCategory, setResCategory] = useState('Result');
  const [resFileUrl, setResFileUrl] = useState<string | null>(null);
  const [resFileName, setResFileName] = useState<string | null>(null);
  const [resCreated, setResCreated] = useState(false);

  // Circulars State
  const [allCirculars, setAllCirculars] = useState<any[]>([]);
  const [circularTitle, setCircularTitle] = useState('');
  const [circularDesc, setCircularDesc] = useState('');
  const [circularDate, setCircularDate] = useState('');
  const [circularFileUrl, setCircularFileUrl] = useState<string | null>(null);
  const [circularFileName, setCircularFileName] = useState<string | null>(null);
  const [circularCreated, setCircularCreated] = useState(false);

  // NCTE Disclosures State
  const [allNcte, setAllNcte] = useState<any[]>([]);
  const [ncteTitle, setNcteTitle] = useState('');
  const [ncteDesc, setNcteDesc] = useState('');
  const [ncteDate, setNcteDate] = useState('');
  const [ncteFileUrl, setNcteFileUrl] = useState<string | null>(null);
  const [ncteFileName, setNcteFileName] = useState<string | null>(null);
  const [ncteCreated, setNcteCreated] = useState(false);

  // Committee Members State
  const [allCommittee, setAllCommittee] = useState<any[]>([]);
  const [committeeEditId, setCommitteeEditId] = useState<number | null>(null);
  const [cmForm, setCmForm] = useState<{
    name: string;
    designation: string;
    photo_url: string;
    college_name: string;
    college_address: string;
    contact_details: string;
    sort_order: number;
    profile_pdf_url: string | null;
    profile_pdf_name: string | null;
  }>({
    name: '', designation: '', photo_url: '',
    college_name: '', college_address: '', contact_details: '', sort_order: 0,
    profile_pdf_url: null, profile_pdf_name: null
  });
  const [cmSaved, setCmSaved] = useState(false);

  // Directors of Physical Education State
  const [allDirectors, setAllDirectors] = useState<any[]>([]);
  const [directorEditId, setDirectorEditId] = useState<number | null>(null);
  const [dirForm, setDirForm] = useState<{
    name: string;
    photo_url: string;
    mobile_number: string;
    email: string;
    college_name: string;
    college_address: string;
    sort_order: number;
    profile_pdf_url: string | null;
    profile_pdf_name: string | null;
  }>({
    name: '', photo_url: '', mobile_number: '', email: '',
    college_name: '', college_address: '', sort_order: 0,
    profile_pdf_url: null, profile_pdf_name: null
  });
  const [dirSaved, setDirSaved] = useState(false);

  // HODs / Directors Desk State
  const [allHods, setAllHods] = useState<any[]>([]);
  const [hodEditId, setHodEditId] = useState<number | null>(null);
  const [hodForm, setHodForm] = useState<{
    name: string;
    designation: string;
    photo_url: string;
    college_name: string;
    college_address: string;
    mobile_number: string;
    email: string;
    message: string;
    sort_order: number;
    profile_pdf_url: string | null;
    profile_pdf_name: string | null;
  }>({
    name: '', designation: '', photo_url: '', college_name: '', college_address: '',
    mobile_number: '', email: '', message: '', sort_order: 0,
    profile_pdf_url: null, profile_pdf_name: null
  });
  const [hodSaved, setHodSaved] = useState(false);

  // Hero Slider State
  const [allSlides, setAllSlides] = useState<any[]>([]);
  const [slideEditId, setSlideEditId] = useState<number | null>(null);
  const [slForm, setSlForm] = useState({
    title: '', subtitle: '', description: '',
    btn_text: 'Learn More', btn_link: '',
    image_url: '', overlay_opacity: 0.55, sort_order: 0, active: 1
  });
  const [slSaved, setSlSaved] = useState(false);
  const [slImagePreview, setSlImagePreview] = useState('');

  // Courses State
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [courseName, setCourseName] = useState('');
  const [courseCategory, setCourseCategory] = useState('Post Graduate Courses');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseIntake, setCourseIntake] = useState('');
  const [courseSortOrder, setCourseSortOrder] = useState('0');
  const [courseEditId, setCourseEditId] = useState<number | null>(null);
  const [coursesSaved, setCoursesSaved] = useState(false);

  // Admissions State
  const [allAdmissions, setAllAdmissions] = useState<any[]>([]);
  const [admissionEditId, setAdmissionEditId] = useState<number | null>(null);
  const [admissionSaved, setAdmissionSaved] = useState(false);
  const [admForm, setAdmForm] = useState({
    title: '',
    content: '',
    file_label: '',
    file_url: '' as string | null,
    file_name: '' as string | null,
    sort_order: 0
  });

  // Admission Files (Documents) State
  const [allAdmFiles, setAllAdmFiles] = useState<any[]>([]);
  const [fileForm, setFileForm] = useState<{ id: number | null; title: string; file_url: string | null; file_name: string | null; sort_order: number }>(
    { id: null, title: '', file_url: null, file_name: null, sort_order: 0 }
  );
  const [admFileSaved, setAdmFileSaved] = useState(false);

  // Jobs State
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Internship'>('Full-time');
  const [jobDept, setJobDept] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobPostedMsg, setJobPostedMsg] = useState(false);
  const [allApplications, setAllApplications] = useState<any[]>([]);

  // Spotlights State
  const [allSpotlights, setAllSpotlights] = useState<any[]>([]);
  const [spotEditId, setSpotEditId] = useState<number | null>(null);
  const [spotSaved, setSpotSaved] = useState(false);
  const [spotForm, setSpotForm] = useState({
    name: '',
    role: '',
    grad: '',
    photo: '',
    text: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Pending accounts
      const pRes = await fetch('http://localhost:5001/api/admin/pending-users');
      const pData = await pRes.json();
      if (pRes.ok) setPendingUsers(pData);

      // Donations list
      const dRes = await fetch('http://localhost:5001/api/donations');
      const dData = await dRes.json();
      if (dRes.ok) setAllDonations(dData);

      // News list
      const nRes = await fetch('http://localhost:5001/api/news');
      const nData = await nRes.json();
      if (nRes.ok) setAllNews(nData);

      // Custom pages list
      const cpRes = await fetch('http://localhost:5001/api/custom-pages');
      const cpData = await cpRes.json();
      if (cpRes.ok) setAllAboutPages(cpData);

      // Events list
      const eRes = await fetch('http://localhost:5001/api/events');
      const eData = await eRes.ok ? await eRes.json() : [];
      if (eRes.ok) setAllEvents(eData);

      // Hero slider list
      const slRes = await fetch('http://localhost:5001/api/slider');
      const slData = slRes.ok ? await slRes.json() : [];
      setAllSlides(slData);

      // Results / Draws list
      const rRes = await fetch('http://localhost:5001/api/results');
      const rData = rRes.ok ? await rRes.json() : [];
      setAllResults(rData);

      // Circulars list
      const circRes = await fetch('http://localhost:5001/api/circulars');
      const circData = circRes.ok ? await circRes.json() : [];
      setAllCirculars(circData);

      // NCTE disclosures list
      const ncteRes = await fetch('http://localhost:5001/api/ncte-disclosures');
      const ncteData = ncteRes.ok ? await ncteRes.json() : [];
      setAllNcte(ncteData);

      // Committee members
      const cmRes = await fetch('http://localhost:5001/api/committee');
      const cmData = cmRes.ok ? await cmRes.json() : [];
      setAllCommittee(cmData);

      // Directors
      const dirRes = await fetch('http://localhost:5001/api/directors');
      const dirData = dirRes.ok ? await dirRes.json() : [];
      setAllDirectors(dirData);

      // HODs / Directors Desk
      const hodsRes = await fetch('http://localhost:5001/api/hods');
      const hodsData = hodsRes.ok ? await hodsRes.json() : [];
      setAllHods(hodsData);

      // Courses list
      const cRes = await fetch('http://localhost:5001/api/courses');
      const cData = cRes.ok ? await cRes.json() : [];
      setAllCourses(cData);

      // Admissions list
      const admRes = await fetch('http://localhost:5001/api/admissions');
      const admData = admRes.ok ? await admRes.json() : [];
      setAllAdmissions(admData);

      // Admission Files (Documents) list
      const afRes = await fetch('http://localhost:5001/api/admission-files');
      const afData = afRes.ok ? await afRes.json() : [];
      if (afRes.ok) setAllAdmFiles(afData);

      // Jobs list
      const jobsRes = await fetch('http://localhost:5001/api/jobs');
      const jobsData = jobsRes.ok ? await jobsRes.json() : [];
      if (jobsRes.ok) setAllJobs(jobsData);

      // Job applications list
      const appsRes = await fetch('http://localhost:5001/api/jobs/applications');
      const appsData = appsRes.ok ? await appsRes.json() : [];
      setAllApplications(appsData);

      // Spotlights list
      const spotsRes = await fetch('http://localhost:5001/api/spotlights');
      const spotsData = spotsRes.ok ? await spotsRes.json() : [];
      setAllSpotlights(spotsData);

    } catch (e) {
      console.warn("Backend API not reachable for Admin Dashboard");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch page detail on selected ID change
  useEffect(() => {
    if (selectedAboutPageId) {
      fetch(`http://localhost:5001/api/custom-pages/${selectedAboutPageId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setAboutPageTitle(data.title || '');
            setAboutPageContent(data.content || '');
            setAboutPageFileUrl(data.file_url || null);
            setAboutPageFileName(data.file_name || null);
          }
        })
        .catch(err => console.warn('Could not load specific custom page details:', err));
    }
  }, [selectedAboutPageId]);

  // Update Settings Branding
  const handleBrandingSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandingSaved(false);
    const success = await updateSettings({
      univ_name: univName,
      logo_url: logoUrl,
      theme_preset: themePreset,
      primary_color: primaryColor,
      secondary_color: secondaryColor
    });
    if (success) {
      setBrandingSaved(true);
      setTimeout(() => setBrandingSaved(false), 3000);
    } else {
      alert("Failed to save settings on server.");
    }
  };

  // ─── Committee Members Handlers ───────────────────────────────────────────
  const handleCommitteeSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmSaved(false);
    const url = committeeEditId
      ? `http://localhost:5001/api/committee/${committeeEditId}`
      : 'http://localhost:5001/api/committee';
    const method = committeeEditId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmForm)
      });
      if (res.ok) {
        setCmSaved(true);
        setCommitteeEditId(null);
        setCmForm({ name: '', designation: '', photo_url: '', college_name: '', college_address: '', contact_details: '', sort_order: 0, profile_pdf_url: null, profile_pdf_name: null });
        fetchData();
        setTimeout(() => setCmSaved(false), 3000);
      }
    } catch (e) { alert('Failed to save committee member.'); }
  };

  const handleCommitteeDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this committee member?',
      onConfirm: async () => {
        try {
          await fetch(`http://localhost:5001/api/committee/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (e) {
          alert('Failed to delete committee member.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleCommitteeEdit = (member: any) => {
    setCommitteeEditId(member.id);
    setCmForm({
      name: member.name || '',
      designation: member.designation || '',
      photo_url: member.photo_url || '',
      college_name: member.college_name || '',
      college_address: member.college_address || '',
      contact_details: member.contact_details || '',
      sort_order: member.sort_order || 0,
      profile_pdf_url: member.profile_pdf_url || null,
      profile_pdf_name: member.profile_pdf_name || null
    });
  };

  // ─── Directors Handlers ────────────────────────────────────────────────────
  const handleDirectorSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirSaved(false);
    const url = directorEditId
      ? `http://localhost:5001/api/directors/${directorEditId}`
      : 'http://localhost:5001/api/directors';
    const method = directorEditId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dirForm)
      });
      if (res.ok) {
        setDirSaved(true);
        setDirectorEditId(null);
        setDirForm({ name: '', photo_url: '', mobile_number: '', email: '', college_name: '', college_address: '', sort_order: 0, profile_pdf_url: null, profile_pdf_name: null });
        fetchData();
        setTimeout(() => setDirSaved(false), 3000);
      }
    } catch (e) { alert('Failed to save director.'); }
  };

  const handleDirectorDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this physical education director?',
      onConfirm: async () => {
        try {
          await fetch(`http://localhost:5001/api/directors/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (e) {
          alert('Failed to delete director.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDirectorEdit = (dir: any) => {
    setDirectorEditId(dir.id);
    setDirForm({
      name: dir.name || '',
      photo_url: dir.photo_url || '',
      mobile_number: dir.mobile_number || '',
      email: dir.email || '',
      college_name: dir.college_name || '',
      college_address: dir.college_address || '',
      sort_order: dir.sort_order || 0,
      profile_pdf_url: dir.profile_pdf_url || null,
      profile_pdf_name: dir.profile_pdf_name || null
    });
  };

  // HODs Handlers
  const handleHodSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setHodSaved(false);
    const url = hodEditId ? "http://localhost:5001/api/hods/" + hodEditId : "http://localhost:5001/api/hods";
    const method = hodEditId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(hodForm) });
      if (res.ok) {
        setHodSaved(true);
        setHodEditId(null);
        setHodForm({ name: "", designation: "", photo_url: "", college_name: "", college_address: "", mobile_number: "", email: "", message: "", sort_order: 0, profile_pdf_url: null, profile_pdf_name: null });
        fetch("http://localhost:5001/api/hods").then(r => r.ok ? r.json() : []).then(data => setAllHods(data));
        setTimeout(() => setHodSaved(false), 3000);
      }
    } catch (e) { alert("Failed to save HOD entry."); }
  };

  const handleHodDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, message: "Are you sure you want to delete this HOD entry?", onConfirm: async () => {
      try {
        await fetch("http://localhost:5001/api/hods/" + id, { method: "DELETE" });
        fetch("http://localhost:5001/api/hods").then(r => r.ok ? r.json() : []).then(data => setAllHods(data));
      } catch (e) { alert("Failed to delete HOD entry."); }
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    }});
  };

  const handleHodEdit = (h: any) => {
    setHodEditId(h.id);
    setHodForm({ name: h.name || "", designation: h.designation || "", photo_url: h.photo_url || "", college_name: h.college_name || "", college_address: h.college_address || "", mobile_number: h.mobile_number || "", email: h.email || "", message: h.message || "", sort_order: h.sort_order || 0, profile_pdf_url: h.profile_pdf_url || null, profile_pdf_name: h.profile_pdf_name || null });
  };

  // Verify User
  const handleVerifyUser = async (userId: number, status: 'approved' | 'rejected') => {

    try {
      const res = await fetch('http://localhost:5001/api/admin/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      if (res.ok) {
        alert(`Account successfully ${status}!`);
        // Refresh approvals list
        fetchData();
      }
    } catch(e) {
      alert("Connection failed.");
    }
  };

  // Create Event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventCreated(false);
    try {
      const res = await fetch('http://localhost:5001/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: evtTitle,
          description: evtDesc,
          date: evtDate,
          time: evtTime,
          type: evtType,
          location: evtLoc,
          capacity: parseInt(evtCap) || 100,
          image_url: evtImg
        })
      });
      if (res.ok) {
        setEventCreated(true);
        setEvtTitle('');
        setEvtDesc('');
        setEvtDate('');
        setEvtTime('');
        setEvtLoc('');
        setEvtCap('');
        setEvtImg('');
        // Refresh events list
        const refreshedRes = await fetch('http://localhost:5001/api/events');
        const refreshedData = await refreshedRes.json();
        if (refreshedRes.ok) setAllEvents(refreshedData);
        setTimeout(() => setEventCreated(false), 3500);
      }
    } catch(e) {
      alert("Failed to submit event details.");
    }
  };

  const handleDeleteEvent = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this event?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/events/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            alert("Event deleted successfully.");
            // Refresh events list
            const refreshedRes = await fetch('http://localhost:5001/api/events');
            const refreshedData = await refreshedRes.json();
            if (refreshedRes.ok) setAllEvents(refreshedData);
          }
        } catch (e) {
          alert("Failed to delete event.");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsCreated(false);
    try {
      const res = await fetch('http://localhost:5001/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsTitle,
          description: newsDesc,
          date: newsDate,
          image_url: newsImg
        })
      });
      if (res.ok) {
        setNewsCreated(true);
        setNewsTitle('');
        setNewsDesc('');
        setNewsDate('');
        setNewsImg('');
        // Refresh news list
        const refreshedRes = await fetch('http://localhost:5001/api/news');
        const refreshedData = await refreshedRes.json();
        if (refreshedRes.ok) setAllNews(refreshedData);
        setTimeout(() => setNewsCreated(false), 3500);
      }
    } catch (e) {
      alert("Failed to submit news announcement.");
    }
  };

  const handleDeleteNews = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this notice?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/news/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            alert("Notice deleted successfully.");
            // Refresh news list
            const refreshedRes = await fetch('http://localhost:5001/api/news');
            const refreshedData = await refreshedRes.json();
            if (refreshedRes.ok) setAllNews(refreshedData);
          }
        } catch (e) {
          alert("Failed to delete notice.");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAboutPageFileUrl(reader.result as string);
      setAboutPageFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAboutPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutPageSaved(false);
    try {
      const res = await fetch(`http://localhost:5001/api/custom-pages/${selectedAboutPageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aboutPageTitle,
          content: aboutPageContent,
          file_url: aboutPageFileUrl,
          file_name: aboutPageFileName
        })
      });
      if (res.ok) {
        setAboutPageSaved(true);
        // Refresh pages list
        const cpRes = await fetch('http://localhost:5001/api/custom-pages');
        const cpData = await cpRes.json();
        if (cpRes.ok) setAllAboutPages(cpData);
        setTimeout(() => setAboutPageSaved(false), 3000);
      } else {
        alert("Failed to update page data.");
      }
    } catch (e) {
      alert("Connection failed.");
    }
  };

  // ── Slider Handlers ──────────────────────────────────────────────────────
  const resetSliderForm = () => {
    setSlForm({ title: '', subtitle: '', description: '', btn_text: 'Learn More', btn_link: '', image_url: '', overlay_opacity: 0.55, sort_order: 0, active: 1 });
    setSlideEditId(null);
    setSlImagePreview('');
  };

  const handleSliderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSlForm(f => ({ ...f, image_url: result }));
      setSlImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSliderSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlSaved(false);
    try {
      const isEdit = slideEditId !== null;
      const url = isEdit ? `http://localhost:5001/api/slider/${slideEditId}` : 'http://localhost:5001/api/slider';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slForm)
      });
      if (res.ok) {
        setSlSaved(true);
        resetSliderForm();
        const refreshed = await fetch('http://localhost:5001/api/slider');
        const refreshedData = refreshed.ok ? await refreshed.json() : [];
        setAllSlides(refreshedData);
        setTimeout(() => setSlSaved(false), 3000);
      } else {
        alert('Failed to save slide.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleSliderDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this slide?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/slider/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshed = await fetch('http://localhost:5001/api/slider');
            const refreshedData = refreshed.ok ? await refreshed.json() : [];
            setAllSlides(refreshedData);
          }
        } catch {
          alert('Failed to delete slide.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSliderEdit = (slide: any) => {
    setSlideEditId(slide.id);
    setSlForm({
      title: slide.title, subtitle: slide.subtitle || '',
      description: slide.description || '', btn_text: slide.btn_text || 'Learn More',
      btn_link: slide.btn_link || '', image_url: slide.image_url || '',
      overlay_opacity: slide.overlay_opacity ?? 0.55,
      sort_order: slide.sort_order ?? 0, active: slide.active ?? 1
    });
    setSlImagePreview(slide.image_url || '');
  };

  // ── Results / Draws Handlers ──────────────────────────────────────────────
  const handleResultFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setResFileUrl(reader.result as string);
      setResFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const refreshResults = async () => {
    const rRes = await fetch('http://localhost:5001/api/results');
    const rData = rRes.ok ? await rRes.json() : [];
    setAllResults(rData);
  };

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setResCreated(false);
    try {
      const res = await fetch('http://localhost:5001/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resTitle, description: resDesc, date: resDate,
          sport: resSport, category: resCategory,
          file_url: resFileUrl, file_name: resFileName
        })
      });
      if (res.ok) {
        setResCreated(true);
        setResTitle(''); setResDesc(''); setResDate('');
        setResSport('General'); setResCategory('Result');
        setResFileUrl(null); setResFileName(null);
        await refreshResults();
        setTimeout(() => setResCreated(false), 3500);
      } else {
        alert('Failed to publish result.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleDeleteResult = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this result entry?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/results/${id}`, { method: 'DELETE' });
          if (res.ok) await refreshResults();
        } catch {
          alert('Failed to delete result.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // ── Courses Handlers ──────────────────────────────────────────────────────
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoursesSaved(false);
    const url = courseEditId ? `http://localhost:5001/api/courses/${courseEditId}` : 'http://localhost:5001/api/courses';
    const method = courseEditId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: courseName,
          category: courseCategory,
          duration: courseDuration,
          intake: parseInt(courseIntake) || 0,
          sort_order: parseInt(courseSortOrder) || 0
        })
      });
      if (res.ok) {
        setCoursesSaved(true);
        setCourseName('');
        setCourseDuration('');
        setCourseIntake('');
        setCourseSortOrder('0');
        setCourseEditId(null);
        // Refresh list
        const refreshRes = await fetch('http://localhost:5001/api/courses');
        if (refreshRes.ok) setAllCourses(await refreshRes.json());
        setTimeout(() => setCoursesSaved(false), 3000);
      } else {
        alert('Failed to save course details.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleEditCourse = (course: any) => {
    setCourseEditId(course.id);
    setCourseName(course.name);
    setCourseCategory(course.category);
    setCourseDuration(course.duration);
    setCourseIntake(String(course.intake));
    setCourseSortOrder(String(course.sort_order || 0));
  };

  const handleDeleteCourse = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this course?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/courses/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshRes = await fetch('http://localhost:5001/api/courses');
            if (refreshRes.ok) setAllCourses(await refreshRes.json());
          }
        } catch {
          alert('Failed to delete course.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // ── Admissions Handlers ─────────────────────────────────────────────────────
  const handleSaveAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdmissionSaved(false);
    const url = admissionEditId
      ? `http://localhost:5001/api/admissions/${admissionEditId}`
      : 'http://localhost:5001/api/admissions';
    const method = admissionEditId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_name: admForm.title,
          intro_text: admForm.content,
          course_subtitle: admForm.file_label,
          file_url: admForm.file_url,
          file_name: admForm.file_name,
          sort_order: admForm.sort_order
        })
      });
      if (res.ok) {
        setAdmissionSaved(true);
        setAdmissionEditId(null);
        setAdmForm({ title: '', content: '', file_label: '', file_url: null, file_name: null, sort_order: 0 });
        const refreshRes = await fetch('http://localhost:5001/api/admissions');
        if (refreshRes.ok) setAllAdmissions(await refreshRes.json());
        setTimeout(() => setAdmissionSaved(false), 3000);
      } else {
        alert('Failed to save admission entry.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleEditAdmission = (adm: any) => {
    setAdmissionEditId(adm.id);
    setAdmForm({
      title: adm.course_name || '',
      content: adm.intro_text || '',
      file_label: adm.course_subtitle || '',
      file_url: adm.file_url || null,
      file_name: adm.file_name || null,
      sort_order: adm.sort_order || 0
    });
  };

  const handleAdmissionPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAdmForm(prev => ({ ...prev, file_url: reader.result as string, file_name: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAdmission = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this admission entry?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/admissions/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshRes = await fetch('http://localhost:5001/api/admissions');
            if (refreshRes.ok) setAllAdmissions(await refreshRes.json());
          }
        } catch {
          alert('Failed to delete admission entry.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // ── Admission Files (Documents) Handlers ──────────────────────────────────
  const handleSaveAdmFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdmFileSaved(false);
    const url = fileForm.id
      ? `http://localhost:5001/api/admission-files/${fileForm.id}`
      : 'http://localhost:5001/api/admission-files';
    const method = fileForm.id ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fileForm.title,
          file_url: fileForm.file_url,
          file_name: fileForm.file_name,
          sort_order: fileForm.sort_order
        })
      });
      if (res.ok) {
        setAdmFileSaved(true);
        setFileForm({ id: null, title: '', file_url: null, file_name: null, sort_order: 0 });
        const refreshRes = await fetch('http://localhost:5001/api/admission-files');
        if (refreshRes.ok) setAllAdmFiles(await refreshRes.json());
        setTimeout(() => setAdmFileSaved(false), 3000);
      } else {
        alert('Failed to save document.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleEditAdmFile = (f: any) => {
    setFileForm({ id: f.id, title: f.title, file_url: f.file_url, file_name: f.file_name, sort_order: f.sort_order || 0 });
  };

  const handleDeleteAdmFile = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this document?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/admission-files/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshRes = await fetch('http://localhost:5001/api/admission-files');
            if (refreshRes.ok) setAllAdmFiles(await refreshRes.json());
          }
        } catch {
          alert('Failed to delete document.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Job Posting & Deleting
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobPostedMsg(false);
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
        const jData = jRes.ok ? await jRes.json() : [];
        setAllJobs(jData);

        setTimeout(() => setJobPostedMsg(false), 3000);
      }
    } catch(e) {
      alert("Job posting server request failed.");
    }
  };

  const handleJobDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this job posting?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/jobs/${id}`, { method: 'DELETE' });
          if (res.ok) {
            // Refresh Job List
            const jRes = await fetch('http://localhost:5001/api/jobs');
            const jData = jRes.ok ? await jRes.json() : [];
            setAllJobs(jData);
          }
        } catch {
          alert('Failed to delete job posting.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // ── Spotlight Handlers ───────────────────────────────────────────────────
  const handleSpotlightSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpotSaved(false);
    const url = spotEditId ? `http://localhost:5001/api/spotlights/${spotEditId}` : 'http://localhost:5001/api/spotlights';
    const method = spotEditId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotForm)
      });
      if (res.ok) {
        setSpotSaved(true);
        setSpotEditId(null);
        setSpotForm({ name: '', role: '', grad: '', photo: '', text: '' });
        
        // Refresh Spotlights
        const rRes = await fetch('http://localhost:5001/api/spotlights');
        const rData = rRes.ok ? await rRes.json() : [];
        setAllSpotlights(rData);

        setTimeout(() => setSpotSaved(false), 3000);
      } else {
        alert("Failed to save spotlight entry.");
      }
    } catch(err) {
      alert("Failed to save spotlight entry.");
    }
  };

  const handleSpotlightDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this Alumni Spotlight entry?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/spotlights/${id}`, { method: 'DELETE' });
          if (res.ok) {
            // Refresh Spotlights
            const rRes = await fetch('http://localhost:5001/api/spotlights');
            const rData = rRes.ok ? await rRes.json() : [];
            setAllSpotlights(rData);
          }
        } catch {
          alert('Failed to delete spotlight.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSpotlightEdit = (spot: any) => {
    setSpotEditId(spot.id);
    setSpotForm({
      name: spot.name || '',
      role: spot.role || '',
      grad: spot.grad || '',
      photo: spot.photo || '',
      text: spot.text || ''
    });
  };

  // ── Job Application Moderation Handlers ──────────────────────────────────
  const handleUpdateApplicationStatus = async (appId: number, status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected') => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Refresh applications list
        const appsRes = await fetch('http://localhost:5001/api/jobs/applications');
        const appsData = appsRes.ok ? await appsRes.json() : [];
        setAllApplications(appsData);
      } else {
        alert("Failed to update application status.");
      }
    } catch(err) {
      alert("Failed to update application status.");
    }
  };

  // ── Circulars Handlers ───────────────────────────────────────────────────

  const handleCircularFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCircularFileUrl(reader.result as string);
      setCircularFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    setCircularCreated(false);
    try {
      const res = await fetch('http://localhost:5001/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: circularTitle,
          description: circularDesc,
          date: circularDate,
          file_url: circularFileUrl,
          file_name: circularFileName
        })
      });
      if (res.ok) {
        setCircularCreated(true);
        setCircularTitle(''); setCircularDesc(''); setCircularDate('');
        setCircularFileUrl(null); setCircularFileName(null);
        // Refresh circulars list
        const circRes = await fetch('http://localhost:5001/api/circulars');
        const circData = circRes.ok ? await circRes.json() : [];
        setAllCirculars(circData);
        setTimeout(() => setCircularCreated(false), 3500);
      } else {
        alert('Failed to publish circular.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleDeleteCircular = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this circular?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/circulars/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const circRes = await fetch('http://localhost:5001/api/circulars');
            const circData = circRes.ok ? await circRes.json() : [];
            setAllCirculars(circData);
          }
        } catch {
          alert('Failed to delete circular.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // ── NCTE Disclosures Handlers ─────────────────────────────────────────────
  const handleNcteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNcteFileUrl(reader.result as string);
      setNcteFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateNcte = async (e: React.FormEvent) => {
    e.preventDefault();
    setNcteCreated(false);
    try {
      const res = await fetch('http://localhost:5001/api/ncte-disclosures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ncteTitle,
          description: ncteDesc,
          date: ncteDate,
          file_url: ncteFileUrl,
          file_name: ncteFileName
        })
      });
      if (res.ok) {
        setNcteCreated(true);
        setNcteTitle(''); setNcteDesc(''); setNcteDate('');
        setNcteFileUrl(null); setNcteFileName(null);
        // Refresh list
        const ncteRes = await fetch('http://localhost:5001/api/ncte-disclosures');
        const ncteData = ncteRes.ok ? await ncteRes.json() : [];
        setAllNcte(ncteData);
        setTimeout(() => setNcteCreated(false), 3500);
      } else {
        alert('Failed to publish NCTE disclosure.');
      }
    } catch {
      alert('Connection failed.');
    }
  };

  const handleDeleteNcte = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this NCTE disclosure?',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/ncte-disclosures/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const ncteRes = await fetch('http://localhost:5001/api/ncte-disclosures');
            const ncteData = ncteRes.ok ? await ncteRes.json() : [];
            setAllNcte(ncteData);
          }
        } catch {
          alert('Failed to delete disclosure.');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const totalDonated = allDonations.reduce((sum, d) => sum + d.amount, 0);
  const campaignSums: Record<string, number> = {};
  allDonations.forEach(d => {
    campaignSums[d.campaign] = (campaignSums[d.campaign] || 0) + d.amount;
  });
  const campaignChartData = Object.keys(campaignSums).map(name => ({
    name: name.length > 25 ? name.slice(0, 22) + '...' : name,
    amount: campaignSums[name]
  }));
  const geoData = [
    { name: 'USA', value: 480 },
    { name: 'Europe', value: 240 },
    { name: 'Asia', value: 390 },
    { name: 'Other', value: 120 }
  ];
  const growthData = [
    { year: '2022', Alumni: 1200 },
    { year: '2023', Alumni: 2300 },
    { year: '2024', Alumni: 3800 },
    { year: '2025', Alumni: 4700 },
    { year: '2026', Alumni: 5200 }
  ];
  const COLORS = ['#1d4ed8', '#047857', '#d97706', '#64748b'];

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-16">
      <Sidebar role="admin" activeTab={activeSubTab} setActiveTab={setActiveSubTab} />
      <div className="flex-1 text-left space-y-6">

        {/* ── DASHBOARD HUB TAB ── */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5">
                    <LayoutDashboard className="w-8 h-8 text-primary animate-pulse" />
                    Admin Control Hub
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Welcome back, <span className="font-bold text-slate-700 dark:text-slate-350">{currentUser.full_name || 'Administrator'}</span>. Manage university directories, events, admissions, content, and system configuration.
                  </p>
                </div>
                <div className="bg-primary/10 text-primary border border-primary/20 rounded-2xl px-4 py-2.5 text-xs font-bold text-center shrink-0">
                  ⚡ System Administrator Role
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {adminItems.filter(item => item.id !== 'dashboard').map(item => {
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

        {/* ── APPROVALS TAB ── */}
        {activeSubTab === 'approvals' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6"><ClipboardCheck className="w-6 h-6 text-primary" /> Verification Center</h2><p className="text-sm text-slate-500 mb-6">Validate graduation credentials and student enrollment records before unlocking portal features.</p>{loading ? <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div> : pendingUsers.length > 0 ? <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-850"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-4">Name / Role</th><th className="p-4">Roll Num / Grad</th><th className="p-4">Email / Mobile</th><th className="p-4">Dept / Course</th><th className="p-4 text-center">Action Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{pendingUsers.map((e) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20"><td className="p-4 font-semibold"><p className="text-slate-800 dark:text-white font-bold">{e.full_name}</p><span className="text-[10px] bg-primary-light text-primary font-bold px-1.5 py-0.2 rounded uppercase">{e.role}</span></td><td className="p-4 font-mono">{e.roll_number || "N/A"} <br />({e.grad_year})</td><td className="p-4"><p>{e.email}</p><p className="text-slate-400 mt-0.5">{e.mobile}</p></td><td className="p-4 font-semibold">{e.department} <br /><span className="text-[10px] text-slate-400">{e.degree}</span></td><td className="p-4 flex items-center justify-center gap-2"><button onClick={() => handleVerifyUser(e.id, "approved")} className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all" title="Approve Profile"><Check className="w-4 h-4" /></button><button onClick={() => handleVerifyUser(e.id, "rejected")} className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-all" title="Reject Profile"><X className="w-4 h-4" /></button></td></tr>)}</tbody></table></div> : <p className="text-slate-400 text-center py-10">No pending profile authorizations currently in queue.</p>}</div>
        )}

        {/* ── EVENTS-MANAGER TAB ── */}
        {activeSubTab === 'events-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6"><PlusSquare className="w-6 h-6 text-primary" /> Create Event</h2>{eventCreated && <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">Event successfully added and published to target feeds!</div>}<form onSubmit={handleCreateEvent} className="space-y-4 text-xs"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Title</label><input type="text" required={!0} value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} placeholder="e.g. Annual Alumni Meet 2026" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Category</label><select value={evtType} onChange={(e) => setEvtType(e.target.value as any)} className="glass-input text-slate-500 font-semibold"><option value="Reunion">Reunion Gala</option><option value="Seminar">Seminar (Campus)</option><option value="Webinar">Webinar (Virtual)</option><option value="Networking">Networking Mixer</option></select></div></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label><RichTextEditor value={evtDesc} onChange={setEvtDesc} placeholder="Detail activities, speaker schedule, and guidelines..." /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</label><input type="date" required={!0} value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</label><input type="time" required={!0} value={evtTime} onChange={(e) => setEvtTime(e.target.value)} className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendee Capacity</label><input type="number" required={!0} value={evtCap} onChange={(e) => setEvtCap(e.target.value)} placeholder="250" className="glass-input" /></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location / Zoom Link</label><input type="text" required={!0} value={evtLoc} onChange={(e) => setEvtLoc(e.target.value)} placeholder="e.g. Auditorium / virtual link" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Image URL</label><input type="text" value={evtImg} onChange={(e) => setEvtImg(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="glass-input" /></div></div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md">Publish Event</button></form><div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6"><h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Active Events</h3>{allEvents.length > 0 ? <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-4">Date & Time</th><th className="p-4">Title</th><th className="p-4">Type & Location</th><th className="p-4 text-center">Capacity</th><th className="p-4 text-center">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{allEvents.map((e) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20"><td className="p-4 font-semibold whitespace-nowrap">{e.date} {e.time ? `at ${e.time}` : ""}</td><td className="p-4 font-bold text-slate-800 dark:text-white">{e.title}</td><td className="p-4"><span className="font-semibold">{e.type}</span> <br /><span className="text-slate-450 dark:text-slate-400">{e.location}</span></td><td className="p-4 text-center">{e.capacity}</td><td className="p-4 text-center"><button onClick={() => handleDeleteEvent(e.id)} className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold transition-all cursor-pointer">Delete</button></td></tr>)}</tbody></table></div> : <p className="text-slate-400 text-center py-6">No events currently scheduled.</p>}</div></div>
        )}

        {/* ── NEWS-MANAGER TAB ── */}
        {activeSubTab === 'news-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2"><Newspaper className="w-6 h-6 text-primary" /> Manage News & Notices</h2><p className="text-sm text-slate-500">Publish news announcements and notice boards which appear in the dynamic column on the Homepage.</p>{newsCreated && <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">Announcement published successfully to Homepage Notices feed!</div>}<form onSubmit={handleCreateNews} className="space-y-4 text-xs"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notice Title</label><input type="text" required={!0} value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="e.g. PCZSC Annual Athletics Meet Schedule" className="glass-input font-semibold" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publish Date</label><input type="date" required={!0} value={newsDate} onChange={(e) => setNewsDate(e.target.value)} className="glass-input" /></div></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notice Description</label><RichTextEditor value={newsDesc} onChange={setNewsDesc} placeholder="Provide detailed description of the sports tournament, circular guidelines..." /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image Banner URL (Optional)</label><input type="text" value={newsImg} onChange={(e) => setNewsImg(e.target.value)} placeholder="https://images.unsplash.com/..." className="glass-input" /></div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">Publish Announcement</button></form><div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6"><h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Active Notices & Announcements</h3>{allNews.length > 0 ? <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-4">Publish Date</th><th className="p-4">Title</th><th className="p-4">Description Preview</th><th className="p-4 text-center">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{allNews.map((e) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20"><td className="p-4 font-semibold whitespace-nowrap">{e.date}</td><td className="p-4 font-bold text-slate-800 dark:text-white">{e.title}</td><td className="p-4 truncate max-w-xs">{e.description}</td><td className="p-4 text-center"><button onClick={() => handleDeleteNews(e.id)} className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold transition-all cursor-pointer">Delete</button></td></tr>)}</tbody></table></div> : <p className="text-slate-400 text-center py-6">No announcements currently published.</p>}</div></div>
        )}

        {/* ── COMMITTEE-MANAGER TAB ── */}
        {activeSubTab === 'committee-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6"><div><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> PCZSC Committee Manager</h2><p className="text-sm text-slate-500 mt-1">Add, edit, or remove committee members. Changes appear live on the public <strong>PCZSC Committee</strong> page.</p></div>{cmSaved && <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2"><Check className="w-4 h-4" /> Committee member saved successfully!</div>}<form onSubmit={handleCommitteeSave} className="space-y-4 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-950/20"><div className="flex items-center justify-between mb-1"><h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">{committeeEditId ? "✏️ Edit Member" : "➕ Add New Member"}</h3>{committeeEditId && <button type="button" onClick={() => {setCommitteeEditId(null),setCmForm({name:``,designation:``,photo_url:``,college_name:``,college_address:``,contact_details:``,sort_order:0,profile_pdf_url:null,profile_pdf_name:null})}} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors">Cancel Edit</button>}</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"><div className="space-y-3"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label><input type="text" required={!0} value={cmForm.name} onChange={(e) => setCmForm((t) => ({ ...t, name: e.target.value }))} placeholder="e.g. Dr. Rajendra Patil" className="glass-input font-semibold" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation *</label><input type="text" required={!0} value={cmForm.designation} onChange={(e) => setCmForm((t) => ({ ...t, designation: e.target.value }))} placeholder="e.g. Chairman, PCZSC / Secretary" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College / Institution Name</label><input type="text" value={cmForm.college_name} onChange={(e) => setCmForm((t) => ({ ...t, college_name: e.target.value }))} placeholder="e.g. Fergusson College, Pune" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College Address</label><input type="text" value={cmForm.college_address} onChange={(e) => setCmForm((t) => ({ ...t, college_address: e.target.value }))} placeholder="e.g. FC Road, Shivajinagar, Pune - 411004" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Details</label><input type="text" value={cmForm.contact_details} onChange={(e) => setCmForm((t) => ({ ...t, contact_details: e.target.value }))} placeholder="e.g. +91 98765 43210 | email@example.com" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label><input type="number" min={0} value={cmForm.sort_order} onChange={(e) => setCmForm((t) => ({ ...t, sort_order: parseInt(e.target.value) || 0 }))} className="glass-input w-24" /><span className="text-[9px] text-slate-400">Lower number = appears first</span></div></div><div className="flex flex-col gap-3"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo URL</label><input type="text" value={cmForm.photo_url} onChange={(e) => setCmForm((t) => ({ ...t, photo_url: e.target.value }))} placeholder="https://... or leave blank to upload below" className="glass-input" /></div><div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Upload Photo</span><input type="file" accept="image/*" onChange={(e) => {let t=e.target.files?.[0];if(t){let e=new FileReader;e.onload=()=>setCmForm(t=>({...t,photo_url:e.result as string})),e.readAsDataURL(t)}}} className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer" /><div className="w-24 h-24 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">{cmForm.photo_url ? <img src={cmForm.photo_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => {e.currentTarget.style.display=`none`}} /> : <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />}</div><span className="text-[9px] text-slate-400 text-center">Photo will be converted to Base64 and stored.</span></div><div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Upload Profile PDF</span><input type="file" accept="application/pdf" onChange={(e) => {let t=e.target.files?.[0];if(t){let e=new FileReader;e.onload=()=>setCmForm(n=>({...n,profile_pdf_url:e.result as string,profile_pdf_name:t.name})),e.readAsDataURL(t)}}} className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer" />{cmForm.profile_pdf_name && <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /> {cmForm.profile_pdf_name}<button type="button" onClick={() => setCmForm((e) => ({ ...e, profile_pdf_url: null, profile_pdf_name: null }))} className="text-rose-500 hover:text-rose-750 ml-1 font-bold cursor-pointer">Clear</button></div>}<span className="text-[9px] text-slate-400 text-center">PDF will be converted to Base64 and stored.</span></div></div></div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md"><Save className="w-4 h-4 mr-2 inline-block" />{committeeEditId ? "Save Changes" : "Add Member"}</button></form><div><h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Current Members ({allCommittee.length})</h3>{allCommittee.length === 0 ? <p className="text-slate-400 text-center py-8 text-sm">No committee members added yet.</p> : <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-3">#</th><th className="p-3">Photo</th><th className="p-3">Name / Role</th><th className="p-3">College</th><th className="p-3">Contact</th><th className="p-3">Profile</th><th className="p-3 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{allCommittee.map((e, t) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"><td className="p-3 text-slate-400 font-bold">{t + 1}</td><td className="p-3"><div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><AdminCommitteeMemberPhoto src={e.photo_url} alt={e.name} /></div></td><td className="p-3"><p className="font-bold text-slate-800 dark:text-white">{e.name}</p><p className="text-[10px] text-primary font-semibold mt-0.5">{e.designation}</p></td><td className="p-3"><p className="font-semibold">{e.college_name || "—"}</p><p className="text-[10px] text-slate-400 mt-0.5">{e.college_address || ""}</p></td><td className="p-3 text-slate-500 max-w-[180px]"><span className="break-words">{e.contact_details || "—"}</span></td><td className="p-3">{e.profile_pdf_url ? <a href={e.profile_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all w-fit"><FileText className="w-3.5 h-3.5" /> PDF</a> : <span className="text-[9px] text-slate-400 italic">None</span>}</td><td className="p-3"><div className="flex items-center justify-center gap-2"><button onClick={() => handleCommitteeEdit(e)} className="p-2 rounded-xl bg-primary-light dark:bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all" title="Edit Member"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleCommitteeDelete(e.id)} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all" title="Delete Member"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>)}</tbody></table></div>}</div></div>
        )}

        {/* ── DIRECTORS-MANAGER TAB ── */}
        {activeSubTab === 'directors-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" /> Director of Phy. Ed. & Sports Manager
              </h2>
              <p className="text-sm text-slate-500 mt-1">Add, edit, or remove physical education directors. Changes appear live on the public <strong>Director of Phy. Edu.</strong> page.</p>
            </div>
            {dirSaved && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Director saved successfully!
              </div>
            )}
            <form onSubmit={handleDirectorSave} className="space-y-4 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-950/20">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  {directorEditId ? "✏️ Edit Director" : "➕ Add New Director"}
                </h3>
                {directorEditId && (
                  <button
                    type="button"
                    onClick={() => {
                      setDirectorEditId(null);
                      setDirForm({ name: "", photo_url: "", mobile_number: "", email: "", college_name: "", college_address: "", sort_order: 0, profile_pdf_url: null, profile_pdf_name: null });
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={dirForm.name}
                      onChange={(e) => setDirForm((t) => ({ ...t, name: e.target.value }))}
                      placeholder="e.g. Dr. Chikte Anagha Sunil"
                      className="glass-input font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                    <input
                      type="text"
                      value={dirForm.mobile_number}
                      onChange={(e) => setDirForm((t) => ({ ...t, mobile_number: e.target.value }))}
                      placeholder="e.g. 9850710713"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email ID</label>
                    <input
                      type="email"
                      value={dirForm.email}
                      onChange={(e) => setDirForm((t) => ({ ...t, email: e.target.value }))}
                      placeholder="e.g. director@college.edu"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College / Institution Name</label>
                    <input
                      type="text"
                      value={dirForm.college_name}
                      onChange={(e) => setDirForm((t) => ({ ...t, college_name: e.target.value }))}
                      placeholder="e.g. Shri Sidhvinayak Mahila Mahavidyalaya"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College Address</label>
                    <input
                      type="text"
                      value={dirForm.college_address}
                      onChange={(e) => setDirForm((t) => ({ ...t, college_address: e.target.value }))}
                      placeholder="e.g. Karvenagar, Pune"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                    <input
                      type="number"
                      min={0}
                      value={dirForm.sort_order}
                      onChange={(e) => setDirForm((t) => ({ ...t, sort_order: parseInt(e.target.value) || 0 }))}
                      className="glass-input w-24"
                    />
                    <span className="text-[9px] text-slate-400">Lower number = appears first</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo URL</label>
                    <input
                      type="text"
                      value={dirForm.photo_url}
                      onChange={(e) => setDirForm((t) => ({ ...t, photo_url: e.target.value }))}
                      placeholder="https://... or leave blank to upload below"
                      className="glass-input"
                    />
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setDirForm((t) => ({ ...t, photo_url: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer"
                    />
                    <div className="w-24 h-24 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                      {dirForm.photo_url ? (
                        <img src={dirForm.photo_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <User className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                      )}
                    </div>
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Profile PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setDirForm((n) => ({ ...n, profile_pdf_url: reader.result as string, profile_pdf_name: file.name }));
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer"
                    />
                    {dirForm.profile_pdf_name && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> {dirForm.profile_pdf_name}
                        <button
                          type="button"
                          onClick={() => setDirForm((e) => ({ ...e, profile_pdf_url: null, profile_pdf_name: null }))}
                          className="text-rose-500 hover:text-rose-750 ml-1 font-bold cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 text-center">PDF will be converted to Base64 and stored.</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-slate-900 font-bold text-xs shadow-md shadow-primary/10 transition-all cursor-pointer">
                <Save className="w-4 h-4 text-slate-900" />{directorEditId ? "Save Changes" : "Add Director"}
              </button>
            </form>
            <div>
              <h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Current Directors ({allDirectors.length})</h3>
              {allDirectors.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">No directors added yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Photo</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">College</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Profile</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {allDirectors.map((e, t) => (
                        <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="p-3 text-slate-400 font-bold">{t + 1}</td>
                          <td className="p-3">
                            <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <AdminCommitteeMemberPhoto src={e.photo_url} alt={e.name} />
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800 dark:text-white">{e.name}</p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] font-extrabold uppercase rounded border border-slate-200/50 dark:border-slate-700/50">
                              Order: {e.sort_order}
                            </span>
                          </td>
                          <td className="p-3">
                            <p className="font-semibold">{e.college_name || "—"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{e.college_address || ""}</p>
                          </td>
                          <td className="p-3 text-slate-500 max-w-[180px]">
                            <p className="font-semibold">{e.mobile_number || "—"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{e.email || ""}</p>
                          </td>
                          <td className="p-3 text-slate-500">
                            {e.profile_pdf_url ? (
                              <a href={e.profile_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all w-fit">
                                <FileText className="w-3.5 h-3.5" /> PDF
                              </a>
                            ) : (
                              <span className="text-[9px] text-slate-400 italic">None</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleDirectorEdit(e)} className="p-2 rounded-xl bg-primary-light dark:bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all" title="Edit Director">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDirectorDelete(e.id)} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all" title="Delete Director">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HODs/Directors Desk Manager Tab */}
        {activeSubTab === 'hods-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" /> HODs / Directors Desk Manager
              </h2>
              <p className="text-sm text-slate-500 mt-1">Add, edit, or remove HOD and Director entries. Changes appear live on the public <strong>From HODs/Directors Desk</strong> page.</p>
            </div>
            {hodSaved && <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2"><Check className="w-4 h-4" /> HOD entry saved successfully!</div>}
            <form onSubmit={handleHodSave} className="space-y-4 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-950/20">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">{hodEditId ? "Edit HOD Entry" : "Add New HOD Entry"}</h3>
                {hodEditId && <button type="button" onClick={() => { setHodEditId(null); setHodForm({ name: "", designation: "", photo_url: "", college_name: "", college_address: "", mobile_number: "", email: "", message: "", sort_order: 0, profile_pdf_url: null, profile_pdf_name: null }); }} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors">Cancel Edit</button>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                    <input type="text" required value={hodForm.name} onChange={e => setHodForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Anagha Chikte" className="glass-input font-semibold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation / Role</label>
                    <input type="text" value={hodForm.designation} onChange={e => setHodForm(f => ({ ...f, designation: e.target.value }))} placeholder="e.g. Head of Department, Director" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                    <input type="text" value={hodForm.mobile_number} onChange={e => setHodForm(f => ({ ...f, mobile_number: e.target.value }))} placeholder="e.g. 9850710713" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email ID</label>
                    <input type="email" value={hodForm.email} onChange={e => setHodForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. hod@college.edu" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College / Institution</label>
                    <input type="text" value={hodForm.college_name} onChange={e => setHodForm(f => ({ ...f, college_name: e.target.value }))} placeholder="e.g. Garware College" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College Address</label>
                    <input type="text" value={hodForm.college_address} onChange={e => setHodForm(f => ({ ...f, college_address: e.target.value }))} placeholder="e.g. Karvenagar, Pune" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Message / Quote (optional)</label>
                    <RichTextEditor value={hodForm.message} onChange={html => setHodForm(f => ({ ...f, message: html }))} placeholder="A short message from the HOD/Director desk..." />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                    <input type="number" min={0} value={hodForm.sort_order} onChange={e => setHodForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="glass-input w-24" />
                    <span className="text-[9px] text-slate-400">Lower number = appears first</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo URL</label>
                    <input type="text" value={hodForm.photo_url} onChange={e => setHodForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://... or upload below" className="glass-input" />
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Photo</span>
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setHodForm(p => ({ ...p, photo_url: r.result as string })); r.readAsDataURL(f); }}} className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer" />
                    <div className="w-24 h-24 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                      {hodForm.photo_url ? <img src={hodForm.photo_url} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /> : <User className="w-8 h-8 text-slate-300 dark:text-slate-700" />}
                    </div>
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Profile PDF</span>
                    <input type="file" accept="application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setHodForm(p => ({ ...p, profile_pdf_url: r.result as string, profile_pdf_name: f.name })); r.readAsDataURL(f); }}} className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer" />
                    {hodForm.profile_pdf_name && <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /> {hodForm.profile_pdf_name}<button type="button" onClick={() => setHodForm(f => ({ ...f, profile_pdf_url: null, profile_pdf_name: null }))} className="text-rose-500 hover:text-rose-700 ml-1 font-bold cursor-pointer">Clear</button></div>}
                    <span className="text-[9px] text-slate-400 text-center">PDF converted to Base64 and stored.</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-slate-900 font-bold text-xs shadow-md shadow-primary/10 transition-all cursor-pointer">
                <Save className="w-4 h-4 text-slate-900" />{hodEditId ? "Save Changes" : "Add HOD Entry"}
              </button>
            </form>
            <div>
              <h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Current HOD Entries ({allHods.length})</h3>
              {allHods.length === 0 ? <p className="text-slate-400 text-center py-8 text-sm">No HOD entries added yet.</p> : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                      <tr><th className="p-3">#</th><th className="p-3">Photo</th><th className="p-3">Name / Role</th><th className="p-3">College</th><th className="p-3">Contact</th><th className="p-3">Profile</th><th className="p-3 text-center">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {allHods.map((h, i) => (
                        <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="p-3 text-slate-400 font-bold">{i + 1}</td>
                          <td className="p-3"><div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><AdminCommitteeMemberPhoto src={h.photo_url} alt={h.name} /></div></td>
                          <td className="p-3"><p className="font-bold text-slate-800 dark:text-white">{h.name}</p><span className="text-[9px] text-slate-400">{h.designation}</span></td>
                          <td className="p-3"><p className="font-semibold">{h.college_name || "-"}</p><p className="text-[10px] text-slate-400 mt-0.5">{h.college_address || ""}</p></td>
                          <td className="p-3 text-slate-500"><p className="font-semibold">{h.mobile_number || "-"}</p><p className="text-[10px] text-slate-400 mt-0.5">{h.email || ""}</p></td>
                          <td className="p-3">{h.profile_pdf_url ? <a href={h.profile_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all w-fit"><FileText className="w-3.5 h-3.5" /> PDF</a> : <span className="text-[9px] text-slate-400 italic">None</span>}</td>
                          <td className="p-3"><div className="flex items-center justify-center gap-2"><button onClick={() => handleHodEdit(h)} className="p-2 rounded-xl bg-primary-light dark:bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleHodDelete(h.id)} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RESULTS-MANAGER TAB ── */}
        {activeSubTab === 'results-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" /> Draws & Results Manager
              </h2>
              <p className="text-sm text-slate-500 mt-1">Publish tournament draws, fixture schedules, and final match results. These appear dynamically on the public <strong>Draws & Results</strong> page under the About section.</p>
            </div>
            {resCreated && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Result published successfully!
              </div>
            )}
            <form onSubmit={handleCreateResult} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title / Headline *</label>
                  <input
                    type="text"
                    required
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    placeholder="e.g. Inter-Collegiate Cricket Finals 2026 – Results"
                    className="glass-input font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publish Date *</label>
                  <input
                    type="date"
                    required
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sport</label>
                  <select value={resSport} onChange={(e) => setResSport(e.target.value)} className="glass-input">
                    {["Cricket", "Football", "Basketball", "Athletics", "Volleyball", "Kabaddi", "Badminton", "Table Tennis", "Chess", "General"].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category / Type</label>
                  <select value={resCategory} onChange={(e) => setResCategory(e.target.value)} className="glass-input">
                    {["Result", "Draw", "Fixtures", "Bracket", "Schedule", "Standings"].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description / Details</label>
                <RichTextEditor
                  value={resDesc}
                  onChange={setResDesc}
                  placeholder="Describe the draw format, match venues, winners, scores, player awards..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attach File (PDF / Image)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleResultFileUpload}
                  className="block text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {resFileName && (
                  <div className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">{resFileName}</span>
                    <button type="button" onClick={() => { setResFileUrl(null); setResFileName(null); }} className="ml-auto text-rose-500 hover:text-rose-700 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">Publish Result / Draw</button>
            </form>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Published Results ({allResults.length})
              </h3>
              {allResults.length > 0 ? (
                <div className="space-y-3">
                  {allResults.map((e) => (
                    <div key={e.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 group hover:border-primary/30 transition-all">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-light dark:bg-primary/10 text-primary uppercase tracking-wide">{e.sport}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wide">{e.category}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{e.date}</span>
                        </div>
                        <p className="font-bold text-xs text-slate-800 dark:text-white truncate">{e.title}</p>
                        {e.description && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{e.description}</p>}
                        {e.file_name && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <FileText className="w-3 h-3 text-primary" />
                            <a href={e.file_url} download={e.file_name} className="text-[10px] font-semibold text-primary hover:underline truncate">{e.file_name}</a>
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleDeleteResult(e.id)} className="shrink-0 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-450 hover:bg-rose-500 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8 text-xs">No results published yet. Add one above.</p>
              )}
            </div>
          </div>
        )}

        {/* ── CIRCULARS-MANAGER TAB ── */}
        {activeSubTab === 'circulars-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Manage Circulars</h2><p className="text-sm text-slate-500">Publish official circular guidelines, announcements, and PDFs which appear dynamically in the public Circulars subpage.</p>{circularCreated && <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">Circular notice published successfully to Circulars feed!</div>}<form onSubmit={handleCreateCircular} className="space-y-4 text-xs"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Circular Title</label><input type="text" required={!0} value={circularTitle} onChange={(e) => setCircularTitle(e.target.value)} placeholder="e.g. Circular 2026-3: Tournament Guidelines" className="glass-input font-semibold" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publish Date</label><input type="date" required={!0} value={circularDate} onChange={(e) => setCircularDate(e.target.value)} className="glass-input" /></div></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description Overview</label><RichTextEditor value={circularDesc} onChange={setCircularDesc} placeholder="Summarize the circular contents, rules, or instructions..." /></div><div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl flex items-center justify-between gap-4"><div className="space-y-1 text-left"><h4 className="font-bold text-xs text-slate-800 dark:text-white">Document Attachment (Optional)</h4><p className="text-[10px] text-slate-500 leading-normal">Upload PDF, Docx, or spreadsheet guidelines</p><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleCircularFileUpload} className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px] w-full" /></div>{circularFileName && <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg max-w-xs truncate shadow-sm"><FileText className="w-4 h-4 text-primary shrink-0" /><span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{circularFileName}</span><button type="button" onClick={() => {setCircularFileUrl(null),setCircularFileName(null)}} className="text-rose-500 hover:text-rose-600 font-bold text-xs shrink-0 cursor-pointer ml-1">Clear</button></div>}</div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">Publish Circular</button></form><div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6"><h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Active Circulars & Guidelines</h3>{allCirculars.length > 0 ? <div className="space-y-2">{allCirculars.map((e) => <div className="group flex items-start gap-4 p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/20 dark:hover:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl transition-all"><div className="shrink-0 w-9 h-9 rounded-xl bg-primary-light/50 dark:bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mt-0.5"><FileText className="w-5 h-5 text-primary" /></div><div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-2 mb-1"><span className="text-[10px] text-slate-400 font-semibold">{e.date}</span></div><p className="font-bold text-xs text-slate-800 dark:text-white truncate">{e.title}</p>{e.description && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{e.description}</p>}{e.file_name && <div className="flex items-center gap-1 mt-1.5"><FileText className="w-3 h-3 text-primary" /><a href={e.file_url} download={e.file_name} className="text-[10px] font-semibold text-primary hover:underline truncate">{e.file_name}</a></div>}</div><button onClick={() => handleDeleteCircular(e.id)} className="shrink-0 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100" title="Delete"><Trash2 className="w-4 h-4" /></button></div>)}</div> : <p className="text-slate-400 text-center py-8 text-xs">No circulars published yet. Add one above.</p>}</div></div>
        )}

        {/* ── NCTE-MANAGER TAB ── */}
        {activeSubTab === 'ncte-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary" /> Manage NCTE Disclosures</h2><p className="text-sm text-slate-500">Publish official NCTE disclosures, compliance reports, and regulatory PDF certificates which appear dynamically in the public NCTE Mandatory Disclosures subpage.</p>{ncteCreated && <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">NCTE disclosure published successfully to Mandatory Disclosures feed!</div>}<form onSubmit={handleCreateNcte} className="space-y-4 text-xs"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disclosure Title</label><input type="text" required={!0} value={ncteTitle} onChange={(e) => setNcteTitle(e.target.value)} placeholder="e.g. NCTE Mandatory Disclosure Report 2026" className="glass-input font-semibold" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publish Date</label><input type="date" required={!0} value={ncteDate} onChange={(e) => setNcteDate(e.target.value)} className="glass-input" /></div></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description Overview</label><RichTextEditor value={ncteDesc} onChange={setNcteDesc} placeholder="Summarize the compliance document, order number, or certification details..." /></div><div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl flex items-center justify-between gap-4"><div className="space-y-1 text-left"><h4 className="font-bold text-xs text-slate-800 dark:text-white">Document Attachment (Optional)</h4><p className="text-[10px] text-slate-500 leading-normal">Upload PDF, Docx, or compliance certificate</p><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleNcteFileUpload} className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px] w-full" /></div>{ncteFileName && <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg max-w-xs truncate shadow-sm"><ShieldCheck className="w-4 h-4 text-primary shrink-0" /><span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{ncteFileName}</span><button type="button" onClick={() => {setNcteFileUrl(null),setNcteFileName(null)}} className="text-rose-500 hover:text-rose-600 font-bold text-xs shrink-0 cursor-pointer ml-1">Clear</button></div>}</div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">Publish NCTE Disclosure</button></form><div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6"><h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Active NCTE Disclosures</h3>{allNcte.length > 0 ? <div className="space-y-2">{allNcte.map((e) => <div className="group flex items-start gap-4 p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/20 dark:hover:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl transition-all"><div className="shrink-0 w-9 h-9 rounded-xl bg-primary-light/50 dark:bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mt-0.5"><ShieldCheck className="w-5 h-5 text-primary" /></div><div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-2 mb-1"><span className="text-[10px] text-slate-400 font-semibold">{e.date}</span></div><p className="font-bold text-xs text-slate-800 dark:text-white truncate">{e.title}</p>{e.description && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{e.description}</p>}{e.file_name && <div className="flex items-center gap-1 mt-1.5"><ShieldCheck className="w-3 h-3 text-primary" /><a href={e.file_url} download={e.file_name} className="text-[10px] font-semibold text-primary hover:underline truncate">{e.file_name}</a></div>}</div><button onClick={() => handleDeleteNcte(e.id)} className="shrink-0 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100" title="Delete"><Trash2 className="w-4 h-4" /></button></div>)}</div> : <p className="text-slate-400 text-center py-8 text-xs">No disclosures published yet. Add one above.</p>}</div></div>
        )}

        {/* ── ABOUT-MANAGER TAB ── */}
        {activeSubTab === 'about-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> Manage About Subpages
            </h2>
            <p className="text-sm text-slate-500">
              Update description text and attach PDFs/official documents for all physical education and sports committee subpages.
            </p>
            {aboutPageSaved && (
              <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">
                Subpage changes saved successfully! Content updated dynamically.
              </div>
            )}
            <form onSubmit={handleSaveAboutPage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Subpage to Edit</label>
                  <select
                    value={selectedAboutPageId}
                    onChange={(e) => setSelectedAboutPageId(e.target.value)}
                    className="glass-input text-slate-500 font-semibold"
                  >
                    <option value="about_us">About Us Page</option>
                    <option value="committee">PCZSC Committee Page</option>
                    <option value="director">Director of Phy. Edu. Page</option>
                    <option value="circulars">Circulars Page</option>
                    <option value="ncte">NCTE Mandatory Disclosures Page</option>
                    <option value="courses">Courses Page</option>
                    <option value="admission">Admission Page</option>
                    <option value="syllabus">Syllabus Page</option>
                    <option value="academic_results">Academic Results Page</option>
                    <option value="souvenirs">Souvenirs Page</option>
                    <option value="calendar">Sports Calendar Page</option>
                    <option value="results">Draws & Results Page</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Header Title</label>
                  <input
                    type="text"
                    required
                    value={aboutPageTitle}
                    onChange={(e) => setAboutPageTitle(e.target.value)}
                    placeholder="Page Title"
                    className="glass-input font-bold"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Body Content (Description)</label>
                <RichTextEditor
                  value={aboutPageContent}
                  onChange={(html) => setAboutPageContent(html)}
                  placeholder="Enter detailed description, headings, lists, links, pictures, and formatted text for this subpage..."
                  editKey={selectedAboutPageId}
                />
              </div>
              <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">Page Attachment Document (Optional)</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">Upload PDF, Docx, or compliance certificate</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px] w-full"
                    />
                  </div>
                  {aboutPageFileName && (
                    <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg max-w-xs truncate shadow-sm">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{aboutPageFileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAboutPageFileUrl(null);
                          setAboutPageFileName(null);
                        }}
                        className="text-rose-500 hover:text-rose-600 font-bold text-xs shrink-0 cursor-pointer ml-1"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">
                Save Subpage Changes
              </button>
            </form>
          </div>
        )}

        {/* ── COURSES-MANAGER TAB ── */}
        {activeSubTab === 'courses-manager' && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 animate-in fade-in">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-primary" /> {courseEditId ? "Edit Course" : "Add New Course"}
              </h2>
              <p className="text-xs text-slate-500 mb-6">Manage curriculum courses by their academic categories like Post Graduate Courses, Foundation Courses, etc.</p>
              
              {coursesSaved && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Course details saved successfully!
                </div>
              )}

              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name of the Course *</label>
                    <input
                      type="text"
                      required
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="e.g. M.P.Ed. (Master of Physical Education)"
                      className="glass-input font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course Category *</label>
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="glass-input text-slate-700 dark:text-slate-200 font-semibold"
                    >
                      <option value="Post Graduate Courses">Post Graduate Courses</option>
                      <option value="Under Graduate & Professional Courses">Under Graduate & Professional Courses</option>
                      <option value="Foundation & Certificate Courses">Foundation & Certificate Courses</option>
                      <option value="Other Courses">Other Courses</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration *</label>
                    <input
                      type="text"
                      required
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="e.g. 2 Years, 3 Months"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Intake (Seats) *</label>
                    <input
                      type="number"
                      required
                      value={courseIntake}
                      onChange={(e) => setCourseIntake(e.target.value)}
                      placeholder="e.g. 40, 100"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                    <input
                      type="number"
                      value={courseSortOrder}
                      onChange={(e) => setCourseSortOrder(e.target.value)}
                      placeholder="0"
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">
                    {courseEditId ? "Update Course" : "Publish Course"}
                  </button>
                  {courseEditId && (
                    <button
                      type="button"
                      onClick={() => {
                        setCourseEditId(null);
                        setCourseName('');
                        setCourseDuration('');
                        setCourseIntake('');
                        setCourseSortOrder('0');
                      }}
                      className="btn-secondary text-xs font-bold py-3 px-6 cursor-pointer border border-slate-200 dark:border-slate-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" /> Active Program Courses ({allCourses.length})
              </h3>
              {allCourses.length > 0 ? (
                <div className="space-y-6">
                  {["Post Graduate Courses", "Under Graduate & Professional Courses", "Foundation & Certificate Courses", "Other Courses"].map((cat) => {
                    const catCourses = allCourses.filter(c => c.category === cat);
                    if (catCourses.length === 0) return null;
                    return (
                      <div key={cat} className="space-y-2 text-left">
                        <h4 className="font-extrabold text-xs text-primary uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1.5">{cat}</h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-950/10">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/30">
                                <th className="p-3 w-16 text-center">Sr. No.</th>
                                <th className="p-3">Name of the Course</th>
                                <th className="p-3 w-32">Duration</th>
                                <th className="p-3 w-28 text-center">Intake</th>
                                <th className="p-3 w-32 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                              {catCourses.map((c, idx) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                                  <td className="p-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                                  <td className="p-3 font-semibold text-slate-800 dark:text-white">{c.name}</td>
                                  <td className="p-3 font-medium">{c.duration}</td>
                                  <td className="p-3 text-center font-bold text-primary">{c.intake}</td>
                                  <td className="p-3 flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleEditCourse(c)}
                                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCourse(c.id)}
                                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-450 text-center py-8 text-xs font-medium">No courses defined in database. Add a course above.</p>
              )}
            </div>
          </div>
        )}

        {/* ── JOBS MANAGER TAB ── */}
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
                  <RichTextEditor
                    value={jobDesc}
                    onChange={setJobDesc}
                    placeholder="Provide full description of the job..."
                  />
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
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Moderate Career Opportunities</h3>
              <div className="space-y-3">
                {allJobs.length > 0 ? (
                  allJobs.map((j) => (
                    <div key={j.id} className="p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl flex justify-between items-center text-xs group">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{j.title}</h4>
                        <p className="text-slate-500 mt-1">{j.company} • {j.location} • <span className="bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded">{j.type}</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live & Active</span>
                        <button
                          onClick={() => handleJobDelete(j.id)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No jobs posted in database.</p>
                )}
              </div>
            </div>

            {/* List Job Applications */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 mt-6">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">Moderate Job Applications</h3>
              <p className="text-xs text-slate-500 mb-4">Review applicant profiles, download resumes, and manage candidate status.</p>
              
              <div className="space-y-4">
                {allApplications.length > 0 ? (
                  allApplications.map((app) => (
                    <div key={app.id} className="p-5 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-850 dark:text-white">{app.applicant_name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary-light text-primary font-bold uppercase tracking-wider">{app.applicant_role}</span>
                        </div>
                        <p className="text-slate-500 font-semibold">
                          Applying for: <span className="text-primary font-bold">{app.job_title}</span> at <span className="font-bold">{app.job_company}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-455 dark:text-slate-400 mt-1">
                          <span>Email: {app.applicant_email}</span>
                          <span>Mobile: {app.applicant_mobile || '—'}</span>
                          <span>Applied on: {app.applied_at ? app.applied_at.substring(0, 10) : ''}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 text-blue-650 hover:text-blue-750 dark:text-blue-400 transition-all shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" /> Resume / CV
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-405 font-semibold italic">No Resume Uploaded</span>
                        )}

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-1.5">Status:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as any)}
                            className="glass-input text-[11px] font-semibold text-slate-650 dark:text-slate-350"
                          >
                            <option value="applied">Applied</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No applications received yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ADMISSION MANAGER TAB ────────────────────────────────────── */}
        {activeSubTab === 'admission-manager' && (
          <div className="space-y-10">
            <AdmissionManagerPanel
              admForm={admForm}
              setAdmForm={setAdmForm}
              admissionEditId={admissionEditId}
              setAdmissionEditId={setAdmissionEditId}
              admissionSaved={admissionSaved}
              allAdmissions={allAdmissions}
              onSave={handleSaveAdmission}
              onEdit={handleEditAdmission}
              onDelete={handleDeleteAdmission}
            />


            {/* ── Divider ── */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700/50" />
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2">PDF Documents</span>
              <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700/50" />
            </div>

            <AdmFilesManagerPanel
              allAdmFiles={allAdmFiles}
              onSaveFile={handleSaveAdmFile}
              onDeleteFile={handleDeleteAdmFile}
              onEditFile={handleEditAdmFile}
              fileForm={fileForm}
              setFileForm={setFileForm}
              fileSaved={admFileSaved}
            />
          </div>
        )}



        {/* ── HERO SLIDER MANAGER TAB ────────────────────────────────────── */}
        {activeSubTab === 'slider-manager' && (

          <div className="space-y-6">
            {/* Form Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-6 h-6 text-primary" />
                {slideEditId ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {slideEditId ? `Editing slide #${slideEditId}` : 'Create a new hero slider slide. Image, heading, subtext, button & link.'}
              </p>

              {slSaved && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Slide saved successfully!
                </div>
              )}

              <form onSubmit={handleSliderSave} className="space-y-5 text-xs">
                {/* Image Upload */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slide Background Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSliderImageUpload}
                        className="block text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Or paste an image URL below:</p>
                      <input
                        type="url"
                        value={slForm.image_url.startsWith('data:') ? '' : slForm.image_url}
                        onChange={e => { setSlForm(f => ({ ...f, image_url: e.target.value })); setSlImagePreview(e.target.value); }}
                        placeholder="https://example.com/image.jpg"
                        className="glass-input"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Dark Overlay Opacity: <span className="text-primary">{Math.round(slForm.overlay_opacity * 100)}%</span>
                      </label>
                      <input
                        type="range" min="0" max="1" step="0.05"
                        value={slForm.overlay_opacity}
                        onChange={e => setSlForm(f => ({ ...f, overlay_opacity: parseFloat(e.target.value) }))}
                        className="accent-primary w-full"
                      />
                      <p className="text-[10px] text-slate-400">Higher = darker background (better text readability)</p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="w-full lg:w-64 h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 relative">
                    {slImagePreview ? (
                      <>
                        <img src={slImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black" style={{ opacity: slForm.overlay_opacity }} />
                        <div className="absolute bottom-2 left-2 right-2 z-10">
                          <p className="text-white text-[10px] font-black uppercase truncate drop-shadow">{slForm.title || 'Slide Title'}</p>
                          <p className="text-white/70 text-[9px] truncate">{slForm.subtitle || 'Subtitle'}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-slate-400 space-y-1">
                        <Image className="w-8 h-8 mx-auto opacity-30" />
                        <p className="text-[10px]">Preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Main Title *</label>
                    <input required type="text" value={slForm.title}
                      onChange={e => setSlForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Excellence in Sports" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtitle / Tag</label>
                    <input type="text" value={slForm.subtitle}
                      onChange={e => setSlForm(f => ({ ...f, subtitle: e.target.value }))}
                      placeholder="e.g. Pune City Zone Sports Committee" className="glass-input" />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea rows={2} value={slForm.description}
                      onChange={e => setSlForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Short description shown under the title..."
                      className="glass-input resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Text</label>
                    <input type="text" value={slForm.btn_text}
                      onChange={e => setSlForm(f => ({ ...f, btn_text: e.target.value }))}
                      placeholder="e.g. Learn More" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Link (Tab ID)</label>
                    <input type="text" value={slForm.btn_link}
                      onChange={e => setSlForm(f => ({ ...f, btn_link: e.target.value }))}
                      placeholder="e.g. events or about-calendar" className="glass-input" />
                    <p className="text-[10px] text-slate-400">Use tab IDs: home, events, directory, about-calendar, etc.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                    <input type="number" min="0" value={slForm.sort_order}
                      onChange={e => setSlForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                      className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select value={slForm.active} onChange={e => setSlForm(f => ({ ...f, active: parseInt(e.target.value) }))}
                      className="glass-input">
                      <option value={1}>Active (Visible)</option>
                      <option value={0}>Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary text-xs font-bold py-3 px-6 shadow-md cursor-pointer gap-2">
                    <Save className="w-4 h-4 text-slate-900" />
                    {slideEditId ? 'Update Slide' : 'Add Slide'}
                  </button>
                  {slideEditId && (
                    <button type="button" onClick={resetSliderForm}
                      className="btn-secondary text-xs font-bold py-3 px-5 cursor-pointer">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Slides List */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> Active Slides ({allSlides.length})
              </h3>

              {allSlides.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No slides found. Add one above.</p>
              ) : (
                <div className="space-y-3">
                  {allSlides.map((slide) => (
                    <div key={slide.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        slide.active ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40' : 'bg-slate-100/30 dark:bg-slate-950/20 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 relative">
                        {slide.image_url ? (
                          <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black" style={{ opacity: slide.overlay_opacity ?? 0.5 }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-xs text-slate-800 dark:text-white truncate">{slide.title}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                            slide.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-200 text-slate-500'
                          }`}>{slide.active ? 'Active' : 'Hidden'}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">#{slide.sort_order}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{slide.subtitle}</p>
                        <p className="text-[10px] text-slate-400 truncate">{slide.btn_text} → {slide.btn_link || '—'}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleSliderEdit(slide)}
                          className="p-2 rounded-xl bg-primary-light dark:bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                          title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleSliderDelete(slide.id)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SPOTLIGHT-MANAGER TAB ── */}
        {activeSubTab === 'spotlight-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" /> Alumni Spotlight & Success Stories
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Share inspiring success stories of our alumni. These stories appear in the slider on the Home page.
              </p>
            </div>

            {spotSaved && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Spotlight story saved successfully!
              </div>
            )}

            <form onSubmit={handleSpotlightSave} className="space-y-4 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-950/20">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  {spotEditId ? "✏️ Edit Spotlight" : "➕ Add New Spotlight"}
                </h3>
                {spotEditId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSpotEditId(null);
                      setSpotForm({ name: '', role: '', grad: '', photo: '', text: '' });
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alumnus Name *</label>
                    <input
                      type="text"
                      required
                      value={spotForm.name}
                      onChange={(e) => setSpotForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="glass-input font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role / Current Designation *</label>
                    <input
                      type="text"
                      required
                      value={spotForm.role}
                      onChange={(e) => setSpotForm((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Staff Software Engineer at Google"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Graduation Details *</label>
                    <input
                      type="text"
                      required
                      value={spotForm.grad}
                      onChange={(e) => setSpotForm((prev) => ({ ...prev, grad: e.target.value }))}
                      placeholder="e.g. Class of 2012 (Computer Science)"
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo URL</label>
                    <input
                      type="text"
                      value={spotForm.photo}
                      onChange={(e) => setSpotForm((prev) => ({ ...prev, photo: e.target.value }))}
                      placeholder="https://... or upload photo below"
                      className="glass-input"
                    />
                  </div>

                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setSpotForm((prev) => ({ ...prev, photo: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer"
                    />
                    <div className="w-24 h-24 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
                      {spotForm.photo ? (
                        <img src={spotForm.photo} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quote / Success Story Description *</label>
                <RichTextEditor
                  value={spotForm.text}
                  onChange={(html) => setSpotForm((prev) => ({ ...prev, text: html }))}
                  placeholder="e.g. My years at Apex University formed the bedrock of my career..."
                />
              </div>

              <button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md">
                <Save className="w-4 h-4 mr-2 inline-block" />
                {spotEditId ? "Save Changes" : "Publish Spotlight"}
              </button>
            </form>

            <div>
              <h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-350 uppercase tracking-widest mb-3">
                Current Spotlights ({allSpotlights.length})
              </h3>
              {allSpotlights.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">No spotlights published yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allSpotlights.map((s) => (
                    <div key={s.id} className="group relative flex gap-4 p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/20 dark:hover:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-3xl transition-all">
                      <div className="w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-105 dark:bg-slate-900 flex items-center justify-center shrink-0">
                        {s.photo ? (
                          <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-sm text-slate-850 dark:text-white truncate">{s.name}</p>
                        <p className="text-[10px] font-bold text-primary tracking-wide uppercase mt-0.5 truncate">{s.role}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.grad}</p>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 italic leading-relaxed font-medium">
                          {s.text}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSpotlightEdit(s)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSpotlightDelete(s.id)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DONATIONS TRACKER TAB */}
        {activeSubTab === 'donations-manager' && (
          <div className="glass-card">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary" /> Donations Tracker
            </h2>

            {/* Donation Stats card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <Landmark className="w-10 h-10 text-primary" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Funds Raised</span>
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">${totalDonated.toLocaleString()}</h3>
                </div>
              </div>
              
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 sm:col-span-2">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Recent Logs Summary</span>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Total donor checkouts recorded in SQLite db: <strong>{allDonations.length} receipts</strong>. Exemption forms registered under Section 80G.
                  </p>
                </div>
              </div>
            </div>

            {/* Recharts Bar chart for campaigns */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Giving Distribution by Campaign</h3>
              <div className="h-64 bg-slate-50/20 dark:bg-slate-900/20 rounded-2xl border border-slate-200/30 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={9} />
                    <YAxis stroke="#888888" fontSize={9} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ fontSize: 10, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
                    <Bar dataKey="amount" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List of recent donations */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">All Logged Transactions</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {allDonations.map((d) => (
                  <div key={d.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{d.donor_name} <span className="text-[10px] text-slate-400 font-normal">({d.receipt_number})</span></p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{d.campaign}</p>
                    </div>
                    <span className="font-bold text-emerald-600">${d.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BRANDING SETTINGS TAB */}
        {activeSubTab === 'branding' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-primary" /> Branding Settings
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Change the university logo, name, and color theme preset dynamically across the entire app interface.
            </p>

            {brandingSaved && (
              <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">
                Branding variables saved! Colors and headers updated dynamically in real-time.
              </div>
            )}

            <form onSubmit={handleBrandingSave} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College/University Name</label>
                    <input
                      type="text"
                      required
                      value={univName}
                      onChange={e => setUnivName(e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logo Image URL</label>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="glass-input"
                    />
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Type or paste image URL, or upload file on the right</span>
                  </div>
                </div>

                {/* Logo Uploader & Preview Panel */}
                <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col gap-2 w-full sm:w-auto text-left">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">Upload New Logo</h4>
                    <p className="text-[10px] text-slate-500 leading-normal max-w-[200px]">
                      Select an image (PNG, JPG, SVG) from your device. It will be converted to Base64.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setLogoUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px]"
                    />
                  </div>

                  {/* Logo Preview */}
                  <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 w-32 h-32 justify-center shrink-0">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Logo Preview</span>
                    {logoUrl ? (
                      <div className="relative group w-16 h-16">
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200/50 dark:border-slate-800/40"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop&q=80';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                          title="Remove logo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-350 dark:text-slate-650">
                        <Image className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Branding Color Preset</label>
                  <select
                    value={themePreset}
                    onChange={e => {
                      setThemePreset(e.target.value as any);
                      // Fallback hex assignments to show visual choices
                      const presetsMap = {
                        crimson: { prim: '#b91c1c', sec: '#0f172a' },
                        emerald: { prim: '#047857', sec: '#1e293b' },
                        sapphire: { prim: '#1d4ed8', sec: '#0b0f19' },
                        midnight: { prim: '#4c1d95', sec: '#090514' }
                      };
                      const selected = presetsMap[e.target.value as keyof typeof presetsMap];
                      if (selected) {
                        setPrimaryColor(selected.prim);
                        setSecondaryColor(selected.sec);
                      }
                    }}
                    className="glass-input text-slate-500 font-semibold"
                  >
                    <option value="crimson">Royal Crimson & Gold (Default)</option>
                    <option value="emerald">Deep Emerald & Silver</option>
                    <option value="sapphire">Ocean Sapphire & Gold</option>
                    <option value="midnight">Midnight Indigo & Bronze</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Color Hex</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="glass-input flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secondary Color Hex</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="glass-input flex-1 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary text-xs font-bold py-3.5 px-8 shadow-md">
                Save & Update branding colors
              </button>
            </form>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeSubTab === 'analytics' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" /> System Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollment & Alumni Growth area chart */}
              <div className="p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">Database Membership Growth</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="year" stroke="#888888" fontSize={9} />
                      <YAxis stroke="#888888" fontSize={9} />
                      <Tooltip contentStyle={{ fontSize: 10, background: '#ffffff', borderRadius: '8px' }} />
                      <Legend style={{ fontSize: 9 }} />
                      <Area type="monotone" dataKey="Alumni" stroke="var(--color-primary)" fill="var(--color-primary-light)" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Geographic distribution Pie chart */}
              <div className="p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl space-y-3 flex flex-col justify-between">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">Alumni Geographic Density</h4>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={geoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {geoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 10, background: '#ffffff', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-3 text-[10px] font-bold">
                  {geoData.map((g, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx] }}></span>
                      {g.name}: {g.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="glass-card max-w-md w-full rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4 items-center">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">
                    Confirm Action
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Requires Confirmation
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
              {confirmDialog.message}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-205 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
