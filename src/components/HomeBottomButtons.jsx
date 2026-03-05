import React from 'react'
import { BsLightningChargeFill } from 'react-icons/bs'

const HomeBottomButtons = () => {
  return (
    <div className='w-[92%] mx-auto flex flex-col gap-2 pb-4 mt-5'>

      {/* Timer div */}
      <div
        className='px-4 py-2 rounded-xl'
        style={{
          width: 'fit-content',
          background: 'linear-gradient(180deg, #f0a800 0%, #da9d01 50%, #b87e00 100%)',
          border: '2px solid #b58030',
          boxShadow: '0 5px 0 #7a4e00, 0 7px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
      >
        <h2
          className='font-black uppercase leading-tight'
          style={{
            fontSize: 'clamp(10px, 3vw, 14px)',
            color: '#412c05',
            textShadow: '0 1px 0 rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          УСПЕЙ <br />ПОБЕДИТЬ!
        </h2>
        <h3
          className='font-black'
          style={{
            fontSize: 'clamp(16px, 5vw, 22px)',
            color: '#000000',
          }}
        >
          02:19:54
        </h3>
      </div>

      {/* DIV 2 — Circle attached to green + Button */}
      <div className='flex items-center gap-2'>

        {/* Yellow Circle + Green bar attached together */}
        <div className='flex-1 flex items-center min-w-0'>

          {/* Yellow Lightning Circle */}
          <div
            className='flex-shrink-0 rounded-full flex items-center justify-center z-10 -mr-3'
            style={{
              width: 'clamp(34px, 9vw, 42px)',
              height: 'clamp(34px, 9vw, 42px)',
              background: 'linear-gradient(180deg, #ffe033 0%, #FFD700 100%)',
              border: '2px solid #b58030',
              boxShadow: '0 4px 0 #7a4e00, 0 6px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <BsLightningChargeFill
              style={{ fontSize: 'clamp(14px, 4vw, 20px)' }}
              color='#000000'
            />
          </div>

          {/* Green 1000/1000 bar */}
          <div
            className='flex-1 flex items-center justify-center rounded-xl'
            style={{
              paddingLeft: 'clamp(18px, 5vw, 24px)',
              paddingRight: 'clamp(8px, 3vw, 14px)',
              paddingTop: 'clamp(6px, 2vw, 10px)',
              paddingBottom: 'clamp(6px, 2vw, 10px)',
              background: 'linear-gradient(180deg, #53a00d 0%, #0ab621 100%)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 0 #1a5c00, 0 6px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <span
              className='font-black'
              style={{
                fontSize: 'clamp(11px, 3.5vw, 15px)',
                color: '#2c3d13',
                textShadow: '0 1px 0 rgba(255,255,255,0.15)',
                whiteSpace: 'nowrap',
              }}
            >
              1000/1000
            </span>
          </div>

        </div>

        {/* УЛУЧШАЙ Button */}
        <button
          className='flex-shrink-0 rounded-xl font-black uppercase tracking-wide active:scale-95 transition-transform'
          style={{
            paddingLeft: 'clamp(10px, 3vw, 18px)',
            paddingRight: 'clamp(10px, 3vw, 18px)',
            paddingTop: 'clamp(6px, 2vw, 10px)',
            paddingBottom: 'clamp(6px, 2vw, 10px)',
            fontSize: 'clamp(10px, 3vw, 14px)',
            background: 'linear-gradient(180deg, #f0a800 0%, #da9d01 50%, #b87e00 100%)',
            border: '2px solid #b58030',
            boxShadow: '0 5px 0 #7a4e00, 0 7px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
            color: '#412c05',
            textShadow: '0 1px 0 rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          УЛУЧШАЙ
        </button>

      </div>

    </div>
  )
}

export default HomeBottomButtons