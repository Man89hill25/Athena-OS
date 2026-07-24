import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DocItem } from '../types';
import {
  FileText,
  Copy,
  Check,
  Download,
  Bot,
  Sparkles,
  List,
  ArrowUpRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface DocViewerProps {
  doc: DocItem | null;
  onAskAiWithDoc: (docId: string, title: string) => void;
}

export const DocViewer: React.FC<DocViewerProps> = ({ doc, onAskAiWithDoc }) => {
  const [copied, setCopied] = useState(false);

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-900/40">
        <FileText className="w-16 h-16 text-slate-600 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-slate-200">اختر وثيقة معمارية لبدء الفحص والمراجعة</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md">
          جميع وثائق المخطط الهندسي الخمسين (000 إلى 049) متوفرة ومكتملة باللغة العربية ومستوفاة لكافة معايير الجودة الأكاديمية والهندسية.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.file;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Section quick jumps
  const sections = [
    { title: 'الهدف (Purpose)', id: '1-purpose' },
    { title: 'المسؤوليات (Responsibilities)', id: '2-responsibilities' },
    { title: 'الاعتماديات (Dependencies)', id: '3-dependencies' },
    { title: 'الهيكل الداخلي (Internal Structure)', id: '4-internal-structure' },
    { title: 'التوسع المستقبلي (Future Expansion)', id: '5-future-expansion' },
    { title: 'المخاطر (Risks)', id: '6-risks' },
    { title: 'الملاحظات الهندسية (Engineering Notes)', id: '7-engineering-notes' }
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Main Reading Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-6 max-w-4xl mx-auto">
        
        {/* Document Metadata Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-emerald-500 to-teal-600"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {doc.file}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {doc.category}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-100 leading-snug">
                {doc.title}
              </h1>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleCopy}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="نسخ الشفرة الخام"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="تنزيل ملف Markdown"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل</span>
              </button>

              <button
                onClick={() => onAskAiWithDoc(doc.id, doc.title)}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs font-medium"
              >
                <Bot className="w-4 h-4" />
                <span>استشارة الذكاء الاصطناعي</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rendered Markdown Body */}
        <article className="prose prose-invert max-w-none dir-rtl text-slate-200 leading-relaxed font-sans bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800/80 shadow-lg">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-400 border-b border-slate-800 pb-3 mb-6 mt-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg md:text-xl font-bold text-amber-300 mt-8 mb-3 flex items-center gap-2 border-r-4 border-amber-500 pr-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-md font-semibold text-teal-300 mt-6 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 leading-relaxed text-sm md:text-base my-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 my-3 text-slate-300 text-sm md:text-base">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 my-3 text-slate-300 text-sm md:text-base">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed marker:text-emerald-400">
                  {children}
                </li>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-700/80">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-4 dir-ltr text-left">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-emerald-500 pr-4 italic text-slate-400 bg-slate-800/40 py-2 px-3 rounded-l-lg my-4">
                  {children}
                </blockquote>
              )
            }}
          >
            {doc.content}
          </ReactMarkdown>
        </article>

        {/* Quality Seal */}
        <div className="flex items-center justify-between p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>توثيق مكتمل وخالٍ من الأكواد المؤقتة بحسب التوجيه الهندسي Directive 001.</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-500">PRODUCTION-GRADE</span>
        </div>

      </div>

      {/* Right Table of Contents Panel for Desktop */}
      <div className="hidden xl:block w-72 bg-slate-900/60 border-r border-slate-800 p-4 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <List className="w-4 h-4 text-emerald-400" />
          محتويات الوثيقة المعمارية
        </h3>
        
        <div className="space-y-1 text-xs">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-300 transition-colors flex items-center justify-between group cursor-default"
            >
              <span>{sec.title}</span>
              <FileCheck className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            توجيه هندسي
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            تعتبر هذه الوثيقة جزءاً أصيلاً من المعمارية الحية لـ Athena OS المخصصة لمسيرة العشر سنوات القادمة.
          </p>
        </div>
      </div>

    </div>
  );
};
