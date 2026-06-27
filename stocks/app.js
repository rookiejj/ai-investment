/* Briefick Stocks — 전 상장 종목 브라우저
 * 데이터: ./us.json · ./kr.json (scripts/build-all-stocks.py 로 생성)
 * 레코드: { t:티커, n:종목명, e:거래소/시장, ty:"stock"|"etf", c:"US"|"KR" }
 *
 * 종목 클릭 시 동작은 차차 구현 — 지금은 onPick() 스텁만 연결.
 */
(function () {
  'use strict';

  var CHUNK = 200; // 무한 스크롤 한 번에 그리는 행 수
  var LS_LAYOUT = 'briefick_stocks_layout'; // 뷰 선택 저장 키
  var FX_KRW = 1350; // 통합 탭 시총 정렬용 원→달러 근사 환율 (정렬 기준 통일 목적)

  // 시가총액을 달러 기준으로 환산 (통합 탭에서 미국·한국 혼합 정렬용)
  function capUSD(r) { return r.c === 'KR' ? (r.m || 0) / FX_KRW : (r.m || 0); }

  var DATA = { us: [], kr: [] };
  var state = {
    tab: 'all',          // all | us | kr
    type: 'all',         // all | stock | etf
    q: '',
    exch: '',
    sort: { key: 'cap', dir: -1 }, // 기본: 시가총액 내림차순. idx = 원본 순서
    layout: loadLayout(),// list | bubble  (localStorage 에 저장)
  };

  function loadLayout() {
    try { return localStorage.getItem(LS_LAYOUT) === 'bubble' ? 'bubble' : 'list'; }
    catch (e) { return 'list'; }
  }
  var view = [];     // 현재 필터·정렬된 전체 결과
  var rendered = 0;  // 지금까지 DOM 에 그린 행 수

  var $ = function (id) { return document.getElementById(id); };
  var tbody, listview, bubbleview, scrollarea, sentinel, loading, endmsg, fcount, exchSel, qInput, searchwrap;

  /* ---------- 데이터 로드 ---------- */
  function load() {
    Promise.all([
      fetch('./us.json').then(function (r) { return r.json(); }),
      fetch('./kr.json').then(function (r) { return r.json(); }),
    ]).then(function (res) {
      DATA.us = res[0];
      DATA.kr = res[1];
      loading.style.display = 'none';
      $('cnt-all').textContent = fmt(DATA.us.length + DATA.kr.length);
      $('cnt-us').textContent = fmt(DATA.us.length);
      $('cnt-kr').textContent = fmt(DATA.kr.length);
      buildExchOptions();
      apply();
    }).catch(function (e) {
      loading.innerHTML = '데이터를 불러오지 못했습니다.<br><span style="color:#64748b">' + (e && e.message || e) + '</span>';
    });
  }

  /* ---------- 탭별 원본 풀 ---------- */
  function pool() {
    if (state.tab === 'us') return DATA.us;
    if (state.tab === 'kr') return DATA.kr;
    return DATA.us.concat(DATA.kr);
  }

  /* ---------- 거래소 드롭다운 ---------- */
  function buildExchOptions() {
    var set = {};
    pool().forEach(function (r) { set[r.e] = (set[r.e] || 0) + 1; });
    var keys = Object.keys(set).sort();
    var html = '<option value="">모든 거래소</option>';
    keys.forEach(function (k) { html += '<option value="' + esc(k) + '">' + esc(k) + ' (' + fmt(set[k]) + ')</option>'; });
    exchSel.innerHTML = html;
    if (state.exch && set[state.exch] == null) state.exch = '';
    exchSel.value = state.exch;
  }

  /* ---------- 필터 + 정렬 ---------- */
  function apply() {
    var q = state.q.trim().toLowerCase();
    var src = pool();
    var out = [];
    for (var i = 0; i < src.length; i++) {
      var r = src[i];
      if (state.type !== 'all' && r.ty !== state.type) continue;
      if (state.exch && r.e !== state.exch) continue;
      if (q) {
        if (r.t.toLowerCase().indexOf(q) === -1 && r.n.toLowerCase().indexOf(q) === -1) continue;
      }
      out.push(r);
    }
    var k = state.sort.key, dir = state.sort.dir;
    if (k === 'cap') {
      // 시가총액(달러 환산) 순. 동률·미상(0)은 티커 오름차순으로 안정화.
      out.sort(function (a, b) {
        var d = (capUSD(a) - capUSD(b)) * dir;
        if (d) return d;
        return a.t < b.t ? -1 : a.t > b.t ? 1 : 0;
      });
    } else if (k !== 'idx') {
      out.sort(function (a, b) {
        var x = ('' + a[k]).toLowerCase(), y = ('' + b[k]).toLowerCase();
        return x < y ? -dir : x > y ? dir : 0;
      });
    } else if (dir === -1) {
      out.reverse();
    }
    view = out;
    fcount.innerHTML = '<b>' + fmt(view.length) + '</b> 종목';
    resetRender();
    syncSortArrows();
  }

  /* ---------- 뷰 전환 (리스트 / 버블) ---------- */
  function applyLayout() {
    var bubble = state.layout === 'bubble';
    listview.style.display = bubble ? 'none' : '';
    bubbleview.style.display = bubble ? 'flex' : 'none';
    document.querySelectorAll('.vbtn').forEach(function (b) {
      b.classList.toggle('on', b.dataset.layout === state.layout);
    });
  }

  /* ---------- 렌더 (윈도잉) ---------- */
  function resetRender() {
    tbody.innerHTML = '';
    bubbleview.innerHTML = '';
    rendered = 0;
    scrollarea.scrollTop = 0;
    endmsg.style.display = 'none';
    if (!view.length) {
      var msg = '조건에 맞는 종목이 없습니다.';
      if (state.layout === 'bubble') bubbleview.innerHTML = '<div class="empty" style="width:100%">' + msg + '</div>';
      else tbody.innerHTML = '<tr><td colspan="6"><div class="empty">' + msg + '</div></td></tr>';
      return;
    }
    more();
  }

  function renderChunk() {
    var end = Math.min(rendered + CHUNK, view.length);
    var frag = document.createDocumentFragment();
    if (state.layout === 'bubble') {
      for (var i = rendered; i < end; i++) frag.appendChild(bubbleEl(view[i]));
      bubbleview.appendChild(frag);
    } else {
      for (var j = rendered; j < end; j++) frag.appendChild(rowEl(view[j], j));
      tbody.appendChild(frag);
    }
    rendered = end;
    if (rendered >= view.length) {
      endmsg.style.display = 'block';
      endmsg.textContent = '— 전체 ' + fmt(view.length) + '개 종목 모두 표시됨 —';
    }
  }

  // 현재 스크롤 위치 아래로 일정 버퍼(BUFFER)가 남도록 연속 로드.
  // 절대 높이가 아니라 "스크롤 위치 기준 남은 양"으로 채워야, 추가한 청크가
  // sentinel 의 감지 영역을 확실히 벗어나 다음 스크롤에서 재발화한다.
  function more() {
    var BUFFER = 1200, guard = 0;
    while (rendered < view.length && ++guard < 1000) {
      renderChunk();
      var below = scrollarea.scrollHeight - scrollarea.scrollTop - scrollarea.clientHeight;
      if (below >= BUFFER) break;
    }
  }

  function bubbleEl(r) {
    var b = document.createElement('button');
    b.className = 'bub' + (r.ty === 'etf' ? ' etf' : '') + (r.c === 'KR' ? ' kr' : '');
    b.title = r.n + ' · ' + r.e + (r.ty === 'etf' ? ' · ETF' : '');
    b.innerHTML = '<span class="bflag">' + (r.c === 'KR' ? '🇰🇷' : '🇺🇸') + '</span>' + esc(r.t);
    b.addEventListener('click', function () { onPick(r); });
    return b;
  }

  function rowEl(r, i) {
    var tr = document.createElement('tr');
    tr.className = 'row';
    tr.dataset.t = r.t;
    tr.dataset.c = r.c;
    var flag = r.c === 'KR' ? '🇰🇷' : '🇺🇸';
    var badge = r.ty === 'etf'
      ? '<span class="badge etf">ETF</span>'
      : '<span class="badge stock">주식</span>';
    tr.innerHTML =
      '<td class="num">' + (i + 1) + '</td>' +
      '<td><span class="flag">' + flag + '</span><span class="tsym">' + esc(r.t) + '</span></td>' +
      '<td><span class="tname">' + esc(r.n) + '</span></td>' +
      '<td><span class="exch">' + esc(r.e) + '</span></td>' +
      '<td class="num cap">' + capFmt(r) + '</td>' +
      '<td>' + badge + '</td>';
    tr.addEventListener('click', function () { onPick(r); });
    return tr;
  }

  /* ---------- 종목 클릭 (차차 구현) ---------- */
  function onPick(r) {
    // TODO: 상세 패널 / 차트 / 시세 연동 등 클릭 동작 구현 예정.
    console.log('[stocks] pick', r);
  }

  /* ---------- 정렬 헤더 ---------- */
  function syncSortArrows() {
    var arrows = document.querySelectorAll('th .arrow');
    for (var i = 0; i < arrows.length; i++) {
      var key = arrows[i].getAttribute('data-for');
      arrows[i].textContent = (state.sort.key === key) ? (state.sort.dir === 1 ? '▲' : '▼') : '';
    }
  }

  /* ---------- 유틸 ---------- */
  function fmt(n) { return ('' + n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // 시가총액 표기: 미국은 달러($T/$B/$M), 한국은 원(조/억). 미상은 '–'.
  function capFmt(r) {
    var m = r.m || 0;
    if (!m) return '<span class="capna">–</span>';
    if (r.c === 'KR') {
      if (m >= 1e12) return fmt(Math.round(m / 1e12)) + '조';
      if (m >= 1e8) return fmt(Math.round(m / 1e8)) + '억';
      return fmt(Math.round(m / 1e4)) + '만';
    }
    if (m >= 1e12) return '$' + (m / 1e12).toFixed(2) + 'T';
    if (m >= 1e9) return '$' + (m / 1e9).toFixed(1) + 'B';
    if (m >= 1e6) return '$' + Math.round(m / 1e6) + 'M';
    return '$' + fmt(m);
  }
  function esc(s) {
    return ('' + s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- 이벤트 ---------- */
  function bind() {
    // 탭
    document.getElementById('tabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('on'); });
      b.classList.add('on');
      state.tab = b.dataset.tab;
      buildExchOptions();
      apply();
    });
    // 유형 칩
    document.querySelector('.filterbar').addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      state.type = c.dataset.type;
      apply();
    });
    // 거래소
    exchSel.addEventListener('change', function () { state.exch = exchSel.value; apply(); });
    // 뷰 토글 (리스트 / 버블) — 선택 저장
    $('viewtoggle').addEventListener('click', function (e) {
      var b = e.target.closest('.vbtn'); if (!b) return;
      if (b.dataset.layout === state.layout) return;
      state.layout = b.dataset.layout;
      try { localStorage.setItem(LS_LAYOUT, state.layout); } catch (_) {}
      applyLayout();
      resetRender();
    });
    // 검색 (디바운스)
    var t = null;
    qInput.addEventListener('input', function () {
      searchwrap.classList.toggle('has', !!qInput.value);
      clearTimeout(t);
      t = setTimeout(function () { state.q = qInput.value; apply(); }, 120);
    });
    $('clearq').addEventListener('click', function () {
      qInput.value = ''; state.q = ''; searchwrap.classList.remove('has'); apply(); qInput.focus();
    });
    // 정렬 헤더
    document.querySelector('thead').addEventListener('click', function (e) {
      var th = e.target.closest('th'); if (!th) return;
      var key = th.dataset.sort;
      if (state.sort.key === key) state.sort.dir *= -1;
      else { state.sort.key = key; state.sort.dir = 1; }
      apply();
    });
    // 무한 스크롤 — 스크롤 리스너(주) + IntersectionObserver(보조) 이중 안전망
    scrollarea.addEventListener('scroll', function () {
      if (scrollarea.scrollTop + scrollarea.clientHeight >= scrollarea.scrollHeight - 700) more();
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) more();
      }, { root: scrollarea, rootMargin: '700px' }).observe(sentinel);
    }
    // 단축키: / 로 검색 포커스
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== qInput) { e.preventDefault(); qInput.focus(); }
    });
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    tbody = $('tbody'); listview = $('listview'); bubbleview = $('bubbleview');
    scrollarea = $('scrollarea'); sentinel = $('sentinel');
    loading = $('loading'); endmsg = $('endmsg'); fcount = $('fcount');
    exchSel = $('exchSel'); qInput = $('q'); searchwrap = $('searchwrap');
    applyLayout(); // 저장된 선택 반영
    bind();
    load();
  });
})();
