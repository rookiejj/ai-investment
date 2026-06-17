# 브리픽 마케팅 프로모 캐러셀

데일리 콘텐츠 캐러셀(`scripts/instagram`)과 별개인 **재사용 광고용** 다장 캐러셀.
경쟁사식 "훅 → 문제 → 해결 → 증거 → 차별점 → CTA" 마케팅 퍼널 구조.

- 톤: 다크 + 브랜드 그린(#18E299), 절제된 카피. 구걸 X, 호기심 + 전문성.
- 규격: 1080×1350 (인스타 4:5 세로), `deviceScaleFactor: 2`로 2160×2700 고해상 PNG.

## 생성

```bash
npm run promo:render        # scripts/promo/out/01.png ~ NN.png
```

## 슬라이드 편집·추가

전부 `template.html` 한 파일. 각 슬라이드는 `.slide[data-slide="N"]` 블록.

- **카피 수정**: 해당 블록의 텍스트만 고치고 다시 렌더.
- **슬라이드 추가**: `data-slide` 번호를 이어서 새 `.slide` 블록 추가 → 렌더가 자동으로 장수 인식(개수 제한 없음).
- **순서 변경**: 블록 순서(또는 data-slide 번호) 조정.
- 마스코트 올빼미는 `data-owl` 속성 가진 `<img>`에 `assets/briefick_profile_640.jpeg`가 렌더 시 자동 주입됨.

## 게시

`out/` PNG를 인스타 캐러셀로 올리고, 캡션은 `caption.txt` 복붙.
(`out/`은 git에 안 올라감 — `.gitignore` 처리.)
