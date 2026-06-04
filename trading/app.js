/* Briefick Terminal — app.js (vanilla, 무의존)
 * 데이터 정책: 실제 데이터만. 없으면 가짜로 안 채우고 상태 배지(지연/데이터없음/API필요/오류)로 표시.
 * 독립 페이지: 기존 briefick 서비스와 코드/상태 공유 없음.
 */
(() => {
'use strict';
const CFG = window.TRADING_CONFIG || {};
const LS = {
  get(k, d){ try{ const v=localStorage.getItem('bft.'+k); return v==null?d:JSON.parse(v);}catch(_){return d;} },
  set(k, v){ try{ localStorage.setItem('bft.'+k, JSON.stringify(v)); }catch(_){} },
  del(k){ try{ localStorage.removeItem('bft.'+k);}catch(_){} },
};

/* ---------- utils ---------- */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
function el(tag, attrs, html){ const e=document.createElement(tag); if(attrs) for(const k in attrs){ if(k==='class')e.className=attrs[k]; else if(k==='dataset')Object.assign(e.dataset,attrs[k]); else e.setAttribute(k,attrs[k]); } if(html!=null)e.innerHTML=html; return e; }
const nf = (n,d=2)=> (n==null||isNaN(n))?'–':Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const nf0 = n => (n==null||isNaN(n))?'–':Number(n).toLocaleString('en-US',{maximumFractionDigits:0});
function pct(n){ if(n==null||isNaN(n))return '–'; const s=n>=0?'+':''; return s+n.toFixed(2)+'%'; }
function sign(n){ if(n==null||isNaN(n))return ''; return n>0?'up':(n<0?'down':'flat'); }
function compact(n){ if(n==null||isNaN(n))return '–'; const a=Math.abs(n); if(a>=1e12)return (n/1e12).toFixed(2)+'T'; if(a>=1e9)return (n/1e9).toFixed(2)+'B'; if(a>=1e6)return (n/1e6).toFixed(2)+'M'; if(a>=1e3)return (n/1e3).toFixed(1)+'K'; return String(n);}
const DS_LABEL = {realtime:'실시간', delayed:'지연', unavailable:'데이터 없음', api:'API 필요', error:'오류', loading:'로딩'};
function dsBadge(state){ const s=state||'loading'; return `<span class="ds ${s}">${DS_LABEL[s]||s}</span>`; }
function timeAgo(ts){ if(!ts)return ''; const d=Date.now()-ts*1000; const m=Math.floor(d/60000); if(m<1)return '방금'; if(m<60)return m+'분 전'; const h=Math.floor(m/60); if(h<24)return h+'시간 전'; return Math.floor(h/24)+'일 전'; }

/* ---------- pub/sub ---------- */
const bus = {}; const on=(ev,cb)=>{(bus[ev]=bus[ev]||[]).push(cb);}; const emit=(ev,d)=>{(bus[ev]||[]).forEach(cb=>{try{cb(d)}catch(e){console.error(e)}});};

/* ---------- global state ---------- */
const state = {
  symbol: CFG.DEFAULT_SYMBOL || 'AAPL',
  watchlist: LS.get('watchlist', CFG.DEFAULT_WATCHLIST || ['AAPL','MSFT','NVDA']),
  settings: LS.get('settings', { geminiKey:'', liveEnabled:false, broker:'' }),
  chart: LS.get('chart', { range:'1y', interval:'1d', ind:{sma20:true,sma50:true,sma200:false,bb:false,rsi:true,macd:true,vol:true} }),
  quotes: {}, // symbol -> quote obj
};
function setSymbol(s){ s=(s||'').trim().toUpperCase(); if(!s)return; state.symbol=s; emit('symbol', s); }
function saveWatch(){ LS.set('watchlist', state.watchlist); }
function saveChart(){ LS.set('chart', state.chart); }
function saveSettings(){ LS.set('settings', state.settings); }

/* ---------- DataService (실데이터 프록시) ---------- */
const Data = (() => {
  let basePromise = null;
  async function resolveBase(){
    if(basePromise) return basePromise;
    basePromise = (async () => {
      // 1) 로컬/Docker 프록시
      try{
        const r = await fetch('/api/health', {cache:'no-store'});
        if(r.ok){ return '/api/market-data'; }
      }catch(_){}
      // 2) 프로덕션 Supabase Edge Function
      if(CFG.SUPABASE_MARKET_URL) return CFG.SUPABASE_MARKET_URL;
      return null; // 3) 없음 → API 필요
    })();
    return basePromise;
  }
  async function call(params){
    const base = await resolveBase();
    if(!base) { const e=new Error('no-data-source'); e.api=true; throw e; }
    const url = base + (base.includes('?')?'&':'?') + new URLSearchParams(params).toString();
    const r = await fetch(url);
    if(!r.ok) throw new Error('proxy '+r.status);
    return r.json();
  }
  return {
    resolveBase,
    async chart(symbol, range, interval){ return call({type:'chart', symbol, range, interval}); },
    async quote(symbols){ return call({type:'quote', symbols: symbols.join(',')}); },
  };
})();

/* ---------- quote cache + poll ---------- */
async function refreshQuotes(symbols){
  const list = Array.from(new Set(symbols.filter(Boolean)));
  if(!list.length) return;
  try{
    const {quotes} = await Data.quote(list);
    Object.assign(state.quotes, quotes);
    emit('quotes', quotes);
  }catch(e){
    list.forEach(s=>{ if(!state.quotes[s]) state.quotes[s]={dataState: e.api?'api':'error'}; });
    emit('quotes', {});
  }
}

/* ================= Indicators ================= */
function SMA(arr, p){ const o=Array(arr.length).fill(null); let s=0; for(let i=0;i<arr.length;i++){ s+=arr[i]; if(i>=p)s-=arr[i-p]; if(i>=p-1)o[i]=s/p; } return o; }
function EMA(arr, p){ const o=Array(arr.length).fill(null); const k=2/(p+1); let prev=null; for(let i=0;i<arr.length;i++){ const v=arr[i]; if(prev==null){ if(i>=p-1){ let s=0;for(let j=i-p+1;j<=i;j++)s+=arr[j]; prev=s/p; o[i]=prev; } } else { prev=v*k+prev*(1-k); o[i]=prev; } } return o; }
function STD(arr, p, sma){ const o=Array(arr.length).fill(null); for(let i=p-1;i<arr.length;i++){ let s=0; const m=sma[i]; for(let j=i-p+1;j<=i;j++)s+=(arr[j]-m)**2; o[i]=Math.sqrt(s/p);} return o; }
function BB(arr,p=20,k=2){ const m=SMA(arr,p); const sd=STD(arr,p,m); return {mid:m, up:m.map((v,i)=>v==null?null:v+k*sd[i]), lo:m.map((v,i)=>v==null?null:v-k*sd[i])}; }
function RSI(arr,p=14){ const o=Array(arr.length).fill(null); let g=0,l=0; for(let i=1;i<arr.length;i++){ const d=arr[i]-arr[i-1]; const up=Math.max(d,0),dn=Math.max(-d,0); if(i<=p){ g+=up;l+=dn; if(i===p){ g/=p;l/=p; o[i]=100-100/(1+(l===0?100:g/l)); } } else { g=(g*(p-1)+up)/p; l=(l*(p-1)+dn)/p; o[i]=100-100/(1+(l===0?100:g/l)); } } return o; }
function MACD(arr,f=12,s=26,sig=9){ const ef=EMA(arr,f), es=EMA(arr,s); const macd=arr.map((_,i)=>(ef[i]==null||es[i]==null)?null:ef[i]-es[i]); const mvals=macd.map(v=>v==null?0:v); const signal=EMA(mvals,sig).map((v,i)=>macd[i]==null?null:v); const hist=macd.map((v,i)=>(v==null||signal[i]==null)?null:v-signal[i]); return {macd,signal,hist}; }

/* ================= ChartEngine ================= */
class ChartEngine{
  constructor(canvas){ this.cv=canvas; this.ctx=canvas.getContext('2d'); this.candles=[]; this.opt=state.chart.ind; this.dpr=Math.min(window.devicePixelRatio||1,2); }
  setData(c){ this.candles=c||[]; }
  setOpt(o){ this.opt=o; }
  resize(){ const r=this.cv.parentElement.getBoundingClientRect(); this.W=r.width; this.H=r.height; this.cv.width=Math.max(1,r.width*this.dpr); this.cv.height=Math.max(1,r.height*this.dpr); this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0); }
  draw(){
    this.resize(); const ctx=this.ctx, W=this.W, H=this.H; ctx.clearRect(0,0,W,H);
    const c=this.candles; if(!c||c.length<2){ return; }
    const o=this.opt; const padR=58, padL=6, padT=6, axisH=18;
    const rsiOn=o.rsi, macdOn=o.macd, volOn=o.vol;
    let sub=0; const subH=Math.max(46,Math.min(80,H*0.16));
    if(rsiOn)sub++; if(macdOn)sub++;
    const volH = volOn?Math.max(34,H*0.13):0;
    const priceH = H - axisH - volH - sub*subH - padT;
    if(priceH<40){ /* too small */ }
    const n=c.length; const plotW=W-padR-padL;
    const cw=Math.max(1, plotW/n); const bw=Math.min(14, cw*0.7);
    const X=i=> padL + i*cw + cw/2;
    const closes=c.map(x=>x.c);
    // price range
    let lo=Infinity,hi=-Infinity; for(const k of c){ if(k.l<lo)lo=k.l; if(k.h>hi)hi=k.h; }
    let extra=[];
    const sma20=SMA(closes,20),sma50=SMA(closes,50),sma200=SMA(closes,200);
    let bb=null; if(o.bb){ bb=BB(closes,20,2); for(const a of [bb.up,bb.lo]){a.forEach(v=>{if(v!=null){if(v<lo)lo=v;if(v>hi)hi=v;}});} }
    const pad=(hi-lo)*0.06||1; lo-=pad; hi+=pad;
    const pyTop=padT, pyBot=padT+priceH;
    const Y=v=> pyBot - (v-lo)/(hi-lo)*(pyBot-pyTop);
    // grid + price axis
    ctx.font='9px monospace'; ctx.textBaseline='middle';
    ctx.strokeStyle='#1a2330'; ctx.fillStyle='#64748b'; ctx.lineWidth=1;
    for(let g=0;g<=4;g++){ const v=lo+(hi-lo)*g/4; const y=Y(v); ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(W-padR,y);ctx.stroke(); ctx.textAlign='left'; ctx.fillText(nf(v, v>1000?0:2), W-padR+4, y); }
    // candles
    for(let i=0;i<n;i++){ const k=c[i]; const x=X(i); const up=k.c>=k.o; ctx.strokeStyle=up?'#19c37d':'#ef5350'; ctx.fillStyle=up?'#19c37d':'#ef5350';
      ctx.beginPath();ctx.moveTo(x,Y(k.h));ctx.lineTo(x,Y(k.l));ctx.stroke();
      const yo=Y(k.o),yc=Y(k.c); const top=Math.min(yo,yc); const hgt=Math.max(1,Math.abs(yc-yo)); ctx.fillRect(x-bw/2, top, bw, hgt);
    }
    const line=(data,color)=>{ ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();let started=false; for(let i=0;i<n;i++){ if(data[i]==null){started=false;continue;} const x=X(i),y=Y(data[i]); if(!started){ctx.moveTo(x,y);started=true;}else ctx.lineTo(x,y);} ctx.stroke(); };
    if(o.bb&&bb){ line(bb.up,'#3b82f655'); line(bb.lo,'#3b82f655'); line(bb.mid,'#3b82f6aa'); }
    if(o.sma20) line(sma20,'#e0a64b');
    if(o.sma50) line(sma50,'#60a5fa');
    if(o.sma200) line(sma200,'#a78bfa');
    // last price line
    const last=c[n-1].c; ctx.strokeStyle='#9fb0c3'; ctx.setLineDash([3,3]); ctx.beginPath();ctx.moveTo(padL,Y(last));ctx.lineTo(W-padR,Y(last));ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#0a0e14'; ctx.fillRect(W-padR+1,Y(last)-7,padR-1,14); ctx.fillStyle=c[n-1].c>=c[n-1].o?'#19c37d':'#ef5350'; ctx.textAlign='left'; ctx.fillText(nf(last,last>1000?0:2),W-padR+4,Y(last));
    // volume pane
    let curY=pyBot;
    if(volOn){ const vTop=pyBot, vBot=pyBot+volH; let vmax=0; for(const k of c)if(k.v>vmax)vmax=k.v; for(let i=0;i<n;i++){ const k=c[i]; const x=X(i); const h=vmax?(k.v/vmax)*(volH-4):0; ctx.fillStyle=k.c>=k.o?'#19c37d55':'#ef535055'; ctx.fillRect(x-bw/2, vBot-h, bw, h);} ctx.fillStyle='#64748b';ctx.textAlign='left';ctx.fillText('Vol '+compact(c[n-1].v), padL+2, vTop+8); curY=vBot; }
    // RSI pane
    if(rsiOn){ const top=curY, bot=curY+subH; const rsi=RSI(closes,14); const ry=v=>bot-(v/100)*(bot-top); ctx.strokeStyle='#1a2330';[30,50,70].forEach(g=>{ctx.beginPath();ctx.moveTo(padL,ry(g));ctx.lineTo(W-padR,ry(g));ctx.stroke();}); ctx.strokeStyle='#a78bfa';ctx.lineWidth=1;ctx.beginPath();let st=false;for(let i=0;i<n;i++){if(rsi[i]==null){st=false;continue;}const x=X(i),y=ry(rsi[i]);if(!st){ctx.moveTo(x,y);st=true;}else ctx.lineTo(x,y);}ctx.stroke(); ctx.fillStyle='#64748b';ctx.textAlign='left';ctx.fillText('RSI(14) '+(rsi[n-1]!=null?rsi[n-1].toFixed(1):'–'),padL+2,top+8); curY=bot; }
    // MACD pane
    if(macdOn){ const top=curY, bot=curY+subH; const {macd,signal,hist}=MACD(closes); let mx=0; for(let i=0;i<n;i++){ for(const v of [macd[i],signal[i],hist[i]]) if(v!=null&&Math.abs(v)>mx)mx=Math.abs(v);} mx=mx||1; const my=v=>(top+bot)/2 - (v/mx)*((bot-top)/2-2); for(let i=0;i<n;i++){ if(hist[i]==null)continue; const x=X(i); const y0=my(0),y1=my(hist[i]); ctx.fillStyle=hist[i]>=0?'#19c37d66':'#ef535066'; ctx.fillRect(x-bw/2,Math.min(y0,y1),bw,Math.abs(y1-y0)); } const ml=(d,col)=>{ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();let st=false;for(let i=0;i<n;i++){if(d[i]==null){st=false;continue;}const x=X(i),y=my(d[i]);if(!st){ctx.moveTo(x,y);st=true;}else ctx.lineTo(x,y);}ctx.stroke();}; ml(macd,'#60a5fa'); ml(signal,'#e0a64b'); ctx.fillStyle='#64748b';ctx.textAlign='left';ctx.fillText('MACD(12,26,9)',padL+2,top+8); curY=bot; }
    // date axis
    ctx.fillStyle='#64748b';ctx.textAlign='center'; const ticks=Math.min(6,n); for(let t=0;t<ticks;t++){ const i=Math.floor(t*(n-1)/(ticks-1)); const d=new Date(c[i].t*1000); const lbl=(d.getMonth()+1)+'/'+d.getDate(); ctx.fillText(lbl, X(i), H-axisH/2); }
  }
}

/* ================= Panels ================= */
// 각 panel: factory(ctx) → {title, mount(body, headExtra)} ; mount은 optional {refresh, destroy} 반환
const RANGE_BTNS=[['1mo','1M'],['3mo','3M'],['6mo','6M'],['1y','1Y'],['2y','2Y'],['5y','5Y'],['10y','10Y']];
const IV_BTNS=[['1d','1D'],['1wk','1W'],['1mo','1M']];

const Panels = {
  /* 지수 요약 */
  indices: () => ({ title:'MARKET PULSE', def:{h:200},
    mount(body){
      body.innerHTML='<div class="note">불러오는 중…</div>';
      const render=()=>{
        const rows=(CFG.INDICES||[]).map(ix=>{ const q=state.quotes[ix.sym]||{}; const ds=q.dataState;
          const val = q.price!=null? nf(q.price, q.price>1000?0:2) : `<span class="na">–</span>`;
          const ch = q.changePct!=null? `<span class="${sign(q.changePct)}">${pct(q.changePct)}</span>` : (ds?dsBadge(ds):'');
          return `<div class="kv"><span class="k">${ix.label}</span><span class="v">${val} &nbsp; ${ch}</span></div>`;
        }).join('');
        body.innerHTML=rows||'<div class="note">데이터 없음</div>';
      };
      render(); on('quotes',render);
      return { refresh(){ refreshQuotes((CFG.INDICES||[]).map(i=>i.sym)); } };
    }}),

  /* 관심종목 */
  watchlist: () => ({ title:'WATCHLIST', def:{h:260},
    mount(body,head){
      const addBtn=el('button',{class:'pbtn',title:'추가'},'+'); head.appendChild(addBtn);
      addBtn.onclick=()=>{ const s=prompt('티커 추가 (예: AAPL, 005930.KS)'); if(s){ const u=s.trim().toUpperCase(); if(!state.watchlist.includes(u)){state.watchlist.push(u);saveWatch();draw();refreshQuotes([u]);} } };
      function draw(){
        const rows=state.watchlist.map(sym=>{ const q=state.quotes[sym]||{}; const ds=q.dataState;
          const px=q.price!=null?nf(q.price,q.price>1000?2:2):'–';
          const ch=q.changePct!=null?`<span class="${sign(q.changePct)}">${pct(q.changePct)}</span>`:(ds?dsBadge(ds):'');
          return `<tr data-s="${sym}" class="${sym===state.symbol?'sel':''}"><td class="l"><span class="tsym">${sym}</span></td><td>${px}</td><td>${ch}</td><td class="l"><span class="x" data-del="${sym}" style="color:#64748b;cursor:pointer">✕</span></td></tr>`;
        }).join('');
        body.innerHTML=`<table class="grid"><thead><tr><th class="l">SYM</th><th>LAST</th><th>CHG%</th><th></th></tr></thead><tbody>${rows||'<tr><td class="l" colspan="4">비어 있음</td></tr>'}</tbody></table>`;
        $$('.tsym',body).forEach(t=>t.onclick=()=>setSymbol(t.closest('tr').dataset.s));
        $$('[data-del]',body).forEach(x=>x.onclick=(e)=>{e.stopPropagation(); state.watchlist=state.watchlist.filter(w=>w!==x.dataset.del);saveWatch();draw();});
      }
      draw(); on('quotes',draw); on('symbol',draw);
      return { refresh(){ refreshQuotes(state.watchlist); } };
    }}),

  /* 종목 상세 */
  quote: () => ({ title:'QUOTE', def:{h:240},
    mount(body){
      function draw(){ const sym=state.symbol; const q=state.quotes[sym]||{}; const ds=q.dataState||'loading';
        const chCls=sign(q.change);
        body.innerHTML = `
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px">
            <span class="mono" style="font-weight:700;font-size:15px">${sym}</span> ${dsBadge(ds)}
          </div>
          <div class="big ${chCls}">${q.price!=null?nf(q.price,2):'–'}</div>
          <div class="mono ${chCls}" style="margin:4px 0 10px">${q.change!=null?(q.change>=0?'+':'')+nf(q.change,2):''} ${q.changePct!=null?'('+pct(q.changePct)+')':''}</div>
          <div class="kv"><span class="k">전일 종가</span><span class="v">${q.prevClose!=null?nf(q.prevClose,2):'–'}</span></div>
          <div class="kv"><span class="k">통화</span><span class="v">${q.currency||'–'}</span></div>
          <div class="kv"><span class="k">데이터</span><span class="v">${DS_LABEL[ds]||ds} ${q.time?'· '+timeAgo(q.time):''}</span></div>
          <div class="row" style="margin-top:10px">
            <button class="btn sm" data-act="chart">차트</button>
            <button class="btn sm" data-act="add">관심추가</button>
            <button class="btn sm" data-act="order">주문</button>
          </div>`;
        $('[data-act="chart"]',body).onclick=()=>switchTab('chart');
        $('[data-act="add"]',body).onclick=()=>{ if(!state.watchlist.includes(sym)){state.watchlist.push(sym);saveWatch();refreshQuotes([sym]);} };
        $('[data-act="order"]',body).onclick=()=>switchTab('orders');
      }
      draw(); on('symbol',()=>{draw();refreshQuotes([state.symbol]);}); on('quotes',draw);
      return { refresh(){ refreshQuotes([state.symbol]); } };
    }}),

  /* 등락 상위 (관심종목 기반) */
  movers: () => ({ title:'MOVERS (WATCHLIST)', def:{h:240},
    mount(body){
      function draw(){ const arr=state.watchlist.map(s=>({s,q:state.quotes[s]||{}})).filter(x=>x.q.changePct!=null).sort((a,b)=>b.q.changePct-a.q.changePct);
        if(!arr.length){ body.innerHTML='<div class="note">시세 로딩 시 표시됩니다.</div>'; return; }
        const row=x=>`<tr data-s="${x.s}"><td class="l"><span class="tsym">${x.s}</span></td><td>${nf(x.q.price,2)}</td><td class="${sign(x.q.changePct)}">${pct(x.q.changePct)}</td></tr>`;
        const top=arr.slice(0,5).map(row).join(''); const bot=arr.slice(-5).reverse().map(row).join('');
        body.innerHTML=`<div class="note" style="margin-bottom:3px">상승 ▲</div><table class="grid"><tbody>${top}</tbody></table><div class="note" style="margin:8px 0 3px">하락 ▼</div><table class="grid"><tbody>${bot}</tbody></table>`;
        $$('.tsym',body).forEach(t=>t.onclick=()=>setSymbol(t.closest('tr').dataset.s));
      }
      draw(); on('quotes',draw);
      return {};
    }}),

  /* 차트 */
  chart: () => ({ title:'CHART', def:{h:520},
    mount(body){
      body.style.padding='0'; body.style.display='flex'; body.style.flexDirection='column';
      const tb=el('div',{class:'chart-toolbar'});
      const rg=el('div',{class:'grp'}); RANGE_BTNS.forEach(([v,l])=>{ const b=el('button',{},l); if(v===state.chart.range)b.classList.add('on'); b.onclick=()=>{state.chart.range=v;saveChart();$$('.grp button',rg).forEach(x=>x.classList.remove('on'));b.classList.add('on');load();}; rg.appendChild(b); });
      const iv=el('div',{class:'grp'}); IV_BTNS.forEach(([v,l])=>{ const b=el('button',{},l); if(v===state.chart.interval)b.classList.add('on'); b.onclick=()=>{state.chart.interval=v;saveChart();$$('.grp button',iv).forEach(x=>x.classList.remove('on'));b.classList.add('on');load();}; iv.appendChild(b); });
      const ind=el('div',{class:'ind'});
      const IND=[['sma20','MA20'],['sma50','MA50'],['sma200','MA200'],['bb','BB'],['rsi','RSI'],['macd','MACD'],['vol','VOL']];
      IND.forEach(([k,l])=>{ const id='ind_'+k; ind.innerHTML+=`<label><input type="checkbox" id="${id}" ${state.chart.ind[k]?'checked':''}>${l}</label>`; });
      tb.appendChild(rg); tb.appendChild(iv); tb.appendChild(ind);
      const host=el('div',{class:'chart-host'}); const cv=el('canvas'); const empty=el('div',{class:'chart-empty'},''); host.appendChild(cv); host.appendChild(empty);
      body.appendChild(tb); body.appendChild(host);
      IND.forEach(([k])=>{ tb.querySelector('#ind_'+k).onchange=(e)=>{ state.chart.ind[k]=e.target.checked; saveChart(); eng.setOpt(state.chart.ind); eng.draw(); }; });
      const eng=new ChartEngine(cv);
      let ro=null;
      async function load(){
        empty.textContent='차트 로딩 중…'; empty.style.display='flex';
        try{
          const d=await Data.chart(state.symbol, state.chart.range, state.chart.interval);
          if(!d.candles||d.candles.length<2){ empty.innerHTML=`이 기간/인터벌 데이터 없음 ${dsBadge('unavailable')}`; eng.setData([]); eng.draw(); return; }
          eng.setData(d.candles); eng.setOpt(state.chart.ind);
          empty.style.display='none'; eng.draw();
          headBadge('delayed');
        }catch(e){ empty.innerHTML = (e.api?`시세 프록시(API) 필요 ${dsBadge('api')}<br><span class="note">로컬: node server, 또는 Supabase market-data 함수 배포</span>`:`차트 데이터 오류 ${dsBadge('error')}`); eng.setData([]); eng.draw(); headBadge(e.api?'api':'error'); }
      }
      let badgeEl=null; function headBadge(s){ if(badgeEl) badgeEl.outerHTML=dsBadge(s); }
      ro=new ResizeObserver(()=>eng.draw()); ro.observe(host);
      on('symbol', load);
      load();
      return { destroy(){ if(ro)ro.disconnect(); } };
    }}),

  /* 뉴스 (브리픽 실데이터 + 정직한 상태) */
  news: () => ({ title:'NEWS', def:{h:320},
    mount(body){
      body.innerHTML='<div class="note">뉴스 불러오는 중…</div>';
      (async()=>{
        try{
          const r=await fetch('https://ytvcgoldauysvnqckzze.supabase.co/storage/v1/object/public/tabs/latest.json');
          if(!r.ok) throw new Error('news');
          const j=await r.json(); const items=[];
          ['stocks','kr','ai','commodity'].forEach(tab=>{ const u=(j.updates&&j.updates[tab]&&j.updates[tab][0]); if(u&&u.summary){ String(u.summary).split('\n').map(s=>s.trim()).filter(Boolean).forEach(line=>items.push({tab,line,date:u.date})); } });
          if(!items.length){ body.innerHTML=`<div class="note">뉴스 없음 ${dsBadge('unavailable')}</div>`; return; }
          const sentOf=t=>{ if(/상승|급등|호재|신고가|강세|돌파|사상 최고|순매수/.test(t))return 'bull'; if(/하락|급락|악재|약세|손실|적자|매도|우려/.test(t))return 'bear'; return 'neu'; };
          const tabKo={stocks:'미국',kr:'한국',ai:'AI',commodity:'원자재'};
          body.innerHTML = `<div class="note" style="margin-bottom:6px">브리픽 실시간 시황 ${dsBadge('realtime')} · 미국 원문/번역은 ${dsBadge('api')} (Gemini)</div>` +
            items.slice(0,30).map(it=>{ const s=sentOf(it.line); const sl={bull:'강세',bear:'약세',neu:'중립'}[s];
              return `<div class="news-item"><div class="h">${it.line}</div><div class="m"><span class="pill">${tabKo[it.tab]}</span><span class="sent ${s}">${sl}</span><span>${(it.date||'').slice(5,16)}</span></div></div>`; }).join('');
        }catch(e){ body.innerHTML=`<div class="warn">뉴스 소스 연결 실패 ${dsBadge('error')}<br>미국 주식 원문 뉴스는 별도 API(Finnhub/Marketaux 등) 필요 — README 참조.</div>`; }
      })();
      return {};
    }}),

  /* AI 시장 요약 */
  aisummary: () => ({ title:'AI MARKET SUMMARY', def:{h:240},
    mount(body){
      const refresh=el('button',{class:'pbtn',title:'다시'},'↻');
      function build(){
        body.innerHTML='<div class="note">요약 생성 중…</div>';
        AI.marketSummary().then(txt=>{ body.innerHTML=`<div class="ai-msg a">${txt.replace(/\n/g,'<br>')}</div>`; });
      }
      build();
      return {};
    }}),

  /* 포트폴리오 보유 */
  holdings: () => ({ title:'PORTFOLIO · HOLDINGS', def:{h:340},
    mount(body,head){
      const add=el('button',{class:'pbtn',title:'추가'},'+'); head.appendChild(add);
      add.onclick=()=>Portfolio.addPrompt(draw);
      function draw(){
        const h=Portfolio.get(); if(!h.length){ body.innerHTML='<div class="note">보유 종목이 없습니다. + 로 추가하거나 브로커 연동(README).</div>'; refreshQuotes([]); return; }
        refreshQuotes(h.map(x=>x.symbol));
        const rows=h.map((p,i)=>{ const q=state.quotes[p.symbol]||{}; const px=q.price; const val=px!=null?px*p.qty:null; const cost=p.avgCost*p.qty; const pl=val!=null?val-cost:null; const plp=val!=null&&cost?((val-cost)/cost*100):null;
          return `<tr><td class="l"><span class="tsym">${p.symbol}</span></td><td>${nf0(p.qty)}</td><td>${nf(p.avgCost,2)}</td><td>${px!=null?nf(px,2):dsBadge(q.dataState||'loading')}</td><td>${val!=null?nf0(val):'–'}</td><td class="${sign(pl)}">${pl!=null?(pl>=0?'+':'')+nf0(pl):'–'}</td><td class="${sign(plp)}">${plp!=null?pct(plp):'–'}</td><td class="l"><span data-edit="${i}" style="cursor:pointer;color:#64748b">✎</span> <span data-del="${i}" style="cursor:pointer;color:#64748b">✕</span></td></tr>`;
        }).join('');
        body.innerHTML=`<table class="grid"><thead><tr><th class="l">SYM</th><th>QTY</th><th>평단</th><th>현재</th><th>평가</th><th>손익</th><th>%</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
        $$('.tsym',body).forEach(t=>t.onclick=()=>setSymbol(t.textContent));
        $$('[data-del]',body).forEach(x=>x.onclick=()=>{Portfolio.remove(+x.dataset.del);draw();emit('portfolio');});
        $$('[data-edit]',body).forEach(x=>x.onclick=()=>{Portfolio.editPrompt(+x.dataset.edit,draw);});
      }
      draw(); on('quotes',draw); on('portfolio',draw);
      return { refresh(){ const h=Portfolio.get(); refreshQuotes(h.map(x=>x.symbol)); } };
    }}),

  /* 포트폴리오 비중/지표 */
  alloc: () => ({ title:'ALLOCATION & METRICS', def:{h:340},
    mount(body){
      function draw(){
        const h=Portfolio.get(); if(!h.length){ body.innerHTML='<div class="note">보유 종목 추가 시 비중·손익·리밸런싱을 계산합니다.</div>'; return; }
        let tv=0, tcost=0; const items=h.map(p=>{ const q=state.quotes[p.symbol]||{}; const val=q.price!=null?q.price*p.qty:0; tv+=val; tcost+=p.avgCost*p.qty; return {p,val,cur:q.currency}; });
        const byCur={}; items.forEach(it=>{ const c=it.p.currency||it.cur||'?'; byCur[c]=(byCur[c]||0)+it.val; });
        const bySec={}; items.forEach(it=>{ const s=it.p.sector||'미분류'; bySec[s]=(bySec[s]||0)+it.val; });
        const byCtry={}; items.forEach(it=>{ const c=it.p.country||(/\.KS|\.KQ/.test(it.p.symbol)?'KR':(it.p.currency==='KRW'?'KR':'US')); byCtry[c]=(byCtry[c]||0)+it.val; });
        const pl=tv-tcost, plp=tcost?pl/tcost*100:null;
        const bars=(obj)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{ const w=tv?v/tv*100:0; return `<div style="margin:4px 0"><div class="kv" style="border:0;padding:1px 0"><span class="k">${k}</span><span class="v">${w.toFixed(1)}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${w.toFixed(1)}%"></div></div></div>`; }).join('');
        const reb = Object.entries(bySec).map(([k,v])=>({k,w:tv?v/tv*100:0})).filter(x=>x.w>30);
        body.innerHTML = `
          <div class="kv"><span class="k">총 평가금액</span><span class="v">${nf0(tv)}</span></div>
          <div class="kv"><span class="k">총 손익</span><span class="v ${sign(pl)}">${pl>=0?'+':''}${nf0(pl)} (${plp!=null?pct(plp):'–'})</span></div>
          <div class="kv"><span class="k">배당 예상</span><span class="v">${dsBadge('api')} 배당 API 필요</span></div>
          <div class="note" style="margin:8px 0 2px">섹터 비중 <span class="note">(수동 입력 기반)</span></div>${bars(bySec)}
          <div class="note" style="margin:8px 0 2px">국가 비중</div>${bars(byCtry)}
          <div class="note" style="margin:8px 0 2px">통화 비중</div>${bars(byCur)}
          <div style="margin-top:8px">${reb.length?`<div class="warn">리밸런싱 필요: ${reb.map(r=>r.k+' '+r.w.toFixed(0)+'%').join(', ')} (30% 초과)</div>`:'<div class="note">리밸런싱: 단일 섹터 30% 초과 없음 ✓</div>'}</div>`;
      }
      draw(); on('quotes',draw); on('portfolio',draw);
      return {};
    }}),

  /* 옵션 (정직한 API 필요 + 인터페이스) */
  options: () => ({ title:'OPTIONS CHAIN', def:{h:340},
    mount(body){
      function draw(){ body.innerHTML=`
        <div class="note" style="margin-bottom:8px">${state.symbol} 옵션 체인</div>
        <div class="warn">옵션 체인 실데이터는 별도 API 필요 ${dsBadge('api')}<br>
        지원 예정 제공자: <b>Polygon.io</b>, <b>Tradier</b>, <b>CBOE</b>. README의 "데이터 제공자" 참조.<br>
        가짜 행사가/IV 를 표시하지 않기 위해 비워둡니다.</div>
        <table class="grid" style="margin-top:8px;opacity:.5"><thead><tr><th>CALL OI</th><th>BID</th><th>ASK</th><th>STRIKE</th><th>BID</th><th>ASK</th><th>PUT OI</th></tr></thead>
        <tbody><tr><td colspan="7" class="l">데이터 없음 — API 연결 시 표시</td></tr></tbody></table>`; }
      draw(); on('symbol',draw); return {};
    }}),

  /* 주문 티켓 (Paper) */
  ticket: () => ({ title:'ORDER TICKET', def:{h:340},
    mount(body){
      function draw(){ const sym=state.symbol; const q=state.quotes[sym]||{}; const live=state.settings.liveEnabled;
        body.innerHTML=`
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span class="mono" style="font-weight:700;font-size:14px">${sym}</span>
            <span class="modebadge ${live?'live':'paper'}">${live?'● LIVE 실거래':'● PAPER 모의'}</span>
          </div>
          ${live?'<div class="danger">실거래 모드입니다. 실제 자금이 사용될 수 있습니다.</div>':'<div class="note" style="margin-bottom:6px">모의 거래 — 실제 체결되지 않습니다.</div>'}
          <div class="kv"><span class="k">현재가</span><span class="v">${q.price!=null?nf(q.price,2):dsBadge(q.dataState||'loading')}</span></div>
          <div class="fld"><label>수량</label><input id="o_qty" type="number" min="1" value="10"></div>
          <div class="fld"><label>주문유형</label><select id="o_type"><option value="market">시장가</option><option value="limit">지정가</option></select></div>
          <div class="fld" id="o_lwrap" style="display:none"><label>지정가</label><input id="o_limit" type="number" step="0.01" value="${q.price!=null?q.price.toFixed(2):''}"></div>
          <div class="row split" style="margin-top:4px">
            <button class="btn buy" data-side="buy">매수 BUY</button>
            <button class="btn sell" data-side="sell">매도 SELL</button>
          </div>
          <div id="o_msg" class="note" style="margin-top:8px"></div>
          ${live?'':'<div class="note" style="margin-top:6px">실거래는 [설정]에서 명시적으로 켜야 가능합니다.</div>'}`;
        $('#o_type',body).onchange=e=>{ $('#o_lwrap',body).style.display=e.target.value==='limit'?'':'none'; };
        $$('[data-side]',body).forEach(b=>b.onclick=()=>{
          const side=b.dataset.side; const qty=+$('#o_qty',body).value; const type=$('#o_type',body).value; const limit=+($('#o_limit',body)||{}).value;
          const msg=$('#o_msg',body);
          if(state.settings.liveEnabled){ msg.innerHTML=`<span class="down">실거래 연동은 브로커 설정 후 사용하세요 (README). 현재 주문 차단.</span>`; return; }
          const r=Paper.order(side,sym,qty,type,limit,q.price);
          msg.innerHTML = r.ok?`<span class="up">모의 ${side==='buy'?'매수':'매도'} 체결: ${qty}주 @ ${nf(r.fill,2)} (현금 ${nf0(r.cash)})</span>`:`<span class="down">${r.err}</span>`;
          emit('paper');
        });
      }
      draw(); on('symbol',()=>{draw();refreshQuotes([state.symbol]);}); on('quotes',draw); on('settings',draw);
      return { refresh(){ refreshQuotes([state.symbol]); } };
    }}),

  /* 포지션 (Paper) */
  positions: () => ({ title:'POSITIONS (PAPER)', def:{h:240},
    mount(body){
      function draw(){ const acc=Paper.get(); const syms=Object.keys(acc.pos); if(syms.length)refreshQuotes(syms);
        const rows=syms.map(s=>{ const p=acc.pos[s]; const q=state.quotes[s]||{}; const val=q.price!=null?q.price*p.qty:null; const pl=val!=null?val-p.avgCost*p.qty:null;
          return `<tr><td class="l"><span class="tsym">${s}</span></td><td>${nf0(p.qty)}</td><td>${nf(p.avgCost,2)}</td><td>${q.price!=null?nf(q.price,2):'–'}</td><td class="${sign(pl)}">${pl!=null?(pl>=0?'+':'')+nf0(pl):'–'}</td></tr>`; }).join('');
        body.innerHTML=`<div class="kv"><span class="k">현금</span><span class="v">${nf0(acc.cash)}</span></div>
          <table class="grid" style="margin-top:6px"><thead><tr><th class="l">SYM</th><th>QTY</th><th>평단</th><th>현재</th><th>손익</th></tr></thead><tbody>${rows||'<tr><td class="l" colspan="5">포지션 없음</td></tr>'}</tbody></table>`;
        $$('.tsym',body).forEach(t=>t.onclick=()=>setSymbol(t.textContent));
      }
      draw(); on('paper',draw); on('quotes',draw); return {};
    }}),

  /* 체결 내역 (Paper) */
  blotter: () => ({ title:'ORDER BLOTTER (PAPER)', def:{h:240},
    mount(body){
      function draw(){ const acc=Paper.get();
        const rows=(acc.log||[]).slice().reverse().slice(0,50).map(o=>`<tr><td class="l">${new Date(o.t).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}</td><td class="l ${o.side==='buy'?'up':'down'}">${o.side==='buy'?'매수':'매도'}</td><td class="l">${o.sym}</td><td>${nf0(o.qty)}</td><td>${nf(o.fill,2)}</td></tr>`).join('');
        body.innerHTML=`<table class="grid"><thead><tr><th class="l">시각</th><th class="l">구분</th><th class="l">SYM</th><th>QTY</th><th>체결가</th></tr></thead><tbody>${rows||'<tr><td class="l" colspan="5">내역 없음</td></tr>'}</tbody></table>`;
      }
      draw(); on('paper',draw); return {};
    }}),

  /* AI 어시스턴트 */
  aichat: () => ({ title:'AI ASSISTANT', def:{h:420},
    mount(body){
      body.style.display='flex'; body.style.flexDirection='column';
      const log=el('div',{class:'ai-log'},''); log.style.flex='1'; log.style.overflow='auto';
      const inwrap=el('div',{class:'row'},`<input id="ai_in" class="fld" style="margin:0" placeholder="질문 (예: 엔비디아 어때? 내 포트폴리오 분석)"><button class="btn pri" id="ai_send">전송</button>`);
      inwrap.style.marginTop='8px';
      body.appendChild(log); body.appendChild(inwrap);
      const keyNote = state.settings.geminiKey?'':' (Gemini 키 없음 → 규칙기반 요약)';
      log.appendChild(el('div',{class:'ai-msg a'},`안녕하세요. 종목·뉴스·포트폴리오 기반 한국어 분석을 제공합니다.${keyNote}<span class="src">${state.settings.geminiKey?'Gemini':'로컬 규칙기반'}</span>`));
      async function send(){ const inp=$('#ai_in',body); const q=inp.value.trim(); if(!q)return; inp.value='';
        log.appendChild(el('div',{class:'ai-msg u'},q)); log.scrollTop=log.scrollHeight;
        const wait=el('div',{class:'ai-msg a'},'분석 중…'); log.appendChild(wait); log.scrollTop=log.scrollHeight;
        const ans=await AI.ask(q); wait.innerHTML=ans.text.replace(/\n/g,'<br>')+`<span class="src">${ans.src}</span>`; log.scrollTop=log.scrollHeight;
      }
      $('#ai_send',body).onclick=send; $('#ai_in',body).onkeydown=e=>{if(e.key==='Enter')send();};
      return {};
    }}),
};

/* ================= Portfolio ================= */
const Portfolio = {
  get(){ return LS.get('portfolio', []); },
  save(h){ LS.set('portfolio', h); },
  addPrompt(cb){ const sym=prompt('티커 (예: AAPL, 005930.KS)'); if(!sym)return; const qty=+prompt('수량',''); const avg=+prompt('평균 매입가',''); if(!qty||!avg)return; const sector=prompt('섹터(선택, 예: Technology)','')||''; const country=prompt('국가(선택, US/KR)','')||''; const currency=prompt('통화(선택, USD/KRW)','')||''; const h=this.get(); h.push({symbol:sym.trim().toUpperCase(),qty,avgCost:avg,sector,country,currency}); this.save(h); refreshQuotes([sym.trim().toUpperCase()]); emit('portfolio'); cb&&cb(); },
  editPrompt(i,cb){ const h=this.get(); const p=h[i]; if(!p)return; const qty=+prompt('수량',p.qty); const avg=+prompt('평균 매입가',p.avgCost); if(qty)p.qty=qty; if(avg)p.avgCost=avg; const sec=prompt('섹터',p.sector||''); if(sec!=null)p.sector=sec; this.save(h); emit('portfolio'); cb&&cb(); },
  remove(i){ const h=this.get(); h.splice(i,1); this.save(h); emit('portfolio'); },
};

/* ================= Paper trading ================= */
const Paper = {
  get(){ return LS.get('paper', {cash:100000, pos:{}, log:[]}); },
  save(a){ LS.set('paper', a); },
  order(side, sym, qty, type, limit, lastPx){
    if(!qty||qty<=0) return {ok:false, err:'수량을 입력하세요'};
    const px = (type==='limit' && limit) ? limit : lastPx;
    if(px==null) return {ok:false, err:'현재가 없음 — 체결 불가 (데이터 없음)'};
    const a=this.get(); const cost=px*qty;
    if(side==='buy'){ if(cost>a.cash) return {ok:false,err:'현금 부족'}; a.cash-=cost; const p=a.pos[sym]||{qty:0,avgCost:0}; p.avgCost=(p.avgCost*p.qty+cost)/(p.qty+qty); p.qty+=qty; a.pos[sym]=p; }
    else { const p=a.pos[sym]; if(!p||p.qty<qty) return {ok:false,err:'보유 수량 부족'}; p.qty-=qty; a.cash+=cost; if(p.qty<=0)delete a.pos[sym]; }
    a.log.push({t:Date.now(), side, sym, qty, fill:px, type}); this.save(a);
    return {ok:true, fill:px, cash:a.cash};
  },
};

/* ================= AI ================= */
const AI = {
  async marketSummary(){
    const ix=(CFG.INDICES||[]).slice(0,6).map(i=>({l:i.label,q:state.quotes[i.sym]})).filter(x=>x.q&&x.q.changePct!=null);
    if(!ix.length) return '시세 로딩 후 요약이 생성됩니다. (실데이터 필요)';
    const up=ix.filter(x=>x.q.changePct>0).length, dn=ix.length-up;
    const tone = up>dn?'위험 선호(Risk-on) 우위':(dn>up?'위험 회피(Risk-off) 우위':'혼조');
    const lines = ix.map(x=>`• ${x.l}: ${pct(x.q.changePct)}`);
    const ctx = `시장 톤: ${tone}\n${lines.join('\n')}`;
    if(state.settings.geminiKey){ const r=await this.gemini(`다음 지수 데이터를 바탕으로 한국어 3줄 시장 요약. 과장/추측 금지, 데이터 기반만:\n${ctx}`); if(r.ok) return r.text+'\n— Gemini'; }
    return `오늘 시장은 ${tone}.\n${lines.join('\n')}\n(로컬 규칙기반 · 지연 데이터)`;
  },
  async ask(q){
    const sym=state.symbol; const qd=state.quotes[sym]||{}; const h=Portfolio.get();
    let ctx=`현재 선택 종목: ${sym} ${qd.price!=null?nf(qd.price,2)+' ('+pct(qd.changePct)+')':'(시세 없음)'}\n`;
    if(h.length){ let tv=0; h.forEach(p=>{const x=state.quotes[p.symbol];if(x&&x.price!=null)tv+=x.price*p.qty;}); ctx+=`보유 종목 ${h.length}개, 평가금액 약 ${nf0(tv)}\n`; }
    if(state.settings.geminiKey){ const r=await this.gemini(`${ctx}\n사용자 질문: ${q}\n\n위 데이터 범위에서만 한국어로 답하라. 모르는 수치는 추측하지 말고 "데이터 없음"이라 답하라.`); if(r.ok) return {text:r.text, src:'Gemini'}; return {text:'Gemini 호출 실패: '+r.err+'\n\n'+this.rule(q,sym,qd,h), src:'로컬 폴백'}; }
    return {text:this.rule(q,sym,qd,h), src:'로컬 규칙기반'};
  },
  rule(q,sym,qd,h){
    const out=[];
    if(/포트폴리오|보유|내 /.test(q)){ if(!h.length)out.push('보유 종목이 없습니다. 포트폴리오 탭에서 추가하세요.'); else { out.push(`보유 ${h.length}종목.`); h.slice(0,8).forEach(p=>{const x=state.quotes[p.symbol]||{}; const pl=x.price!=null?((x.price-p.avgCost)/p.avgCost*100):null; out.push(`• ${p.symbol}: ${pl!=null?pct(pl):'시세 없음'}`);}); } }
    else { out.push(`${sym} 현재 ${qd.price!=null?nf(qd.price,2)+' ('+pct(qd.changePct)+')':'시세 데이터 없음'}.`); if(qd.changePct!=null)out.push(qd.changePct>0?'단기 상승 흐름.':'단기 약세 흐름.'); out.push('차트 탭에서 RSI·MACD로 추세를 확인하세요.'); }
    out.push('\n※ Gemini 키를 설정하면 더 정교한 분석을 제공합니다. (설정)');
    return out.join('\n');
  },
  async gemini(prompt){
    try{
      const key=state.settings.geminiKey;
      const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`;
      const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
      if(!r.ok) return {ok:false,err:'HTTP '+r.status};
      const j=await r.json(); const t=j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts&&j.candidates[0].content.parts[0]&&j.candidates[0].content.parts[0].text;
      return t?{ok:true,text:t.trim()}:{ok:false,err:'빈 응답'};
    }catch(e){ return {ok:false, err:String(e.message||e)}; }
  },
};

/* ================= Layout / Workspace ================= */
const TABS = [
  ['markets','시장', ['indices','watchlist','chart','movers','news']],
  ['monitor','모니터', ['watchlist','quote','news','movers']],
  ['chart','차트', ['watchlist','chart','quote']],
  ['news','뉴스', ['watchlist','news','aisummary']],
  ['portfolio','포트폴리오', ['holdings','alloc','positions']],
  ['options','옵션', ['watchlist','options','quote']],
  ['orders','주문', ['watchlist','ticket','positions','blotter']],
  ['ai','AI', ['watchlist','aichat','aisummary']],
];
const TAB_LAYOUT = {
  markets:[['indices','watchlist'],['chart'],['movers','news']],
  monitor:[['watchlist'],['quote','news'],['movers']],
  chart:[['watchlist'],['chart'],['quote']],
  news:[['watchlist'],['news'],['aisummary']],
  portfolio:[['holdings'],['alloc'],['positions']],
  options:[['watchlist'],['options'],['quote']],
  orders:[['watchlist'],['ticket'],['positions','blotter']],
  ai:[['watchlist'],['aichat'],['aisummary']],
};
let curTab=null; let activeRefreshers=[];

function getLayout(tab){ return LS.get('layout.'+tab, null); }
function saveLayout(tab, lay){ LS.set('layout.'+tab, lay); }

function buildWorkspace(tab){
  // cleanup
  activeRefreshers=[]; const root=$('#ws'); root.innerHTML='';
  const def = TAB_LAYOUT[tab];
  const saved = getLayout(tab) || { cols: def.map((_,i)=>[34,42,24][i]||33), panels: {} , order:def };
  const order = (saved.order && saved.order.length===def.length) ? saved.order : def;
  const widths = saved.cols || def.map(()=>33);
  const cols=[];
  order.forEach((panelIds, ci)=>{
    if(ci>0){ const sp=el('div',{class:'splitter'}); sp.dataset.ci=ci; root.appendChild(sp); attachSplitter(sp, tab); }
    const col=el('div',{class:'col'}); col.style.flex=`1 1 ${widths[ci]||33}%`; col.dataset.ci=ci;
    const cbody=el('div',{class:'col-body'}); col.appendChild(cbody); root.appendChild(col); cols.push(col);
    panelIds.forEach(pid=>{ const node=makePanel(pid, tab, saved.panels[pid]); cbody.appendChild(node); });
    attachColDrop(cbody, tab);
  });
}

function makePanel(pid, tab, pstate){
  const factory=Panels[pid]; if(!factory) return el('div');
  const inst=factory(); const def=inst.def||{h:240};
  const panel=el('div',{class:'panel'}); panel.dataset.pid=pid;
  panel.style.flexBasis=((pstate&&pstate.h)||def.h)+'px';
  if(pstate&&pstate.collapsed) panel.classList.add('collapsed');
  const head=el('div',{class:'phead'});
  head.innerHTML=`<span class="pt">${inst.title}</span><span class="sp"></span>`;
  const headExtra=el('span',{class:'row'}); head.appendChild(headExtra);
  const colBtn=el('button',{class:'pbtn',title:'접기'}, '▾'); const body=el('div',{class:'pbody'}); const resize=el('div',{class:'presize'});
  head.appendChild(colBtn);
  panel.appendChild(head); panel.appendChild(body); panel.appendChild(resize);
  // mount content
  let api={}; try{ api=inst.mount(body, headExtra)||{}; }catch(e){ body.innerHTML='<div class="danger">패널 오류: '+e.message+'</div>'; console.error(e); }
  if(api.refresh) activeRefreshers.push(api.refresh);
  colBtn.onclick=()=>{ panel.classList.toggle('collapsed'); persistPanels(tab); };
  attachDrag(panel, head, tab);
  attachResize(panel, resize, tab);
  return panel;
}

function persistPanels(tab){
  const root=$('#ws'); const lay=getLayout(tab)||{}; lay.cols=[]; lay.order=[]; lay.panels=lay.panels||{};
  $$('.col',root).forEach(col=>{ lay.cols.push(parseFloat(col.style.flexBasis)||33); const ids=[]; $$('.panel',col).forEach(p=>{ ids.push(p.dataset.pid); lay.panels[p.dataset.pid]={h:parseFloat(p.style.flexBasis)||240, collapsed:p.classList.contains('collapsed')}; }); lay.order.push(ids); });
  saveLayout(tab, lay);
}

/* drag panels between columns */
let dragPanel=null;
function attachDrag(panel, head, tab){
  head.addEventListener('mousedown',e=>{ if(e.target.closest('.pbtn'))return; panel.draggable=true; });
  head.addEventListener('mouseup',()=>{ panel.draggable=false; });
  panel.addEventListener('dragstart',e=>{ if(e.target.closest('.pbtn')){e.preventDefault();return;} dragPanel=panel; panel.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
  panel.addEventListener('dragend',()=>{ panel.classList.remove('dragging'); panel.draggable=false; dragPanel=null; $$('.dropbefore').forEach(p=>p.classList.remove('dropbefore')); persistPanels(tab); });
}
function attachColDrop(cbody, tab){
  cbody.addEventListener('dragover',e=>{ if(!dragPanel)return; e.preventDefault(); const after=getDragAfter(cbody,e.clientY); $$('.dropbefore',cbody).forEach(p=>p.classList.remove('dropbefore')); if(after){after.classList.add('dropbefore'); cbody.insertBefore(dragPanel, after);} else { cbody.appendChild(dragPanel);} });
}
function getDragAfter(cbody, y){ const els=$$('.panel:not(.dragging)',cbody); for(const c of els){ const r=c.getBoundingClientRect(); if(y < r.top + r.height/2) return c; } return null; }

/* vertical resize panel */
function attachResize(panel, handle, tab){
  handle.addEventListener('mousedown',e=>{ e.preventDefault(); const sy=e.clientY; const sh=panel.getBoundingClientRect().height; const mv=ev=>{ panel.style.flexBasis=Math.max(70, sh+(ev.clientY-sy))+'px'; }; const up=()=>{ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); persistPanels(tab); }; document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up); });
}
/* column splitter */
function attachSplitter(sp, tab){
  sp.addEventListener('mousedown',e=>{ e.preventDefault(); sp.classList.add('drag'); const prev=sp.previousElementSibling, next=sp.nextElementSibling; const sx=e.clientX; const pw=prev.getBoundingClientRect().width, nw=next.getBoundingClientRect().width; const total=pw+nw;
    const mv=ev=>{ let np=pw+(ev.clientX-sx); np=Math.max(120,Math.min(total-120,np)); const pct=np/total; prev.style.flex=`1 1 ${(pct*100).toFixed(1)}%`; next.style.flex=`1 1 ${((1-pct)*100).toFixed(1)}%`; };
    const up=()=>{ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); sp.classList.remove('drag'); persistPanels(tab); };
    document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up); });
}

/* ================= Tab routing ================= */
function switchTab(tab){
  curTab=tab; $$('.tab').forEach(t=>t.classList.toggle('on', t.dataset.tab===tab)); $$('.gmenu button').forEach(b=>{});
  buildWorkspace(tab);
  $('#ws').classList.add('on');
  // 데이터 우선 로딩
  runRefreshers();
}
function runRefreshers(){ activeRefreshers.forEach(fn=>{try{fn();}catch(e){}}); }

/* ================= Command bar ================= */
function runCommand(raw){
  const s=raw.trim(); if(!s)return; const parts=s.split(/\s+/); const c=parts[0].toLowerCase();
  if(c==='go'&&parts[1]){ const t=TABS.find(t=>t[0]===parts[1].toLowerCase()||t[1]===parts[1]); if(t)switchTab(t[0]); return; }
  if(c==='add'&&parts[1]){ const u=parts[1].toUpperCase(); if(!state.watchlist.includes(u)){state.watchlist.push(u);saveWatch();refreshQuotes([u]);emit('quotes');} return; }
  if((c==='buy'||c==='sell')&&parts[1]&&parts[2]){ const sym=parts[1].toUpperCase(); const qty=+parts[2]; refreshQuotes([sym]).then(()=>{ const r=Paper.order(c,sym,qty,'market',null,(state.quotes[sym]||{}).price); emit('paper'); alert(r.ok?`모의 ${c} 체결 ${qty} @ ${nf(r.fill,2)}`:r.err); }); return; }
  if(c==='help'){ openHelp(); return; }
  // default: treat as symbol → chart
  setSymbol(parts[0]); switchTab('chart'); refreshQuotes([state.symbol]);
}

/* ================= Settings / Help modals ================= */
function openSettings(){
  const m=$('#modal'); const s=state.settings;
  m.querySelector('.modal').innerHTML=`
    <h3>설정 <span class="x">✕</span></h3>
    <div class="fld"><label>Gemini API Key (선택 · 브라우저 localStorage에만 저장)</label><input id="set_key" type="password" value="${s.geminiKey||''}" placeholder="AIza..."></div>
    <div class="note" style="margin:-2px 0 10px">키는 이 브라우저에만 저장됩니다. 공용 PC에서는 입력하지 마세요. 자세한 보안 주의는 README.</div>
    <div class="fld"><label>기본 종목</label><input id="set_sym" value="${state.symbol}"></div>
    <hr style="border:0;border-top:1px solid var(--line);margin:12px 0">
    <div class="danger" style="margin-bottom:8px">⚠ 실거래(Live)는 실제 자금이 사용됩니다. 브로커 연동(README) 후에만 켜세요.</div>
    <div class="fld"><label>거래 모드</label><select id="set_live"><option value="0" ${!s.liveEnabled?'selected':''}>PAPER · 모의 (기본/권장)</option><option value="1" ${s.liveEnabled?'selected':''}>LIVE · 실거래</option></select></div>
    <div class="fld"><label>브로커 (실거래 연동 — 인터페이스만, README 참조)</label><select id="set_broker"><option value="">없음</option><option ${s.broker==='alpaca'?'selected':''}>alpaca</option><option ${s.broker==='ibkr'?'selected':''}>ibkr</option><option ${s.broker==='kis'?'selected':''}>kis</option></select></div>
    <div class="row" style="margin-top:14px;justify-content:space-between">
      <button class="btn sm" id="set_reset">레이아웃 초기화</button>
      <div class="row"><button class="btn sm" id="set_clear">내 데이터 삭제</button><button class="btn pri" id="set_save">저장</button></div>
    </div>`;
  m.classList.add('on');
  const close=()=>m.classList.remove('on');
  m.querySelector('.x').onclick=close; m.onclick=e=>{if(e.target===m)close();};
  $('#set_save',m).onclick=()=>{ s.geminiKey=$('#set_key',m).value.trim(); s.liveEnabled=$('#set_live',m).value==='1'; s.broker=$('#set_broker',m).value; saveSettings(); setSymbol($('#set_sym',m).value); emit('settings'); updateModeBadge(); close(); switchTab(curTab); };
  $('#set_reset',m).onclick=()=>{ TABS.forEach(t=>LS.del('layout.'+t[0])); close(); switchTab(curTab); };
  $('#set_clear',m).onclick=()=>{ if(confirm('관심종목·포트폴리오·모의계좌·설정을 모두 삭제할까요?')){ ['watchlist','portfolio','paper','settings','chart'].forEach(k=>LS.del(k)); location.reload(); } };
}
function openHelp(){
  const m=$('#modal');
  m.querySelector('.modal').innerHTML=`<h3>명령창 사용법 <span class="x">✕</span></h3>
    <div class="note" style="line-height:1.9">
    <b>AAPL</b> — 해당 종목 차트로 이동<br>
    <b>go portfolio</b> — 탭 이동 (markets/chart/news/portfolio/options/orders/ai)<br>
    <b>add TSLA</b> — 관심종목 추가<br>
    <b>buy NVDA 10</b> / <b>sell NVDA 5</b> — 모의 주문<br>
    <b>help</b> — 이 도움말</div>
    <div class="warn" style="margin-top:10px">데이터 정책: 실데이터만 표시. 없으면 "지연/데이터 없음/API 필요"로 명확히 구분하며 가짜 숫자를 만들지 않습니다.</div>`;
  m.classList.add('on'); m.querySelector('.x').onclick=()=>m.classList.remove('on'); m.onclick=e=>{if(e.target===m)m.classList.remove('on');};
}
function updateModeBadge(){ const b=$('#modeBadge'); const live=state.settings.liveEnabled; b.className='modebadge '+(live?'live':'paper'); b.textContent=live?'● LIVE 실거래':'● PAPER 모의'; }

/* ================= Index strip ================= */
function buildStrip(){
  const strip=$('#strip'); strip.innerHTML=(CFG.INDICES||[]).map(ix=>`<div class="tick" data-sym="${ix.sym}"><span class="nm">${ix.label}</span><span class="px na">–</span><span class="ch"></span></div>`).join('');
  $$('.tick',strip).forEach(t=>t.onclick=()=>{ setSymbol(t.dataset.sym); switchTab('chart'); });
  on('quotes',()=>{ $$('.tick',strip).forEach(t=>{ const q=state.quotes[t.dataset.sym]||{}; const px=t.querySelector('.px'), ch=t.querySelector('.ch'); if(q.price!=null){ px.textContent=nf(q.price,q.price>1000?0:2); px.className='px'; ch.className='ch '+sign(q.changePct); ch.textContent=q.changePct!=null?pct(q.changePct):''; } else if(q.dataState){ px.className='px na'; px.textContent='–'; ch.innerHTML=dsBadge(q.dataState); } }); });
}

/* ================= Clock ================= */
function clock(){ const c=$('#clock'); const f=()=>{ c.textContent=new Date().toLocaleTimeString('en-US',{timeZone:'America/New_York',hour12:false})+' NY'; }; f(); setInterval(f,1000); }

/* ================= Boot ================= */
function boot(){
  // tabs
  const tabsEl=$('#tabs');
  TABS.forEach(([id,label])=>{ const t=el('button',{class:'tab',dataset:{tab:id}}, label); t.onclick=()=>switchTab(id); tabsEl.insertBefore(t, $('#tabs .spacer')); });
  // global menu mapping
  $$('.gmenu button').forEach(b=> b.onclick=()=>{ const map={Markets:'markets',Portfolio:'portfolio',Research:'news',Tools:'chart',AI:'ai'}; switchTab(map[b.dataset.m]||'markets'); });
  $('#btnAI').onclick=()=>switchTab('ai');
  $('#btnSettings').onclick=openSettings;
  $('#cmd').addEventListener('keydown',e=>{ if(e.key==='Enter'){ runCommand(e.target.value); e.target.value=''; } });
  buildStrip(); clock(); updateModeBadge();
  // 데이터 소스 상태
  Data.resolveBase().then(base=>{ const c=$('#conn'); if(base){ c.innerHTML=`<span class="dot"></span>${base.startsWith('/api')?'Local proxy':'Supabase'} · Yahoo 15m`; } else { c.innerHTML=`<span class="dot off"></span>데이터 소스 없음 (API 필요)`; } });
  // 빠른 시장 데이터 먼저
  switchTab('markets');
  refreshQuotes((CFG.INDICES||[]).map(i=>i.sym));
  refreshQuotes(state.watchlist);
  refreshQuotes([state.symbol]);
  // 폴링
  setInterval(()=>{ refreshQuotes((CFG.INDICES||[]).map(i=>i.sym)); if(curTab) runRefreshers(); }, CFG.POLL_MS||60000);
  window.addEventListener('resize',()=>{ /* charts self-observe */ });
}
document.addEventListener('DOMContentLoaded', boot);
window.__bft={state,Data,Paper,Portfolio,switchTab};
})();
