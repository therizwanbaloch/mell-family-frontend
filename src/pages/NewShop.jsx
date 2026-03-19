import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearActionError } from '../redux/gameSlice'

// Assets
import pageBg    from '../assets/page1bg.webp'
import logoDark  from "../assets/logo-darkk.webp" // Logo from Page 20
import faIcon    from '../assets/page22Images/fa-icon.webp'
import taskIcon1 from '../assets/page22Images/task-icon.webp'
import taskIcon2 from '../assets/page22Images/task-icon.webp'
import taskIcon3 from '../assets/page22Images/task-icon.webp'

// Components
import SnackBar   from '../components/SnackBar'
import BetonCard  from '../components/BetonCard'
import DailyBonus from '../components/DailyBonus'

// ── Toast Component ──────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  if (!message) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, borderRadius: 10, padding: '10px 16px',
        background: type === 'error'
          ? 'linear-gradient(135deg,#dd1010,#aa0000)'
          : 'linear-gradient(135deg,#2a8a10,#1a6008)',
        border: type === 'error' ? '2px solid #ff4444' : '2px solid #5aba20',
        color: '#fff', fontWeight: 900, fontSize: 12, maxWidth: 280,
        textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  )
}

const TelegramIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.265 2.428a1.5 1.5 0 0 0-1.528-.234L2.117 9.686a1.5 1.5 0 0 0 .09 2.793l4.293 1.43 1.997 5.988a1.5 1.5 0 0 0 2.563.492l2.35-2.787 4.622 3.396a1.5 1.5 0 0 0 2.33-.937l2.999-16.5a1.5 1.5 0 0 0-.096-.133z"/>
  </svg>
)

const TaskRow = ({ label, reward, icon, taskState, onClick }) => {
  const isDone    = taskState === 'done'
  const isLoading = taskState === 'loading'

  return (
    <div
      onClick={!isDone && !isLoading ? onClick : undefined}
      style={{
        display: 'flex', alignItems: 'stretch',
        borderRadius: 12, overflow: 'hidden',
        marginBottom: 6,
        border: isDone ? '2px solid #2a7008' : '2px solid #4a8010',
        boxShadow: isDone
          ? '0 3px 0 #1a4a04'
          : '0 3px 0 #2a5004, 0 2px 10px rgba(0,0,0,0.5)',
        cursor: isDone || isLoading ? 'default' : 'pointer',
        opacity: isDone ? 0.8 : 1,
      }}
    >
      <div style={{ width: 56, flexShrink: 0, background: '#b09878', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 4, left: 4, background: '#2aabee', borderRadius: 4, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TelegramIcon />
        </div>
      </div>

      <div style={{ flex: 1, background: isDone ? 'linear-gradient(180deg,#2a6010,#1a4008)' : 'linear-gradient(180deg,#4a8a18,#2e5c08)', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        <p style={{ color: '#fff', fontWeight: 900, fontSize: '14px', margin: 0 }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <img src={faIcon} alt="" style={{ width: 14, height: 14, borderRadius: '50%' }} />
          <span style={{ color: '#c8e840', fontWeight: 800, fontSize: '12px' }}>+{reward}</span>
        </div>
      </div>

      <div style={{ width: 44, flexShrink: 0, background: isDone ? 'linear-gradient(180deg,#2a7008,#1a5008)' : 'linear-gradient(180deg,#5a5a5a,#3a3a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isLoading ? <span style={{ color: '#ccc', fontSize: 11 }}>...</span> : isDone ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#88ee44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
    </div>
  )
}

const TASKS = [
  { id: 'task_1', label: 'Подпишись на шляпbet', reward: '100m', icon: taskIcon1, url: 'https://t.me/shlypabet', storeKey: 'task_shlypabet_1' },
  { id: 'task_2', label: 'Подпишись na shlypabet', reward: '100m', icon: taskIcon2, url: 'https://t.me/shlypabet2', storeKey: 'task_shlypabet_2' },
  { id: 'task_3', label: 'Podpishis na kanal', reward: '100m', icon: taskIcon3, url: 'https://t.me/shlypabet3', storeKey: 'task_shlypabet_3' },
]

const Page22 = () => {
  const dispatch = useDispatch()
  const [toast, setToast] = useState(null)
  const [taskStates, setTaskStates] = useState({})

  const clearToast = () => { setToast(null); dispatch(clearActionError()) }

  const handleTask = async (task) => {
    if (taskStates[task.id] === 'done' || taskStates[task.id] === 'loading') return
    window.open(task.url, '_blank')
    setTaskStates(prev => ({ ...prev, [task.id]: 'loading' }))
    await new Promise(r => setTimeout(r, 3000))
    setTaskStates(prev => ({ ...prev, [task.id]: 'done' }))
    setToast({ message: 'Награда получена!', type: 'success' })
  }

  return (
    <div style={{
      backgroundImage: `url(${pageBg})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      maxWidth: 430, margin: '0 auto', height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', fontFamily: "'Nunito', sans-serif",
    }}>
      <Toast message={toast?.message} type={toast?.type} onClose={clearToast} />

      {/* ── HEADER (Same as Page 20) ── */}
      <div style={{ background: "#dbdbdb", padding: "16px 16px 12px", flexShrink: 0 }}>
        <div style={{ width: 160, height: 41, position: "relative", margin: "0 auto" }}>
          <img 
            src={logoDark} 
            alt="Logo" 
            style={{ position: "absolute", width: 266, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} 
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <span 
            style={{ 
              fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', 
              fontSize: "25px", color: "#6ade10", letterSpacing: '0.05em',
              WebkitTextStroke: "1.2px #1e6000", textShadow: "0 2px 4px rgba(0,0,0,0.3)" 
            }}
          >
            БОНУСЫ
          </span>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px 100px' }} className="scrollbar-hide">
        <BetonCard />
        <DailyBonus onToast={setToast} />

        {/* TASKS SECTION */}
        <div style={{ background: 'linear-gradient(180deg,#5c4400,#3c2c00)', borderRadius: 10, overflow: 'hidden', marginTop: 10 }}>
          <div style={{ background: 'linear-gradient(180deg,#cc1a1a,#8a0808)', textAlign: 'center', padding: '6px 0' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '13px', letterSpacing: '0.1em' }}>ЗАДАНИЯ</span>
          </div>
          <div style={{ padding: '10px 8px' }}>
            {TASKS.map((task) => (
              <TaskRow key={task.id} label={task.label} reward={task.reward} icon={task.icon} taskState={taskStates[task.id] || 'idle'} onClick={() => handleTask(task)} />
            ))}
          </div>
        </div>
      </div>

      <SnackBar activeTab={4} />
    </div>
  )
}

export default Page22