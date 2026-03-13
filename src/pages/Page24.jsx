import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { patchUser } from '../redux/gameSlice'
import pageBg from '../assets/page1bg.webp'

/* ═══════════════════════════════════════
   CONFIG  — chips only, no FA, no FS
═══════════════════════════════════════ */
const SYMS = [
  { e:'🍒', m:2,  w:24 },
  { e:'🍋', m:3,  w:20 },
  { e:'🍊', m:4,  w:18 },
  { e:'🍇', m:5,  w:14 },
  { e:'⭐', m:8,  w:10 },
  { e:'🔔', m:10, w:7  },
  { e:'💎', m:15, w:5  },
  { e:'7️⃣', m:30, w:2  },
]
const W_TOTAL = SYMS.reduce((s,x)=>s+x.w,0)
const BETS    = [10, 25, 50, 100, 250, 500]
const CELL    = 62
const LS_KEY  = 'mell_chips_v3'

function pick() {
  let r = Math.random() * W_TOTAL
  for (const s of SYMS) { r -= s.w; if (r <= 0) return s }
  return SYMS[0]
}
function fmt(n) {
  if (!n && n !== 0) return '0'
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`
  return String(Math.floor(n))
}
function lsGet()  { try { const v=localStorage.getItem(LS_KEY); return v!==null?Number(v):null } catch { return null } }
function lsSet(n) { try { localStorage.setItem(LS_KEY,String(Math.max(0,Math.floor(n)))) } catch {} }

/* ═══════════════════════════════════════
   REEL
═══════════════════════════════════════ */
const Reel = React.memo(({ spinning, target, delay, onDone, highlight }) => {
  const stripRef = useRef(Array.from({length:20},()=>SYMS[Math.floor(Math.random()*SYMS.length)]))
  const [top,  setTop]  = useState(0)
  const rafRef  = useRef(null)
  const t0Ref   = useRef(null)
  const DUR     = 1300 + delay

  useEffect(() => {
    if (!spinning) return
    t0Ref.current = null
    const strip = Array.from({length:36},(_, i)=> i===34 ? target : SYMS[Math.floor(Math.random()*SYMS.length)])
    stripRef.current = strip
    const total = (strip.length - 3) * CELL
    const tick  = ts => {
      if (!t0Ref.current) t0Ref.current = ts
      const p = Math.min((ts - t0Ref.current) / DUR, 1)
      const e = 1 - Math.pow(1-p, 4)
      setTop(e * total)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else { setTop(total); onDone?.() }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [spinning, target])

  const row  = Math.floor(top / CELL)
  const frac = (top % CELL) / CELL

  return (
    <div style={{
      width:'100%', height: CELL*3, overflow:'hidden',
      borderRadius:10, position:'relative',
      background:'linear-gradient(180deg,#0d0a04,#1a1408,#0d0a04)',
      border: `1.5px solid ${highlight ? 'rgba(255,215,40,0.7)' : 'rgba(255,255,255,0.07)'}`,
      boxShadow: highlight ? '0 0 18px rgba(255,215,40,0.35), inset 0 0 14px rgba(255,215,40,0.08)' : 'none',
      transition:'border-color .3s, box-shadow .3s',
    }}>
      <div style={{
        position:'absolute', top:CELL, left:0, right:0, height:CELL,
        zIndex:2, pointerEvents:'none',
        background:'rgba(255,215,40,0.04)',
        borderTop:'1px solid rgba(255,215,40,0.2)',
        borderBottom:'1px solid rgba(255,215,40,0.2)',
      }}/>
      <div style={{ position:'absolute', top: -(frac*CELL)-(row*CELL), willChange:'transform' }}>
        {stripRef.current.map((s,i)=>(
          <div key={i} style={{
            height:CELL, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:28, lineHeight:1, userSelect:'none',
          }}>{s.e}</div>
        ))}
      </div>
      <div style={{
        position:'absolute', inset:0, zIndex:3, pointerEvents:'none',
        background:'linear-gradient(180deg,rgba(0,0,0,.7) 0%,transparent 26%,transparent 74%,rgba(0,0,0,.7) 100%)',
      }}/>
    </div>
  )
})

/* ═══════════════════════════════════════
   PAYTABLE BOTTOM SHEET
═══════════════════════════════════════ */
const PaySheet = ({ onClose }) => (
  <div onClick={onClose} style={{
    position:'fixed', inset:0, zIndex:90,
    background:'rgba(0,0,0,.75)', backdropFilter:'blur(3px)',
    display:'flex', alignItems:'flex-end', justifyContent:'center',
  }}>
    <div onClick={e=>e.stopPropagation()} style={{
      width:'100%', maxWidth:430,
      background:'linear-gradient(160deg,#1e1508,#0c0800)',
      borderRadius:'18px 18px 0 0',
      border:'1.5px solid rgba(200,140,20,.3)', borderBottom:'none',
      padding:'14px 14px 30px',
      boxShadow:'0 -8px 40px rgba(0,0,0,.8)',
    }}>
      <div style={{ width:36, height:4, borderRadius:2, background:'rgba(255,255,255,.15)', margin:'0 auto 12px' }}/>
      <p style={{ color:'#f0c020', fontWeight:900, fontSize:14, textAlign:'center', margin:'0 0 10px', letterSpacing:'.12em' }}>
        ТАБЛИЦА ВЫПЛАТ
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px 8px' }}>
        {SYMS.map(s=>(
          <div key={s.e} style={{
            display:'flex', alignItems:'center', gap:6,
            background:'rgba(255,255,255,.04)', borderRadius:9,
            border:'1px solid rgba(255,255,255,.07)', padding:'6px 10px',
          }}>
            <span style={{ fontSize:16 }}>{s.e}{s.e}{s.e}</span>
            <span style={{ color:'#f0c020', fontWeight:900, fontSize:13 }}>×{s.m}</span>
          </div>
        ))}
      </div>
      <p style={{ color:'rgba(255,255,255,.3)', fontSize:9, textAlign:'center', margin:'8px 0 0' }}>
        2 одинаковых → возврат ставки
      </p>
    </div>
  </div>
)

/* ═══════════════════════════════════════
   PAGE 24
═══════════════════════════════════════ */
export default function Page24() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user     = useSelector(s => s.game.user)

  const [betIdx,   setBetIdx]   = useState(1)
  const [spinning, setSpinning] = useState(false)
  const [targets,  setTargets]  = useState([SYMS[4], SYMS[4], SYMS[4]])
  const [doneN,    setDoneN]    = useState(0)
  const [settled,  setSettled]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [flash,    setFlash]    = useState(false)
  const [showPay,  setShowPay]  = useState(false)
  const [history,  setHistory]  = useState([])

  const bet     = BETS[betIdx]
  const balance = user?.chips ?? 0
  const canSpin = !spinning && balance >= bet

  useEffect(() => {
    if (!user) return
    const srv   = user.chips ?? 0
    const local = lsGet()
    if (local === null) { lsSet(srv); return }
    const synced = Math.min(srv, local)
    lsSet(synced)
    if (synced !== srv) dispatch(patchUser({ chips: synced }))
  }, [user?.chips])

  const setChips = useCallback((v) => {
    const n = Math.max(0, Math.floor(v))
    dispatch(patchUser({ chips: n }))
    lsSet(n)
  }, [dispatch])

  const handleReelDone = useCallback(() => setDoneN(p => p+1), [])

  useEffect(() => {
    if (doneN < 3) return
    setDoneN(0)
    setSettled(true)

    const [a,b,c] = targets
    let win = 0
    const jackpot = a.e===b.e && b.e===c.e
    if (jackpot)                                   win = bet * a.m
    else if (a.e===b.e || b.e===c.e || a.e===c.e) win = bet

    if (win > 0) {
      setChips((user?.chips ?? 0) + win)
      setResult({ type: jackpot?'jackpot':'small', amt: win })
      setFlash(true)
      setHistory(h => [...h.slice(-11), jackpot?'j':'s'])
      setTimeout(() => setFlash(false), 2200)
    } else {
      setResult({ type:'lose', amt: 0 })
      setHistory(h => [...h.slice(-11), 'l'])
    }
    setTimeout(() => setSpinning(false), 60)
  }, [doneN])

  const handleSpin = () => {
    if (!canSpin) return
    setResult(null); setFlash(false); setSettled(false)
    setChips((user?.chips ?? 0) - bet)
    const t = [pick(), pick(), pick()]
    setTargets(t)
    setDoneN(0)
    setSpinning(true)
  }

  const [a,b,c] = targets
  const isJackpot = settled && a.e===b.e && b.e===c.e
  const isSmall   = settled && !isJackpot && (a.e===b.e||b.e===c.e||a.e===c.e)

  return (
    <div style={{
      maxWidth:430, margin:'0 auto',
      height:'100dvh',
      display:'flex', flexDirection:'column',
      overflow:'hidden',
      backgroundImage:`url(${pageBg})`,
      backgroundSize:'cover', backgroundPosition:'center',
      fontFamily:"'Nunito',sans-serif",
    }}>
      <style>{`
        @keyframes glow  { 0%,100%{box-shadow:0 0 18px rgba(200,130,0,.2),0 0 0 1.5px rgba(200,130,0,.25)} 50%{box-shadow:0 0 38px rgba(200,130,0,.5),0 0 0 1.5px rgba(200,130,0,.55)} }
        @keyframes pop   { 0%{transform:scale(.5) rotate(-6deg);opacity:0} 60%{transform:scale(1.1) rotate(1deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes blink { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes btnG  { 0%,100%{box-shadow:0 5px 0 #7a4e00,0 0 14px rgba(240,168,0,.3)} 50%{box-shadow:0 5px 0 #7a4e00,0 0 28px rgba(240,168,0,.65)} }
        .sbtn:active { transform:translateY(4px)!important; box-shadow:0 1px 0 #4a2400!important; }
      `}</style>

      {/* HEADER */}
      <div style={{
        flexShrink:0, height:52,
        background:'rgba(0,0,0,.93)',
        borderBottom:'1px solid rgba(200,140,0,.2)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 12px',
      }}>
        <button onClick={()=>navigate(-1)} style={{
          background:'linear-gradient(180deg,#3a2a08,#251a04)', border:'2px solid #7a5a10',
          borderRadius:8, padding:'4px 12px',
          color:'#f0c060', fontWeight:800, fontSize:12, cursor:'pointer',
          boxShadow:'0 3px 0 #1a1000',
        }}>← НАЗАД</button>

        <div style={{ textAlign:'center', lineHeight:1 }}>
          <div style={{ fontSize:7, color:'rgba(255,200,40,.45)', letterSpacing:'.3em', textTransform:'uppercase', animation:'blink 2.5s ease-in-out infinite' }}>✦ DRUN FAMILY ✦</div>
          <div style={{ fontSize:20, fontWeight:900, color:'#f0c020', letterSpacing:'.15em',
            textShadow:'0 0 20px rgba(240,192,32,.8)', WebkitTextStroke:'.4px rgba(180,90,0,.5)' }}>СЛОТЫ</div>
        </div>

        <button onClick={()=>setShowPay(true)} style={{
          background:'linear-gradient(180deg,#ffe033,#f0a800)', border:'2px solid #b58030',
          borderRadius:8, padding:'4px 9px',
          color:'#3a2000', fontWeight:900, fontSize:10, cursor:'pointer', letterSpacing:'.05em',
          boxShadow:'0 3px 0 #7a4e00,inset 0 1px 0 rgba(255,255,255,.3)',
        }}>ВЫПЛАТЫ</button>
      </div>

      {/* BALANCE + HISTORY */}
      <div style={{
        flexShrink:0, height:46,
        background:'rgba(0,0,0,.55)',
        borderBottom:'1px solid rgba(255,255,255,.05)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 14px', gap:10,
      }}>
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center',
          background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.09)',
          borderRadius:9, padding:'2px 14px', minWidth:72,
        }}>
          <span style={{ fontSize:7, color:'rgba(130,210,255,.55)', fontWeight:700, letterSpacing:'.12em' }}>CHIPS</span>
          <span style={{ fontSize:15, fontWeight:900, color:'#82d2ff', lineHeight:1.15 }}>{fmt(balance)}</span>
        </div>

        <div style={{ display:'flex', gap:3, alignItems:'center' }}>
          {Array.from({length:12}).map((_,i)=>{
            const h = history[history.length-12+i]
            const bg = !h ? 'rgba(255,255,255,.07)' : h==='j' ? '#f0c020' : h==='s' ? '#4ade80' : 'rgba(255,255,255,.13)'
            const gw = h==='j' ? '0 0 7px rgba(240,192,32,.7)' : 'none'
            return <div key={i} style={{ width:16, height:16, borderRadius:'50%', background:bg, boxShadow:gw, transition:'all .3s' }}/>
          })}
        </div>
      </div>

      {/* MACHINE */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'8px 14px 10px', gap:8,
        minHeight:0,
      }}>

        <div style={{
          width:'100%', maxWidth:350,
          background:'linear-gradient(155deg,#1e1500,#120e00,#080500)',
          borderRadius:18, padding:'12px 10px 10px',
          animation:'glow 3s ease-in-out infinite',
          position:'relative', flexShrink:0,
        }}>
          <div style={{ display:'flex', justifyContent:'center', gap:5, marginBottom:8 }}>
            {['#f0c020','#ff4444','#4ade80','#f0c020','#4ade80','#ff4444','#f0c020'].map((c,i)=>(
              <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:c,
                boxShadow:`0 0 5px ${c}`, animation:`blink ${1.4+i*.2}s ease-in-out infinite`, animationDelay:`${i*.15}s` }}/>
            ))}
          </div>

          <div style={{ height:2, marginBottom:9, borderRadius:1,
            background:'linear-gradient(90deg,transparent,#d4a020,#f0c020,#d4a020,transparent)', opacity:.6 }}/>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5, position:'relative',
            background:'rgba(0,0,0,.5)', borderRadius:12, padding:6,
            border:'1px solid rgba(200,140,0,.15)' }}>
            {[0,1,2].map(i=>(
              <Reel key={i}
                spinning={spinning} target={targets[i]}
                delay={i*200} onDone={handleReelDone}
                highlight={isJackpot || (isSmall && settled)}
              />
            ))}

            {flash && result?.type==='jackpot' && (
              <div style={{ position:'absolute', inset:0, zIndex:10, pointerEvents:'none',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ background:'linear-gradient(135deg,#f0c020,#ff8c00)',
                  borderRadius:12, padding:'9px 20px',
                  border:'2px solid rgba(255,255,255,.55)',
                  boxShadow:'0 0 50px rgba(240,192,32,.8)',
                  animation:'pop .4s cubic-bezier(.34,1.56,.64,1)', textAlign:'center' }}>
                  <div style={{ color:'#000', fontWeight:900, fontSize:17 }}>ДЖЕКПОТ!</div>
                  <div style={{ color:'#000', fontWeight:900, fontSize:13 }}>+{fmt(result.amt)} CHIPS</div>
                </div>
              </div>
            )}
            {flash && result?.type==='small' && (
              <div style={{ position:'absolute', inset:0, zIndex:10, pointerEvents:'none',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ background:'rgba(74,222,128,.93)', borderRadius:11, padding:'7px 18px',
                  boxShadow:'0 0 20px rgba(74,222,128,.6)', animation:'pop .3s ease-out' }}>
                  <span style={{ color:'#000', fontWeight:900, fontSize:15 }}>+{fmt(result.amt)} CHIPS</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ height:2, marginTop:9, marginBottom:4, borderRadius:1,
            background:'linear-gradient(90deg,transparent,#d4a020,#f0c020,#d4a020,transparent)', opacity:.5 }}/>

          <div style={{ height:14, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {!spinning && result && !flash && (
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:'.06em',
                color: result.type==='lose' ? 'rgba(255,255,255,.22)' : '#4ade80' }}>
                {result.type==='lose' ? 'Не повезло' : `Выигрыш: +${fmt(result.amt)} CHIPS`}
              </span>
            )}
            {spinning && <span style={{ fontSize:9, color:'rgba(240,192,32,.45)', letterSpacing:'.18em', animation:'blink .6s ease-in-out infinite' }}>● ● ●</span>}
          </div>
        </div>

        {/* BET SELECTOR — fixed: no duplicate border key */}
        <div style={{ width:'100%', maxWidth:350, flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
            <span style={{ fontSize:8, color:'rgba(255,255,255,.38)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>СТАВКА</span>
            <span style={{ fontSize:12, color:'#82d2ff', fontWeight:900 }}>{fmt(bet)} CHIPS</span>
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {BETS.map((b,i) => {
              const active = betIdx === i
              return (
                <button key={i} onClick={() => !spinning && setBetIdx(i)} style={{
                  flex:1, padding:'6px 2px', borderRadius:7,
                  cursor: spinning ? 'not-allowed' : 'pointer',
                  fontWeight:900, fontSize:9,
                  background: active
                    ? 'linear-gradient(180deg,#ffe033,#f0a800)'
                    : [
                        'linear-gradient(180deg,#1a4a8a,#0e2e60)',
                        'linear-gradient(180deg,#1a7a3a,#0e4a22)',
                        'linear-gradient(180deg,#7a1a6a,#4a0e40)',
                        'linear-gradient(180deg,#8a3a10,#5a2008)',
                        'linear-gradient(180deg,#1a6a6a,#0e3e3e)',
                        'linear-gradient(180deg,#6a1a1a,#3e0e0e)',
                      ][i],
                  color: active ? '#3a2000' : 'rgba(255,255,255,.75)',
                  // ── single border declaration (was duplicated before) ──
                  border: active ? '2px solid #b58030' : '1px solid rgba(255,255,255,.15)',
                  boxShadow: active
                    ? '0 3px 0 #7a4e00,inset 0 1px 0 rgba(255,255,255,.25)'
                    : '0 3px 0 rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.08)',
                  opacity: spinning ? .65 : 1,
                  transition:'all .15s',
                }}>
                  {fmt(b)}
                </button>
              )
            })}
          </div>
        </div>

        {/* SPIN BUTTON */}
        <button
          className="sbtn"
          onClick={handleSpin}
          disabled={!canSpin}
          style={{
            width:'100%', maxWidth:350, flexShrink:0,
            padding:'13px 0', borderRadius:13, border:'none',
            background: canSpin ? 'linear-gradient(180deg,#f0a800,#da9d01)' : 'rgba(255,255,255,.06)',
            color: canSpin ? '#000' : 'rgba(255,255,255,.2)',
            fontWeight:900, fontSize:17, letterSpacing:'.14em', textTransform:'uppercase',
            cursor: canSpin ? 'pointer' : 'not-allowed',
            animation: canSpin && !spinning ? 'btnG 2s ease-in-out infinite' : 'none',
            boxShadow: canSpin ? '0 5px 0 #7a4e00,inset 0 1px 0 rgba(255,255,255,.25)' : 'none',
            transition:'background .2s, color .2s',
            userSelect:'none',
          }}
        >
          {spinning ? '▶  ▶  ▶' : 'КРУТИТЬ'}
        </button>

        {!canSpin && !spinning && (
          <p style={{ margin:0, color:'#ff6060', fontSize:10, fontWeight:700, textAlign:'center' }}>
            Недостаточно CHIPS
          </p>
        )}

      </div>

      {showPay && <PaySheet onClose={() => setShowPay(false)} />}
    </div>
  )
}