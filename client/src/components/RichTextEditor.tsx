import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editKey?: any; // bump this to reset/reload editor contents
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write details here...',
  editKey
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Seed content on first render or when edit key changes (new entry loaded)
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editKey]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val || undefined);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('Enter link URL (e.g. https://example.com):');
    if (url) {
      exec('createLink', url);
    }
  };

  const insertImageURL = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      exec('insertImage', url);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        exec('insertImage', reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const toolbarItems = [
    { label: 'B',     cmd: 'bold',                style: 'font-bold',      title: 'Bold' },
    { label: 'I',     cmd: 'italic',              style: 'italic',         title: 'Italic' },
    { label: 'U',     cmd: 'underline',           style: 'underline',      title: 'Underline' },
    { label: 'H1',    cmd: 'formatBlock',         val: 'h2',               title: 'Heading 1' },
    { label: 'H2',    cmd: 'formatBlock',         val: 'h3',               title: 'Heading 2' },
    { label: 'H3',    cmd: 'formatBlock',         val: 'h4',               title: 'Heading 3' },
    { label: 'Para',  cmd: 'formatBlock',         val: 'p',                title: 'Paragraph' },
    { label: '• List',cmd: 'insertUnorderedList', style: '',               title: 'Bullet List' },
    { label: '1. List',cmd:'insertOrderedList',   style: '',               title: 'Numbered List' },
    { label: '⇤',    cmd: 'outdent',             style: '',               title: 'Outdent' },
    { label: '⇥',    cmd: 'indent',              style: '',               title: 'Indent' },
  ];

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mr-1">Format:</span>
        {toolbarItems.map((btn) => (
          <button
            key={btn.cmd + btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => { e.preventDefault(); exec(btn.cmd, btn.val); }}
            className={`px-2 py-1 rounded-lg text-[11px] ${btn.style || ''} font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-750 hover:bg-primary hover:text-white border border-slate-200 dark:border-slate-600 transition-all cursor-pointer select-none`}
          >
            {btn.label}
          </button>
        ))}

        {/* Custom Actions */}
        <button
          type="button"
          title="Insert Link"
          onClick={insertLink}
          className="px-2 py-1 rounded-lg text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-700 hover:bg-sky-500 hover:text-white border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
        >
          🔗 Link
        </button>

        <button
          type="button"
          title="Insert Image by URL"
          onClick={insertImageURL}
          className="px-2 py-1 rounded-lg text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-700 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
        >
          🖼️ Image (URL)
        </button>

        <button
          type="button"
          title="Upload Local Image"
          onClick={() => imageInputRef.current?.click()}
          className="px-2 py-1 rounded-lg text-[11px] font-bold text-violet-600 dark:text-violet-400 bg-white dark:bg-slate-700 hover:bg-violet-500 hover:text-white border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
        >
          📤 Upload Pic
        </button>

        <button
          type="button"
          title="Clear Formatting"
          onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
          className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-350 bg-white dark:bg-slate-700 hover:bg-rose-500 hover:text-white border border-slate-200 dark:border-slate-600 transition-all cursor-pointer select-none"
        >
          ↩ Clear
        </button>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        className="rich-wysiwyg-editor min-h-56 p-5 text-sm text-slate-805 dark:text-slate-200 focus:outline-none bg-white dark:bg-slate-900/60 leading-relaxed"
        style={{
          minHeight: '220px',
        }}
        data-placeholder={placeholder}
      />
      <style>{`
        .rich-wysiwyg-editor:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          font-style: italic;
        }
        .rich-wysiwyg-editor h2 { font-size: 1.5em; font-weight: 700; margin: 0.8em 0 0.4em 0; }
        .rich-wysiwyg-editor h3 { font-size: 1.25em; font-weight: 600; margin: 0.7em 0 0.3em 0; }
        .rich-wysiwyg-editor h4 { font-size: 1.1em; font-weight: 600; margin: 0.6em 0 0.2em 0; }
        .rich-wysiwyg-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .rich-wysiwyg-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .rich-wysiwyg-editor p  { margin: 0.5em 0; }
        .rich-wysiwyg-editor a  { color: #1d4ed8; text-decoration: underline; }
        .rich-wysiwyg-editor img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 0.7em 0; }
      `}</style>
    </div>
  );
};
