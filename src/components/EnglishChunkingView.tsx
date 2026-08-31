import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  RefreshCw, 
  Scissors, 
  Gauge, 
  BookOpen,
  Volume2,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';
import { EnglishChunkResponse, CSATPreset } from '../types';
import { CSAT_PRESETS } from '../data/presets';

export const EnglishChunkingView: React.FC = () => {
  const englishPresets = CSAT_PRESETS.filter((p) => p.subject === 'english');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(englishPresets[0]?.id || '');
  const [sentenceInput, setSentenceInput] = useState<string>(englishPresets[0]?.passage || '');
  const [isPassageLocked, setIsPassageLocked] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EnglishChunkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Speed Chunk Timer state
  const [isPlayingTimer, setIsPlayingTimer] = useState<boolean>(false);
  const [activeChunkGlobalIndex, setActiveChunkGlobalIndex] = useState<number>(0);
  const [wpmSpeed, setWpmSpeed] = useState<number>(160); // words per minute
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Flattened all chunks across sentences for speed reading trainer
  const allChunks = result?.sentences.flatMap((s, sIdx) => 
    s.chunks.map((c, cIdx) => ({
      sentenceIndex: sIdx,
      chunkIndex: cIdx,
      en: c.en,
      ko: c.ko,
      grammar: c.grammar,
    }))
  ) || [];

  const handleSelectPreset = (preset: CSATPreset) => {
    setSelectedPresetId(preset.id);
    setSentenceInput(preset.passage);
    setIsPassageLocked(true);
    setResult(null);
    setError(null);
    setIsPlayingTimer(false);
    setActiveChunkGlobalIndex(0);
  };

  const handleAnalyze = async () => {
    if (!sentenceInput.trim()) {
      setError('영어 문장 또는 지문을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsPlayingTimer(false);
    setActiveChunkGlobalIndex(0);

    try {
      const response = await fetch('/api/english/chunking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: sentenceInput }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '영어 구문 청킹 분석에 실패했습니다.');
      }

      const data: EnglishChunkResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer interval calculation based on average word count in current chunk
  useEffect(() => {
    if (isPlayingTimer && allChunks.length > 0) {
      const currentChunk = allChunks[activeChunkGlobalIndex];
      const wordCount = currentChunk?.en ? currentChunk.en.trim().split(/\s+/).length : 2;
      // Duration in ms = (wordCount / WPM) * 60,000 ms (min 800ms for cognitive processing)
      const durationMs = Math.max(900, Math.round((wordCount / wpmSpeed) * 60000));

      timerRef.current = setTimeout(() => {
        if (activeChunkGlobalIndex < allChunks.length - 1) {
          setActiveChunkGlobalIndex((prev) => prev + 1);
        } else {
          setIsPlayingTimer(false);
          setActiveChunkGlobalIndex(0);
        }
      }, durationMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlayingTimer, activeChunkGlobalIndex, allChunks, wpmSpeed]);

  const handleToggleTimer = () => {
    if (allChunks.length === 0) return;
    setIsPlayingTimer(!isPlayingTimer);
  };

  const handleResetTimer = () => {
    setIsPlayingTimer(false);
    setActiveChunkGlobalIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                기능 3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">영어 의미 단위 타이머 (Chunking & 직독직해)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              영어 문장을 의미 단위(Chunk)로 슬래시(/) 분할하고, 속독 타이머(WPM)와 함께 눈과 뇌가 동시에 직독직해하는 훈련을 제공합니다.
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

        {/* Input with Lock Controls */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>분석할 영어 문장 또는 단락</span>
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
            id="english-chunk-input"
            value={sentenceInput}
            readOnly={isPassageLocked}
            onChange={(e) => setSentenceInput(e.target.value)}
            rows={5}
            placeholder="I have a dream that one day this nation will rise up..."
            className={`w-full rounded-lg p-3.5 text-xs sm:text-sm text-slate-900 border leading-relaxed font-sans transition-all ${
              isPassageLocked
                ? 'bg-slate-50/90 border-slate-200 cursor-default select-text focus:outline-none'
                : 'bg-white border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />

          <div className="flex justify-end">
            <button
              id="btn-analyze-english-chunking"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>의미 단위(Chunk) 분해 중...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4 text-indigo-200" />
                  <span>슬래시 청킹 & 직독직해 분석</span>
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
          {/* Speed Reading Chunk Trainer Interactive Bar */}
          {allChunks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>직독직해 실전 타이머 훈련 (Speed Chunking Flash)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {activeChunkGlobalIndex + 1} / {allChunks.length} Chunks
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      수능 시험장에서 요구되는 목표 독해 속도(160~200 WPM)에 맞춰 리듬감 있게 의미 단위를 읽어내려갑니다.
                    </p>
                  </div>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                    <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-slate-500 font-medium">속도:</span>
                    <select
                      value={wpmSpeed}
                      onChange={(e) => setWpmSpeed(Number(e.target.value))}
                      className="bg-transparent text-indigo-700 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value={120} className="bg-white text-slate-900">120 WPM (기초)</option>
                      <option value={160} className="bg-white text-slate-900">160 WPM (수능 표준)</option>
                      <option value={200} className="bg-white text-slate-900">200 WPM (고득점)</option>
                      <option value={250} className="bg-white text-slate-900">250 WPM (속독 마스터)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleToggleTimer}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                      isPlayingTimer
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isPlayingTimer ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>일시정지</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>타이머 시작</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetTimer}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                    title="처음부터 다시 시작"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Chunk Spotlight Card */}
              {allChunks[activeChunkGlobalIndex] && (
                <div className="mt-4 p-5 rounded-xl bg-indigo-50/50 border border-indigo-200 text-center space-y-2">
                  <span className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase">
                    Current Focus Chunk ({allChunks[activeChunkGlobalIndex].grammar})
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 font-serif tracking-wide">
                    {allChunks[activeChunkGlobalIndex].en}
                  </div>
                  <div className="text-sm font-semibold text-indigo-900 font-sans">
                    👉 {allChunks[activeChunkGlobalIndex].ko}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Slashed Sentences & Detailed Chunk Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Scissors className="w-4 h-4 text-indigo-600" />
              <span>문장별 슬래시(/) 직독직해 & 구문 분석</span>
            </h3>

            <div className="space-y-4">
              {result.sentences.map((sent, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  {/* Slashed English vs Korean Output */}
                  <div className="space-y-2.5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center border border-indigo-200">
                        {sent.sentenceIndex || sIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Sentence {sent.sentenceIndex || sIdx + 1}
                      </span>
                    </div>

                    {/* Slashed English */}
                    <div className="p-3.5 rounded-lg bg-indigo-50/40 border border-indigo-100 text-sm font-medium text-slate-900 leading-relaxed font-serif">
                      {sent.slashedEn}
                    </div>

                    {/* Slashed Korean */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      {sent.slashedKo}
                    </div>
                  </div>

                  {/* Chunk Items Visual Tags */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      의미 단위 덩어리별 세부 매칭:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {sent.chunks.map((chunk, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-colors shadow-xs"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 mb-1">
                            <span>Chunk {cIdx + 1}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {chunk.grammar}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 font-serif">
                            {chunk.en}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {chunk.ko}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Full natural translation & syntax notes */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
                    <div>
                      <span className="font-bold text-slate-700">전체 번역: </span>
                      <span className="text-slate-800">{sent.fullTranslation}</span>
                    </div>

                    {sent.syntaxNotes && sent.syntaxNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {sent.syntaxNotes.map((note, nIdx) => (
                          <span
                            key={nIdx}
                            className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] border border-indigo-200 font-semibold"
                          >
                            💡 {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
