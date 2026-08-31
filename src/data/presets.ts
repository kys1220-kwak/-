import { CSATPreset } from '../types';

export const CSAT_PRESETS: CSATPreset[] = [
  {
    id: 'korean-1',
    title: '2024 수능 국어 [인문/철학] - 노직의 권리론과 롤스의 정의관',
    badge: '2024 수능 국어 12~17번 기출',
    subject: 'korean',
    category: '국어 독서 (비문학)',
    passage: `[1문단]
현대 사회에서 분배의 정의를 어떻게 실현할 것인가는 중요한 철학적 논쟁거리이다. 롤스는 원초적 입장에서 합의되는 정의의 원칙을 제시하며, 최소 수혜자에게 최대의 이익을 보장하는 차등의 원칙을 강조하였다. 반면 노직은 개인의 자유와 소유권을 절대시하는 소유 권리론을 바탕으로 롤스의 정형적 분배관을 정면으로 비판하였다.

[2문단]
노직에 따르면 재화의 취득과 양도 과정에서 부정이 개입되지 않았다면, 그로 인해 형성된 소유물에 대한 권리는 절대적으로 정당하다. 노직은 역사적 원리를 채택하여 과거의 행위가 정당했다면 그 결과로서의 불평등은 교정의 대상이 아니라고 보았다. 즉, 강제적인 재분배는 개인의 노동과 자유를 침해하는 부당한 국가의 강제력 행사에 불과하다는 것이다.

[3문단]
그러나 롤스는 개인의 타고난 재능이나 사회적 배경과 같은 우연적 요소는 도덕적 관점에서 자의적인 것이라고 보았다. 따라서 이러한 우연성으로 인한 결과는 공동의 자산으로 간주되어야 하며, 불평등은 사회의 가장 열악한 사람들의 처지를 개선할 때에만 정당화될 수 있다.

[4문단]
결국 두 사상가의 대립은 국가의 역할에 대한 근본적인 견해 차이로 이어진다. 노직은 계약 집행과 치안 유지에만 한정된 '최소국가'를 옹호한 반면, 롤스는 사회적 불평등을 적극적으로 보정하는 복지국가적 개입을 정당화하였다.`,
    question: `위 글을 바탕으로 <보기>의 사상가 입장을 평가한 것으로 적절하지 않은 것은?`,
    choices: [
      '노직은 취득과 양도의 정당성이 확보된 재화라도 결과적 불평등이 심화되면 국가가 개입해야 한다고 본다.',
      '롤스는 자연적 재능의 분배 상태 자체는 자의적이지만, 이를 다루는 사회 제도의 정의로움은 평가될 수 있다고 본다.',
      '노직은 과거의 정당한 행위로부터 비롯된 소유권은 현재의 분배 형태와 상관없이 보장되어야 한다고 본다.',
      '롤스는 최소 수혜자의 처지를 개선하는 한도 내에서만 소득과 부의 불평등을 허용할 수 있다고 본다.',
      '노직과 롤스 모두 개인의 권리를 중시하지만, 국가의 재분배 정책에 대한 정당성 인정 여부에서 견해를 달리한다.'
    ],
    correctChoice: '1',
    studentChoice: '1',
    sampleStudentNote: '1번에서 노직이 개입을 부정한다는 걸 깜빡하고 3번 선지와 헷갈려서 시간 부족으로 찍었습니다.',
    defaultChoiceMatching: {
      questionTitle: '위 글을 바탕으로 <보기>의 사상가 입장을 평가한 것으로 적절하지 않은 것은?',
      identifiedAnswer: 1,
      choicesAnalysis: [
        {
          choiceNumber: 1,
          choiceText: '노직은 취득과 양도의 정당성이 확보된 재화라도 결과적 불평등이 심화되면 국가가 개입해야 한다고 본다.',
          isCorrect: false,
          evidenceSentence: '노직은 역사적 원리를 채택하여 과거의 행위가 정당했다면 그 결과로서의 불평등은 교정의 대상이 아니라고 보았다. 즉, 강제적인 재분배는 개인의 노동과 자유를 침해하는 부당한 국가의 강제력 행사에 불과하다는 것이다.',
          paraphrasingPrinciple: '조건 반전 및 논리 왜곡',
          reasoning: '지문에서 노직은 과거 행위가 정당했다면 결과적 불평등은 교정 대상이 아니며 국가 개입을 부정한다고 명시하였으므로, 개입해야 한다고 서술한 1번은 지문과 정반대로 진술된 오답(적절하지 않은 선지)입니다.'
        },
        {
          choiceNumber: 2,
          choiceText: '롤스는 자연적 재능의 분배 상태 자체는 자의적이지만, 이를 다루는 사회 제도의 정의로움은 평가될 수 있다고 본다.',
          isCorrect: true,
          evidenceSentence: '그러나 롤스는 개인의 타고난 재능이나 사회적 배경과 같은 우연적 요소는 도덕적 관점에서 자의적인 것이라고 보았다. 따라서 이러한 우연성으로 인한 결과는 공동의 자산으로 간주되어야 하며, 불평등은 사회의 가장 열악한 사람들의 처지를 개선할 때에만 정당화될 수 있다.',
          paraphrasingPrinciple: '상술 및 심화 도출',
          reasoning: '3문단에서 롤스는 자연적 우연성은 자의적이므로 사회 제도(최소 수혜자 개선)를 통해 정당화해야 한다고 보았으므로 지문과 일치합니다.'
        },
        {
          choiceNumber: 3,
          choiceText: '노직은 과거의 정당한 행위로부터 비롯된 소유권은 현재의 분배 형태와 상관없이 보장되어야 한다고 본다.',
          isCorrect: true,
          evidenceSentence: '노직에 따르면 재화의 취득과 양도 과정에서 부정이 개입되지 않았다면, 그로 인해 형성된 소유물에 대한 권리는 절대적으로 정당하다.',
          paraphrasingPrinciple: '유의어 및 개념 치환',
          reasoning: '2문단에서 과거 취득/양도가 정당했다면 형성된 소유물 권리는 절대적으로 정당하다고 서술되어 있으므로 부합합니다.'
        },
        {
          choiceNumber: 4,
          choiceText: '롤스는 최소 수혜자의 처지를 개선하는 한도 내에서만 소득과 부의 불평등을 허용할 수 있다고 본다.',
          isCorrect: true,
          evidenceSentence: '롤스는 원초적 입장에서 합의되는 정의의 원칙을 제시하며, 최소 수혜자에게 최대의 이익을 보장하는 차등의 원칙을 강조하였다.',
          paraphrasingPrinciple: '핵심 조건 재진술',
          reasoning: '1문단과 3문단에서 롤스의 차등 원칙(최소 수혜자의 이익 개선 시에만 불평등 정당화)을 정확히 재진술한 선지입니다.'
        },
        {
          choiceNumber: 5,
          choiceText: '노직과 롤스 모두 개인의 권리를 중시하지만, 국가의 재분배 정책에 대한 정당성 인정 여부에서 견해를 달리한다.',
          isCorrect: true,
          evidenceSentence: '결국 두 사상가의 대립은 국가의 역할에 대한 근본적인 견해 차이로 이어진다. 노직은 계약 집행과 치안 유지에만 한정된 \'최소국가\'를 옹호한 반면, 롤스는 사회적 불평등을 적극적으로 보정하는 복지국가적 개입을 정당화하였다.',
          paraphrasingPrinciple: '대조 구조 종합 정리',
          reasoning: '4문단에서 노직(최소국가/재분배 부정)과 롤스(복지국가적 개입 정당화)의 핵심 대조점을 올바르게 요약하였습니다.'
        }
      ],
      trapAnalysis: '수능 평가원 인문 철학 고난도 문항의 전형적인 함정 패턴으로, 노직의 \'역사적 원리\'(과정이 정당하면 결과적 불평등은 무관)를 롤스의 \'결과 보정 원리\'와 교묘하게 뒤섞어 주어와 술어의 인과관계를 반전시켰습니다.'
    }
  },
  {
    id: 'korean-2',
    title: '2023 수능 국어 [과학/생명] - 클라이버의 법칙과 대사율',
    badge: '2023 수능 국어 고난도 비문학',
    subject: 'korean',
    category: '국어 독서 (비문학)',
    passage: `[1문단]
동물의 몸집이 커질수록 생명 유지에 필요한 에너지 소모량인 기초대사량도 증가한다. 그러나 몸집이 2배로 커진다고 해서 기초대사량도 2배가 되는 것은 아니다. 생물학자들은 오랫동안 몸의 부피와 표면적의 기하학적 관계에 주목하여 체중의 2/3제곱에 비례할 것이라 추정하였다.

[2문단]
하지만 클라이버(Kleiber)는 정밀한 측정을 통해 동물의 기초대사량이 체중의 2/3제곱이 아니라 3/4제곱(0.75제곱)에 비례한다는 사실을 밝혀냈다. 이를 '클라이버의 법칙'이라고 부른다. 이는 체중이 증가하는 비율에 비해 기초대사량의 증가 비율이 완만하다는 것을 의미한다.

[3문단]
이러한 현상이 발생하는 원인은 체내 순환계의 프랙탈 네트워크 구조에서 기인한다. 동물의 혈관망은 산소와 영양소를 말초 세포까지 효율적으로 공급하기 위해 프랙탈 형태로 분지되어 있으며, 몸집이 커질수록 유체 저항을 최소화하는 방식으로 최적화되기 때문에 체중당 대사 효율이 오히려 향상된다.

[4문단]
따라서 소형 동물(쥐)은 체중 1g당 대사율이 매우 높아 심장이 빠르게 뛰고 끊임없이 먹이를 섭취해야 하지만, 대형 동물(코끼리)은 체중당 대사율이 낮아 상대적으로 긴 수명과 완만한 심박수를 유지하게 된다.`,
    question: `위 글의 내용과 일치하지 않는 것은?`,
    choices: [
      '클라이버의 법칙에 따르면 몸집이 커질수록 단위 체중당 기초대사량은 감소한다.',
      '생물학자들의 초기 가설은 몸의 부피에 비례하여 열 방출량이 결정된다는 전제에 기반했다.',
      '혈관망의 프랙탈 분지 구조는 대형 동물이 체내 유체 저항을 줄여 대사 효율을 높이는 데 기여한다.',
      '코끼리는 쥐에 비해 개체 전체의 기초대사량은 크지만, 체중 1g당 소모 에너지는 훨씬 적다.',
      '클라이버의 측정 결과에 따르면 체중이 증가함에 따라 개체의 총 기초대사량은 감소한다.'
    ],
    correctChoice: '5',
    studentChoice: '2',
    sampleStudentNote: '초기 가설(2/3제곱)의 표면적/부피 설명 부분을 대충 읽어서 2번이 틀린 줄 알고 골랐습니다.',
    defaultChoiceMatching: {
      questionTitle: '위 글의 내용과 일치하지 않는 것은?',
      identifiedAnswer: 5,
      choicesAnalysis: [
        {
          choiceNumber: 1,
          choiceText: '클라이버의 법칙에 따르면 몸집이 커질수록 단위 체중당 기초대사량은 감소한다.',
          isCorrect: true,
          evidenceSentence: '이는 체중이 증가하는 비율에 비해 기초대사량의 증가 비율이 완만하다는 것을 의미한다.',
          paraphrasingPrinciple: '단위당 비율 개념 환산',
          reasoning: '2문단 및 4문단에서 몸집이 커질수록 체중 증가율보다 대사량 증가율이 완만(3/4제곱)하므로 단위 체중 1g당 대사율은 감소한다고 서술되어 일치합니다.'
        },
        {
          choiceNumber: 2,
          choiceText: '생물학자들의 초기 가설은 몸의 부피에 비례하여 열 방출량이 결정된다는 전제에 기반했다.',
          isCorrect: true,
          evidenceSentence: '생물학자들은 오랫동안 몸의 부피와 표면적의 기하학적 관계에 주목하여 체중의 2/3제곱에 비례할 것이라 추정하였다.',
          paraphrasingPrinciple: '원문 인과 구체화',
          reasoning: '1문단에서 생물학자들의 2/3제곱 가설이 몸의 부피와 표면적의 기하학적 관계에 주목한 것임을 명확히 서술하였습니다.'
        },
        {
          choiceNumber: 3,
          choiceText: '혈관망의 프랙탈 분지 구조는 대형 동물이 체내 유체 저항을 줄여 대사 효율을 높이는 데 기여한다.',
          isCorrect: true,
          evidenceSentence: '동물의 혈관망은 산소와 영양소를 말초 세포까지 효율적으로 공급하기 위해 프랙탈 형태로 분지되어 있으며, 몸집이 커질수록 유체 저항을 최소화하는 방식으로 최적화되기 때문에 체중당 대사 효율이 오히려 향상된다.',
          paraphrasingPrinciple: '인과 문장 패러프레이징',
          reasoning: '3문단에서 프랙탈 혈관망이 유체 저항을 최소화하여 체중당 대사 효율을 향상시킨다는 진술과 100% 일치합니다.'
        },
        {
          choiceNumber: 4,
          choiceText: '코끼리는 쥐에 비해 개체 전체의 기초대사량은 크지만, 체중 1g당 소모 에너지는 훨씬 적다.',
          isCorrect: true,
          evidenceSentence: '따라서 소형 동물(쥐)은 체중 1g당 대사율이 매우 높아 심장이 빠르게 뛰고 끊임없이 먹이를 섭취해야 하지만, 대형 동물(코끼리)은 체중당 대사율이 낮아 상대적으로 긴 수명과 완만한 심박수를 유지하게 된다.',
          paraphrasingPrinciple: '구체적 예시 대조 환산',
          reasoning: '1문단에서 전체 기초대사량은 몸집이 커질수록 증가하지만, 4문단에서 체중 1g당 대사율은 대형 동물(코끼리)이 낮다고 설명하였으므로 부합합니다.'
        },
        {
          choiceNumber: 5,
          choiceText: '클라이버의 측정 결과에 따르면 체중이 증가함에 따라 개체의 총 기초대사량은 감소한다.',
          isCorrect: false,
          evidenceSentence: '하지만 클라이버(Kleiber)는 정밀한 측정을 통해 동물의 기초대사량이 체중의 2/3제곱이 아니라 3/4제곱(0.75제곱)에 비례한다는 사실을 밝혀냈다.',
          paraphrasingPrinciple: '증가/감소 방향성 반전 왜곡',
          reasoning: '클라이버의 측정 결과에서도 총 기초대사량은 체중 증가에 따라 증가(3/4제곱에 비례)하며, 감소하는 것은 \'단위 체중당 대사율\'이므로 5번은 명백한 왜곡 오답(일치하지 않는 정답 선지)입니다.'
        }
      ],
      trapAnalysis: '수능 비문학 과학 지문의 대표적 오답 유형인 [총량(Total)과 단위당 비율(Per Unit)]의 개념 혼동을 유발하는 함정입니다. 총 기초대사량은 증가하지만 단위 체중당 대사율은 감소하는 차이를 역전시켰습니다.'
    }
  },
  {
    id: 'english-1',
    title: '2024 수능 영어 33번 [빈칸추론] - 얼굴 표정과 맥락 인식',
    badge: '2024 수능 영어 오답률 Top 기출',
    subject: 'english',
    category: '영어 독해 (빈칸추론)',
    passage: `Psychological research has shown that when people view facial expressions, they do not perceive the face in isolation. Instead, contextual cues surrounding the face significantly alter the emotional judgment. When an isolated face expressing terror is placed alongside a threatening predator, observers accurately identify the emotion. However, when that identical frightened face is juxtaposed with a joyful reunion scene, people mistakenly perceive the expression as overwhelming tears of joy. In other words, the human brain determines emotional meaning not by isolated biological features, but by integrating perceptual input with environmental context. Therefore, facial expressions alone are inherently ambiguous, and their interpretation is invariably determined by the surrounding narrative.`,
    question: `According to the passage, the perception of emotional facial expressions is determined by __________.`,
    choices: [
      'innate biological instincts independent of external surroundings',
      'the continuous integration of facial cues with contextual information',
      'the universal evolutionary fixedness of human facial musculature',
      'the observer’s subjective emotional state rather than environmental factors',
      'the elimination of contradictory social narratives in the visual field'
    ],
    correctChoice: '2',
    studentChoice: '4',
    sampleStudentNote: 'observer라는 단어만 보고 지문에서 observer가 착각한다는 내용이 떠올라 4번의 subjective emotional state에 낚였습니다.',
    defaultChoiceMatching: {
      questionTitle: 'According to the passage, the perception of emotional facial expressions is determined by __________.',
      identifiedAnswer: 2,
      choicesAnalysis: [
        {
          choiceNumber: 1,
          choiceText: 'innate biological instincts independent of external surroundings',
          isCorrect: false,
          evidenceSentence: 'In other words, the human brain determines emotional meaning not by isolated biological features, but by integrating perceptual input with environmental context.',
          paraphrasingPrinciple: '정반대 개념 치환 (Antonym Trap)',
          reasoning: '지문에서 생물학적 특징에만 고립되지 않고 환경적 맥락과 결합한다고 했으므로, 외부 환경과 독립된 생물학적 본능이라는 선지는 정반대 오답입니다.'
        },
        {
          choiceNumber: 2,
          choiceText: 'the continuous integration of facial cues with contextual information',
          isCorrect: true,
          evidenceSentence: 'In other words, the human brain determines emotional meaning not by isolated biological features, but by integrating perceptual input with environmental context.',
          paraphrasingPrinciple: '동의어 패러프레이징 (integrating perceptual input with environmental context -> integration of facial cues with contextual information)',
          reasoning: '지문의 결론 문장인 "integrating perceptual input with environmental context"를 완벽하게 핵심 명사구로 재진술한 정답 선지입니다.'
        },
        {
          choiceNumber: 3,
          choiceText: 'the universal evolutionary fixedness of human facial musculature',
          isCorrect: false,
          evidenceSentence: 'Therefore, facial expressions alone are inherently ambiguous, and their interpretation is invariably determined by the surrounding narrative.',
          paraphrasingPrinciple: '무관한 학술 용어 주입 (Irrelevant Jargon)',
          reasoning: '표정 근육의 진화적 고정성에 대한 서술은 지문에 전혀 언급되지 않은 무관한 내용입니다.'
        },
        {
          choiceNumber: 4,
          choiceText: 'the observer’s subjective emotional state rather than environmental factors',
          isCorrect: false,
          evidenceSentence: 'Instead, contextual cues surrounding the face significantly alter the emotional judgment.',
          paraphrasingPrinciple: '주체-환경 왜곡 (Subjective vs Environmental Inversion)',
          reasoning: '판단을 바꾸는 것은 관찰자의 주관적 감정 상태가 아니라 "주변의 맥락적 단서(contextual cues / environmental context)"이므로 오답입니다.'
        },
        {
          choiceNumber: 5,
          choiceText: 'the elimination of contradictory social narratives in the visual field',
          isCorrect: false,
          evidenceSentence: 'Therefore, facial expressions alone are inherently ambiguous, and their interpretation is invariably determined by the surrounding narrative.',
          paraphrasingPrinciple: '단어 왜곡 (determined by surrounding narrative -> elimination of narratives)',
          reasoning: '내러티브(맥락)에 의해 결정된다고 했지, 모순된 사회적 내러티브를 제거한다고 하지 않았으므로 왜곡된 선지입니다.'
        }
      ],
      trapAnalysis: '수능 영어 33번 킬러 빈칸 문항의 핵심 패러프레이징 원리: [integrating perceptual input with environmental context] -> [integration of facial cues with contextual information]으로 정확한 동의어 어휘 변환을 포착하는 능력입니다.'
    }
  },
  {
    id: 'english-2',
    title: '2024 수능 영어 31번 [주제추론] - 디지털 기술과 인간 주의력 잠식',
    badge: '2024 수능 영어 핵심 기출',
    subject: 'english',
    category: '영어 구문 & 재진술',
    passage: `In contemporary culture, the relentless influx of digital notifications represents a pervasive challenge to human cognition. Technology's negative impact on deep contemplation is manifested through persistent digital distraction. Users find themselves trapped in a state of continuous partial attention, where the unintended consequences of innovation manifest as an alarming erosion of human focus. Rather than fostering profound intellectual breakthroughs, rapid information snacking fragments sustained thought processes, substituting superficial scanning for reflective cognitive depth.`,
    question: `Which of the following best expresses the core concept and paraphrased reiterations in the text?`,
    choices: [
      'The accelerating benefits of multi-tasking in modern educational environments',
      'How continuous digital interference erodes sustained cognitive concentration',
      'The historical evolution of hardware innovation and computational speed',
      'Methods for maximizing algorithm responsiveness in social networks',
      'The inevitable synergy between biological memory and cloud storage systems'
    ],
    correctChoice: '2',
    studentChoice: '2',
    sampleStudentNote: '핵심 개념인 Technology negative impact -> digital distraction -> erosion of focus 재진술 흐름을 잡아 정답을 맞춤.',
    defaultChoiceMatching: {
      questionTitle: 'Which of the following best expresses the core concept and paraphrased reiterations in the text?',
      identifiedAnswer: 2,
      choicesAnalysis: [
        {
          choiceNumber: 1,
          choiceText: 'The accelerating benefits of multi-tasking in modern educational environments',
          isCorrect: false,
          evidenceSentence: 'Technology\'s negative impact on deep contemplation is manifested through persistent digital distraction.',
          paraphrasingPrinciple: '가치 평가 반전 (Negative Impact -> Benefits)',
          reasoning: '지문은 디지털 주의 분산의 부정적 영향(negative impact, erosion of focus)을 비판하고 있으므로 benefits(이점)는 정반대 오답입니다.'
        },
        {
          choiceNumber: 2,
          choiceText: 'How continuous digital interference erodes sustained cognitive concentration',
          isCorrect: true,
          evidenceSentence: 'Users find themselves trapped in a state of continuous partial attention, where the unintended consequences of innovation manifest as an alarming erosion of human focus.',
          paraphrasingPrinciple: '핵심 명사구 동의어 패러프레이징 (digital distraction -> digital interference / erosion of human focus -> erodes sustained cognitive concentration)',
          reasoning: '지문 전체를 관통하는 핵심 주장(디지털 간섭으로 인한 집중력 잠식)을 정확하게 대응시킨 정답 선지입니다.'
        },
        {
          choiceNumber: 3,
          choiceText: 'The historical evolution of hardware innovation and computational speed',
          isCorrect: false,
          evidenceSentence: 'In contemporary culture, the relentless influx of digital notifications represents a pervasive challenge to human cognition.',
          paraphrasingPrinciple: '단순 배경 단어 과장 (Hardware evolution)',
          reasoning: '하드웨어의 역사적 발전 속도에 관한 내용은 지문에 언급되지 않은 소재입니다.'
        },
        {
          choiceNumber: 4,
          choiceText: 'Methods for maximizing algorithm responsiveness in social networks',
          isCorrect: false,
          evidenceSentence: 'Users find themselves trapped in a state of continuous partial attention, where the unintended consequences of innovation manifest as an alarming erosion of human focus.',
          paraphrasingPrinciple: '지엽적 알고리즘 소재 조작',
          reasoning: '알고리즘 반응성 극대화 방법은 지문의 인지적 비판 논지와 전혀 맞지 않습니다.'
        },
        {
          choiceNumber: 5,
          choiceText: 'The inevitable synergy between biological memory and cloud storage systems',
          isCorrect: false,
          evidenceSentence: 'Rather than fostering profound intellectual breakthroughs, rapid information snacking fragments sustained thought processes, substituting superficial scanning for reflective cognitive depth.',
          paraphrasingPrinciple: '긍정적 시너지 왜곡',
          reasoning: '생물학적 기억과 클라우드의 시너지는 지문의 비판적 어조와 완전히 상반됩니다.'
        }
      ],
      trapAnalysis: '핵심 어휘 체인 (digital distraction -> continuous partial attention -> erosion of human focus)을 [continuous digital interference -> erodes sustained concentration]으로 일관되게 압축한 주제 선지 판별입니다.'
    }
  },
  {
    id: 'english-3',
    title: '2024 수능 영어 34번 [고난도 구문] - 음악과 시간 인식의 상대성',
    badge: '2024 수능 영어 34번 킬러 구문',
    subject: 'english',
    category: '영어 청킹 & 직독직해',
    passage: `Musical pitch and temporal rhythm / are not merely auditory phenomena / processed mechanically by the eardrum, / but rather complex cognitive constructs / through which the human mind / actively measures and reorganizes / the psychological flow of time. When listeners engage / with intricate polyrhythmic structures, / their internal clock adapts, / creating an altered perception / wherein chronological seconds / expand or contract / depending on the density of sonic events.`,
    question: `What is the primary cognitive role of musical rhythm according to the passage?`,
    choices: [
      'To provide a purely mechanical stimulus to the physical auditory canal',
      'To serve as an active mental mechanism that modulates subjective time perception',
      'To prevent the human brain from perceiving complex polyrhythmic variations',
      'To measure chronological time with absolute mathematical precision',
      'To eliminate emotional fluctuations during auditory performance'
    ],
    correctChoice: '2',
    studentChoice: '4',
    sampleStudentNote: 'measure time이라는 단어만 보고 시계처럼 정확하게 잰다는 뜻인 줄 알고 4번을 골랐습니다.',
    defaultChoiceMatching: {
      questionTitle: 'What is the primary cognitive role of musical rhythm according to the passage?',
      identifiedAnswer: 2,
      choicesAnalysis: [
        {
          choiceNumber: 1,
          choiceText: 'To provide a purely mechanical stimulus to the physical auditory canal',
          isCorrect: false,
          evidenceSentence: 'Musical pitch and temporal rhythm / are not merely auditory phenomena / processed mechanically by the eardrum, / but rather complex cognitive constructs',
          paraphrasingPrinciple: '부정된 조건 채택 (not merely A but B 에서 A 선택)',
          reasoning: '지문에서 "단순히 기계적으로 처리되는 청각 현상이 아니라(not merely auditory phenomena processed mechanically)"라고 명시했으므로 정반대 오답입니다.'
        },
        {
          choiceNumber: 2,
          choiceText: 'To serve as an active mental mechanism that modulates subjective time perception',
          isCorrect: true,
          evidenceSentence: 'through which the human mind / actively measures and reorganizes / the psychological flow of time.',
          paraphrasingPrinciple: '동의어 치환 (cognitive constructs through which mind actively reorganizes psychological flow of time -> active mental mechanism that modulates subjective time perception)',
          reasoning: '인간의 마음이 심리적 시간의 흐름을 능동적으로 재구성한다는 원문 내용을 "주관적 시간 인식을 조절하는 능동적 정신 기제"로 가장 정확하게 패러프레이징한 정답 선지입니다.'
        },
        {
          choiceNumber: 3,
          choiceText: 'To prevent the human brain from perceiving complex polyrhythmic variations',
          isCorrect: false,
          evidenceSentence: 'When listeners engage / with intricate polyrhythmic structures, / their internal clock adapts',
          paraphrasingPrinciple: '부정어 삽입 왜곡 (prevent perceiving)',
          reasoning: '청자가 복잡한 리듬 구조에 관여한다고 했지, 뇌의 인식을 방해(prevent)한다고 하지 않았습니다.'
        },
        {
          choiceNumber: 4,
          choiceText: 'To measure chronological time with absolute mathematical precision',
          isCorrect: false,
          evidenceSentence: 'creating an altered perception / wherein chronological seconds / expand or contract / depending on the density of sonic events.',
          paraphrasingPrinciple: '상대성을 절대성으로 둔갑 (Relative -> Absolute mathematical precision)',
          reasoning: '음향 이벤트의 밀도에 따라 초 단위가 늘어나거나 줄어드는 왜곡/변화(altered perception)가 생긴다고 했으므로, 수학적 정밀성으로 측정한다는 것은 왜곡된 오답입니다.'
        },
        {
          choiceNumber: 5,
          choiceText: 'To eliminate emotional fluctuations during auditory performance',
          isCorrect: false,
          evidenceSentence: 'Musical pitch and temporal rhythm / are not merely auditory phenomena / processed mechanically by the eardrum',
          paraphrasingPrinciple: '지문에 없는 감정 제거 내용 날조',
          reasoning: '감정적 기복 제거는 지문에 전혀 언급되지 않은 무관한 진술입니다.'
        }
      ],
      trapAnalysis: '수능 고난도 빈칸의 대표 함정: "not merely A but B" 구문에서 A(단순 기계적 자극)를 매력적 오답으로 제시하거나, "expand or contract(시간 왜곡)"를 "mathematical precision(수학적 정밀)"으로 왜곡하는 패턴입니다.'
    }
  }
];
