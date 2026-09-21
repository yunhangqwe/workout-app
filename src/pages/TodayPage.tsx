import { motion } from 'framer-motion'
import { ChevronRight, Flame, Trophy } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatDate, formatDateFriendly } from '../utils/date'

export function TodayPage() {
  const plans = useStore((s) => s.plans)
  const records = useStore((s) => s.records)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const setSelectedPlanId = useStore((s) => s.setSelectedPlanId)

  const today = formatDate()
  const todayRecord = records.find((r) => r.date === today && r.completed)
  const streak = calculateStreak(records)

  const featured = plans[0]
  const suggestions = plans.slice(1, 4)

  const startPlan = (id: string) => {
    setSelectedPlanId(id)
    setActiveTab('plans')
  }

  return (
    <div className="min-h-full pb-28 px-5 pt-6 safe-top">
      <header className="mb-6">
        <p className="text-sm text-[#9e9ea4] font-medium">
          {formatDateFriendly(today)}
        </p>
        <h1 className="text-[32px] font-bold text-[#1c1c1e] tracking-tight mt-1">
          今天练什么？
        </h1>
      </header>

      <section className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="bg-white rounded-[20px] p-4 shadow-card"
        >
          <div className="w-9 h-9 rounded-full bg-[rgba(255,45,85,0.12)] flex items-center justify-center mb-3">
            <Flame size={18} className="text-[#ff2d55]" />
          </div>
          <p className="text-[#9e9ea4] text-xs font-medium">连续打卡</p>
          <p className="text-2xl font-bold text-[#1c1c1e] mt-0.5">
            {streak} <span className="text-sm font-medium text-[#6b6b70]">天</span>
          </p>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          className="bg-white rounded-[20px] p-4 shadow-card"
        >
          <div className="w-9 h-9 rounded-full bg-[rgba(0,122,255,0.12)] flex items-center justify-center mb-3">
            <Trophy size={18} className="text-[#007aff]" />
          </div>
          <p className="text-[#9e9ea4] text-xs font-medium">今日状态</p>
          <p className="text-2xl font-bold text-[#1c1c1e] mt-0.5">
            {todayRecord ? '已完成' : '待开始'}
          </p>
        </motion.div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold text-[#1c1c1e] mb-3">推荐训练</h2>
        {featured && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => startPlan(featured.id)}
            className="w-full text-left bg-white rounded-[24px] p-5 shadow-card relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 -mr-10 -mt-10"
              style={{ background: featured.color }}
            />
            <div className="relative z-10">
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: `${featured.color}18`,
                  color: featured.color,
                }}
              >
                {typeLabel(featured.type)}
              </span>
              <h3 className="text-2xl font-bold text-[#1c1c1e]">
                {featured.name}
              </h3>
              <p className="text-[#6b6b70] text-sm mt-1">
                {featured.description}
              </p>
              <div className="flex items-center mt-4 text-sm font-medium text-[#007aff]">
                开始训练 <ChevronRight size={16} className="ml-0.5" />
              </div>
            </div>
          </motion.button>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#1c1c1e] mb-3">更多选择</h2>
        <div className="space-y-3">
          {suggestions.map((plan) => (
            <motion.button
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => startPlan(plan.id)}
              className="w-full text-left bg-white rounded-[18px] p-4 shadow-card flex items-center"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: `${plan.color}15` }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-bold text-[#1c1c1e] truncate">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#9e9ea4] mt-0.5">
                  {typeLabel(plan.type)} · {plan.duration} 分钟
                </p>
              </div>
              <ChevronRight size={18} className="text-[#c7c7cc]" />
            </motion.button>
          ))}
        </div>
      </section>
    </div>
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

function calculateStreak(records: { date: string; completed: boolean }[]) {
  const completedDates = new Set(
    records.filter((r) => r.completed).map((r) => r.date)
  )
  let streak = 0
  const d = new Date()
  while (true) {
    const dateStr = formatDate(d)
    if (completedDates.has(dateStr)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else if (dateStr === formatDate() && streak === 0) {
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
