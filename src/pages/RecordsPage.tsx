import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useStore } from '../store/useStore'
import { formatDateFriendly, formatDuration, getWeekDates, getWeekdayLabel } from '../utils/date'

export function RecordsPage() {
  const records = useStore((s) => s.records)

  const weekDates = getWeekDates()
  const weekData = useMemo(
    () =>
      weekDates.map((date) => {
        const dayRecords = records.filter((r) => r.date === date && r.completed)
        const minutes = dayRecords.reduce((sum, r) => sum + r.duration / 60, 0)
        return {
          date,
          label: getWeekdayLabel(date),
          minutes: Math.round(minutes),
        }
      }),
    [records, weekDates]
  )

  const totalWorkouts = records.filter((r) => r.completed).length
  const totalMinutes = Math.round(
    records.filter((r) => r.completed).reduce((sum, r) => sum + r.duration / 60, 0)
  )

  const groupedRecords = useMemo(() => {
    const map = new Map<string, typeof records>()
    for (const record of records) {
      if (!map.has(record.date)) map.set(record.date, [])
      map.get(record.date)!.push(record)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [records])

  return (
    <div className="min-h-full pb-28 px-5 pt-6 safe-top">
      <header className="mb-6">
        <h1 className="text-[32px] font-bold text-[#1c1c1e] tracking-tight">
          打卡记录
        </h1>
      </header>

      <section className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-[20px] p-4 shadow-card">
          <p className="text-[#9e9ea4] text-xs font-medium">累计训练</p>
          <p className="text-2xl font-bold text-[#1c1c1e] mt-0.5">
            {totalWorkouts} <span className="text-sm font-medium text-[#6b6b70]">次</span>
          </p>
        </div>
        <div className="bg-white rounded-[20px] p-4 shadow-card">
          <p className="text-[#9e9ea4] text-xs font-medium">累计时长</p>
          <p className="text-2xl font-bold text-[#1c1c1e] mt-0.5">
            {totalMinutes} <span className="text-sm font-medium text-[#6b6b70]">分</span>
          </p>
        </div>
      </section>

      <section className="bg-white rounded-[24px] p-5 shadow-card mb-6">
        <h2 className="text-lg font-bold text-[#1c1c1e] mb-4">本周运动时长</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} barSize={18}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9e9ea4', fontSize: 12 }}
                dy={8}
              />
              <YAxis hide />
              <Bar dataKey="minutes" radius={[8, 8, 8, 8]}>
                {weekData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.minutes > 0 ? '#007aff' : '#e5e5ea'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#1c1c1e] mb-3">历史记录</h2>
        {groupedRecords.length === 0 ? (
          <div className="bg-white rounded-[20px] p-8 shadow-card text-center">
            <p className="text-[#9e9ea4] text-sm">还没有打卡记录</p>
            <p className="text-[#c7c7cc] text-xs mt-1">完成一次训练即可看到记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedRecords.map(([date, dayRecords]) => (
              <div key={date}>
                <h3 className="text-sm font-bold text-[#9e9ea4] mb-2 ml-1">
                  {formatDateFriendly(date)}
                </h3>
                <div className="space-y-2">
                  {dayRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[18px] p-4 shadow-card flex items-center"
                    >
                      <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                        style={{ background: typeColor(record.type) + '18' }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: typeColor(record.type) }}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-bold text-[#1c1c1e]">{record.planName}</p>
                        <p className="text-xs text-[#9e9ea4] mt-0.5">
                          {formatDuration(record.duration)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#34c759]">已完成</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function typeColor(type: string) {
  switch (type) {
    case 'strength':
      return '#ff2d55'
    case 'cardio':
      return '#ff9500'
    case 'flexibility':
      return '#5856d6'
    default:
      return '#007aff'
  }
}
