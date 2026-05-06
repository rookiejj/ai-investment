#!/usr/bin/env node
/**
 * Briefick — 인스타 Reels 렌더러 (Phase 1: 무음 dry-run)
 *
 * render-slides.js가 만든 1080×1350 PNG 7장(01.png~07.png)을 ffmpeg로
 * 1080×1920(9:16) Reels mp4로 변환한다.
 *
 *  - 비주얼: 같은 PNG를 위·아래 블러 처리해 9:16 캔버스를 채움 (letterbox 회피)
 *  - 길이: 슬라이드당 4초, 사이 0.5초 crossfade → 총 ~26초
 *  - 음악: Phase 1에선 무음. scripts/instagram/music/track.mp3 파일이 있으면 자동 합성.
 *
 * 출력: scripts/instagram/out/reels.mp4
 *
 * 사전조건:
 *  - ffmpeg가 PATH에 있어야 함 (워크플로 apt 설치, 로컬은 brew install ffmpeg)
 *  - render-slides.js가 먼저 실행되어 out/01.png~out/07.png가 존재해야 함
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT_DIR = path.join(__dirname, 'out');
const MUSIC_DIR = path.join(__dirname, 'music');
const SLIDE_COUNT = 7;
const SLIDE_SEC = 6;          // 슬라이드당 표시 시간 (5줄 bullet 읽기 충분)
const FADE_SEC = 0.5;         // 슬라이드 간 crossfade
const TARGET_W = 1080;
const TARGET_H = 1920;

function checkInputs() {
  for (let i = 1; i <= SLIDE_COUNT; i++) {
    const p = path.join(OUT_DIR, String(i).padStart(2, '0') + '.png');
    if (!fs.existsSync(p)) {
      throw new Error(`PNG 슬라이드 ${p} 없음. render-slides.js 먼저 실행해야 함.`);
    }
  }
}

function findMusicTrack() {
  if (!fs.existsSync(MUSIC_DIR)) return null;
  const candidates = fs.readdirSync(MUSIC_DIR).filter(f => /\.(mp3|m4a|wav|ogg)$/i.test(f));
  if (!candidates.length) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return path.join(MUSIC_DIR, pick);
}

// 슬라이드 i를 9:16 캔버스로 — 같은 이미지를 블러 BG로 깔고, 가운데 원본 비율 유지 배치
function buildVfChain() {
  // 입력은 1080×1350. 그대로 1080×1920에 가운데 배치하고 위·아래 285px 빈공간을
  // 같은 이미지의 블러된 확대 버전으로 채운다.
  // [main]: 원본 그대로. [bg]: 1080×1920로 crop+scale 후 강한 블러 → background.
  // overlay로 main을 bg 위에 가운데 배치.
  return [
    'split=2[orig][bg]',
    `[bg]scale=${TARGET_W}:${TARGET_H}:force_original_aspect_ratio=increase,crop=${TARGET_W}:${TARGET_H},gblur=sigma=40,eq=brightness=-0.15[bgblur]`,
    `[bgblur][orig]overlay=(W-w)/2:(H-h)/2:format=auto,setsar=1`,
  ].join(',');
}

// 7개 입력을 crossfade로 이어붙이는 filter_complex 생성
function buildXfadeGraph(n, slideSec, fadeSec) {
  const dur = slideSec;
  const fade = fadeSec;
  const lines = [];
  // 각 입력을 9:16 캔버스로 변환 + duration 강제
  for (let i = 0; i < n; i++) {
    lines.push(`[${i}:v]${buildVfChain()},trim=duration=${dur},setpts=PTS-STARTPTS[v${i}]`);
  }
  // crossfade 체인: v0+v1 → x1, x1+v2 → x2, ...
  let prev = 'v0';
  for (let i = 1; i < n; i++) {
    const off = i * (dur - fade) - 0; // 누적 오프셋: i번째 fade가 시작되는 절대 시각
    // off는 prev 스트림에서 fade가 시작되는 시각
    // 처음(i=1)은 dur - fade 시점에 fade 시작
    const out = (i === n - 1) ? 'vout' : `x${i}`;
    const offset = (dur - fade) + (i - 1) * (dur - fade);
    lines.push(`[${prev}][v${i}]xfade=transition=fade:duration=${fade}:offset=${offset}[${out}]`);
    prev = out;
  }
  return lines.join(';');
}

function totalDurationSec(n, slideSec, fadeSec) {
  // n개 슬라이드, 각 slideSec, 사이 fadeSec 만큼 겹침
  return n * slideSec - (n - 1) * fadeSec;
}

function run(cmd, args) {
  console.log(`$ ${cmd} ${args.map(a => /\s/.test(a) ? `"${a}"` : a).join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit' });
}

function main() {
  checkInputs();

  const totalSec = totalDurationSec(SLIDE_COUNT, SLIDE_SEC, FADE_SEC);
  console.log(`Reels 길이: ${totalSec.toFixed(1)}s (${SLIDE_COUNT}장 × ${SLIDE_SEC}s − crossfade ${FADE_SEC}s)`);

  const filter = buildXfadeGraph(SLIDE_COUNT, SLIDE_SEC, FADE_SEC);
  const outPath = path.join(OUT_DIR, 'reels.mp4');
  const musicPath = findMusicTrack();

  // 모든 -i 입력을 -filter_complex 앞에 모아둔다 (ffmpeg 인자 순서 요구사항)
  const args = ['-y'];

  // 입력 0~6: PNG 슬라이드
  for (let i = 1; i <= SLIDE_COUNT; i++) {
    args.push('-loop', '1', '-t', String(SLIDE_SEC), '-i',
              path.join(OUT_DIR, String(i).padStart(2, '0') + '.png'));
  }

  // 입력 7: 오디오 (음악 또는 anullsrc 무음)
  if (musicPath) {
    console.log(`음악 트랙: ${path.basename(musicPath)}`);
    args.push('-i', musicPath);
  } else {
    console.log('음악 없음 (Phase 1 무음 dry-run, anullsrc로 무음 트랙 부착)');
    args.push('-f', 'lavfi', '-t', String(totalSec),
              '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
  }

  // 필터·매핑·인코딩
  args.push(
    '-filter_complex', filter,
    '-map', '[vout]',
    '-map', `${SLIDE_COUNT}:a`,
    '-shortest',
  );

  if (musicPath) {
    args.push('-af', `afade=t=in:st=0:d=0.5,afade=t=out:st=${(totalSec - 1).toFixed(2)}:d=1.0`);
  }

  args.push(
    '-c:a', 'aac',
    '-b:a', '128k',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-movflags', '+faststart',
    outPath,
  );

  run('ffmpeg', args);

  const stat = fs.statSync(outPath);
  console.log(`✓ ${outPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

// ─────────────────────────────────────────────────────────────
// 단일 이미지 모드 — cartoon 1장으로 30초 Reels (Ken Burns 줌 + 음악)
// ─────────────────────────────────────────────────────────────
function parseArg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i < 0 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

function mainSingle() {
  const inputPath = parseArg('--input', '');
  const duration = Number(parseArg('--duration', 30));
  if (!inputPath || !fs.existsSync(inputPath)) {
    throw new Error(`--input <path> 필요. 받은 값: ${inputPath}`);
  }
  console.log(`[single mode] input=${inputPath} duration=${duration}s`);

  const fps = 30;
  const totalFrames = duration * fps;
  const SRC_H = 1350;  // 카툰 입력 크기 1080×1350 (IG 포트레이트 4:5).
  // zoompan: 1.0x → 1.15x over duration, 1080×1350 4:5 포트레이트 출력
  // 그 후 split + 블러 BG로 1080×1920 letterbox (위·아래 285px씩)
  const filter = [
    `[0:v]zoompan=z='min(zoom+0.000167\\,1.15)':d=${totalFrames}:s=${TARGET_W}x${SRC_H}:fps=${fps},split=2[orig][bg]`,
    `[bg]scale=${TARGET_W}:${TARGET_H}:force_original_aspect_ratio=increase,crop=${TARGET_W}:${TARGET_H},gblur=sigma=40,eq=brightness=-0.15[bgblur]`,
    `[bgblur][orig]overlay=(W-w)/2:(H-h)/2:format=auto,setsar=1[vout]`,
  ].join(';');

  const outPath = path.join(OUT_DIR, 'reels.mp4');
  const musicPath = findMusicTrack();

  const args = ['-y', '-loop', '1', '-t', String(duration), '-i', inputPath];

  if (musicPath) {
    console.log(`음악 트랙: ${path.basename(musicPath)}`);
    args.push('-i', musicPath);
  } else {
    console.log('음악 없음 — 무음');
    args.push('-f', 'lavfi', '-t', String(duration),
              '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
  }

  args.push(
    '-filter_complex', filter,
    '-map', '[vout]',
    '-map', '1:a',
    '-shortest',
  );

  if (musicPath) {
    args.push('-af', `afade=t=in:st=0:d=0.5,afade=t=out:st=${(duration - 1).toFixed(2)}:d=1.0`);
  }

  args.push(
    '-c:a', 'aac',
    '-b:a', '128k',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-r', String(fps),
    '-t', String(duration),
    '-movflags', '+faststart',
    outPath,
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });
  run('ffmpeg', args);

  const stat = fs.statSync(outPath);
  console.log(`✓ ${outPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB, ${duration}s)`);
}

// 모드 분기
if (process.argv.includes('--mode=single') || process.argv.includes('--single')) {
  mainSingle();
} else {
  main();
}
