import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Layers, 
  Split, 
  RefreshCw, 
  BookOpen, 
  HelpCircle,
  Trophy,
  Sliders,
  Lock,
  Unlock,
  ShieldCheck
} from 'lucide-react';
import { KoreanStructureResponse, CSATPreset } from '../types';
import { CSAT_PRESETS } from '../data/presets';

export const KoreanStructureView: React.FC = () => {
  const koreanPresets = CSAT_PRESETS.filter((p) => p.subject === 'korean');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(koreanPresets[0]?.id || '');
  const [passageInput, setPassageInput] = useState<string>(koreanPresets[0]?.passage || '');
  const [isPassageLocked, setIsPassageLocked] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<KoreanStructureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Interactive Challenge Mode: Student guesses relations between paragraphs
  const [isChallengeMode, setIsChallengeMode] = useState<boolean>(false);
  const [userGuesses, setUserGuesses] = useState<{ [key: string]: string }>({});
  const [challengeEvaluated, setChallengeEvaluated] = useState<boolean>(false);

  const handleSelectPreset = (preset: CSATPreset) => {
    setSelectedPresetId(preset.id);
    setPassageInput(preset.passage);
    setIsPassageLocked(true);
    setResult(null);
    setError(null);
    setChallengeEvaluated(false);
    setUserGuesses({});
  };

  const handleAnalyze = async () => {
    if (!passageInput.trim()) {
      setError('지문 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setChallengeEvaluated(false);

    try {
      const response = await fetch('/api/korean/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passage: passageInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '지문 구조화 분석에 실패했습니다.');
      }

      const data: KoreanStructureResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const relationOptions = ['대조', '원인-결과', '상술', '예시', '병렬', '문제-해결', '전제-결론'];

  const handleGuessChange = (mapKey: string, relation: string) => {
    setUserGuesses((prev) => ({ ...prev, [mapKey]: relation }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                Module 01
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">국어 지문 구조화 & 문단 간 관계 맵핑</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              문단별 핵심 요약, 중심 문장, 키워드를 추출하고 접속어·대립 구도(A vs B)에 기반한 논리 관계를 블록으로 시각화합니다.
            </p>
          </div>

          {/* Quick CSAT Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">수능 기출 예시:</span>
            {koreanPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
                }`}
              >
                {preset.title.split('-')[1]?.trim() || preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Passage Input Area with Lock Safeguards */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>분석할 국어 지문</span>
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
            id="korean-passage-input"
            value={passageInput}
            readOnly={isPassageLocked}
            onChange={(e) => setPassageInput(e.target.value)}
            rows={7}
            placeholder="[1문단] 지문 내용을 입력하세요..."
            className={`w-full rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 border leading-relaxed font-sans transition-all ${
              isPassageLocked
                ? 'bg-slate-50/90 border-slate-200 cursor-default select-text focus:outline-none'
                : 'bg-white border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500'
            }`}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isChallengeMode}
                onChange={(e) => setIsChallengeMode(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-indigo-700">학생 인터랙티브 챌린지 모드</span>
              <span className="text-slate-400">(내가 먼저 문단 관계를 맞추고 AI와 대조)</span>
            </label>

            <button
              id="btn-analyze-korean-structure"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>평가원 논리 구조 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>지문 구조화 & 관계 맵핑 실행</span>
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

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>지문 핵심 주제 및 중심 논지</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                {result.theme}
              </p>
            </div>

            {result.contrastStructure && (
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                  <Split className="w-4 h-4 text-amber-600" />
                  <span>지문 내 대립 구도 (A vs B)</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-900 leading-relaxed">
                  {result.contrastStructure}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Challenge Section (if enabled) */}
          {isChallengeMode && result.logicMap && result.logicMap.length > 0 && (
            <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    🎯 인터랙티브 챌린지: 문단 간 관계를 직접 맞춰보세요!
                  </h3>
                </div>
                <button
                  onClick={() => setChallengeEvaluated(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                >
                  AI 정답과 비교 및 채점
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.logicMap.map((mapItem, idx) => {
                  const key = `${mapItem.from}-${mapItem.to}`;
                  const selectedGuess = userGuesses[key] || '';
                  const isCorrect = challengeEvaluated && selectedGuess === mapItem.relation;
                  const isWrong = challengeEvaluated && selectedGuess !== mapItem.relation;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        challengeEvaluated
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-red-50 border-red-300 text-red-900'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                        <span>{mapItem.from}문단 → {mapItem.to}문단 관계:</span>
                        {challengeEvaluated && (
                          <span className={`text-[11px] font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                            {isCorrect ? '정답 일치 (+100)' : `정답: ${mapItem.relation}`}
                          </span>
                        )}
                      </div>
                      <select
                        value={selectedGuess}
                        onChange={(e) => handleGuessChange(key, e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">관계 선택하기...</option>
                        {relationOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {challengeEvaluated && (
                        <p className="mt-2 text-[11px] text-slate-600 leading-snug">
                          💡 접속 표지어: <span className="text-indigo-700 font-semibold">{mapItem.indicator || '맥락 전환'}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Logic Blocks & Flow Mapping Visualizer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>문단별 논리 구조 블록 (Paragraph Logic Blocks)</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">총 {result.paragraphs.length}개 문단 분석됨</span>
            </div>

            <div className="space-y-4">
              {result.paragraphs.map((para, idx) => {
                const nextRelation = result.logicMap?.find((m) => m.from === para.index);

                return (
                  <div key={para.index} className="space-y-3">
                    {/* Paragraph Card with Sleek Line Indicator */}
                    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 sm:p-6 shadow-sm transition-all relative pl-7 sm:pl-8 border-l-4 border-l-indigo-500">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2.5">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                            {para.index}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {para.title || `${para.index}문단`}
                          </h4>
                        </div>

                        {/* Keywords */}
                        {para.keywords && para.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {para.keywords.map((kw, kidx) => (
                              <span
                                key={kidx}
                                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content summary & topic sentence */}
                      <div className="mt-3.5 space-y-2.5">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">문단 핵심 요약</span>
                          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {para.summary}
                          </p>
                        </div>

                        {para.topicSentence && (
                          <div className="p-3 rounded-lg bg-indigo-50/40 border border-indigo-100">
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-0.5">문단 내 중심 문장 (Topic Sentence)</span>
                            <p className="text-xs sm:text-sm text-slate-800 font-serif italic leading-relaxed">
                              "{para.topicSentence}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Relation Connector to Next Paragraph */}
                    {nextRelation && (
                      <div className="flex items-center justify-center my-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs">
                          <div className="flex items-center gap-1 text-indigo-700 font-bold">
                            <ArrowDown className="w-3.5 h-3.5" />
                            <span>[{nextRelation.relation}]</span>
                          </div>
                          {nextRelation.indicator && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                              표지어: {nextRelation.indicator}
                            </span>
                          )}
                          <span className="text-slate-500 text-[11px] hidden sm:inline">
                            {nextRelation.explanation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
