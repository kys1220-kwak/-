import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Sparkles, Code2, BookOpen } from 'lucide-react';

interface SystemInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemInstructionModal: React.FC<SystemInstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const systemInstructionText = `# 페르소나
당신은 대한민국 수능 국어/영어 독해 전문가이자, 학생들의 인지 구조를 분석하는 학습 코치입니다.

# 핵심 임무
1. 지문의 논리적 구조화: 문단 간의 인과, 대립, 병렬 관계를 명확히 분석합니다.
2. 패러프레이징 추적: 선지의 내용이 지문의 어느 부분에서 어떻게 변형되었는지 논리적으로 증명합니다.
3. 구문 분석: 영어 문장을 의미 단위(Chunk)로 쪼개고, 추상적 개념을 구체화합니다.
4. 모든 출력은 앱 UI에 적합하도록 구조화된 데이터(JSON 형식 권장)로 제공할 수 있어야 합니다.

# 분석 원칙
- 국어: 접속어(그러나, 따라서), 대립 구도(A vs B), 개념 정의에 집중합니다.
- 영어: 관계대명사, 분사구문 등을 기준으로 의미 단위를 끊고, 핵심 키워드의 재진술(Reiteration)을 추적합니다.
- 메타인지: 학생이 틀린 이유를 논리적으로 분류(독해/어휘/선지판단/논리 비약)합니다.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Google AI Studio 설정 (System Instruction & Prompts)
              </h2>
              <p className="text-xs text-slate-500">
                수능 국어/영어 독해 전문가 페르소나 및 4대 기능별 프롬프트 명세
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin">
          {/* Section 1: System Instruction */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  1. AI Studio 설정: System Instruction
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(systemInstructionText, 'system-instruction')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors border border-indigo-200"
              >
                {copiedSection === 'system-instruction' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>복사하기</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {systemInstructionText}
            </pre>
          </div>

          {/* Section 2: Prompts */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                2. 기능별 프롬프트 설계 (Prompt Engineering)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">기능 1: 국어 지문 구조화</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">문단 맵핑</span>
                </div>
                <p className="text-xs text-slate-700">
                  아래 지문을 분석하여 각 문단의 핵심 내용을 요약하고, 문단 간의 논리적 관계(원인-결과, 대조, 상술, 예시)를 정의해줘.
                </p>
                <div className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 p-2 rounded-lg">
                  Paragraphs: [&#123;index: 1, summary: "", keywords: []&#125;]<br/>
                  LogicMap: [&#123;from: 1, to: 2, relation: "대조", indicator: "반면"&#125;]
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">기능 2: 선지 근거 자동 매칭</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">패러프레이징</span>
                </div>
                <p className="text-xs text-slate-700">
                  다음 문제의 각 선지가 지문의 어느 문장에서 근거했는지 찾아내고, 어떻게 패러프레이징 되었는지 분석해줘.
                </p>
                <div className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 p-2 rounded-lg">
                  선지 1: [지문 내 근거 문장] -&gt; [변형 원리: 유의어 교체/일반화/구체화 등] -&gt; [정오 판정 이유]
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">기능 3: 영어 의미 단위 타이머</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">Chunking</span>
                </div>
                <p className="text-xs text-slate-700">
                  다음 영어 문장을 학생이 직독직해하기 가장 좋은 의미 단위(Chunk)로 슬래시(/)를 사용하여 쪼개고 직역을 붙여줘.
                </p>
                <div className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 p-2 rounded-lg">
                  "I / have a dream / that one day..."<br/>
                  -&gt; "나는 / 꿈이 있습니다 / 언젠가..."
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">기능 4: 핵심어 추상화 역추적</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">재진술 퀴즈</span>
                </div>
                <p className="text-xs text-slate-700">
                  지문에서 가장 중요한 핵심 개념(Core Concept)을 잡고, 지문 내에서 어떤 다른 단어로 재진술(Paraphrasing) 되었는지 모두 찾아줘.
                </p>
                <div className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 p-2 rounded-lg">
                  핵심 개념: "Technology's negative impact"<br/>
                  재진술 1: "Digital distraction" ...
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Metacognition Error Note */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                3. 실전 감각: 메타인지 오답 노트 시스템
              </h3>
            </div>
            <p className="text-xs text-slate-700">
              학생의 선택 번호, 정답, 학생의 틀린 이유 메모를 대조하여 4대 인지 오류로 정밀 분류하고 솔루션을 제공합니다:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <span className="p-2 rounded-lg bg-white text-slate-800 border border-slate-200 text-center font-semibold shadow-xs">① 독해 오류</span>
              <span className="p-2 rounded-lg bg-white text-slate-800 border border-slate-200 text-center font-semibold shadow-xs">② 어휘 부족</span>
              <span className="p-2 rounded-lg bg-white text-slate-800 border border-slate-200 text-center font-semibold shadow-xs">③ 선지 판단 실수</span>
              <span className="p-2 rounded-lg bg-white text-slate-800 border border-slate-200 text-center font-semibold shadow-xs">④ 논리 비약</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
