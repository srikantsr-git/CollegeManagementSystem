import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar, adminItems } from '../components/Sidebar';
import { RichTextEditor } from '../components/RichTextEditor';
import { useTheme } from '../components/ThemeManager';
import { Donation, Job } from '../types';
import { 
  ClipboardCheck, PlusSquare, Heart, Settings, BarChart3, 
  Check, X, Sparkles, RefreshCw, Landmark, Calendar, Image,
  Newspaper, FileText, SlidersHorizontal, Trash2, Edit3, Edit2, Plus, Save, Eye, EyeOff, Trophy,
  Users, User, AlertTriangle, CheckCircle2, Info, ShieldCheck, BookOpen, FileDown,
  Briefcase, PlusCircle, LayoutDashboard, Building2, Award, Loader2, MessageSquare
} from 'lucide-react';

import { MenuNavigationManager } from '../components/MenuNavigationManager';
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

interface StaticPagesManagerProps {
  parentMenuFilter: 'about' | 'academic' | 'student' | 'none';
  title: string;
  description: string;
  allPages: any[];
  onRefresh: () => Promise<void>;
  setConfirmDialog: React.Dispatch<React.SetStateAction<any>>;
}

const StaticPagesManager: React.FC<StaticPagesManagerProps> = ({
  parentMenuFilter, title, description, allPages, onRefresh, setConfirmDialog
}) => {
  const [selectedPageId, setSelectedPageId] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageFileUrl, setPageFileUrl] = useState<string | null>(null);
  const [pageFileName, setPageFileName] = useState<string | null>(null);
  const [pageParentMenu, setPageParentMenu] = useState(parentMenuFilter === 'none' ? 'none' : parentMenuFilter);
  const [pageMenuType, setPageMenuType] = useState(parentMenuFilter === 'none' ? 'standalone' : 'child');
  const [pageIsVisible, setPageIsVisible] = useState(1);
  const [pageSaved, setPageSaved] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Slider state for the edit form
  const [pageShowSlider, setPageShowSlider] = useState(false);
  const [pageSliderSlides, setPageSliderSlides] = useState<{
    image_url: string; title: string; subtitle: string; description: string; btn_text: string; btn_link: string;
  }[]>([]);

  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageId, setNewPageId] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageContent, setNewPageContent] = useState('');
  const [newPageFileUrl, setNewPageFileUrl] = useState<string | null>(null);
  const [newPageFileName, setNewPageFileName] = useState<string | null>(null);
  const [newPageParentMenu, setNewPageParentMenu] = useState(parentMenuFilter === 'none' ? 'none' : parentMenuFilter);
  const [newPageMenuType, setNewPageMenuType] = useState(parentMenuFilter === 'none' ? 'standalone' : 'child');
  const [newPageIsVisible, setNewPageIsVisible] = useState(1);
  const [newPageShowSlider, setNewPageShowSlider] = useState(false);
  const [newPageSlides, setNewPageSlides] = useState<{
    image_url: string; title: string; subtitle: string; description: string; btn_text: string; btn_link: string;
  }[]>([]);

  const customParents = allPages.filter(p => p.menu_type === 'parent');

  const filteredPages = allPages.filter(p => {
    if (parentMenuFilter === 'none') {
      const isBasePage = ['about_us', 'committee', 'hods', 'ncte', 'director', 'circulars', 'news_notices', 'facilities', 'souvenirs', 'calendar', 'draws', 'results', 'courses', 'admission', 'syllabus', 'academic_results', 'events', 'stories', 'careers', 'activities', 'research', 'projects'].includes(p.id);
      return !isBasePage && p.parent_menu !== 'about' && p.parent_menu !== 'academic' && p.parent_menu !== 'student';
    }
    return p.parent_menu === parentMenuFilter;
  });

  // Default selection
  useEffect(() => {
    if (filteredPages.length > 0) {
      if (!selectedPageId || !filteredPages.some(p => p.id === selectedPageId)) {
        setSelectedPageId(filteredPages[0].id);
      }
    } else {
      setSelectedPageId('');
    }
  }, [allPages]);

  // Auto-select page if requested from edit button on public pages
  useEffect(() => {
    const editPageId = sessionStorage.getItem('admin_edit_page_id');
    if (editPageId) {
      const match = filteredPages.find(p => p.id === editPageId);
      if (match) {
        setSelectedPageId(match.id);
        sessionStorage.removeItem('admin_edit_page_id');
      }
    }
  }, [allPages, filteredPages]);

  // Load FULL page data from API when selection changes
  useEffect(() => {
    if (!selectedPageId) {
      setPageTitle(''); setPageContent(''); setPageFileUrl(null); setPageFileName(null);
      setPageParentMenu(parentMenuFilter === 'none' ? 'none' : parentMenuFilter);
      setPageMenuType(parentMenuFilter === 'none' ? 'standalone' : 'child');
      setPageShowSlider(false); setPageSliderSlides([]);
      return;
    }
    setPageLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${selectedPageId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setPageTitle(data.title || '');
          setPageContent(data.content || '');
          setPageFileUrl(data.file_url || null);
          setPageFileName(data.file_name || null);
          setPageParentMenu(data.parent_menu || (parentMenuFilter === 'none' ? 'none' : parentMenuFilter));
          setPageMenuType(data.menu_type || (parentMenuFilter === 'none' ? 'standalone' : 'child'));
          setPageIsVisible(data.is_visible !== undefined ? data.is_visible : 1);
          setPageShowSlider(!!data.show_slider);
          try {
            const slides = JSON.parse(data.slider_slides || '[]');
            setPageSliderSlides(Array.isArray(slides) ? slides : []);
          } catch { setPageSliderSlides([]); }
        }
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, [selectedPageId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPageFileUrl(reader.result as string); setPageFileName(file.name); };
    reader.readAsDataURL(file);
  };

  const handleNewPageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setNewPageFileUrl(reader.result as string); setNewPageFileName(file.name); };
    reader.readAsDataURL(file);
  };

  const addSlide = (slides: typeof pageSliderSlides, setSlides: (s: typeof pageSliderSlides) => void) => {
    setSlides([...slides, { image_url: '', title: '', subtitle: '', description: '', btn_text: 'Learn More', btn_link: 'home' }]);
  };
  const removeSlide = (slides: typeof pageSliderSlides, setSlides: (s: typeof pageSliderSlides) => void, idx: number) => {
    setSlides(slides.filter((_, i) => i !== idx));
  };
  const updateSlide = (slides: typeof pageSliderSlides, setSlides: (s: typeof pageSliderSlides) => void, idx: number, field: string, value: string) => {
    setSlides(slides.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageSaved(false);
    if (!selectedPageId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${selectedPageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageTitle,
          content: pageContent,
          file_url: pageFileUrl,
          file_name: pageFileName,
          parent_menu: pageParentMenu,
          menu_type: pageMenuType,
          show_slider: pageShowSlider,
          slider_slides: JSON.stringify(pageSliderSlides),
          is_visible: pageIsVisible
        })
      });
      if (res.ok) {
        setPageSaved(true);
        await onRefresh();
        alert("Page updated successfully!");
        setTimeout(() => setPageSaved(false), 3000);
      } else {
        alert("Failed to update page data.");
      }
    } catch {
      alert("Connection failed.");
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageId || !newPageTitle) { alert("Page ID/Slug and Title are required."); return; }
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(newPageId)) { alert("Page ID/Slug can only contain alphanumeric characters, hyphens, and underscores."); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newPageId,
          title: newPageTitle,
          content: newPageContent,
          parent_menu: parentMenuFilter === 'none' ? newPageParentMenu : parentMenuFilter,
          menu_type: parentMenuFilter === 'none' ? newPageMenuType : 'child',
          file_url: newPageFileUrl,
          file_name: newPageFileName,
          show_slider: newPageShowSlider,
          slider_slides: JSON.stringify(newPageSlides),
          is_visible: newPageIsVisible
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Custom page created successfully!");
        const createdId = newPageId;
        setNewPageId(''); setNewPageTitle(''); setNewPageContent('');
        setNewPageFileUrl(null); setNewPageFileName(null);
        setNewPageShowSlider(false); setNewPageSlides([]);
        setNewPageIsVisible(1);
        setIsCreatingPage(false);
        await onRefresh();
        setSelectedPageId(createdId);
      } else {
        alert(data.error || "Failed to create new page.");
      }
    } catch {
      alert("Connection failed.");
    }
  };

  const handleDeletePage = (pageId: string) => {
    const isBasePage = ['about_us', 'committee', 'hods', 'ncte', 'director', 'circulars', 'news_notices', 'facilities', 'souvenirs', 'calendar', 'draws', 'results', 'courses', 'admission', 'syllabus', 'academic_results', 'events', 'stories', 'careers', 'activities', 'research', 'projects'].includes(pageId);
    if (isBasePage) { alert("This is a system default page and cannot be deleted."); return; }
    setConfirmDialog({
      isOpen: true,
      message: `Delete custom page "${pageId}"? If it's a dropdown parent, all its child subpages will also be deleted.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${pageId}`, { method: 'DELETE' });
          if (res.ok) { await onRefresh(); setSelectedPageId(''); }
          else { alert("Failed to delete page."); }
        } catch { alert("Connection failed."); }
        setConfirmDialog((prev: any) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleVisibility = async (page: any) => {
    const nextVisibility = page.is_visible !== 0 ? 0 : 1;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${page.id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: nextVisibility })
      });
      if (res.ok) {
        await onRefresh();
        if (selectedPageId === page.id) {
          setPageIsVisible(nextVisibility);
        }
      } else {
        alert("Failed to toggle visibility.");
      }
    } catch {
      alert("Connection failed.");
    }
  };

  // Reusable slide editor block
  const SlideEditor = ({
    slides, setSlides, handleSlideImageUpload
  }: {
    slides: typeof pageSliderSlides;
    setSlides: (s: typeof pageSliderSlides) => void;
    handleSlideImageUpload?: (idx: number, file: File) => void;
  }) => (
    <div className="space-y-4">
      {slides.map((slide, idx) => (
        <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Slide #{idx + 1}</span>
            <button
              type="button"
              onClick={() => removeSlide(slides, setSlides, idx)}
              className="text-rose-500 hover:text-rose-600 font-bold text-xs cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Background Image URL *</label>
              <input
                type="url"
                value={slide.image_url}
                onChange={e => updateSlide(slides, setSlides, idx, 'image_url', e.target.value)}
                placeholder="https://... or paste image URL"
                className="glass-input text-xs"
              />
              <div className="mt-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => updateSlide(slides, setSlides, idx, 'image_url', reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                  className="glass-input file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-white cursor-pointer text-[10px] w-full mt-0.5"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slide Title</label>
              <input
                type="text"
                value={slide.title}
                onChange={e => updateSlide(slides, setSlides, idx, 'title', e.target.value)}
                placeholder="e.g. Excellence in Sports"
                className="glass-input text-xs font-bold"
              />
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">Subtitle / Tagline</label>
              <input
                type="text"
                value={slide.subtitle}
                onChange={e => updateSlide(slides, setSlides, idx, 'subtitle', e.target.value)}
                placeholder="e.g. Building Champions Since 1985"
                className="glass-input text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description (optional)</label>
              <textarea
                value={slide.description}
                onChange={e => updateSlide(slides, setSlides, idx, 'description', e.target.value)}
                placeholder="Short description shown below the title..."
                rows={2}
                className="glass-input text-xs resize-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Text</label>
                <input
                  type="text"
                  value={slide.btn_text}
                  onChange={e => updateSlide(slides, setSlides, idx, 'btn_text', e.target.value)}
                  placeholder="e.g. Explore Now"
                  className="glass-input text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Link (tab name or URL)</label>
                <input
                  type="text"
                  value={slide.btn_link}
                  onChange={e => updateSlide(slides, setSlides, idx, 'btn_link', e.target.value)}
                  placeholder="e.g. events or https://..."
                  className="glass-input text-xs"
                />
              </div>
            </div>
          </div>
          {slide.image_url && (
            <div className="mt-2 rounded-xl overflow-hidden h-24 bg-slate-200 dark:bg-slate-800">
              <img src={slide.image_url} alt={`Slide ${idx + 1} preview`} className="w-full h-full object-cover opacity-80" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addSlide(slides, setSlides)}
        className="w-full border-2 border-dashed border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/5 rounded-2xl py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" /> Add New Slide
      </button>
    </div>
  );

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
      <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" /> {title}
      </h2>
      <p className="text-xs text-slate-500">{description}</p>

      {/* Tab switch */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setIsCreatingPage(false)}
          className={`px-4 py-2 text-xs font-extrabold transition-all border-b-2 ${
            !isCreatingPage ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
          }`}
        >
          Edit Existing Page
        </button>
        <button
          type="button"
          onClick={() => setIsCreatingPage(true)}
          className={`px-4 py-2 text-xs font-extrabold transition-all border-b-2 ${
            isCreatingPage ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
          }`}
        >
          Create New Page
        </button>
      </div>

      {pageSaved && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
          <Check className="w-4 h-4" /> Changes saved successfully! Page content updated.
        </div>
      )}

      {/* EDIT EXISTING PAGE FORM */}
      {!isCreatingPage && (
        <form onSubmit={handleSavePage} className="space-y-5 text-xs">
          {filteredPages.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No pages found in this section.</p>
              <p className="text-xs text-slate-400">Switch to "Create New Page" tab to add a custom page.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Page to Edit</label>
                  <select
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                    className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                  >
                    {filteredPages.map(p => (
                      <option key={p.id} value={p.id}>{p.title || p.id} ({p.menu_type || 'child'})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Header Title</label>
                  {pageLoading ? (
                    <div className="glass-input flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                    </div>
                  ) : (
                    <input
                      type="text" required value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      placeholder="Page Title" className="glass-input font-bold"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Status</label>
                  {pageLoading ? (
                    <div className="glass-input flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                    </div>
                  ) : (
                    <select
                      value={pageIsVisible}
                      onChange={(e) => setPageIsVisible(parseInt(e.target.value))}
                      className="glass-input font-bold text-slate-700 dark:text-slate-250"
                    >
                      <option value={1}>🟢 Visible (Shown in menu)</option>
                      <option value={0}>🔴 Hidden (Hidden from menu)</option>
                    </select>
                  )}
                </div>
              </div>

              {parentMenuFilter === 'none' && !pageLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Layout / Navigation Type</label>
                    <select
                      value={pageMenuType}
                      onChange={(e) => {
                        setPageMenuType(e.target.value);
                        if (e.target.value === 'standalone' || e.target.value === 'parent') {
                          setPageParentMenu('none');
                        } else if (e.target.value === 'child') {
                          const firstParent = customParents.find(p => p.id !== selectedPageId)?.id || 'none';
                          setPageParentMenu(firstParent);
                        } else if (e.target.value === 'sub-parent' || e.target.value === 'sub-child') {
                          // Parent should be a child/sub-parent page
                          const firstChild = allPages.find(p => (p.menu_type === 'child' || p.menu_type === 'sub-parent') && p.id !== selectedPageId)?.id || 'none';
                          setPageParentMenu(firstChild);
                        }
                      }}
                      className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                    >
                      <option value="standalone">Independent Standalone Page (Direct navbar link)</option>
                      <option value="parent">Dropdown Menu Header (Level 1 — top navbar dropdown)</option>
                      <option value="child">Child Subpage (Level 2 — inside a top dropdown)</option>
                      <option value="sub-parent">Sub-Dropdown Header (Level 2 — child with its own sub-menu)</option>
                      <option value="sub-child">Sub-Child Page (Level 3 — inside a child sub-menu)</option>
                    </select>
                  </div>

                  {/* Parent selector — shows different options based on type */}
                  {(pageMenuType === 'child' || pageMenuType === 'sub-parent') && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Level-1 Parent Dropdown Menu</label>
                      <select
                        value={pageParentMenu}
                        onChange={(e) => setPageParentMenu(e.target.value)}
                        className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                      >
                        {customParents.filter(p => p.id !== selectedPageId).length === 0 ? (
                          <option value="none">-- No Level-1 Menus Available (Create a Parent first) --</option>
                        ) : (
                          customParents.filter(p => p.id !== selectedPageId).map(parent => (
                            <option key={parent.id} value={parent.id}>{parent.title} ({parent.id})</option>
                          ))
                        )}
                      </select>
                    </div>
                  )}

                  {pageMenuType === 'sub-child' && (() => {
                    const subParentOptions = allPages.filter(p =>
                      (p.menu_type === 'child' || p.menu_type === 'sub-parent') && p.id !== selectedPageId
                    );
                    return (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Level-2 Parent (Child/Sub-Menu Item)</label>
                        <select
                          value={pageParentMenu}
                          onChange={(e) => setPageParentMenu(e.target.value)}
                          className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                        >
                          {subParentOptions.length === 0 ? (
                            <option value="none">-- No Level-2 Pages Available (Create a Child page first) --</option>
                          ) : (
                            subParentOptions.map(p => (
                              <option key={p.id} value={p.id}>{p.title} ({p.id}) [{p.menu_type}]</option>
                            ))
                          )}
                        </select>
                        <p className="text-[9px] text-slate-400 mt-0.5">💡 The selected parent must be changed to "Sub-Dropdown Header" type for the sub-menu to appear in the navbar.</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── HERO SLIDER SECTION ── */}
              {!pageLoading && (
                <div className="p-5 border border-dashed border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Hero Slider (Before Page Content)
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Add image slides that appear above this page's body text</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPageShowSlider(!pageShowSlider)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${pageShowSlider ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${pageShowSlider ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {pageShowSlider && (
                    <SlideEditor slides={pageSliderSlides} setSlides={setPageSliderSlides} />
                  )}
                  {!pageShowSlider && (
                    <p className="text-[10px] text-slate-400 italic">Toggle ON above to enable and configure the hero slider for this page.</p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Body Content (Description)</label>
                {!pageLoading ? (
                  <RichTextEditor
                    value={pageContent}
                    onChange={(html) => setPageContent(html)}
                    placeholder="Enter detailed description, headings, lists, links, pictures..."
                    editKey={selectedPageId}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-4 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading page content...
                  </div>
                )}
              </div>

              <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">Page Attachment Document (Optional)</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">Upload PDF or compliance certificate</p>
                    <input
                      type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px] w-full"
                    />
                  </div>
                  {pageFileName && (
                    <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg max-w-xs truncate shadow-sm">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{pageFileName}</span>
                      <button
                        type="button" onClick={() => { setPageFileUrl(null); setPageFileName(null); }}
                        className="text-rose-500 hover:text-rose-600 font-bold text-xs shrink-0 cursor-pointer ml-1"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">
                Save Page Changes
              </button>
            </>
          )}
        </form>
      )}

      {/* CREATE NEW PAGE FORM */}
      {isCreatingPage && (
        <form onSubmit={handleCreatePage} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page ID / Slug *</label>
              <input
                type="text" required value={newPageId}
                onChange={(e) => setNewPageId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="e.g. static-page-slug"
                className="glass-input font-bold"
              />
              <p className="text-[9px] text-slate-400 mt-0.5">Use lowercase, hyphens, and underscores.</p>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Header Title *</label>
              <input
                type="text" required value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="e.g. Static Page Title"
                className="glass-input font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Status</label>
              <select
                value={newPageIsVisible}
                onChange={(e) => setNewPageIsVisible(parseInt(e.target.value))}
                className="glass-input font-bold text-slate-700 dark:text-slate-250"
              >
                <option value={1}>🟢 Visible (Shown in menu)</option>
                <option value={0}>🔴 Hidden (Hidden from menu)</option>
              </select>
            </div>
          </div>

          {parentMenuFilter === 'none' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Layout / Navigation Type</label>
                <select
                  value={newPageMenuType}
                  onChange={(e) => {
                    setNewPageMenuType(e.target.value);
                    if (e.target.value === 'standalone' || e.target.value === 'parent') {
                      setNewPageParentMenu('none');
                    } else if (e.target.value === 'child' || e.target.value === 'sub-parent') {
                      const firstParent = customParents[0]?.id || 'none';
                      setNewPageParentMenu(firstParent);
                    } else if (e.target.value === 'sub-child') {
                      const firstChild = allPages.find(p => p.menu_type === 'child' || p.menu_type === 'sub-parent')?.id || 'none';
                      setNewPageParentMenu(firstChild);
                    }
                  }}
                  className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                >
                  <option value="standalone">Independent Standalone Page (Direct navbar link)</option>
                  <option value="parent">Dropdown Menu Header (Level 1 — top navbar dropdown)</option>
                  <option value="child">Child Subpage (Level 2 — inside a top dropdown)</option>
                  <option value="sub-parent">Sub-Dropdown Header (Level 2 — child with its own sub-menu)</option>
                  <option value="sub-child">Sub-Child Page (Level 3 — inside a child sub-menu)</option>
                </select>
              </div>

              {/* Create form: Level-1 parent selector for child/sub-parent */}
              {(newPageMenuType === 'child' || newPageMenuType === 'sub-parent') && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Level-1 Parent Dropdown Menu</label>
                  <select
                    value={newPageParentMenu}
                    onChange={(e) => setNewPageParentMenu(e.target.value)}
                    className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                  >
                    {customParents.length === 0 ? (
                      <option value="none">-- No Level-1 Menus Available (Create a Parent first) --</option>
                    ) : (
                      customParents.map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.title} ({parent.id})</option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* Create form: Level-2 parent selector for sub-child */}
              {newPageMenuType === 'sub-child' && (() => {
                const subParentOptions = allPages.filter(p =>
                  p.menu_type === 'child' || p.menu_type === 'sub-parent'
                );
                return (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Level-2 Parent (Child/Sub-Menu Item)</label>
                    <select
                      value={newPageParentMenu}
                      onChange={(e) => setNewPageParentMenu(e.target.value)}
                      className="glass-input text-slate-700 dark:text-slate-250 font-semibold"
                    >
                      {subParentOptions.length === 0 ? (
                        <option value="none">-- No Level-2 Pages Available (Create a Child page first) --</option>
                      ) : (
                        subParentOptions.map(p => (
                          <option key={p.id} value={p.id}>{p.title} ({p.id}) [{p.menu_type}]</option>
                        ))
                      )}
                    </select>
                    <p className="text-[9px] text-slate-400 mt-0.5">💡 The selected parent must be "Sub-Dropdown Header" type for the sub-menu to appear in the navbar.</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── HERO SLIDER SECTION (Create) ── */}
          <div className="p-5 border border-dashed border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Hero Slider (Before Page Content)
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Add image slides that appear above this page's body text</p>
              </div>
              <button
                type="button"
                onClick={() => setNewPageShowSlider(!newPageShowSlider)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${newPageShowSlider ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${newPageShowSlider ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {newPageShowSlider && (
              <SlideEditor slides={newPageSlides} setSlides={setNewPageSlides} />
            )}
            {!newPageShowSlider && (
              <p className="text-[10px] text-slate-400 italic">Toggle ON above to enable and configure the hero slider for this page.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page Body Content (Description)</label>
            <RichTextEditor
              value={newPageContent}
              onChange={(html) => setNewPageContent(html)}
              placeholder="Enter description, lists, formatted text, headings using editor..."
              editKey="create-new-page"
            />
          </div>

          <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <h4 className="font-bold text-xs text-slate-800 dark:text-white">Page Attachment Document (Optional)</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Upload PDF or compliance document</p>
                <input
                  type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  onChange={handleNewPageFileUpload}
                  className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px] w-full"
                />
              </div>
              {newPageFileName && (
                <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg max-w-xs truncate shadow-sm">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{newPageFileName}</span>
                  <button
                    type="button" onClick={() => { setNewPageFileUrl(null); setNewPageFileName(null); }}
                    className="text-rose-500 hover:text-rose-600 font-bold text-xs shrink-0 cursor-pointer ml-1"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">
            Create Custom Page
          </button>
        </form>
      )}

      {/* CATALOG & DELETION CENTER */}
      {filteredPages.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 my-6 pt-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Page Catalog &amp; Deletion Center</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredPages.map((page) => {
              const isBasePage = ['about_us', 'committee', 'hods', 'ncte', 'director', 'circulars', 'news_notices', 'facilities', 'souvenirs', 'calendar', 'draws', 'results', 'courses', 'admission', 'syllabus', 'academic_results', 'events', 'stories', 'careers', 'activities', 'research', 'projects'].includes(page.id);
              const typeColor = page.menu_type === 'parent' ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400' :
                page.menu_type === 'standalone' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' :
                page.menu_type === 'sub-parent' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400' :
                page.menu_type === 'sub-child' ? 'bg-teal-100 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400';
              return (
                <div key={page.id} className="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/20 dark:hover:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary-light/50 dark:bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-white leading-normal text-left truncate">
                        {page.title || page.id}
                        {isBasePage && <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded ml-1">System</span>}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${typeColor}`}>
                          {page.menu_type || 'child'}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${page.is_visible !== 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {page.is_visible !== 0 ? 'Visible' : 'Hidden'}
                        </span>
                        <span className="text-[10px] text-slate-400">slug: {page.id}</span>
                        {page.parent_menu && page.parent_menu !== 'none' && page.parent_menu !== 'about' && page.parent_menu !== 'academic' && page.parent_menu !== 'student' && (
                          <span className="text-[9px] text-slate-400">· under: {page.parent_menu}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button
                      type="button" onClick={() => handleToggleVisibility(page)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${page.is_visible !== 0 ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' : 'text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      title={page.is_visible !== 0 ? 'Hide this page' : 'Show this page'}
                    >
                      {page.is_visible !== 0 ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button" onClick={() => { setIsCreatingPage(false); setSelectedPageId(page.id); }}
                      className="p-1.5 rounded-lg text-slate-450 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      title="Edit this page"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!isBasePage ? (
                      <button
                        type="button" onClick={() => handleDeletePage(page.id)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Delete Custom Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold opacity-30 select-none mr-2">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, setCurrentTab }) => {

  const [activeSubTab, setActiveSubTab] = useState(() => {
    return sessionStorage.getItem('admin_active_sub_tab') || 'dashboard';
  });

  useEffect(() => {
    sessionStorage.setItem('admin_active_sub_tab', activeSubTab);
  }, [activeSubTab]);
  const { settings, updateSettings } = useTheme();

  // Database lists
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

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
  const [zonalFeatures, setZonalFeatures] = useState<any[]>([]);
  const [zonalFeaturesHeader, setZonalFeaturesHeader] = useState('');
  const [zonalFeaturesDesc, setZonalFeaturesDesc] = useState('');
  const [showCompanySlider, setShowCompanySlider] = useState(1);
  const [companySliderTitle, setCompanySliderTitle] = useState('Our Placement Partners & Recruiters');
  const [companySliderDesc, setCompanySliderDesc] = useState('Our graduates have been placed in leading organizations across sports management, education, fitness, and public administration.');

  const DEFAULT_ZONAL_FEATURES_FALLBACK = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80",
      title: "Inter-Collegiate Tournaments",
      description: "Organizing prestigious zonal, inter-zonal, and state-level sports competitions for student-athletes.",
      tag: "Competitions"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
      title: "Sports Calendar & Schedules",
      description: "Access accurate schedules, entry dates, brackets, and fixtures for the entire academic year.",
      tag: "Schedules"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&auto=format&fit=crop&q=80",
      title: "Dynamic Results Portal",
      description: "Real-time updates of tournament standings, team rosters, scoreboards, and merit notifications.",
      tag: "Real-Time Updates"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
      title: "Alumni & Sports Mentorship",
      description: "Connecting champion alumni with current athletes for career guidance, training support, and placements.",
      tag: "Community"
    }
  ];

  // Contact Us Settings Form State
  const [contactIntro, setContactIntro] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactTimings, setContactTimings] = useState('');
  const [contactTimingsNote, setContactTimingsNote] = useState('');
  const [contactPhone1, setContactPhone1] = useState('');
  const [contactPhone2, setContactPhone2] = useState('');
  const [contactEmail1, setContactEmail1] = useState('');
  const [contactEmail2, setContactEmail2] = useState('');
  const [contactMapQuery, setContactMapQuery] = useState('');

  // Top Header Configurations Form State
  const [showTopHeader, setShowTopHeader] = useState(1);
  const [topHeaderPhone, setTopHeaderPhone] = useState('');
  const [topHeaderEmail, setTopHeaderEmail] = useState('');
  const [topHeaderBgColor, setTopHeaderBgColor] = useState('');
  const [topHeaderTextColor, setTopHeaderTextColor] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [topHeaderLinks, setTopHeaderLinks] = useState<{ label: string, url: string }[]>([]);

  // Main Header Configurations Form State
  const [showMainHeader, setShowMainHeader] = useState(1);
  const [univTagline, setUnivTagline] = useState('');
  const [accreditationLogos, setAccreditationLogos] = useState<{ id: string; title: string; subtitle: string; image_url: string }[]>([]);

  // Tmp link inputs
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Sync branding form state with settings context once loaded
  useEffect(() => {
    if (settings) {
      setUnivName(settings.univ_name || '');
      setLogoUrl(settings.logo_url || '');
      setThemePreset(settings.theme_preset || 'crimson');
      setPrimaryColor(settings.primary_color || '#800020');
      setSecondaryColor(settings.secondary_color || '#04091e');

      setShowTopHeader(settings.show_top_header ?? 1);
      setTopHeaderPhone(settings.top_header_phone ?? '+953 012 3654 896');
      setTopHeaderEmail(settings.top_header_email ?? 'support@apex.edu');
      setTopHeaderBgColor(settings.top_header_bg_color ?? '#800020');
      setTopHeaderTextColor(settings.top_header_text_color ?? '#ffffff');
      setSocialFacebook(settings.social_facebook ?? '#');
      setSocialTwitter(settings.social_twitter ?? '#');
      setSocialLinkedin(settings.social_linkedin ?? '#');
      setSocialInstagram(settings.social_instagram ?? '#');
      setSocialYoutube(settings.social_youtube ?? '#');
      try {
        setTopHeaderLinks(JSON.parse(settings.top_header_links || '[]'));
      } catch {
        setTopHeaderLinks([]);
      }

      setShowMainHeader(settings.show_main_header ?? 1);
      setUnivTagline(settings.univ_tagline ?? 'Autonomous Institution | Approved by AICTE | Permanently Affiliated');
      try {
        const parsed = JSON.parse(settings.accreditation_logos || '[]');
        setAccreditationLogos(JSON.parse(settings.accreditation_logos || '[]'));
      } catch {
        setAccreditationLogos([]);
      }

      setContactIntro(settings.contact_intro || '');
      setContactAddress(settings.contact_address || '');
      setContactTimings(settings.contact_timings || '');
      setContactTimingsNote(settings.contact_timings_note || '');
      setContactPhone1(settings.contact_phone1 || '');
      setContactPhone2(settings.contact_phone2 || '');
      setContactEmail1(settings.contact_email1 || '');
      setContactEmail2(settings.contact_email2 || '');
      setContactMapQuery(settings.contact_map_query || '');

      // Sync Zonal Features
      try {
        if (settings.zonal_features) {
          const parsed = JSON.parse(settings.zonal_features);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setZonalFeatures(parsed);
          } else {
            setZonalFeatures(DEFAULT_ZONAL_FEATURES_FALLBACK);
          }
        } else {
          setZonalFeatures(DEFAULT_ZONAL_FEATURES_FALLBACK);
        }
      } catch (err) {
        setZonalFeatures(DEFAULT_ZONAL_FEATURES_FALLBACK);
      }

      setZonalFeaturesHeader(settings.zonal_features_header || 'Core Zonal Features');
      setZonalFeaturesDesc(settings.zonal_features_desc || 'Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities.');

      // Sync Company Slider Settings
      setShowCompanySlider(settings.show_company_slider ?? 1);
      setCompanySliderTitle(settings.company_slider_title || 'Our Placement Partners & Recruiters');
      setCompanySliderDesc(settings.company_slider_desc || 'Our graduates have been placed in leading organizations across sports management, education, fitness, and public administration.');
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
  const [newsFileUrl, setNewsFileUrl] = useState<string | null>(null);
  const [newsFileName, setNewsFileName] = useState<string | null>(null);
  const [newsCreated, setNewsCreated] = useState(false);

  // About Pages State variables
  const [allAboutPages, setAllAboutPages] = useState<any[]>([]);
  const [selectedAboutPageId, setSelectedAboutPageId] = useState('about_us');
  const [aboutPageTitle, setAboutPageTitle] = useState('');
  const [aboutPageContent, setAboutPageContent] = useState('');
  const [aboutPageFileUrl, setAboutPageFileUrl] = useState<string | null>(null);
  const [aboutPageFileName, setAboutPageFileName] = useState<string | null>(null);
  const [aboutPageParentMenu, setAboutPageParentMenu] = useState('about');
  const [aboutPageMenuType, setAboutPageMenuType] = useState('child');
  const [aboutPageSaved, setAboutPageSaved] = useState(false);

  // New Custom Page Creation State variables
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageId, setNewPageId] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageContent, setNewPageContent] = useState('');
  const [newPageParentMenu, setNewPageParentMenu] = useState('about');
  const [newPageMenuType, setNewPageMenuType] = useState('child');
  const [newPageFileUrl, setNewPageFileUrl] = useState<string | null>(null);
  const [newPageFileName, setNewPageFileName] = useState<string | null>(null);

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

  // Gallery State
  const [allGallery, setAllGallery] = useState<any[]>([]);
  const [galleryEditId, setGalleryEditId] = useState<number | null>(null);
  const [gallerySaved, setGallerySaved] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    category: 'Events',
    image_url: '' as string,
    photographer: '',
    location: '',
    date: '',
    sort_order: 0
  });

  // Placement Manager State
  const [placementContent, setPlacementContent] = useState<any>({
    hero_title: 'Training & Placement Cell',
    hero_subtitle: 'Empowering students with industry-ready skills',
    content: '',
    stat_placed: 0,
    stat_companies: 0,
    stat_package_avg: '0 LPA',
    stat_package_highest: '0 LPA'
  });
  const [placementContentSaved, setPlacementContentSaved] = useState(false);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [companyEditId, setCompanyEditId] = useState<number | null>(null);
  const [companySaved, setCompanySaved] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '', logo_url: '' as string, website: '', sort_order: 0
  });
  const [placementTab, setPlacementTab] = useState<'content' | 'companies'>('content');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Pending accounts
      const pRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/pending-users`);
      const pData = await pRes.json();
      if (pRes.ok) setPendingUsers(pData);

      // Donations list
      const dRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/donations`);
      const dData = await dRes.json();
      if (dRes.ok) setAllDonations(dData);

      // News list
      const nRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/news`);
      const nData = await nRes.json();
      if (nRes.ok) setAllNews(nData);

      // Custom pages list
      const cpRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages`);
      const cpData = await cpRes.json();
      if (cpRes.ok) setAllAboutPages(cpData);

      // Events list
      const eRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`);
      const eData = await eRes.ok ? await eRes.json() : [];
      if (eRes.ok) setAllEvents(eData);

      // Hero slider list
      const slRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/slider`);
      const slData = slRes.ok ? await slRes.json() : [];
      setAllSlides(slData);

      // Results / Draws list
      const rRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/results`);
      const rData = rRes.ok ? await rRes.json() : [];
      setAllResults(rData);

      // Circulars list
      const circRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/circulars`);
      const circData = circRes.ok ? await circRes.json() : [];
      setAllCirculars(circData);

      // NCTE disclosures list
      const ncteRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ncte-disclosures`);
      const ncteData = ncteRes.ok ? await ncteRes.json() : [];
      setAllNcte(ncteData);

      // Committee members
      const cmRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/committee`);
      const cmData = cmRes.ok ? await cmRes.json() : [];
      setAllCommittee(cmData);

      // Directors
      const dirRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/directors`);
      const dirData = dirRes.ok ? await dirRes.json() : [];
      setAllDirectors(dirData);

      // HODs / Directors Desk
      const hodsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/hods`);
      const hodsData = hodsRes.ok ? await hodsRes.json() : [];
      setAllHods(hodsData);

      // Courses list
      const cRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/courses`);
      const cData = cRes.ok ? await cRes.json() : [];
      setAllCourses(cData);

      // Admissions list
      const admRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admissions`);
      const admData = admRes.ok ? await admRes.json() : [];
      setAllAdmissions(admData);

      // Admission Files (Documents) list
      const afRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admission-files`);
      const afData = afRes.ok ? await afRes.json() : [];
      if (afRes.ok) setAllAdmFiles(afData);

      // Jobs list
      const jobsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs`);
      const jobsData = jobsRes.ok ? await jobsRes.json() : [];
      if (jobsRes.ok) setAllJobs(jobsData);

      // Job applications list
      const appsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs/applications`);
      const appsData = appsRes.ok ? await appsRes.json() : [];
      setAllApplications(appsData);

      // Spotlights list
      const spotsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/spotlights`);
      const spotsData = spotsRes.ok ? await spotsRes.json() : [];
      setAllSpotlights(spotsData);

      // Gallery list
      const galRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/gallery`);
      const galData = galRes.ok ? await galRes.json() : [];
      setAllGallery(galData);

      // Placement data
      const plRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/placement/content`);
      if (plRes.ok) { const plData = await plRes.json(); setPlacementContent(plData); }
      const compRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/placement/companies`);
      if (compRes.ok) { const compData = await compRes.json(); setAllCompanies(compData); }

    } catch (e) {
      console.warn("Backend API not reachable for Admin Dashboard");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Placement content save
  const handlePlacementContentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/placement/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placementContent)
      });
      if (res.ok) {
        setPlacementContentSaved(true);
        setTimeout(() => setPlacementContentSaved(false), 3000);
      } else { alert('Failed to save placement content.'); }
    } catch { alert('Connection failed.'); }
  };

  // Company image upload
  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCompanyForm(f => ({ ...f, logo_url: reader.result as string }));
    reader.readAsDataURL(file);
  };

  // Company save
  const handleCompanySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name) { alert('Company name is required.'); return; }
    try {
      const url = companyEditId
        ? `${import.meta.env.VITE_API_URL || ''}/api/placement/companies/${companyEditId}`
        : `${import.meta.env.VITE_API_URL || ''}/api/placement/companies`;
      const method = companyEditId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm)
      });
      if (res.ok) {
        setCompanySaved(true);
        setTimeout(() => setCompanySaved(false), 3000);
        setCompanyEditId(null);
        setCompanyForm({ name: '', logo_url: '', website: '', sort_order: 0 });
        const compRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/placement/companies`);
        if (compRes.ok) setAllCompanies(await compRes.json());
      } else { alert('Failed to save company.'); }
    } catch { alert('Connection failed.'); }
  };

  // Company edit
  const handleCompanyEdit = (c: any) => {
    setCompanyEditId(c.id);
    setCompanyForm({ name: c.name || '', logo_url: c.logo_url || '', website: c.website || '', sort_order: c.sort_order || 0 });
  };

  // Company delete
  const handleCompanyDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Delete this recruiter company? This cannot be undone.',
      onConfirm: async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/placement/companies/${id}`, { method: 'DELETE' });
        if (res.ok) {
          const compRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/placement/companies`);
          if (compRes.ok) setAllCompanies(await compRes.json());
          if (companyEditId === id) { setCompanyEditId(null); setCompanyForm({ name: '', logo_url: '', website: '', sort_order: 0 }); }
        } else { alert('Failed to delete company.'); }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Gallery handlers
  const resetGalleryForm = () => {
    setGalleryEditId(null);
    setGalleryForm({ title: '', description: '', category: 'Events', image_url: '', photographer: '', location: '', date: '', sort_order: 0 });
    setGallerySaved(false);
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setGalleryForm(f => ({ ...f, image_url: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleGallerySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.image_url) { alert('Title and image are required.'); return; }
    try {
      const url = galleryEditId ? `${import.meta.env.VITE_API_URL || ''}/api/gallery/${galleryEditId}` : `${import.meta.env.VITE_API_URL || ''}/api/gallery`;
      const method = galleryEditId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm)
      });
      if (res.ok) {
        setGallerySaved(true);
        setTimeout(() => setGallerySaved(false), 3000);
        resetGalleryForm();
        const galRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/gallery`);
        const galData = galRes.ok ? await galRes.json() : [];
        setAllGallery(galData);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save photo.');
      }
    } catch { alert('Connection failed.'); }
  };

  const handleGalleryEdit = (photo: any) => {
    setGalleryEditId(photo.id);
    setGalleryForm({
      title: photo.title || '',
      description: photo.description || '',
      category: photo.category || 'Events',
      image_url: photo.image_url || '',
      photographer: photo.photographer || '',
      location: photo.location || '',
      date: photo.date || '',
      sort_order: photo.sort_order || 0
    });
  };

  const handleGalleryDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this photo? This action cannot be undone.',
      onConfirm: async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) {
          const galRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/gallery`);
          const galData = galRes.ok ? await galRes.json() : [];
          setAllGallery(galData);
          if (galleryEditId === id) resetGalleryForm();
        } else { alert('Failed to delete photo.'); }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Fetch page detail on selected ID change
  useEffect(() => {
    if (selectedAboutPageId) {
      fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${selectedAboutPageId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setAboutPageTitle(data.title || '');
            setAboutPageContent(data.content || '');
            setAboutPageFileUrl(data.file_url || null);
            setAboutPageFileName(data.file_name || null);
            setAboutPageParentMenu(data.parent_menu || 'about');
            setAboutPageMenuType(data.menu_type || 'child');
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
      secondary_color: secondaryColor,
      show_top_header: showTopHeader,
      top_header_phone: topHeaderPhone,
      top_header_email: topHeaderEmail,
      top_header_bg_color: topHeaderBgColor,
      top_header_text_color: topHeaderTextColor,
      social_facebook: socialFacebook,
      social_twitter: socialTwitter,
      social_linkedin: socialLinkedin,
      social_instagram: socialInstagram,
      social_youtube: socialYoutube,
      top_header_links: JSON.stringify(topHeaderLinks),
      show_main_header: showMainHeader,
      univ_tagline: univTagline,
      accreditation_logos: JSON.stringify(accreditationLogos),
      contact_intro: contactIntro,
      contact_address: contactAddress,
      contact_timings: contactTimings,
      contact_timings_note: contactTimingsNote,
      contact_phone1: contactPhone1,
      contact_phone2: contactPhone2,
      contact_email1: contactEmail1,
      contact_email2: contactEmail2,
      contact_map_query: contactMapQuery,
      zonal_features: JSON.stringify(zonalFeatures),
      zonal_features_header: zonalFeaturesHeader,
      zonal_features_desc: zonalFeaturesDesc,
      show_company_slider: showCompanySlider,
      company_slider_title: companySliderTitle,
      company_slider_desc: companySliderDesc
    });
    if (success) {
      setBrandingSaved(true);
      alert("Branding settings saved and updated successfully!");
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
      ? `${import.meta.env.VITE_API_URL || ''}/api/committee/${committeeEditId}`
      : `${import.meta.env.VITE_API_URL || ''}/api/committee`;
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
          await fetch(`${import.meta.env.VITE_API_URL || ''}/api/committee/${id}`, { method: 'DELETE' });
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
      ? `${import.meta.env.VITE_API_URL || ''}/api/directors/${directorEditId}`
      : `${import.meta.env.VITE_API_URL || ''}/api/directors`;
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
          await fetch(`${import.meta.env.VITE_API_URL || ''}/api/directors/${id}`, { method: 'DELETE' });
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
    const url = hodEditId ? `${import.meta.env.VITE_API_URL || ''}/api/hods/` + hodEditId : `${import.meta.env.VITE_API_URL || ''}/api/hods`;
    const method = hodEditId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(hodForm) });
      if (res.ok) {
        setHodSaved(true);
        setHodEditId(null);
        setHodForm({ name: "", designation: "", photo_url: "", college_name: "", college_address: "", mobile_number: "", email: "", message: "", sort_order: 0, profile_pdf_url: null, profile_pdf_name: null });
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/hods`).then(r => r.ok ? r.json() : []).then(data => setAllHods(data));
        setTimeout(() => setHodSaved(false), 3000);
      }
    } catch (e) { alert("Failed to save HOD entry."); }
  };

  const handleHodDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, message: "Are you sure you want to delete this HOD entry?", onConfirm: async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || ''}/api/hods/` + id, { method: "DELETE" });
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/hods`).then(r => r.ok ? r.json() : []).then(data => setAllHods(data));
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/verify-user`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`, {
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
        const refreshedRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            alert("Event deleted successfully.");
            // Refresh events list
            const refreshedRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/events`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsTitle,
          description: newsDesc,
          date: newsDate,
          image_url: newsImg,
          file_url: newsFileUrl,
          file_name: newsFileName
        })
      });
      if (res.ok) {
        setNewsCreated(true);
        setNewsTitle('');
        setNewsDesc('');
        setNewsDate('');
        setNewsImg('');
        setNewsFileUrl(null);
        setNewsFileName(null);
        // Refresh news list
        const refreshedRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/news`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/news/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            alert("Notice deleted successfully.");
            // Refresh news list
            const refreshedRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/news`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${selectedAboutPageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aboutPageTitle,
          content: aboutPageContent,
          file_url: aboutPageFileUrl,
          file_name: aboutPageFileName,
          parent_menu: aboutPageParentMenu,
          menu_type: aboutPageMenuType
        })
      });
      if (res.ok) {
        setAboutPageSaved(true);
        // Refresh pages list
        const cpRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages`);
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

  const handleNewPageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewPageFileUrl(reader.result as string);
      setNewPageFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageId || !newPageTitle) {
      alert("Page ID/Slug and Title are required.");
      return;
    }
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(newPageId)) {
      alert("Page ID/Slug can only contain alphanumeric characters, hyphens, and underscores.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newPageId,
          title: newPageTitle,
          content: newPageContent,
          parent_menu: newPageParentMenu,
          menu_type: newPageMenuType,
          file_url: newPageFileUrl,
          file_name: newPageFileName
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Custom page created successfully!");
        setNewPageId('');
        setNewPageTitle('');
        setNewPageContent('');
        setNewPageParentMenu('about');
        setNewPageMenuType('child');
        setNewPageFileUrl(null);
        setNewPageFileName(null);
        setIsCreatingPage(false);

        // Refresh dynamic page listing
        const cpRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages`);
        const cpData = await cpRes.json();
        if (cpRes.ok) {
          setAllAboutPages(cpData);
          setSelectedAboutPageId(newPageId); // switch to the new page
        }
      } else {
        alert(data.error || "Failed to create new page.");
      }
    } catch (err) {
      alert("Connection failed.");
    }
  };

  const handleDeletePage = (pageId: string) => {
    const isBasePage = ['about_us', 'committee', 'director', 'circulars', 'news_notices', 'souvenirs', 'calendar', 'draws', 'results', 'courses', 'admission', 'syllabus', 'academic_results'].includes(pageId);
    if (isBasePage) {
      alert("This is a system default page and cannot be deleted.");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete the custom page "${pageId}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages/${pageId}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            // Refresh pages
            const cpRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/custom-pages`);
            const cpData = await cpRes.json();
            if (cpRes.ok) {
              setAllAboutPages(cpData);
              setSelectedAboutPageId('about_us');
            }
          } else {
            alert("Failed to delete page.");
          }
        } catch (err) {
          alert("Connection failed.");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
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
      const url = isEdit ? `${import.meta.env.VITE_API_URL || ''}/api/slider/${slideEditId}` : `${import.meta.env.VITE_API_URL || ''}/api/slider`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slForm)
      });
      if (res.ok) {
        setSlSaved(true);
        resetSliderForm();
        const refreshed = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/slider`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/slider/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshed = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/slider`);
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
    const rRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/results`);
    const rData = rRes.ok ? await rRes.json() : [];
    setAllResults(rData);
  };

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setResCreated(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/results`, {
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/results/${id}`, { method: 'DELETE' });
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
    const url = courseEditId ? `${import.meta.env.VITE_API_URL || ''}/api/courses/${courseEditId}` : `${import.meta.env.VITE_API_URL || ''}/api/courses`;
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
        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/courses`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/courses/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/courses`);
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
      ? `${import.meta.env.VITE_API_URL || ''}/api/admissions/${admissionEditId}`
      : `${import.meta.env.VITE_API_URL || ''}/api/admissions`;
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
        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admissions`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admissions/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admissions`);
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
      ? `${import.meta.env.VITE_API_URL || ''}/api/admission-files/${fileForm.id}`
      : `${import.meta.env.VITE_API_URL || ''}/api/admission-files`;
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
        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admission-files`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admission-files/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admission-files`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs`, {
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
        const jRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs/${id}`, { method: 'DELETE' });
          if (res.ok) {
            // Refresh Job List
            const jRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs`);
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
    const url = spotEditId ? `${import.meta.env.VITE_API_URL || ''}/api/spotlights/${spotEditId}` : `${import.meta.env.VITE_API_URL || ''}/api/spotlights`;
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
        const rRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/spotlights`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/spotlights/${id}`, { method: 'DELETE' });
          if (res.ok) {
            // Refresh Spotlights
            const rRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/spotlights`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Refresh applications list
        const appsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs/applications`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/circulars`, {
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
        const circRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/circulars`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/circulars/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const circRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/circulars`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ncte-disclosures`, {
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
        const ncteRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ncte-disclosures`);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ncte-disclosures/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const ncteRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ncte-disclosures`);
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
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6">
              <ClipboardCheck className="w-6 h-6 text-primary" /> Verification Center
            </h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Validate graduation credentials, profile photos, uploaded resumes/CV files, and student enrollment records before unlocking portal features.
            </p>
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : pendingUsers.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-850">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Name / Role</th>
                      <th className="p-4">Roll Num / Grad</th>
                      <th className="p-4">Email / Mobile</th>
                      <th className="p-4">Dept / Course</th>
                      <th className="p-4 text-center">Action Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {pendingUsers.map((e) => {
                      const isExpanded = expandedUserId === e.id;
                      return (
                        <React.Fragment key={e.id}>
                          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all">
                            <td className="p-4 font-semibold">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0">
                                  <img
                                    src={e.photo_url || 'https://via.placeholder.com/150'}
                                    alt={e.full_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-slate-850 dark:text-white font-extrabold">{e.full_name}</p>
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    e.role === 'alumni' ? 'bg-indigo-150 text-indigo-705 dark:bg-indigo-950/45 dark:text-indigo-400' : 'bg-amber-150 text-amber-705 dark:bg-amber-950/45 dark:text-amber-400'
                                  }`}>
                                    {e.role}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-bold">
                              {e.roll_number || "N/A"} <br />
                              <span className="text-[10px] text-slate-450 font-semibold">Class of {e.grad_year}</span>
                            </td>
                            <td className="p-4 font-semibold">
                              <p className="text-slate-700 dark:text-slate-350">{e.email}</p>
                              <p className="text-slate-400 dark:text-slate-500 mt-0.5">{e.mobile || 'No Mobile'}</p>
                            </td>
                            <td className="p-4 font-semibold">
                              {e.department} <br />
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">{e.degree}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setExpandedUserId(isExpanded ? null : e.id)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-[10px] text-slate-650 dark:text-slate-300 cursor-pointer"
                                >
                                  {isExpanded ? 'Hide Details' : 'View Credentials'}
                                </button>
                                <button
                                  onClick={() => handleVerifyUser(e.id, "approved")}
                                  className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer"
                                  title="Approve Profile"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleVerifyUser(e.id, "rejected")}
                                  className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/30 hover:bg-rose-200 text-rose-700 dark:text-rose-450 transition-all cursor-pointer"
                                  title="Reject Profile"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded detail row */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-5 bg-slate-50/70 dark:bg-slate-900/35 border-t border-b border-slate-100 dark:border-slate-800 text-left">
                                <div className="flex flex-col sm:flex-row gap-6">
                                  {/* Left large avatar */}
                                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 mx-auto sm:mx-0">
                                    <img
                                      src={e.photo_url || 'https://via.placeholder.com/150'}
                                      alt={e.full_name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* Right Detailed Info */}
                                  <div className="flex-1 space-y-4 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-0.5">Email</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-250">{e.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">Mobile Number</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-250">{e.mobile || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">Department & Course</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-250">{e.department} ({e.degree})</p>
                                      </div>
                                    </div>

                                    {/* Student Specific Verification details */}
                                    {e.role === 'student' && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1.5">Resume / CV Document File</p>
                                          {e.resume_url ? (
                                            <div className="flex items-center gap-2">
                                              <FileText className="w-4 h-4 text-primary shrink-0" />
                                              <a
                                                href={e.resume_url.startsWith('data:') || e.resume_url.startsWith('http') ? e.resume_url : `https://${e.resume_url}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                download={e.resume_name || 'student-resume.pdf'}
                                                className="text-xs font-bold text-primary hover:underline truncate"
                                              >
                                                {e.resume_name ? `Download ${e.resume_name}` : 'Download Uploaded Resume'}
                                              </a>
                                            </div>
                                          ) : (
                                            <span className="text-[11px] font-medium text-slate-500">No Resume uploaded.</span>
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1">Career Interests</p>
                                          <div className="flex flex-wrap gap-1.5">
                                            {e.interests ? e.interests.split(',').map((interest: string, idx: number) => (
                                              <span key={idx} className="px-2 py-0.5 bg-primary/15 text-primary text-[10px] font-bold rounded-full">
                                                {interest.trim()}
                                              </span>
                                            )) : <span className="text-[11px] text-slate-500 font-medium">None specified</span>}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Alumni Specific Verification details */}
                                    {e.role === 'alumni' && (
                                      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">Current Company / Org</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-250">{e.company || 'N/A'}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">Designation Title</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-250">{e.designation || 'N/A'}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">LinkedIn Profile</p>
                                            <p className="font-bold text-primary truncate">
                                              {e.linkedin ? (
                                                <a href={e.linkedin.startsWith('http') ? e.linkedin : `https://${e.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                                                  {e.linkedin}
                                                </a>
                                              ) : 'N/A'}
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-1">Skills</p>
                                          <div className="flex flex-wrap gap-1.5">
                                            {e.skills ? e.skills.split(',').map((skill: string, idx: number) => (
                                              <span key={idx} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full">
                                                {skill.trim()}
                                              </span>
                                            )) : <span className="text-[11px] text-slate-500 font-medium">None listed</span>}
                                          </div>
                                        </div>
                                        {e.achievements && (
                                          <div>
                                            <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">Professional Achievements</p>
                                            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed break-words">{e.achievements}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-10 font-semibold">No pending profile authorizations currently in queue.</p>
            )}
          </div>
        )}

        {/* ── EVENTS-MANAGER TAB ── */}
        {activeSubTab === 'events-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-6"><PlusSquare className="w-6 h-6 text-primary" /> Create Event</h2>{eventCreated && <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">Event successfully added and published to target feeds!</div>}<form onSubmit={handleCreateEvent} className="space-y-4 text-xs"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Title</label><input type="text" required={!0} value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} placeholder="e.g. Annual Alumni Meet 2026" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Category</label><select value={evtType} onChange={(e) => setEvtType(e.target.value as any)} className="glass-input text-slate-500 font-semibold"><option value="Reunion">Reunion Gala</option><option value="Seminar">Seminar (Campus)</option><option value="Webinar">Webinar (Virtual)</option><option value="Networking">Networking Mixer</option></select></div></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label><RichTextEditor value={evtDesc} onChange={setEvtDesc} placeholder="Detail activities, speaker schedule, and guidelines..." /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</label><input type="date" required={!0} value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</label><input type="time" required={!0} value={evtTime} onChange={(e) => setEvtTime(e.target.value)} className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendee Capacity</label><input type="number" required={!0} value={evtCap} onChange={(e) => setEvtCap(e.target.value)} placeholder="250" className="glass-input" /></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location / Zoom Link</label><input type="text" required={!0} value={evtLoc} onChange={(e) => setEvtLoc(e.target.value)} placeholder="e.g. Auditorium / virtual link" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Image URL</label><input type="text" value={evtImg} onChange={(e) => setEvtImg(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="glass-input" /></div></div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md">Publish Event</button></form><div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6"><h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Active Events</h3>{allEvents.length > 0 ? <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-4">Date & Time</th><th className="p-4">Title</th><th className="p-4">Type & Location</th><th className="p-4 text-center">Capacity</th><th className="p-4 text-center">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{allEvents.map((e) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20"><td className="p-4 font-semibold whitespace-nowrap">{e.date} {e.time ? `at ${e.time}` : ""}</td><td className="p-4 font-bold text-slate-800 dark:text-white">{e.title}</td><td className="p-4"><span className="font-semibold">{e.type}</span> <br /><span className="text-slate-450 dark:text-slate-400">{e.location}</span></td><td className="p-4 text-center">{e.capacity}</td><td className="p-4 text-center"><button onClick={() => handleDeleteEvent(e.id)} className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold transition-all cursor-pointer">Delete</button></td></tr>)}</tbody></table></div> : <p className="text-slate-400 text-center py-6">No events currently scheduled.</p>}</div></div>
        )}

        {/* ── NEWS-MANAGER TAB ── */}
        {activeSubTab === 'news-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6"><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2"><Newspaper className="w-6 h-6 text-primary" /> Manage News & Notices</h2><p className="text-sm text-slate-500">Publish news announcements and notice boards which appear in the dynamic column on the Homepage.</p>{newsCreated && <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">Announcement published successfully to Homepage Notices feed!</div>}<form onSubmit={handleCreateNews} className="space-y-4 text-xs"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notice Title</label><input type="text" required={!0} value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="e.g. Annual Athletics Meet Schedule" className="glass-input font-semibold" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publish Date</label><input type="date" required={!0} value={newsDate} onChange={(e) => setNewsDate(e.target.value)} className="glass-input" /></div></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notice Description</label><RichTextEditor value={newsDesc} onChange={setNewsDesc} placeholder="Provide detailed description of the sports tournament, circular guidelines..." /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image Banner URL (Optional)</label><input type="text" value={newsImg} onChange={(e) => setNewsImg(e.target.value)} placeholder="https://images.unsplash.com/..." className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload PDF / JPG / Document Attachment (Optional)</label><input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" onChange={(e) => {const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setNewsFileUrl(reader.result as string); setNewsFileName(file.name); }; reader.readAsDataURL(file); } }} className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer text-[11px] w-full" />{newsFileName && <div className="flex items-center gap-1.5 mt-1"><span className="text-[10px] text-emerald-600 font-bold">Selected attachment: {newsFileName}</span><button type="button" onClick={() => { setNewsFileUrl(null); setNewsFileName(null); }} className="text-rose-500 hover:text-rose-650 font-bold text-[10px] shrink-0 cursor-pointer ml-1">Clear</button></div>}</div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md cursor-pointer">Publish Announcement</button></form><div className="border-t border-slate-100 dark:border-slate-800 my-6 pt-6"><h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Active Notices & Announcements</h3>{allNews.length > 0 ? <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-4">Publish Date</th><th className="p-4">Title</th><th className="p-4">Description Preview</th><th className="p-4 text-center">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{allNews.map((e) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20"><td className="p-4 font-semibold whitespace-nowrap">{e.date}</td><td className="p-4 font-bold text-slate-800 dark:text-white">{e.title}</td><td className="p-4 truncate max-w-xs">{e.description}</td><td className="p-4 text-center"><button onClick={() => handleDeleteNews(e.id)} className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold transition-all cursor-pointer">Delete</button></td></tr>)}</tbody></table></div> : <p className="text-slate-400 text-center py-6">No announcements currently published.</p>}</div></div>
        )}

        {/* ── COMMITTEE-MANAGER TAB ── */}
        {activeSubTab === 'committee-manager' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6"><div><h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> Committee Manager</h2><p className="text-sm text-slate-500 mt-1">Add, edit, or remove committee members. Changes appear live on the public <strong>Committee</strong> page.</p></div>{cmSaved && <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2"><Check className="w-4 h-4" /> Committee member saved successfully!</div>}<form onSubmit={handleCommitteeSave} className="space-y-4 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-950/20"><div className="flex items-center justify-between mb-1"><h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">{committeeEditId ? "✏️ Edit Member" : "➕ Add New Member"}</h3>{committeeEditId && <button type="button" onClick={() => {setCommitteeEditId(null),setCmForm({name:``,designation:``,photo_url:``,college_name:``,college_address:``,contact_details:``,sort_order:0,profile_pdf_url:null,profile_pdf_name:null})}} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors">Cancel Edit</button>}</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"><div className="space-y-3"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label><input type="text" required={!0} value={cmForm.name} onChange={(e) => setCmForm((t) => ({ ...t, name: e.target.value }))} placeholder="e.g. Dr. Rajendra Patil" className="glass-input font-semibold" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation *</label><input type="text" required={!0} value={cmForm.designation} onChange={(e) => setCmForm((t) => ({ ...t, designation: e.target.value }))} placeholder="e.g. Chairman / Secretary" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College / Institution Name</label><input type="text" value={cmForm.college_name} onChange={(e) => setCmForm((t) => ({ ...t, college_name: e.target.value }))} placeholder="e.g. Fergusson College, Pune" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College Address</label><input type="text" value={cmForm.college_address} onChange={(e) => setCmForm((t) => ({ ...t, college_address: e.target.value }))} placeholder="e.g. FC Road, Shivajinagar, Pune - 411004" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Details</label><input type="text" value={cmForm.contact_details} onChange={(e) => setCmForm((t) => ({ ...t, contact_details: e.target.value }))} placeholder="e.g. +91 98765 43210 | email@example.com" className="glass-input" /></div><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label><input type="number" min={0} value={cmForm.sort_order} onChange={(e) => setCmForm((t) => ({ ...t, sort_order: parseInt(e.target.value) || 0 }))} className="glass-input w-24" /><span className="text-[9px] text-slate-400">Lower number = appears first</span></div></div><div className="flex flex-col gap-3"><div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo URL</label><input type="text" value={cmForm.photo_url} onChange={(e) => setCmForm((t) => ({ ...t, photo_url: e.target.value }))} placeholder="https://... or leave blank to upload below" className="glass-input" /></div><div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Upload Photo</span><input type="file" accept="image/*" onChange={(e) => {let t=e.target.files?.[0];if(t){let e=new FileReader;e.onload=()=>setCmForm(t=>({...t,photo_url:e.result as string})),e.readAsDataURL(t)}}} className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer" /><div className="w-24 h-24 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">{cmForm.photo_url ? <img src={cmForm.photo_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => {e.currentTarget.style.display=`none`}} /> : <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />}</div><span className="text-[9px] text-slate-400 text-center">Photo will be converted to Base64 and stored.</span></div><div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl flex flex-col gap-3 items-center"><span className="text-[10px] text-slate-400 font-bold uppercase">Upload Profile PDF</span><input type="file" accept="application/pdf" onChange={(e) => {let t=e.target.files?.[0];if(t){let e=new FileReader;e.onload=()=>setCmForm(n=>({...n,profile_pdf_url:e.result as string,profile_pdf_name:t.name})),e.readAsDataURL(t)}}} className="glass-input text-[10px] file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer" />{cmForm.profile_pdf_name && <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /> {cmForm.profile_pdf_name}<button type="button" onClick={() => setCmForm((e) => ({ ...e, profile_pdf_url: null, profile_pdf_name: null }))} className="text-rose-500 hover:text-rose-750 ml-1 font-bold cursor-pointer">Clear</button></div>}<span className="text-[9px] text-slate-400 text-center">PDF will be converted to Base64 and stored.</span></div></div></div><button type="submit" className="btn-primary text-xs font-bold py-3 px-8 shadow-md"><Save className="w-4 h-4 mr-2 inline-block" />{committeeEditId ? "Save Changes" : "Add Member"}</button></form><div><h3 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Current Members ({allCommittee.length})</h3>{allCommittee.length === 0 ? <p className="text-slate-400 text-center py-8 text-sm">No committee members added yet.</p> : <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider"><tr><th className="p-3">#</th><th className="p-3">Photo</th><th className="p-3">Name / Role</th><th className="p-3">College</th><th className="p-3">Contact</th><th className="p-3">Profile</th><th className="p-3 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{allCommittee.map((e, t) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"><td className="p-3 text-slate-400 font-bold">{t + 1}</td><td className="p-3"><div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><AdminCommitteeMemberPhoto src={e.photo_url} alt={e.name} /></div></td><td className="p-3"><p className="font-bold text-slate-800 dark:text-white">{e.name}</p><p className="text-[10px] text-primary font-semibold mt-0.5">{e.designation}</p></td><td className="p-3"><p className="font-semibold">{e.college_name || "—"}</p><p className="text-[10px] text-slate-400 mt-0.5">{e.college_address || ""}</p></td><td className="p-3 text-slate-500 max-w-[180px]"><span className="break-words">{e.contact_details || "—"}</span></td><td className="p-3">{e.profile_pdf_url ? <a href={e.profile_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all w-fit"><FileText className="w-3.5 h-3.5" /> PDF</a> : <span className="text-[9px] text-slate-400 italic">None</span>}</td><td className="p-3"><div className="flex items-center justify-center gap-2"><button onClick={() => handleCommitteeEdit(e)} className="p-2 rounded-xl bg-primary-light dark:bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all" title="Edit Member"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleCommitteeDelete(e.id)} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all" title="Delete Member"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>)}</tbody></table></div>}</div></div>
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

        {/* ── MENU-MANAGER TAB ── */}
        {activeSubTab === 'menu-manager' && (
          <MenuNavigationManager
            allPages={allAboutPages}
            onRefresh={fetchData}
            setConfirmDialog={setConfirmDialog}
          />
        )}

        {/* ── ABOUT-MANAGER TAB ── */}
        {activeSubTab === 'about-manager' && (
          <StaticPagesManager
            parentMenuFilter="about"
            title="Manage Static pages"
            description="Manage static subpages displayed under the About menu dropdown."
            allPages={allAboutPages}
            onRefresh={fetchData}
            setConfirmDialog={setConfirmDialog}
          />
        )}

        {/* ── ACADEMIC-PAGES-MANAGER TAB ── */}
        {activeSubTab === 'academic-pages-manager' && (
          <StaticPagesManager
            parentMenuFilter="academic"
            title="Manage Academic Pages"
            description="Manage custom static pages and disclosures displayed under the Academic dropdown menu."
            allPages={allAboutPages}
            onRefresh={fetchData}
            setConfirmDialog={setConfirmDialog}
          />
        )}

        {/* ── STUDENT-PAGES-MANAGER TAB ── */}
        {activeSubTab === 'student-pages-manager' && (
          <StaticPagesManager
            parentMenuFilter="student"
            title="Manage Student Pages"
            description="Manage custom static pages displayed under the Student Corner menu dropdown."
            allPages={allAboutPages}
            onRefresh={fetchData}
            setConfirmDialog={setConfirmDialog}
          />
        )}

        {/* ── STANDALONE-PAGES-MANAGER TAB ── */}
        {activeSubTab === 'standalone-pages-manager' && (
          <StaticPagesManager
            parentMenuFilter="none"
            title="Manage Independent Pages"
            description="Manage custom standalone pages that exist independently on the portal."
            allPages={allAboutPages}
            onRefresh={fetchData}
            setConfirmDialog={setConfirmDialog}
          />
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

        {/* 🖼️ GALLERY MANAGER TAB */}
        {activeSubTab === 'gallery-manager' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Image className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Photo Gallery Manager</h2>
                    <p className="text-xs text-slate-400 font-medium">{allGallery.length} photos across all categories</p>
                  </div>
                </div>
                {gallerySaved && (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
                    <Check className="w-4 h-4" /> Photo saved successfully!
                  </div>
                )}
              </div>

              {/* Add / Edit Form */}
              <form onSubmit={handleGallerySave} className="space-y-5 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-5 bg-slate-50/60 dark:bg-slate-800/20">
                <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  {galleryEditId ? '✏️ Edit Photo' : '📤 Upload New Photo'}
                </h3>

                {/* Image upload + preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Photo *</label>
                    {galleryForm.image_url ? (
                      <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square bg-slate-100">
                        <img src={galleryForm.image_url} alt="Preview" className="w-full h-full object-cover" onError={() => setGalleryForm(f => ({ ...f, image_url: '' }))} />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all gap-2">
                          <label className="cursor-pointer text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all">
                            Change
                            <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
                          </label>
                          <button type="button" onClick={() => setGalleryForm(f => ({ ...f, image_url: '' }))} className="text-white text-xs font-bold bg-rose-500/70 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-all">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                        <Image className="w-10 h-10 text-slate-300 dark:text-slate-600 group-hover:text-primary/50 transition-colors mb-2" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">Click to upload</span>
                        <span className="text-[10px] text-slate-300 mt-0.5">JPG, PNG, WebP</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
                      </label>
                    )}
                    <div className="mt-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">— or paste URL —</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={galleryForm.image_url.startsWith('data:') ? '' : galleryForm.image_url}
                        onChange={e => setGalleryForm(f => ({ ...f, image_url: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Title *</label>
                        <input
                          required
                          type="text"
                          placeholder="Photo title..."
                          value={galleryForm.title}
                          onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category *</label>
                        <select
                          value={galleryForm.category}
                          onChange={e => setGalleryForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {['Events', 'Sports', 'Cultural', 'Campus', 'Academic', 'Alumni', 'Infrastructure', 'General'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Brief description of the photo..."
                        value={galleryForm.description}
                        onChange={e => setGalleryForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Photographer</label>
                        <input
                          type="text"
                          placeholder="Name..."
                          value={galleryForm.photographer}
                          onChange={e => setGalleryForm(f => ({ ...f, photographer: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Location</label>
                        <input
                          type="text"
                          placeholder="Venue / place..."
                          value={galleryForm.location}
                          onChange={e => setGalleryForm(f => ({ ...f, location: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                        <input
                          type="date"
                          value={galleryForm.date}
                          onChange={e => setGalleryForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                  <button type="submit" className="btn-primary text-xs font-bold py-2.5 px-6 justify-center gap-1.5 cursor-pointer flex items-center">
                    <Save className="w-4 h-4" />
                    {galleryEditId ? 'Save Changes' : 'Upload Photo'}
                  </button>
                  {galleryEditId && (
                    <button type="button" onClick={resetGalleryForm} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-rose-500 hover:border-rose-300 transition-all flex items-center gap-1.5">
                      <X className="w-4 h-4" /> Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Gallery Grid */}
            <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6">
              {/* Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-black text-slate-700 dark:text-slate-300 text-base flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" /> All Photos ({allGallery.length})
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Events', 'Sports', 'Cultural', 'Campus', 'Academic', 'Alumni', 'Infrastructure', 'General'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setGalleryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        galleryFilter === cat
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {cat}
                      {cat !== 'All' && <span className="ml-1 opacity-60">({allGallery.filter(p => p.category === cat).length})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos Grid */}
              {(galleryFilter === 'All' ? allGallery : allGallery.filter(p => p.category === galleryFilter)).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Image className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No photos in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {(galleryFilter === 'All' ? allGallery : allGallery.filter(p => p.category === galleryFilter)).map((photo: any) => (
                    <div key={photo.id} className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${galleryEditId === photo.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-slate-200/50 dark:border-slate-700/40 hover:border-primary/40'}`}>
                      <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {photo.image_url ? (
                          <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Image className="w-8 h-8 text-slate-300" /></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2.5">
                        <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight mb-2">{photo.title}</p>
                        <span className="inline-block text-[8px] font-extrabold uppercase tracking-wider bg-primary/80 text-white px-1.5 py-0.5 rounded-full mb-2 w-fit">{photo.category}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleGalleryEdit(photo)}
                            className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition-all"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleGalleryDelete(photo.id)}
                            className="flex items-center justify-center p-1 rounded-lg bg-rose-500/70 hover:bg-rose-500 text-white transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {galleryEditId === photo.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Edit3 className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🎓 PLACEMENT MANAGER TAB */}
        {activeSubTab === 'placement-manager' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Placement Manager</h2>
                  <p className="text-xs text-slate-400 font-medium">Manage placement page content and recruiter logos</p>
                </div>
              </div>

              {/* Inner sub-tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                {(['content', 'companies'] as const).map(tab => (
                  <button key={tab} onClick={() => setPlacementTab(tab)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${placementTab === tab ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-primary'}`}>
                    {tab === 'content' ? '📝 Page Content' : '🏢 Recruiters'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Content Editor Tab ── */}
            {placementTab === 'content' && (
              <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Placement Page Content
                  </h3>
                  {placementContentSaved && (
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl">
                      <Check className="w-3.5 h-3.5" /> Saved successfully!
                    </span>
                  )}
                </div>

                <form onSubmit={handlePlacementContentSave} className="space-y-5">
                  {/* Hero fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Hero Title</label>
                      <input type="text" value={placementContent.hero_title}
                        onChange={e => setPlacementContent((p: any) => ({ ...p, hero_title: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Hero Subtitle</label>
                      <input type="text" value={placementContent.hero_subtitle}
                        onChange={e => setPlacementContent((p: any) => ({ ...p, hero_subtitle: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-4 bg-slate-50/60 dark:bg-slate-800/20">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-primary" /> Placement Statistics</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Students Placed', key: 'stat_placed', type: 'number' },
                        { label: 'Companies', key: 'stat_companies', type: 'number' },
                        { label: 'Avg Package', key: 'stat_package_avg', type: 'text' },
                        { label: 'Highest Package', key: 'stat_package_highest', type: 'text' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{field.label}</label>
                          <input type={field.type} value={(placementContent as any)[field.key]}
                            onChange={e => setPlacementContent((p: any) => ({ ...p, [field.key]: e.target.value }))}
                            placeholder={field.type === 'text' ? 'e.g. 12 LPA' : '0'}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rich text content */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Page Content (Rich Text)</label>
                    <RichTextEditor
                      value={placementContent.content}
                      onChange={(val: string) => setPlacementContent((p: any) => ({ ...p, content: val }))}
                    />
                  </div>

                  <button type="submit" className="btn-primary text-xs font-bold py-2.5 px-8 justify-center gap-1.5 cursor-pointer flex items-center">
                    <Save className="w-4 h-4" /> Save Placement Content
                  </button>
                </form>
              </div>
            )}

            {/* ── Recruiters/Companies Tab ── */}
            {placementTab === 'companies' && (
              <div className="space-y-5">
                {/* Add / Edit Company Form */}
                <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <Plus className="w-4 h-4 text-primary" />
                      {companyEditId ? '✏️ Edit Recruiter' : '➕ Add Recruiter Company'}
                    </h3>
                    {companySaved && (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl">
                        <Check className="w-3.5 h-3.5" /> Saved!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleCompanySave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Logo upload & preview */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Logo</label>
                        {companyForm.logo_url ? (
                          <div className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                            <img src={companyForm.logo_url} alt="logo" className="w-full h-full object-contain p-3"
                              onError={() => setCompanyForm(f => ({ ...f, logo_url: '' }))} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                              <label className="cursor-pointer text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg">
                                Change <input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} />
                              </label>
                              <button type="button" onClick={() => setCompanyForm(f => ({ ...f, logo_url: '' }))} className="text-white text-xs font-bold bg-rose-500/70 hover:bg-rose-500 px-3 py-1.5 rounded-lg">Remove</button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group bg-slate-50 dark:bg-slate-900">
                            <Building2 className="w-8 h-8 text-slate-300 group-hover:text-primary/50 transition-colors mb-1" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-primary">Upload Logo</span>
                            <span className="text-[10px] text-slate-300 mt-0.5">PNG, SVG, JPG</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} />
                          </label>
                        )}
                        <div className="mt-2">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">— or paste logo URL —</label>
                          <input type="url" placeholder="https://..."
                            value={companyForm.logo_url.startsWith('data:') ? '' : companyForm.logo_url}
                            onChange={e => setCompanyForm(f => ({ ...f, logo_url: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>

                      {/* Name, website, sort */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name *</label>
                          <input required type="text" placeholder="e.g. TCS, Infosys..."
                            value={companyForm.name}
                            onChange={e => setCompanyForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Website</label>
                          <input type="url" placeholder="https://company.com"
                            value={companyForm.website}
                            onChange={e => setCompanyForm(f => ({ ...f, website: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                          <input type="number" placeholder="0" value={companyForm.sort_order}
                            onChange={e => setCompanyForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                            className="w-32 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                      <button type="submit" className="btn-primary text-xs font-bold py-2.5 px-6 justify-center gap-1.5 cursor-pointer flex items-center">
                        <Save className="w-4 h-4" /> {companyEditId ? 'Save Changes' : 'Add Company'}
                      </button>
                      {companyEditId && (
                        <button type="button" onClick={() => { setCompanyEditId(null); setCompanyForm({ name: '', logo_url: '', website: '', sort_order: 0 }); }}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-rose-500 hover:border-rose-300 transition-all flex items-center gap-1.5">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Companies Grid */}
                <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6">
                  <h3 className="font-black text-slate-700 dark:text-slate-300 text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Recruiter Companies ({allCompanies.length})
                  </h3>

                  {allCompanies.length === 0 ? (
                    <div className="flex flex-col items-center py-12 gap-3 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">No recruiter companies added yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {allCompanies.map((company: any) => (
                        <div key={company.id}
                          className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-slate-800 ${companyEditId === company.id ? 'border-primary shadow-lg shadow-primary/15' : 'border-slate-100 dark:border-slate-700 hover:border-primary/30'}`}>
                          {/* Logo */}
                          <div className="aspect-video flex items-center justify-center p-3 bg-white dark:bg-slate-900">
                            {company.logo_url ? (
                              <img src={company.logo_url} alt={company.name} className="max-w-full max-h-full object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                <span className="text-white font-black text-sm">{company.name.slice(0, 2).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                          {/* Name & actions */}
                          <div className="p-2.5 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate text-center mb-2">{company.name}</p>
                            <div className="flex gap-1.5">
                              <button onClick={() => handleCompanyEdit(company)}
                                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button onClick={() => handleCompanyDelete(company.id)}
                                className="flex items-center justify-center p-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {companyEditId === company.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
                              <Edit3 className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" /> Home/Branding Settings
              </h2>
              <button 
                onClick={() => {
                  const formEl = document.getElementById('branding-settings-form') as HTMLFormElement;
                  if (formEl) {
                    formEl.requestSubmit();
                  }
                }}
                className="btn-primary text-xs font-bold py-2.5 px-6 shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Save className="w-4 h-4 text-slate-900" /> Save Branding Changes
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Change the university logo, name, and color theme preset dynamically across the entire app interface.
            </p>

            {brandingSaved && (
              <div className="bg-emerald-50 text-emerald-600 rounded-xl p-3 text-xs mb-4">
                Branding variables saved! Colors and headers updated dynamically in real-time.
              </div>
            )}

            <form id="branding-settings-form" onSubmit={handleBrandingSave} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College/University Name</label>
                    <input
                      type="text"
                      required
                      value={univName}
                      onChange={e => setUnivName(e.target.value)}
                      className="glass-input font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">University Sub-Tagline (Header Subtitle)</label>
                    <input
                      type="text"
                      value={univTagline}
                      onChange={e => setUnivTagline(e.target.value)}
                      placeholder="e.g. Autonomous Institution | Approved by AICTE"
                      className="glass-input font-medium"
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
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="showMainHeader"
                      checked={showMainHeader === 1}
                      onChange={e => setShowMainHeader(e.target.checked ? 1 : 0)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                    />
                    <label htmlFor="showMainHeader" className="font-bold text-slate-700 dark:text-slate-250 cursor-pointer select-none text-[11px]">
                      Enable Main Logo & Accreditation Header Row (Tier 2 Layout)
                    </label>
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

                {/* Accreditation & Recognition Badges Manager */}
                {showMainHeader === 1 && (
                  <div className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 rounded-2xl space-y-4 md:col-span-2 text-left">
                    <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-primary" /> Accreditation & Certification Badges Manager (Tier 2 Row)
                    </h4>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-relaxed">
                      Customize the text labels and upload official accreditation emblems (such as NAAC, NBA, NIRF, and UGC/Autonomous). Uploaded files will be encoded and stored.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {accreditationLogos.map((badge, idx) => (
                        <div key={badge.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-end items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove the "${badge.title}" badge?`)) {
                                  setAccreditationLogos(accreditationLogos.filter(b => b.id !== badge.id));
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 font-bold text-[9px] uppercase"
                              title="Delete this accreditation badge"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Badge
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Badge Title</label>
                              <input
                                type="text"
                                value={badge.title}
                                onChange={e => {
                                  const updated = [...accreditationLogos];
                                  updated[idx].title = e.target.value;
                                  setAccreditationLogos(updated);
                                }}
                                className="glass-input text-[11px] font-bold"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subtitle Info</label>
                              <input
                                type="text"
                                value={badge.subtitle}
                                onChange={e => {
                                  const updated = [...accreditationLogos];
                                  updated[idx].subtitle = e.target.value;
                                  setAccreditationLogos(updated);
                                }}
                                className="glass-input text-[11px] font-semibold"
                              />
                            </div>
                          </div>

                          {/* Image Upload/URL Facility */}
                          <div className="flex items-center gap-3 mt-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850">
                            
                            <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                              {badge.image_url ? (
                                <img 
                                  src={badge.image_url} 
                                  alt={badge.title} 
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-[8px] text-slate-400 font-bold uppercase">No Image</span>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col gap-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const updated = [...accreditationLogos];
                                      updated[idx].image_url = reader.result as string;
                                      setAccreditationLogos(updated);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="text-[9px] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer w-full"
                              />
                              <input
                                type="text"
                                placeholder="Or paste URL"
                                value={badge.image_url}
                                onChange={e => {
                                  const updated = [...accreditationLogos];
                                  updated[idx].image_url = e.target.value;
                                  setAccreditationLogos(updated);
                                }}
                                className="glass-input text-[9px] h-6 py-0 px-2 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const id = prompt("Enter a unique lower-case ID for the new badge (e.g. naac, nba, custom):");
                          if (!id) return;
                          const title = prompt("Enter badge title (e.g. NAAC A++):");
                          if (!title) return;
                          const subtitle = prompt("Enter subtitle (e.g. Accredited Grade):");
                          if (!subtitle) return;
                          setAccreditationLogos([
                            ...accreditationLogos,
                            { id: id.toLowerCase().trim(), title, subtitle, image_url: '' }
                          ]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-slate-900 font-bold hover:bg-primary-dark transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add New Badge
                      </button>
                    </div>
                  </div>
                )}
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

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-6 pt-6" />

              {/* Customizable Top Header Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" /> Customizable Top Header Bar
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Configure the visibility, contact details, socials, background, and quick link portals in the top utility bar.</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
                  <input
                    type="checkbox"
                    id="showTopHeader"
                    checked={showTopHeader === 1}
                    onChange={e => setShowTopHeader(e.target.checked ? 1 : 0)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                  />
                  <label htmlFor="showTopHeader" className="font-bold text-slate-700 dark:text-slate-250 cursor-pointer select-none">
                    Enable Top Utility Header Bar
                  </label>
                </div>

                {showTopHeader === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Header Phone</label>
                        <input
                          type="text"
                          value={topHeaderPhone}
                          onChange={e => setTopHeaderPhone(e.target.value)}
                          placeholder="e.g. +953 012 3654 896"
                          className="glass-input font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Header Email</label>
                        <input
                          type="email"
                          value={topHeaderEmail}
                          onChange={e => setTopHeaderEmail(e.target.value)}
                          placeholder="e.g. support@apex.edu"
                          className="glass-input font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Header Background Color Hex</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={topHeaderBgColor}
                            onChange={e => setTopHeaderBgColor(e.target.value)}
                            className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden cursor-pointer"
                          />
                          <input
                            type="text"
                            value={topHeaderBgColor}
                            onChange={e => setTopHeaderBgColor(e.target.value)}
                            className="glass-input flex-1 font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Header Text Color Hex</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={topHeaderTextColor}
                            onChange={e => setTopHeaderTextColor(e.target.value)}
                            className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden cursor-pointer"
                          />
                          <input
                            type="text"
                            value={topHeaderTextColor}
                            onChange={e => setTopHeaderTextColor(e.target.value)}
                            className="glass-input flex-1 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social links URLs */}
                    <div className="p-5 border border-slate-200 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/10 rounded-2xl space-y-4">
                      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-350">Social Media Profile Links</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Facebook URL</label>
                          <input
                            type="text" value={socialFacebook}
                            onChange={e => setSocialFacebook(e.target.value)}
                            placeholder="#" className="glass-input font-medium"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Twitter/X URL</label>
                          <input
                            type="text" value={socialTwitter}
                            onChange={e => setSocialTwitter(e.target.value)}
                            placeholder="#" className="glass-input font-medium"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
                          <input
                            type="text" value={socialLinkedin}
                            onChange={e => setSocialLinkedin(e.target.value)}
                            placeholder="#" className="glass-input font-medium"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Instagram URL</label>
                          <input
                            type="text" value={socialInstagram}
                            onChange={e => setSocialInstagram(e.target.value)}
                            placeholder="#" className="glass-input font-medium"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">YouTube URL</label>
                          <input
                            type="text" value={socialYoutube}
                            onChange={e => setSocialYoutube(e.target.value)}
                            placeholder="#" className="glass-input font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick links Dynamic Builder */}
                    <div className="p-5 border border-slate-200 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/10 rounded-2xl space-y-4">
                      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-350">Quick Utility Portals & Login Links</h4>
                      
                      {/* Active Quick Links list */}
                      <div className="space-y-2">
                        {topHeaderLinks.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No custom quick links added yet. Add one below.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2 text-left">
                            {topHeaderLinks.map((link, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-1.5 px-3 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-sm">
                                <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-350">{link.label}</span>
                                <span className="text-[9px] text-slate-450 font-semibold truncate max-w-[120px] font-mono">({link.url})</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopHeaderLinks(links => links.filter((_, i) => i !== idx));
                                  }}
                                  className="text-rose-500 hover:text-rose-700 font-bold text-xs cursor-pointer ml-1"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add new link form */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pt-2 border-t border-slate-200/50 dark:border-slate-850/50">
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Link Display Label</label>
                          <input
                            type="text" value={newLinkLabel}
                            onChange={e => setNewLinkLabel(e.target.value)}
                            placeholder="e.g. MOODLE LOGIN"
                            className="glass-input font-bold"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Destination URL</label>
                          <input
                            type="text" value={newLinkUrl}
                            onChange={e => setNewLinkUrl(e.target.value)}
                            placeholder="e.g. https://moodle.college.edu"
                            className="glass-input font-medium"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newLinkLabel || !newLinkUrl) {
                              alert("Please fill in both the display label and URL destination.");
                              return;
                            }
                            setTopHeaderLinks([...topHeaderLinks, { label: newLinkLabel.toUpperCase(), url: newLinkUrl }]);
                            setNewLinkLabel('');
                            setNewLinkUrl('');
                          }}
                          className="btn-primary text-[10px] font-black tracking-wider uppercase py-2.5 px-4 h-[34px] flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-6 pt-6" />

              {/* Customizable Contact Us Section */}
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> Contact Us Page Configurator
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Configure the official address, timings, phones, emails, and map coordinates displayed on the public Contact Us page.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Intro Paragraph</label>
                    <textarea
                      rows={3}
                      value={contactIntro}
                      onChange={e => setContactIntro(e.target.value)}
                      placeholder="e.g. We Department of Sports & Physical Education always ready to provide the information..."
                      className="glass-input font-medium resize-none text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Postal Address</label>
                      <textarea
                        rows={5}
                        value={contactAddress}
                        onChange={e => setContactAddress(e.target.value)}
                        placeholder="e.g. Department of Sports & Physical Education, Savitribai Phule Pune University..."
                        className="glass-input font-medium font-mono text-[11px] leading-normal"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Office Timings</label>
                        <input
                          type="text"
                          value={contactTimings}
                          onChange={e => setContactTimings(e.target.value)}
                          placeholder="e.g. 10:30 am to 06:00 pm"
                          className="glass-input font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timings Holiday Notice / Important Note</label>
                        <input
                          type="text"
                          value={contactTimingsNote}
                          onChange={e => setContactTimingsNote(e.target.value)}
                          placeholder="e.g. The University office has holidays on the 1st and the 3rd Saturday..."
                          className="glass-input font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telephone Number 1</label>
                        <input
                          type="text"
                          value={contactPhone1}
                          onChange={e => setContactPhone1(e.target.value)}
                          placeholder="e.g. +91 - 20 - 25622428"
                          className="glass-input font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telephone Number 2 (Optional)</label>
                        <input
                          type="text"
                          value={contactPhone2}
                          onChange={e => setContactPhone2(e.target.value)}
                          placeholder="e.g. +91 - 20 - 25622429"
                          className="glass-input font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Email Address</label>
                        <input
                          type="text"
                          value={contactEmail1}
                          onChange={e => setContactEmail1(e.target.value)}
                          placeholder="e.g. dpe@unipune.ac.in"
                          className="glass-input"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secondary/Admin Email Address</label>
                        <input
                          type="text"
                          value={contactEmail2}
                          onChange={e => setContactEmail2(e.target.value)}
                          placeholder="e.g. dpeadmin@unipune.ac.in"
                          className="glass-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Google Maps Search Query / Coordinates</label>
                    <input
                      type="text"
                      value={contactMapQuery}
                      onChange={e => setContactMapQuery(e.target.value)}
                      placeholder="e.g. Savitribai Phule Pune University, Pune"
                      className="glass-input font-medium"
                    />
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Enter the place name or coordinates to automatically center the interactive Google Map.</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-6 pt-6" />

              {/* Core Zonal Features Configurator */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" /> Core Zonal Features Grid Content
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Section Title / Header</label>
                    <input
                      type="text"
                      required
                      value={zonalFeaturesHeader}
                      onChange={e => setZonalFeaturesHeader(e.target.value)}
                      placeholder="e.g. Core Zonal Features"
                      className="glass-input font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Section Description</label>
                    <textarea
                      rows={2}
                      required
                      value={zonalFeaturesDesc}
                      onChange={e => setZonalFeaturesDesc(e.target.value)}
                      placeholder="Short description displayed below the section header..."
                      className="glass-input resize-none font-medium text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {zonalFeatures.map((feat, idx) => (
                    <div key={feat.id || idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Feature #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                          <input
                            type="text"
                            required
                            value={feat.title}
                            onChange={e => {
                              const updated = [...zonalFeatures];
                              updated[idx].title = e.target.value;
                              setZonalFeatures(updated);
                            }}
                            className="glass-input font-bold animate-all"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Badge Tag</label>
                          <input
                            type="text"
                            required
                            value={feat.tag}
                            onChange={e => {
                              const updated = [...zonalFeatures];
                              updated[idx].tag = e.target.value;
                              setZonalFeatures(updated);
                            }}
                            className="glass-input font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Short Description</label>
                        <textarea
                          rows={2}
                          required
                          value={feat.description}
                          onChange={e => {
                            const updated = [...zonalFeatures];
                            updated[idx].description = e.target.value;
                            setZonalFeatures(updated);
                          }}
                          className="glass-input resize-none text-[11px] font-light leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Cover Image URL</label>
                        <div className="flex gap-2 items-center">
                          <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                            {feat.image ? (
                              <img src={feat.image} alt={feat.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[8px] text-slate-400 font-bold uppercase">No Image</span>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const updated = [...zonalFeatures];
                                    updated[idx].image = reader.result as string;
                                    setZonalFeatures(updated);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-[9px] file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer w-full"
                            />
                            <input
                              type="text"
                              placeholder="Or paste image URL"
                              value={feat.image}
                              onChange={e => {
                                const updated = [...zonalFeatures];
                                updated[idx].image = e.target.value;
                                setZonalFeatures(updated);
                              }}
                              className="glass-input text-[9px] h-6 py-0 px-2 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}\r\n                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-6 pt-6" />

              {/* ── Company Logo Slider Configurator ── */}
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" /> Home Page — Placement Partner Logos Slider
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Configure the auto-scrolling company logo marquee displayed on the homepage above the footer. Add companies via Placement Manager.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCompanySlider(showCompanySlider === 1 ? 0 : 1)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${showCompanySlider === 1 ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    title={showCompanySlider === 1 ? 'Click to hide slider' : 'Click to show slider'}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${showCompanySlider === 1 ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {showCompanySlider === 1 && (
                  <div className="space-y-4 p-5 border border-primary/15 bg-primary/5 dark:bg-primary/5 rounded-2xl">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Section Heading Title</label>
                      <input
                        type="text"
                        value={companySliderTitle}
                        onChange={e => setCompanySliderTitle(e.target.value)}
                        placeholder="e.g. Our Placement Partners & Recruiters"
                        className="glass-input font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Section Description</label>
                      <textarea
                        rows={2}
                        value={companySliderDesc}
                        onChange={e => setCompanySliderDesc(e.target.value)}
                        placeholder="Short description about placements..."
                        className="glass-input resize-none font-medium text-[11px]"
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                        To manage actual company logos displayed in the slider, go to <strong>Placement Manager</strong> in the sidebar and use the Companies tab.
                      </p>
                    </div>
                  </div>
                )}

                {showCompanySlider === 0 && (
                  <p className="text-[11px] text-slate-400 italic pl-1">Slider is currently hidden. Toggle ON above to enable and configure.</p>
                )}
              </div>

            </form>
          </div>

          {/* ── HERO SLIDER SETTINGS ── */}
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

          {/* ── ALUMNI SPOTLIGHT MANAGER PANEL ── */}
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
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-650 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
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
