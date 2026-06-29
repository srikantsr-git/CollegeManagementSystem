import React, { useState, useEffect } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { 
  SlidersHorizontal, Plus, Edit3, Trash2, Eye, EyeOff, 
  ChevronUp, ChevronDown, ChevronRight, FolderPlus, Folder, 
  Link, FileText, Check, X, Lock, RefreshCw, Upload, Image, Trash
} from 'lucide-react';

interface PageItem {
  id: string;
  title: string;
  parent_menu: string;
  menu_type: string;
  is_visible: number;
  sort_order: number;
  updated_at?: string;
}

interface MenuNavigationManagerProps {
  allPages: PageItem[];
  onRefresh: () => void;
  setConfirmDialog: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>>;
  onNavigateToTab?: (tab: string, pageId?: string) => void;
}

// Maps page IDs to specialized admin tabs
const getTargetTabForPage = (pageId: string, parentMenu: string, menuType: string) => {
  const specialized: Record<string, string> = {
    'committee': 'committee-manager',
    'hods': 'hods-manager',
    'director': 'directors-manager',
    'circulars': 'circulars-manager',
    'ncte': 'ncte-manager',
    'courses': 'courses-manager',
    'admission': 'admission-manager',
    'academic_results': 'results-manager',
    'events': 'events-manager',
    'stories': 'spotlight-manager',
    'gallery': 'gallery-manager',
    'placements': 'placement-manager',
    'donations': 'donations-manager',
    'about_us': 'about-manager', // 'about_us' is edited under about-manager
    'careers': 'jobs',
    'draws': 'results-manager',
    'results': 'results-manager',
    'contact': 'branding',
  };

  if (specialized[pageId]) {
    return { tab: specialized[pageId], isSpecialized: true };
  }

  // Generic static page managers based on parent menu
  if (parentMenu === 'about') {
    return { tab: 'about-manager', isSpecialized: false };
  }
  if (parentMenu === 'academic') {
    return { tab: 'academic-pages-manager', isSpecialized: false };
  }
  if (parentMenu === 'student') {
    return { tab: 'student-pages-manager', isSpecialized: false };
  }
  if (parentMenu === 'none' && menuType === 'standalone') {
    return { tab: 'standalone-pages-manager', isSpecialized: false };
  }

  return { tab: '', isSpecialized: false };
};

// System-locked pages which cannot be deleted or have their Slugs modified
const SYSTEM_PAGE_IDS = [
  'about', 'academic', 'student', 'directory', 'gallery', 'placements', 'donations', 'contact',
  'about_us', 'committee', 'hods', 'director', 'circulars', 'ncte', 'facilities',
  'courses', 'admission', 'syllabus', 'academic_results',
  'events', 'stories', 'careers', 'activities', 'research', 'projects', 'calendar', 'souvenirs', 'draws', 'results'
];

