import React, { useState } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { SystemInstructionModal } from './components/SystemInstructionModal';
import { KoreanStructureView } from './components/KoreanStructureView';
import { ChoiceMatchingView } from './components/ChoiceMatchingView';
import { EnglishChunkingView } from './components/EnglishChunkingView';
import { ParaphraseTracingView } from './components/ParaphraseTracingView';
import { MetacognitionView } from './components/MetacognitionView';
import { 
  Sparkles, 
  GraduationCap, 
  BrainCircuit, 
  Layers, 
  GitCompare, 
  Timer, 
  BookOpenCheck 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('korean-structure');
  const [isSystemModalOpen, setIsSystemModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white font-['Pretendard',sans-serif]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSystemInstruction={() => setIsSystemModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'korean-structure' && <KoreanStructureView />}
        {activeTab === 'choice-matching' && <ChoiceMatchingView />}
        {activeTab === 'english-chunking' && <EnglishChunkingView />}
        {activeTab === 'paraphrase-tracing' && <ParaphraseTracingView />}
        {activeTab === 'metacognition' && <MetacognitionView />}
      </main>

      {/* Footer & Principles Guide */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-700">
              수능 국어·영어 독해 & 메타인지 AI 학습 코칭 시스템
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Gemini 3.7 Flash JSON Mode
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              평가원 출제코드 기반
            </span>
            <button
              onClick={() => setIsSystemModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2"
            >
              System Instruction 보기
            </button>
          </div>
        </div>
      </footer>

      {/* System Instruction & Prompt Specification Modal */}
      <SystemInstructionModal
        isOpen={isSystemModalOpen}
        onClose={() => setIsSystemModalOpen(false)}
      />
    </div>
  );
}
