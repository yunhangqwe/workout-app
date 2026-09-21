import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, Timer as TimerIcon, Watch } from 'lucide-react'
import { useTimer } from '../hooks/useTimer'
import { formatTime } from '../utils/date'

type Mode = 'countdown' | 'stopwatch'

const presets = [30, 60, 90, 120, 180, 300]

export function TimerPage() {
  const [mode, setMode] = useState<Mode>('countdown')
  const [duration, setDuration] = useState(60)
  const { seconds, isRunning, start, pause, reset, setDuration: setTimerDuration } = useTimer({
    initialSeconds: duration,
    mode,
  })

  const progress = mode === 'countdown' ? seconds / duration : 1

  const changeMode = (m: Mode) => {
    setMode(m)
    const newDuration = m === 'countdown' ? 60 : 0
    setDuration(newDuration)
    setTimerDuration(newDuration)
    reset(newDuration)
  }

  const applyPreset = (s: number) => {
    setDuration(s)
    setTimerDuration(s)
    reset(s)
  }

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="min-h-full pb-28 px-5 pt-6 safe-top flex flex-col">
      <header className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1c1c1e] tracking-tight">
          计时器
        </h1>
      </header>

      <div className="flex p-1 bg-white rounded-[16px] shadow-card mb-8">
        <button
          type="button"
          onClick={() => changeMode('countdown')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            mode === 'countdown' ? 'bg-[#1c1c1e] text-white' : 'text-[#6b6b70]'
          }`}
        >
          <TimerIcon size={16} />
          倒计时
        </button>
        <button
          type="button"
          onClick={() => changeMode('stopwatch')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-sm font-semibold transition-colors ${
            mode === 'stopwatch' ? 'bg-[#1c1c1e] text-white' : 'text-[#6b6b70]'
          }`}
        >
          <Watch size={16} />
          正计时
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mb-8">
        <div className="relative w-[280px] h-[280px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 264 264">
            <circle
              cx="132"
              cy="132"
              r="120"
              fill="none"
              stroke="#e5e5ea"
              strokeWidth="10"
            />
            <motion.circle
              cx="132"
              cy="132"
              r="120"
              fill="none"
              stroke="#007aff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={mode + seconds}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold text-[#1c1c1e] tabular-nums tracking-tight"
            >
              {formatTime(seconds)}
            </motion.div>
            <p className="text-sm text-[#9e9ea4] mt-2 font-medium">
              {isRunning ? '进行中' : '已暂停'}
            </p>
          </div>
        </div>
      </div>

      {mode === 'countdown' && !isRunning && (
        <div className="mb-6">
          <p className="text-xs text-[#9e9ea4] font-medium mb-2">快速选择</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {presets.map((s) => (
              <button
                key={s}
                onClick={() => applyPreset(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  duration === s
                    ? 'bg-[#007aff] text-white'
                    : 'bg-white text-[#6b6b70] shadow-card'
                }`}
              >
                {s < 60 ? `${s}秒` : `${s / 60}分`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-5">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => reset(duration)}
          aria-label="重置"
          className="w-16 h-16 rounded-full bg-white shadow-card flex items-center justify-center text-[#6b6b70]"
        >
          <RotateCcw size={24} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? pause : start}
          aria-label={isRunning ? '暂停' : '开始'}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-float ${
            isRunning ? 'bg-[#ff9500]' : 'bg-[#007aff]'
          }`}
        >
          {isRunning ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
        </motion.button>
      </div>
    </div>
  )
}
