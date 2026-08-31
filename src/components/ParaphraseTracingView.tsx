import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Highlighter, 
  Target, 
  Layers, 
  Brain,
  Quote,
  Lock,
  Unlock
} from 'lucide-react';
import { ParaphraseTracingResponse, CSATPreset } from '../types';
import { CSAT_PRESETS } from '../data/presets';

export const ParaphraseTracingView: React.FC = () => {
  const englishPresets = CSAT_PRESETS.filter((p) => p.subject === 'english');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(englishPresets[1]?.id || englishPresets[0]?.id || '');
  const [passageInput, setPassageInput] = useState<string>(
    englishPresets[1]?.passage || englishPresets[0]?.passage || ''
  );
  const [isPassageLocked, setIsPassageLocked] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ParaphraseTracingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active highlighted phrase id (for simultaneous highlight across the passage)
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>('ALL');

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  const handleSelectPreset = (preset: CSATPreset) => {
    setSelectedPresetId(preset.id);
    setPassageInput(preset.passage);
    setIsPassageLocked(true);
    setResult(null);
    setError(null);
    setActiveHighlightId('ALL');
    setSelectedQuizAnswers({});
    setIsQuizSubmitted(false);
  };

  const handleAnalyze = async () => {
    if (!passageInput.trim()) {
      setError('영어 지문을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveHighlightId('ALL');
    setSelectedQuizAnswers({});
    setIsQuizSubmitted(false);

    try {
      const response = await fetch('/api/english/paraphrase-tracing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passage: passageInput }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '재진술 역추적 분석에 실패했습니다.');
      }

      const data: ParaphraseTracingResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simultaneous Highlight Rendering: highlights all or active paraphrase items in the passage
  const renderPassageWithParaphraseHighlights = () => {
    if (!result || !result.paraphraseItems || result.paraphraseItems.length === 0) {
      return <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">{passageInput}</p>;
    }

    // Determine which phrases to highlight
    const itemsToHighlight = activeHighlightId === 'ALL'
      ? result.paraphraseItems
      : result.paraphraseItems.filter((item) => item.id === activeHighlightId);

    // Escape regex special chars
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const regexPattern = itemsToHighlight
      .map((item) => escapeRegExp(item.phrase.trim()))
      .filter((p) => p.length > 0)
      .join('|');

    if (!regexPattern) {
      return <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">{passageInput}</p>;
    }

    const regex = new RegExp(`(${regexPattern})`, 'gi');
    const parts = passageInput.split(regex);

    const colors = [
      'bg-indigo-100 text-indigo-950 border-indigo-300',
      'bg-amber-100 text-amber-950 border-amber-300',
      'bg-emerald-100 text-emerald-950 border-emerald-300',
      'bg-purple-100 text-purple-950 border-purple-300',
    ];

    return (
      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
        {parts.map((part, i) => {
          const matchIndex = itemsToHighlight.findIndex(
            (item) => item.phrase.trim().toLowerCase() === part.trim().toLowerCase()
          );

          if (matchIndex !== -1) {
            const matchedItem = itemsToHighlight[matchIndex];
            const colorClass = colors[matchIndex % colors.length];

            return (
              <mark
                key={i}
                onClick={() => setActiveHighlightId(matchedItem.id)}
                className={`cursor-pointer px-1 py-0.5 rounded border transition-all inline-block font-semibold ${colorClass} ${
                  activeHighlightId === matchedItem.id ? 'ring-2 ring-indigo-500 scale-105 shadow-xs' : 'hover:scale-105'
                }`}
                title={`[${matchedItem.type}] ${matchedItem.explanation}`}
              >
                {part}
              </mark>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                기능 4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">핵심어 추상화 역추적 (영어 재진술 퀴즈 & 하이라이트)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              지문 내 가장 중요한 핵심 개념(Core Concept)을 도출하고, 어떻게 패러프레이징(재진술) 되었는지 동시 하이라이트 및 퀴즈로 훈련합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">수능 기출 예시:</span>
            {englishPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {preset.title.split('-')[1]?.trim() || preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input with Lock Safeguards */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>분석할 영어 지문</span>
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
            id="english-paraphrase-input"
            value={passageInput}
            readOnly={isPassageLocked}
            onChange={(e) => setPassageInput(e.target.value)}
            rows={6}
            placeholder="영어 지문 내용을 입력하세요..."
            className={`w-full rounded-lg p-3.5 text-xs sm:text-sm text-slate-900 border leading-relaxed font-sans transition-all ${
              isPassageLocked
                ? 'bg-slate-50/90 border-slate-200 cursor-default select-text focus:outline-none'
                : 'bg-white border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />

          <div className="flex justify-end">
            <button
              id="btn-analyze-paraphrase-tracing"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>핵심 개념 & 재진술 역추적 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>재진술(Reiteration) 역추적 실행</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Core Concept Header Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>지문 핵심 개념 (Core Concept)</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-serif tracking-wide">
                "{result.coreConcept}"
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {result.conceptDefinition}
              </p>
            </div>

            {result.contrastConcept && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-slate-500" />
                  <span>대립/상반 개념</span>
                </div>
                <div className="text-base font-bold text-slate-800 font-serif">
                  "{result.contrastConcept}"
                </div>
              </div>
            )}
          </div>

          {/* Interactive Split View: Passage with Simultaneous Highlights (Left) vs Reiteration Cards (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Passage with Real-time Multi-Highlight */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Highlighter className="w-4 h-4 text-indigo-600" />
                  <span>지문 내 동시 하이라이트 (Simultaneous Highlight)</span>
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveHighlightId('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeHighlightId === 'ALL'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    전체 보기
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-h-[500px] overflow-y-auto scrollbar-thin">
                {renderPassageWithParaphraseHighlights()}
              </div>

              <p className="text-[11px] text-slate-500">
                💡 오른쪽 재진술 카드 또는 지문 내 형광펜 단어를 클릭하면 같은 맥락의 표현들이 강조됩니다.
              </p>
            </div>

            {/* Right: Paraphrase Items Breakdown */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>재진술(Paraphrasing) 목록 및 변형 원리</span>
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                {result.paraphraseItems?.map((item, idx) => {
                  const isSelected = activeHighlightId === item.id || activeHighlightId === 'ALL';
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => setActiveHighlightId(item.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        activeHighlightId === item.id
                          ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-serif">
                          재진술 {idx + 1}: "{item.phrase}"
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {item.type}
                        </span>
                      </div>

                      <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                        {item.explanation}
                      </p>

                      {item.context && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-serif italic">
                          "{item.context}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reiteration Quiz Section */}
          {result.quizzes && result.quizzes.length > 0 && (
            <div className="bg-white border border-indigo-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    🧠 재진술 역추적 메타인지 퀴즈
                  </h3>
                </div>
                {!isQuizSubmitted ? (
                  <button
                    onClick={() => setIsQuizSubmitted(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                  >
                    정답 확인 및 해설 보기
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    다시 풀기
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {result.quizzes.map((quiz, qIdx) => {
                  const selectedOpt = selectedQuizAnswers[qIdx];
                  const isCorrect = isQuizSubmitted && selectedOpt === quiz.answerIndex;

                  return (
                    <div
                      key={qIdx}
                      className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-3"
                    >
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        Q{qIdx + 1}. {quiz.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quiz.options.map((opt, optIdx) => {
                          const isChosen = selectedOpt === optIdx;
                          const isRealAnswer = isQuizSubmitted && optIdx === quiz.answerIndex;
                          const isWrongChosen = isQuizSubmitted && isChosen && !isRealAnswer;

                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                          if (isChosen && !isQuizSubmitted) {
                            btnStyle = 'bg-indigo-600 text-white border-indigo-600 shadow-xs';
                          } else if (isRealAnswer) {
                            btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                          } else if (isWrongChosen) {
                            btnStyle = 'bg-red-50 border-red-300 text-red-900';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                              className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>
                                {optIdx + 1}. {opt}
                              </span>
                              {isRealAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                              {isWrongChosen && <XCircle className="w-4 h-4 text-red-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {isQuizSubmitted && (
                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs space-y-1">
                          <span className="font-bold text-indigo-900">
                            {isCorrect ? '🎉 정답입니다!' : `❌ 오답 (정답: ${quiz.answerIndex + 1}번)`}
                          </span>
                          <p className="text-slate-700 leading-relaxed font-sans">
                            {quiz.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
