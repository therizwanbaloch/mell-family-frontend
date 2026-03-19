import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearActionError } from '../redux/gameSlice'

// Assets
import pageBg    from '../assets/page1bg.webp'
import logoDark  from "../assets/logo-darkk.webp" 
import faIcon    from '../assets/page22Images/fa-icon.webp'
import taskIcon1 from '../assets/page22Images/task-icon.webp'
import taskIcon2 from '../assets/page22Images/task-icon.webp'
import taskIcon3 from '../assets/page22Images/task-icon.webp'

// Components
import SnackBar   from '../components/SnackBar'
import BetonCard  from '../components/BetonCard'
import DailyBonus from '../components/DailyBonus'

const Toast = ({ message, type, onClose }) => {
  if (!message) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, borderRadius: 8, padding: '6px 12px',
        background: type === 'error' ? 'linear-gradient(135deg,#dd1010,#aa0000)' : 'linear-gradient(135deg,#2a8a10,#1a6008)',
        color: '#fff', fontWeight: 900, fontSize: 10, textAlign: 'center', cursor: 'pointer',
      }}
    >
      {message}
    </div>
  )
}

const TaskRow = ({ label, reward, icon, taskState, onClick }) => {
  const isDone = taskState === 'done'
  const isLoading = taskState === 'loading'

  return (
    <div
      onClick={!isDone && !isLoading ? onClick : undefined}
      style={{
        display: 'flex', alignItems: 'stretch', borderRadius: 8, overflow: 'hidden',
        marginBottom: 4, border: isDone ? '1px solid #2a7008' : '1.5px solid #4a8010',
        height: 44, opacity: isDone ? 0.8 : 1,
      }}
    >
      <div style={{ width: 44, flexShrink: 0, background: '#b09878', position: 'relative' }}>
        <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ flex: 1, background: isDone ? '#1a4008' : 'linear-gradient(180deg,#4a8a18,#2e5c08)', padding: '0 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontWeight: 900, fontSize: '11.5px', margin: 0, lineHeight: 1 }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <img src={faIcon} alt="" style={{ width: 11, height: 11 }} />
          <span style={{ color: '#c8e840', fontWeight: 800, fontSize: '9.5px' }}>+{reward}</span>
        </div>
      </div>

      <div style={{ width: 32, flexShrink: 0, background: isDone ? '#1a5008' : '#3a3a3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isLoading ? <span style={{ color: '#ccc', fontSize: 9 }}>...</span> : isDone ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#88ee44" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
    </div>
  )
}

const Page22 = () => {
  const dispatch = useDispatch()
  const [toast, setToast] = useState(null)
  const [taskStates, setTaskStates] = useState({})

  const clearToast = () => { setToast(null); dispatch(clearActionError()) }

  const handleTask = async (task) => {
    if (taskStates[task.id] === 'done' || taskStates[task.id] === 'loading') return
    window.open(task.url, '_blank')
    setTaskStates(prev => ({ ...prev, [task.id]: 'loading' }))
    await new Promise(r => setTimeout(r, 2000))
    setTaskStates(prev => ({ ...prev, [task.id]: 'done' }))
    setToast({ message: 'Награда получена!', type: 'success' })
  }

  return (
    <div style={{
      backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
      maxWidth: 412, margin: '0 auto', height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', fontFamily: "'Nunito', sans-serif",
    }}>
      <Toast message={toast?.message} type={toast?.type} onClose={clearToast} />

      {/* ── HEADER ── */}
      <div style={{ background: "#dbdbdb", padding: "4px 0", flexShrink: 0 }}>
        <div style={{ width: 130, height: 28, position: "relative", margin: "0 auto" }}>
          <img src={logoDark} alt="Logo" style={{ position: "absolute", width: 210, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        </div>
        <div style={{ textAlign: "center", marginTop: "0px" }}>
          <span style={{ 
            fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', 
            fontSize: "18px", color: "#6ade10", WebkitTextStroke: "1px #1e6000", lineHeight: 1
          }}> БОНУСЫ </span>
        </div>
      </div>

      {/* ── SCROLLABLE BODY (Now scaled 0.98 for that 2% shrink) ── */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '0 6px',
        transform: 'scale(0.98)', 
        transformOrigin: 'top center' 
      }} className="scrollbar-hide">
        
        <BetonCard />
        
        <div style={{ marginTop: '-4px' }}>
           <DailyBonus />
        </div>

        {/* TASKS SECTION */}
        <div style={{ 
            background: 'linear-gradient(180deg,#5c4400,#3c2c00)', 
            borderRadius: 10, 
            overflow: 'hidden',
            border: '2px solid #372505',
            marginTop: '4px',
            marginBottom: '80px' 
        }}>
          <div style={{ background: '#cc1a1a', textAlign: 'center', padding: '3px 0' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '10px', letterSpacing: '0.05em' }}>ЗАДАНИЯ</span>
          </div>
          <div style={{ padding: '6px 5px' }}>
            {[
              { id: 'task_1', label: 'Подпишись на шляпbet', reward: '100m', icon: taskIcon1, url: 'https://t.me/shlypabet' },
              { id: 'task_2', label: 'Подпишись na shlypabet', reward: '100m', icon: taskIcon2, url: 'https://t.me/shlypabet2' },
              { id: 'task_3', label: 'Podpishis na kanal', reward: '100m', icon: taskIcon3, url: 'https://t.me/shlypabet3' },
            ].map((task) => (
              <TaskRow key={task.id} {...task} taskState={taskStates[task.id] || 'idle'} onClick={() => handleTask(task)} />
            ))}
          </div>
        </div>
      </div>

      <SnackBar activeTab={4} />
    </div>
  )
}

export default Page22;