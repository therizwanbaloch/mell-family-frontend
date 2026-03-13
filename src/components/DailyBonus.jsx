import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doClaimDaily, fetchState, clearActionError } from '../redux/gameSlice'
import faIcon from '../assets/page22Images/fa-icon.webp'

function formatFa(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(0)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(0)}K`
  return String(n)
}

const WEEK1 = [
  { day:1, x12_min:360,  line:'Х10 вся прибыль на\n15 минут' },
  { day:2, x12_min:480,  line:'2 Фа Бокса,\n500 Билетов' },
  { day:3, x12_min:600,  line:'Х15 вся прибыль на\n30 минут' },
  { day:4, x12_min:720,  line:'1 Пепе Бокс, 1000\nБилетов, 3 Фишки' },
  { day:5, x12_min:840,  line:'Х20 вся прибыль на\n45 минут' },
  { day:6, x12_min:960,  line:'2 Пепе Бокса,\n1500 Билетов' },
  { day:7, x12_min:1440, line:'Х25 вся прибыль на 90\nминут, 1 Шнейне Бокс,\n2000 Билетов, 30 Фишек' },
]
const WEEK2 = [
  { day:1, x12_min:10,  line:'Х10 прибыль\n10 минут' },
  { day:2, x12_min:10,  line:'Х10 прибыль\n10 минут' },
  { day:3, x12_min:15,  line:'Х12 прибыль\n15 минут' },
  { day:4, x12_min:20,  line:'Х15 прибыль\n20 минут' },
  { day:5, x12_min:30,  line:'Х20 прибыль\n30 минут' },
  { day:6, x12_min:45,  line:'Х20 45мин\n0.05$' },
  { day:7, x12_min:120, line:'Х25 120мин\n0.2 USDT\n1 Фа Бокс' },
]

const C = (s) => ({
  pill:       s==='today' ? 'linear-gradient(180deg,#5abe18,#318a08)'
            : s==='past'  ? 'linear-gradient(180deg,#666,#444)'
            :               'linear-gradient(180deg,#cc2020,#880000)',
  pillBorder: s==='today' ? '#2a6a08' : s==='past' ? '#555' : '#661010',
  card:       s==='today' ? 'linear-gradient(180deg,#3a7a10,#234d08)'
            : s==='past'  ? 'linear-gradient(180deg,#4a4a4a,#2e2e2e)'
            :               'linear-gradient(180deg,#3a2800,#221800)',
  cardBorder: s==='today' ? '#4aaa18' : s==='past' ? '#404040' : '#4a3000',
  amt:        s==='today' ? '#d4f090' : s==='past' ? '#bbb' : '#f0d060',
  subLabel:   s==='today' ? 'rgba(255,255,255,0.55)' : s==='past' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.4)',
  desc:       s==='today' ? '#c8f080' : s==='past' ? 'rgba(255,255,255,0.45)' : '#c8b060',
})

const DailyBonus = ({ onToast }) => {
  const dispatch = useDispatch()
  const user     = useSelector(s => s.game.user)
  const rates    = useSelector(s => s.game.rates)
  const claiming = useSelector(s => s.game.actionLoading)

  const hourly    = rates?.fa_per_hour     ?? 1000
  const dailyDay  = user?.daily_day        ?? 1
  const dailyWeek = user?.daily_week       ?? 0
  const dailyLast = user?.daily_last_claim ?? null
  const todayStr  = new Date().toISOString().slice(0, 10)
  const claimed   = dailyLast === todayStr
  const rewards   = dailyWeek === 0 ? WEEK1 : WEEK2
  const todayIdx  = Math.min((dailyDay - 1) % 7, 6)

  const getCardState = (i) => {
    if (i < todayIdx) return 'past'
    if (i === todayIdx && claimed) return 'past'
    if (i === todayIdx) return 'today'
    return 'future'
  }

  const handleClaim = async () => {
    if (claiming || claimed) return
    const result = await dispatch(doClaimDaily())
    if (doClaimDaily.fulfilled.match(result)) {
      await dispatch(fetchState())
      onToast?.({ message: 'Ежедневный бонус получен!', type: 'success' })
    } else {
      dispatch(clearActionError())
      onToast?.({ message: result.payload || 'Ошибка', type: 'error' })
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(180deg,#5c4400,#3c2c00)',
      borderRadius: 10,
      marginBottom: 6,
      flexShrink: 0,
      overflow: 'visible',
      paddingBottom: 10,
    }}>

      {/* ── Red header bar ── */}
      <div style={{
        background: 'linear-gradient(180deg,#cc1a1a,#8a0808)',
        textAlign: 'center',
        padding: '5px 0',
        borderRadius: '10px 10px 0 0',
      }}>
        <span style={{
          color: '#fff', fontWeight: 900,
          fontSize: 'clamp(11px,3.5vw,14px)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          ЕЖЕДНЕВНЫЙ БОНУС
        </span>
      </div>

      {/* ── Subtitle ── */}
      <p style={{
        color: '#fff', fontWeight: 700,
        fontSize: 'clamp(11px,3.2vw,13px)',
        textAlign: 'center',
        margin: '6px 0 10px',
        letterSpacing: '0.02em',
      }}>
        Заходи каждый день и получай награду
      </p>

      {/* ── Gold container wrapping all day cards ── */}
      <div style={{
        background: 'linear-gradient(180deg,#f0c020,#c89000)',
        borderRadius: 10,
        margin: '0 6px',
        padding: '12px 6px 10px',
        border: '2px solid #8a6000',
        boxShadow: '0 3px 0 #6a4000',
      }}>

        {/* Days 1–6 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px 5px',
          marginBottom: 10,
        }}>
          {rewards.slice(0, 6).map((r, i) => {
            const state    = getCardState(i)
            const c        = C(state)
            const isToday  = state === 'today'
            const isPast   = state === 'past'
            const faAmt    = formatFa(Math.round(hourly * (r.x12_min / 60)))
            const subLabel = `ПРИБЫЛЬ ЗА ${r.x12_min >= 60
              ? Math.round(r.x12_min / 60) + ' ЧАС' + (r.x12_min / 60 > 1 ? 'А' : '')
              : r.x12_min + ' МИН'}`

            return (
              <div
                key={r.day}
                style={{ position: 'relative', paddingTop: 9 }}
                onClick={isToday && !claiming ? handleClaim : undefined}
              >
                {/* Pill — small height */}
                <div style={{
                  position: 'absolute', top: 0,
                  left: '50%', transform: 'translateX(-50%)',
                  zIndex: 2, whiteSpace: 'nowrap',
                  background: c.pill,
                  border: `1px solid ${c.pillBorder}`,
                  borderRadius: 99,
                  padding: '0 7px',
                  lineHeight: '14px',
                  boxShadow: isToday ? '0 2px 6px rgba(90,190,24,0.5)' : 'none',
                }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 7, letterSpacing: '0.03em' }}>
                    {isToday ? 'ЗАБРАТЬ' : `ДЕНЬ ${r.day}`}
                  </span>
                </div>

                {/* Rectangle card */}
                <div style={{
                  background: c.card,
                  border: `2px solid ${c.cardBorder}`,
                  borderRadius: 8,
                  boxShadow: isToday
                    ? `0 0 0 1px ${c.cardBorder}55, 0 3px 10px rgba(0,0,0,0.6)`
                    : '0 2px 6px rgba(0,0,0,0.5)',
                  opacity: isPast ? 0.65 : 1,
                  cursor: isToday ? 'pointer' : 'default',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '8px 4px 6px',
                  gap: 2,
                  position: 'relative', overflow: 'hidden',
                  minHeight: 68,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ color: c.amt, fontWeight: 900, fontSize: 'clamp(13px,4vw,16px)', lineHeight: 1 }}>
                      {faAmt}
                    </span>
                    <img src={faIcon} alt="" style={{ width: 13, height: 13, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  </div>
                  <span style={{
                    color: c.subLabel, fontSize: 6, fontWeight: 700,
                    letterSpacing: '0.02em', textAlign: 'center',
                    textTransform: 'uppercase', lineHeight: 1.2,
                  }}>
                    {subLabel}
                  </span>
                  <p style={{
                    color: c.desc, fontSize: 6.5, fontWeight: 700,
                    textAlign: 'center', margin: 0, lineHeight: 1.3,
                    whiteSpace: 'pre-line',
                  }}>
                    {r.line}
                  </p>
                  {claiming && isToday && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 7,
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>...</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Day 7 — full width */}
        {(() => {
          const state   = getCardState(6)
          const c       = C(state)
          const isToday = state === 'today'
          const isPast  = state === 'past'
          const day7    = rewards[6]
          const day7Fa  = formatFa(Math.round(hourly * (day7.x12_min / 60)))

          return (
            <div
              style={{ position: 'relative', paddingTop: 9 }}
              onClick={isToday && !claiming ? handleClaim : undefined}
            >
              <div style={{
                position: 'absolute', top: 0,
                left: '50%', transform: 'translateX(-50%)',
                zIndex: 2, whiteSpace: 'nowrap',
                background: c.pill,
                border: `1px solid ${c.pillBorder}`,
                borderRadius: 99, padding: '0 14px',
                lineHeight: '14px',
                boxShadow: isToday ? '0 2px 6px rgba(90,190,24,0.5)' : 'none',
              }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 8, letterSpacing: '0.06em' }}>
                  {isToday ? 'ЗАБРАТЬ' : 'ДЕНЬ 7'}
                </span>
              </div>

              <div style={{
                background: c.card,
                border: `2px solid ${c.cardBorder}`,
                borderRadius: 8,
                boxShadow: isToday
                  ? `0 0 0 1px ${c.cardBorder}55, 0 4px 14px rgba(0,0,0,0.6)`
                  : '0 2px 8px rgba(0,0,0,0.5)',
                opacity: isPast ? 0.65 : 1,
                cursor: isToday ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center',
                gap: 10, padding: '12px 12px 10px',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', flexShrink: 0, minWidth: 58,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: c.amt, fontWeight: 900, fontSize: 'clamp(20px,6vw,26px)', lineHeight: 1 }}>
                      {day7Fa}
                    </span>
                    <img src={faIcon} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  </div>
                  <span style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 6, fontWeight: 700, letterSpacing: '0.04em',
                    marginTop: 2, textAlign: 'center', textTransform: 'uppercase',
                  }}>
                    ПРИБЫЛЬ ЗА 24 ЧАСА
                  </span>
                </div>
                <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.18)' }} />
                <p style={{
                  color: c.desc, fontWeight: 700,
                  fontSize: 'clamp(9px,2.8vw,11px)',
                  margin: 0, lineHeight: 1.5,
                  whiteSpace: 'pre-line', flex: 1,
                }}>
                  {day7.line}
                </p>
                {claiming && isToday && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 7,
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>...</span>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

      </div>{/* end gold container */}

      {/* Claimed message */}
      {claimed && (
        <p style={{
          color: '#88ee44', textAlign: 'center',
          fontWeight: 700, fontSize: 11,
          margin: '8px 0 0',
        }}>
          Бонус получен! Возвращайся завтра.
        </p>
      )}

    </div>
  )
}

export default DailyBonus