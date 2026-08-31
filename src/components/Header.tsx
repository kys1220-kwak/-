import React from 'react';
import { 
  BrainCircuit, 
  Layers, 
  GitCompare, 
  Timer, 
  Sparkles, 
  BookOpenCheck, 
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSystemInstruction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSystemInstruction,
}) => {
  const navItems: { id: TabType; label: string; icon: any; badge?: string; desc: string }[] = [
    {
      id: 'korean-structure',
      label: '국어 지문 구조화',
      icon: Layers,
      badge: '문단 맵핑',
      desc: '문단 요약 & 대립구도 인과 분석',
    },
    {
      id: 'choice-matching',
      label: '선지 근거 매칭',
      icon: GitCompare,
      badge: '패러프레이징',
      desc: '선지별 지문 근거 & 변형 원리',
    },
    {
      id: 'english-chunking',
      label: '영어 청킹 타이머',
      icon: Timer,
      badge: '직독직해',
      desc: '의미 단위 끊어읽기 & WPM 훈련',
    },
    {
      id: 'paraphrase-tracing',
      label: '핵심어 재진술 역추적',
      icon: Sparkles,
      badge: '동시 하이라이트',
      desc: '추상화 역추적 & 퀴즈',
    },
    {
      id: 'metacognition',
      label: '메타인지 오답노트',
      icon: BookOpenCheck,
      badge: '4대 오류 진단',
      desc: '사고 과정 결함 분석 & 솔루션',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Bar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm text-white font-bold text-lg">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Gemini CSAT Master <span className="text-slate-400 font-normal text-xs sm:text-sm">| AI 독해 & 메타인지 코치</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  평가원 출제코드
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                수능 국어·영어 지문 논리 구조화 · 선지 패러프레이징 추적 · 구문 청킹 · 메타인지 오답 처방
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              id="btn-open-system-prompt"
              onClick={onOpenSystemInstruction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs"
              title="Google AI Studio System Instruction & 프롬프트 설계 확인"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Studio 설정 (Prompt Spec)</span>
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      isActive
                        ? 'bg-indigo-700 text-indigo-100'
                        : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
