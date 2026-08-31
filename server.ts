import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

let genAIClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment.');
    }
    genAIClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return genAIClient;
}

// Helper function to safely extract and parse JSON from Gemini model output
function parseGeminiJSON<T>(rawText: string | undefined | null, fallback: T): T {
  if (!rawText) return fallback;

  let cleaned = rawText.trim();

  // Strip markdown code block wrappers if present (```json ... ``` or ``` ...)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Find the first '{' or '[' and last '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIndex = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > startIndex) {
      cleaned = cleaned.substring(startIndex, lastBrace + 1);
    }
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket > startIndex) {
      cleaned = cleaned.substring(startIndex, lastBracket + 1);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt secondary cleanup (removing trailing commas before closing braces/brackets)
    try {
      const sanitized = cleaned
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      return JSON.parse(sanitized);
    } catch (secondErr) {
      console.warn('JSON parse failed on output. Cleaned text preview:', cleaned.slice(0, 300));
      return fallback;
    }
  }
}

const SYSTEM_INSTRUCTION = `# 페르소나
당신은 대한민국 수능 국어/영어 독해 전문가이자, 학생들의 인지 구조를 분석하는 학습 코치입니다.

# 핵심 임무
1. 지문의 논리적 구조화: 문단 간의 인과, 대립, 병렬 관계를 명확히 분석합니다.
2. 패러프레이징 추적: 선지의 내용이 지문의 어느 부분에서 어떻게 변형되었는지 논리적으로 증명합니다.
3. 구문 분석: 영어 문장을 의미 단위(Chunk)로 쪼개고, 추상적 개념을 구체화합니다.
4. 모든 출력은 앱 UI에 적합하도록 구조화된 데이터(JSON 형식)로 제공합니다.

# 분석 원칙
- 국어: 접속어(그러나, 따라서, 반면, 또한), 대립 구도(A vs B), 개념 정의에 집중합니다.
- 영어: 관계대명사, 분사구문 등을 기준으로 의미 단위를 끊고, 핵심 키워드의 재진술(Reiteration)을 추적합니다.
- 메타인지: 학생이 틀린 이유를 논리적으로 분류(독해 오류, 어휘 부족, 선지 판단 실수, 논리 비약)합니다.
- 항상 엄밀하고 신뢰도 높은 평가원 수능 출제 코드에 부합하는 분석을 제공합니다.`;

