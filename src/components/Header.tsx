import React from 'react';
import {
  BookOpen,
  Search,
  Bot,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalDocs: number;
  activeTab: 'reader' | 'architecture' | 'checklist';
  setActiveTab: (tab: 'reader' | 'architecture' | 'checklist') => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  totalDocs,
  activeTab,
  setActiveTab,
  onOpenAi
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0F172A] text-slate-100 border-b border-slate-800 shadow-lg px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & System Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg md:text-xl tracking-tight text-slate-100 flex items-center gap-2">
                  ATHENA OS
                  <span className="text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    v1.0.0
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                نظام تشغيل المعرفة والذكاء الاصطناعي العربي الأكاديمي
              </p>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenAi}
              className="p-2 bg-emerald-600 text-white rounded-lg flex items-center gap-1 text-xs font-medium"
            >
              <Bot className="w-4 h-4" />
              الاستشاري
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الـ 50 وثيقة معمارية..."
            className="w-full pr-10 pl-4 py-1.5 text-xs bg-slate-800/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              إلغاء
            </button>
          )}
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <nav className="flex items-center bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveTab('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'reader'
                  ? 'bg-emerald-600 text-white font-medium shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              المستندات ({totalDocs})
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-emerald-600 text-white font-medium shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              الخارطة المعمارية
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'checklist'
                  ? 'bg-emerald-600 text-white font-medium shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              المواصفات القياسية
            </button>
          </nav>

          <button
            onClick={onOpenAi}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium shadow-md hover:shadow-lg transition-all border border-emerald-400/30"
          >
            <Bot className="w-4 h-4" />
            <span>استشاري Gemini</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </button>
        </div>

      </div>
    </header>
  );
};
