const UPDATES = [
  {
    "date": "2026-07-23 07:30 KST",
    "summary": "알파벳 TPU 외부 상용화 개시 - 하반기 첫 매출 인식, 2027 본격 확대\n엔비디아 Vera Rubin GA 램프 - 구글·CoreWeave 데이터센터 배치, TPU 대응\nKimi K3 오픈웨이트 D-4 - 2.8조 파라미터 첫 프론티어급, 7/27 배포\nxAI Grok 4.6 2조 파라미터 훈련 완료 - Kimi 카운터, 늦여름 공개\n화웨이 Atlas 950 Q4 상용화 - 8,192 NPU 엔비디아 정면 대응, 한국 진입",
    "entries": [
      {
        "time": "2026-07-23 07:00 KST",
        "type": "인프라",
        "sector": "Google DeepMind",
        "text": "Google DeepMind·Alphabet. TPU 외부 상용화 개시 - Alphabet Q2 실적 콜에서 2026 하반기 외부 고객 데이터센터에 TPU 하드웨어 직접 공급으로 첫 매출 인식 시작, 2027 본격 확대 공표. TPU를 자체 사용 인프라에서 merchant silicon으로 승격시키는 전환점, 엔비디아 GPU 지배 구도에 정면 대응 카드. Google Cloud 매출 $24.8B +82% YoY, 클라우드 backlog $462B로 사실상 2배 확대. Gemini App MAU 950M·API 처리량 22B tokens/min 스케일 재확인. 2026 CAPEX $180~190B로 상향(기존 $175~185B), 2027 유의미한 확대. Gemini 3.5 Pro는 코딩 성능 미달로 수개월 지연(Bloomberg 7/16), monetization은 규모로 방어. capability 렌즈 - TPU 외판이 하이퍼스케일러 CAPEX $725B 정당성 논리의 프론트엔드 매출 축 신설, 엔비디아 원-플레이어 리스크 해소."
      },
      {
        "time": "2026-07-23 06:00 KST",
        "type": "인프라",
        "sector": "NVIDIA",
        "text": "NVIDIA. Vera Rubin NVL72 GA 램프 - 7/22 프로덕션 랙이 CoreWeave·Google Cloud 데이터센터에서 가동 시작. Blackwell 대비 컴퓨트 5배·추론 비용 10분의 1 클레임, Alphabet TPU 외판 개시와 같은 날 발표로 타이밍 대응. 8/26 Q2 D-34 카운트다운, hyperscaler CAPEX 정당성 상방 재확인(Alphabet 상향으로 방어). Blackwell Ultra는 Q3 정점 이후 Rubin 전환, forward P/E 32배 sector premium 유지 근거. 매크로 렌즈 - hyperscaler 3사 합산 2026 CAPEX $725B +77% YoY, NVDA·GOOGL 양축 경쟁 구도로 오히려 시장 파이 확대 논리."
      },
      {
        "time": "2026-07-23 06:00 KST",
        "type": "모델 출시 예정",
        "sector": "xAI",
        "text": "xAI Grok 4.6 - 2조 파라미터 신모델 pre-training 이번 주 완료(Musk 7/18 공표), 늦여름~9월 중순 공개 목표. Moonshot Kimi K3 2.8조 파라미터 카운터 조기 대응 포지셔닝, MoE 아키텍처 확장. Cursor agent 데이터 학습 활용, Terminal-Bench 2.1 83.3%·SWE-Bench Pro 64.7% 프라이싱 유지 목표. Moonshot Kimi K3 - 7/27 오픈웨이트 공개 D-4, Modified MIT 라이선스·weights 1.4TB (4-bit)·64+ 가속기 배포 가이드. 프론티어 오픈웨이트 첫 진입으로 클로즈드 프리미엄 gap 6개월로 축소, 오픈소스 monetization 사이클 재편 시그널. capability 벤치마크 - Kimi K3 GDPval-AA v2 1,687 3위·Grok 4.6는 Rubin·TPU 인프라 활용 스케일 승부."
      },
      {
        "time": "2026-07-23 05:00 KST",
        "type": "인프라",
        "sector": "Meta AI",
        "text": "Meta AI. Muse Spark 1.1 - 가장 강력한 에이전틱·코딩 모델로 배치 완료, Wang이 다음 모델 코드명 Watermelon 훈련 중임을 공표(공개 일정 미정). Muse Image는 Arena text-to-image 벤치마크 2위(OpenAI 뒤). Meta 슈퍼인텔리전스 랩(MSL) - Anthropic·OpenAI 인재 영입 랠리 지속, 2026 aggressive recruiting 사이클 진입. Huawei Atlas 950 SuperPoD - Q4 2026 상용화 확정, 8,192 Ascend 950 NPU 연결·8 EFLOPS FP8, 엔비디아 NVL144 대비 컴퓨트 6.7배·비용 4분의 1 클레임, 한국 시장 진입 포함. 중국 국산 스택으로 미 반도체 수출 규제 우회, NVDA 정면 경쟁 카드. capability 렌즈 - 인프라 3축(NVDA GPU·GOOGL TPU·화웨이 Ascend) 정착, monetization 사이클 진입 국면. 단기 시그널 - 7/27 Kimi K3 weights·이번주 xAI Grok 4.6 훈련 완료·8월 Anthropic S-1 공식 파일링·10월 Anthropic $965B 나스닥 상장·11월 UN AI Safety Summit."
      }
    ]
  }
];