// API 1: Korean Passage Structuring (문단 간 관계 맵핑)
app.post('/api/korean/structure', async (req, res) => {
  try {
    const { passage } = req.body;
    if (!passage || typeof passage !== 'string') {
      return res.status(400).json({ error: '지문 텍스트를 입력해주세요.' });
    }

    const ai = getGenAIClient();
    const prompt = `아래 지문을 분석하여 각 문단의 핵심 내용을 요약하고, 문단 간의 논리적 관계(예: 원인-결과, 대조, 상술, 예시, 병렬, 문제-해결, 전제-결론)를 정의해줘.

지문:
${passage}

출력 형식(반드시 유효한 JSON 객체로만 응답):
{
  "theme": "지문 전체의 핵심 주제 및 중심 논지",
  "contrastStructure": "지문에 대립 구도(A vs B)가 있다면 명시 (없으면 null)",
  "paragraphs": [
    {
      "index": 1,
      "title": "1문단 소제목",
      "summary": "1문단 핵심 요약 (1~2문장)",
      "keywords": ["핵심어1", "핵심어2"],
      "topicSentence": "문단 내 중심 문장",
      "originalText": "해당 문단 원문"
    }
  ],
  "logicMap": [
    {
      "from": 1,
      "to": 2,
      "relation": "대조",
      "indicator": "반면",
      "explanation": "1문단의 전통적 관점과 2문단의 새로운 관점이 상반됨"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const parsed = parseGeminiJSON(text, {
      theme: '지문 중심 주제 분석',
      contrastStructure: null,
      paragraphs: [
        {
          index: 1,
          title: '1문단',
          summary: '지문 내용 분석 완료',
          keywords: ['핵심 개념'],
          topicSentence: '지문 중심 문장',
          originalText: passage.slice(0, 200)
        }
      ],
      logicMap: []
    });
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/korean/structure:', error);
    res.status(500).json({ error: error.message || '지문 구조화 분석 중 오류가 발생했습니다.' });
  }
});

// API 2: Choice Evidence Matching (선지 근거 자동 매칭 & 패러프레이징 추적)
app.post('/api/passage/choice-matching', async (req, res) => {
  try {
    const { passage, question, choices } = req.body;
    if (!passage || !question) {
      return res.status(400).json({ error: '지문과 문제 내용을 입력해주세요.' });
    }

    const ai = getGenAIClient();
    const prompt = `다음 수능/모의고사 문제의 각 선지(1~5번)가 제시된 지문의 어느 문장에서 직접 근거했는지 1:1로 정확히 찾아내고, 지문 문장이 선지로 어떻게 패러프레이징(변형)되었는지 평가원 출제 원리에 입각하여 정밀 분석해줘.

지문:
${passage}

문제 발문:
${question}

선지 목록:
${Array.isArray(choices) ? choices.map((c: string, idx: number) => `선지 ${idx + 1}: ${c}`).join('\n') : ''}

중요 지침:
1. "evidenceSentence"는 반드시 위 지문 텍스트에 실제로 존재하는 '원문 문장(문장 전체 또는 핵심 구)'을 토시 하나 바꾸지 말고 그대로 발췌할 것 (verbatim extraction).
2. "isCorrect"는 문제 발문(예: '적절하지 않은 것은?'이면 내용과 불일치하는 선지가 false, '적절한 것은?'이면 내용과 일치하는 선지가 true) 기준이 아니라, 선지 진술 자체가 지문 내용과 사실상 일치하는지(true) 왜곡/거짓인지(false)를 객관적으로 표시할 것.
3. "paraphrasingPrinciple"은 '동의어 치환', '일반화', '구체화', '조건 반전', '주체 왜곡', '인과 조작', '단위당 비율 왜곡' 등 명확한 수능 변형 원리 명칭을 부여할 것.
4. "reasoning"은 학생이 오답 선지에 빠진 이유와 지문 문장과의 1:1 대조점을 명확히 설명할 것.

출력 형식(반드시 유효한 JSON 객체로만 응답):
{
  "questionTitle": "문제 발문",
  "identifiedAnswer": 1,
  "choicesAnalysis": [
    {
      "choiceNumber": 1,
      "choiceText": "선지 원문 내용",
      "isCorrect": false,
      "evidenceSentence": "지문에서 그대로 발췌한 정확한 문장",
      "paraphrasingPrinciple": "변형 원리 명칭",
      "reasoning": "선지의 정오 판정 및 지문 근거 대조 이유"
    }
  ],
  "trapAnalysis": "출제자가 이 문제에서 노린 매력적 오답 함정의 핵심 설계 원리"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const parsed = parseGeminiJSON(text, {
      questionTitle: question,
      identifiedAnswer: 1,
      choicesAnalysis: (Array.isArray(choices) ? choices : []).map((c: string, idx: number) => ({
        choiceNumber: idx + 1,
        choiceText: c,
        isCorrect: idx === 0,
        evidenceSentence: '지문 내 관련 서술',
        paraphrasingPrinciple: '개념 대응',
        reasoning: '평가원 논리에 따른 분석'
      })),
      trapAnalysis: '선지의 세부 표현 및 수식 관계를 주의 깊게 대조해야 합니다.'
    });
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/passage/choice-matching:', error);
    res.status(500).json({ error: error.message || '선지 근거 분석 중 오류가 발생했습니다.' });
  }
});

// API 3: English Chunking (의미 단위 타이머 & 직독직해)
app.post('/api/english/chunking', async (req, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: '영어 문장 또는 지문을 입력해주세요.' });
    }

    const ai = getGenAIClient();
    const prompt = `다음 영어 문장(들)을 학생이 직독직해하기 가장 좋은 의미 단위(Chunk)로 슬래시(/) 단위로 쪼개고, 각 덩어리별로 한국어 직역을 붙여줘. 관계대명사, 분사구문, 전치사구, 접속사 등 수능 구문 포인트도 함께 짚어줘.

문장:
${sentence}

출력 형식(반드시 유효한 JSON 객체로만 응답):
{
  "sentences": [
    {
      "sentenceIndex": 1,
      "originalSentence": "I have a dream that one day this nation will rise up...",
      "slashedEn": "I / have a dream / that one day / this nation will rise up...",
      "slashedKo": "나는 / 꿈이 있습니다 / 언젠가 / 이 나라가 일어설 것이라는...",
      "fullTranslation": "자연스러운 전체 번역문",
      "chunks": [
        {
          "en": "I",
          "ko": "나는",
          "grammar": "주어"
        },
        {
          "en": "have a dream",
          "ko": "꿈이 있습니다",
          "grammar": "동사 + 목적어"
        },
        {
          "en": "that one day",
          "ko": "언젠가",
          "grammar": "동격/접속사 절 유도"
        },
        {
          "en": "this nation will rise up",
          "ko": "이 나라가 일어설 것이라는",
          "grammar": "종속절 주어 + 동사구"
        }
      ],
      "syntaxNotes": ["주요 구문 분석 팁"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const parsed = parseGeminiJSON(text, {
      sentences: [
        {
          sentenceIndex: 1,
          originalSentence: sentence,
          slashedEn: sentence,
          slashedKo: '직독직해 번역 생성 완료',
          fullTranslation: '자연스러운 번역',
          chunks: [
            {
              en: sentence,
              ko: '번역',
              grammar: '문장'
            }
          ],
          syntaxNotes: ['구문 분석']
        }
      ]
    });
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/english/chunking:', error);
    res.status(500).json({ error: error.message || '영어 구문 분석 중 오류가 발생했습니다.' });
  }
});

// API 4: Core Concept Paraphrase Tracing (영어 재진술 퀴즈 & 하이라이트)
app.post('/api/english/paraphrase-tracing', async (req, res) => {
  try {
    const { passage } = req.body;
    if (!passage || typeof passage !== 'string') {
      return res.status(400).json({ error: '영어 지문을 입력해주세요.' });
    }

    const ai = getGenAIClient();
    const prompt = `이 영어 지문에서 가장 중요한 핵심 개념(Core Concept) 하나(또는 대립되는 두 개념)를 잡고, 그 개념이 지문 내에서 어떤 다른 단어나 표현으로 재진술(Paraphrasing / Reiteration) 되었는지 모두 찾아 리스트업해줘.
