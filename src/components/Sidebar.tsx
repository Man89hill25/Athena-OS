import React, { useState } from 'react';
import { DocItem } from '../types';
import {
  BookOpen,
  ChevronLeft,
  Filter,
  FolderTree,
  FileCode,
  CheckCircle,
  SearchX
} from 'lucide-react';

interface SidebarProps {
  docs: DocItem[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
  searchQuery: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  docs,
  selectedDocId,
  onSelectDoc,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Categories list
  const categories = [
    'الكل',
    'الأساس والرؤية المعمارية',
    'القواعد والواجهات وRAG',
    'الأمان والأداء والأنظمة الفرعية',
    'محركات المعالجة والذكاء الاصطناعي',
    'المكتبات والتخزين والذاكرة',
    'الخارطة والمجلة والقرارات'
  ];

  // Filter docs
  const filteredDocs = docs.filter((doc) => {
    const matchesCat =
      selectedCategory === 'الكل' || doc.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-65px)] sticky top-[65px]">
      
      {/* Category Pills Header */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            أقسام المخطط الهندسي (50)
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
            {filteredDocs.length} مستند
          </span>
        </div>

        {/* Scrollable Horizontal Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 font-medium'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDocs.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
            <SearchX className="w-8 h-8 text-slate-600" />
            <p>لا توجد مستندات تطابق نطاق البحث الحقيقي.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            const numStr = doc.number < 10 ? `00${doc.number}` : doc.number < 100 ? `0${doc.number}` : `${doc.number}`;

            return (
              <button
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-start justify-between gap-2 text-xs group border ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-sm'
                    : 'bg-slate-800/30 border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 hover:border-slate-700/60'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded border mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {numStr}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium truncate leading-tight group-hover:text-emerald-300 transition-colors">
                      {doc.title.replace(/^#\s*\d+_\w+\.md\s*-\s*/, '').replace(/^#\s*/, '')}
                    </h3>
                    <p className="text-[10px] text-slate-500 truncate mt-1">
                      {doc.file}
                    </p>
                  </div>
                </div>

                <ChevronLeft
                  className={`w-4 h-4 mt-1 transition-transform shrink-0 ${
                    isSelected
                      ? 'text-emerald-400 translate-x-0'
                      : 'text-slate-600 group-hover:text-slate-400 group-hover:-translate-x-0.5'
                  }`}
                />
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          50/50 وثيقة كاملة
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          ATHENA-ENGINEERING-CORE
        </span>
      </div>

    </aside>
  );
};