export const MenuNavigationManager: React.FC<MenuNavigationManagerProps> = ({
  allPages,
  onRefresh,
  setConfirmDialog,
  onNavigateToTab
}) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any | null>(null); // null means Creating New

  // Form states
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formMenuType, setFormMenuType] = useState('child'); // parent, child, standalone, sub-parent, sub-child
  const [formParentMenu, setFormParentMenu] = useState('about');
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formIsVisible, setFormIsVisible] = useState(1);
  const [formContent, setFormContent] = useState('');
  const [formFileUrl, setFormFileUrl] = useState<string | null>(null);
  const [formFileName, setFormFileName] = useState<string | null>(null);
  const [formShowSlider, setFormShowSlider] = useState(0);
  const [formSliderSlides, setFormSliderSlides] = useState<any[]>([]);

  // Local validation error
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dropdown list inputs
  const parentOptions = allPages.filter(p => p.menu_type === 'parent');
  const subParentOptions = allPages.filter(p => p.menu_type === 'sub-parent' || p.menu_type === 'child');

  // Open modal for editing
  const openEditModal = (page: PageItem) => {
    // If page is managed by another specialized admin tab, redirect to it
    const target = getTargetTabForPage(page.id, page.parent_menu, page.menu_type);
    if (target.tab && onNavigateToTab) {
      onNavigateToTab(target.tab, target.isSpecialized ? undefined : page.id);
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    fetch(`http://localhost:5001/api/custom-pages/${page.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setEditingPage(data);
          setFormId(data.id);
          setFormTitle(data.title);
          setFormMenuType(data.menu_type || 'child');
          setFormParentMenu(data.parent_menu || 'about');
          setFormSortOrder(data.sort_order || 0);
          setFormIsVisible(data.is_visible !== undefined ? data.is_visible : 1);
          setFormContent(data.content || '');
          setFormFileUrl(data.file_url || null);
          setFormFileName(data.file_name || null);
          setFormShowSlider(data.show_slider || 0);
          try {
            setFormSliderSlides(JSON.parse(data.slider_slides || '[]'));
          } catch {
            setFormSliderSlides([]);
          }
          setModalOpen(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setErrorMsg('Failed to load full page details.');
      });
  };


  // Open modal for creating new
  const openCreateModal = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setEditingPage(null);
    setFormId('');
    setFormTitle('');
    setFormMenuType('child');
    setFormParentMenu('about');
    setFormSortOrder(0);
    setFormIsVisible(1);
    setFormContent('');
    setFormFileUrl(null);
    setFormFileName(null);
    setFormShowSlider(0);
    setFormSliderSlides([]);
    setModalOpen(true);
  };

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormFileUrl(reader.result as string);
      setFormFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Slide helper functions
  const addSlide = () => {
    setFormSliderSlides([
      ...formSliderSlides,
      { image_url: '', title: '', subtitle: '', description: '', btn_text: '', btn_link: '' }
    ]);
  };

  const removeSlide = (idx: number) => {
    setFormSliderSlides(formSliderSlides.filter((_, i) => i !== idx));
  };

  const updateSlideField = (idx: number, field: string, value: string) => {
    const updated = [...formSliderSlides];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormSliderSlides(updated);
  };

  const handleSlideImageUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      updateSlideField(idx, 'image_url', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formTitle) {
      setErrorMsg('Page Title and Slug/ID are required.');
      return;
    }

    const payload = {
      id: formId,
      title: formTitle,
      menu_type: formMenuType,
      parent_menu: formMenuType === 'parent' || formMenuType === 'standalone' ? 'none' : formParentMenu,
      sort_order: formSortOrder,
      is_visible: formIsVisible,
      content: formContent,
      file_url: formFileUrl,
      file_name: formFileName,
      show_slider: formShowSlider,
      slider_slides: JSON.stringify(formSliderSlides)
    };

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const url = editingPage 
        ? `http://localhost:5001/api/custom-pages/${editingPage.id}` 
        : `http://localhost:5001/api/custom-pages`;
      const method = editingPage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server request failed');
      }

      setSuccessMsg(editingPage ? 'Menu item updated successfully!' : 'New menu item created successfully!');
      setTimeout(() => {
        setModalOpen(false);
        onRefresh();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving menu item.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Visibility instantly
  const handleToggleVisibility = async (page: PageItem) => {
    const nextStatus = page.is_visible === 1 ? 0 : 1;
    try {
      const res = await fetch(`http://localhost:5001/api/custom-pages/${page.id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: nextStatus })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error('Failed to change visibility:', e);
    }
  };

  // Reorder sort_order (Direction: -1 is Up/prioritize, +1 is Down/deprioritize)
  const handleReorder = async (page: PageItem, direction: number) => {
    const currentOrder = page.sort_order || 0;
    const nextOrder = currentOrder + direction;
    try {
      const res = await fetch(`http://localhost:5001/api/custom-pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Load full details first to prevent wiping content
        body: JSON.stringify({
          title: page.title,
          parent_menu: page.parent_menu,
          menu_type: page.menu_type,
          is_visible: page.is_visible,
          sort_order: nextOrder
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error('Failed to update sort order:', e);
    }
  };

  // Delete page
  const handleDeletePage = (page: PageItem) => {
    if (SYSTEM_PAGE_IDS.includes(page.id)) {
      alert('System Reserved Pages cannot be deleted. You can hide them instead.');
      return;
    }
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete the menu item "${page.title}"? This will permanently delete the page and any associated content.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/custom-pages/${page.id}`, { method: 'DELETE' });
          if (res.ok) {
            onRefresh();
          }
        } catch (e) {
          console.error(e);
        }
        setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  // Build the visual tree from flat array
  const level1Items = allPages
    .filter(p => p.menu_type === 'parent' || p.menu_type === 'standalone')
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const getChildren = (parentId: string) => {
    return allPages
      .filter(p => (p.menu_type === 'child' || p.menu_type === 'sub-parent') && p.parent_menu === parentId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  const getSubChildren = (childId: string) => {
    return allPages
      .filter(p => p.menu_type === 'sub-child' && p.parent_menu === childId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };


  if (modalOpen) {
    return (
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer mb-2"
            >
              ← Back to Portal Menu & Navigation Manager
            </button>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              {editingPage ? <Edit3 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              {editingPage ? `Edit Menu / Page: "${formTitle}"` : 'Create Custom Menu Item & Page'}
            </h2>
          </div>
        </div>

        {errorMsg && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-semibold">{errorMsg}</div>}
        {successMsg && <div className="bg-emerald-550 text-emerald-600 p-3 rounded-xl text-xs font-semibold">{successMsg}</div>}

        <form onSubmit={handleSave} className="space-y-6 text-xs text-left">
          {/* Core configuration metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Menu / Page Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Sports Rules"
                className="glass-input text-xs font-semibold py-2.5"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Page ID / Slug</label>
              <input
                type="text"
                required
                disabled={editingPage !== null && SYSTEM_PAGE_IDS.includes(editingPage.id)}
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                placeholder="e.g. sports-rules"
                className="glass-input text-xs font-semibold py-2.5 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
              />
              {editingPage !== null && SYSTEM_PAGE_IDS.includes(editingPage.id) && (
                <span className="text-[9px] text-amber-500 font-medium">System Slug locked to preserve routes.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Menu Placement Type</label>
              <select
                value={formMenuType}
                onChange={(e) => setFormMenuType(e.target.value)}
                disabled={editingPage !== null && SYSTEM_PAGE_IDS.includes(editingPage.id)}
                className="glass-input text-xs py-2.5 cursor-pointer disabled:opacity-60"
              >
                <option value="child">Submenu Option (Child)</option>
                <option value="parent">Dropdown Menu Parent</option>
                <option value="standalone">Top-Level Direct Link</option>
                <option value="sub-parent">Submenu Parent (Fly-out)</option>
                <option value="sub-child">Level-3 Option (Sub-child)</option>
              </select>
            </div>

            {(formMenuType === 'child' || formMenuType === 'sub-parent' || formMenuType === 'sub-child') && (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {formMenuType === 'sub-child' ? 'Attach to Submenu Parent' : 'Attach to Parent Menu'}
                </label>
                <select
                  value={formParentMenu}
                  onChange={(e) => setFormParentMenu(e.target.value)}
                  className="glass-input text-xs py-2.5 cursor-pointer"
                >
                  {formMenuType === 'sub-child' ? (
                    subParentOptions.map(p => (
                      <option key={p.id} value={p.id}>{p.title} (#{p.id})</option>
                    ))
                  ) : (
                    parentOptions.map(p => (
                      <option key={p.id} value={p.id}>{p.title} (#{p.id})</option>
                    ))
                  )}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order (Rank)</label>
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
                className="glass-input text-xs py-2.5"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Status</label>
              <select
                value={formIsVisible}
                onChange={(e) => setFormIsVisible(parseInt(e.target.value) || 0)}
                className="glass-input text-xs py-2.5 cursor-pointer font-bold"
              >
                <option value={1}>Visible 🟢</option>
                <option value={0}>Hidden 🔴</option>
              </select>
            </div>
          </div>

          {/* Page Contents Details Editor (Only relevant if it can display page contents) */}
          {formMenuType !== 'parent' && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-6">
              
              {/* Hero Slider settings (Placed Above Page Body Content) */}
              <div className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-primary" />
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">Hero Carousel Slider</h4>
                  </div>
                  <select
                    value={formShowSlider}
                    onChange={(e) => setFormShowSlider(parseInt(e.target.value) || 0)}
                    className="glass-input text-[10px] font-bold py-1 px-2 cursor-pointer w-32"
                  >
                    <option value={0}>Disabled</option>
                    <option value={1}>Enabled</option>
                  </select>
                </div>

                {formShowSlider === 1 && (
                  <div className="space-y-4 pt-2">
                    {formSliderSlides.map((slide, idx) => (
                      <div key={idx} className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl relative space-y-3">
                        <button
                          type="button"
                          onClick={() => removeSlide(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                        <h5 className="font-bold text-[10px] text-slate-450 uppercase tracking-widest">Slide #{idx + 1}</h5>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Slide Image (Upload or Paste URL)</label>
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleSlideImageUpload(idx, file);
                              }}
                              className="glass-input text-[11px] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 cursor-pointer flex-1"
                            />
                            <input
                              type="text"
                              placeholder="Or paste Image URL"
                              value={slide.image_url.startsWith('data:image') ? '[Uploaded Image]' : slide.image_url}
                              onChange={(e) => updateSlideField(idx, 'image_url', e.target.value)}
                              className="glass-input text-[11px] py-2 flex-1"
                            />
                          </div>
                          {slide.image_url && (
                            <div className="relative w-24 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 flex items-center justify-center">
                              <img src={slide.image_url} alt="Slide Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Main Title"
                            value={slide.title}
                            onChange={(e) => updateSlideField(idx, 'title', e.target.value)}
                            className="glass-input text-[11px] py-2"
                          />
                          <input
                            type="text"
                            placeholder="Subtitle"
                            value={slide.subtitle}
                            onChange={(e) => updateSlideField(idx, 'subtitle', e.target.value)}
                            className="glass-input text-[11px] py-2"
                          />
                          <input
                            type="text"
                            placeholder="Button Link"
                            value={slide.btn_link}
                            onChange={(e) => updateSlideField(idx, 'btn_link', e.target.value)}
                            className="glass-input text-[11px] py-2"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSlide}
                      className="w-full py-2.5 border border-dashed border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 hover:text-primary hover:border-primary/50 rounded-xl transition-all cursor-pointer"
                    >
                      + Add Slide to Hero Carousel
                    </button>
                  </div>
                )}
              </div>

              {/* Page Body Content (Placed Below Hero Carousel Slider) */}
              <div className="flex flex-col gap-2">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider">Page Body Content</h4>
                <RichTextEditor
                  value={formContent}
                  onChange={setFormContent}
                  placeholder="Write your custom static page contents in full HTML..."
                />
              </div>

              {/* Document Attachment */}
              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">Document Attachment (Optional)</h4>
                  <p className="text-[10px] text-slate-500">Provide a downloadable PDF, guidelines, or notice document</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="glass-input file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-slate-900 hover:file:bg-primary-dark cursor-pointer text-[11px] w-full"
                  />
                </div>
                {formFileName && (
                  <div className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg max-w-xs truncate shadow-sm">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{formFileName}</span>
                    <button
                      type="button"
                      onClick={() => { setFormFileUrl(null); setFormFileName(null); }}
                      className="text-rose-500 hover:text-rose-600 font-bold text-xs shrink-0 cursor-pointer ml-1"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 font-bold text-slate-600 dark:text-slate-350 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-2.5 text-slate-900 font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save Navigation / Page'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-primary" />
            Portal Menu & Navigation Manager
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure the structure, ordering, and visibility of all top-level menus, submenus, and pages across the entire portal.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" /> Create Custom Menu / Page
        </button>
      </div>

      {/* Dynamic Hierarchy View */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-slate-900/10">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <div className="col-span-6 sm:col-span-7">Menu Item Title / Hierarchy</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-4 sm:col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {level1Items.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-medium">
              No top-level menus defined. Click above to add.
            </div>
          ) : (
            level1Items.map((item) => {
              const children = getChildren(item.id);
              const isSystem = SYSTEM_PAGE_IDS.includes(item.id);

              return (
                <div key={item.id} className="bg-white dark:bg-slate-950/10">
                  {/* LEVEL 1 ITEM */}
                  <div className="grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                    <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                      <Folder className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        {item.title}
                      </span>
                      {isSystem && (
                        <span className="flex items-center gap-0.5 text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" /> System Locked
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{item.id}
                      </span>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                        {item.menu_type}
                      </span>
                    </div>

                    <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-1.5">
                      {/* Sort arrows */}
                      <button
                        onClick={() => handleReorder(item, -1)}
                        className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReorder(item, 1)}
                        className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => handleToggleVisibility(item)}
                        className={`p-1.5 rounded-lg cursor-pointer ${item.is_visible === 1 ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        title={item.is_visible === 1 ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                      >
                        {item.is_visible === 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      {item.menu_type === 'parent' && (
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          title="Edit Menu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeletePage(item)}
                        disabled={isSystem}
                        className={`p-1.5 rounded-lg transition-all ${isSystem ? 'text-slate-300 dark:text-slate-800 cursor-not-allowed' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white cursor-pointer'}`}
                        title={isSystem ? 'System items cannot be deleted' : 'Delete Menu'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* LEVEL 2 ITEMS (Submenus) */}
                  {children.map((child) => {
                    const subChildren = getSubChildren(child.id);
                    const isChildSystem = SYSTEM_PAGE_IDS.includes(child.id);

                    return (
                      <div key={child.id} className="bg-slate-50/20 dark:bg-slate-900/5">
                        <div className="grid grid-cols-12 items-center gap-4 px-6 py-3 border-l-2 border-slate-200 dark:border-slate-800 ml-6 hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-colors">
                          <div className="col-span-6 sm:col-span-7 flex items-center gap-2 pl-2">
                            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                              {child.title}
                            </span>
                            {isChildSystem && (
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1 py-0.5 rounded">
                                System
                              </span>
                            )}
                            <span className="text-[9px] text-slate-440 font-mono">
                              #{child.id}
                            </span>
                          </div>

                          <div className="col-span-2 text-center">
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                              {child.menu_type}
                            </span>
                          </div>

                          <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleReorder(child, -1)}
                              className="p-0.5 text-slate-400 hover:text-slate-650 rounded cursor-pointer"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleReorder(child, 1)}
                              className="p-0.5 text-slate-400 hover:text-slate-650 rounded cursor-pointer"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleToggleVisibility(child)}
                              className={`p-1 rounded cursor-pointer ${child.is_visible === 1 ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' : 'text-slate-400'}`}
                            >
                              {child.is_visible === 1 ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {child.menu_type === 'sub-parent' && (
                              <button
                                onClick={() => openEditModal(child)}
                                className="p-1 rounded bg-blue-50 dark:bg-blue-950/25 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeletePage(child)}
                              disabled={isChildSystem}
                              className={`p-1 rounded transition-all ${isChildSystem ? 'text-slate-200 dark:text-slate-800' : 'bg-rose-50 dark:bg-rose-950/25 text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer'}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* LEVEL 3 ITEMS (Sub-children) */}
                        {subChildren.map((sub) => {
                          const isSubSystem = SYSTEM_PAGE_IDS.includes(sub.id);

                          return (
                            <div
                              key={sub.id}
                              className="grid grid-cols-12 items-center gap-4 px-6 py-2 ml-14 border-l-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-colors"
                            >
                              <div className="col-span-6 sm:col-span-7 flex items-center gap-2 pl-4">
                                <Link className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="text-slate-600 dark:text-slate-350 text-xs">
                                  {sub.title}
                                </span>
                                {isSubSystem && (
                                  <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1 py-0.5 rounded">
                                    System
                                  </span>
                                )}
                                <span className="text-[9px] text-slate-450 font-mono">
                                  #{sub.id}
                                </span>
                              </div>

                              <div className="col-span-2 text-center">
                                <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                  {sub.menu_type}
                                </span>
                              </div>

                              <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleReorder(sub, -1)}
                                  className="p-0.5 text-slate-400 hover:text-slate-650 rounded cursor-pointer"
                                >
                                  <ChevronUp className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={() => handleReorder(sub, 1)}
                                  className="p-0.5 text-slate-400 hover:text-slate-650 rounded cursor-pointer"
                                >
                                  <ChevronDown className="w-2.5 h-2.5" />
                                </button>

                                <button
                                  onClick={() => handleToggleVisibility(sub)}
                                  className={`p-1 rounded cursor-pointer ${sub.is_visible === 1 ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' : 'text-slate-400'}`}
                                >
                                  {sub.is_visible === 1 ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>

                                <button
                                  onClick={() => handleDeletePage(sub)}
                                  disabled={isSubSystem}
                                  className={`p-1 rounded transition-all ${isSubSystem ? 'text-slate-200 dark:text-slate-800' : 'bg-rose-50 dark:bg-rose-950/25 text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer'}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