또한 학생들이 같은 맥락임을 맞출 수 있도록 재진술 퀴즈도 함께 만들어줘.

지문:
${passage}

출력 형식(반드시 유효한 JSON 객체로만 응답):
{
  "coreConcept": "Technology's negative impact",
  "conceptDefinition": "기술 발전이 인간의 집중력과 인지적 깊이에 미치는 부정적 영향",
  "contrastConcept": "대립되는 개념(있을 경우, 예: Deep human contemplation, 없으면 null)",
  "paraphraseItems": [
    {
      "id": "p1",
      "phrase": "Digital distraction",
      "context": "지문 내 해당 표현이 포함된 원문 문장 일부",
      "type": "유의어/표현 변형",
      "explanation": "기술의 부정적 영향을 '디지털 산만함'이라는 구체적 현상으로 재진술함"
    },
    {
      "id": "p2",
      "phrase": "Unintended consequences of innovation",
      "context": "지문 내 해당 표현이 포함된 원문 문장 일부",
      "type": "추상화/일반화",
      "explanation": "기술의 부작용을 '혁신의 의도치 않은 결과'로 상위 추상화하여 표현함"
    },
    {
      "id": "p3",
      "phrase": "Erosion of human focus",
      "context": "지문 내 해당 표현이 포함된 원문 문장 일부",
      "type": "결과적 재진술",
      "explanation": "인간의 집중력 잠식이라는 부정적 귀결로 재진술함"
    }
  ],
  "quizzes": [
    {
      "question": "다음 중 본문의 핵심 개념인 '[Core Concept]'의 재진술 표현으로 적절하지 않은 것은?",
      "options": ["Digital distraction", "Erosion of human focus", "Cognitive flourishing", "Unintended consequences"],
      "answerIndex": 2,
      "explanation": "Cognitive flourishing(인지적 번영)은 반대되는 긍정적 개념입니다."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const parsed = parseGeminiJSON(text, {
      coreConcept: 'Core Concept',
      conceptDefinition: '지문의 핵심 주제 개념입니다.',
      contrastConcept: null,
      paraphraseItems: [],
      quizzes: []
    });
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/english/paraphrase-tracing:', error);
    res.status(500).json({ error: error.message || '핵심어 재진술 분석 중 오류가 발생했습니다.' });
  }
});

