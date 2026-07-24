import React from 'react';
import {
  Layers,
  Cpu,
  Database,
  Brain,
  Search,
  BookOpen,
  Calendar,
  Shield,
  Zap,
  Globe,
  FileCode,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export const ArchitectureVisualizer: React.FC = () => {
  const layers = [
    {
      title: '1. Presentation Layer (طبقة العرض والواجهات)',
      icon: <Globe className="w-5 h-5 text-sky-400" />,
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-200',
      description: 'واجهة متجاوبة بالكامل RTL مبنية بـ React 19 + Tailwind v4 + Motion مع تدفق أحادي للبيانات.',
      items: ['RTL Directional Canvas', 'Tabbed Multi-Book Reader', 'D3.js Knowledge Graph View', 'Chronological Timeline Engine']
    },
    {
      title: '2. Application & Agent Layer (طبقة التطبيق والوكلاء الأذكياء)',
      icon: <Brain className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
      description: 'شبكة وكلاء الذكاء الاصطناعي الأكاديمية (Research, Critical Analysis, Lexicon, Citation Agent).',
      items: ['Google Gemini 2.5 SDK', 'Arabic Smart Chunking', 'Hybrid RAG Synthesizer', 'Multi-Agent Debate']
    },
    {
      title: '3. Hybrid Search & Retrieval Engine (محرك البحث والاسترجاع الهجين)',
      icon: <Search className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-200',
      description: 'خالط البحث الهجين الذكي RRF المدمج بين FTS5 الحرفي و Vector Embeddings.',
      items: ['SQLite3 FTS5 Full-Text', 'Cosine Vector Similarity', 'Reciprocal Rank Fusion (RRF)', 'Arabic Normalizer Engine']
    },
    {
      title: '4. Storage & Persistence Layer (طبقة التخزين المستمر وقواعد البيانات)',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-200',
      description: 'قواعد البيانات العلاقاتية والمتجهية المحلية المؤمّنة.',
      items: ['SQLite (WAL Mode)', 'Vector Embeddings Store', 'Knowledge Graph Adjacency', 'Encrypted Local File Vault']
    },
    {
      title: '5. Native Desktop Core (نواة التطبيق الذاتي والمُعالجة العميقة)',
      icon: <Cpu className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-200',
      description: 'محرك القراءة الضوئية OCR وتجميع النوافذ الذاتية وتحديثات النظام.',
      items: ['Tauri/Rust IPC Bridge', 'Arabic OCR Vision Engine', 'Background Import Queue', 'Auto Snapshot & Rollback']
    }
  ];

  const roadmapMilestones = [
    { year: 'السنة 1 (2026)', title: 'التأسيس المعماري والنواة الأساسية', status: 'مكتمل (Blueprint Ready)', desc: 'إعداد الخارطة الهندسية (50 وثيقة)، محرك البحث الهجين، ومكونات الواجهة.' },
    { year: 'السنة 2-3 (2027-2028)', title: 'محرك OCR التراثي وشبكة الوكلاء', status: 'مخطط', desc: 'دعم المخطوطات القديمة، استخراج الحواشي، وتفعيل وكلاء Gemini التفاعليين.' },
    { year: 'السنة 4-5 (2029-2030)', title: 'الرسم البياني ثلاثي الأبعاد واللغات التاريخية', status: 'مخطط', desc: 'دعم السريانية، القبطية، اليونانية، والربط الجغرافي المعرفي.' },
    { year: 'السنة 6-10 (2031-2036)', title: 'المزامنة الموزعة وأتمتة التحقيق العلمي', status: 'رؤية مستقبلية', desc: 'أتمتة المقارنات بين النسخ الخاطة والمزامنة اللافيزيائية عبر الأجهزة.' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 max-w-6xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5" />
                المخطط الهندسي لـ 10 سنوات
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
              البنية الهندسية لنظام Athena OS
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              معمارية برمجية صلبة ومستقلة، خالية من الأكواد المؤقتة، مصممة لاستيعاب أكثر من 100,000 كتاب وملايين الصفحات مع استجابة فورية.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center min-w-[200px]">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="block text-xl font-bold text-emerald-400 font-mono">50/50</span>
              <span className="text-[10px] text-slate-400">وثائق معمارية مكتملة</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="block text-xl font-bold text-amber-400 font-mono">&lt; 50ms</span>
              <span className="text-[10px] text-slate-400">زمن استعلام البحث</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Layers Stack */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          طبقات المعمارية الخمس (Athena Architecture Stack)
        </h2>

        <div className="space-y-3">
          {layers.map((layer, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl border shadow-lg transition-all hover:scale-[1.005] ${layer.color}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                    {layer.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{layer.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{layer.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/60">
                {layer.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10-Year Roadmap */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          خارطة الطريق الممتدة (Roadmap 2026 - 2036)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmapMilestones.map((ms, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {ms.year}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${idx === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
                  {ms.status}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100">{ms.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ms.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
