export type SubjectType = 'korean' | 'english';

export type TabType = 
  | 'korean-structure'
  | 'choice-matching'
  | 'english-chunking'
  | 'paraphrase-tracing'
  | 'metacognition';

// 1. Korean Structure Types
export interface KoreanParagraph {
  index: number;
  title: string;
  summary: string;
  keywords: string[];
  topicSentence?: string;
  originalText: string;
}

export interface LogicMapItem {
  from: number;
  to: number;
  relation: string; // '대조' | '원인-결과' | '상술' | '예시' | '병렬' | '문제-해결' | '전제-결론'
  indicator: string; // '그러나', '따라서', '반면', '또한', '예컨대'
  explanation: string;
}

export interface KoreanStructureResponse {
  theme: string;
  contrastStructure?: string | null;
  paragraphs: KoreanParagraph[];
  logicMap: LogicMapItem[];
}

// 2. Choice Matching Types
export interface ChoiceAnalysisItem {
  choiceNumber: number;
  choiceText: string;
  isCorrect: boolean;
  evidenceSentence: string;
  paraphrasingPrinciple: string; // '유의어 교체' | '일반화' | '구체화' | '조건 반전' | '주체 왜곡' | '과도한 인과'
  reasoning: string;
}

export interface ChoiceMatchingResponse {
  questionTitle: string;
  identifiedAnswer: number;
  choicesAnalysis: ChoiceAnalysisItem[];
  trapAnalysis: string;
}

// 3. English Chunking Types
export interface ChunkItem {
  en: string;
  ko: string;
  grammar: string;
}

export interface SentenceChunkItem {
  sentenceIndex: number;
  originalSentence: string;
  slashedEn: string;
  slashedKo: string;
  fullTranslation: string;
  chunks: ChunkItem[];
  syntaxNotes?: string[];
}

export interface EnglishChunkResponse {
  sentences: SentenceChunkItem[];
}

// 4. Paraphrase Tracing Types
export interface ParaphraseItem {
  id: string;
  phrase: string;
  context: string;
  type: string;
  explanation: string;
}

export interface ParaphraseQuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ParaphraseTracingResponse {
  coreConcept: string;
  conceptDefinition: string;
  contrastConcept?: string | null;
  paraphraseItems: ParaphraseItem[];
  quizzes: ParaphraseQuizItem[];
}

// 5. Metacognition Error Types
export type CognitiveErrorType = '독해 오류' | '어휘 부족' | '선지 판단 실수' | '논리 비약';

export interface MetacognitionAnalysis {
  errorType: CognitiveErrorType;
  severityLevel: '심각' | '주의' | '경미';
  coreDiagnostic: string;
  studentThinkingTrap: string;
  examinerIntent: string;
  actionableSolutions: string[];
  preventionMotto: string;
  similarTrainingTip: string;
}

export interface StoredErrorNote {
  id: string;
  createdAt: string;
  subject: string;
  questionTitle: string;
  studentChoice: string;
  correctChoice: string;
  studentNote: string;
  analysis: MetacognitionAnalysis;
}

// Preset Data Structure
export interface CSATPreset {
  id: string;
  title: string;
  badge: string;
  subject: SubjectType;
  category: string;
  passage: string;
  question?: string;
  choices?: string[];
  correctChoice?: string;
  studentChoice?: string;
  sampleStudentNote?: string;
  defaultChoiceMatching?: ChoiceMatchingResponse;
  defaultStructure?: KoreanStructureResponse;
  defaultChunking?: EnglishChunkResponse;
  defaultParaphrase?: ParaphraseTracingResponse;
}
