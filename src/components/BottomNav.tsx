import { motion } from 'framer-motion'
import { Calendar, Clock, Home, LayoutGrid, User } from 'lucide-react'
import type { Tab } from '../types'
import { useStore } from '../store/useStore'

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'today', label: '今日', icon: Home },
  { id: 'plans', label: '计划', icon: LayoutGrid },
  { id: 'timer', label: '计时器', icon: Clock },
  { id: 'records', label: '记录', icon: Calendar },
  { id: 'profile', label: '我的', icon: User },
]

export function BottomNav() {
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center safe-bottom">
      <div className="w-full max-w-[480px] bg-white/85 backdrop-blur-xl border-t border-[rgba(120,120,128,0.16)] px-2 pb-2 pt-2">
        <ul className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center justify-center px-3 py-1 min-w-[56px]"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 bg-[rgba(0,122,255,0.10)] rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive ? 'text-[#007aff]' : 'text-[#9e9ea4]'
                    }`}
                  />
                  <span
                    className={`relative z-10 text-[10px] mt-1 font-medium transition-colors duration-200 ${
                      isActive ? 'text-[#007aff]' : 'text-[#9e9ea4]'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
