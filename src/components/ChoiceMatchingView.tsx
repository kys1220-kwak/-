import React, { useState } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Search,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Highlighter,
  Lock,
  Unlock,
  ShieldCheck,
  Check,
  Layers,
  FileText
} from 'lucide-react';
import { ChoiceMatchingResponse, CSATPreset } from '../types';
import { CSAT_PRESETS } from '../data/presets';

export const ChoiceMatchingView: React.FC = () => {
  const initialPreset = CSAT_PRESETS[0];
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPreset?.id || '');
  const [passageInput, setPassageInput] = useState<string>(initialPreset?.passage || '');
  const [questionInput, setQuestionInput] = useState<string>(initialPreset?.question || '');
  const [choicesInput, setChoicesInput] = useState<string[]>(
    initialPreset?.choices || ['', '', '', '', '']
  );
  
  // Lock state: Default to LOCKED (수정 방지 모드) so passage & choices are protected against accidental edits
  const [isPassageLocked, setIsPassageLocked] = useState<boolean>(true);
  const [isChoicesLocked, setIsChoicesLocked] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Default to the pre-analyzed result of initial preset for instant matching
  const [result, setResult] = useState<ChoiceMatchingResponse | null>(
    initialPreset?.defaultChoiceMatching || null
  );
  const [error, setError] = useState<string | null>(null);

  // Currently focused choice for highlighting in the passage (1 ~ 5)
  const [activeChoiceNumber, setActiveChoiceNumber] = useState<number>(1);

  const handleSelectPreset = (preset: CSATPreset) => {
    setSelectedPresetId(preset.id);
    setPassageInput(preset.passage);
    setQuestionInput(preset.question || '');
    setChoicesInput(preset.choices || ['', '', '', '', '']);
    setIsPassageLocked(true);
    setIsChoicesLocked(true);
    setError(null);
    setActiveChoiceNumber(1);

    // If preset has pre-computed matching, load it immediately for instant responsiveness
    if (preset.defaultChoiceMatching) {
      setResult(preset.defaultChoiceMatching);
    } else {
      setResult(null);
    }
  };

  const handleChoiceChange = (idx: number, val: string) => {
    if (isChoicesLocked) return;
    const next = [...choicesInput];
    next[idx] = val;
    setChoicesInput(next);
  };

  const toggleAllLocks = () => {
    const nextState = !(isPassageLocked && isChoicesLocked);
    setIsPassageLocked(nextState);
    setIsChoicesLocked(nextState);
  };

  const handleAnalyze = async () => {
    if (!passageInput.trim() || !questionInput.trim()) {
      setError('지문과 문제 발문 내용을 모두 입력해주세요.');
      return;
    }

    const filledChoices = choicesInput.filter((c) => c.trim().length > 0);
    if (filledChoices.length < 2) {
      setError('최소 2개 이상의 선지를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/passage/choice-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passage: passageInput,
          question: questionInput,
          choices: filledChoices,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '선지 근거 분석에 실패했습니다.');
      }

      const data: ChoiceMatchingResponse = await response.json();
      setResult(data);
      if (data.choicesAnalysis && data.choicesAnalysis.length > 0) {
        setActiveChoiceNumber(data.choicesAnalysis[0].choiceNumber);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // High-precision passage rendering with evidence highlighting
  const renderHighlightedPassage = () => {
    if (!result || !result.choicesAnalysis || result.choicesAnalysis.length === 0) {
      return (
        <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans select-text">
          {passageInput}
        </div>
      );
    }

    const activeAnalysis = result.choicesAnalysis.find((c) => c.choiceNumber === activeChoiceNumber);
    if (!activeAnalysis || !activeAnalysis.evidenceSentence) {
      return (
        <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans select-text">
          {passageInput}
        </div>
      );
    }

    const rawEvidence = activeAnalysis.evidenceSentence.trim().replace(/^["']|["']$/g, '');
    
    // Method 1: Exact substring match
    let index = passageInput.indexOf(rawEvidence);

    // Method 2: Normalized whitespace / clean substring search if exact failed
    if (index === -1) {
      const cleanP = passageInput.replace(/\s+/g, ' ');
      const cleanE = rawEvidence.replace(/\s+/g, ' ');
      const cleanIdx = cleanP.indexOf(cleanE);
      if (cleanIdx !== -1) {
        // Find approximate position in original passage
        index = 0;
        let pChar = 0;
        let cChar = 0;
        while (pChar < passageInput.length && cChar < cleanIdx) {
          if (/\s/.test(passageInput[pChar]) && /\s/.test(passageInput[pChar + 1])) {
            pChar++;
          } else {
            pChar++;
            cChar++;
          }
        }
        index = pChar;
      }
    }

    // If direct index found, split and render with glowing highlight
    if (index !== -1 && index + rawEvidence.length <= passageInput.length + 50) {
      const before = passageInput.substring(0, index);
      const matched = passageInput.substring(index, index + rawEvidence.length);
      const after = passageInput.substring(index + rawEvidence.length);

      return (
        <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans select-text">
          <span>{before}</span>
          <mark className="bg-amber-100/90 text-amber-950 px-2 py-1 rounded-md border-l-4 border-amber-500 font-medium shadow-xs inline-block my-1 ring-2 ring-amber-400/40">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded mr-1.5 uppercase">
              <Highlighter className="w-2.5 h-2.5" /> 선지 {activeChoiceNumber}번 근거
            </span>
            {matched || rawEvidence}
          </mark>
          <span>{after}</span>
        </div>
      );
    }

    // Method 3: Sentence-level overlap scoring
    // Split into sentences / paragraphs
    const sentences = passageInput.split('\n');
    const searchKeywords = rawEvidence.split(/\s+/).filter(w => w.length > 2);

    return (
      <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans select-text">
        {sentences.map((sent, i) => {
          if (!sent.trim()) return <div key={i} className="h-2" />;

          // Count matching keywords
          const matchedCount = searchKeywords.filter(k => sent.includes(k)).length;
          const isKeyMatch = matchedCount >= Math.min(2, searchKeywords.length) && searchKeywords.length > 0;

          if (isKeyMatch) {
            return (
              <div
                key={i}
                className="bg-amber-100/90 text-amber-950 p-3 rounded-lg border-l-4 border-amber-500 font-medium shadow-xs ring-2 ring-amber-400/30 transition-all"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 mb-1">
                  <Highlighter className="w-3 h-3 text-amber-700" />
                  <span>선지 {activeChoiceNumber}번 핵심 근거 문장 매칭</span>
                </div>
                <p className="leading-relaxed">{sent}</p>
              </div>
            );
          }

          return (
            <p key={i} className="text-slate-800">
              {sent}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                기능 2 (국어/영어 공통)
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">선지 근거 자동 매칭 & 패러프레이징 추적</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              각 선지가 지문의 어느 문장에서 직접 근거했는지 1:1로 밝혀내고, 평가원 수능 출제 공식에 따른 패러프레이징 변형 원리를 증명합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">수능 기출 예시:</span>
            {CSAT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {preset.title.split('-')[1]?.trim() || preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Global Protection / Editing Banner */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isPassageLocked && isChoicesLocked
                ? '지문 및 선지 보호 모드 (실수로 내용이 변경되거나 지워지지 않도록 안전하게 고정됨)'
                : '직접 편집 모드 (지문과 선지를 자유롭게 수정하거나 새로운 문제를 입력할 수 있음)'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleAllLocks}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            {isPassageLocked && isChoicesLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>문제 전체 직접 수정하기</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>문제 전체 고정(잠금)</span>
              </>
            )}
          </button>
        </div>

        {/* Input Form with Lock Safeguards */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Passage & Question */}
          <div className="lg:col-span-7 space-y-3">
            {/* Passage Input & Lock */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span>지문 원문 (국어 / 영어)</span>
                  {isPassageLocked ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Lock className="w-3 h-3" /> 지문 고정됨 (수정 방지)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Unlock className="w-3 h-3" /> 지문 편집 가능
                    </span>
                  )}
                </label>

                <button
                  type="button"
                  onClick={() => setIsPassageLocked(!isPassageLocked)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                >
                  {isPassageLocked ? (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>지문 수정 허용</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>지문 고정(잠금)</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={passageInput}
                readOnly={isPassageLocked}
                onChange={(e) => setPassageInput(e.target.value)}
                rows={8}
                placeholder="지문 내용을 입력하세요..."
                className={`w-full rounded-lg p-3.5 text-xs sm:text-sm text-slate-900 border leading-relaxed font-sans transition-all ${
                  isPassageLocked
                    ? 'bg-slate-50/90 border-slate-200 cursor-default select-text focus:outline-none'
                    : 'bg-white border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Question Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                문제 발문
              </label>
              <input
                type="text"
                value={questionInput}
                readOnly={isPassageLocked}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="예: 위 글을 바탕으로 <보기>의 입장을 평가한 것으로 적절하지 않은 것은?"
                className={`w-full rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 border transition-all ${
                  isPassageLocked
                    ? 'bg-slate-50/90 border-slate-200 cursor-default select-text focus:outline-none'
                    : 'bg-white border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Right Column: Choices (1 to 5) with Individual Lock Controls */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <span>선지 목록 (1번 ~ 5번)</span>
                {isChoicesLocked ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Lock className="w-3 h-3" /> 선지 고정됨
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Unlock className="w-3 h-3" /> 선지 편집 가능
                  </span>
                )}
              </label>

              <button
                type="button"
                onClick={() => setIsChoicesLocked(!isChoicesLocked)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                {isChoicesLocked ? (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>선지 수정 허용</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>선지 고정(잠금)</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {choicesInput.map((choice, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={choice}
                    readOnly={isChoicesLocked}
                    onChange={(e) => handleChoiceChange(idx, e.target.value)}
                    placeholder={`선지 ${idx + 1}번 내용...`}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs text-slate-900 border transition-all ${
                      isChoicesLocked
                        ? 'bg-slate-100/80 border-slate-200 cursor-default select-text focus:outline-none'
                        : 'bg-white border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                </div>
              ))}
            </div>

            <button
              id="btn-analyze-choice-matching"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>평가원 논리 & 패러프레이징 정밀 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>선지 근거 자동 매칭 실행</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Section: Instant Evidence & Paraphrasing Visualizer */}
      {result && (
        <div className="space-y-6">
          {/* Trap Analysis Banner */}
          {result.trapAnalysis && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4.5 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-0.5">평가원 매력적 오답 함정 분석</h4>
                <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">{result.trapAnalysis}</p>
              </div>
            </div>
          )}

          {/* Interactive Split View: Passage (Left) vs Choices Analysis (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Passage with Real-Time Evidence Highlighting */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Highlighter className="w-4 h-4 text-indigo-600" />
                  <span>지문 내 근거 문장 하이라이트</span>
                </h3>

                {/* Quick Choice Selector Pills */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">선지 전환:</span>
                  {result.choicesAnalysis?.map((c) => (
                    <button
                      key={c.choiceNumber}
                      onClick={() => setActiveChoiceNumber(c.choiceNumber)}
                      className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center transition-all ${
                        activeChoiceNumber === c.choiceNumber
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {c.choiceNumber}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-h-[580px] overflow-y-auto scrollbar-thin">
                {renderHighlightedPassage()}
              </div>
            </div>

            {/* Right: Choices Analysis Cards */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-indigo-600" />
                <span>선지별 1:1 근거 & 패러프레이징 변형 분석</span>
              </h3>

              <div className="space-y-3 max-h-[580px] overflow-y-auto scrollbar-thin pr-1">
                {result.choicesAnalysis?.map((choice) => {
                  const isActive = activeChoiceNumber === choice.choiceNumber;
                  return (
                    <div
                      key={choice.choiceNumber}
                      onClick={() => setActiveChoiceNumber(choice.choiceNumber)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        isActive
                          ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Choice Header */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                              choice.isCorrect
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {choice.choiceNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            선지 {choice.choiceNumber}번
                          </span>
                          {choice.isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> 일치/적절
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <XCircle className="w-3 h-3" /> 불일치/왜곡(오답)
                            </span>
                          )}
                        </div>

                        {choice.paraphrasingPrinciple && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {choice.paraphrasingPrinciple}
                          </span>
                        )}
                      </div>

                      {/* Choice Text */}
                      <p className="mt-2 text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                        {choice.choiceText}
                      </p>

                      {/* Evidence & Reasoning */}
                      <div className="mt-3 space-y-2">
                        {choice.evidenceSentence && (
                          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/90">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                              <Highlighter className="w-3 h-3" /> 지문 내 1:1 근거 문장:
                            </span>
                            <p className="text-xs text-amber-950 font-serif italic leading-relaxed">
                              "{choice.evidenceSentence}"
                            </p>
                          </div>
                        )}

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            정오 판정 및 평가원 변형 논리:
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-sans">
                            {choice.reasoning}
                          </p>
                        </div>
                      </div>
                    </div>
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
