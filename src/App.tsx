import React, { useState, useEffect } from 'react';
import { DocItem } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocViewer } from './components/DocViewer';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { ChecklistViewer } from './components/ChecklistViewer';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('000_MASTER_PLAN');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'reader' | 'architecture' | 'checklist'>('reader');
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  // Load docs from Server API
  useEffect(() => {
    async function loadDocs() {
      try {
        setLoading(true);
        const res = await fetch('/api/docs');
        const data = await res.json();
        if (data.success && data.docs) {
          setDocs(data.docs);
          if (data.docs.length > 0) {
            setSelectedDocId(data.docs[0].id);
          }
        } else {
          setError('تعذر تحميل وثائق المخطط الهندسي.');
        }
      } catch (err: any) {
        setError('حدث خطأ أثناء الاتصال بالخادم.');
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const selectedDoc = docs.find((d) => d.id === selectedDocId) || docs[0] || null;

  const handleAskAiWithDoc = (docId: string, title: string) => {
    setIsAiOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center dir-rtl p-6">
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <h2 className="font-bold text-base text-slate-200">جاري تحميل حزمة المعمارية الهندسية لـ Athena OS...</h2>
          <p className="text-xs text-slate-400">فحص الخمسين وثيقة (000 إلى 049) وبناء الفهارس</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans dir-rtl flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalDocs={docs.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Sidebar: Document Tree */}
        <Sidebar
          docs={docs}
          selectedDocId={selectedDocId}
          onSelectDoc={(id) => {
            setSelectedDocId(id);
            if (activeTab !== 'reader') setActiveTab('reader');
          }}
          searchQuery={searchQuery}
        />

        {/* Content Panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'reader' && (
            <DocViewer
              doc={selectedDoc}
              onAskAiWithDoc={handleAskAiWithDoc}
            />
          )}

          {activeTab === 'architecture' && <ArchitectureVisualizer />}

          {activeTab === 'checklist' && <ChecklistViewer />}
        </main>

      </div>

      {/* Slide-over AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentDocId={selectedDoc?.id}
        currentDocTitle={selectedDoc?.title}
      />

    </div>
  );
}
