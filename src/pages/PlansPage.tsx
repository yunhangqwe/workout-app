import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { WorkoutType } from '../types'

const filters: { id: WorkoutType | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'strength', label: '力量' },
  { id: 'cardio', label: '有氧' },
  { id: 'flexibility', label: '拉伸' },
]

export function PlansPage() {
  const plans = useStore((s) => s.plans)
  const setSelectedPlanId = useStore((s) => s.setSelectedPlanId)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const [filter, setFilter] = useState<WorkoutType | 'all'>('all')

  const filtered =
    filter === 'all' ? plans : plans.filter((p) => p.type === filter)

  const openPlan = (id: string) => {
    setSelectedPlanId(id)
  }

  const selectedPlanId = useStore((s) => s.selectedPlanId)

  return (
    <div className="min-h-full pb-28 px-5 pt-6 safe-top">
      <header className="flex items-center justify-between mb-5">
        <h1 className="text-[32px] font-bold text-[#1c1c1e] tracking-tight">
          训练计划
        </h1>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab('profile')}
          aria-label="新建训练"
          className="w-10 h-10 rounded-full bg-[#007aff] text-white flex items-center justify-center shadow-float"
        >
          <Plus size={22} />
        </motion.button>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                active ? 'text-white' : 'text-[#6b6b70] bg-white'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-[#1c1c1e] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {filtered.map((plan) => (
            <motion.button
              key={plan.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPlan(plan.id)}
              className="w-full text-left bg-white rounded-[20px] p-4 shadow-card flex items-center"
            >
              <div
                className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0"
                style={{ background: `${plan.color}14` }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-bold text-[#1c1c1e] text-lg truncate">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#9e9ea4] mt-0.5">
                  {typeLabel(plan.type)} · {plan.duration} 分钟 ·{' '}
                  {plan.exercises.length} 个动作
                </p>
              </div>
              <ChevronRight size={20} className="text-[#c7c7cc]" />
            </motion.button>
          ))}
        </div>
      </AnimatePresence>

      {selectedPlanId && <PlanDetailModal />}
    </div>
  )
}

function PlanDetailModal() {
  const selectedPlanId = useStore((s) => s.selectedPlanId)
  const setSelectedPlanId = useStore((s) => s.setSelectedPlanId)
  const plans = useStore((s) => s.plans)
  const addRecord = useStore((s) => s.addRecord)
  const setActiveTab = useStore((s) => s.setActiveTab)

  const plan = plans.find((p) => p.id === selectedPlanId)
  if (!plan) return null

  const handleComplete = () => {
    addRecord({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      planId: plan.id,
      planName: plan.name,
      type: plan.type,
      duration: plan.duration * 60,
      completed: true,
      completedAt: Date.now(),
    })
    setSelectedPlanId(null)
    setActiveTab('records')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center"
    >
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={() => setSelectedPlanId(null)}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-[480px] bg-[#f5f5f7] rounded-t-[32px] max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#f5f5f7] pt-4 pb-3 px-6 z-10">
          <div className="w-10 h-1 bg-[#c7c7cc] rounded-full mx-auto mb-4" />
          <div className="flex items-start justify-between">
            <div>
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2"
                style={{
                  background: `${plan.color}18`,
                  color: plan.color,
                }}
              >
                {typeLabel(plan.type)}
              </span>
              <h2 className="text-2xl font-bold text-[#1c1c1e]">
                {plan.name}
              </h2>
              <p className="text-sm text-[#6b6b70] mt-1">
                {plan.description} · {plan.duration} 分钟
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-28 space-y-3">
          {plan.exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[18px] p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f2f2f7] flex items-center justify-center text-sm font-bold text-[#9e9ea4]">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-[#1c1c1e]">{exercise.name}</h3>
                </div>
                <span className="text-xs text-[#6b6b70] font-medium">
                  {exercise.sets ? `${exercise.sets} 组` : ''}
                </span>
              </div>
              <div className="flex gap-3 mt-3 text-xs text-[#9e9ea4]">
                {exercise.reps && (
                  <span className="bg-[#f2f2f7] px-2.5 py-1 rounded-lg">
                    {exercise.reps}
                  </span>
                )}
                {exercise.duration && (
                  <span className="bg-[#f2f2f7] px-2.5 py-1 rounded-lg">
                    {exercise.duration} 秒
                  </span>
                )}
                {exercise.rest && (
                  <span className="bg-[#f2f2f7] px-2.5 py-1 rounded-lg">
                    休息 {exercise.rest} 秒
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 flex justify-center safe-bottom">
          <div className="w-full max-w-[480px] px-6 pb-6 pt-3 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7] to-transparent">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleComplete}
              className="w-full py-4 rounded-[18px] font-bold text-white text-base shadow-float"
              style={{ background: plan.color }}
            >
              完成打卡
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function typeLabel(type: string) {
  switch (type) {
    case 'strength':
      return '力量训练'
    case 'cardio':
      return '有氧运动'
    case 'flexibility':
      return '拉伸瑜伽'
    default:
      return '训练'
  }
}
