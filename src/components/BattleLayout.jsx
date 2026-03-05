import React from 'react'
import layout1 from '../assets/layout1.webp';
import layout2 from '../assets/layout2.webp';
import layout3 from '../assets/layout3.webp';
import layout4 from '../assets/layout4.webp';
import layout5 from '../assets/layout5.webp';
import layout6 from '../assets/layout6.webp';
import layoutMain from '../assets/layoutMain.webp';

const BattleLayout = () => {
  return (
    <div className='flex flex-col justify-between h-full py-2'>

      {/* Main Layout */}
      <div className='flex items-center justify-between w-full px-4'>

        {/* Left Column */}
        <div className='flex flex-col items-center gap-3'>
          <div className='flex flex-col items-center gap-1'>
            <img src={layout1} alt='L1' className='w-12 h-12 rounded-xl object-cover' />
            <span className='text-white text-[10px] font-bold'>Турниры</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <img src={layout2} alt='L2' className='w-12 h-12 rounded-xl object-cover' />
            <span className='text-white text-[10px] font-bold'>Боксы</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <img src={layout3} alt='L3' className='w-12 h-12 rounded-xl object-cover' />
            <span className='text-white text-[10px] font-bold'>ПОДАРОК</span>
          </div>
        </div>

        {/* Center Main */}
        <div className='flex items-center justify-center'>
          <img src={layoutMain} alt='main' className='w-44 h-44 object-contain' />
        </div>

        {/* Right Column */}
        <div className='flex flex-col items-center gap-3'>
          <div className='flex flex-col items-center gap-1'>
            <img src={layout4} alt='R1' className='w-12 h-12 rounded-xl object-cover' />
            <span className='text-white text-[10px] font-bold'>Слоты</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <img src={layout5} alt='R2' className='w-12 h-12 rounded-xl object-cover' />
            <span className='text-white text-[10px] font-bold'>AVIator</span>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <img src={layout6} alt='R3' className='w-12 h-12 rounded-xl object-cover' />
            <span className='text-white text-[10px] font-bold'>Beton</span>
          </div>
        </div>

      </div>

    </div>
  )
}

export default BattleLayout