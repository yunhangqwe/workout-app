import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Clock, Dumbbell, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Exercise, WorkoutType } from '../types'

const typeOptions: { id: WorkoutType; label: string; color: string }[] = [
  { id: 'strength', label: '力量训练', color: '#ff2d55' },
  { id: 'cardio', label: '有氧运动', color: '#ff9500' },
  { id: 'flexibility', label: '拉伸瑜伽', color: '#5856d6' },
]

export function ProfilePage() {
  const reminder = useStore((s) => s.reminder)
  const setReminder = useStore((s) => s.setReminder)
  const plans = useStore((s) => s.plans)
  const customPlans = useMemo(() => plans.filter((p) => p.isCustom), [plans])
  const deletePlan = useStore((s) => s.deletePlan)
  const setSelectedPlanId = useStore((s) => s.setSelectedPlanId)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const [showBuilder, setShowBuilder] = useState(false)

  const openPlan = (id: string) => {
    setSelectedPlanId(id)
    setActiveTab('plans')
  }

  return (
    <div className="min-h-full pb-28 px-5 pt-6 safe-top">
      <header className="mb-6">
        <h1 className="text-[32px] font-bold text-[#1c1c1e] tracking-tight">
          我的
        </h1>
      </header>

      <section className="bg-white rounded-[24px] p-5 shadow-card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(0,122,255,0.12)] flex items-center justify-center">
              <Bell size={20} className="text-[#007aff]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1c1c1e]">每日提醒</h3>
              <p className="text-xs text-[#9e9ea4]">
                {reminder.enabled ? `每天 ${reminder.time}` : '未开启'}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reminder.enabled}
            aria-label="每日提醒开关"
            onClick={() => setReminder({ ...reminder, enabled: !reminder.enabled })}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              reminder.enabled ? 'bg-[#34c759]' : 'bg-[#e5e5ea]'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: reminder.enabled ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <AnimatePresence>
          {reminder.enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 pt-3 border-t border-[rgba(120,120,128,0.16)]">
                <Clock size={18} className="text-[#9e9ea4]" />
                <input
                  type="time"
                  value={reminder.time}
                  onChange={(e) => setReminder({ ...reminder, time: e.target.value })}
                  className="flex-1 bg-transparent text-[#1c1c1e] font-semibold text-lg outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="bg-white rounded-[24px] p-5 shadow-card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(255,45,85,0.12)] flex items-center justify-center">
              <Dumbbell size={20} className="text-[#ff2d55]" />
            </div>
            <h3 className="font-bold text-[#1c1c1e]">自定义训练</h3>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowBuilder(true)}
            className="w-9 h-9 rounded-full bg-[#007aff] text-white flex items-center justify-center"
          >
            <Plus size={18} />
          </motion.button>
        </div>

        {customPlans.length === 0 ? (
          <p className="text-sm text-[#9e9ea4] text-center py-4">
            还没有自定义训练
          </p>
        ) : (
          <div className="space-y-2">
            {customPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-3 rounded-[14px] bg-[#f2f2f7]"
              >
                <button
                  onClick={() => openPlan(plan.id)}
                  className="flex-1 text-left"
                >
                  <p className="font-bold text-[#1c1c1e]">{plan.name}</p>
                  <p className="text-xs text-[#9e9ea4]">
                    {plan.exercises.length} 个动作 · {plan.duration} 分钟
                  </p>
                </button>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="p-2 text-[#ff3b30]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-[24px] p-5 shadow-card">
        <h3 className="font-bold text-[#1c1c1e] mb-3">关于</h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-[#6b6b70]">版本</span>
            <span className="text-[#9e9ea4]">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-[#6b6b70]">数据存储</span>
            <span className="text-[#9e9ea4]">本地</span>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showBuilder && (
          <PlanBuilder onClose={() => setShowBuilder(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function PlanBuilder({ onClose }: { onClose: () => void }) {
  const addPlan = useStore((s) => s.addPlan)
  const [name, setName] = useState('')
  const [type, setType] = useState<WorkoutType>('strength')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: crypto.randomUUID(),
        name: '',
        sets: 3,
        reps: '10 次',
        duration: 0,
        rest: 30,
      },
    ])
  }

  const updateExercise = (id: string, patch: Partial<Exercise>) => {
    setExercises(exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((e) => e.id !== id))
  }

  const duration = Math.max(
    1,
    Math.round(
      exercises.reduce((sum, e) => {
        const active = (e.duration || 0) * (e.sets || 1)
        const rest = (e.rest || 0) * Math.max(0, (e.sets || 1) - 1)
        return sum + active + rest
      }, 0) / 60
    )
  )

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return
    const color = typeOptions.find((t) => t.id === type)?.color || '#007aff'
    addPlan({
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      description: description.trim() || '自定义训练计划',
      duration,
      color,
      exercises: exercises.map((e) => ({
        ...e,
        name: e.name.trim() || '未命名动作',
      })),
      isCustom: true,
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center"
    >
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-[480px] bg-[#f5f5f7] rounded-t-[32px] max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#f5f5f7] pt-4 pb-3 px-6 z-10">
          <div className="w-10 h-1 bg-[#c7c7cc] rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1c1c1e]">新建训练</h2>
            <button onClick={onClose} className="text-[#9e9ea4] text-sm font-medium">
              取消
            </button>
          </div>
        </div>

        <div className="px-6 pb-28 space-y-5">
          <div className="bg-white rounded-[18px] p-4 shadow-card">
            <label htmlFor="plan-name" className="block text-xs text-[#9e9ea4] font-medium mb-1.5">名称</label>
            <input
              id="plan-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：居家燃脂"
              className="w-full bg-transparent text-[#1c1c1e] font-semibold text-lg outline-none placeholder:text-[#c7c7cc]"
            />
          </div>

          <div className="bg-white rounded-[18px] p-4 shadow-card">
            <label className="block text-xs text-[#9e9ea4] font-medium mb-2">类型</label>
            <div className="flex gap-2 flex-wrap">
              {typeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    type === t.id ? 'text-white' : 'text-[#6b6b70] bg-[#f2f2f7]'
                  }`}
                  style={type === t.id ? { background: t.color } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[18px] p-4 shadow-card">
            <label htmlFor="plan-desc" className="block text-xs text-[#9e9ea4] font-medium mb-1.5">简介</label>
            <input
              id="plan-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述这个训练"
              className="w-full bg-transparent text-[#1c1c1e] font-medium outline-none placeholder:text-[#c7c7cc]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#1c1c1e]">动作</h3>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={addExercise}
                className="flex items-center gap-1 text-sm font-semibold text-[#007aff]"
              >
                <Plus size={16} /> 添加
              </motion.button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[18px] p-4 shadow-card"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#f2f2f7] text-xs font-bold text-[#9e9ea4] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, { name: e.target.value })}
                      placeholder="动作名称"
                      className="flex-1 bg-transparent font-bold text-[#1c1c1e] outline-none placeholder:text-[#c7c7cc]"
                    />
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      aria-label={`删除动作 ${index + 1}`}
                      className="text-[#ff3b30] p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#f2f2f7] rounded-xl px-3 py-2">
                      <label htmlFor={`sets-${exercise.id}`} className="block text-[10px] text-[#9e9ea4]">组数</label>
                      <input
                        id={`sets-${exercise.id}`}
                        type="number"
                        min={1}
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, { sets: Number(e.target.value) })}
                        className="w-full bg-transparent font-semibold text-[#1c1c1e] outline-none"
                      />
                    </div>
                    <div className="bg-[#f2f2f7] rounded-xl px-3 py-2">
                      <label htmlFor={`reps-${exercise.id}`} className="block text-[10px] text-[#9e9ea4]">次数</label>
                      <input
                        id={`reps-${exercise.id}`}
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, { reps: e.target.value })}
                        placeholder="10 次"
                        className="w-full bg-transparent font-semibold text-[#1c1c1e] outline-none"
                      />
                    </div>
                    <div className="bg-[#f2f2f7] rounded-xl px-3 py-2">
                      <label htmlFor={`rest-${exercise.id}`} className="block text-[10px] text-[#9e9ea4]">休息(秒)</label>
                      <input
                        id={`rest-${exercise.id}`}
                        type="number"
                        min={0}
                        value={exercise.rest}
                        onChange={(e) => updateExercise(exercise.id, { rest: Number(e.target.value) })}
                        className="w-full bg-transparent font-semibold text-[#1c1c1e] outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#9e9ea4] text-center">
            预计时长：{duration} 分钟
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 flex justify-center safe-bottom">
          <div className="w-full max-w-[480px] px-6 pb-6 pt-3 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7] to-transparent">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={!name.trim() || exercises.length === 0}
              className="w-full py-4 rounded-[18px] font-bold text-white text-base shadow-float bg-[#007aff] disabled:opacity-40 disabled:shadow-none"
            >
              保存训练
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
