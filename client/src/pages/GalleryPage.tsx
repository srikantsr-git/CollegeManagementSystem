import React, { useState, useEffect, useCallback } from 'react';
import {
  Image, Camera, MapPin, Calendar, User, ChevronLeft, ChevronRight,
  Search, X, ZoomIn, Loader2, Grid3X3, Rows3, Tag, ExternalLink
} from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  photographer: string;
  location: string;
  date: string;
  sort_order: number;
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

const GalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeCategory !== 'All'
        ? `http://localhost:5001/api/gallery?category=${encodeURIComponent(activeCategory)}`
        : 'http://localhost:5001/api/gallery';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (err) {
      console.warn('Gallery fetch error:', err);
    }
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => {
    fetch('http://localhost:5001/api/gallery/categories')
      .then(r => r.ok ? r.json() : [])
      .then(cats => setCategories(cats))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPhotos();
    setCurrentPage(1);
  }, [fetchPhotos]);

  const filteredPhotos = photos.filter(p =>
    !searchQuery ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.photographer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE);
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openLightbox = (photo: GalleryItem, idx: number) => {
    setLightboxPhoto(photo);
    setLightboxIndex(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    document.body.style.overflow = '';
  };

  const lightboxNav = (dir: 'prev' | 'next') => {
    const newIdx = dir === 'prev'
      ? (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (lightboxIndex + 1) % filteredPhotos.length;
    setLightboxIndex(newIdx);
    setLightboxPhoto(filteredPhotos[newIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxPhoto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxNav('prev');
      if (e.key === 'ArrowRight') lightboxNav('next');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxPhoto, lightboxIndex]);

  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen pb-16 text-left">
      {/* ── Styled Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl mb-10"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-black/20 blur-3xl pointer-events-none" />
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest">
              <Camera className="w-4 h-4" /> Photo Gallery
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Our Visual Story
            </h1>
            <p className="text-white/70 text-sm font-medium max-w-md">
              Relive the moments that define our community — sports meets, ceremonies, campus life, and more.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right text-white">
              <p className="text-3xl font-black">{photos.length}</p>
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Photos</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-right text-white">
              <p className="text-3xl font-black">{categories.length}</p>
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Controls ── */}
      <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search photos, photographers..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary'}`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'masonry' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary'}`}
              title="Masonry view"
            >
              <Rows3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex gap-2 flex-wrap mb-8">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border flex items-center gap-1.5 ${
              activeCategory === cat
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            {cat}
            {cat !== 'All' && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {photos.filter(p => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Results info ── */}
      {!loading && (
        <div className="flex items-center justify-between mb-6 text-sm text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-700 dark:text-slate-300">{paginatedPhotos.length}</strong> of <strong className="text-slate-700 dark:text-slate-300">{filteredPhotos.length}</strong> photos
            {activeCategory !== 'All' && <> in <span className="text-primary font-bold">{activeCategory}</span></>}
          </span>
          {totalPages > 1 && (
            <span>Page {currentPage} of {totalPages}</span>
          )}
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-slate-500 font-medium animate-pulse">Loading gallery...</p>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredPhotos.length === 0 && (
        <div className="glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-16 text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Image className="w-10 h-10 text-primary/40" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">No Photos Found</h3>
            <p className="text-sm text-slate-400">
              {searchQuery ? 'Try different search terms or clear filters.' : 'No photos have been added to this category yet.'}
            </p>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-primary text-sm font-bold hover:underline">
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* ── Photo Grid ── */}
      {!loading && paginatedPhotos.length > 0 && (
        <div className={
          viewMode === 'masonry'
            ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        }>
          {paginatedPhotos.map((photo, idx) => {
            const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
            return (
              <div
                key={photo.id}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/40 cursor-pointer bg-slate-100 dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 ${viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}
                onClick={() => openLightbox(photo, globalIdx)}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'aspect-square' : ''}`}>
                  {imgErrors[photo.id] ? (
                    <div className="w-full aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <Image className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                    </div>
                  ) : (
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={() => setImgErrors(prev => ({ ...prev, [photo.id]: true }))}
                    />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-primary/80 text-white px-2.5 py-1 rounded-full mb-2">
                        <Tag className="w-3 h-3" /> {photo.category}
                      </span>
                      <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-white/70 text-[11px] line-clamp-2 leading-snug">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {photo.photographer && (
                          <span className="flex items-center gap-1 text-white/60 text-[10px] font-bold">
                            <Camera className="w-3 h-3" /> {photo.photographer}
                          </span>
                        )}
                        {photo.location && (
                          <span className="flex items-center gap-1 text-white/60 text-[10px] font-bold">
                            <MapPin className="w-3 h-3" /> {photo.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Zoom icon top-right */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Footer info (visible in grid mode below the image) */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">{photo.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary">{photo.category}</span>
                    {photo.date && (
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            const isActive = page === currentPage;
            const isNearby = Math.abs(page - currentPage) <= 2;
            if (!isNearby && page !== 1 && page !== totalPages) {
              if (page === 2 || page === totalPages - 1) {
                return <span key={page} className="text-slate-300 dark:text-slate-600 text-sm font-bold px-1">…</span>;
              }
              return null;
            }
            return (
              <button
                key={page}
                onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Lightbox Modal ── */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev Nav */}
          <button
            onClick={e => { e.stopPropagation(); lightboxNav('prev'); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Nav */}
          <button
            onClick={e => { e.stopPropagation(); lightboxNav('next'); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 bg-slate-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 relative overflow-hidden min-h-[50vh] lg:min-h-0">
              <img
                src={lightboxPhoto.image_url}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info panel */}
            <div className="w-full lg:w-80 flex-shrink-0 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 overflow-y-auto max-h-[40vh] lg:max-h-none">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-3">
                  <Tag className="w-3 h-3" /> {lightboxPhoto.category}
                </span>
                <h3 className="font-black text-lg text-slate-800 dark:text-white leading-snug">
                  {lightboxPhoto.title}
                </h3>
              </div>

              {lightboxPhoto.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lightboxPhoto.description}
                </p>
              )}

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                {lightboxPhoto.photographer && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Camera className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Photographer</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{lightboxPhoto.photographer}</p>
                    </div>
                  </div>
                )}
                {lightboxPhoto.location && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{lightboxPhoto.location}</p>
                    </div>
                  </div>
                )}
                {lightboxPhoto.date && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {new Date(lightboxPhoto.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Counter */}
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{lightboxIndex + 1} / {filteredPhotos.length}</span>
                <a href={lightboxPhoto.image_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Open Original
                </a>
              </div>

              {/* Dot indicators */}
              <div className="flex gap-1 flex-wrap">
                {filteredPhotos.slice(Math.max(0, lightboxIndex - 4), lightboxIndex + 5).map((_, i) => {
                  const actualIdx = Math.max(0, lightboxIndex - 4) + i;
                  return (
                    <button
                      key={actualIdx}
                      onClick={() => { setLightboxIndex(actualIdx); setLightboxPhoto(filteredPhotos[actualIdx]); }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${actualIdx === lightboxIndex ? 'bg-primary w-4' : 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