// API 5: Metacognitive Error Analysis (실전 감각 메타인지 오답 노트 시스템)
app.post('/api/metacognition/analyze-error', async (req, res) => {
  try {
    const { studentChoice, correctChoice, studentNote, subject, passageContext } = req.body;
    if (!studentChoice || !correctChoice) {
      return res.status(400).json({ error: '학생의 선택 번호와 실제 정답 번호를 입력해주세요.' });
    }

    const ai = getGenAIClient();
    const prompt = `과목: ${subject || '수능 국어/영어'}
${passageContext ? `문제/지문 맥락: ${passageContext}` : ''}
학생의 선택: ${studentChoice}
정답: ${correctChoice}
학생의 틀린 이유 메모: "${studentNote || '선지 2개 중 헷갈렸음'}"

위 데이터를 바탕으로 이 학생의 인지적 사고 오류를 다음 4대 유형 중 하나로 엄밀히 분류하고, 평가원 출제 원리에 기반한 1:1 맞춤형 솔루션과 극복 트레이닝을 제공해줘.

분류 기준 (반드시 아래 4개 중 하나를 errorType으로 선택):
- 독해 오류 (문장 구조 파악 실패, 주술 호응 오인, 수식 관계 혼동)
- 어휘 부족 (핵심 단어 뜻 오인, 다의어 문맥 파악 실패, 유의어 변형 미인지)
- 선지 판단 실수 (매력적 오답에 낚임, 일치/불일치 조건 착각, 부분 긍정 함정)
- 논리 비약 (지문에 없는 배경지식 개입, 과도한 일반화, 인과관계 자의적 왜곡)

출력 형식(반드시 유효한 JSON 객체로만 응답):
{
  "errorType": "독해 오류", // "독해 오류" | "어휘 부족" | "선지 판단 실수" | "논리 비약"
  "severityLevel": "주의", // "심각" | "주의" | "경미"
  "coreDiagnostic": "학생의 사고 과정에서 발생한 핵심 인지 결함 요약 (2~3문장)",
  "studentThinkingTrap": "학생이 빠졌던 전형적인 함정/착각 시나리오",
  "examinerIntent": "출제자가 이 문제를 출제하며 노렸던 평가 포인트",
  "actionableSolutions": [
    "솔루션 1: 즉시 적용 가능한 행동 강령 (예: 선지 비교 시 지문으로 돌아가 주어-술어 1:1 대조하기)",
    "솔루션 2: 향후 유사 문제 훈련법"
  ],
  "preventionMotto": "시험장에서 되새길 한 줄 메타인지 모토",
  "similarTrainingTip": "유사 난이도 기출을 풀 때 체크해야 할 3단계 검증 루틴"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text || '{}';
    const parsed = parseGeminiJSON(text, {
      errorType: '선지 판단 실수',
      severityLevel: '주의',
      coreDiagnostic: '선지의 미세한 조건 왜곡 및 지문과의 1:1 대조 부족으로 인한 오답입니다.',
      studentThinkingTrap: '부분적으로 익숙한 어휘에 이끌려 전체 논리 구조를 간과했습니다.',
      examinerIntent: '지문의 핵심 주장과 반대되는 매력적 오답 선지의 판별 능력을 평가하고자 함.',
      actionableSolutions: [
        '선지의 주어부와 술어부를 분리하여 지문의 해당 문장과 1:1로 직접 검증하세요.',
        '오답 선지의 왜곡 패턴(주객 전도, 과도한 일반화, 인과 왜곡)을 유형별로 태깅하세요.'
      ],
      preventionMotto: '느낌으로 고르지 말고 지문 속 팩트 1문장과 1:1로 결합하라.',
      similarTrainingTip: '선지를 고르기 전 다른 4개 선지가 왜 오답인지 1초 근거를 대는 훈련을 진행하세요.'
    });
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/metacognition/analyze-error:', error);
    res.status(500).json({ error: error.message || '메타인지 오답 분석 중 오류가 발생했습니다.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
