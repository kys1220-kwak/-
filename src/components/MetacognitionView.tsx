import React, { useState, useEffect } from 'react';
import { 
  BookOpenCheck, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle, 
  Flame, 
  CheckCircle2, 
  ShieldAlert, 
  Lightbulb, 
  PieChart, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MetacognitionAnalysis, StoredErrorNote, CognitiveErrorType, CSATPreset } from '../types';
import { CSAT_PRESETS } from '../data/presets';

const STORAGE_KEY = 'csat_metacognition_error_notes_v1';

export const MetacognitionView: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'국어' | '영어'>('국어');
  const [questionTitle, setQuestionTitle] = useState<string>(
    '2024 수능 국어 14번 [노직과 롤스의 정의관]'
  );
  const [studentChoice, setStudentChoice] = useState<string>('3');
  const [correctChoice, setCorrectChoice] = useState<string>('1');
  const [studentNote, setStudentNote] = useState<string>(
    '1번에서 노직이 결과적 불평등 개입을 부정한다는 걸 깜빡하고, 3번 선지가 왠지 틀린 것 같아서 헷갈리다가 찍었습니다.'
  );
  const [passageContext, setPassageContext] = useState<string>(
    '노직의 소유 권리론과 롤스의 차등의 원칙 비교 지문'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MetacognitionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stored notes in localStorage
  const [storedNotes, setStoredNotes] = useState<StoredErrorNote[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setStoredNotes(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveNotesToStorage = (notes: StoredErrorNote[]) => {
    setStoredNotes(notes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  };

  const handleApplyPreset = (preset: CSATPreset) => {
    setSelectedSubject(preset.subject === 'korean' ? '국어' : '영어');
    setQuestionTitle(preset.title);
    setStudentChoice(preset.studentChoice || '3');
    setCorrectChoice(preset.correctChoice || '1');
    setStudentNote(preset.sampleStudentNote || '2번과 4번 중에서 헷갈려서 감으로 찍음.');
    setPassageContext(preset.passage.substring(0, 150) + '...');
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!studentChoice.trim() || !correctChoice.trim()) {
      setError('학생의 선택 번호와 실제 정답 번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/metacognition/analyze-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          questionTitle,
          studentChoice,
          correctChoice,
          studentNote,
          passageContext,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '메타인지 오답 분석에 실패했습니다.');
      }

      const data: MetacognitionAnalysis = await response.json();
      setAnalysisResult(data);

      // Auto save into stored notes archive
      const newNote: StoredErrorNote = {
        id: `note-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        subject: selectedSubject,
        questionTitle: questionTitle || `${selectedSubject} 기출 오답`,
        studentChoice,
        correctChoice,
        studentNote,
        analysis: data,
      };

      const updated = [newNote, ...storedNotes];
      saveNotesToStorage(updated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    const updated = storedNotes.filter((n) => n.id !== id);
    saveNotesToStorage(updated);
  };

  const handleCopyNote = (note: StoredErrorNote) => {
    const text = `[메타인지 오답노트 - ${note.subject}] ${note.questionTitle}
- 학생 선택: ${note.studentChoice}번 / 실제 정답: ${note.correctChoice}번
- 오류 유형: ${note.analysis.errorType} (${note.analysis.severityLevel})
- 인지 결함 진단: ${note.analysis.coreDiagnostic}
- 시험장 모토: "${note.analysis.preventionMotto}"
- 액션 솔루션:
${note.analysis.actionableSolutions.map((s) => `  * ${s}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Error type distribution stats
  const typeCounts: Record<CognitiveErrorType, number> = {
    '독해 오류': 0,
    '어휘 부족': 0,
    '선지 판단 실수': 0,
    '논리 비약': 0,
  };

  storedNotes.forEach((n) => {
    if (typeCounts[n.analysis.errorType] !== undefined) {
      typeCounts[n.analysis.errorType]++;
    }
  });

  const filteredNotes = filterType === 'ALL'
    ? storedNotes
    : storedNotes.filter((n) => n.analysis.errorType === filterType);

  const getErrorTypeColor = (type: CognitiveErrorType) => {
    switch (type) {
      case '독해 오류':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '어휘 부족':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '선지 판단 실수':
        return 'bg-red-50 text-red-700 border-red-200';
      case '논리 비약':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                기능 5 (메타인지 코칭)
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">실전 감각 메타인지 오답 노트 시스템</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              학생이 틀린 선택과 이유 메모를 대조하여 4대 인지 오류(독해/어휘/선지판단/논리비약)로 정밀 분류하고 맞춤 처방을 제공합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">기출 오답 샘플:</span>
            {CSAT_PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors"
              >
                {preset.title.split('-')[1]?.trim() || preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">과목 선택</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubject('국어')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    selectedSubject === '국어'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  수능 국어
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject('영어')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    selectedSubject === '영어'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  수능 영어
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-red-600 mb-1">내 선택</label>
                <input
                  type="text"
                  value={studentChoice}
                  onChange={(e) => setStudentChoice(e.target.value)}
                  placeholder="예: 3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-center text-red-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-700 mb-1">실제 정답</label>
                <input
                  type="text"
                  value={correctChoice}
                  onChange={(e) => setCorrectChoice(e.target.value)}
                  placeholder="예: 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-center text-emerald-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">문제명 / 출처</label>
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="예: 2024 수능 국어 14번"
                className="w-full bg-slate-50/60 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="md:col-span-9 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                학생의 틀린 이유 자가 메모 (사고 과정 회고)
              </label>
              <textarea
                id="student-note-input"
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                rows={3}
                placeholder="예: 단어를 몰랐어요 / 2번이랑 4번 중에 헷갈렸어요 / 지문에 이런 내용이 있었던 것 같아서 찍음..."
                className="w-full bg-slate-50/60 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                지문 요약/맥락 (선택 사항)
              </label>
              <input
                type="text"
                value={passageContext}
                onChange={(e) => setPassageContext(e.target.value)}
                placeholder="지문의 핵심 제재나 상황을 짧게 적어주세요..."
                className="w-full bg-slate-50/40 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                id="btn-analyze-metacognition"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>인지적 사고 오류 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>메타인지 오류 진단 & 솔루션 생성</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Latest Analysis Result Card */}
      {analysisResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getErrorTypeColor(analysisResult.errorType)}`}>
                {analysisResult.errorType}
              </span>
              <span className="text-xs font-medium text-slate-500">
                심각도: <strong className="text-amber-700 font-bold">{analysisResult.severityLevel}</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>오답 노트 보관함에 자동 저장되었습니다</span>
            </div>
          </div>

          {/* Diagnostic & Traps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>심층 인지 결함 진단 (Cognitive Diagnosis)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {analysisResult.coreDiagnostic}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>학생이 빠졌던 전형적 사고 함정</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {analysisResult.studentThinkingTrap}
              </p>
            </div>
          </div>

          {/* Action Solutions */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>평가원 출제 원리 기반 1:1 맞춤형 극복 솔루션</span>
            </div>
            <ul className="space-y-1.5">
              {analysisResult.actionableSolutions.map((sol, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  <span className="text-indigo-600 font-bold mt-0.5">•</span>
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention Motto Banner */}
          {analysisResult.preventionMotto && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  시험장 실전 메타인지 모토
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  "{analysisResult.preventionMotto}"
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stored Error Notes Archive & Error Statistics */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              나의 메타인지 오답 보관함 ({storedNotes.length}개 누적)
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">유형 필터:</span>
            {['ALL', '독해 오류', '어휘 부족', '선지 판단 실수', '논리 비약'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {type === 'ALL' ? '전체' : type}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Tier Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['독해 오류', '어휘 부족', '선지 판단 실수', '논리 비약'] as CognitiveErrorType[]).map((type) => (
            <div key={type} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">{type}</span>
              <span className="text-sm font-bold text-indigo-700">{typeCounts[type]}회</span>
            </div>
          ))}
        </div>

        {/* Stored Notes List */}
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            저장된 오답 노트가 없습니다. 위 입력창에서 오답을 진단해보세요!
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition-colors shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{note.questionTitle}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getErrorTypeColor(note.analysis.errorType)}`}>
                      {note.analysis.errorType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {note.createdAt}
                    </span>
                    <button
                      onClick={() => handleCopyNote(note)}
                      className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="클립보드에 복사"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 flex items-center gap-3">
                  <span className="text-red-600 font-semibold">내 선택: {note.studentChoice}번</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-emerald-700 font-semibold">정답: {note.correctChoice}번</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 truncate">메모: {note.studentNote}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-indigo-900">💡 {note.analysis.coreDiagnostic}</div>
                  <div className="text-amber-800 font-medium text-[11px]">
                    "{note.analysis.preventionMotto}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
